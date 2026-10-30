// 基礎編の「よく出る所見」の図：期外収縮、頻脈、徐脈、脚ブロック、心筋梗塞、電気軸の4分割図
import { svg, el, stripSvg, beatSvgShape, bbbSvg } from "./schematic.js";
import { drawLeads, LEADS } from "./paper.js";

const U = {
  ja: {
    schematic: "模式図（実際の記録ではありません）",
    real: "実際の記録",
    pac: "心房期外収縮", pvc: "心室期外収縮", bigem: "心室期外収縮の二段脈",
    ectopicPac: "模式図：4拍目が心房期外収縮。早く出たP′波（ピンク）のあとに幅の狭いQRS。洞結節のリズムがずれるので、休止は短め（不完全代償性）。",
    ectopicPvc: "模式図：4拍目が心室期外収縮。P波なしで幅の広いQRSが早く出る。洞調律のP波（薄い P）は予定どおり出るがQRSに隠れて伝わらず、前後のRR間隔の合計が通常のちょうど2倍（完全代償性）。",
    early: "早い", twice: "通常のRRの2倍",
    realEctopic: "MIT-BIH Arrhythmia Database のモニター記録（上から心房期外収縮、心室期外収縮、二段脈）。それぞれ8秒",
    narrow: "QRS 狭い", wide: "QRS 広い", regular: "RR 規則的", irregular: "RR 不規則",
    nr: ["洞頻脈", "発作性上室頻拍（PSVT）", "心房粗動（伝導比が一定）"],
    ni: ["心房細動", "心房粗動（伝導比が変わる）", "多源性心房頻拍"],
    wr: ["心室頻拍（単形性）", "脚ブロックを伴う上室頻拍"],
    wi: ["心室細動", "多形性心室頻拍（Torsade de pointes など）", "脚ブロックや WPW を伴う心房細動"],
    realTachy12: "洞頻脈（PTB-XL の II誘導）",
    realTachyMon: "モニター記録（上から心房細動、心房粗動、心室頻拍、心室細動）。それぞれ6秒",
    af: "心房細動", afl: "心房粗動", vt: "心室頻拍", vf: "心室細動", stach: "洞頻脈",
    flow: [
      ["P波はある？", ["ない", "心房細動の徐脈、接合部補充調律（幅の狭いQRS、40〜60/分）、心室補充調律（幅の広いQRS、20〜40/分）"], ["ある", "次へ"]],
      ["すべてのP波のあとにQRSが続く？", ["続かないP波がある", "房室ブロック（レッスン「房室ブロック」）"], ["1対1で続く", "次へ"]],
      ["P波の間隔は？", ["一定でゆっくり", "洞徐脈"], ["途中で止まる", "洞停止（休止が PP間隔の倍数にならない）、洞房ブロック（休止が PP間隔のちょうど2倍、3倍）"]],
    ],
    bradyKinds: { sb: "洞徐脈", arrest: "洞停止", sab: "洞房ブロック" },
    bradyCap: {
      sb: "模式図：P波もQRSも規則正しく、間隔が長い（約46/分）。",
      arrest: "模式図：P波が突然止まる。薄い P は本来P波が出るはずだった位置。休止の長さは PP間隔の倍数にならない。",
      sab: "模式図：P波がちょうど1つ抜ける。休止の長さが PP間隔のちょうど2倍になる。",
    },
    pause1: "PP の倍数にならない休止", pause2: "PP のちょうど2倍",
    realBrady: "洞徐脈（PTB-XL の II誘導、10秒）",
    bbbHead: ["", "正常", "右脚ブロック", "左脚ブロック"],
    bbbCap: "模式図：V1 の QRS の最後が上向き（rSR′、うさぎの耳）なら右脚ブロック、下向きで深いなら左脚ブロック。V6 では右脚ブロックは幅広いS波、左脚ブロックは幅広く結節のあるR波でq波がない。",
    realBbb: "PTB-XL の記録の V1 と V6（上2段：完全右脚ブロック、下2段：完全左脚ブロック）。それぞれ5秒",
    stages: {
      normal: ["正常", "基線から始まる ST と、上向きのなだらかな T波。"],
      hyper: ["超急性期（数分〜）", "T波が高く幅広く尖る。最初に出る変化で、見逃しやすい。"],
      acute: ["急性期（数分〜数時間）", "ST が上に凸の形で持ち上がり、T波とつながる。"],
      evolving: ["数時間〜数日", "異常Q波が出てR波が小さくなる。ST は少しずつ戻り、T波が陰性になり始める。"],
      old: ["陳旧性（数週〜）", "ST は基線に戻り、異常Q波が残る。陰性T波が残ることも、元に戻ることもある。"],
    },
    stageCap: "模式図：梗塞部位を見ている誘導の1拍。時間は目安で、治療（再灌流）によって経過は変わる。",
    regions: {
      as: ["前壁中隔", "左前下行枝（LAD）"],
      ext: ["広範前壁", "左前下行枝の近位部"],
      lat: ["側壁", "左回旋枝（LCx）または対角枝"],
      inf: ["下壁", "右冠動脈（RCA）が多い。左回旋枝のことも"],
      post: ["後壁", "左回旋枝または右冠動脈。背中側の V7〜V9 で ST上昇"],
    },
    culprit: "推定される責任血管：",
    legendUp: "ST上昇", legendDown: "ST低下（鏡像変化など）",
    postNote: "後壁梗塞は通常の12誘導では ST上昇が見えず、V1〜V3 の ST低下と高いR波として現れる。",
    realMi: "PTB-XL で前壁中隔梗塞（上3段：V1〜V3）、下壁梗塞（下3段：II、III、aVF）と診断された記録。異常Q波を探してみてください。病期は記録によって違います。それぞれ5秒",
    quadTitle: "I と aVF の向きで、4つの区画のどこかがわかる",
    quad: { normal: "正常軸", lad: "左軸偏位", rad: "右軸偏位", ext: "高度な軸偏位" },
    quadRows: [
      ["I ↑、aVF ↑", "正常軸"],
      ["I ↑、aVF ↓", "II ↑ なら正常（0°〜−30°）、II ↓ なら左軸偏位"],
      ["I ↓、aVF ↑", "右軸偏位"],
      ["I ↓、aVF ↓", "高度な軸偏位"],
    ],
    quadNote: "↑ は QRS の上向きの成分が大きい、↓ は下向きの成分が大きいことを表す。",
    realAxis: "実際の記録の四肢誘導（上4段：左脚前枝ブロック＝左軸偏位、下4段：左脚後枝ブロック＝右軸偏位）。I と aVF の向きを確かめてください。それぞれ4秒",
  },
  en: {
    schematic: "Schematic (not a real recording)",
    real: "Real recordings",
    pac: "PAC", pvc: "PVC", bigem: "Ventricular bigeminy",
    ectopicPac: "Schematic: beat 4 is a PAC. An early P′ wave (pink) is followed by a narrow QRS. The sinus node is reset, so the pause is short (non-compensatory).",
    ectopicPvc: "Schematic: beat 4 is a PVC. A wide QRS appears early without a P wave. The sinus P wave (faint P) arrives on time but is hidden and not conducted, so the RR around the PVC equals exactly two normal RR intervals (compensatory).",
    early: "early", twice: "2 × normal RR",
    realEctopic: "Monitor recordings from the MIT-BIH Arrhythmia Database (top to bottom: PAC, PVC, bigeminy), 8 s each",
    narrow: "Narrow QRS", wide: "Wide QRS", regular: "Regular RR", irregular: "Irregular RR",
    nr: ["Sinus tachycardia", "Paroxysmal SVT", "Atrial flutter (fixed conduction)"],
    ni: ["Atrial fibrillation", "Atrial flutter (variable conduction)", "Multifocal atrial tachycardia"],
    wr: ["Monomorphic VT", "SVT with bundle branch block"],
    wi: ["Ventricular fibrillation", "Polymorphic VT (e.g., torsade de pointes)", "AF with bundle branch block or WPW"],
    realTachy12: "Sinus tachycardia (PTB-XL lead II)",
    realTachyMon: "Monitor recordings (top to bottom: AF, atrial flutter, VT, VF), 6 s each",
    af: "AF", afl: "Atrial flutter", vt: "VT", vf: "VF", stach: "Sinus tachycardia",
    flow: [
      ["Are there P waves?", ["No", "AF with slow response, junctional escape (narrow QRS, 40–60/min), ventricular escape (wide QRS, 20–40/min)"], ["Yes", "Next"]],
      ["Is every P wave followed by a QRS?", ["Some are not", "AV block (see the AV block lesson)"], ["1:1", "Next"]],
      ["How do the P waves behave?", ["Regular but slow", "Sinus bradycardia"], ["They stop", "Sinus arrest (pause not a multiple of PP) or SA block (pause exactly 2× or 3× PP)"]],
    ],
    bradyKinds: { sb: "Sinus bradycardia", arrest: "Sinus arrest", sab: "SA block" },
    bradyCap: {
      sb: "Schematic: regular P waves and QRS complexes at a slow rate (about 46/min).",
      arrest: "Schematic: P waves suddenly stop. The faint P marks where a P wave was due. The pause is not a multiple of the PP interval.",
      sab: "Schematic: exactly one P wave is missing. The pause equals exactly two PP intervals.",
    },
    pause1: "pause not a multiple of PP", pause2: "exactly 2 × PP",
    realBrady: "Sinus bradycardia (PTB-XL lead II, 10 s)",
    bbbHead: ["", "Normal", "RBBB", "LBBB"],
    bbbCap: "Schematic: if the end of the QRS in V1 points up (rSR′, “rabbit ears”) think RBBB; if it is deep and negative, think LBBB. In V6, RBBB shows a wide S wave; LBBB shows a broad notched R without a q wave.",
    realBbb: "V1 and V6 from PTB-XL (top two rows: complete RBBB; bottom two: complete LBBB), 5 s each",
    stages: {
      normal: ["Normal", "ST starts at the baseline; T wave is upright and smooth."],
      hyper: ["Hyperacute (minutes)", "Tall, broad, peaked T waves. The earliest change and easy to miss."],
      acute: ["Acute (minutes–hours)", "Convex ST elevation merging into the T wave."],
      evolving: ["Hours–days", "Pathological Q waves appear and R waves shrink; ST settles and T waves start to invert."],
      old: ["Old (weeks+)", "ST returns to baseline and Q waves persist; T waves may stay inverted or normalize."],
    },
    stageCap: "Schematic: one beat in a lead facing the infarct. Times are approximate and change with reperfusion therapy.",
    regions: {
      as: ["Anteroseptal", "LAD"],
      ext: ["Extensive anterior", "Proximal LAD"],
      lat: ["Lateral", "LCx or diagonal branch"],
      inf: ["Inferior", "Usually RCA, sometimes LCx"],
      post: ["Posterior", "LCx or RCA; ST elevation in posterior leads V7–V9"],
    },
    culprit: "Likely culprit artery: ",
    legendUp: "ST elevation", legendDown: "ST depression (reciprocal, etc.)",
    postNote: "Posterior MI shows no ST elevation on the standard 12 leads; it appears as ST depression with tall R waves in V1–V3.",
    realMi: "PTB-XL records diagnosed as anteroseptal MI (top three rows: V1–V3) and inferior MI (bottom three: II, III, aVF). Look for pathological Q waves. The stage differs between records. 5 s each",
    quadTitle: "Leads I and aVF tell you which quadrant the axis is in",
    quad: { normal: "Normal", lad: "Left axis deviation", rad: "Right axis deviation", ext: "Extreme axis" },
    quadRows: [
      ["I ↑, aVF ↑", "Normal axis"],
      ["I ↑, aVF ↓", "II ↑ = normal (0° to −30°); II ↓ = left axis deviation"],
      ["I ↓, aVF ↑", "Right axis deviation"],
      ["I ↓, aVF ↓", "Extreme axis"],
    ],
    quadNote: "↑ means the QRS is mostly positive; ↓ means mostly negative.",
    realAxis: "Limb leads from real recordings (top four: left anterior fascicular block = left axis deviation; bottom four: left posterior fascicular block = right axis deviation). Check the direction in I and aVF. 4 s each",
  },
};

