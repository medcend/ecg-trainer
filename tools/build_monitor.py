"""MIT-BIH Arrhythmia と MIT-BIH Malignant Ventricular Ectopy から、モニター用の20秒区間を切り出す。

使い方:
    python build_monitor.py --raw <mitdb と vfdb を置いたフォルダ> --out ../data

区間の選び方:
    医師の調律注釈（"(AFIB" など）の区間に20秒が丸ごと入り、
    拍の種類の並びが目的の所見と合う区間だけを使う。信号品質の注釈（~）を含む区間は除く。
"""
import argparse, json, os, sys

import numpy as np
import wfdb
import wfdb.processing
from scipy.signal import butter, filtfilt, resample_poly

FS = 250
WIN = 20  # 秒
PER_DX = 8
BEATS = set("NLRBAaJSVrFejnE/fQ")
MIT = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 121,
       122, 123, 124, 200, 201, 202, 203, 205, 207, 208, 209, 210, 212, 213, 214, 215, 217, 219, 220, 221,
       222, 223, 228, 230, 231, 232, 233, 234]
VF = list(range(418, 431)) + list(range(602, 616))


def rhythm_spans(ann, n):
    rh = [(s, (ann.aux_note[i] or "").strip("\x00")) for i, s in enumerate(ann.sample) if ann.symbol[i] == "+"]
    return [(s, rh[j + 1][0] if j + 1 < len(rh) else n, lab) for j, (s, lab) in enumerate(rh)]


def hr_of(times):
    if len(times) < 3:
        return None
    return 60.0 / float(np.median(np.diff(times)))


def no_two_in_row(syms, k):
    return all(not (a == k and b == k) for a, b in zip(syms, syms[1:]))


# id -> (級, データベース, 調律注釈, 拍の条件)
RULES = {
    "M_NSR": (4, "mitdb", "(N", lambda s, hr: set(s) == {"N"} and 60 <= hr <= 100),
    "M_SBRAD": (4, "mitdb", "(N", lambda s, hr: set(s) == {"N"} and hr < 55),
    "M_PAC": (4, "mitdb", "(N", lambda s, hr: set(s) <= {"N", "A"} and 1 <= s.count("A") <= 4 and no_two_in_row(s, "A")),
    "M_PVC": (4, "mitdb", "(N", lambda s, hr: set(s) <= {"N", "V"} and 1 <= s.count("V") <= 4 and no_two_in_row(s, "V")),
    "M_BIGEM": (4, "mitdb", "(B", lambda s, hr: set(s) <= {"N", "V"} and s.count("V") >= 6),
    "M_TRIGEM": (4, "mitdb", "(T", lambda s, hr: set(s) <= {"N", "V"} and s.count("V") >= 4),
    "M_AFIB": (4, "mitdb", "(AFIB", lambda s, hr: set(s) == {"N"}),
    "M_AFL": (4, "mitdb", "(AFL", lambda s, hr: set(s) == {"N"}),
    "M_PACED": (4, "mitdb", "(P", lambda s, hr: set(s) == {"/"}),
    "M_2TO1AVB": (4, "mitdb", "(BII", lambda s, hr: True),
    "M_VT": (4, "vfdb", "(VT", None),
    "M_VF": (4, "vfdb", "(VF", None),
    "M_ASYS": (4, "vfdb", "(ASYS", None),
    "M_NOISE": (4, "vfdb", "(NOISE", None),
}
VF_ALIASES = {"(VF": {"(VF", "(VFIB"}}
NO_BEEP = {"M_VF", "M_ASYS", "M_NOISE"}


def load(raw, db, rec):
    path = os.path.join(raw, db, str(rec))
    r = wfdb.rdrecord(path)
    a = wfdb.rdann(path, "atr")
    ch = r.sig_name.index("MLII") if "MLII" in r.sig_name else 0
    return r, a, ch


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(os.path.join(a.out, "mon"), exist_ok=True)
    for f in os.listdir(os.path.join(a.out, "mon")):
        os.remove(os.path.join(a.out, "mon", f))
    b, a_ = butter(2, 0.5 / (FS / 2), btype="highpass")

    chosen = {k: [] for k in RULES}
    for db, recs in (("mitdb", MIT), ("vfdb", VF)):
        for rec in recs:
            try:
                r, ann, ch = load(a.raw, db, rec)
            except Exception:
                continue
            fs = r.fs
            n = r.sig_len
            sym = np.array(ann.symbol)
            samp = np.array(ann.sample)
            for k, (lvl, kdb, lab, cond) in RULES.items():
                if kdb != db:
                    continue
                labs = VF_ALIASES.get(lab, {lab})
                used_in_rec = sum(1 for c in chosen[k] if c["source"]["record"] == str(rec))
                for s, e, rl in rhythm_spans(ann, n):
                    if rl not in labs:
                        continue
                    if k == "M_NOISE":
                        for r0, t0 in sorted(NOISE_REVIEWED):
                            if r0 == str(rec) and s <= t0 and t0 + WIN * fs <= e:
                                chosen[k].append(cut(r, ch, t0, fs, db, rec, k, lvl, [], [], b, a_, a.out))
                        continue
                    t = s + int(2 * fs)
                    while t + WIN * fs <= e - int(1 * fs) and len(chosen[k]) < PER_DX and used_in_rec < 2:
                        sel = (samp >= t) & (samp < t + WIN * fs)
                        syms = [x for x in sym[sel] if x in BEATS]
                        btimes = [(x - t) / fs for x, y in zip(samp[sel], sym[sel]) if y in BEATS]
                        bad = "~" in sym[sel] and k != "M_NOISE"
                        hr = hr_of(btimes) if btimes else None
                        case = None
                        if not bad and (cond is None or (hr is not None and cond(syms, hr))):
                            case = cut(r, ch, t, fs, db, rec, k, lvl, syms, btimes, b, a_, a.out)
                        if case:
                            chosen[k].append(case)
                            used_in_rec += 1
                            t += 60 * fs  # 同じ記録からは1分以上離して取る
                        else:
                            t += 5 * fs
    chosen["M_ASYS"] += synthetic_asystole(a.out)
    print({k: len(v) for k, v in chosen.items()}, file=sys.stderr)
    cases = [c for v in chosen.values() for c in v]
    with open(os.path.join(a.out, "cases_monitor.json"), "w", encoding="utf-8") as fh:
        json.dump(cases, fh, ensure_ascii=False, separators=(",", ":"))


