// WebGL の描画：エコー画像（扇形の断面）と、心臓・胸郭・プローブの 3D 表示。
// 心臓は anatomy.js の値から作った距離関数（SDF）で表し、2つの画面で同じ形を使う。
import { GEO, RIBS, CARTILAGE, RIB_R, STERNUM, TORSO, add, mul, sub, cross, norm, dot } from "./anatomy.js";

const f = (x) => (Math.abs(x) < 1e-6 ? "0.0" : x.toFixed(4));
const v3 = (v) => `vec3(${f(v[0])},${f(v[1])},${f(v[2])})`;
const m3 = (a, b, c) => `mat3(${v3(a)},${v3(b)},${v3(c)})`;
const frame = (axis) => {
  // axis を z とする右手系の基底
  const t = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const x = norm(cross(t, axis)), y = cross(axis, x);
  return m3(x, y, axis);
};

// 構造の番号（ID パスとラベル）。ここを変えたら LABELS も合わせる
export const ID = {
  LV: 1, RV: 2, LA: 3, RA: 4, AO: 5, PA: 6, IVC: 7, SVC: 8, DAO: 9,
  IVS: 10, LVANT: 11, LVLAT: 12, LVPOST: 13, LVINF: 14, RVW: 15,
  MV: 16, AV: 17, TV: 18, PV: 19, PM: 20, LIVER: 21, PERI: 22, HV: 23, ARCH: 24,
};
export const LABELS = {
  1: "左室", 2: "右室", 3: "左房", 4: "右房", 5: "大動脈", 6: "肺動脈", 7: "下大静脈", 8: "上大静脈", 9: "下行大動脈",
  10: "心室中隔", 11: "左室前壁", 12: "左室側壁", 13: "左室後壁", 14: "左室下壁", 15: "右室壁",
  16: "僧帽弁", 17: "大動脈弁", 18: "三尖弁", 19: "肺動脈弁", 20: "乳頭筋", 21: "肝臓", 22: "心膜", 23: "肝静脈", 24: "大動脈弓",
};

