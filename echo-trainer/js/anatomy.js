// 心臓と胸郭の形状モデル。単位は cm。
// 座標は患者基準の右手系（RAS）：x＝患者の右、y＝前、z＝頭側。
// 原点は僧帽弁輪の中心。心臓は単純な立体（楕円体、管）を組み合わせて作る。
// ここで決めた値を GLSL の定数に埋め込むので、形を変えるときはこのファイルだけを直す。

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => mul(a, 1 / len(a));
const perp = (v, axis) => norm(sub(v, mul(axis, dot(v, axis)))); // axis に垂直な成分
const sum = (...vs) => vs.reduce(add, [0, 0, 0]);
// v を軸 k（単位ベクトル）のまわりに右ねじで回す。d（体内へ向かうビーム）を軸にすると、検者から見て時計回り
export function rotate(v, k, deg) {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}

const RIGHT = [1, 0, 0], LEFT = [-1, 0, 0], ANT = [0, 1, 0], POST = [0, -1, 0], UP = [0, 0, 1], DOWN = [0, 0, -1];

// ---- 心臓 ----
const M = [0, 0, 0];                       // 僧帽弁輪の中心
const A = norm([-0.55, 0.45, -0.7]);       // 左室の長軸（心基部→心尖：左、前、下へ向かう）
const sep = perp([1, 0.55, 0.15], A);      // 左室から右室へ向かう向き（右前）
const ant = perp(ANT, A);                  // 長軸に垂直な「前」
const sepO = perp(sep, ant);               // ant と直交させた中隔方向（壁の区域分けに使う）
const wv = norm(cross(A, sep));            // 右室の楕円体の3本目の軸

const T = sum(M, mul(A, 0.8), mul(sep, 4.0));            // 三尖弁輪の中心（僧帽弁より少し心尖寄り）
const LAc = sum(M, mul(A, -2.3), mul(ant, -0.5));          // 左房の中心
const RAc = sum(T, mul(A, -2.4), mul(ant, -0.3));          // 右房の中心
const RVc = sum(M, mul(A, 2.6), mul(sep, 2.8));            // 右室の楕円体の中心
const MVc = sum(M, mul(ant, -0.3));                        // 僧帽弁口の中心（大動脈弁の反対側に少し寄る）
const AVc = sum(M, mul(ant, 1.9), mul(sep, 0.7), mul(A, -0.5)); // 大動脈弁の中心
const lvotIn = sum(M, mul(A, 1.8), mul(ant, 1.0), mul(sep, 0.3));
const Droot = norm(sub(AVc, lvotIn));                     // 大動脈基部の向き

// 大動脈：基部→上行→弓部→下行
const X0 = 2.0;                                            // 正中（胸骨）の x
const ao1 = add(AVc, mul(Droot, 2.4));
const ao2 = sum(ao1, mul(RIGHT, 0.6), mul(ANT, 0.2), mul(UP, 3.8));
const ao3 = [X0 - 0.6, ao2[1] - 2.2, ao2[2] + 1.6];
const descX = LAc[0] - 1.6, descY = LAc[1] - 3.6;
const ao4 = [descX + 0.3, descY + 0.6, ao2[2] + 0.4];
const ao5 = [descX, descY, LAc[2] - 1.0];
const ao6 = [descX, descY, -17];

// 肺動脈：右室流出路→肺動脈弁→主幹→左右
const PVc = sum(AVc, mul(ant, 1.7), mul(LEFT, 1.5), mul(UP, 1.2));
const rvotIn = sum(M, mul(A, 1.7), mul(sep, 2.7), mul(ant, 1.7));
const PB = add(PVc, mul(norm(sum(mul(LEFT, 0.25), mul(POST, 0.7), mul(UP, 0.65))), 4.0));
const RPA = sum(PB, mul(RIGHT, 5.0), mul(POST, 0.6), mul(DOWN, 0.3));
const LPA = sum(PB, mul(LEFT, 3.2), mul(POST, 2.6), mul(DOWN, 0.4));