function find(ctx, dx, rec) {
  return (rec && ctx.cases.find((c) => c.answer === dx && c.source.record === rec)) || ctx.cases.find((c) => c.answer === dx);
}

function canvasBox(box, caption) {
  const v = el("div", "viewer");
  const c = el("canvas");
  v.appendChild(c);
  box.append(v, el("div", "cap", caption));
  return c;
}

function leadOf(sig, name) { return sig[LEADS.indexOf(name)]; }

function chipSwitch(box, items, onPick, initial) {
  const chips = el("div", "chips");
  for (const [k, label] of items) {
    const b = el("button", null, label);
    b.dataset.k = k;
    b.onclick = () => { chips.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); onPick(k); };
    chips.appendChild(b);
  }
  box.appendChild(chips);
  chips.querySelector(`[data-k="${initial}"]`).click();
}

// ---- 期外収縮 ----
function ectopicEvents(kind) {
  const ev = [], marks = [], spans = [];
  if (kind === "pac") {
    const ps = [0.3, 1.1, 1.9, 3.3, 4.1, 4.9, 5.7, 6.5, 7.3];
    for (const p of ps) { ev.push({ type: "p", t: p }, { type: "qrs", t: p + 0.16 }); marks.push({ t: p + 0.04, text: "P" }); }
    ev.push({ type: "p", t: 2.5, amp: 0.09 }, { type: "qrs", t: 2.66 });
    marks.push({ t: 2.54, text: "P′", cls: "note" }, { t: 2.7, text: "PAC", cls: "note", y: "bottom" });
  } else {
    const ps = [0.3, 1.1, 1.9, 2.7, 3.5, 4.3, 5.1, 5.9, 6.7, 7.5];
    for (const p of ps) {
      ev.push({ type: "p", t: p });
      if (p !== 2.7) ev.push({ type: "qrs", t: p + 0.16 });
      marks.push({ t: p + 0.04, text: "P", cls: p === 2.7 ? "pmark ghost" : "pmark" });
    }
    ev.push({ type: "qrs", t: 2.42, form: "wide" });
    marks.push({ t: 2.5, text: "PVC", cls: "note", y: "bottom" });
    spans.push({ t0: 2.06 + 0.026, t1: 3.66 + 0.026, text: "" });
  }
  return { ev, marks, spans };
}

