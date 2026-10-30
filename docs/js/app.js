import { DX, SRC, SCP, BEAT } from "./dx.js";
import { draw12, drawStrip, attachCalipers, LEADS } from "./paper.js";
import { Monitor } from "./monitor.js";
import { renderBasics } from "./basics.js";
import { sync } from "./sync.js";

const T = {
  ja: {
    title: "心電図トレーニング", pageBasics: "基礎", pagePractice: "演習", level: "級",
    synthetic: "合成波形（電気活動がない状態を作ったもの）",
    stageNote: "", lv4: "4級", lv3: "3級（4級を含む）", lv2: "2級（準備中）", lv1: "1級（準備中）",
    mode: "形式", modeMix: "ミックス", mode12: "12誘導", modeMon: "モニター", weak: "苦手を優先",
    stats: "成績", reset: "成績をリセット", close: "閉じる", next: "次の問題",
    caliperHint: "記録紙の上をドラッグすると時間と電位を測れます（ダブルクリックで消去）",
    zoom: "拡大", tabPaper: "記録紙（12誘導）", tabStrip: "記録紙で見る", tabMon: "モニター", tabPlay: "II誘導をモニターで流す",
    q12: "この12誘導心電図で認められる所見を1つ選んでください。",
    qMon: "このモニター心電図の所見として正しいものを1つ選んでください。",
    soundOn: "同期音 ON", soundOff: "同期音 OFF",
    ok: "正解", ng: "不正解", answer: "正解", criteria: "判定基準", optionsKey: "選択肢の要点",
    measured: "この記録の自動計測値（GE 12SL、PTB-XL+）", findings: "循環器医がつけた所見（PTB-XL）",
    beats: "拍の内訳（MIT-BIH の医師による注釈）", source: "出典", stage: "梗塞の病期",
    hr: "心拍数", pr: "PR", qrs: "QRS幅", qtqtc: "QT / QTc", axis: "電気軸", sokolow: "SV1＋RV5/6",
    likelihood: "確からしさ", unknown: "記載なし",
    n: (i) => `第${i}問`, k12: "12誘導", kMon: "モニター",
    patient: (a, s) => `${a == null ? "" : a + "歳"} ${s === "M" ? "男性" : "女性"}`,
    noCase: "この条件の問題がありません。",
    caliper: (ms, mv) => `Δt ${Math.round(ms)} ms（${ms > 0 ? Math.round(60000 / ms) : "--"}/分）  ΔV ${mv.toFixed(2)} mV`,
    statsHead: ["所見", "回答数", "正答率"], none: "まだ回答がありません。",
    resetConfirm: "成績をすべて消します（同期しているほかの端末の分も消えます）。よろしいですか？",
    syncTitle: "端末間の同期", syncOff: "同期は未設定です。README の手順で Firebase を設定すると、Mac とスマホで同じ成績を使えます。",
    syncConnecting: "接続しています…", syncError: "同期サーバーにつながりませんでした。", syncRetry: "もう一度", syncStop: "同期をやめる",
    syncOn: (code, n) => `同期中（コード ${code}、${n}台）`, syncCopy: "同期リンクをコピー", syncCopied: "コピーしました",
    syncHint: "このリンクをスマホに送って開くと、同じ成績を共有できます。リンクを知っている人は誰でも成績を読めるので、他の人には送らないでください。",
    syncNone: "最初の端末で「同期コードを作る」を押し、ほかの端末ではそのコードを入力するか、同期リンクを開いてください。",
    syncNew: "同期コードを作る", syncUse: "このコードを使う",
    offlineProgress: (d, n) => `オフライン用のデータを保存中 ${d}/${n}`, offlineDone: "オフラインでも使えます",
    credits: "心電図データ：PTB-XL（CC BY 4.0）、PTB-XL+（CC BY 4.0）、MIT-BIH Arrhythmia Database と MIT-BIH Malignant Ventricular Ectopy Database（ODC-By 1.0）、いずれも PhysioNet で公開。解説は学習用の要約で、診療に使うものではありません。",
    noteMon: "20秒の区間を繰り返し再生しています。",
  },
  en: {
    title: "ECG Trainer", pageBasics: "Basics", pagePractice: "Practice", level: "Level",
    synthetic: "Synthetic waveform (constructed to contain no electrical activity)",
    stageNote: "", lv4: "Grade 4", lv3: "Grade 3 (incl. 4)", lv2: "Grade 2 (coming)", lv1: "Grade 1 (coming)",
    mode: "Format", modeMix: "Mixed", mode12: "12-lead", modeMon: "Monitor", weak: "Focus on weak areas",
    stats: "Progress", reset: "Reset progress", close: "Close", next: "Next question",
    caliperHint: "Drag on the paper to measure time and voltage (double-click to clear)",
    zoom: "Zoom", tabPaper: "Paper (12-lead)", tabStrip: "Paper strip", tabMon: "Monitor", tabPlay: "Play lead II on monitor",
    q12: "Select the one finding present in this 12-lead ECG.",
    qMon: "Select the correct interpretation of this monitor ECG.",
    soundOn: "Beep ON", soundOff: "Beep OFF",
    ok: "Correct", ng: "Incorrect", answer: "Answer", criteria: "Criteria", optionsKey: "Key points of each option",
    measured: "Automatic measurements for this record (GE 12SL, PTB-XL+)", findings: "Cardiologist statements (PTB-XL)",
    beats: "Beat composition (MIT-BIH physician annotations)", source: "Source", stage: "Infarction stage",
    hr: "Heart rate", pr: "PR", qrs: "QRS", qtqtc: "QT / QTc", axis: "Axis", sokolow: "SV1 + RV5/6",
    likelihood: "likelihood", unknown: "not stated",
    n: (i) => `Question ${i}`, k12: "12-lead", kMon: "Monitor",
    patient: (a, s) => `${a == null ? "" : a + " y/o"} ${s === "M" ? "male" : "female"}`,
    noCase: "No questions match these settings.",
    caliper: (ms, mv) => `Δt ${Math.round(ms)} ms (${ms > 0 ? Math.round(60000 / ms) : "--"}/min)  ΔV ${mv.toFixed(2)} mV`,
    statsHead: ["Finding", "Answered", "Accuracy"], none: "No answers yet.",
    resetConfirm: "Erase all progress, including other synced devices?",
    syncTitle: "Sync between devices", syncOff: "Sync is not set up. Follow the README to configure Firebase and share progress between your Mac and phone.",
    syncConnecting: "Connecting…", syncError: "Could not reach the sync server.", syncRetry: "Retry", syncStop: "Stop syncing",
    syncOn: (code, n) => `Syncing (code ${code}, ${n} device${n > 1 ? "s" : ""})`, syncCopy: "Copy sync link", syncCopied: "Copied",
    syncHint: "Open this link on your phone to share the same progress. Anyone with the link can read your progress, so keep it to yourself.",
    syncNone: "On your first device press “Create sync code”; on other devices enter that code or open the sync link.",
    syncNew: "Create sync code", syncUse: "Use this code",
    offlineProgress: (d, n) => `Saving data for offline use ${d}/${n}`, offlineDone: "Available offline",
    credits: "ECG data: PTB-XL (CC BY 4.0), PTB-XL+ (CC BY 4.0), MIT-BIH Arrhythmia Database and MIT-BIH Malignant Ventricular Ectopy Database (ODC-By 1.0), all from PhysioNet. Explanations are study summaries, not clinical guidance.",
    noteMon: "A 20-second segment is played in a loop.",
  },
};