// 大静脈
const ivcTop = add(RAc, mul(DOWN, 1.4));
const ivcBot = sum(RAc, mul(RIGHT, 0.2), mul(POST, 0.8), mul(DOWN, 12));
const hvJoin = sum(RAc, mul(RIGHT, 0.05), mul(POST, 0.25), mul(DOWN, 4.2));
const hvEnd = sum(hvJoin, mul(RIGHT, 4.5), mul(ANT, 1.2), mul(DOWN, 1.4));
const svcBot = add(RAc, mul(UP, 1.4));
const svcTop = sum(RAc, mul(RIGHT, 0.3), mul(UP, 8));

// 乳頭筋（左室の中ほど、前側壁側と後内側）
const lat = perp(LEFT, A);
const pmAL = sum(M, mul(A, 4.6), mul(norm(add(mul(lat, 0.85), mul(ant, 0.45))), 1.45));
const pmPM = sum(M, mul(A, 4.6), mul(norm(add(mul(ant, -0.95), mul(sepO, 0.35))), 1.45));

// 肝臓（右上腹部、横隔膜の下）
const LIVc = [X0 + 2.6, -0.8, -13.2];
const LIVr = [10, 7.5, 5.8];

// ---- 胸郭 ----
export const TORSO = { x0: X0, y0: -3.5, a: 15, b: 10.5, zTop: 13, zBot: -20 };
export const torsoPoint = (x, z) => {
  // 前面の皮膚上の点（x, z を与えて y を求める）
  const u = (x - TORSO.x0) / TORSO.a;
  const y = TORSO.y0 + TORSO.b * Math.sqrt(Math.max(0, 1 - u * u));
  return [x, y, z];
};
// 体の楕円柱の内側までの距離（正：体の外）
export function torsoDist(p) {
  const u = (p[0] - TORSO.x0) / TORSO.a, v = (p[1] - TORSO.y0) / TORSO.b;
  const k = Math.hypot(u, v);
  return (k - 1) * Math.min(TORSO.a, TORSO.b) * 0.92;
}

// 肋骨：体表から 1.4 cm 内側の楕円に沿う管を、数本の線分でつなぐ。z は胸骨の高さで、外側ほど少し上がる。
// 胸骨から約 5 cm までは肋軟骨で、超音波をある程度通すので影は作らない（3D 表示だけに描く）
const CART_LAT = 5.0;
function ribPath(zStern, phiFrom, phiTo, side, n = 6) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const phi = phiFrom + ((phiTo - phiFrom) * i) / (n - 1);
    const x = TORSO.x0 + side * (TORSO.a - 1.4) * Math.sin(phi);
    const y = TORSO.y0 + (TORSO.b - 1.4) * Math.cos(phi);
    pts.push([x, y, zStern + 0.12 * Math.abs(x - TORSO.x0)]);
  }
  return pts;
}
// 軟骨と骨の境目（外側の距離が CART_LAT になる角度）
const PHI_CART = Math.asin(CART_LAT / (TORSO.a - 1.4));
const RIB_Z = [9.6, 7.1, 4.6, 2.1, -0.4, -2.9, -5.4];
export const RIBS = [], CARTILAGE = [];
for (const side of [1, -1]) {
  RIB_Z.forEach((z) => {
    CARTILAGE.push(ribPath(z, 0.12, PHI_CART, side, 3));
    RIBS.push(ribPath(z, PHI_CART, 1.65, side));
  });
  // 第8〜10肋骨は正中まで届かない（肋骨弓）
  [-7.6, -9.6, -11.6].forEach((z, i) => RIBS.push(ribPath(z, Math.max(PHI_CART, 0.55 + 0.12 * i), 1.65, side, 5)));
}
export const RIB_R = 0.5;
export const STERNUM = { x0: X0, y: 5.9, halfW: 1.3, halfT: 0.55, zTop: 10.8, zBot: -6.6 };