def synthetic_asystole(out):
    """心静止は電気活動がないことが定義なので、合成でも正確に作れる。
    実記録で平坦な区間が少ないため、低振幅の雑音と緩い基線の揺れだけの波形を足す。"""
    rng = np.random.default_rng(7)
    cases = []
    for i in range(2):
        tt = np.arange(WIN * FS) / FS
        x = rng.normal(0, 0.012, tt.size) + 0.04 * np.sin(2 * np.pi * 0.25 * tt + i)
        uv = np.round(x * 1000).astype("<i2")
        name = f"synthetic-asys-{i}"
        uv.tofile(os.path.join(out, "mon", f"{name}.bin"))
        cases.append({
            "id": f"mon-{name}", "kind": "monitor", "level": 4, "answer": "M_ASYS", "present": ["M_ASYS"],
            "lead": "II", "fs": FS, "n": int(uv.size), "file": f"mon/{name}.bin", "beats": [], "beatTypes": "",
            "source": {"db": "synthetic", "record": name, "url": "", "license": ""},
        })
    return cases


def detect(x):
    try:
        return (wfdb.processing.xqrs_detect(x, fs=FS, verbose=False) / FS).tolist()
    except Exception:
        return []


def p2p(x):
    return float(np.percentile(x, 99) - np.percentile(x, 1))


def cv(times):
    if len(times) < 4:
        return 9.0
    rr = np.diff(times)
    return float(np.std(rr) / np.mean(rr))


def quality_ok(k, x):
    """MIT-BIH 悪性心室性の調律注釈は区間の境界が粗く、注釈と見た目が合わない区間がある。
    目視で確認した結果に合わせて、波形の性質で区間を絞る。"""
    if k == "M_VT":
        # 単形性VTとして読める区間：振幅が保たれ、規則正しく、全体を通して途切れない
        bt = detect(x)
        win = [p2p(x[i:i + 2 * FS]) for i in range(0, len(x) - 2 * FS + 1, FS)]
        return p2p(x) >= 0.8 and len(bt) >= 33 and cv(bt) < 0.12 and min(win) >= 0.5 * max(win)
    if k == "M_VF":
        return p2p(x) >= 0.3
    if k == "M_ASYS":
        return p2p(x) < 0.3
    return True


# 雑音の区間は波形の性質だけでは絞り切れない（低振幅の区間が細動と見分けにくい）ので、
# 雑音の奥に規則正しいQRSが追えることを目視で確かめた区間だけを使う。(記録, 開始サンプル)
NOISE_REVIEWED = {("420", 42050), ("421", 56325), ("421", 190775), ("422", 233975)}


def cut(r, ch, t, fs, db, rec, k, lvl, syms, btimes, b, a_, out):
    x = r.p_signal[t:t + WIN * fs, ch]
    x = np.nan_to_num(x)
    if fs != FS:
        x = resample_poly(x, FS, fs)
    x = filtfilt(b, a_, x)
    if db == "vfdb" and not quality_ok(k, x):
        return None
    uv = np.clip(np.round(x * 1000), -32768, 32767).astype("<i2")
    name = f"{db}-{rec}-{t}"
    uv.tofile(os.path.join(out, "mon", f"{name}.bin"))
    if db == "vfdb" and k not in NO_BEEP:
        btimes = detect(x)
        syms = []
    if k in NO_BEEP:
        btimes, syms = [], []
    return {
        "id": f"mon-{name}",
        "kind": "monitor",
        "level": lvl,
        "answer": k,
        "present": [k],
        "lead": r.sig_name[ch],
        "fs": FS,
        "n": int(uv.shape[0]),
        "file": f"mon/{name}.bin",
        "beats": [round(v, 3) for v in btimes],
        "beatTypes": "".join(syms),
        "source": {
            "db": "MIT-BIH Arrhythmia" if db == "mitdb" else "MIT-BIH Malignant Ventricular Ectopy",
            "record": str(rec), "start_s": round(t / fs, 1),
            "url": f"https://physionet.org/content/{db}/1.0.0/", "license": "ODC-By 1.0",
        },
    }


if __name__ == "__main__":
    main()