export async function widgetEctopic(box, lang, ctx) {
  const T = U[lang];
  const holder = el("div", "viewer");
  const cap = el("div", "cap");
  chipSwitch(box, [["pac", T.pac], ["pvc", T.pvc]], (k) => {
    const { ev, marks, spans } = ectopicEvents(k);
    if (spans[0]) spans[0].text = T.twice;
    holder.innerHTML = "";
    holder.appendChild(stripSvg({ dur: 8, events: ev, marks, spans }));
    cap.textContent = k === "pac" ? T.ectopicPac : T.ectopicPvc;
  }, "pvc");
  box.append(holder, cap);
  box.appendChild(el("h3", null, T.real));
  const cs = [find(ctx, "M_PAC"), find(ctx, "M_PVC"), find(ctx, "M_BIGEM")];
  const sigs = await Promise.all(cs.map((c) => ctx.loadSignal(c)));
  drawLeads(canvasBox(box, T.realEctopic), [
    { name: T.pac, sig: sigs[0][0] }, { name: T.pvc, sig: sigs[1][0] }, { name: T.bigem, sig: sigs[2][0] },
  ], 250, 8, 4);
}

// ---- 頻脈 ----
export async function widgetTachy(box, lang, ctx) {
  const T = U[lang];
  const grid = el("div", "grid2");
  const cell = (items, cls) => { const d = el("div", `cell ${cls}`); d.innerHTML = items.map((x) => `・${x}`).join("<br>"); return d; };
  grid.append(el("div"), el("div", "h", T.regular), el("div", "h", T.irregular));
  grid.append(el("div", "h", T.narrow), cell(T.nr, "c-blue"), cell(T.ni, "c-mint"));
  grid.append(el("div", "h", T.wide), cell(T.wr, "c-pink"), cell(T.wi, "c-lilac"));
  box.appendChild(grid);
  box.appendChild(el("h3", null, T.real));
  const st = find(ctx, "STACH");
  const mon = [find(ctx, "M_AFIB"), find(ctx, "M_AFL"), find(ctx, "M_VT", "420"), find(ctx, "M_VF")];
  const [s12, ...sm] = await Promise.all([st, ...mon].map((c) => ctx.loadSignal(c)));
  drawLeads(canvasBox(box, T.realTachy12), [{ name: `II（${T.stach}）`, sig: leadOf(s12, "II") }], st.fs, 6, 4);
  drawLeads(canvasBox(box, T.realTachyMon), [
    { name: T.af, sig: sm[0][0] }, { name: T.afl, sig: sm[1][0] }, { name: T.vt, sig: sm[2][0] }, { name: T.vf, sig: sm[3][0] },
  ], 250, 6, 4);
}