// PTB-XL のコードが別の選択肢を含意する場合（選択肢から外す）
const IMPLIES = {
  ILMI: ["IMI"], IPLMI: ["IMI"], IPMI: ["IMI"], AMI: ["ASMI"], VCLVH: ["LVH"], LPR: ["1AVB"],
  BIGU: ["PVC", "PAC"], TRIGU: ["PVC", "PAC"], "PRC(S)": ["PVC", "PAC"], SVTAC: ["STACH"], PSVT: ["STACH"],
};

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 保存できない環境では記録しない */ } },
};

const state = {
  lang: store.get("lang", "ja"),
  level: store.get("level", "4"),
  mode: store.get("mode", "mix"),
  weak: store.get("weak", false),
  stats: store.get("stats", {}),
  scale: store.get("scale", 4),
  page: store.get("page", "basics"),
  lesson: store.get("lesson", 0),
  cases: [],
  recent: [],
  count: 0,
  cur: null,
  view: null,
  sig: null,
};
const t = (k) => T[state.lang][k];
const nm = (id) => DX[id].name[state.lang];
const L = (pair) => pair[state.lang === "ja" ? 0 : 1];

const monitor = new Monitor($("monitor"), $("hr"));
const calipers = attachCalipers($("overlay"), $("paper"), () => state.scale, $("readout"), (ms, mv) => t("caliper")(ms, mv));

