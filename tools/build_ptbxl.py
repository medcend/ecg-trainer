"""PTB-XL から12誘導の出題症例を選び、アプリ用のデータに変換する。

使い方:
    python build_ptbxl.py --meta ptbxl_database.csv --feat 12sl_features.csv \
        --raw <ダウンロード先> --out ../data

選ぶ条件:
    1. 人が確認済み（validated_by_human）で、ノイズや電極の問題の記載がない
    2. 目的の所見のラベルがある（診断ラベルは確からしさ 100 のみ）
    3. GE 12SL の自動計測値が診断基準と合う
"""
import argparse, ast, csv, json, os, sys, urllib.request

import numpy as np
import wfdb
import wfdb.processing
from scipy.signal import butter, filtfilt

BASE = "https://physionet.org/files/ptb-xl/1.0.3/"
LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]
PER_DX = 10

RHYTHM_CODES = {"SR", "AFIB", "STACH", "SARRH", "SBRAD", "PACE", "SVARR", "BIGU", "AFLT", "SVTAC", "PSVT", "TRIGU"}
MI_CODES = {"IMI", "ASMI", "ILMI", "AMI", "ALMI", "LMI", "IPLMI", "IPMI", "PMI"}
# 4級の症例では、目的の所見以外にこれらがあると紛らわしいので除く
MAJOR = {"AFIB", "AFLT", "PACE", "CRBBB", "CLBBB", "WPW", "LVH", "RVH", "3AVB", "2AVB", "1AVB",
         "LAFB", "LPFB", "LNGQT", "PVC", "PAC", "STACH", "SBRAD", "PSVT", "SVTAC", "BIGU", "TRIGU"} | MI_CODES


def num(f, k):
    v = f.get(k, "")
    try:
        return float(v)
    except ValueError:
        return None


def measures(f):
    m = {
        "hr": num(f, "HR__Global"),
        "pr": num(f, "PR_Int_Global"),
        "qrs": num(f, "QRS_Dur_Global"),
        "qt": num(f, "QT_Int_Global"),
        "qtc": num(f, "QT_IntCorr_Global"),
        "axis": num(f, "R_AxisFrontal_Global"),
        "hr_a": num(f, "HR_Atrial_Global"),
        "hr_v": num(f, "HR_Ventr_Global"),
    }
    sv1, rv5, rv6 = num(f, "S_Amp_V1"), num(f, "R_Amp_V5"), num(f, "R_Amp_V6")
    m["sokolow"] = round(abs(sv1) + max(rv5, rv6), 2) if None not in (sv1, rv5, rv6) else None
    return m


def ok(v, lo=None, hi=None):
    if v is None:
        return False
    return (lo is None or v >= lo) and (hi is None or v <= hi)


def only(c, target, allowed=()):
    """目的の所見以外に MAJOR の所見がない"""
    return not ((set(c) & MAJOR) - {target} - set(allowed))


def diag100(c, k):
    return c.get(k) == 100.0


# id -> (級, 判定関数)。判定関数は (scp_codes, 計測値, 行) を受け取る
DX = {
    "NORM": (4, lambda c, m, r: diag100(c, "NORM") and "SR" in c and set(c) <= {"NORM", "SR"}
             and ok(m["hr"], 60, 100) and ok(m["pr"], 120, 200) and ok(m["qrs"], None, 110)
             and ok(m["qtc"], None, 450) and ok(m["axis"], -30, 90)),
    "STACH": (4, lambda c, m, r: "STACH" in c and only(c, "STACH") and ok(m["hr"], 101) and ok(m["qrs"], None, 119)),
    "SBRAD": (4, lambda c, m, r: "SBRAD" in c and only(c, "SBRAD") and ok(m["hr"], None, 55) and ok(m["qrs"], None, 119)),
    "AFIB": (4, lambda c, m, r: "AFIB" in c and only(c, "AFIB") and ok(m["qrs"], None, 119)),
    "AFLT": (4, lambda c, m, r: "AFLT" in c and only(c, "AFLT") and ok(m["qrs"], None, 119)),
    "PAC": (4, lambda c, m, r: "PAC" in c and "SR" in c and only(c, "PAC")),
    "PVC": (4, lambda c, m, r: "PVC" in c and "SR" in c and only(c, "PVC")),
    "1AVB": (4, lambda c, m, r: diag100(c, "1AVB") and "SR" in c and only(c, "1AVB") and ok(m["pr"], 211)),
    "CRBBB": (3, lambda c, m, r: diag100(c, "CRBBB") and ok(m["qrs"], 120) and not set(c) & {"CLBBB", "PACE", "WPW"}),
    "CLBBB": (3, lambda c, m, r: diag100(c, "CLBBB") and ok(m["qrs"], 120) and not set(c) & {"CRBBB", "PACE", "WPW"}),
    "LAFB": (3, lambda c, m, r: diag100(c, "LAFB") and ok(m["axis"], -90, -45) and ok(m["qrs"], None, 119)
             and not set(c) & ({"CRBBB", "CLBBB", "PACE", "WPW"} | MI_CODES)),
    "LPFB": (3, lambda c, m, r: diag100(c, "LPFB") and ok(m["axis"], 90, 180) and ok(m["qrs"], None, 119)
             and not set(c) & {"RVH", "CRBBB", "CLBBB", "PACE", "WPW", "LMI", "ALMI"}),
    "LVH": (3, lambda c, m, r: diag100(c, "LVH") and ok(m["sokolow"], 3.5) and ok(m["qrs"], None, 119)
            and not set(c) & {"CLBBB", "CRBBB", "WPW", "PACE"}),
    "WPW": (3, lambda c, m, r: diag100(c, "WPW") and ok(m["pr"], None, 130) and "PACE" not in c),
    "PACE": (3, lambda c, m, r: "PACE" in c),
    # 完全房室ブロック：補充調律（60/分以下）で、心房レートが心室レートより明らかに速い記録だけ
    "3AVB": (4, lambda c, m, r: diag100(c, "3AVB") and "PACE" not in c and ok(m["hr_v"], None, 60)
             and ok(m["hr_a"]) and m["hr_a"] >= m["hr_v"] + 15),
    "LNGQT": (3, lambda c, m, r: diag100(c, "LNGQT") and ok(m["qtc"], 460) and ok(m["qrs"], None, 119)),
    "IMI": (3, lambda c, m, r: diag100(c, "IMI") and not (set(c) & MI_CODES) - {"IMI"} and ok(m["qrs"], None, 119)
            and "PACE" not in c),
    "ASMI": (3, lambda c, m, r: diag100(c, "ASMI") and not (set(c) & MI_CODES) - {"ASMI"} and ok(m["qrs"], None, 119)
             and "PACE" not in c),
}


