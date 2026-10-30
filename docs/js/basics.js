// 基礎編：レッスン一覧、本文、図、確認問題
import { LESSONS, GROUPS } from "./lessons.js";
import { drawLeads, attachCalipers, LEADS } from "./paper.js";
import { widgetEctopic, widgetTachy, widgetBrady, widgetBbb, widgetStemi, widgetAxisQuad, widgetAxisReal } from "./widgets2.js";

const UI = {
  ja: {
    play: "▶ 再生（ゆっくり）", pause: "❚❚ 一時停止", stepPrev: "← 前の部位", stepNext: "次の部位 →", point: "ここだけ", check: "確認問題", correct: "正解", wrong: "不正解", schematic: "模式図（実際の記録ではありません）",
    pick: "図の部位をクリックしてください。", showHr: "答え合わせ", hrAns: (a, b) => `自動計測の心拍数は ${a}/分、R波の間隔の中央値から計算すると ${b}/分です。`,
    sinusCap: "上4段：洞調律の患者（PTB-XL）　最下段：心房細動の患者の II誘導（PTB-XL）",
    paperCap: "正常洞調律の患者の II誘導（PTB-XL）",
    axisLabel: "電気軸", limb: "四肢誘導（前額面）", chest: "胸部誘導の電極位置（水平面、足側から見た図）",
    cls: { normal: "正常軸", lad: "左軸偏位", rad: "右軸偏位", ext: "高度な軸偏位（北西軸）" },
    caliper: (ms, mv) => `Δt ${Math.round(ms)} ms（${ms > 0 ? Math.round(60000 / ms) : "--"}/分）  ΔV ${mv.toFixed(2)} mV`,
    prev: "← 前へ", next: "次へ →",
    avbNote: "模式図（実際の記録ではありません）。上の P は各P波の位置、下の数字は PR間隔（ms）、× は伝わらなかったP波。T波に隠れたP波もあります。",
    avbComplete: "模式図（実際の記録ではありません）。P波は75/分、QRSは接合部の補充調律で約41/分。PとQRSは無関係に出るので、PR間隔は毎回ばらばら。",
    avbReal: "実際の記録", avb1: "I度", avb3: "完全",
    avbReal12: "PTB-XL の12誘導から II誘導（上：I度房室ブロック、下：完全房室ブロック）",
    avbRealMon: "MIT-BIH Arrhythmia Database の記録231（2:1 房室ブロック、右脚ブロックを伴う区間あり）",
  },
  en: {
    play: "▶ Play (slow)", pause: "❚❚ Pause", stepPrev: "← Previous part", stepNext: "Next part →", point: "Key point", check: "Check questions", correct: "Correct", wrong: "Incorrect", schematic: "Schematic (not a real recording)",
    pick: "Click a structure in the diagram.", showHr: "Check answer", hrAns: (a, b) => `Automatic heart rate: ${a}/min; from the median RR interval: ${b}/min.`,
    sinusCap: "Top four rows: a patient in sinus rhythm (PTB-XL). Bottom row: lead II of a patient in atrial fibrillation (PTB-XL)",
    paperCap: "Lead II of a patient in normal sinus rhythm (PTB-XL)",
    axisLabel: "Axis", limb: "Limb leads (frontal plane)", chest: "Chest electrode positions (horizontal plane, viewed from below)",
    cls: { normal: "Normal axis", lad: "Left axis deviation", rad: "Right axis deviation", ext: "Extreme (northwest) axis" },
    caliper: (ms, mv) => `Δt ${Math.round(ms)} ms (${ms > 0 ? Math.round(60000 / ms) : "--"}/min)  ΔV ${mv.toFixed(2)} mV`,
    prev: "← Previous", next: "Next →",
    avbNote: "Schematic (not a real recording). P marks each P wave; numbers below are PR intervals (ms); × marks a blocked P wave. Some P waves hide in T waves.",
    avbComplete: "Schematic (not a real recording). Atrial rate 75/min; junctional escape about 41/min. P and QRS are unrelated, so the PR varies every beat.",
    avbReal: "Real recordings", avb1: "1st degree", avb3: "complete",
    avbReal12: "Lead II from PTB-XL 12-lead ECGs (top: first-degree AV block, bottom: complete AV block)",
    avbRealMon: "MIT-BIH Arrhythmia Database record 231 (2:1 AV block; parts show right bundle branch block)",
  },
};