async function init() {
  const [a, b] = await Promise.all([
    fetch("data/cases_12lead.json").then((r) => r.json()),
    fetch("data/cases_monitor.json").then((r) => r.json()),
  ]);
  state.cases = [...a, ...b];
  // 保存されている級が準備中に戻った場合は4級にする
  if (!$("level").querySelector(`option[value="${state.level}"]:not([disabled])`)) state.level = "4";
  $("level").value = state.level;
  $("mode").value = state.mode;
  $("weak").checked = state.weak;
  bind();
  applyLang();
  setPage(state.page);
}

function setPage(p) {
  state.page = p;
  store.set("page", p);
  const basics = p === "basics";
  $("basicsPage").hidden = !basics;
  $("practicePage").hidden = basics;
  document.querySelectorAll(".pc").forEach((e) => { e.hidden = basics; });
  $("pageBasics").classList.toggle("on", basics);
  $("pagePractice").classList.toggle("on", !basics);
  monitor.stop();
  if (basics) showLesson(state.lesson);
  else if (!state.cur) next();
  else rerender();
}

function showLesson(i) {
  state.lesson = i;
  store.set("lesson", i);
  renderBasics($("lessonList"), $("lesson"), state.lang, { cases: state.cases, loadSignal }, i, (j) => { showLesson(j); window.scrollTo(0, 0); });
}

function bind() {
  $("level").onchange = (e) => { state.level = e.target.value; store.set("level", state.level); next(); };
  $("mode").onchange = (e) => { state.mode = e.target.value; store.set("mode", state.mode); next(); };
  $("weak").onchange = (e) => { state.weak = e.target.checked; store.set("weak", state.weak); };
  $("langBtn").onclick = () => {
    state.lang = state.lang === "ja" ? "en" : "ja";
    store.set("lang", state.lang);
    applyLang();
    if (state.page === "basics") showLesson(state.lesson); else rerender();
  };
  $("pageBasics").onclick = () => setPage("basics");
  $("pagePractice").onclick = () => setPage("practice");
  $("nextBtn").onclick = next;
  $("statsBtn").onclick = showStats;
  $("closeStats").onclick = () => $("statsDlg").close();
  $("resetBtn").onclick = async () => {
    if (!confirm(t("resetConfirm"))) return;
    state.stats = {};
    store.set("stats", {});
    await sync.resetAll();
    sync.push({}, true);
    showStats();
  };
  $("zoomIn").onclick = () => zoom(1);
  $("zoomOut").onclick = () => zoom(-1);
  $("soundBtn").onclick = () => { monitor.setSound(!monitor.sound); soundLabel(); };
  $("gainUp").onclick = () => setGain(2);
  $("gainDown").onclick = () => setGain(0.5);
  window.addEventListener("resize", () => { if (state.view === "monitor") { monitor.resize(); } });
  document.addEventListener("keydown", (e) => {
    if (state.page !== "practice" || !state.cur || e.target.tagName === "SELECT" || e.target.tagName === "INPUT" || $("statsDlg").open) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 9 && !state.cur.done) { const b = $("options").querySelectorAll("button")[n - 1]; if (b) b.click(); }
    if ((e.key === "Enter" || e.key === " " || e.key === "ArrowRight") && state.cur.done) { e.preventDefault(); next(); }
  });
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
  $("langBtn").textContent = state.lang === "ja" ? "English" : "日本語";
  $("nextBtn").textContent = t("next");
  $("credits").textContent = t("credits");
  soundLabel();
}

function soundLabel() { $("soundBtn").textContent = monitor.sound ? t("soundOn") : t("soundOff"); }
function setGain(f) {
  monitor.gain = Math.min(4, Math.max(0.25, monitor.gain * f));
  $("gainVal").textContent = `×${monitor.gain}`;
}
function zoom(d) {
  state.scale = Math.min(8, Math.max(3, state.scale + d));
  store.set("scale", state.scale);
  if (state.view !== "monitor") drawView();
}

