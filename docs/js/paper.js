// 記録紙の描画。25 mm/s、10 mm/mV。座標はすべて mm で計算し、最後に px/mm（scale）を掛ける。

const SPEED = 25; // mm/s
const GAIN = 10; // mm/mV
const LAYOUT = [
  ["I", "aVR", "V1", "V4"],
  ["II", "aVL", "V2", "V5"],
  ["III", "aVF", "V3", "V6"],
];
export const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];

const COLORS = {
  bg: "#fff8f6",
  minor: "#f6cfc9",
  major: "#e79a90",
  trace: "#1a1a1a",
  label: "#333",
};

function setup(canvas, wMm, hMm, scale) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${wMm * scale}px`;
  canvas.style.height = `${hMm * scale}px`;
  canvas.width = Math.round(wMm * scale * dpr);
  canvas.height = Math.round(hMm * scale * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0); // 以後 1 単位 = 1 mm
  return ctx;
}

function grid(ctx, wMm, hMm, scale) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, wMm, hMm);
  ctx.lineWidth = 0.6 / scale;
  ctx.strokeStyle = COLORS.minor;
  ctx.beginPath();
  for (let x = 0; x <= wMm; x += 1) { if (x % 5) { ctx.moveTo(x, 0); ctx.lineTo(x, hMm); } }
  for (let y = 0; y <= hMm; y += 1) { if (y % 5) { ctx.moveTo(0, y); ctx.lineTo(wMm, y); } }
  ctx.stroke();
  ctx.lineWidth = 1.1 / scale;
  ctx.strokeStyle = COLORS.major;
  ctx.beginPath();
  for (let x = 0; x <= wMm; x += 5) { ctx.moveTo(x, 0); ctx.lineTo(x, hMm); }
  for (let y = 0; y <= hMm; y += 5) { ctx.moveTo(0, y); ctx.lineTo(wMm, y); }
  ctx.stroke();
}

// 1 mV、0.2 秒の較正波
function calibration(ctx, x, y0, scale) {
  ctx.strokeStyle = COLORS.trace;
  ctx.lineWidth = 1.3 / scale;
  ctx.beginPath();
  ctx.moveTo(x, y0);
  ctx.lineTo(x + 1, y0);
  ctx.lineTo(x + 1, y0 - GAIN);
  ctx.lineTo(x + 6, y0 - GAIN);
  ctx.lineTo(x + 6, y0);
  ctx.lineTo(x + 7, y0);
  ctx.stroke();
}

function trace(ctx, sig, fs, from, to, x0, y0, scale) {
  const a = Math.max(0, Math.floor(from * fs));
  const b = Math.min(sig.length, Math.ceil(to * fs));
  ctx.strokeStyle = COLORS.trace;
  ctx.lineWidth = 1.25 / scale;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = a; i < b; i++) {
    const x = x0 + ((i / fs) - from) * SPEED;
    const y = y0 - (sig[i] / 1000) * GAIN;
    if (i === a) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function label(ctx, text, x, y, scale) {
  ctx.fillStyle = COLORS.label;
  ctx.font = `600 ${13 / scale}px system-ui, sans-serif`;
  ctx.fillText(text, x, y);
}

// 12誘導（4列×3段、2.5秒ずつ）と、II誘導10秒のリズムストリップ
export function draw12(canvas, leads, fs, scale) {
  const left = 10, colW = 2.5 * SPEED, rowH = 30, top = 4;
  const wMm = left + colW * 4 + 4;
  const hMm = top + rowH * 4 + 6;
  const ctx = setup(canvas, wMm, hMm, scale);
  grid(ctx, wMm, hMm, scale);
  const byName = Object.fromEntries(LEADS.map((n, i) => [n, leads[i]]));
  for (let r = 0; r < 3; r++) {
    const y0 = top + rowH * r + 18;
    calibration(ctx, 1.5, y0, scale);
    for (let c = 0; c < 4; c++) {
      const name = LAYOUT[r][c];
      const x0 = left + colW * c;
      trace(ctx, byName[name], fs, c * 2.5, (c + 1) * 2.5, x0, y0, scale);
      label(ctx, name, x0 + 1, y0 - 11, scale);
      if (c > 0) { // 誘導の切り替わり位置の目印
        ctx.lineWidth = 1.3 / scale;
        ctx.beginPath(); ctx.moveTo(x0, y0 - 3); ctx.lineTo(x0, y0 + 3); ctx.stroke();
      }
    }
  }
  const y0 = top + rowH * 3 + 18;
  calibration(ctx, 1.5, y0, scale);
  trace(ctx, byName.II, fs, 0, 10, left, y0, scale);
  label(ctx, "II", left + 1, y0 - 11, scale);
  footer(ctx, wMm, hMm, scale);
  return { wMm, hMm, left };
}

// モニター波形を記録紙に出したもの（10秒ずつの段）
export function drawStrip(canvas, sig, fs, leadName, scale) {
  const left = 10, rowH = 40, top = 4;
  const dur = sig.length / fs;
  const rows = Math.ceil(dur / 10);
  const wMm = left + 10 * SPEED + 4;
  const hMm = top + rowH * rows + 6;
  const ctx = setup(canvas, wMm, hMm, scale);
  grid(ctx, wMm, hMm, scale);
  for (let r = 0; r < rows; r++) {
    const y0 = top + rowH * r + 24;
    calibration(ctx, 1.5, y0, scale);
    trace(ctx, sig, fs, r * 10, (r + 1) * 10, left, y0, scale);
    label(ctx, `${leadName}  ${r * 10}–${(r + 1) * 10} s`, left + 1, y0 - 18, scale);
  }
  footer(ctx, wMm, hMm, scale);
  return { wMm, hMm, left };
}

// 任意の誘導を縦に並べる（基礎編の図に使う）
export function drawLeads(canvas, rows, fs, seconds, scale) {
  const left = 10, rowH = 28, top = 4;
  const wMm = left + seconds * SPEED + 4;
  const hMm = top + rowH * rows.length + 6;
  const ctx = setup(canvas, wMm, hMm, scale);
  grid(ctx, wMm, hMm, scale);
  rows.forEach((row, r) => {
    const y0 = top + rowH * r + 17;
    calibration(ctx, 1.5, y0, scale);
    trace(ctx, row.sig, fs, 0, seconds, left, y0, scale);
    label(ctx, row.name, left + 1, y0 - 11, scale);
  });
  footer(ctx, wMm, hMm, scale);
  return { wMm, hMm, left };
}

function footer(ctx, wMm, hMm, scale) {
  ctx.fillStyle = "#7a5a55";
  ctx.font = `${11 / scale}px system-ui, sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("25 mm/s   10 mm/mV", wMm - 1.5, hMm - 1.5);
  ctx.textAlign = "left";
}