// 刺激伝導系の各部位：説明と、模式図の心電図で対応する時間帯（ms）
const PARTS = {
  sa: { ja: ["洞結節", "右房の上部にある歩調取り。ここの興奮は体表心電図には写らない。"], en: ["SA node", "The pacemaker in the high right atrium. Its discharge is not visible on the surface ECG."], span: [0, 40] },
  atria: { ja: ["心房", "興奮が右房から左房へ広がる。これがP波。"], en: ["Atria", "Excitation spreads from right to left atrium, producing the P wave."], span: [40, 120] },
  av: { ja: ["房室結節", "伝導がゆっくりで、心室への伝導を遅らせる。PR部分の平らな基線。"], en: ["AV node", "Slow conduction delays ventricular activation: the flat PR segment."], span: [120, 190] },
  his: { ja: ["ヒス束", "心房と心室をつなぐ唯一の通り道。体表心電図では見えない。"], en: ["Bundle of His", "The only normal connection between atria and ventricles; invisible on the surface ECG."], span: [185, 200] },
  bundles: { ja: ["右脚、左脚（前枝、後枝）", "中隔の両側を下る。中隔が左から右へ興奮し、QRSが始まる。"], en: ["Bundle branches (left anterior and posterior fascicles)", "Run down the septum; septal activation (left to right) starts the QRS."], span: [195, 215] },
  purkinje: { ja: ["プルキンエ線維と心室筋", "心室全体をほぼ同時に興奮させ、幅の狭いQRSになる。"], en: ["Purkinje fibers and ventricular muscle", "Rapid activation of both ventricles gives a narrow QRS."], span: [200, 262] },
  repol: { ja: ["心室の再分極", "心室筋が元に戻る時期。ST部分とT波。"], en: ["Ventricular repolarization", "Recovery of ventricular muscle: ST segment and T wave."], span: [262, 540] },
};

const WAVES = {
  P: { span: [40, 120], ja: "P波", en: "P wave" },
  PR: { span: [40, 200], ja: "PR間隔", en: "PR interval", bracket: true },
  PRseg: { span: [120, 200], ja: "PR部分", en: "PR segment" },
  QRS: { span: [200, 262], ja: "QRS波", en: "QRS complex" },
  ST: { span: [262, 340], ja: "ST部分", en: "ST segment" },
  T: { span: [340, 540], ja: "T波", en: "T wave" },
  U: { span: [575, 665], ja: "U波", en: "U wave" },
  QT: { span: [200, 540], ja: "QT間隔", en: "QT interval", bracket: true },
};

// 模式図の1拍（mV）。ガウス関数の和で、PR 160 ms、QRS 約60 ms、QT 約340 ms
function beatAt(t) {
  const g = (c, s, a) => a * Math.exp(-((t - c) ** 2) / (2 * s * s));
  return g(80, 18, 0.15) + g(206, 4, -0.08) + g(226, 7, 1.1) + g(246, 6, -0.25) + g(425, 42, 0.3) + g(620, 18, 0.04);
}