function sdfSource() {
  const G = GEO;
  const e2 = cross(G.A, G.ant);
  const RLV = m3(G.ant, e2, G.A);
  const RRV = m3(G.sep, G.wv, G.A);
  const rAL = norm(sub(sub(G.pmAL, G.M), mul(G.A, dot(sub(G.pmAL, G.M), G.A))));
  const rPM = norm(sub(sub(G.pmPM, G.M), mul(G.A, dot(sub(G.pmPM, G.M), G.A))));
  const Dpa = norm(sub(G.PB, G.PVc));
  const ao = G.ao;
  const aoR = [1.5, 1.4, 1.3, 1.25, 1.15, 1.1];
  let aoCode = "";
  for (let i = 0; i < 6; i++) {
    aoCode += `  { float c = sdCap(p, ${v3(ao[i])}, ${v3(ao[i + 1])}, 0.0);
    float l = c - ${f(aoR[i])};
    ${i >= 4 ? "h.dao = min(h.dao, l);" : i >= 2 ? "h.arch = min(h.arch, l);" : ""}
    h.aol = min(h.aol, l); h.aow = min(h.aow, l - 0.25); }\n`;
  }
  return `
precision highp float;
uniform float uC;   // 心室の収縮（0：拡張末期、1：収縮末期）
uniform float uMV;  // 房室弁の開き
uniform float uAV;  // 半月弁の開き
uniform float uAt;  // 心房の収縮

float sdEll(vec3 q, vec3 r) { float k0 = length(q / r); float k1 = length(q / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-4); }
float sdCap(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float seg2(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }

const vec3 cM = ${v3(G.M)};
const vec3 cA = ${v3(G.A)};
const vec3 cANT = ${v3(G.ant)};
const vec3 cSEP = ${v3(G.sepO)};
const mat3 RLV = ${RLV};
const mat3 RRV = ${RRV};
const mat3 RAO = ${frame(G.Droot)};
const mat3 RPV = ${frame(Dpa)};

struct Heart {
  float lvo, lvc, rvo, rvc, lao, lac, rao, rac, aow, aol, dao, arch, paw, pal, vnw, ivc, svc, hv, mv, av, tv, pv, pm, liv, out4, outAll, cav, valve;
};

// 房室弁の弁尖（前尖・後尖）。q は弁の座標系（x：前尖側、z：心室側）
float leaflets(vec3 q, float o, float la, float lp, float curv) {
  vec2 hA = vec2(1.45, 0.0), hP = vec2(-1.45, 0.0);
  vec2 dA = normalize(mix(vec2(-1.7, 0.75), vec2(0.25, 1.0), o));
  vec2 dP = normalize(mix(vec2(1.2, 0.75), vec2(-0.2, 1.0), o));
  float yy = q.y * q.y;
  float a = seg2(vec2(q.x + curv * yy, q.z), hA, hA + dA * la) - 0.09;
  float b = seg2(vec2(q.x - curv * yy, q.z), hP, hP + dP * lp) - 0.09;
  return max(min(a, b), abs(q.y) - 1.35);
}
// 半月弁：閉じると3枚の弁尖が Y 字に合わさり、開くと壁に沿う
float cusps(vec3 q, float o, float r) {
  float closed = 1e3;
  for (int i = 0; i < 3; i++) {
    float t = 1.5708 + float(i) * 2.0944;
    vec2 u = vec2(cos(t), sin(t));
    float s = clamp(dot(q.xy, u), 0.0, r);
    closed = min(closed, max(length(q.xy - u * s) - 0.07, abs(q.z) - 0.2));
  }
  float open = max(abs(length(q.xy) - r * 0.9) - 0.07, abs(q.z - 0.65) - 0.65);
  return mix(closed, open, step(0.5, o));
}

Heart heart(vec3 p) {
  Heart h;
  float sc = 1.0 - 0.30 * uC, sl = 1.0 - 0.09 * uC;
  vec3 qL = (p - cM) * RLV;
  h.lvc = max(sdEll(qL - vec3(0.0, 0.0, 0.6), vec3(2.4 * sc, 2.4 * sc, 7.6 * sl)), -0.1 - qL.z);
  float so = 1.0 - 0.11 * uC;
  h.lvo = max(sdEll(qL - vec3(0.0, 0.0, 0.4), vec3(3.4 * so, 3.4 * so, 9.0 * (1.0 - 0.055 * uC))), -0.35 - qL.z);
  // 乳頭筋
  vec3 cAL = cM + cA * (4.6 * sl) + ${v3(rAL)} * (1.45 * sc);
  vec3 cPM = cM + cA * (4.6 * sl) + ${v3(rPM)} * (1.45 * sc);
  h.pm = min(sdEll((p - cAL) * RLV, vec3(0.55, 0.55, 1.3)), sdEll((p - cPM) * RLV, vec3(0.55, 0.55, 1.3)));
  h.lvc = max(h.lvc, -h.pm);
  // 心房
  float sLA = 1.0 + 0.10 * uC - 0.07 * uAt;
  vec3 qA = (p - ${v3(G.LAc)}) * RLV;
  h.lac = sdEll(qA, vec3(2.0, 1.75, 2.3) * sLA);
  h.lao = sdEll(qA, vec3(2.0, 1.75, 2.3) * sLA + 0.25);
  vec3 qR = (p - ${v3(G.RAc)}) * RRV;
  h.rac = sdEll(qR, vec3(1.9, 2.0, 2.3) * sLA);
  h.rao = sdEll(qR, vec3(1.9, 2.0, 2.3) * sLA + 0.22);
  // 右室：楕円体から左室を除いた三日月形
  vec3 qV = (p - ${v3(G.RVc)}) * RRV;
  float sr = 1.0 - 0.20 * uC;
  float tdot = dot(p - ${v3(G.T)}, cA);
  h.rvo = max(sdEll(qV, vec3(3.4, 3.8, 4.2) * vec3(1.0 - 0.08 * uC, 1.0 - 0.08 * uC, 1.0 - 0.04 * uC)), -tdot - 0.35);
  h.rvc = max(max(sdEll(qV, vec3(3.0 * sr, 3.4 * sr, 3.8 * (1.0 - 0.08 * uC))), -h.lvo), -tdot - 0.1);
  // 弁口と流出路
  float mvo = sdCap(p, ${v3(G.MVc)} - cA * 0.9, ${v3(G.MVc)} + cA * 0.4, 1.45);
  float tvo = sdCap(p, ${v3(G.T)} - cA * 0.8, ${v3(G.T)} + cA * 0.5, 1.6);
  float lvotL = sdCap(p, ${v3(G.lvotIn)}, ${v3(G.AVc)}, 1.0);
  float rvotC = sdCap(p, ${v3(G.rvotIn)}, ${v3(G.PVc)}, 0.0);
  // 大動脈
  h.aol = 1e3; h.aow = 1e3; h.dao = 1e3; h.arch = 1e3;
${aoCode}
  // 肺動脈
  float paTrunk = sdCap(p, ${v3(G.PVc)}, ${v3(G.PB)}, 0.0) - 1.25;
  float paR = sdCap(p, ${v3(G.PB)}, ${v3(G.RPA)}, 0.9);
  float paL = sdCap(p, ${v3(G.PB)}, ${v3(G.LPA)}, 0.85);
  h.pal = min(min(paTrunk, rvotC - 1.2), min(paR, paL));
  h.paw = min(min(paTrunk - 0.25, rvotC - 1.6), min(paR, paL) - 0.22);
  // 大静脈と肝静脈
  h.ivc = sdCap(p, ${v3(G.ivcTop)}, ${v3(G.ivcBot)}, 1.0);
  h.hv = sdCap(p, ${v3(G.hvJoin)}, ${v3(G.hvEnd)}, 0.45);
  h.svc = sdCap(p, ${v3(G.svcBot)}, ${v3(G.svcTop)}, 0.85);
  h.vnw = min(min(h.ivc, h.svc), h.hv) - 0.15;
  // 弁
  h.mv = leaflets((p - ${v3(G.MVc)}) * RLV, uMV, 2.3, 1.5, 0.28);
  h.tv = leaflets((p - ${v3(G.T)}) * RRV * mat3(-1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0), uMV, 1.6, 2.1, 0.2); // 中隔尖（短い）と前尖
  h.av = cusps((p - ${v3(G.AVc)}) * RAO, uAV, 1.35);
  h.pv = cusps((p - ${v3(G.PVc)}) * RPV, uAV, 1.15);
  h.valve = min(min(h.mv, h.tv), min(h.av, h.pv));
  // 肝臓
  h.liv = sdEll(p - ${v3(G.LIVc)}, ${v3(G.LIVr)});
  // まとめ：外形、内腔
  h.out4 = smin(smin(h.lvo, h.rvo, 0.6), smin(h.lao, h.rao, 0.5), 0.6);
  float outs = smin(h.out4, sdCap(p, ${v3(G.lvotIn)}, ${v3(G.AVc)}, 1.45), 0.5);
  outs = smin(outs, h.paw, 0.4);
  outs = smin(outs, h.aow, 0.4);
  h.outAll = smin(outs, h.vnw, 0.3);
  h.cav = min(min(min(h.lvc, h.rvc), min(h.lac, h.rac)), min(min(h.aol, h.pal), min(min(h.ivc, h.svc), h.hv)));
  h.cav = min(h.cav, min(min(mvo, tvo), lvotL));
  return h;
}

// 構造の番号（ラベル用）。血液、壁、弁などを区別する
float structureId(vec3 p, Heart h) {
  if (h.valve < 0.0) {
    if (h.mv < 0.0) return ${ID.MV}.0;
    if (h.av < 0.0) return ${ID.AV}.0;
    if (h.tv < 0.0) return ${ID.TV}.0;
    return ${ID.PV}.0;
  }
  if (h.cav < 0.0) {
    if (h.lvc < 0.0) return ${ID.LV}.0;
    if (h.rvc < 0.0) return ${ID.RV}.0;
    if (h.lac < 0.0) return ${ID.LA}.0;
    if (h.rac < 0.0) return ${ID.RA}.0;
    if (h.dao < 0.0) return ${ID.DAO}.0;
    if (h.arch < 0.0) return ${ID.ARCH}.0;
    if (h.aol < 0.0) return ${ID.AO}.0;
    if (h.pal < 0.0) return ${ID.PA}.0;
    if (h.ivc < 0.0) return ${ID.IVC}.0;
    if (h.svc < 0.0) return ${ID.SVC}.0;
    if (h.hv < 0.0) return ${ID.HV}.0;
    // 弁口や流出路：いちばん近い内腔に含める
    float m = min(min(h.lvc, h.rvc), min(h.lac, h.rac));
    if (h.lvc <= m) return ${ID.LV}.0;
    if (h.rvc <= m) return ${ID.RV}.0;
    if (h.lac <= m) return ${ID.LA}.0;
    return ${ID.RA}.0;
  }
  if (h.outAll < 0.0) {
    if (h.pm < 0.0) return ${ID.PM}.0;
    if (h.lvo < 0.0) {
      vec3 r = p - cM; r -= cA * dot(r, cA);
      float a = atan(dot(r, cSEP), dot(r, cANT)) * 57.2958;
      if (a > 30.0 && a < 150.0) return ${ID.IVS}.0;
      if (a >= -30.0 && a <= 30.0) return ${ID.LVANT}.0;
      if (a < -30.0 && a >= -90.0) return ${ID.LVLAT}.0;
      if (a < -90.0 && a >= -150.0) return ${ID.LVPOST}.0;
      return ${ID.LVINF}.0;
    }
    if (h.rvo < 0.0) return ${ID.RVW}.0;
    return 0.0;
  }
  if (h.liv < 0.0) return h.hv < 0.0 ? ${ID.HV}.0 : ${ID.LIVER}.0;
  if (h.out4 > 0.0 && abs(h.out4 - 0.35) < 0.09) return ${ID.PERI}.0;
  return 0.0;
}
`;
}

