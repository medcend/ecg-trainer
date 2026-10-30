// 成績の同期。Firebase の Firestore に「同期コード」ごとの文書を1つ作り、端末ごとの成績を入れる。
//   sync/{コード} = { devices: { 端末ID: { stats, updatedAt } } }
// 各端末は自分の欄だけを書くので、同時に書いても上書きし合わない。表示する成績は全端末の合計。
// ログインは匿名認証。コードを知っている端末だけが文書を読める（一覧の取得はルールで禁止）。
import { FIREBASE_CONFIG } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 保存できない環境 */ } },
};

function randomId(n) {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 読み間違えやすい I、O、0、1 を除く
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => abc[x % abc.length]).join("");
}

export const sync = {
  enabled: !!FIREBASE_CONFIG,
  code: store.get("syncCode", null),
  deviceId: store.get("deviceId", null) || (() => { const id = randomId(12); store.set("deviceId", id); return id; })(),
  others: {}, // 他の端末の成績の合計
  status: "off",
  onChange: () => {},
  fb: null,
  unsub: null,
  timer: 0,

  async init(onChange) {
    this.onChange = onChange;
    // 「#sync=コード」付きのリンクで開いたら、そのコードを使う
    const m = location.hash.match(/sync=([A-Z0-9-]{20,})/);
    if (m) {
      this.code = m[1].replace(/-/g, "");
      store.set("syncCode", this.code);
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (this.enabled && this.code) await this.connect();
    else this.setStatus(this.enabled ? "nocode" : "off");
  },

  setStatus(s) { this.status = s; this.onChange(); },

  async load() {
    if (this.fb) return this.fb;
    const [app, auth, fs] = await Promise.all([
      import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`),
    ]);
    const a = app.initializeApp(FIREBASE_CONFIG);
    await auth.signInAnonymously(auth.getAuth(a));
    this.fb = { fs, db: fs.getFirestore(a) };
    return this.fb;
  },

  async connect() {
    this.setStatus("connecting");
    try {
      const { fs, db } = await this.load();
      this.unsub?.();
      const ref = fs.doc(db, "sync", this.code);
      this.unsub = fs.onSnapshot(ref, (snap) => {
        const devices = snap.data()?.devices || {};
        const sum = {};
        for (const [id, d] of Object.entries(devices)) {
          if (id === this.deviceId) continue;
          for (const [k, s] of Object.entries(d.stats || {})) {
            const t = (sum[k] ||= { n: 0, ok: 0 });
            t.n += s.n; t.ok += s.ok;
          }
        }
        this.others = sum;
        this.devices = Object.keys(devices).length;
        this.setStatus("on");
      }, () => this.setStatus("error"));
      this.push(store.get("stats", {}), true);
    } catch (e) {
      console.warn(e);
      this.setStatus("error");
    }
  },

  // 自分の端末の成績を書き込む（回答のたびに呼ばれるので2秒まとめる）
  push(stats, now = false) {
    if (!this.enabled || !this.code || !this.fb) return;
    clearTimeout(this.timer);
    const write = () => {
      const { fs, db } = this.fb;
      fs.setDoc(fs.doc(db, "sync", this.code), { devices: { [this.deviceId]: { stats, updatedAt: Date.now() } } }, { merge: true })
        .catch(() => this.setStatus("error"));
    };
    if (now) write(); else this.timer = setTimeout(write, 2000);
  },

  // すべての端末の成績を消す
  async resetAll() {
    if (!this.fb || !this.code) return;
    const { fs, db } = this.fb;
    await fs.setDoc(fs.doc(db, "sync", this.code), { devices: {} });
  },

  async newCode() {
    this.code = randomId(20);
    store.set("syncCode", this.code);
    await this.connect();
  },

  async useCode(code) {
    const c = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (c.length < 20) return false;
    this.code = c;
    store.set("syncCode", c);
    await this.connect();
    return true;
  },

  stop() {
    this.unsub?.();
    this.unsub = null;
    this.code = null;
    this.others = {};
    store.set("syncCode", null);
    this.setStatus(this.enabled ? "nocode" : "off");
  },

  pretty() { return this.code ? this.code.match(/.{1,5}/g).join("-") : ""; },
  link() { return `${location.origin}${location.pathname}#sync=${this.pretty()}`; },
};