// ---- 徐脈 ----
function bradyEvents(kind, T) {
  const ev = [], marks = [], spans = [];
  const beat = (p) => { ev.push({ type: "p", t: p }, { type: "qrs", t: p + 0.16 }); marks.push({ t: p + 0.04, text: "P" }); };
  if (kind === "sb") {
    for (let p = 0.3; p < 7.8; p += 1.3) beat(p);
  } else if (kind === "arrest") {
    [0.3, 1.1, 1.9, 4.25, 5.05, 5.85, 6.65, 7.45].forEach(beat);
    marks.push({ t: 2.74, text: "P", cls: "pmark ghost", line: true }, { t: 3.54, text: "P", cls: "pmark ghost", line: true });
    spans.push({ t0: 1.94, t1: 4.29, text: T.pause1 });
  } else {
    [0.3, 1.1, 1.9, 3.5, 4.3, 5.1, 5.9, 6.7, 7.5].forEach(beat);
    marks.push({ t: 2.74, text: "P", cls: "pmark ghost", line: true });
    spans.push({ t0: 1.94, t1: 3.54, text: T.pause2 });
  }
  return { ev, marks, spans };
}

export async function widgetBrady(box, lang, ctx) {
  const T = U[lang];
  const flow = el("div", "flow");
  T.flow.forEach(([q, a, b], i) => {
    const step = el("div", "step");
    step.appendChild(el("div", "q", `${i + 1}. ${q}`));
    const ca = el("div", "a c-pink"); ca.innerHTML = `<b>${a[0]}</b> → ${a[1]}`;
    const cb = el("div", "a c-mint"); cb.innerHTML = `<b>${b[0]}</b> → ${b[1]}`;
    step.append(ca, cb);
    flow.appendChild(step);
  });
  box.appendChild(flow);
  box.appendChild(el("h3", null, T.schematic));
  const holder = el("div", "viewer");
  const cap = el("div", "cap");
  chipSwitch(box, Object.entries(T.bradyKinds), (k) => {
    const { ev, marks, spans } = bradyEvents(k, T);
    holder.innerHTML = "";
    holder.appendChild(stripSvg({ dur: 8, events: ev, marks, spans }));
    cap.textContent = T.bradyCap[k];
  }, "sab");
  box.append(holder, cap);
  box.appendChild(el("h3", null, T.real));
  const c = find(ctx, "SBRAD");
  const s = await ctx.loadSignal(c);
  drawLeads(canvasBox(box, T.realBrady), [{ name: "II", sig: leadOf(s, "II") }], c.fs, 10, 4);
}