const SVGNS = "http://www.w3.org/2000/svg";
function svg(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

function beatSvg(highlight) {
  const W = 520, H = 190, x = (t) => 20 + t * 0.66, y = (mv) => 125 - mv * 85;
  const root = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "beat" });
  for (let gx = 20; gx <= W; gx += 0.66 * 40) svg("line", { x1: gx, y1: 0, x2: gx, y2: H, class: "g1" }, root);
  for (let gy = 125 % 8.5; gy <= H; gy += 8.5) svg("line", { x1: 0, y1: gy, x2: W, y2: gy, class: "g1" }, root);
  const hl = svg("rect", { x: 0, y: 0, width: 0, height: H, class: "hl" }, root);
  let d = "";
  for (let t = 0; t <= 740; t += 2) d += `${t ? "L" : "M"}${x(t).toFixed(1)},${y(beatAt(t)).toFixed(1)}`;
  svg("path", { d, class: "trace" }, root);
  const cursor = svg("line", { x1: 0, y1: 0, x2: 0, y2: H, class: "cursor", visibility: "hidden" }, root);
  const br = svg("g", {}, root);
  function show(span, text, bracket) {
    if (!span) { hl.setAttribute("width", 0); br.innerHTML = ""; return; }
    hl.setAttribute("x", x(span[0]));
    hl.setAttribute("width", x(span[1]) - x(span[0]));
    br.innerHTML = "";
    if (text) {
      const yy = bracket ? 175 : 18;
      svg("line", { x1: x(span[0]), y1: yy, x2: x(span[1]), y2: yy, class: "br" }, br);
      svg("line", { x1: x(span[0]), y1: yy - 5, x2: x(span[0]), y2: yy + 5, class: "br" }, br);
      svg("line", { x1: x(span[1]), y1: yy - 5, x2: x(span[1]), y2: yy + 5, class: "br" }, br);
      const tx = svg("text", { x: (x(span[0]) + x(span[1])) / 2, y: bracket ? yy - 7 : yy - 6, class: "brt" }, br);
      tx.textContent = text;
    }
  }
  function at(t) {
    if (t == null) { cursor.setAttribute("visibility", "hidden"); return; }
    cursor.setAttribute("visibility", "visible");
    cursor.setAttribute("x1", x(t)); cursor.setAttribute("x2", x(t));
  }
  if (highlight) show(highlight);
  return { root, show, at };
}

function conductionSvg(onPick) {
  const root = svg("svg", { viewBox: "0 0 360 380", class: "heart" });
  svg("rect", { x: 72, y: 0, width: 34, height: 52, rx: 8, class: "vessel" }, root); // 上大静脈
  const atria = svg("g", { "data-part": "atria", class: "part" }, root);
  svg("ellipse", { cx: 115, cy: 100, rx: 72, ry: 55, class: "chamber" }, atria);
  svg("ellipse", { cx: 250, cy: 100, rx: 68, ry: 52, class: "chamber" }, atria);
  const vent = svg("g", { "data-part": "purkinje", class: "part" }, root);
  svg("path", { d: "M48,165 C40,260 120,330 182,370 C245,330 322,260 314,165 Z", class: "chamber" }, vent);
  svg("line", { x1: 182, y1: 165, x2: 182, y2: 360, class: "septum" }, root);
  const pk = svg("g", { "data-part": "purkinje", class: "part" }, root);
  for (const d of ["M118,300 L88,250 M118,300 L140,335 M118,300 L80,295",
    "M278,262 L302,215 M278,262 L300,290 M232,305 L210,340 M232,305 L262,320"]) svg("path", { d, class: "fiber" }, pk);
  const bundles = svg("g", { "data-part": "bundles", class: "part" }, root);
  svg("path", { d: "M180,198 L152,245 L118,300", class: "wire" }, bundles);
  svg("path", { d: "M184,198 L205,212 L250,232 L278,262", class: "wire" }, bundles);
  svg("path", { d: "M205,212 L222,262 L232,305", class: "wire" }, bundles);
  const his = svg("g", { "data-part": "his", class: "part" }, root);
  svg("path", { d: "M178,152 L182,198", class: "wire thick" }, his);
  const av = svg("g", { "data-part": "av", class: "part" }, root);
  svg("circle", { cx: 177, cy: 148, r: 9, class: "node" }, av);
  const sa = svg("g", { "data-part": "sa", class: "part" }, root);
  svg("circle", { cx: 92, cy: 62, r: 10, class: "node" }, sa);
  const labels = [[20, 58, "SA"], [195, 148, "AV"], [190, 185, "His"], [70, 228, "RBB"], [236, 216, "LAF"], [236, 290, "LPF"], [45, 330, "Purkinje"]];
  for (const [lx, ly, t] of labels) { const e = svg("text", { x: lx, y: ly, class: "lbl" }, root); e.textContent = t; }
  root.querySelectorAll(".part").forEach((g) => g.addEventListener("click", () => onPick(g.dataset.part)));
  function mark(parts) {
    root.querySelectorAll(".part").forEach((g) => g.classList.toggle("on", parts.includes(g.dataset.part)));
  }
  return { root, mark };
}

