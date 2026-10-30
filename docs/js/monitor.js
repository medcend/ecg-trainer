// ベッドサイドモニター風の表示。左から右へ掃引し、QRS のたびに同期音を鳴らす。
// 掃引速度は 25 mm/s、表示の 1 mm は PX_PER_MM px。

const PX_PER_MM = 4;
const SPEED = 25;
const GAP = 14; // 書き込み位置の先を消す幅（px）

export class Monitor {
  constructor(canvas, hrEl) {
    this.canvas = canvas;
    this.hrEl = hrEl;
    this.ctx = canvas.getContext("2d");
    this.gain = 1;
    this.sound = false;
    this.audio = null;
    this.raf = 0;
  }

  load(sig, fs, beats) {
    this.stop();
    this.sig = sig;
    this.fs = fs;
    this.beats = beats || [];
    this.dur = sig.length / fs;
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.clear();
  }

  clear() {
    const c = this.ctx;
    c.fillStyle = "#050a06";
    c.fillRect(0, 0, this.w, this.h);
    this.lastX = null;
  }

  setSound(on) {
    this.sound = on;
    if (on && !this.audio) this.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (on && this.audio.state === "suspended") this.audio.resume();
  }

  beep() {
    if (!this.sound || !this.audio) return;
    const t = this.audio.currentTime;
    const o = this.audio.createOscillator();
    const g = this.audio.createGain();
    o.type = "sine";
    o.frequency.value = 960;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(this.audio.destination);
    o.start(t);
    o.stop(t + 0.1);
  }

  start() {
    this.stop();
    this.clear();
    this.t0 = performance.now();
    this.prevT = 0;
    this.recent = [];
    const tick = () => { this.frame(); this.raf = requestAnimationFrame(tick); };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  // 経過時間 t（秒、ループしない通算）の位置
  xOf(t) { return (t * SPEED * PX_PER_MM) % this.w; }

  frame() {
    const t = (performance.now() - this.t0) / 1000;
    const c = this.ctx;
    const pxPerS = SPEED * PX_PER_MM;
    const mid = this.h * 0.55;
    const k = 10 * PX_PER_MM * this.gain / 1000; // µV -> px
    // 前回の位置から今回の位置までを描く
    let from = this.prevT;
    const step = 1 / this.fs;
    c.strokeStyle = "#39ff6a";
    c.lineWidth = 1.6;
    c.lineJoin = "round";
    while (from < t) {
      const segEnd = Math.min(t, from + (this.w - this.xOf(from)) / pxPerS); // 右端で折り返す
      const x0 = this.xOf(from);
      c.fillStyle = "#050a06";
      c.fillRect(x0, 0, (segEnd - from) * pxPerS + GAP, this.h);
      c.beginPath();
      for (let s = from; s <= segEnd + 1e-9; s += step) {
        const i = Math.floor((s % this.dur) * this.fs);
        const x = x0 + (s - from) * pxPerS;
        const y = mid - this.sig[i] * k;
        if (s === from) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
      from = segEnd + 1e-6;
      if (segEnd < t) c.fillRect(0, 0, GAP, this.h);
    }
    // 同期音と心拍数
    const a = this.prevT % this.dur, b = t % this.dur;
    for (const bt of this.beats) {
      const crossed = a <= b ? (bt > a && bt <= b) : (bt > a || bt <= b);
      if (crossed) { this.beep(); this.recent.push(t); }
    }
    this.recent = this.recent.filter((x) => t - x < 6);
    this.prevT = t;
    this.updateHR(t);
  }

  updateHR(t) {
    const r = this.recent;
    if (r.length < 3 || t - r[r.length - 1] > 3) { this.hrEl.textContent = "--"; return; }
    const rr = [];
    for (let i = Math.max(1, r.length - 5); i < r.length; i++) rr.push(r[i] - r[i - 1]);
    const mean = rr.reduce((s, x) => s + x, 0) / rr.length;
    this.hrEl.textContent = String(Math.round(60 / mean));
  }
}