// 肺：左右の楕円体から、心臓のまわり（心切痕）と前縦隔を除いたもの
const HEARTc = sum(M, mul(A, 2.4), mul(sep, 1.6));
export function lungDist(p) {
  const ell = (c, r) => {
    const q = [(p[0] - c[0]) / r[0], (p[1] - c[1]) / r[1], (p[2] - c[2]) / r[2]];
    return (len(q) - 1) * Math.min(...r);
  };
  const lungL = ell([X0 - 8.6, -2.6, 2.5], [6.6, 8.2, 12.5]);
  const lungR = ell([X0 + 8.6, -2.6, 3.5], [6.6, 8.2, 12]);
  // 心臓を包む領域（肺が入らない）：心室は長軸に沿った楕円体、心房と大血管はもう一つの楕円体
  const e2 = norm(cross(A, ant));
  const qv = sub(p, sum(M, mul(A, 4.0), mul(sep, 1.4)));
  const vent = (len([dot(qv, ant) / 5.4, dot(qv, e2) / 5.8, dot(qv, A) / 7.6]) - 1) * 5.4;
  const atria = ell(add(mul(add(LAc, RAc), 0.5), mul(UP, 1.0)), [5.6, 5.0, 5.4]);
  const notch = Math.min(vent, atria);
  const medi = Math.max(Math.abs(p[0] - (X0 - 0.6)) - 3.6, Math.abs(p[1] + 0.5) - 7.5, p[2] - 11); // 縦隔
  const liver = ell(LIVc, LIVr);
  return Math.max(Math.min(lungL, lungR), -notch - 0.4, -medi, -liver - 0.8);
}
function capsuleDist(p, a, b, r) {
  const pa = sub(p, a), ba = sub(b, a);
  const h = Math.min(1, Math.max(0, dot(pa, ba) / dot(ba, ba)));
  return len(sub(pa, mul(ba, h))) - r;
}
export function boneDist(p) {
  let d = 1e9;
  for (const rib of RIBS) for (let i = 0; i < rib.length - 1; i++) d = Math.min(d, capsuleDist(p, rib[i], rib[i + 1], RIB_R));
  const s = STERNUM;
  const q = [Math.abs(p[0] - s.x0) - s.halfW, Math.abs(p[1] - s.y) - s.halfT, Math.abs(p[2] - (s.zTop + s.zBot) / 2) - (s.zTop - s.zBot) / 2];
  const box = len(q.map((v) => Math.max(v, 0))) + Math.min(Math.max(q[0], q[1], q[2]), 0);
  return Math.min(d, box);
}

// ビーム1本ごとに、骨か肺に最初に当たる深さを調べる（angles は中心からの角度、度）
export function occlusion(P, d, l, angles, maxDepth) {
  const out = [];
  for (const ang of angles) {
    const t = (ang * Math.PI) / 180;
    const dir = norm(add(mul(d, Math.cos(t)), mul(l, Math.sin(t))));
    let hit = { depth: maxDepth + 1, type: 0 };
    for (let r = 0.25; r < maxDepth; r += 0.12) {
      const p = add(P, mul(dir, r));
      if (torsoDist(p) > 0.5 && r > 3) { hit = { depth: r, type: 3 }; break; } // 体の外へ出た
      if (boneDist(p) < 0) { hit = { depth: r, type: 1 }; break; }
      if (lungDist(p) < 0) { hit = { depth: r, type: 2 }; break; }
    }
    out.push(hit);
  }
  return out;
}

