// 基礎編の模式図の部品。波形はガウス関数の和で作る（単位は秒と mV）。
// 実際の記録ではないので、図の下に必ず「模式図」と書く。

const SVGNS = "http://www.w3.org/2000/svg";

export function svg(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

const g = (t, c, s, a) => a * Math.exp(-((t - c) ** 2) / (2 * s * s));
const sig = (x) => 1 / (1 + Math.exp(-x));

// QRS の始まりを 0 とした1拍分の心室波形
const FORMS = {
  narrow: (t) => g(t, 0.006, 0.004, -0.08) + g(t, 0.026, 0.007, 1.1) + g(t, 0.046, 0.006, -0.25) + g(t, 0.3, 0.045, 0.3),
  // 心室期外収縮や心室頻拍の幅広いQRS。T波はQRSと逆向き
  wide: (t) => g(t, 0.06, 0.028, 1.0) + g(t, 0.13, 0.02, -0.35) + g(t, 0.36, 0.06, -0.35),
};

// events: [{type:"p", t, amp}, {type:"qrs", t, form}]
export function waveAt(t, events) {
  let y = 0;
  for (const e of events) {
    if (e.type === "p") y += g(t, e.t + 0.04, 0.018, e.amp ?? 0.15);
    else if (t > e.t - 0.1 && t < e.t + 0.7) y += FORMS[e.form || "narrow"](t - e.t);
  }
  return y;
}

// 記録紙風の模式図。marks: [{t, text, cls, y}]、spans: [{t0, t1, text}]
export function stripSvg({ dur, events, marks = [], spans = [], height = 170 }) {
  const PXS = 100, PXMV = 40, H = height, base = H * 0.62;
  const W = dur * PXS;
  const root = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "beat strip" });
  for (let x = 0; x <= W; x += 4) svg("line", { x1: x, y1: 0, x2: x, y2: H, class: x % 20 ? "g1" : "g5" }, root);
  for (let y = base % 4; y <= H; y += 4) svg("line", { x1: 0, y1: y, x2: W, y2: y, class: Math.round(y - base) % 20 ? "g1" : "g5" }, root);
  for (const s of spans) {
    const y = 34;
    svg("line", { x1: s.t0 * PXS, y1: y, x2: s.t1 * PXS, y2: y, class: "span" }, root);
    svg("line", { x1: s.t0 * PXS, y1: y - 5, x2: s.t0 * PXS, y2: y + 5, class: "span" }, root);
    svg("line", { x1: s.t1 * PXS, y1: y - 5, x2: s.t1 * PXS, y2: y + 5, class: "span" }, root);
    const tx = svg("text", { x: ((s.t0 + s.t1) / 2) * PXS, y: y - 6, class: "note" }, root);
    tx.textContent = s.text;
  }
  let d = "";
  for (let t = 0; t <= dur; t += 0.004) d += `${t ? "L" : "M"}${(t * PXS).toFixed(1)},${(base - waveAt(t, events) * PXMV).toFixed(1)}`;
  svg("path", { d, class: "trace" }, root);
  for (const m of marks) {
    const x = m.t * PXS;
    const y = m.y === "bottom" ? H - 6 : 16;
    if (m.line) svg("line", { x1: x, y1: 20, x2: x, y2: H - 20, class: "ghostLine" }, root);
    const tx = svg("text", { x, y, class: m.cls || "pmark" }, root);
    tx.textContent = m.text;
  }
  return root;
}

// 1拍の形を変えた模式図（心筋梗塞の経過、誘導ごとのST変化）
// p: {q, r, s, st, tAmp, tW}。ST は J点から T波の終わりまでの台形状の持ち上がり
export function beatShape(t, p) {
  const q = p.q ?? -0.08, r = p.r ?? 1.0, s = p.s ?? -0.25, st = p.st ?? 0, ta = p.tAmp ?? 0.3, tw = p.tW ?? 0.045;
  const qw = q < -0.2 ? 0.012 : 0.004; // 異常Q波は幅も広い
  return g(t, -0.12, 0.018, 0.15)
    + g(t, 0.012, qw, q) + g(t, 0.04, 0.008, r) + g(t, 0.06, 0.006, s)
    + st * sig((t - 0.07) / 0.008) * (1 - sig((t - 0.34) / 0.03))
    + g(t, 0.28, tw, ta);
}

export function beatSvgShape(p, { w = 100, h = 50, from = -0.2, to = 0.55, base = 0.64, k = 20, cls = "" } = {}) {
  const root = svg("svg", { viewBox: `0 0 ${w} ${h}`, class: cls, preserveAspectRatio: "none" });
  const y0 = h * base;
  svg("line", { x1: 0, y1: y0, x2: w, y2: y0, class: "g5" }, root);
  let d = "";
  const n = 220;
  for (let i = 0; i <= n; i++) {
    const t = from + ((to - from) * i) / n;
    d += `${i ? "L" : "M"}${((w * i) / n).toFixed(1)},${(y0 - beatShape(t, p) * k).toFixed(1)}`;
  }
  svg("path", { d, class: "trace" }, root);
  return root;
}

// 脚ブロックの V1、V6 の模式波形（QRS の始まりを 0 とする）
const BBB = {
  normal: {
    V1: (t) => g(t, 0.02, 0.006, 0.25) + g(t, 0.048, 0.01, -1.0) + g(t, 0.3, 0.05, 0.12),
    V6: (t) => g(t, 0.008, 0.004, -0.1) + g(t, 0.032, 0.008, 1.3) + g(t, 0.055, 0.006, -0.15) + g(t, 0.3, 0.045, 0.35),
  },
  rbbb: {
    V1: (t) => g(t, 0.02, 0.006, 0.3) + g(t, 0.046, 0.008, -0.4) + g(t, 0.088, 0.014, 0.9) + g(t, 0.32, 0.05, -0.25),
    V6: (t) => g(t, 0.008, 0.004, -0.1) + g(t, 0.032, 0.008, 1.1) + g(t, 0.09, 0.018, -0.35) + g(t, 0.31, 0.045, 0.3),
  },
  lbbb: {
    V1: (t) => g(t, 0.015, 0.005, 0.1) + g(t, 0.075, 0.026, -1.6) + g(t, 0.3, 0.05, 0.45),
    V6: (t) => g(t, 0.045, 0.02, 0.9) + g(t, 0.105, 0.02, 0.95) + g(t, 0.36, 0.055, -0.35),
  },
};

export function bbbSvg(kind, lead) {
  const w = 120, h = 110, y0 = 62, k = 28, from = -0.16, to = 0.5;
  const root = svg("svg", { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "xMidYMid meet" });
  for (let x = 0; x <= w; x += 5) svg("line", { x1: x, y1: 0, x2: x, y2: h, class: x % 25 ? "g1" : "g5" }, root);
  let d = "";
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const t = from + ((to - from) * i) / n;
    const v = g(t, -0.12, 0.018, lead === "V1" ? 0.08 : 0.12) + BBB[kind][lead](t);
    d += `${i ? "L" : "M"}${((w * i) / n).toFixed(1)},${(y0 - v * k).toFixed(1)}`;
  }
  svg("path", { d, class: "trace" }, root);
  return root;
}