def measured_present(m):
    """計測値から明らかに当てはまる所見（選択肢から外すため）"""
    p = set()
    if ok(m["hr"], 101): p.add("STACH")
    if ok(m["hr"], None, 59): p.add("SBRAD")
    if ok(m["pr"], 201): p.add("1AVB")
    if ok(m["axis"], -90, -45) and ok(m["qrs"], None, 119): p.add("LAFB")
    if ok(m["axis"], 90, 180) and ok(m["qrs"], None, 119): p.add("LPFB")
    if ok(m["sokolow"], 3.5): p.add("LVH")
    if ok(m["qtc"], 460): p.add("LNGQT")
    return p


def clean(r):
    return all(not r[k].strip() for k in ["baseline_drift", "static_noise", "burst_noise", "electrodes_problems"])


def fetch(rel, raw):
    for ext in (".hea", ".dat"):
        dst = os.path.join(raw, rel + ext)
        if os.path.exists(dst):
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        urllib.request.urlretrieve(BASE + rel + ext, dst)
    return os.path.join(raw, rel)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", required=True)
    ap.add_argument("--feat", required=True)
    ap.add_argument("--raw", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    feats = {}
    with open(a.feat, encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            feats[row["ecg_id"]] = row
    rows = list(csv.DictReader(open(a.meta, encoding="utf-8")))
    rows.sort(key=lambda r: (-int(r["strat_fold"]), int(r["ecg_id"])))

    chosen = {k: [] for k in DX}
    for r in rows:
        if r["validated_by_human"] != "True" or r["ecg_id"] not in feats:
            continue
        c = ast.literal_eval(r["scp_codes"])
        if not clean(r) and not ({"PAC", "PVC"} & set(c)):
            continue
        m = measures(feats[r["ecg_id"]])
        for k, (lvl, rule) in DX.items():
            if len(chosen[k]) < PER_DX and rule(c, m, r):
                chosen[k].append((r, c, m))
                break

    b, a_ = butter(2, 0.5 / 250, btype="highpass")
    os.makedirs(os.path.join(a.out, "ecg12"), exist_ok=True)
    print({k: len(v) for k, v in chosen.items()}, file=sys.stderr)
    cases = []
    for k, items in chosen.items():
        for r, c, m in items:
            path = fetch(r["filename_hr"], a.raw)
            rec = wfdb.rdrecord(path)
            names = [s.upper() for s in rec.sig_name]
            idx = [names.index(l.upper()) for l in LEADS]
            sig = rec.p_signal[:, idx].T  # mV, 12 x 5000
            sig = filtfilt(b, a_, sig, axis=1)
            uv = np.clip(np.round(sig * 1000), -32768, 32767).astype("<i2")
            uv.tofile(os.path.join(a.out, "ecg12", f"{r['ecg_id']}.bin"))
            try:
                qrs = wfdb.processing.xqrs_detect(sig[1], fs=500, verbose=False).tolist()
            except Exception:
                qrs = []
            present = {code for code in c} | measured_present(m)
            cases.append({
                "id": f"ptbxl-{r['ecg_id']}",
                "kind": "12lead",
                "level": DX[k][0],
                "answer": k,
                "present": sorted(present),
                "scp": {code: v for code, v in c.items()},
                "m": m,
                "age": None if not r["age"] else int(float(r["age"])) if float(r["age"]) < 89 else 89,
                "sex": "M" if r["sex"] == "0" else "F",
                "stage": r["infarction_stadium1"] or None,
                "fs": 500,
                "n": int(uv.shape[1]),
                "file": f"ecg12/{r['ecg_id']}.bin",
                "beats": qrs,
                "source": {"db": "PTB-XL 1.0.3", "record": r["ecg_id"],
                           "url": "https://physionet.org/content/ptb-xl/1.0.3/", "license": "CC BY 4.0"},
            })
    with open(os.path.join(a.out, "cases_12lead.json"), "w", encoding="utf-8") as fh:
        json.dump(cases, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"total {len(cases)}", file=sys.stderr)


if __name__ == "__main__":
    main()