// ---- 脚ブロック ----
export async function widgetBbb(box, lang, ctx) {
  const T = U[lang];
  const grid = el("div", "bbb");
  for (const h of T.bbbHead) grid.appendChild(el("div", "h", h));
  for (const lead of ["V1", "V6"]) {
    grid.appendChild(el("div", "rowh", lead));
    for (const k of ["normal", "rbbb", "lbbb"]) { const c = el("div", "cell"); c.appendChild(bbbSvg(k, lead)); grid.appendChild(c); }
  }
  box.append(grid, el("div", "cap", T.bbbCap));
  box.appendChild(el("h3", null, T.real));
  const r = find(ctx, "CRBBB"), l = find(ctx, "CLBBB");
  const [sr, sl] = await Promise.all([ctx.loadSignal(r), ctx.loadSignal(l)]);
  drawLeads(canvasBox(box, T.realBbb), [
    { name: `V1（${T.bbbHead[2]}）`, sig: leadOf(sr, "V1") }, { name: `V6（${T.bbbHead[2]}）`, sig: leadOf(sr, "V6") },
    { name: `V1（${T.bbbHead[3]}）`, sig: leadOf(sl, "V1") }, { name: `V6（${T.bbbHead[3]}）`, sig: leadOf(sl, "V6") },
  ], r.fs, 5, 4);
}