const VERT = `attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// ---- エコー画像 ----
const ECHO_FRAG = () => sdfSource() + `
uniform vec2 uRes;
uniform float uDepth, uHalf, uTop, uMode, uGain;
uniform vec3 uP, uD, uL;
uniform sampler2D uOcc;
uniform vec3 uTorso; // x0, y0（楕円柱の中心）、内側への補正
uniform vec2 uTorsoR;

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float skinDepth(vec3 p) {
  vec2 u = vec2((p.x - uTorso.x) / uTorsoR.x, (p.y - uTorso.y) / uTorsoR.y);
  return (1.0 - length(u)) * min(uTorsoR.x, uTorsoR.y) * 0.92;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float ppc = (uRes.y - uTop - 6.0) / uDepth;
  vec2 c = vec2((px.x - uRes.x * 0.5) / ppc, (px.y - uTop) / ppc);
  float r = length(c), th = atan(c.x, c.y);
  if (abs(th) > uHalf || r > uDepth || c.y < 0.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  vec3 dir = cos(th) * uD + sin(th) * uL;
  vec3 p = uP + dir * r;
  Heart h = heart(p);
  if (uMode > 0.5) { gl_FragColor = vec4(structureId(p, h) / 255.0, 0.0, 0.0, 1.0); return; }

  float sp = pow(0.55 * vnoise(p * 4.2) + 0.45 * vnoise(p * 10.5 + 7.0), 1.6) * 1.6;
  float I;
  float sd = skinDepth(p);
  if (sd < 0.0) I = 0.0;
  else if (sd < 0.18) I = 0.75 + 0.2 * sp;
  else if (sd < 0.8) I = 0.08 + 0.12 * sp;
  else if (sd < 1.7) I = 0.25 + 0.25 * sp * (0.6 + 0.4 * sin(sd * 18.0));
  else I = 0.10 + 0.16 * sp;
  if (h.valve < 0.0) I = 0.85 + 0.15 * sp;
  else if (h.cav < 0.0) I = 0.015 + 0.03 * sp;
  else if (h.outAll < 0.0) I = 0.26 + 0.34 * sp;
  else if (h.liv < 0.0) I = h.hv < 0.0 ? 0.03 : 0.30 + 0.26 * sp;
  else if (h.out4 > 0.0 && abs(h.out4 - 0.35) < 0.1) I = 0.7 + 0.25 * sp;

  // 境界での強い反射（ビームに垂直な面ほど明るい）
  float e = 0.08;
  Heart hx = heart(p + vec3(e, 0.0, 0.0)), hy = heart(p + vec3(0.0, e, 0.0)), hz = heart(p + vec3(0.0, 0.0, e));
  vec3 gC = vec3(hx.cav - h.cav, hy.cav - h.cav, hz.cav - h.cav);
  vec3 gO = vec3(hx.outAll - h.outAll, hy.outAll - h.outAll, hz.outAll - h.outAll);
  vec3 gL = vec3(hx.liv - h.liv, hy.liv - h.liv, hz.liv - h.liv);
  if (h.valve > 0.0) {
    float bc = max(0.0, 1.0 - abs(h.cav) / 0.22) * step(h.cav, 0.3);
    I += 0.55 * bc * pow(abs(dot(normalize(gC + 1e-6), dir)), 1.3) * step(0.0, h.cav + 0.05);
    float bo = max(0.0, 1.0 - abs(h.outAll) / 0.2);
    I += 0.35 * bo * pow(abs(dot(normalize(gO + 1e-6), dir)), 1.5);
    float bl = max(0.0, 1.0 - abs(h.liv) / 0.25);
    I += 0.45 * bl * pow(abs(dot(normalize(gL + 1e-6), dir)), 1.2);
  }

  // 減衰と深さ補正
  I *= exp(-0.03 * r) * (1.0 + 0.02 * r) * uGain;

  // 肋骨の影と肺の多重反射
  vec4 oc = texture2D(uOcc, vec2((th / uHalf) * 0.5 + 0.5, 0.5));
  float od = oc.r * 25.0, ot = floor(oc.g * 3.0 + 0.5);
  if (ot > 0.5 && r > od) {
    float dd = r - od;
    if (ot < 1.5) I = (dd < 0.2 ? 0.9 : 0.015 + 0.02 * sp);
    else if (ot < 2.5) {
      float a = 0.0;
      for (int k = 1; k < 5; k++) { float rk = od * float(k); a += (1.0 - 0.22 * float(k)) * smoothstep(0.16, 0.0, abs(r - rk)); }
      I = 0.04 + 0.08 * sp + 0.8 * a * (0.7 + 0.3 * sp);
    } else I = 0.0;
  }
  I = clamp(I, 0.0, 1.0);
  I = pow(I, 0.9);
  gl_FragColor = vec4(vec3(I) * vec3(0.98, 0.98, 1.0), 1.0);
}
`;

// ---- 3D 表示 ----
const RIB_POLY = [...RIBS, ...CARTILAGE];
const RIB_N = RIBS.length, CART_N = CARTILAGE.length;
const RIB_PTS = RIBS[0].length, CART_PTS = CARTILAGE[0].length;
const VIEW_FRAG = () => sdfSource() + `
uniform vec2 uRes;
uniform vec3 uCam, uTarget;
uniform vec3 uP, uD, uL;
uniform float uDepth, uHalf, uCut, uCutSide, uBody, uRibs, uFan;
uniform vec3 uRib[${RIB_N * RIB_PTS}];
uniform vec3 uCart[${CART_N * CART_PTS}];
const vec3 TORSO = vec3(${f(TORSO.x0)}, ${f(TORSO.y0)}, 0.0);
const vec2 TORSO_R = vec2(${f(TORSO.a)}, ${f(TORSO.b)});
const vec3 HC = ${v3(add(GEO.M, mul(GEO.A, 2.5)))};

float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float torsoD(vec3 p) {
  vec2 u = vec2((p.x - TORSO.x) / TORSO_R.x, (p.y - TORSO.y) / TORSO_R.y);
  return (length(u) - 1.0) * min(TORSO_R.x, TORSO_R.y) * 0.92;
}
float bones(vec3 p, out float isCart) {
  isCart = 0.0;
  float d = 1e3;
  if (abs(torsoD(p) + 1.4) > 1.6) return 1.2;
  for (int i = 0; i < ${RIB_N}; i++)
    for (int j = 0; j < ${RIB_PTS - 1}; j++)
      d = min(d, sdCap(p, uRib[i * ${RIB_PTS} + j], uRib[i * ${RIB_PTS} + j + 1], ${f(RIB_R)}));
  float dc = 1e3;
  for (int i = 0; i < ${CART_N}; i++)
    for (int j = 0; j < ${CART_PTS - 1}; j++)
      dc = min(dc, sdCap(p, uCart[i * ${CART_PTS} + j], uCart[i * ${CART_PTS} + j + 1], ${f(RIB_R * 0.85)}));
  float st = sdBox(p - vec3(${f(STERNUM.x0)}, ${f(STERNUM.y)}, ${f((STERNUM.zTop + STERNUM.zBot) / 2)}), vec3(${f(STERNUM.halfW)}, ${f(STERNUM.halfT)}, ${f((STERNUM.zTop - STERNUM.zBot) / 2)})) - 0.15;
  d = min(d, st);
  if (dc < d) { isCart = 1.0; return dc; }
  return d;
}

// mat：1 左心系、2 右心系、3 左房、4 右房、5 大動脈、6 肺動脈、7 静脈、8 肝臓、9 骨、10 軟骨、11 プローブ、12 マーク、13 切り口
float map(vec3 p, out float mat) {
  float dH = 1e3; mat = 0.0;
  float bound = length(p - HC) - 25.0;
  if (bound < 1.0) {
    Heart h = heart(p);
    float d = h.outAll;
    mat = 1.0;
    float best = h.lvo;
    if (h.rvo < best) { best = h.rvo; mat = 2.0; }
    if (h.lao < best) { best = h.lao; mat = 3.0; }
    if (h.rao < best) { best = h.rao; mat = 4.0; }
    if (h.aow < best) { best = h.aow; mat = 5.0; }
    if (h.paw < best) { best = h.paw; mat = 6.0; }
    if (h.vnw < best) { best = h.vnw; mat = 7.0; }
    if (h.liv < d) { d = h.liv; mat = 8.0; }
    if (uCut > 0.5) {
      float cut = uCutSide * dot(p - uP, cross(uL, uD));
      if (cut > d) { d = cut; mat = 13.0; }
    }
    dH = d;
  } else dH = bound;
  float d = dH;
  if (uRibs > 0.5) {
    float isCart;
    float db = bones(p, isCart);
    if (db < d) { d = db; mat = isCart > 0.5 ? 10.0 : 9.0; }
  }
  float pr = sdCap(p, uP - uD * 0.3, uP - uD * 6.0, 0.85);
  if (pr < d) { d = pr; mat = 11.0; }
  float mk = length(p - (uP - uD * 1.0 + uL * 0.95)) - 0.35;
  if (mk < d) { d = mk; mat = 12.0; }
  return d;
}
vec3 normalAt(vec3 p) {
  float m; vec2 e = vec2(0.03, -0.03);
  return normalize(e.xyy * map(p + e.xyy, m) + e.yyx * map(p + e.yyx, m) + e.yxy * map(p + e.yxy, m) + e.xxx * map(p + e.xxx, m));
}
vec3 matColor(float m) {
  if (m < 1.5) return vec3(0.86, 0.43, 0.48);
  if (m < 2.5) return vec3(0.93, 0.64, 0.68);
  if (m < 3.5) return vec3(0.80, 0.55, 0.72);
  if (m < 4.5) return vec3(0.70, 0.62, 0.86);
  if (m < 5.5) return vec3(0.89, 0.36, 0.40);
  if (m < 6.5) return vec3(0.50, 0.65, 0.88);
  if (m < 7.5) return vec3(0.44, 0.56, 0.84);
  if (m < 8.5) return vec3(0.68, 0.42, 0.36);
  if (m < 9.5) return vec3(0.95, 0.93, 0.86);
  if (m < 10.5) return vec3(0.80, 0.86, 0.92);
  if (m < 11.5) return vec3(0.35, 0.38, 0.46);
  return vec3(0.98, 0.62, 0.25);
}
// 切り口の色：組織ごとに塗り分ける
vec3 cutColor(vec3 p) {
  Heart h = heart(p);
  if (h.valve < 0.0) return vec3(1.0, 0.98, 0.92);
  if (h.cav < 0.0) {
    if (h.lvc < 0.0 || h.lac < 0.0 || h.aol < 0.0) return vec3(0.62, 0.14, 0.2);
    return vec3(0.36, 0.22, 0.55);
  }
  if (h.outAll < 0.0) return vec3(0.96, 0.66, 0.70);
  if (h.liv < 0.0) return h.hv < 0.0 ? vec3(0.36, 0.22, 0.55) : vec3(0.78, 0.50, 0.42);
  return vec3(0.9);
}
// 体の楕円柱との交点（前面）
vec2 torsoHit(vec3 ro, vec3 rd) {
  vec2 o = (ro.xy - TORSO.xy) / TORSO_R, d = rd.xy / TORSO_R;
  float a = dot(d, d), b = dot(o, d), c = dot(o, o) - 1.0;
  float disc = b * b - a * c;
  if (disc < 0.0) return vec2(-1.0);
  float s = sqrt(disc);
  return vec2((-b - s) / a, (-b + s) / a);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 fw = normalize(uTarget - uCam);
  vec3 rt = normalize(cross(fw, vec3(0.0, 0.0, 1.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw * 1.9 + rt * uv.x + up * uv.y);
  vec3 ro = uCam;
  float t = 0.0, mat = 0.0; bool hit = false;
  for (int i = 0; i < 140; i++) {
    vec3 p = ro + rd * t;
    float d = map(p, mat);
    if (d < 0.015) { hit = true; break; }
    t += d * 0.85;
    if (t > 120.0) break;
  }
  vec3 bg = mix(vec3(0.97, 0.98, 1.0), vec3(0.90, 0.93, 0.98), gl_FragCoord.y / uRes.y);
  vec3 col = bg;
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = normalAt(p);
    vec3 base = mat > 12.5 ? cutColor(p) : matColor(mat);
    vec3 ld = normalize(-fw + rt * 0.4 + up * 0.7);
    float dif = max(dot(n, ld), 0.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float spec = pow(max(dot(reflect(-ld, n), -rd), 0.0), 24.0);
    if (mat > 12.5) { dif = 0.75; spec = 0.0; rim = 0.0; }
    col = base * (0.42 + 0.62 * dif) + vec3(0.25) * spec + vec3(0.12) * rim;
  }
  float tHit = hit ? t : 1e4;
  // 扇形（ビームの面）
  if (uFan > 0.5) {
    vec3 n = cross(uL, uD);
    float dn = dot(rd, n);
    if (abs(dn) > 1e-4) {
      float tf = dot(uP - ro, n) / dn;
      if (tf > 0.0 && tf < tHit) {
        vec3 v = ro + rd * tf - uP;
        float r = length(v), a = atan(dot(v, uL), dot(v, uD));
        if (abs(a) < uHalf && r < uDepth && dot(v, uD) > 0.0) {
          float edge = max(smoothstep(0.035, 0.0, uHalf - abs(a)), smoothstep(0.25, 0.0, uDepth - r));
          col = mix(col, vec3(0.45, 0.70, 1.0), 0.28 + 0.5 * edge);
        }
      }
    }
  }
  // 皮膚（半透明）
  if (uBody > 0.5) {
    vec2 th = torsoHit(ro, rd);
    if (th.x > 0.0 && th.x < tHit) {
      vec3 ps = ro + rd * th.x;
      if (ps.z < ${f(TORSO.zTop)} && ps.z > ${f(TORSO.zBot)}) {
        vec2 q = (ps.xy - TORSO.xy) / (TORSO_R * TORSO_R);
        vec3 ns = normalize(vec3(q, 0.0));
        float fr = pow(1.0 - abs(dot(ns, rd)), 2.0);
        col = mix(col, vec3(0.96, 0.84, 0.78), 0.10 + 0.35 * fr);
      }
    }
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    console.error(log, src.split("\n").map((l, i) => `${i + 1}: ${l}`).join("\n"));
    throw new Error("シェーダーのコンパイルに失敗しました: " + log);
  }
  return s;
}
function program(gl, frag) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    const name = info.name.replace(/\[0\]$/, "");
    U[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, U };
}
function setCycle(gl, U, cyc) {
  gl.uniform1f(U.uC, cyc.c);
  gl.uniform1f(U.uMV, cyc.mv);
  gl.uniform1f(U.uAV, cyc.av);
  gl.uniform1f(U.uAt, cyc.at);
}

// 心周期（phase 0〜1、0 が QRS）から、収縮の度合いと弁の開きを求める
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export function cycleAt(ph) {
  const c = ss(0.05, 0.32, ph) * (1 - 0.88 * ss(0.36, 0.55, ph) - 0.12 * ss(0.55, 0.8, ph));
  const at = ss(0.8, 0.88, ph) * (1 - ss(0.9, 0.98, ph));
  const av = ph > 0.08 && ph < 0.34 ? 1 : 0;
  let mv = 0;
  if (ph >= 0.45 && ph < 0.6) mv = ss(0.45, 0.5, ph);                 // 急速流入（E波）
  else if (ph >= 0.6 && ph < 0.8) mv = 1 - 0.55 * ss(0.6, 0.7, ph);    // 緩速流入で半分閉じる
  else if (ph >= 0.8) mv = 0.45 + 0.55 * ss(0.8, 0.85, ph) - ss(0.91, 0.97, ph); // 心房収縮（A波）のあと閉じる
  return { c: Math.max(0, c), mv: Math.max(0, Math.min(1, mv)), av, at };
}

export class EchoRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: true });
    if (!gl) throw new Error("WebGL が使えません");
    this.gl = gl;
    this.prog = program(gl, ECHO_FRAG());
    this.occTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.occTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    // ラベル用の低解像度 ID パス
    this.idW = 160; this.idH = 120;
    this.fbo = gl.createFramebuffer();
    this.fboTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.idW, this.idH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fboTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.top = 14;
  }
  setOcclusion(occ) {
    const gl = this.gl, n = occ.length, data = new Uint8Array(n * 4);
    occ.forEach((o, i) => {
      data[i * 4] = Math.min(255, Math.round((o.depth / 25) * 255));
      data[i * 4 + 1] = Math.round((o.type / 3) * 255);
    });
    gl.bindTexture(gl.TEXTURE_2D, this.occTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  uniforms(pose, cyc, w, h, mode) {
    const gl = this.gl, U = this.prog.U;
    gl.useProgram(this.prog.p);
    gl.uniform2f(U.uRes, w, h);
    gl.uniform1f(U.uDepth, pose.depth);
    gl.uniform1f(U.uHalf, pose.half);
    gl.uniform1f(U.uTop, (this.top * h) / this.canvas.height);
    gl.uniform1f(U.uMode, mode);
    gl.uniform1f(U.uGain, pose.gain ?? 1);
    gl.uniform3fv(U.uP, pose.P);
    gl.uniform3fv(U.uD, pose.d);
    gl.uniform3fv(U.uL, pose.l);
    gl.uniform3f(U.uTorso, TORSO.x0, TORSO.y0, 0);
    gl.uniform2f(U.uTorsoR, TORSO.a, TORSO.b);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.occTex);
    gl.uniform1i(U.uOcc, 0);
    setCycle(gl, U, cyc);
  }
  draw(pose, cyc) {
    const gl = this.gl, c = this.canvas;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, c.width, c.height);
    this.uniforms(pose, cyc, c.width, c.height, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  // 構造ごとに、画面上の代表点（重心に最も近い画素）を返す。座標はキャンバスの画素
  labels(pose, cyc) {
    const gl = this.gl, w = this.idW, h = this.idH;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, w, h);
    this.uniforms(pose, cyc, w, h, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const px = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const acc = {};
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const id = px[(y * w + x) * 4];
        if (!id) continue;
        const a = (acc[id] ||= { n: 0, sx: 0, sy: 0, pts: [] });
        a.n++; a.sx += x; a.sy += y; a.pts.push([x, y]);
      }
    const sx = this.canvas.width / w, sy = this.canvas.height / h, out = [];
    for (const [id, a] of Object.entries(acc)) {
      const min = [16, 17, 18, 19, 22].includes(+id) ? 3 : 14;
      if (a.n < min) continue;
      const cx = a.sx / a.n, cy = a.sy / a.n;
      let best = a.pts[0], bd = 1e9;
      for (const p of a.pts) { const d = (p[0] - cx) ** 2 + (p[1] - cy) ** 2; if (d < bd) { bd = d; best = p; } }
      out.push({ id: +id, n: a.n, x: (best[0] + 0.5) * sx, y: this.canvas.height - (best[1] + 0.5) * sy });
    }
    return out;
  }
}