// ---- 基本断面のプローブ位置と向き ----
// P：プローブの位置、d：ビームの中心方向（体の中へ）、l：プローブマークの向き（画面の右）
function planeFrom(P, target, markHint) {
  const d = norm(sub(target, P));
  const l = perp(markHint, d);
  return { P, d, l };
}
const onSkin = (x, z, inset = 0) => {
  const p = torsoPoint(x, z);
  return add(p, mul(POST, inset));
};
// 心尖：長軸を心尖の先へ延ばし、皮膚に出たところ
const apexSkin = (() => {
  let t = 8.5;
  while (torsoDist(add(M, mul(A, t))) < 0 && t < 30) t += 0.05;
  return add(M, mul(A, t - 0.05));
})();
// 肋骨の影がいちばん少ない位置へプローブをずらす（上下 ±1.6 cm、左右 ±1 cm）。build(P) は {P, d, l} を返す
function bestGap(P0, build, depth) {
  const angles = [];
  for (let a = -40; a <= 40; a += 5) angles.push(a);
  let best = null;
  for (let dx = -1.0; dx <= 1.01; dx += 0.5) {
    for (let dz = -1.6; dz <= 1.61; dz += 0.1) {
      const v = build(torsoPoint(P0[0] + dx, P0[2] + dz));
      const blocked = occlusion(v.P, v.d, v.l, angles, depth).filter((o) => o.type === 1 && o.depth < 7).length;
      const score = blocked * 10 + Math.abs(dz) + Math.abs(dx);
      if (!best || score < best.score) best = { score, v };
    }
  }
  return best.v;
}
const pPara = onSkin(X0 - 3.3, 0.85);
const pSub = [X0 - 0.4, 0, -10.8];
pSub[1] = torsoPoint(pSub[0], pSub[2])[1] - 0.3;
const pIvc = [ivcTop[0] + 0.2, 0, -10.8];
pIvc[1] = torsoPoint(pIvc[0], pIvc[2])[1] - 0.3;
const pSsn = [X0 - 0.2, 2.6, 12.2];

const towardBase = mul(A, -1);