// ---- 心筋梗塞（STEMI） ----
const STAGES = {
  normal: {},
  hyper: { tAmp: 0.9, tW: 0.055, st: 0.08 },
  acute: { st: 0.4, tAmp: 0.3, tW: 0.05 },
  evolving: { q: -0.35, r: 0.45, st: 0.2, tAmp: -0.15 },
  old: { q: -0.45, r: 0.4, s: -0.1, st: 0, tAmp: -0.25 },
};
const GRID = [["I", "aVR", "V1", "V4"], ["II", "aVL", "V2", "V5"], ["III", "aVF", "V3", "V6"]];
// 各誘導の正常な形（aVR は全体に下向き、V1〜V3 は rS 型）
const BASE = {
  aVR: { q: 0, r: 0.15, s: -0.8, tAmp: -0.2 }, V1: { q: 0, r: 0.25, s: -0.9, tAmp: 0.1 },
  V2: { q: 0, r: 0.4, s: -0.9, tAmp: 0.3 }, V3: { q: 0, r: 0.6, s: -0.6 }, III: { r: 0.5 }, aVL: { r: 0.5 },
};
const REGIONS = {
  as: { up: ["V1", "V2", "V3", "V4"], down: [] },
  ext: { up: ["V1", "V2", "V3", "V4", "V5", "V6", "I", "aVL"], down: ["II", "III", "aVF"] },
  lat: { up: ["I", "aVL", "V5", "V6"], down: ["III", "aVF"] },
  inf: { up: ["II", "III", "aVF"], down: ["I", "aVL"] },
  post: { up: [], down: ["V1", "V2", "V3"], tallR: true },
};

export async function widgetStemi(box, lang, ctx) {
  const T = U[lang];
  // 時間経過
  const big = el("div");
  const desc = el("p");
  chipSwitch(box, Object.keys(STAGES).map((k) => [k, T.stages[k][0]]), (k) => {
    big.innerHTML = "";
    big.appendChild(beatSvgShape(STAGES[k], { w: 320, h: 160, k: 70, base: 0.62, cls: "beat" }));
    desc.innerHTML = `<b>${T.stages[k][0]}</b>：${T.stages[k][1]}`;
  }, "acute");
  box.append(big, desc, el("div", "cap", T.stageCap));

  // 部位と誘導
  box.appendChild(el("h3", null, lang === "ja" ? "どの誘導で ST が変わるか" : "Which leads change"));
  const gridBox = el("div", "leadGrid");
  const info = el("p");
  const legend = el("div", "legend");
  legend.innerHTML = `<span class="lu">${T.legendUp}</span><span class="ld">${T.legendDown}</span>`;
  const renderGrid = (k) => {
    const r = REGIONS[k];
    gridBox.innerHTML = "";
    for (const row of GRID) for (const lead of row) {
      const up = r.up.includes(lead), down = r.down.includes(lead);
      let p = { ...(BASE[lead] || {}) };
      if (up) p = { ...p, st: 0.35, tAmp: 0.4 };
      if (down) p = { ...p, st: -0.15, tAmp: 0.05, ...(r.tallR ? { r: 0.8, s: -0.3 } : {}) };
      const c = el("div", `lc${up ? " up" : down ? " down" : ""}`, lead);
      c.appendChild(beatSvgShape(p, { w: 100, h: 46, k: 16, base: 0.62 }));
      gridBox.appendChild(c);
    }
    info.innerHTML = `<b>${T.regions[k][0]}</b>　${T.culprit}${T.regions[k][1]}${k === "post" ? `<br>${T.postNote}` : ""}`;
  };
  chipSwitch(box, Object.keys(REGIONS).map((k) => [k, T.regions[k][0]]), renderGrid, "inf");
  box.append(legend, gridBox, info, el("div", "cap", T.schematic));

  // 実記録
  box.appendChild(el("h3", null, T.real));
  const a = find(ctx, "ASMI"), i = find(ctx, "IMI");
  const [sa, si] = await Promise.all([ctx.loadSignal(a), ctx.loadSignal(i)]);
  drawLeads(canvasBox(box, T.realMi), [
    ...["V1", "V2", "V3"].map((n) => ({ name: n, sig: leadOf(sa, n) })),
    ...["II", "III", "aVF"].map((n) => ({ name: n, sig: leadOf(si, n) })),
  ], a.fs, 5, 4);
}