function widgetConduction(box, lang, U) {
  const wrap = el("div", "row2");
  const info = el("div", "partInfo");
  info.textContent = U.pick;
  const beat = beatSvg();
  const heart = conductionSvg((p) => {
    stop();
    idx = ORDER.indexOf(p);
    heart.mark([p]);
    beat.show(PARTS[p].span);
    beat.at(null);
    info.innerHTML = "";
    info.appendChild(el("b", null, PARTS[p][lang][0]));
    info.appendChild(el("p", null, PARTS[p][lang][1]));
  });
  const right = el("div");
  right.appendChild(beat.root);
  right.appendChild(el("div", "cap", U.schematic));
  // 1つの部位を STEP_MS ずつ見せ、その間に心電図のカーソルをその部位の時間帯だけ動かす
  const ORDER = ["sa", "atria", "av", "his", "bundles", "purkinje", "repol"];
  const STEP_MS = 3000;
  let raf = 0, idx = -1, playing = false;
  const showStep = (i, frac) => {
    const k = ORDER[i];
    const [a, b] = PARTS[k].span;
    heart.mark([k]);
    beat.show(PARTS[k].span);
    beat.at(a + (b - a) * frac);
    info.innerHTML = "";
    info.appendChild(el("div", "stepNo", `${i + 1} / ${ORDER.length}`));
    info.appendChild(el("b", null, PARTS[k][lang][0]));
    info.appendChild(el("p", null, PARTS[k][lang][1]));
  };
  const stop = () => { playing = false; cancelAnimationFrame(raf); playBtn.textContent = U.play; };
  const play = () => {
    playing = true;
    playBtn.textContent = U.pause;
    let t0 = performance.now() - Math.max(0, idx) * STEP_MS;
    if (idx >= ORDER.length - 1 || idx < 0) { idx = 0; t0 = performance.now(); }
    const tick = () => {
      const el_ = performance.now() - t0;
      idx = Math.floor(el_ / STEP_MS);
      if (idx >= ORDER.length) { idx = ORDER.length - 1; showStep(idx, 1); stop(); return; }
      showStep(idx, (el_ % STEP_MS) / STEP_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const playBtn = el("button", "primary", U.play);
  playBtn.onclick = () => (playing ? stop() : play());
  const prev = el("button", null, U.stepPrev);
  prev.onclick = () => { stop(); idx = Math.max(0, idx - 1); showStep(idx, 1); };
  const nextB = el("button", null, U.stepNext);
  nextB.onclick = () => { stop(); idx = Math.min(ORDER.length - 1, idx + 1); showStep(idx, 1); };
  const ctl = el("div", "chips");
  ctl.append(playBtn, prev, nextB);
  right.appendChild(ctl);
  right.appendChild(info);
  wrap.appendChild(heart.root);
  wrap.appendChild(right);
  box.appendChild(wrap);
}

function widgetWaves(box, lang, U) {
  const beat = beatSvg();
  const list = el("div", "chips");
  for (const [k, w] of Object.entries(WAVES)) {
    const b = el("button", null, w[lang]);
    b.onclick = () => {
      list.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      beat.show(w.span, w[lang], w.bracket);
    };
    list.appendChild(b);
  }
  box.appendChild(list);
  box.appendChild(beat.root);
  box.appendChild(el("div", "cap", U.schematic));
}

async function widgetPaper(box, lang, U, ctx) {
  const c = ctx.cases.find((x) => x.answer === "NORM");
  const sig = await ctx.loadSignal(c);
  const wrap = el("div", "paperWrap");
  const cv = el("canvas"), ov = el("canvas", "overlay"), ro = el("div", "readout");
  ro.hidden = true;
  wrap.append(cv, ov, ro);
  const scroller = el("div", "viewer");
  scroller.appendChild(wrap);
  box.appendChild(scroller);
  box.appendChild(el("div", "cap", U.paperCap));
  drawLeads(cv, [{ name: "II", sig: sig[1] }], c.fs, 10, 4);
  attachCalipers(ov, cv, () => 4, ro, U.caliper).reset();
  const ans = el("p");
  const b = el("button", null, U.showHr);
  b.onclick = () => {
    const rr = c.beats.slice(1).map((s, i) => (s - c.beats[i]) / c.fs).sort((p, q) => p - q);
    const med = rr[Math.floor(rr.length / 2)];
    ans.textContent = U.hrAns(Math.round(c.m.hr), Math.round(60 / med));
  };
  box.append(b, ans);
}

async function widgetSinus(box, lang, U, ctx) {
  const n = ctx.cases.find((x) => x.answer === "NORM");
  const a = ctx.cases.find((x) => x.answer === "AFIB");
  const [sn, sa] = await Promise.all([ctx.loadSignal(n), ctx.loadSignal(a)]);
  const pick = (s, name) => ({ name, sig: s[LEADS.indexOf(name)] });
  const rows = [pick(sn, "I"), pick(sn, "II"), pick(sn, "aVR"), pick(sn, "aVF"), { name: "II (AF)", sig: sa[1] }];
  const cv = el("canvas");
  const scroller = el("div", "viewer");
  scroller.appendChild(cv);
  box.appendChild(scroller);
  box.appendChild(el("div", "cap", U.sinusCap));
  drawLeads(cv, rows, n.fs, 6, 4);
}

const LIMB = [["I", 0], ["II", 60], ["III", 120], ["aVF", 90], ["aVL", -30], ["aVR", -150]];

function hexaxial(size, axis) {
  const c = size / 2, R = size / 2 - 34;
  const root = svg("svg", { viewBox: `0 0 ${size} ${size}`, class: "hex" });
  svg("circle", { cx: c, cy: c, r: R, class: "ring" }, root);
  for (const [name, deg] of LIMB) {
    const r = (deg * Math.PI) / 180;
    svg("line", { x1: c - R * Math.cos(r), y1: c - R * Math.sin(r), x2: c + R * Math.cos(r), y2: c + R * Math.sin(r), class: "leadline" }, root);
    const tx = svg("text", { x: c + (R + 18) * Math.cos(r), y: c + (R + 18) * Math.sin(r) + 4, class: "lbl mid" }, root);
    tx.textContent = `${name} ${deg > 0 ? "+" : ""}${deg}°`;
  }
  let arrow = null;
  if (axis != null) arrow = svg("line", { class: "axisArrow", "marker-end": "url(#ah)" }, root);
  const defs = svg("defs", {}, root);
  const m = svg("marker", { id: "ah", markerWidth: 8, markerHeight: 8, refX: 6, refY: 4, orient: "auto" }, defs);
  svg("path", { d: "M0,0 L8,4 L0,8 Z", class: "ahead" }, m);
  function set(deg) {
    if (!arrow) return;
    const r = (deg * Math.PI) / 180;
    arrow.setAttribute("x1", c); arrow.setAttribute("y1", c);
    arrow.setAttribute("x2", c + (R - 8) * Math.cos(r)); arrow.setAttribute("y2", c + (R - 8) * Math.sin(r));
  }
  if (axis != null) set(axis);
  return { root, set };
}

function chestSvg() {
  const root = svg("svg", { viewBox: "0 0 300 230", class: "chest" });
  svg("ellipse", { cx: 150, cy: 120, rx: 130, ry: 90, class: "ring" }, root);
  svg("ellipse", { cx: 165, cy: 120, rx: 45, ry: 35, class: "chamber" }, root);
  svg("rect", { x: 138, y: 196, width: 24, height: 20, rx: 4, class: "vessel" }, root); // 脊椎
  svg("rect", { x: 140, y: 30, width: 20, height: 22, rx: 3, class: "vessel" }, root); // 胸骨
  const pts = [["V1", 128, 38], ["V2", 172, 38], ["V3", 205, 50], ["V4", 232, 68], ["V5", 260, 100], ["V6", 276, 135]];
  for (const [n, x, y] of pts) {
    svg("circle", { cx: x, cy: y, r: 6, class: "node" }, root);
    const t = svg("text", { x, y: y - 10, class: "lbl mid" }, root);
    t.textContent = n;
  }
  const r = svg("text", { x: 20, y: 120, class: "lbl" }, root); r.textContent = "R";
  const l = svg("text", { x: 285, y: 120, class: "lbl" }, root); l.textContent = "L";
  return root;
}

function widgetLeads(box, lang, U) {
  const wrap = el("div", "row2");
  const a = el("div"); a.appendChild(el("div", "cap", U.limb)); a.appendChild(hexaxial(320, null).root);
  const b = el("div"); b.appendChild(el("div", "cap", U.chest)); b.appendChild(chestSvg());
  wrap.append(a, b);
  box.appendChild(wrap);
}

function qrsGlyph(amp) {
  // 振幅 amp（−1〜1）のQRSを小さく描く。正なら R 優位、負なら S 優位
  const root = svg("svg", { viewBox: "0 0 60 70", class: "glyph" });
  svg("line", { x1: 0, y1: 35, x2: 60, y2: 35, class: "g1" }, root);
  const r = Math.max(0.08, amp) * 28, s = Math.max(0.08, -amp) * 28;
  svg("path", { d: `M0,35 L22,35 L27,${35 - r} L33,${35 + s} L38,35 L60,35`, class: "trace" }, root);
  return root;
}

function classify(deg) {
  if (deg >= -30 && deg <= 90) return "normal";
  if (deg < -30 && deg >= -90) return "lad";
  if (deg > 90 && deg <= 180) return "rad";
  return "ext";
}

function widgetAxis(box, lang, U) {
  const wrap = el("div", "row2");
  const hx = hexaxial(300, 60);
  const right = el("div");
  const lab = el("div", "axisVal");
  const slider = el("input");
  Object.assign(slider, { type: "range", min: -180, max: 180, step: 5, value: 60 });
  const grid = el("div", "glyphs");
  const update = () => {
    const deg = Number(slider.value);
    hx.set(deg);
    lab.textContent = `${U.axisLabel} ${deg > 0 ? "+" : ""}${deg}°：${U.cls[classify(deg)]}`;
    grid.innerHTML = "";
    for (const [name, ld] of LIMB) {
      const cell = el("div", "glyphCell");
      cell.appendChild(qrsGlyph(Math.cos(((deg - ld) * Math.PI) / 180)));
      cell.appendChild(el("div", null, name));
      grid.appendChild(cell);
    }
  };
  slider.oninput = update;
  right.append(lab, slider, grid);
  wrap.append(hx.root, right);
  box.appendChild(wrap);
  update();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function quiz(box, lesson, lang, U) {
  box.appendChild(el("h3", null, U.check));
  lesson.quiz.forEach((q, qi) => {
    const card = el("div", "qcard");
    card.appendChild(el("p", "qq", `Q${qi + 1}. ${q.q[lang]}`));
    const opts = el("div", "qopts");
    const res = el("p", "qwhy");
    q.options.forEach((o, i) => {
      const b = el("button", null, o[lang]);
      b.onclick = () => {
        opts.querySelectorAll("button").forEach((x, j) => {
          x.disabled = true;
          if (j === q.answer) x.classList.add("correct");
          else if (j === i) x.classList.add("wrong");
        });
        res.textContent = `${i === q.answer ? U.correct : U.wrong}：${q.why[lang]}`;
      };
      opts.appendChild(b);
    });
    card.append(opts, res);
    box.appendChild(card);
  });
}

// 房室ブロックの模式図。P波は PP 0.8 秒で規則正しく出し、各P波の PR（ms）を型ごとに決める。null は伝わらないP波
const AVB_TYPES = {
  normal: { ja: "正常（PR一定）", en: "Normal (constant PR)", pr: [160] },
  first: { ja: "I度", en: "First degree", pr: [280] },
  wenck: { ja: "Wenckebach型", en: "Wenckebach", pr: [160, 260, 300, null] },
  mobitz2: { ja: "Mobitz II型", en: "Mobitz II", pr: [160, 160, 160, null] },
  twoToOne: { ja: "2:1", en: "2:1", pr: [180, null] },
  highGrade: { ja: "高度（3:1）", en: "High grade (3:1)", pr: [180, null, null] },
  complete: { ja: "III度（完全）", en: "Third degree (complete)", pr: null },
};

function avbStrip(type, lang) {
  const DUR = 8, PP = 0.8, PXS = 100, PXMV = 40, H = 170, base = 105;
  const W = DUR * PXS;
  const g = (t, c, s, a) => a * Math.exp(-((t - c) ** 2) / (2 * s * s));
  const pTimes = [];
  for (let tp = 0.3; tp < DUR - 0.1; tp += PP) pTimes.push(tp);
  const spec = AVB_TYPES[type];
  const qrs = [];
  const labels = [];
  if (spec.pr) {
    pTimes.forEach((tp, i) => {
      const pr = spec.pr[i % spec.pr.length];
      labels.push(pr == null ? "×" : String(pr));
      if (pr != null) qrs.push(tp + pr / 1000);
    });
  } else {
    for (let tq = 0.9; tq < DUR - 0.2; tq += 1.45) qrs.push(tq); // 接合部補充調律 約41/分
  }
  const v = (t) => {
    let y = 0;
    for (const tp of pTimes) y += g(t, tp + 0.04, 0.018, 0.15);
    for (const tq of qrs) y += g(t, tq + 0.006, 0.004, -0.08) + g(t, tq + 0.026, 0.007, 1.1) + g(t, tq + 0.046, 0.006, -0.25) + g(t, tq + 0.3, 0.045, 0.3);
    return y;
  };
  const root = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "beat avb" });
  for (let x = 0; x <= W; x += 4) svg("line", { x1: x, y1: 0, x2: x, y2: H, class: x % 20 ? "g1" : "g5" }, root);
  for (let y = base % 4; y <= H; y += 4) svg("line", { x1: 0, y1: y, x2: W, y2: y, class: Math.round(y - base) % 20 ? "g1" : "g5" }, root);
  let d = "";
  for (let t = 0; t <= DUR; t += 0.004) d += `${t ? "L" : "M"}${(t * PXS).toFixed(1)},${(base - v(t) * PXMV).toFixed(1)}`;
  svg("path", { d, class: "trace" }, root);
  pTimes.forEach((tp, i) => {
    const x = (tp + 0.04) * PXS;
    const p = svg("text", { x, y: 16, class: "pmark" }, root);
    p.textContent = "P";
    if (labels.length) {
      const l = svg("text", { x, y: H - 6, class: labels[i] === "×" ? "prx" : "prv" }, root);
      l.textContent = labels[i];
    }
  });
  return root;
}

async function widgetAvblock(box, lang, U, ctx) {
  const chips = el("div", "chips");
  const holder = el("div", "viewer");
  const note = el("div", "cap");
  const show = (k) => {
    chips.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.k === k));
    holder.innerHTML = "";
    holder.appendChild(avbStrip(k, lang));
    note.textContent = k === "complete" ? U.avbComplete : U.avbNote;
  };
  for (const [k, s] of Object.entries(AVB_TYPES)) {
    const b = el("button", null, s[lang]);
    b.dataset.k = k;
    b.onclick = () => show(k);
    chips.appendChild(b);
  }
  box.append(chips, holder, note);
  show("wenck");

  box.appendChild(el("h3", null, U.avbReal));
  // P波が見やすい記録を優先する（PTB-XL 3948：II誘導のP波 0.15 mV、8620：心房82/分、心室37/分）
  const pick = (dx, rec) => ctx.cases.find((x) => x.answer === dx && x.source.record === rec) || ctx.cases.find((x) => x.answer === dx);
  const first = pick("1AVB", "3948");
  const third = pick("3AVB", "8620");
  const two = ctx.cases.find((x) => x.answer === "M_2TO1AVB");
  const [s1, s3, s2] = await Promise.all([ctx.loadSignal(first), ctx.loadSignal(third), ctx.loadSignal(two)]);
  const c12 = el("canvas");
  const v12 = el("div", "viewer");
  v12.appendChild(c12);
  box.append(v12, el("div", "cap", U.avbReal12));
  drawLeads(c12, [{ name: `II（${U.avb1}）`, sig: s1[1] }, { name: `II（${U.avb3}）`, sig: s3[1] }], first.fs, 10, 4);
  const cm = el("canvas");
  const vm = el("div", "viewer");
  vm.appendChild(cm);
  box.append(vm, el("div", "cap", U.avbRealMon));
  drawLeads(cm, [{ name: `${two.lead}（2:1）`, sig: s2[0] }], two.fs, 10, 4);
}