export const VIEWS = {
  plax: { name: "傍胸骨長軸像", short: "長軸", window: "para", depth: 16, ...planeFrom(pPara, add(M, mul(A, 1.6)), towardBase) },
  psaxAV: { name: "傍胸骨短軸像（大動脈弁レベル）", short: "短軸・大動脈弁", window: "para", depth: 16 },
  psaxMV: { name: "傍胸骨短軸像（僧帽弁レベル）", short: "短軸・僧帽弁", window: "para", depth: 16 },
  psaxPM: { name: "傍胸骨短軸像（乳頭筋レベル）", short: "短軸・乳頭筋", window: "para", depth: 16 },
  psaxAP: { name: "傍胸骨短軸像（心尖部レベル）", short: "短軸・心尖部", window: "para", depth: 16 },
  a4c: { name: "心尖部四腔像", short: "四腔", window: "apex", depth: 18 },
  a5c: { name: "心尖部五腔像", short: "五腔", window: "apex", depth: 18 },
  a2c: { name: "心尖部二腔像", short: "二腔", window: "apex", depth: 18 },
  a3c: { name: "心尖部長軸像（三腔像）", short: "長軸（三腔）", window: "apex", depth: 18 },
  sc4c: { name: "心窩部四腔像", short: "心窩部四腔", window: "sub", depth: 20, ...planeFrom(pSub, sum(M, mul(A, 1.5), mul(sep, 1.8)), LEFT) },
  ivc: { name: "下大静脈（長軸）", short: "下大静脈", window: "sub", depth: 18, ...planeFrom(pIvc, add(ivcTop, mul(DOWN, 2.5)), UP) },
  ssn: { name: "胸骨上窩・大動脈弓", short: "大動脈弓", window: "ssn", depth: 16, ...planeFrom(pSsn, add(ao3, mul(DOWN, 1.5)), sub(ao5, ao2)) },
};
// 短軸は長軸像のプローブを時計回りに 90° 回し、あおりで高さを変える
{
  const psax = (target) => {
    const d = norm(sub(target, pPara));
    const l = perp(cross(d, mul(A, -1)), d); // 長軸に垂直な面。cross の向きで左肩側になる
    return { P: pPara, d, l: l[0] < 0 ? l : mul(l, -1) };
  };
  Object.assign(VIEWS.psaxAV, psax(add(AVc, mul(Droot, 0.3))));
  Object.assign(VIEWS.psaxMV, psax(add(M, mul(A, 0.7))));
  Object.assign(VIEWS.psaxPM, psax(add(M, mul(A, 4.6))));
  Object.assign(VIEWS.psaxAP, psax(add(M, mul(A, 7.0))));
  // 心尖部の4断面は同じ肋間から、回転とあおりで出す。肋骨の影を避けるため、断面ごとに高さを少し調整する
  const a4 = (P) => planeFrom(P, M, mul(sep, -1));
  VIEWS.a4c = { ...VIEWS.a4c, ...bestGap(apexSkin, a4, 18) };
  // 五腔像：四腔像から前へあおって大動脈弁を入れる
  VIEWS.a5c = { ...VIEWS.a5c, ...bestGap(apexSkin, (P) => planeFrom(P, add(mul(M, 0.5), mul(AVc, 0.5)), mul(sep, -1)), 18) };
  // 二腔像：四腔像から反時計回りに約 60°
  VIEWS.a2c = { ...VIEWS.a2c, ...bestGap(apexSkin, (P) => { const v = a4(P); return { ...v, l: rotate(v.l, v.d, -60) }; }, 18) };
  // 長軸（三腔）像：心尖から大動脈弁と僧帽弁を通る面。マークは右肩側
  VIEWS.a3c = { ...VIEWS.a3c, ...bestGap(apexSkin, (P) => {
    const d = norm(sub(M, P));
    let l = norm(cross(norm(cross(sub(AVc, P), sub(M, P))), d));
    if (l[0] < 0) l = mul(l, -1);
    return { P, d, l };
  }, 18) };
}
export const WINDOWS = {
  para: { name: "胸骨左縁", where: "胸骨のすぐ左、第3〜4肋間", view: "plax" },
  apex: { name: "心尖部", where: "心尖拍動を触れる位置（第5肋間の鎖骨中線から前腋窩線のあたり）", view: "a4c" },
  sub: { name: "心窩部", where: "剣状突起の下（みぞおち）", view: "sc4c" },
  ssn: { name: "胸骨上窩", where: "胸骨の上端のくぼみ", view: "ssn" },
};

// ---- GLSL に渡す値 ----
export const GEO = {
  M, A, sep, ant, sepO, wv, T, LAc, RAc, RVc, MVc, AVc, lvotIn, Droot, rvotIn, PVc, PB, RPA, LPA,
  ao: [AVc, ao1, ao2, ao3, ao4, ao5, ao6], ivcTop, ivcBot, hvJoin, hvEnd, svcBot, svcTop, pmAL, pmPM, LIVc, LIVr, HEARTc,
};
// 体表マップの心臓の輪郭に使う点（前から見たときの外形）
export const OUTLINE = [
  svcTop, add(ao2, mul(RIGHT, 1.4)), add(RAc, mul(RIGHT, 2.3)), add(RAc, mul(DOWN, 2.0)),
  sum(RVc, mul(DOWN, 3.2), mul(RIGHT, 0.5)), add(M, mul(A, 9.4)), sum(M, mul(A, 5), mul(lat, 3.4)),
  add(LAc, mul(LEFT, 2.4)), sum(PB, mul(LEFT, 2.0), mul(UP, 0.4)), add(ao3, mul(UP, 1.3)),
];
export const LIVER = { c: LIVc, r: LIVr };
export const LUNG_SHAPES = { L: { c: [X0 - 8.6, 2.5], r: [6.6, 12.5] }, R: { c: [X0 + 8.6, 3.5], r: [6.6, 12] } };