// ---- 電気軸の4分割図と実記録 ----
const SECTORS = [
  ["normal", -30, 90, "#cfe0f6"],
  ["rad", 90, 180, "#e4d8f5"],
  ["ext", -180, -90, "#f8ecc0"],
  ["lad", -90, -30, "#f9d5e1"],
];

function arc(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`;
}

export async function widgetAxisQuad(box, lang, ctx) {
  const T = U[lang];
  box.appendChild(el("h3", null, T.quadTitle));
  const wrap = el("div", "row2");
  const s = svg("svg", { viewBox: "0 0 320 320", class: "quad" });
  const c = 160, R = 120;
  for (const [k, a0, a1, color] of SECTORS) {
    svg("path", { d: arc(c, c, R, a0, a1), fill: color, class: "sec" }, s);
    const mid = ((a0 + a1) / 2) * (Math.PI / 180);
    const t = svg("text", { x: c + 70 * Math.cos(mid), y: c + 70 * Math.sin(mid) + 4, class: "lbl mid small" }, s);
    t.textContent = T.quad[k];
  }
  for (const [name, deg] of [["I 0°", 0], ["aVF +90°", 90], ["−90°", -90], ["±180°", 180], ["−30°", -30]]) {
    const r = (deg * Math.PI) / 180;
    svg("line", { x1: c, y1: c, x2: c + R * Math.cos(r), y2: c + R * Math.sin(r), class: "leadline" }, s);
    const t = svg("text", { x: c + (R + 22) * Math.cos(r), y: c + (R + 14) * Math.sin(r) + 4, class: "lbl mid small" }, s);
    t.textContent = name;
  }
  const key = el("div");
  const tbl = el("div", "quadKey");
  const colors = { 0: "#cfe0f6", 1: "#f9d5e1", 2: "#e4d8f5", 3: "#f8ecc0" };
  T.quadRows.forEach(([pol, res], i) => {
    const sw = el("div", "sw"); sw.style.background = colors[i];
    const d = el("div"); d.innerHTML = `<span class="pol">${pol}</span> → ${res}`;
    tbl.append(sw, d);
  });
  key.append(tbl, el("div", "cap", T.quadNote));
  wrap.append(s, key);
  box.appendChild(wrap);
}

export async function widgetAxisReal(box, lang, ctx) {
  const T = U[lang];
  box.appendChild(el("h3", null, T.real));
  const a = find(ctx, "LAFB"), p = find(ctx, "LPFB");
  const [sa, sp] = await Promise.all([ctx.loadSignal(a), ctx.loadSignal(p)]);
  const rows = (sg) => ["I", "II", "III", "aVF"].map((n) => ({ name: n, sig: leadOf(sg, n) }));
  drawLeads(canvasBox(box, T.realAxis), [...rows(sa), ...rows(sp)], a.fs, 4, 4);
}
