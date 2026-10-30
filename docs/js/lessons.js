// 基礎編の本文と確認問題。widget は basics.js の図の種類。
// 本文は HTML 文字列。数値は一般的な成人の基準。

import { MORE, POINTS, ORDER, GROUPS } from "./lessons2.js";

const BASE = [
  {
    id: "conduction",
    title: { ja: "刺激伝導系と心電図", en: "The conduction system and the ECG" },
    widget: "conduction",
    body: {
      ja: `
<p>心臓は、電気の興奮が決まった順番で伝わることで、心房、心室の順に規則正しく収縮します。この電気の通り道を<b>刺激伝導系</b>と呼びます。心電図は、この興奮が心筋に広がるときの電位の変化を体表から記録したものです。</p>
<p>図の各部分をクリックすると説明が出て、心電図のどの部分に対応するかが色で示されます。「再生」を押すと、1拍分の興奮の流れを遅くして見られます。</p>
<table>
<tr><th>部位</th><th>場所と働き</th><th>心電図との対応</th></tr>
<tr><td>洞結節（SA node）</td><td>右房の上部、上大静脈の入り口付近。自動能が最も高く（安静時60〜100/分）、正常の歩調取り（ペースメーカ）</td><td>洞結節そのものの興奮は小さすぎて体表心電図には写らない</td></tr>
<tr><td>心房</td><td>洞結節の興奮が右房から左房へ広がる</td><td>P波（前半は主に右房、後半は主に左房）</td></tr>
<tr><td>房室結節（AV node）</td><td>心房中隔の下部、三尖弁輪の近く。伝導がゆっくりで、心房が収縮し終わるまで心室への伝導を遅らせる。自動能は40〜60/分</td><td>PR間隔の大部分。房室結節は小さいので、この間は基線が平ら（PR部分）</td></tr>
<tr><td>ヒス束（His bundle）</td><td>房室結節に続いて心室中隔を下る。心房と心室の間は線維輪で絶縁されていて、正常ではここが唯一の通り道</td><td>PR部分に含まれ、体表心電図では見えない</td></tr>
<tr><td>右脚、左脚（前枝、後枝）</td><td>中隔の両側を下る。左脚はさらに前枝と後枝に分かれる</td><td>QRSの始まり（中隔は左から右へ興奮する）</td></tr>
<tr><td>プルキンエ線維</td><td>心室の内側に網目状に広がり、心室全体をほぼ同時に興奮させる。自動能は20〜40/分</td><td>幅の狭いQRS（120 ms未満、多くは100 ms以下）</td></tr>
<tr><td>心室の再分極</td><td>興奮した心室筋が元の状態に戻る</td><td>ST部分とT波</td></tr>
</table>
<p>心房の再分極（Ta波）もありますが、QRSと同じ時期に起こり、振幅も小さいので通常は見えません。</p>
<p>下位の部位ほど自動能が低いので、洞結節が止まると房室接合部（40〜60/分）、さらに止まると心室（20〜40/分）が代わりに歩調を取ります。これを<b>補充調律</b>と呼びます。</p>`,
      en: `
<p>The heart contracts in an orderly sequence, atria first and then ventricles, because electrical excitation travels along a fixed pathway: the <b>conduction system</b>. The ECG records, from the body surface, the voltage changes produced as this excitation spreads through the myocardium.</p>
<p>Click a structure in the diagram to see its role and the matching part of the ECG. Press “Play” to watch one beat in slow motion.</p>
<table>
<tr><th>Structure</th><th>Location and role</th><th>ECG correlate</th></tr>
<tr><td>Sinoatrial (SA) node</td><td>High right atrium near the superior vena cava. Highest automaticity (60–100/min at rest); the normal pacemaker</td><td>Too small to be seen on the surface ECG</td></tr>
<tr><td>Atria</td><td>Excitation spreads from the right to the left atrium</td><td>P wave (first part mainly right atrium, last part mainly left atrium)</td></tr>
<tr><td>Atrioventricular (AV) node</td><td>Low interatrial septum near the tricuspid annulus. Slow conduction delays ventricular activation until atrial contraction is complete. Intrinsic rate 40–60/min</td><td>Most of the PR interval; the baseline is flat (PR segment) because the node is small</td></tr>
<tr><td>Bundle of His</td><td>Continues from the AV node down the septum. The fibrous annulus insulates atria from ventricles, so normally this is the only connection</td><td>Within the PR segment; not visible on the surface ECG</td></tr>
<tr><td>Right and left bundle branches (left anterior and posterior fascicles)</td><td>Run down each side of the septum; the left bundle divides into anterior and posterior fascicles</td><td>Start of the QRS (the septum depolarizes left to right)</td></tr>
<tr><td>Purkinje fibers</td><td>A subendocardial network that activates both ventricles almost simultaneously. Intrinsic rate 20–40/min</td><td>A narrow QRS (< 120 ms, usually ≤ 100 ms)</td></tr>
<tr><td>Ventricular repolarization</td><td>Ventricular muscle recovers</td><td>ST segment and T wave</td></tr>
</table>
<p>Atrial repolarization (the Ta wave) also exists but is small and coincides with the QRS, so it is usually invisible.</p>
<p>Lower structures have lower automaticity. If the SA node fails, the AV junction (40–60/min) and then the ventricles (20–40/min) take over as <b>escape rhythms</b>.</p>`,
    },
    quiz: [
      {
        q: { ja: "正常の心臓で歩調取り（ペースメーカ）をしている部位はどこか。", en: "Which structure is the normal pacemaker of the heart?" },
        options: [{ ja: "洞結節", en: "SA node" }, { ja: "房室結節", en: "AV node" }, { ja: "ヒス束", en: "Bundle of His" }, { ja: "プルキンエ線維", en: "Purkinje fibers" }],
        answer: 0,
        why: { ja: "自動能が最も高い洞結節が歩調を取る。下位の部位は洞結節が止まったときに補充調律として働く。", en: "The SA node has the highest automaticity; lower structures act only as escape pacemakers." },
      },
      {
        q: { ja: "PR間隔の大部分を占める伝導の遅れは、どこで起こるか。", en: "Where does most of the delay within the PR interval occur?" },
        options: [{ ja: "心房筋", en: "Atrial muscle" }, { ja: "房室結節", en: "AV node" }, { ja: "右脚", en: "Right bundle branch" }, { ja: "心室筋", en: "Ventricular muscle" }],
        answer: 1,
        why: { ja: "房室結節は伝導が遅く、心房の収縮が終わるまで心室への伝導を待たせる。I度房室ブロックの多くはここの伝導遅延。", en: "The AV node conducts slowly so that atrial contraction finishes first. First-degree AV block is usually delay at this level." },
      },
      {
        q: { ja: "体表心電図で見えないものはどれか。", en: "Which of these is NOT visible on the surface ECG?" },
        options: [{ ja: "心房の脱分極", en: "Atrial depolarization" }, { ja: "心室の脱分極", en: "Ventricular depolarization" }, { ja: "洞結節の興奮", en: "SA node discharge" }, { ja: "心室の再分極", en: "Ventricular repolarization" }],
        answer: 2,
        why: { ja: "洞結節は組織が小さく、その興奮は体表心電図に写らない。洞結節の働きは、P波の形とタイミングから推定する。", en: "The SA node is too small to register; its activity is inferred from the P waves." },
      },
    ],
  },
  {
    id: "waves",
    title: { ja: "波形の名前と正常値", en: "Waves, intervals and normal values" },
    widget: "waves",
    body: {
      ja: `
<p>1拍の心電図は、P波、QRS波、T波（ときにU波）と、それらの間の部分や間隔でできています。下の一覧の項目をクリックすると、図のその部分が強調されます。</p>
<table>
<tr><th>名前</th><th>表すもの</th><th>正常の目安（成人）</th></tr>
<tr><td>P波</td><td>心房の脱分極</td><td>幅120 ms未満、II誘導で高さ2.5 mm未満</td></tr>
<tr><td>PR間隔</td><td>P波の始まりからQRSの始まりまで。心房から房室結節、ヒス束、脚を通って心室に届くまでの時間</td><td>120〜200 ms</td></tr>
<tr><td>QRS波</td><td>心室の脱分極。最初の下向きの波をQ、最初の上向きの波をR、Rの後の下向きの波をSと呼ぶ</td><td>幅120 ms未満（多くは60〜100 ms）</td></tr>
<tr><td>ST部分</td><td>QRSの終わり（J点）からT波の始まりまで。心室全体が脱分極している時期</td><td>基線とほぼ同じ高さ</td></tr>
<tr><td>T波</td><td>心室の再分極</td><td>I、II、V3〜V6 で上向き、aVR で下向き</td></tr>
<tr><td>U波</td><td>由来ははっきりしない。T波の後の小さな波で、V2、V3 で見やすい</td><td>T波より小さい</td></tr>
<tr><td>QT間隔</td><td>QRSの始まりからT波の終わりまで。心室の脱分極と再分極の全体</td><td>心拍数で補正したQTcで、男性450 ms未満、女性460 ms未満</td></tr>
</table>
<p>QT間隔は心拍数が速いほど短くなるので、心拍数で補正した <b>QTc</b> で評価します。よく使う Bazett の式は QTc ＝ QT ÷ √RR（RRは秒）です。</p>`,
      en: `
<p>Each beat consists of the P wave, the QRS complex and the T wave (sometimes a U wave), plus the segments and intervals between them. Click an item in the list to highlight it on the diagram.</p>
<table>
<tr><th>Name</th><th>Represents</th><th>Normal (adult)</th></tr>
<tr><td>P wave</td><td>Atrial depolarization</td><td>< 120 ms wide, < 2.5 mm tall in lead II</td></tr>
<tr><td>PR interval</td><td>Start of P to start of QRS: conduction from the atria through the AV node, His bundle and bundle branches</td><td>120–200 ms</td></tr>
<tr><td>QRS complex</td><td>Ventricular depolarization. First negative deflection = Q, first positive = R, negative after R = S</td><td>< 120 ms (usually 60–100 ms)</td></tr>
<tr><td>ST segment</td><td>From the end of QRS (J point) to the start of T, when the whole ventricle is depolarized</td><td>Near the baseline</td></tr>
<tr><td>T wave</td><td>Ventricular repolarization</td><td>Upright in I, II, V3–V6; inverted in aVR</td></tr>
<tr><td>U wave</td><td>Origin uncertain; a small wave after T, best seen in V2–V3</td><td>Smaller than T</td></tr>
<tr><td>QT interval</td><td>Start of QRS to end of T: total ventricular depolarization and repolarization</td><td>QTc < 450 ms (men), < 460 ms (women)</td></tr>
</table>
<p>QT shortens as heart rate rises, so it is assessed as the rate-corrected <b>QTc</b>. Bazett's formula is QTc = QT ÷ √RR (RR in seconds).</p>`,
    },
    quiz: [
      {
        q: { ja: "QRS波が表すものはどれか。", en: "What does the QRS complex represent?" },
        options: [{ ja: "心房の脱分極", en: "Atrial depolarization" }, { ja: "心室の脱分極", en: "Ventricular depolarization" }, { ja: "心室の再分極", en: "Ventricular repolarization" }, { ja: "房室結節の伝導", en: "AV nodal conduction" }],
        answer: 1,
        why: { ja: "QRSは心室の脱分極。心室の再分極はST部分とT波。", en: "QRS = ventricular depolarization; repolarization is the ST segment and T wave." },
      },
      {
        q: { ja: "正常のPR間隔はどれか。", en: "What is the normal PR interval?" },
        options: [{ ja: "60〜100 ms", en: "60–100 ms" }, { ja: "120〜200 ms", en: "120–200 ms" }, { ja: "200〜300 ms", en: "200–300 ms" }, { ja: "350〜450 ms", en: "350–450 ms" }],
        answer: 1,
        why: { ja: "120〜200 ms。200 msを超えるとI度房室ブロック、120 ms未満ならWPW症候群などの早期興奮を考える。", en: "120–200 ms. Longer suggests first-degree AV block; shorter suggests pre-excitation such as WPW." },
      },
      {
        q: { ja: "QT間隔を評価するとき、心拍数で補正する理由はどれか。", en: "Why is the QT interval corrected for heart rate?" },
        options: [{ ja: "心拍数が速いほどQTが短くなるため", en: "QT shortens as heart rate increases" }, { ja: "QRS幅が心拍数で変わるため", en: "QRS width changes with rate" }, { ja: "P波の幅が変わるため", en: "P-wave width changes" }, { ja: "電気軸が変わるため", en: "The axis changes" }],
        answer: 0,
        why: { ja: "QTは心拍数に依存して短くなるので、QTc（Bazett の式なら QT ÷ √RR）で比べる。", en: "QT depends on rate, so QTc (e.g., Bazett: QT ÷ √RR) is used for comparison." },
      },
    ],
  },
  {
    id: "paper",
    title: { ja: "記録紙の読み方と心拍数", en: "Reading the paper and heart rate" },
    widget: "paper",
    body: {
      ja: `
<p>標準の記録は、紙送り速度 <b>25 mm/s</b>、感度 <b>10 mm/mV</b> です。記録の左端の四角い波（較正波）は1 mVの高さで、10 mmになっていれば標準の感度です。</p>
<ul>
<li>小さい目盛り（1 mm）＝ 0.04秒（40 ms）、0.1 mV</li>
<li>大きい目盛り（5 mm）＝ 0.2秒（200 ms）、0.5 mV</li>
<li>大きい目盛り5つ（25 mm）＝ 1秒</li>
</ul>
<p>RR間隔が規則正しいときの心拍数の求め方です。</p>
<ul>
<li>300 ÷ RR間隔の大きい目盛りの数（大きい目盛り1つなら300、2つなら150、3つなら100、4つなら75、5つなら60、6つなら50/分）</li>
<li>1500 ÷ RR間隔の小さい目盛りの数（より正確）</li>
</ul>
<p>心房細動のようにRR間隔が不規則なときは、一定時間のQRSの数を数えます。12誘導の記録は10秒なので、QRSの数×6 が1分あたりの心拍数です。</p>
<p>下の実際の記録（II誘導、10秒）で、R波からR波までをドラッグして測ってみてください。</p>`,
      en: `
<p>Standard recording uses a paper speed of <b>25 mm/s</b> and a gain of <b>10 mm/mV</b>. The square calibration pulse at the left is 1 mV; at standard gain it is 10 mm tall.</p>
<ul>
<li>Small box (1 mm) = 0.04 s (40 ms), 0.1 mV</li>
<li>Large box (5 mm) = 0.2 s (200 ms), 0.5 mV</li>
<li>Five large boxes (25 mm) = 1 s</li>
</ul>
<p>For a regular rhythm:</p>
<ul>
<li>300 ÷ number of large boxes between R waves (1 → 300, 2 → 150, 3 → 100, 4 → 75, 5 → 60, 6 → 50/min)</li>
<li>1500 ÷ number of small boxes (more precise)</li>
</ul>
<p>For an irregular rhythm such as atrial fibrillation, count QRS complexes over a fixed time. A 12-lead recording lasts 10 s, so QRS count × 6 = rate per minute.</p>
<p>Try it on the real recording below (lead II, 10 s): drag from one R wave to the next.</p>`,
    },
    quiz: [
      {
        q: { ja: "25 mm/s の記録で、小さい目盛り1つ（1 mm）は何秒か。", en: "At 25 mm/s, how long is one small box (1 mm)?" },
        options: [{ ja: "0.02秒", en: "0.02 s" }, { ja: "0.04秒", en: "0.04 s" }, { ja: "0.1秒", en: "0.1 s" }, { ja: "0.2秒", en: "0.2 s" }],
        answer: 1,
        why: { ja: "1秒で25 mm進むので、1 mm は 1/25 秒 ＝ 0.04秒。", en: "25 mm per second, so 1 mm = 1/25 s = 0.04 s." },
      },
      {
        q: { ja: "RR間隔が大きい目盛り4つ分のとき、心拍数はおよそいくつか。", en: "If the RR interval spans four large boxes, what is the heart rate?" },
        options: [{ ja: "50/分", en: "50/min" }, { ja: "60/分", en: "60/min" }, { ja: "75/分", en: "75/min" }, { ja: "100/分", en: "100/min" }],
        answer: 2,
        why: { ja: "300 ÷ 4 ＝ 75/分。RR間隔 0.8秒なので 60 ÷ 0.8 ＝ 75 とも計算できる。", en: "300 ÷ 4 = 75/min (RR 0.8 s → 60 ÷ 0.8 = 75)." },
      },
      {
        q: { ja: "較正波の高さが5 mmだった。どう読むべきか。", en: "The calibration pulse is 5 mm tall. What does that mean?" },
        options: [{ ja: "標準の感度（10 mm/mV）", en: "Standard gain (10 mm/mV)" }, { ja: "感度が半分（5 mm/mV）で、波形は実際の半分の高さ", en: "Half gain (5 mm/mV): waves appear half their true height" }, { ja: "紙送りが2倍速", en: "Double paper speed" }, { ja: "記録の異常で読めない", en: "The recording is unreadable" }],
        answer: 1,
        why: { ja: "較正波は1 mV。5 mmなら感度は5 mm/mVで、高電位の記録で振幅を抑えるときに使う。電位を読むときは2倍にする。", en: "The pulse is 1 mV, so 5 mm means 5 mm/mV, often used for high-voltage tracings; double the amplitudes when measuring." },
      },
    ],
  },
  {
    id: "sinus",
    title: { ja: "洞調律とは", en: "What is sinus rhythm?" },
    widget: "sinus",
    body: {
      ja: `
<p>洞結節が歩調を取り、その興奮が正常の順番で心房、房室結節、心室へ伝わっている状態を<b>洞調律</b>と呼びます。洞結節の興奮そのものは見えないので、P波で判断します。</p>
<p>洞調律の条件は次のとおりです。</p>
<ol>
<li>P波が規則正しく出ている</li>
<li>P波の向きが洞結節由来に合う：I、II、aVF で上向き、aVR で下向き（興奮が右上から左下へ広がるため）</li>
<li>すべてのP波の後にQRSが続き、PR間隔が一定</li>
</ol>
<p>洞調律のうち、心拍数60〜100/分を<b>正常洞調律</b>、60/分未満を<b>洞徐脈</b>、100/分を超えるものを<b>洞頻脈</b>と呼びます。呼吸に合わせてRR間隔が変動するもの（吸気で速くなる）は<b>洞不整脈</b>で、若い人では正常でも見られます。</p>
<p>下の図は、同じ患者の I、II、aVR、aVF と、心房細動の患者の II誘導です。洞調律では II で上向き、aVR で下向きのP波が各QRSの前にあります。心房細動ではP波がなく、RR間隔が不規則です。</p>`,
      en: `
<p><b>Sinus rhythm</b> means the SA node is the pacemaker and its impulse travels in the normal order through the atria, AV node and ventricles. Because SA-node discharge itself is invisible, it is judged from the P waves.</p>
<p>Criteria for sinus rhythm:</p>
<ol>
<li>Regular P waves</li>
<li>P-wave axis consistent with a sinus origin: upright in I, II and aVF, inverted in aVR (activation spreads from upper right to lower left)</li>
<li>Every P wave is followed by a QRS with a constant PR interval</li>
</ol>
<p>Sinus rhythm at 60–100/min is <b>normal sinus rhythm</b>; below 60/min is <b>sinus bradycardia</b>; above 100/min is <b>sinus tachycardia</b>. RR variation with breathing (faster on inspiration) is <b>sinus arrhythmia</b>, a normal finding in young people.</p>
<p>Below: leads I, II, aVR and aVF of one patient in sinus rhythm, and lead II of a patient in atrial fibrillation. In sinus rhythm an upright P in II and an inverted P in aVR precede every QRS. In AF there are no P waves and the RR intervals are irregular.</p>`,
    },
    quiz: [
      {
        q: { ja: "洞調律でP波が下向き（陰性）になる誘導はどれか。", en: "In sinus rhythm, in which lead is the P wave inverted?" },
        options: [{ ja: "I", en: "I" }, { ja: "II", en: "II" }, { ja: "aVR", en: "aVR" }, { ja: "aVF", en: "aVF" }],
        answer: 2,
        why: { ja: "心房の興奮は右上から左下へ向かうので、右上から見る aVR では遠ざかる向きになり陰性になる。", en: "Atrial activation moves from upper right to lower left, away from aVR, so P is negative there." },
      },
      {
        q: { ja: "洞調律の条件に含まれないものはどれか。", en: "Which is NOT a criterion for sinus rhythm?" },
        options: [{ ja: "P波が I、II、aVF で上向き", en: "Upright P in I, II, aVF" }, { ja: "すべてのP波にQRSが続く", en: "Every P wave is followed by a QRS" }, { ja: "QRS幅が120 ms未満", en: "QRS narrower than 120 ms" }, { ja: "PR間隔が一定", en: "Constant PR interval" }],
        answer: 2,
        why: { ja: "QRS幅は心室内の伝導を表し、調律の起源とは別の話。脚ブロックがあっても洞調律でありうる。", en: "QRS width reflects intraventricular conduction, not the rhythm's origin; bundle branch block can coexist with sinus rhythm." },
      },
      {
        q: { ja: "洞調律で心拍数が110/分。正しい呼び方はどれか。", en: "Sinus rhythm at 110/min is called:" },
        options: [{ ja: "正常洞調律", en: "Normal sinus rhythm" }, { ja: "洞頻脈", en: "Sinus tachycardia" }, { ja: "洞徐脈", en: "Sinus bradycardia" }, { ja: "上室頻拍", en: "Supraventricular tachycardia" }],
        answer: 1,
        why: { ja: "洞調律で100/分を超えれば洞頻脈。発熱、脱水、貧血、疼痛などで起こる。", en: "Sinus rhythm above 100/min is sinus tachycardia (fever, dehydration, anemia, pain, etc.)." },
      },
    ],
  },
  {
    id: "avblock",
    title: { ja: "房室ブロック", en: "AV block" },
    widget: "avblock",
    body: {
      ja: `
<p>心房の興奮が心室へ伝わるまでの道（房室結節、ヒス束、脚）で、伝導が遅れたり途切れたりする状態を<b>房室ブロック</b>と呼びます。型は、P波とQRSの関係を見れば決まります。</p>
<table>
<tr><th>型</th><th>P波とQRSの関係</th><th>ポイント</th></tr>
<tr><td>I度</td><td>PR間隔が200 msを超えて一定。QRSの脱落はない</td><td>伝導が遅れているだけで、すべてのP波は伝わる</td></tr>
<tr><td>II度 Wenckebach型（Mobitz I型）</td><td>PR間隔が1拍ごとに延び、やがてQRSが1拍抜ける。抜けた直後のPRが最も短い</td><td>多くは房室結節の障害。迷走神経が強いとき（睡眠中、運動選手）にも見られ、比較的良性</td></tr>
<tr><td>II度 Mobitz II型</td><td>PR間隔は一定のまま、予告なくQRSが抜ける</td><td>多くはヒス束より下の障害。完全房室ブロックに進むことがあり、ペースメーカの適応になりうる</td></tr>
<tr><td>2:1 房室ブロック</td><td>P波2つに1つだけQRSが続く</td><td>続けて伝わる拍がないのでPRの変化を比べられず、この部分だけでは Wenckebach型か Mobitz II型かを決められない</td></tr>
<tr><td>高度房室ブロック</td><td>2つ以上続けてP波が伝わらない（3:1 など）</td><td>伝わる拍のPRは一定で、PとQRSの関係はまだ残っている</td></tr>
<tr><td>III度（完全）</td><td>P波とQRSがそれぞれ一定の間隔で出て、両者に関係がない（房室解離）。心房レートのほうが心室レートより速い</td><td>心室は補充調律で動く。接合部起源なら幅の狭いQRS（40〜60/分）、心室起源なら幅の広いQRS（20〜40/分）</td></tr>
</table>
<p>読むときのコツは次の3つです。</p>
<ol>
<li><b>先にP波をすべて拾う</b>：P波はT波やQRSに重なって隠れることがある。PP間隔は一定なので、見えるP波から間隔を測って、隠れたP波の位置を予想する</li>
<li><b>各P波のPR間隔を測る</b>：一定か、延びていくか、ばらばらか</li>
<li><b>抜けた拍の前後を比べる</b>：抜ける前にPRが延びていれば Wenckebach型、変わらなければ Mobitz II型</li>
</ol>
<p>早く出た心房期外収縮のP′波が伝わらない場合（非伝導性心房期外収縮）もQRSが抜けて見えます。房室ブロックと違って、そのP′波は予定より早く出る（PP間隔が短くなる）ので区別できます。</p>
<p>下の図の上段は、型ごとの違いを示す模式図です。ボタンで型を切り替えると、P波の下にPR間隔（ms）が出て、伝わらなかったP波には × がつきます。下段は実際の記録です。</p>`,
      en: `
<p><b>AV block</b> is delayed or interrupted conduction from the atria to the ventricles (through the AV node, His bundle and bundle branches). The type is determined by the relationship between P waves and QRS complexes.</p>
<table>
<tr><th>Type</th><th>P–QRS relationship</th><th>Key points</th></tr>
<tr><td>First degree</td><td>Constant PR > 200 ms; no dropped QRS</td><td>Conduction is slow, but every P wave conducts</td></tr>
<tr><td>Second degree, Wenckebach (Mobitz I)</td><td>PR lengthens beat by beat until a QRS is dropped; the PR right after the drop is the shortest</td><td>Usually AV nodal. Seen with high vagal tone (sleep, athletes); relatively benign</td></tr>
<tr><td>Second degree, Mobitz II</td><td>Constant PR, then a sudden dropped QRS</td><td>Usually below the His bundle. May progress to complete block; may require a pacemaker</td></tr>
<tr><td>2:1 AV block</td><td>Only every second P wave conducts</td><td>No two consecutive conducted beats, so PR behavior cannot be compared: Mobitz I and II cannot be distinguished from this alone</td></tr>
<tr><td>High-grade AV block</td><td>Two or more consecutive P waves fail to conduct (e.g., 3:1)</td><td>Conducted beats have a constant PR, so some P–QRS relationship remains</td></tr>
<tr><td>Third degree (complete)</td><td>P waves and QRS complexes each occur regularly with no relationship (AV dissociation); atrial rate faster than ventricular rate</td><td>An escape rhythm drives the ventricles: narrow QRS if junctional (40–60/min), wide if ventricular (20–40/min)</td></tr>
</table>
<p>Three tips:</p>
<ol>
<li><b>Find every P wave first</b>: P waves can hide in T waves or QRS complexes. PP intervals are regular, so march out the hidden ones from the visible ones</li>
<li><b>Measure the PR of each P wave</b>: constant, lengthening, or random?</li>
<li><b>Compare the beats around a drop</b>: PR lengthening before the drop = Wenckebach; unchanged = Mobitz II</li>
</ol>
<p>A blocked premature atrial complex also produces a missing QRS. Unlike AV block, its P′ wave comes early (shorter PP interval).</p>
<p>The top panel is a schematic showing each type. Switch types with the buttons; the PR interval (ms) appears under each P wave and blocked P waves are marked ×. The bottom panels are real recordings.</p>`,
    },
    quiz: [
      {
        q: { ja: "PR間隔が1拍ごとに延びて、QRSが1拍抜けることを繰り返す。どの型か。", en: "The PR interval lengthens beat by beat until a QRS is dropped, repeatedly. Which type?" },
        options: [{ ja: "I度房室ブロック", en: "First-degree AV block" }, { ja: "Wenckebach型（Mobitz I型）", en: "Wenckebach (Mobitz I)" }, { ja: "Mobitz II型", en: "Mobitz II" }, { ja: "完全房室ブロック", en: "Complete AV block" }],
        answer: 1,
        why: { ja: "PRが徐々に延びて脱落するのが Wenckebach型。脱落直後のPRが最も短くなる。", en: "Progressive PR prolongation ending in a dropped beat is Wenckebach; the PR after the drop is the shortest." },
      },
      {
        q: { ja: "2:1 房室ブロックで、Wenckebach型か Mobitz II型かを決められない理由はどれか。", en: "Why can't 2:1 AV block be classified as Mobitz I or II?" },
        options: [{ ja: "P波が見えないから", en: "P waves are not visible" }, { ja: "続けて伝わる拍がなく、PRの変化を比べられないから", en: "There are no consecutive conducted beats to compare PR" }, { ja: "QRS幅が広いから", en: "The QRS is wide" }, { ja: "心拍数が速すぎるから", en: "The rate is too fast" }],
        answer: 1,
        why: { ja: "型の区別は、抜ける前にPRが延びるかどうかで決める。2:1 では伝わる拍が1つおきなので比べられない。伝導比が変わる部分を探す。", en: "Classification relies on PR change before the drop; with 2:1 conduction there is nothing to compare. Look for a segment where the ratio changes." },
      },
      {
        q: { ja: "完全房室ブロックの特徴はどれか。", en: "Which describes complete AV block?" },
        options: [{ ja: "PRが一定で、ときどきQRSが抜ける", en: "Constant PR with occasional dropped QRS" }, { ja: "P波とQRSが無関係に出て、心房レートが心室レートより速い", en: "P waves and QRS are unrelated; the atrial rate exceeds the ventricular rate" }, { ja: "P波がなくRR間隔が不規則", en: "No P waves and irregular RR" }, { ja: "PRが200 msを超えて一定", en: "Constant PR above 200 ms" }],
        answer: 1,
        why: { ja: "心房と心室が別々のリズムで動く（房室解離）。心室は補充調律なので心房より遅い。", en: "Atria and ventricles beat independently (AV dissociation); the ventricular escape rhythm is slower than the atrial rate." },
      },
      {
        q: { ja: "完全房室ブロックに進む危険が高く、ペースメーカの適応を考える型はどれか。", en: "Which type carries a high risk of progressing to complete block and may need a pacemaker?" },
        options: [{ ja: "I度房室ブロック", en: "First-degree AV block" }, { ja: "Wenckebach型", en: "Wenckebach" }, { ja: "Mobitz II型", en: "Mobitz II" }, { ja: "洞不整脈", en: "Sinus arrhythmia" }],
        answer: 2,
        why: { ja: "Mobitz II型はヒス束より下の障害が多く、突然完全房室ブロックに進むことがある。", en: "Mobitz II usually reflects infra-Hisian disease and can suddenly progress to complete block." },
      },
    ],
  },
  {
    id: "leads",
    title: { ja: "12誘導の見方", en: "The 12 leads" },
    widget: "leads",
    body: {
      ja: `
<p>12誘導心電図は、心臓の電気の動きを12の方向から見たものです。興奮が誘導の＋側に向かうと上向きの波、遠ざかると下向きの波になります。</p>
<p><b>四肢誘導</b>（I、II、III、aVR、aVL、aVF）は、心臓を正面（前額面）から見ます。右の図の線は各誘導の向きで、ラベルがある側が＋です。</p>
<p><b>胸部誘導</b>（V1〜V6）は、心臓を水平面で輪切りにした方向から見ます。電極の位置は次のとおりです。</p>
<ul>
<li>V1：第4肋間、胸骨右縁</li>
<li>V2：第4肋間、胸骨左縁</li>
<li>V3：V2 と V4 の中間</li>
<li>V4：第5肋間、左鎖骨中線</li>
<li>V5：V4 と同じ高さ、左前腋窩線</li>
<li>V6：V4 と同じ高さ、左中腋窩線</li>
</ul>
<p>どの誘導が心臓のどの部分を見ているかを覚えると、梗塞の部位や責任血管を考えられるようになります。</p>
<table>
<tr><th>部位</th><th>誘導</th><th>主な栄養血管</th></tr>
<tr><td>下壁</td><td>II、III、aVF</td><td>右冠動脈（左回旋枝のこともある）</td></tr>
<tr><td>中隔</td><td>V1、V2</td><td>左前下行枝</td></tr>
<tr><td>前壁</td><td>V3、V4</td><td>左前下行枝</td></tr>
<tr><td>側壁</td><td>I、aVL（高位側壁）、V5、V6（低位側壁）</td><td>左回旋枝、左前下行枝の対角枝</td></tr>
</table>
<p>胸部誘導では、V1 から V6 へ向かうにつれてR波が高く、S波が浅くなります（R波の増高）。R波とS波がほぼ同じ高さになる誘導を移行帯と呼び、通常は V3〜V4 です。</p>`,
      en: `
<p>The 12-lead ECG views the heart's electrical activity from 12 directions. Activation moving toward a lead's positive pole produces an upward deflection; moving away produces a downward one.</p>
<p><b>Limb leads</b> (I, II, III, aVR, aVL, aVF) view the heart in the frontal plane. In the diagram, each line is a lead and the labelled end is positive.</p>
<p><b>Chest leads</b> (V1–V6) view it in the horizontal plane. Electrode positions:</p>
<ul>
<li>V1: 4th intercostal space, right sternal border</li>
<li>V2: 4th intercostal space, left sternal border</li>
<li>V3: midway between V2 and V4</li>
<li>V4: 5th intercostal space, left midclavicular line</li>
<li>V5: same level as V4, left anterior axillary line</li>
<li>V6: same level as V4, left midaxillary line</li>
</ul>
<p>Knowing which leads face which wall lets you localize infarction and its culprit artery.</p>
<table>
<tr><th>Wall</th><th>Leads</th><th>Usual artery</th></tr>
<tr><td>Inferior</td><td>II, III, aVF</td><td>RCA (sometimes LCx)</td></tr>
<tr><td>Septal</td><td>V1, V2</td><td>LAD</td></tr>
<tr><td>Anterior</td><td>V3, V4</td><td>LAD</td></tr>
<tr><td>Lateral</td><td>I, aVL (high lateral), V5, V6 (low lateral)</td><td>LCx, diagonal branches of LAD</td></tr>
</table>
<p>Across the chest leads the R wave grows and the S wave shrinks from V1 to V6 (R-wave progression). The lead where R and S are about equal is the transition zone, normally V3–V4.</p>`,
    },
    quiz: [
      {
        q: { ja: "下壁を見ている誘導の組み合わせはどれか。", en: "Which leads face the inferior wall?" },
        options: [{ ja: "I、aVL", en: "I, aVL" }, { ja: "II、III、aVF", en: "II, III, aVF" }, { ja: "V1、V2", en: "V1, V2" }, { ja: "V5、V6", en: "V5, V6" }],
        answer: 1,
        why: { ja: "II（+60°）、III（+120°）、aVF（+90°）は下方を向いていて、下壁を見る。", en: "II (+60°), III (+120°) and aVF (+90°) point downward and face the inferior wall." },
      },
      {
        q: { ja: "V1 の電極の位置はどこか。", en: "Where is the V1 electrode placed?" },
        options: [{ ja: "第4肋間、胸骨右縁", en: "4th ICS, right sternal border" }, { ja: "第4肋間、胸骨左縁", en: "4th ICS, left sternal border" }, { ja: "第5肋間、左鎖骨中線", en: "5th ICS, left midclavicular line" }, { ja: "左中腋窩線", en: "Left midaxillary line" }],
        answer: 0,
        why: { ja: "V1 は第4肋間胸骨右縁、V2 は第4肋間胸骨左縁。高すぎる位置に貼ると波形が変わるので注意する。", en: "V1: 4th ICS right sternal border; V2: 4th ICS left sternal border. Misplacement changes the waveform." },
      },
      {
        q: { ja: "興奮が誘導の＋側から遠ざかるとき、波形はどうなるか。", en: "When activation moves away from a lead's positive pole, the deflection is:" },
        options: [{ ja: "上向き", en: "Upward" }, { ja: "下向き", en: "Downward" }, { ja: "平坦", en: "Flat" }, { ja: "幅が広くなる", en: "Wider" }],
        answer: 1,
        why: { ja: "近づけば上向き、遠ざかれば下向き、直角に動けば上下ほぼ同じ大きさ（二相性）になる。", en: "Toward = upward, away = downward, perpendicular = roughly equiphasic." },
      },
    ],
  },
  {
    id: "axis",
    title: { ja: "電気軸", en: "The electrical axis" },
    widget: "axis",
    body: {
      ja: `
<p><b>電気軸</b>は、心室の興奮（QRS）が前額面で全体としてどの方向に向かうかを角度で表したものです。右向きを0°として、下向きを＋、上向きを−で表します。</p>
<table>
<tr><th>電気軸</th><th>呼び方</th></tr>
<tr><td>−30°〜+90°</td><td>正常軸</td></tr>
<tr><td>−30°より上（−30°〜−90°）</td><td>左軸偏位</td></tr>
<tr><td>+90°より右（+90°〜+180°）</td><td>右軸偏位</td></tr>
<tr><td>−90°〜±180°</td><td>高度な軸偏位（北西軸）</td></tr>
</table>
<p>正常範囲を 0°〜+90° や −30°〜+110° とする教科書もあります。</p>
<p>素早く判断するには、I と aVF のQRSの向き（上向きの成分と下向きの成分のどちらが大きいか）を見ます。</p>
<ul>
<li>I が上向き、aVF が上向き → 正常軸（0°〜+90°）</li>
<li>I が上向き、aVF が下向き → II を見る。II が上向きなら正常（0°〜−30°）、下向きなら左軸偏位</li>
<li>I が下向き、aVF が上向き → 右軸偏位</li>
<li>I も aVF も下向き → 高度な軸偏位</li>
</ul>
<p>右の図のスライダーで電気軸を動かすと、各四肢誘導のQRSの向きと大きさがどう変わるかを確かめられます。QRSの大きさは、電気軸と誘導の向きのなす角度の余弦（cos）に比例します。</p>
<p>左軸偏位の原因には左脚前枝ブロック、下壁梗塞、左室肥大など、右軸偏位の原因には右室肥大、左脚後枝ブロック、側壁梗塞、肺疾患などがあります。</p>`,
      en: `
<p>The <b>electrical axis</b> is the overall direction of ventricular activation (QRS) in the frontal plane, expressed in degrees: 0° points to the patient's left, positive angles point downward, negative angles upward.</p>
<table>
<tr><th>Axis</th><th>Name</th></tr>
<tr><td>−30° to +90°</td><td>Normal axis</td></tr>
<tr><td>Beyond −30° (−30° to −90°)</td><td>Left axis deviation</td></tr>
<tr><td>Beyond +90° (+90° to +180°)</td><td>Right axis deviation</td></tr>
<tr><td>−90° to ±180°</td><td>Extreme (northwest) axis</td></tr>
</table>
<p>Some textbooks use 0° to +90° or −30° to +110° as normal.</p>
<p>For a quick estimate, check whether the QRS in I and aVF is net positive or net negative:</p>
<ul>
<li>I positive, aVF positive → normal (0° to +90°)</li>
<li>I positive, aVF negative → check II: positive = normal (0° to −30°), negative = left axis deviation</li>
<li>I negative, aVF positive → right axis deviation</li>
<li>I and aVF both negative → extreme axis</li>
</ul>
<p>Move the slider in the diagram to see how the QRS in each limb lead changes. The QRS size is proportional to the cosine of the angle between the axis and the lead.</p>
<p>Causes of left axis deviation include left anterior fascicular block, inferior MI and LVH; causes of right axis deviation include RVH, left posterior fascicular block, lateral MI and lung disease.</p>`,
    },
    quiz: [
      {
        q: { ja: "I が上向き、aVF が下向き、II が下向き。電気軸はどれか。", en: "I positive, aVF negative, II negative. The axis is:" },
        options: [{ ja: "正常軸", en: "Normal" }, { ja: "左軸偏位", en: "Left axis deviation" }, { ja: "右軸偏位", en: "Right axis deviation" }, { ja: "高度な軸偏位", en: "Extreme axis" }],
        answer: 1,
        why: { ja: "II（+60°）が下向きなら、電気軸は +60° に直交する −30° より上にある。よって −30° を超える左軸偏位。", en: "A negative II (+60°) means the axis lies beyond −30° (perpendicular to II), i.e., left axis deviation." },
      },
      {
        q: { ja: "I が下向き、aVF が上向き。電気軸はどれか。", en: "I negative, aVF positive. The axis is:" },
        options: [{ ja: "正常軸", en: "Normal" }, { ja: "左軸偏位", en: "Left axis deviation" }, { ja: "右軸偏位", en: "Right axis deviation" }, { ja: "高度な軸偏位", en: "Extreme axis" }],
        answer: 2,
        why: { ja: "I が下向きなので +90° より右、aVF が上向きなので下半分。+90°〜+180° の右軸偏位。", en: "Negative I puts the axis beyond +90°; positive aVF keeps it in the lower half: +90° to +180°." },
      },
      {
        q: { ja: "左軸偏位の原因として代表的なものはどれか。", en: "A typical cause of left axis deviation is:" },
        options: [{ ja: "左脚前枝ブロック", en: "Left anterior fascicular block" }, { ja: "右室肥大", en: "Right ventricular hypertrophy" }, { ja: "左脚後枝ブロック", en: "Left posterior fascicular block" }, { ja: "右胸心", en: "Dextrocardia" }],
        answer: 0,
        why: { ja: "左脚前枝ブロックでは電気軸が −45°〜−90° になる。右室肥大と左脚後枝ブロックは右軸偏位の原因。", en: "LAFB gives an axis of −45° to −90°. RVH and LPFB cause right axis deviation." },
      },
    ],
  },
  {
    id: "steps",
    title: { ja: "判読の手順", en: "A systematic approach" },
    widget: null,
    body: {
      ja: `
<p>見落としを減らすには、毎回同じ順番で読みます。検定の問題でも、この順に確かめると選択肢を絞りやすくなります。</p>
<ol>
<li><b>記録の確認</b>：較正波（10 mm/mV）、紙送り（25 mm/s）、電極の付け間違いがないか（I で P、QRS、T がすべて下向きなら上肢の左右逆を疑う）</li>
<li><b>心拍数</b>：300 ÷ 大きい目盛りの数、不規則なら10秒間のQRS数×6</li>
<li><b>調律</b>：RR間隔は規則的か。P波はあるか、形と向きは洞調律に合うか。PとQRSの関係は1対1か</li>
<li><b>電気軸</b>：I と aVF（必要なら II）のQRSの向き</li>
<li><b>間隔</b>：PR（120〜200 ms）、QRS幅（120 ms未満）、QT（QTc）</li>
<li><b>P波</b>：幅と高さ（右房負荷、左房負荷）</li>
<li><b>QRS</b>：異常Q波、高電位や低電位、R波の増高、脚ブロックの形</li>
<li><b>ST部分</b>：上昇や低下と、その誘導の分布（部位が対応するか、対側の変化があるか）</li>
<li><b>T波とU波</b>：陰性T波、テント状T波、U波</li>
<li><b>まとめ</b>：所見を並べ、患者の情報（年齢、症状、薬剤、電解質）と合わせて判断する</li>
</ol>
<p>演習モードの解説には、自動計測の心拍数、PR、QRS幅、QTc、電気軸が出ます。自分で測った値と比べると、測り方の癖がわかります。</p>`,
      en: `
<p>Read every tracing in the same order to avoid missing findings. The same sequence also helps narrow down exam options.</p>
<ol>
<li><b>Technical check</b>: calibration (10 mm/mV), paper speed (25 mm/s), lead misplacement (P, QRS and T all negative in I suggests reversed arm leads)</li>
<li><b>Rate</b>: 300 ÷ large boxes, or QRS count in 10 s × 6 if irregular</li>
<li><b>Rhythm</b>: regular RR? P waves present with sinus morphology? 1:1 P-QRS relationship?</li>
<li><b>Axis</b>: QRS direction in I and aVF (and II if needed)</li>
<li><b>Intervals</b>: PR (120–200 ms), QRS (< 120 ms), QT (QTc)</li>
<li><b>P wave</b>: width and height (right or left atrial abnormality)</li>
<li><b>QRS</b>: pathological Q waves, high or low voltage, R-wave progression, bundle branch block patterns</li>
<li><b>ST segment</b>: elevation or depression and its lead distribution (anatomical grouping, reciprocal change)</li>
<li><b>T and U waves</b>: inversion, peaked T, U waves</li>
<li><b>Summary</b>: list the findings and interpret them with the clinical context (age, symptoms, drugs, electrolytes)</li>
</ol>
<p>In practice mode, the explanation shows automatic measurements of rate, PR, QRS, QTc and axis. Comparing them with your own measurements reveals systematic errors.</p>`,
    },
    quiz: [
      {
        q: { ja: "I誘導で P、QRS、T がすべて下向き、aVR が上向きだった。まず疑うことはどれか。", en: "P, QRS and T are all negative in lead I and aVR is upright. What should you suspect first?" },
        options: [{ ja: "右胸心または上肢電極の左右逆", en: "Dextrocardia or reversed arm electrodes" }, { ja: "左脚ブロック", en: "Left bundle branch block" }, { ja: "下壁梗塞", en: "Inferior MI" }, { ja: "正常範囲", en: "Normal variant" }],
        answer: 0,
        why: { ja: "上肢電極の左右逆で多い所見。胸部誘導のR波の増高が正常なら付け間違い、V1〜V6 でR波が小さくなっていくなら右胸心を考える。", en: "Typical of reversed arm leads. Normal chest-lead R progression favors misplacement; progressively smaller R from V1 to V6 suggests dextrocardia." },
      },
      {
        q: { ja: "RR間隔が不規則な10秒の記録で、QRSが14個あった。心拍数はおよそいくつか。", en: "An irregular 10-second tracing has 14 QRS complexes. The rate is about:" },
        options: [{ ja: "70/分", en: "70/min" }, { ja: "84/分", en: "84/min" }, { ja: "100/分", en: "100/min" }, { ja: "140/分", en: "140/min" }],
        answer: 1,
        why: { ja: "10秒で14個なので、14×6 ＝ 84/分。", en: "14 in 10 s → 14 × 6 = 84/min." },
      },
    ],
  },
];

// 初心者向けの順番に並べ、各レッスンに「ここだけ」の要点とグループを付ける
const ALL = [...BASE, ...MORE];
export const LESSONS = ORDER.map(([id, group]) => ({ ...ALL.find((l) => l.id === id), group, point: POINTS[id] }));
export { GROUPS };