// キャリパー。紙の上でドラッグすると、時間差と電位差を表示する
export function attachCalipers(overlay, paper, getScale, readout, fmt) {
  let start = null;
  const ctx = overlay.getContext("2d");
  function sync() {
    const dpr = window.devicePixelRatio || 1;
    overlay.width = paper.width; overlay.height = paper.height;
    overlay.style.width = paper.style.width; overlay.style.height = paper.style.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function pos(e) {
    const r = overlay.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function drawLines(p, q) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(p.x, 0); ctx.lineTo(p.x, overlay.height);
    ctx.moveTo(q.x, 0); ctx.lineTo(q.x, overlay.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    const s = getScale();
    const ms = Math.abs(q.x - p.x) / s / SPEED * 1000;
    const mv = (p.y - q.y) / s / GAIN;
    readout.textContent = fmt(ms, mv);
    readout.hidden = false;
    readout.style.left = `${Math.max(p.x, q.x) + 8}px`;
    readout.style.top = `${Math.min(p.y, q.y)}px`;
  }
  overlay.addEventListener("pointerdown", (e) => {
    sync(); start = pos(e); overlay.setPointerCapture(e.pointerId);
  });
  overlay.addEventListener("pointermove", (e) => { if (start) drawLines(start, pos(e)); });
  overlay.addEventListener("pointerup", () => { start = null; });
  overlay.addEventListener("dblclick", () => {
    ctx.clearRect(0, 0, overlay.width, overlay.height); readout.hidden = true;
  });
  return { reset() { sync(); ctx.clearRect(0, 0, overlay.width, overlay.height); readout.hidden = true; } };
}