// 電気軸は「4分割図 → スライダー → 実記録」の順に並べる
async function widgetAxisAll(box, lang, U, ctx) {
  await widgetAxisQuad(box, lang, ctx);
  const h = el("h3", null, lang === "ja" ? "スライダーで電気軸を動かしてみる" : "Move the axis with the slider");
  box.appendChild(h);
  widgetAxis(box, lang, U);
  await widgetAxisReal(box, lang, ctx);
}

const WIDGETS = {
  avblock: widgetAvblock, conduction: widgetConduction, waves: widgetWaves, paper: widgetPaper, sinus: widgetSinus,
  leads: widgetLeads, axis: widgetAxisAll,
  ectopic: (b, lang, U, ctx) => widgetEctopic(b, lang, ctx),
  tachy: (b, lang, U, ctx) => widgetTachy(b, lang, ctx),
  brady: (b, lang, U, ctx) => widgetBrady(b, lang, ctx),
  bbb: (b, lang, U, ctx) => widgetBbb(b, lang, ctx),
  stemi: (b, lang, U, ctx) => widgetStemi(b, lang, ctx),
};

export function renderBasics(listEl, bodyEl, lang, ctx, current, go) {
  const U = UI[lang];
  listEl.innerHTML = "";
  let group = null;
  LESSONS.forEach((l, i) => {
    if (l.group !== group) {
      group = l.group;
      listEl.appendChild(el("div", "group", GROUPS[group][lang]));
    }
    const b = el("button", i === current ? "on" : "");
    const dot = el("span", "dot");
    dot.style.background = GROUPS[l.group].color;
    b.append(dot, `${i + 1}. ${l.title[lang]}`);
    b.onclick = () => go(i);
    listEl.appendChild(b);
  });
  const lesson = LESSONS[current];
  bodyEl.innerHTML = "";
  bodyEl.appendChild(el("h2", null, `${current + 1}. ${lesson.title[lang]}`));
  if (lesson.point) {
    const p = el("div", "point");
    p.append(el("span", "tag", U.point), lesson.point[lang]);
    bodyEl.appendChild(p);
  }
  const text = el("div", "lessonText");
  text.innerHTML = lesson.body[lang];
  bodyEl.appendChild(text);
  if (lesson.widget) {
    const w = el("div", "widget");
    bodyEl.appendChild(w);
    WIDGETS[lesson.widget](w, lang, U, ctx);
  }
  quiz(bodyEl, lesson, lang, U);
  const nav = el("div", "nav");
  if (current > 0) { const p = el("button", null, U.prev); p.onclick = () => go(current - 1); nav.appendChild(p); }
  if (current < LESSONS.length - 1) { const n = el("button", "primary", U.next); n.onclick = () => go(current + 1); nav.appendChild(n); }
  bodyEl.appendChild(nav);
}