function inScope(c) {
  const lv = Number(state.level);
  const kindOk = state.mode === "mix" || c.kind === state.mode;
  return kindOk && DX[c.answer].level >= lv;
}

function weight(c) {
  if (!state.weak) return 1;
  const s = allStats()[c.answer];
  if (!s || !s.n) return 1.5;
  return 1 + 4 * (1 - s.ok / s.n);
}

function pickCase() {
  const pool = state.cases.filter((c) => inScope(c) && !state.recent.includes(c.id));
  const all = pool.length ? pool : state.cases.filter(inScope);
  if (!all.length) return null;
  // 所見ごとの偏りを避けるため、まず所見を選び、その中から記録を選ぶ
  const byDx = {};
  for (const c of all) (byDx[c.answer] ||= []).push(c);
  const dxs = Object.keys(byDx);
  const w = dxs.map((d) => weight(byDx[d][0]));
  let r = Math.random() * w.reduce((s, x) => s + x, 0);
  let d = dxs[0];
  for (let i = 0; i < dxs.length; i++) { r -= w[i]; if (r <= 0) { d = dxs[i]; break; } }
  const list = byDx[d];
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function buildOptions(c) {
  const present = new Set(c.present);
  for (const code of c.present) for (const x of IMPLIES[code] || []) present.add(x);
  const lv = Number(state.level);
  const ok = (id) => id !== c.answer && !present.has(id) && DX[id].kind === c.kind && DX[id].level >= lv;
  const confuse = shuffle(DX[c.answer].confuse.filter(ok)).slice(0, 2);
  const rest = shuffle(Object.keys(DX).filter((id) => ok(id) && !confuse.includes(id)));
  return shuffle([c.answer, ...confuse, ...rest].slice(0, 5));
}

async function loadSignal(c) {
  const buf = await fetch(`data/${c.file}`).then((r) => r.arrayBuffer());
  const all = new Int16Array(buf);
  if (c.kind === "monitor") return [all];
  return LEADS.map((_, i) => all.subarray(i * c.n, (i + 1) * c.n));
}

async function next() {
  monitor.stop();
  const c = pickCase();
  if (!c) { $("meta").textContent = t("noCase"); $("options").innerHTML = ""; return; }
  state.recent = [c.id, ...state.recent].slice(0, 15);
  state.count += 1;
  state.cur = { c, options: buildOptions(c), done: false, chosen: null, n: state.count };
  state.sig = await loadSignal(c);
  state.view = c.kind === "monitor" ? "monitor" : "paper";
  rerender();
}

function rerender() {
  const { c } = state.cur;
  const parts = [t("n")(state.cur.n), c.kind === "monitor" ? t("kMon") : t("k12")];
  if (c.kind === "12lead") parts.push(t("patient")(c.age, c.sex));
  else parts.push(t("noteMon"));
  $("meta").textContent = parts.join(" / ");
  renderTabs();
  drawView();
  $("prompt").textContent = c.kind === "monitor" ? t("qMon") : t("q12");
  renderOptions();
  if (state.cur.done) renderExplain(); else $("explain").hidden = true;
  $("nextBtn").hidden = !state.cur.done;
}

function renderTabs() {
  const { c } = state.cur;
  const tabs = c.kind === "monitor"
    ? [["monitor", t("tabMon")], ["strip", t("tabStrip")]]
    : [["paper", t("tabPaper")], ["play", t("tabPlay")]];
  const el = $("tabs");
  el.innerHTML = "";
  for (const [v, label] of tabs) {
    const b = document.createElement("button");
    b.textContent = label;
    b.className = state.view === v ? "on" : "";
    b.onclick = () => { state.view = v; renderTabs(); drawView(); };
    el.appendChild(b);
  }
}

function drawView() {
  const { c } = state.cur;
  const paper = state.view === "paper" || state.view === "strip";
  $("paperWrap").hidden = !paper;
  $("paperTools").hidden = !paper;
  $("monitorWrap").hidden = paper;
  monitor.stop();
  if (paper) {
    if (state.view === "paper") draw12($("paper"), state.sig, c.fs, state.scale);
    else drawStrip($("paper"), state.sig[0], c.fs, c.lead, state.scale);
    calipers.reset();
  } else {
    const sig = c.kind === "monitor" ? state.sig[0] : state.sig[1]; // 12誘導なら II誘導
    const beats = c.kind === "monitor" ? c.beats : c.beats.map((s) => s / c.fs);
    $("monLead").textContent = c.kind === "monitor" ? c.lead : "II";
    monitor.load(sig, c.fs, beats);
    monitor.start();
  }
}

function renderOptions() {
  const el = $("options");
  el.innerHTML = "";
  state.cur.options.forEach((id, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.innerHTML = `<span class="num">${i + 1}</span><span></span>`;
    b.lastChild.textContent = nm(id);
    if (state.cur.done) {
      b.disabled = true;
      if (id === state.cur.c.answer) b.classList.add("correct");
      else if (id === state.cur.chosen) b.classList.add("wrong");
    }
    b.onclick = () => answer(id);
    li.appendChild(b);
    el.appendChild(li);
  });
}

function answer(id) {
  if (state.cur.done) return;
  const { c } = state.cur;
  state.cur.done = true;
  state.cur.chosen = id;
  const s = (state.stats[c.answer] ||= { n: 0, ok: 0 });
  s.n += 1;
  if (id === c.answer) s.ok += 1;
  store.set("stats", state.stats);
  sync.push(state.stats);
  renderOptions();
  renderExplain();
  $("nextBtn").hidden = false;
  $("nextBtn").focus();
}

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

function renderExplain() {
  const { c, chosen } = state.cur;
  const box = $("explain");
  box.innerHTML = "";
  box.hidden = false;
  const good = chosen === c.answer;
  box.appendChild(el("div", `${good ? t("ok") : t("ng")}　${t("answer")}：${nm(c.answer)}`, `verdict ${good ? "ok" : "ng"}`));

  box.appendChild(el("h3", t("criteria")));
  box.appendChild(el("p", DX[c.answer].criteria[state.lang]));
  box.appendChild(el("p", `${t("source")}：${SRC[DX[c.answer].src][state.lang]}`, "src"));

  box.appendChild(el("h3", t("optionsKey")));
  const ul = el("ul");
  for (const id of state.cur.options) ul.appendChild(el("li", `${nm(id)}：${DX[id].key[state.lang]}`));
  box.appendChild(ul);

  if (c.kind === "12lead") {
    const m = c.m;
    const f = (v, u) => (v == null ? "—" : `${Math.round(v)} ${u}`);
    box.appendChild(el("h3", t("measured")));
    const tb = el("table");
    const rows = [
      [t("hr"), f(m.hr, "/min")], [t("pr"), f(m.pr, "ms")], [t("qrs"), f(m.qrs, "ms")],
      [t("qtqtc"), `${f(m.qt, "ms")} / ${f(m.qtc, "ms")}`], [t("axis"), f(m.axis, "°")],
      [t("sokolow"), m.sokolow == null ? "—" : `${m.sokolow.toFixed(2)} mV`],
    ];
    for (const [k, v] of rows) { const tr = el("tr"); tr.appendChild(el("th", k)); tr.appendChild(el("td", v)); tb.appendChild(tr); }
    box.appendChild(tb);
    box.appendChild(el("h3", t("findings")));
    const fl = el("ul");
    for (const [code, v] of Object.entries(c.scp)) {
      const name = SCP[code] ? L(SCP[code]) : code;
      fl.appendChild(el("li", `${name}（${code}）${v > 0 ? `　${t("likelihood")} ${v}` : ""}`));
    }
    box.appendChild(fl);
    if (c.stage && c.stage !== "unknown") box.appendChild(el("p", `${t("stage")}：${c.stage}${t("stageNote")}`, "src"));
  } else {
    box.appendChild(el("h3", t("beats")));
    const cnt = {};
    for (const s of c.beatTypes) cnt[s] = (cnt[s] || 0) + 1;
    const keys = Object.keys(cnt);
    if (keys.length) {
      const bl = el("ul");
      for (const k of keys) bl.appendChild(el("li", `${BEAT[k] ? L(BEAT[k]) : k}：${cnt[k]}`));
      box.appendChild(bl);
    } else {
      box.appendChild(el("p", t("unknown"), "src"));
    }
  }
  const s = c.source;
  if (s.db === "synthetic") { box.appendChild(el("p", `${t("source")}：${t("synthetic")}`, "src")); return; }
  const p = el("p", null, "src");
  p.append(`${t("source")}：${s.db}　record ${s.record}${s.start_s != null ? `（${s.start_s} s〜）` : ""}　${s.license}　`);
  const a = el("a", s.url);
  a.href = s.url; a.target = "_blank"; a.rel = "noopener";
  p.appendChild(a);
  box.appendChild(p);
}

// この端末の成績と、同期している他の端末の成績の合計
function allStats() {
  const sum = {};
  for (const src of [state.stats, sync.others]) {
    for (const [k, s] of Object.entries(src)) {
      const x = (sum[k] ||= { n: 0, ok: 0 });
      x.n += s.n; x.ok += s.ok;
    }
  }
  return sum;
}

function renderSync() {
  const box = $("syncBody");
  box.innerHTML = "";
  const btn = (label, fn, cls) => { const b = el("button", label, cls); b.onclick = fn; return b; };
  const st = sync.status;
  if (st === "off") { box.appendChild(el("p", t("syncOff"), "src")); return; }
  if (st === "connecting") { box.appendChild(el("p", t("syncConnecting"))); return; }
  if (st === "error") {
    box.appendChild(el("p", t("syncError")));
    box.append(btn(t("syncRetry"), () => sync.connect()), btn(t("syncStop"), () => sync.stop()));
    return;
  }
  if (st === "on") {
    box.appendChild(el("p", t("syncOn")(sync.pretty(), sync.devices || 1)));
    const msg = el("span", null, "src");
    box.append(
      btn(t("syncCopy"), async () => {
        try { await navigator.clipboard.writeText(sync.link()); msg.textContent = t("syncCopied"); } catch { msg.textContent = sync.link(); }
      }, "primary"),
      btn(t("syncStop"), () => sync.stop()),
      msg,
    );
    box.appendChild(el("p", t("syncHint"), "src"));
    return;
  }
  // 未接続：新しく作るか、別の端末のコードを入れる
  box.appendChild(el("p", t("syncNone"), "src"));
  const input = el("input");
  input.placeholder = "XXXXX-XXXXX-XXXXX-XXXXX";
  input.className = "codeInput";
  box.append(
    btn(t("syncNew"), () => sync.newCode(), "primary"),
    input,
    btn(t("syncUse"), async () => { if (!(await sync.useCode(input.value))) input.classList.add("bad"); }),
  );
}

function showStats() {
  renderSync();
  const body = $("statsBody");
  body.innerHTML = "";
  const stats = allStats();
  const ids = Object.keys(stats).filter((k) => DX[k] && stats[k].n);
  if (!ids.length) { body.appendChild(el("p", t("none"))); if (!$("statsDlg").open) $("statsDlg").showModal(); return; }
  ids.sort((a, b) => stats[a].ok / stats[a].n - stats[b].ok / stats[b].n);
  const tb = el("table");
  const hr = el("tr");
  for (const h of t("statsHead")) hr.appendChild(el("th", h));
  tb.appendChild(hr);
  for (const id of ids) {
    const s = stats[id];
    const tr = el("tr");
    tr.appendChild(el("td", `${nm(id)}（${DX[id].kind === "monitor" ? t("kMon") : t("k12")}）`));
    tr.appendChild(el("td", String(s.n)));
    tr.appendChild(el("td", `${Math.round((100 * s.ok) / s.n)}%`));
    tb.appendChild(tr);
  }
  body.appendChild(tb);
  if (!$("statsDlg").open) $("statsDlg").showModal();
}

// オフラインで使えるように、心電図データをまとめて保存しておく（初回だけ。約23 MB）
async function setupOffline() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register("sw.js");
    await navigator.serviceWorker.ready;
    const files = state.cases.map((c) => `data/${c.file}`);
    if (store.get("offlineCount", 0) === files.length) { $("offline").textContent = t("offlineDone"); return; }
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e.data?.type !== "cacheProgress") return;
      const { done, total } = e.data;
      $("offline").textContent = done < total ? t("offlineProgress")(done, total) : t("offlineDone");
      if (done === total) store.set("offlineCount", total);
    });
    (reg.active || navigator.serviceWorker.controller)?.postMessage({ type: "cacheData", files });
  } catch (e) {
    console.warn(e);
  }
}

init().then(() => {
  sync.init(() => {
    if ($("statsDlg").open) showStats();
  });
  setupOffline();
});