export class HeartView {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) throw new Error("WebGL が使えません");
    this.gl = gl;
    this.prog = program(gl, VIEW_FRAG());
    gl.useProgram(this.prog.p);
    gl.uniform3fv(this.prog.U.uRib, new Float32Array(RIBS.flat(2)));
    gl.uniform3fv(this.prog.U.uCart, new Float32Array(CARTILAGE.flat(2)));
    this.yaw = 0.35; this.pitch = 0.25; this.dist = 46;
    this.target = add(GEO.M, mul(GEO.A, 1.5));
  }
  camPos() {
    const { yaw, pitch, dist, target } = this;
    return add(target, [Math.sin(yaw) * Math.cos(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist]);
  }
  draw(pose, cyc, opt) {
    const gl = this.gl, c = this.canvas, U = this.prog.U;
    gl.viewport(0, 0, c.width, c.height);
    gl.useProgram(this.prog.p);
    const cam = this.camPos();
    gl.uniform2f(U.uRes, c.width, c.height);
    gl.uniform3fv(U.uCam, cam);
    gl.uniform3fv(U.uTarget, this.target);
    gl.uniform3fv(U.uP, pose.P);
    gl.uniform3fv(U.uD, pose.d);
    gl.uniform3fv(U.uL, pose.l);
    gl.uniform1f(U.uDepth, pose.depth);
    gl.uniform1f(U.uHalf, pose.half);
    const n = cross(pose.l, pose.d);
    gl.uniform1f(U.uCut, opt.cut ? 1 : 0);
    gl.uniform1f(U.uCutSide, dot(sub(cam, pose.P), n) > 0 ? 1 : -1);
    gl.uniform1f(U.uBody, opt.body ? 1 : 0);
    gl.uniform1f(U.uRibs, opt.ribs ? 1 : 0);
    gl.uniform1f(U.uFan, opt.fan ? 1 : 0);
    setCycle(gl, U, cyc);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
