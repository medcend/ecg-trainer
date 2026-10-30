// 基礎編の「よく出る所見」のレッスンと、各レッスンの「ここだけ」の要点、並び順

export const GROUPS = {
  basics: { ja: "しくみと読み方", en: "How the ECG works", color: "#8fb5e5" },
  findings: { ja: "よく出る所見", en: "Common findings", color: "#f4b9cb" },
  summary: { ja: "まとめ", en: "Putting it together", color: "#a9dcc5" },
};

export const ORDER = [
  ["conduction", "basics"], ["waves", "basics"], ["paper", "basics"], ["sinus", "basics"], ["leads", "basics"], ["axis", "basics"],
  ["ectopic", "findings"], ["tachy", "findings"], ["brady", "findings"], ["avblock", "findings"], ["bbb", "findings"], ["stemi", "findings"],
  ["steps", "summary"],
];

export const POINTS = {
  conduction: {
    ja: "心臓の電気は「洞結節 → 心房 → 房室結節 → ヒス束 → 右脚・左脚 → プルキンエ線維」の順に流れます。心電図の波は、この流れが心筋に広がる様子を写したものです。",
    en: "Electricity flows SA node → atria → AV node → His bundle → bundle branches → Purkinje fibers. ECG waves show this spread through the heart muscle.",
  },
  waves: {
    ja: "P波は心房、QRS波は心室が興奮したとき、T波は心室が元に戻るときの波。まず PR 0.12〜0.20秒、QRS 0.12秒未満 を覚えましょう。",
    en: "P = atria activate, QRS = ventricles activate, T = ventricles recover. Memorize PR 0.12–0.20 s and QRS < 0.12 s first.",
  },
  paper: {
    ja: "小さい目盛り1つ＝0.04秒、大きい目盛り1つ＝0.2秒。心拍数は「300 ÷ R波とR波の間の大きい目盛りの数」で出せます。",
    en: "Small box = 0.04 s, large box = 0.2 s. Heart rate = 300 ÷ number of large boxes between R waves.",
  },
  sinus: {
    ja: "洞調律の目印は「II誘導で上向きのP波が、すべてのQRSの前に、同じ間隔で並んでいる」こと。",
    en: "Sinus rhythm: an upright P wave in lead II before every QRS, at a regular interval.",
  },
  leads: {
    ja: "誘導は「心臓をどこから撮っているカメラか」。下壁は II・III・aVF、前壁は V1〜V4、側壁は I・aVL・V5・V6 から見ています。",
    en: "Each lead is a camera angle. Inferior: II, III, aVF. Anterior: V1–V4. Lateral: I, aVL, V5, V6.",
  },
  axis: {
    ja: "I と aVF の QRS がどちらも上向きなら正常。I が上向きで aVF が下向きなら左軸偏位を疑い、I が下向きなら右軸偏位。",
    en: "I and aVF both upright = normal. I up and aVF down = suspect left axis deviation. I down = right axis deviation.",
  },
  avblock: {
    ja: "P波とQRSの関係を見る。PRが長いだけならI度、ときどきQRSが抜けるならII度、PとQRSがばらばらならIII度（完全）。",
    en: "Look at P–QRS relationships: long PR only = 1st degree; some dropped QRS = 2nd degree; P and QRS unrelated = 3rd degree (complete).",
  },
  steps: {
    ja: "毎回同じ順番（心拍数 → 調律 → 電気軸 → 間隔 → 波形 → ST・T）で読むと、見落としが減ります。",
    en: "Read in the same order every time (rate → rhythm → axis → intervals → waveforms → ST and T) to avoid missing things.",
  },
  ectopic: {
    ja: "「予定より早く出る1拍」が期外収縮。QRSの幅が狭ければ心房から、広ければ心室から出ています。",
    en: "A premature beat comes earlier than expected. Narrow QRS = from the atria; wide QRS = from the ventricles.",
  },
  tachy: {
    ja: "100/分を超えたら頻脈。「QRSの幅」と「リズムが規則的か」の2つで4つに分けます。幅の広い頻拍は、まず心室頻拍と考えて対応します。",
    en: "Over 100/min is tachycardia. Sort by QRS width and regularity into four boxes. Treat a wide-complex tachycardia as VT until proven otherwise.",
  },
  brady: {
    ja: "60/分未満が徐脈。「P波はあるか」「P波とQRSは1対1か」の順に見ます。PとQRSの関係が崩れていれば房室ブロック。",
    en: "Under 60/min is bradycardia. Ask: are there P waves? Is every P followed by a QRS? If not, it is AV block.",
  },
  bbb: {
    ja: "QRS幅が0.12秒以上なら V1 を見る。QRSの最後が上向き（うさぎの耳）なら右脚ブロック、深く下向きなら左脚ブロック。",
    en: "If QRS ≥ 0.12 s, look at V1. Terminal upward (rabbit ears) = RBBB; deep and negative = LBBB.",
  },
  stemi: {
    ja: "冠動脈が詰まると、その場所を見ている誘導で ST が上がります。どの誘導で上がったかで、詰まった血管を推定できます。",
    en: "When a coronary artery is blocked, ST rises in the leads facing that area. Which leads tells you which artery.",
  },
};

export const MORE = [
  {
    id: "ectopic",
    title: { ja: "期外収縮（PAC と PVC）", en: "Premature beats (PAC and PVC)" },
    widget: "ectopic",
    body: {
      ja: `
<p>規則正しいリズムの中で、次の拍を待たずに<b>早く出てしまう1拍</b>を期外収縮と呼びます。どこから出たかで2つに分かれます。</p>
<table>
<tr><th></th><th>心房期外収縮（PAC）</th><th>心室期外収縮（PVC）</th></tr>
<tr><td>どこから</td><td>心房（洞結節以外の場所）</td><td>心室</td></tr>
<tr><td>P波</td><td>早く出る <b>P′波</b> がある。形がふだんのP波と違う。前のT波に重なって隠れることもある</td><td>QRSの前にP波が<b>ない</b></td></tr>
<tr><td>QRS</td><td><b>幅が狭い</b>（ふだんと同じ形）。正常の通り道で心室に伝わるから</td><td><b>幅が広く</b>（0.12秒以上）形も変わる。刺激伝導系を通らず、心筋をゆっくり伝わるから</td></tr>
<tr><td>後の休み</td><td>短め（不完全代償性）。洞結節のリズムがリセットされる</td><td>長め（完全代償性）。洞結節のリズムはそのまま続く</td></tr>
</table>
<p><b>完全代償性</b>とは、期外収縮をはさむ前後の正常な拍の間隔が、ふだんのRR間隔のちょうど2倍になることです。PVC は洞結節まで届かないので、洞結節は予定どおりP波を出しますが、そのP波は PVC に重なって心室に伝わりません。</p>
<p>出方には名前がついています。</p>
<ul>
<li><b>二段脈</b>：正常の拍と期外収縮が1拍ずつ交互</li>
<li><b>三段脈</b>：正常の拍2つごとに期外収縮1つ</li>
<li><b>2連発</b>：期外収縮が2つ続く。PVC が3つ以上、100/分を超えて続けば心室頻拍</li>
</ul>
<p class="memo">PVC は健康な人にもよく見られます。注意が必要なのは、連発する、形が何種類もある（多形性）、前の拍のT波の頂上付近に出る（R on T）、心臓の病気がある、などの場合です。</p>`,
      en: `
<p>A <b>premature beat</b> is one that arrives before the next expected beat in an otherwise regular rhythm. There are two main kinds.</p>
<table>
<tr><th></th><th>Premature atrial complex (PAC)</th><th>Premature ventricular complex (PVC)</th></tr>
<tr><td>Origin</td><td>Atria (outside the SA node)</td><td>Ventricles</td></tr>
<tr><td>P wave</td><td>An early <b>P′ wave</b> with a different shape; may hide in the preceding T wave</td><td><b>No</b> P wave before the QRS</td></tr>
<tr><td>QRS</td><td><b>Narrow</b> (normal shape), because it uses the normal pathway</td><td><b>Wide</b> (≥ 0.12 s) and bizarre, because it spreads slowly through muscle</td></tr>
<tr><td>Pause after</td><td>Shorter (non-compensatory): the sinus node is reset</td><td>Longer (compensatory): the sinus rhythm continues undisturbed</td></tr>
</table>
<p>A <b>compensatory pause</b> means the two normal beats around the premature beat are exactly two normal RR intervals apart. A PVC does not reach the SA node, so the next sinus P wave comes on time but is hidden by the PVC and not conducted.</p>
<ul>
<li><b>Bigeminy</b>: normal and premature beats alternate</li>
<li><b>Trigeminy</b>: one premature beat after every two normal beats</li>
<li><b>Couplet</b>: two in a row. Three or more PVCs at over 100/min = ventricular tachycardia</li>
</ul>
<p class="memo">PVCs are common in healthy people. Be careful when they come in runs, have several shapes (multiform), land near the peak of the previous T wave (R on T), or occur with heart disease.</p>`,
    },
    quiz: [
      {
        q: { ja: "早く出た拍のQRSが幅広く、前にP波がない。どれか。", en: "An early beat has a wide QRS and no preceding P wave. What is it?" },
        options: [{ ja: "心房期外収縮", en: "PAC" }, { ja: "心室期外収縮", en: "PVC" }, { ja: "洞不整脈", en: "Sinus arrhythmia" }, { ja: "I度房室ブロック", en: "First-degree AV block" }],
        answer: 1,
        why: { ja: "心室から出た拍は刺激伝導系を通らないので幅が広く、P波も先行しない。", en: "A ventricular beat bypasses the conduction system, so it is wide and has no preceding P wave." },
      },
      {
        q: { ja: "正常の拍と期外収縮が1拍ずつ交互に出る。何と呼ぶか。", en: "Normal beats and premature beats alternate one by one. This is called:" },
        options: [{ ja: "二段脈", en: "Bigeminy" }, { ja: "三段脈", en: "Trigeminy" }, { ja: "2連発", en: "Couplet" }, { ja: "心室頻拍", en: "VT" }],
        answer: 0,
        why: { ja: "交互なら二段脈、正常2拍ごとなら三段脈。", en: "Alternating = bigeminy; every third beat = trigeminy." },
      },
      {
        q: { ja: "心房期外収縮のQRSが、ふつう幅が狭い理由はどれか。", en: "Why is the QRS of a PAC usually narrow?" },
        options: [{ ja: "心房から正常の通り道（房室結節、ヒス束、脚）で心室に伝わるから", en: "It reaches the ventricles through the normal pathway (AV node, His bundle, bundle branches)" }, { ja: "心室から出ているから", en: "It starts in the ventricles" }, { ja: "P波がないから", en: "There is no P wave" }, { ja: "心拍数が遅いから", en: "The rate is slow" }],
        answer: 0,
        why: { ja: "出発点が心房でも、心室へは正常の通り道で伝わるので、QRSはふだんと同じ形になる。", en: "Although it starts in the atria, ventricular activation uses the normal pathway, so the QRS looks normal." },
      },
    ],
  },
  {
    id: "tachy",
    title: { ja: "頻脈の見分け方", en: "Sorting out tachycardias" },
    widget: "tachy",
    body: {
      ja: `
<p>心拍数が100/分を超える状態を<b>頻脈</b>と呼びます。種類は多いですが、最初に2つだけ見ると絞り込めます。</p>
<ol>
<li><b>QRSの幅</b>：狭い（0.12秒未満）か、広い（0.12秒以上）か</li>
<li><b>RR間隔</b>：規則的か、不規則か</li>
</ol>
<p>QRSが狭ければ、興奮は心房や房室結節から出て（上室性）、正常の通り道で心室に伝わっています。広ければ、心室から出ているか、上室性でも脚ブロックなどで心室内の伝わり方が遅れています。</p>
<p>下の表で4つの箱に分けてから、それぞれの特徴を確かめます。</p>
<table>
<tr><th>名前</th><th>見分けるポイント</th></tr>
<tr><td>洞頻脈</td><td>洞調律のP波が各QRSの前にある。発熱、脱水、貧血、痛み、緊張など体の反応で起こることが多い</td></tr>
<tr><td>発作性上室頻拍（PSVT）</td><td>突然始まり突然止まる、150〜250/分の規則正しい幅の狭い頻拍。P波は見えないか、QRSの直後に小さく見える</td></tr>
<tr><td>心房粗動</td><td>のこぎりの歯のような F波。2:1 で伝わると心拍数が150/分前後で一定になり、洞頻脈や PSVT と間違えやすい</td></tr>
<tr><td>心房細動</td><td>P波がなく、基線が細かく揺れ、RR間隔がばらばら</td></tr>
<tr><td>心室頻拍（VT）</td><td>幅の広いQRSが速く規則正しく続く。血圧が下がりやすく、心室細動に移ることがある</td></tr>
<tr><td>心室細動（VF）</td><td>形も大きさもばらばらの波だけで、QRSがわからない。心臓が震えているだけで血液を送れていない</td></tr>
</table>
<p class="memo">幅の広い頻拍で上室性か心室性か迷ったら、危険なほうの心室頻拍として対応します。脈が触れない心室頻拍と心室細動は、すぐに除細動の対象です。</p>`,
      en: `
<p><b>Tachycardia</b> means a heart rate above 100/min. There are many kinds, but two questions narrow them down:</p>
<ol>
<li><b>QRS width</b>: narrow (< 0.12 s) or wide (≥ 0.12 s)?</li>
<li><b>RR intervals</b>: regular or irregular?</li>
</ol>
<p>A narrow QRS means the impulse starts above the ventricles (supraventricular) and uses the normal pathway. A wide QRS means it starts in the ventricles, or is supraventricular with slowed conduction such as bundle branch block.</p>
<table>
<tr><th>Rhythm</th><th>Clues</th></tr>
<tr><td>Sinus tachycardia</td><td>Sinus P waves before each QRS; usually a response to fever, dehydration, anemia, pain or anxiety</td></tr>
<tr><td>Paroxysmal SVT</td><td>Sudden onset and offset; regular narrow tachycardia at 150–250/min; P waves hidden or just after the QRS</td></tr>
<tr><td>Atrial flutter</td><td>Sawtooth F waves. With 2:1 conduction the rate sits near 150/min and is easily mistaken for sinus tachycardia or SVT</td></tr>
<tr><td>Atrial fibrillation</td><td>No P waves, wavy baseline, irregular RR</td></tr>
<tr><td>Ventricular tachycardia</td><td>Fast, regular, wide QRS complexes; blood pressure may fall and it can degenerate into VF</td></tr>
<tr><td>Ventricular fibrillation</td><td>Chaotic waves with no identifiable QRS; the heart only quivers and pumps no blood</td></tr>
</table>
<p class="memo">If you cannot tell whether a wide-complex tachycardia is supraventricular or ventricular, treat it as VT, the more dangerous option. Pulseless VT and VF need immediate defibrillation.</p>`,
    },
    quiz: [
      {
        q: { ja: "幅の狭いQRSが不規則に速く続き、P波がない。どれか。", en: "Narrow QRS, fast and irregular, with no P waves. What is it?" },
        options: [{ ja: "心房細動", en: "Atrial fibrillation" }, { ja: "洞頻脈", en: "Sinus tachycardia" }, { ja: "心室頻拍", en: "VT" }, { ja: "発作性上室頻拍", en: "Paroxysmal SVT" }],
        answer: 0,
        why: { ja: "狭いQRS＋不規則＋P波なし は心房細動の典型。", en: "Narrow, irregular, no P waves is classic AF." },
      },
      {
        q: { ja: "心拍数がちょうど150/分前後で一定の、幅の狭い頻拍。必ず考えるべきものはどれか。", en: "A regular narrow tachycardia at about 150/min. What must you always consider?" },
        options: [{ ja: "2:1 伝導の心房粗動", en: "Atrial flutter with 2:1 conduction" }, { ja: "心室細動", en: "VF" }, { ja: "完全房室ブロック", en: "Complete AV block" }, { ja: "洞徐脈", en: "Sinus bradycardia" }],
        answer: 0,
        why: { ja: "粗動波は約300/分なので、2:1 で伝わると心拍数は約150/分になる。F波が QRS や T波に隠れていないか探す。", en: "Flutter waves run at about 300/min, so 2:1 conduction gives about 150/min. Look for F waves hidden in the QRS or T." },
      },
      {
        q: { ja: "幅の広い頻拍で、上室性か心室性か判断できない。どう対応するか。", en: "A wide-complex tachycardia of uncertain origin. How should you treat it?" },
        options: [{ ja: "心室頻拍として対応する", en: "As VT" }, { ja: "洞頻脈として様子を見る", en: "As sinus tachycardia and observe" }, { ja: "心房細動として対応する", en: "As AF" }, { ja: "正常として扱う", en: "As normal" }],
        answer: 0,
        why: { ja: "見誤ったときに危険が大きいのは心室頻拍なので、そちらとして対応する。", en: "Misjudging VT is the more dangerous error, so treat it as VT." },
      },
    ],
  },
  {
    id: "brady",
    title: { ja: "徐脈の見分け方", en: "Sorting out bradycardias" },
    widget: "brady",
    body: {
      ja: `
<p>心拍数が60/分未満の状態を<b>徐脈</b>と呼びます。原因は大きく2つです。</p>
<ul>
<li><b>洞結節が電気を作れない</b>：洞徐脈、洞停止、洞房ブロック</li>
<li><b>作った電気が心室に届かない</b>：房室ブロック</li>
</ul>
<p>下の流れ図の順に、P波とQRSを見ていくと見分けられます。</p>
<table>
<tr><th>名前</th><th>見分けるポイント</th></tr>
<tr><td>洞徐脈</td><td>洞調律のまま、規則正しく遅い。睡眠中や運動選手では正常でも見られる</td></tr>
<tr><td>洞停止</td><td>P波が突然出なくなり、長い休止になる。休止の長さはふだんの PP間隔の倍数にならない</td></tr>
<tr><td>洞房ブロック</td><td>洞結節は電気を作っているが心房に伝わらず、P波が抜ける。休止の長さが PP間隔のちょうど2倍、3倍になる</td></tr>
<tr><td>房室ブロック</td><td>P波は出ているのに、QRSが続かないP波がある（次のレッスンで詳しく）</td></tr>
<tr><td>補充調律</td><td>上の部位が止まったときに下の部位が代わりに出す拍。接合部なら幅の狭いQRSで40〜60/分、心室なら幅の広いQRSで20〜40/分</td></tr>
</table>
<p>洞結節の働きが落ちて起こる徐脈をまとめて<b>洞不全症候群</b>と呼び、Rubenstein 分類で3つに分けます。I型は持続する洞徐脈、II型は洞停止や洞房ブロック、III型は徐脈と頻脈（心房細動など）を繰り返す徐脈頻脈症候群です。</p>
<p class="memo">めまいや失神などの症状を伴う徐脈は、ペースメーカの適応を考えます。</p>`,
      en: `
<p><b>Bradycardia</b> means a heart rate below 60/min. There are two main causes:</p>
<ul>
<li><b>The SA node fails to fire</b>: sinus bradycardia, sinus arrest, SA block</li>
<li><b>The impulse fails to reach the ventricles</b>: AV block</li>
</ul>
<p>Follow the flowchart below, checking the P waves and QRS complexes in order.</p>
<table>
<tr><th>Rhythm</th><th>Clues</th></tr>
<tr><td>Sinus bradycardia</td><td>Sinus rhythm, regular but slow; normal during sleep or in athletes</td></tr>
<tr><td>Sinus arrest</td><td>P waves suddenly stop, causing a long pause that is not a multiple of the PP interval</td></tr>
<tr><td>SA block</td><td>The SA node fires but the impulse does not exit, so a P wave is missing; the pause is exactly 2× or 3× the PP interval</td></tr>
<tr><td>AV block</td><td>P waves are present but some are not followed by a QRS (see the next lesson)</td></tr>
<tr><td>Escape rhythms</td><td>Backup beats from lower sites: junctional (narrow QRS, 40–60/min) or ventricular (wide QRS, 20–40/min)</td></tr>
</table>
<p>Bradycardia from a failing SA node is called <b>sick sinus syndrome</b>, classified by Rubenstein into type I (persistent sinus bradycardia), type II (sinus arrest or SA block) and type III (brady-tachy syndrome alternating with tachyarrhythmias such as AF).</p>
<p class="memo">Bradycardia with symptoms such as dizziness or fainting is a reason to consider a pacemaker.</p>`,
    },
    quiz: [
      {
        q: { ja: "P波が1つだけ抜け、休止の長さがふだんの PP間隔のちょうど2倍だった。どれか。", en: "One P wave is missing and the pause is exactly twice the PP interval. What is it?" },
        options: [{ ja: "洞房ブロック", en: "SA block" }, { ja: "洞停止", en: "Sinus arrest" }, { ja: "心房細動", en: "AF" }, { ja: "心室期外収縮", en: "PVC" }],
        answer: 0,
        why: { ja: "洞結節のリズムは保たれていて、1回分だけ心房に伝わらなかったので、休止がちょうど2倍になる。", en: "The sinus rhythm continues; one impulse failed to exit, so the pause is exactly double." },
      },
      {
        q: { ja: "P波がなく、幅の広いQRSが30/分で規則正しく出ている。どれか。", en: "No P waves; regular wide QRS at 30/min. What is it?" },
        options: [{ ja: "心室補充調律", en: "Ventricular escape rhythm" }, { ja: "接合部補充調律", en: "Junctional escape rhythm" }, { ja: "洞徐脈", en: "Sinus bradycardia" }, { ja: "心房粗動", en: "Atrial flutter" }],
        answer: 0,
        why: { ja: "幅の広いQRSで20〜40/分は心室からの補充調律。接合部なら幅が狭く40〜60/分。", en: "Wide QRS at 20–40/min is a ventricular escape rhythm; junctional escape is narrow at 40–60/min." },
      },
      {
        q: { ja: "洞不全症候群の Rubenstein 分類で、徐脈と頻脈を繰り返すものはどれか。", en: "In Rubenstein's classification of sick sinus syndrome, alternating bradycardia and tachycardia is:" },
        options: [{ ja: "I型", en: "Type I" }, { ja: "II型", en: "Type II" }, { ja: "III型", en: "Type III" }, { ja: "どれにも入らない", en: "None" }],
        answer: 2,
        why: { ja: "III型は徐脈頻脈症候群。I型は持続する洞徐脈、II型は洞停止や洞房ブロック。", en: "Type III is brady-tachy syndrome; type I is persistent sinus bradycardia; type II is sinus arrest or SA block." },
      },
    ],
  },
  {
    id: "bbb",
    title: { ja: "脚ブロック", en: "Bundle branch block" },
    widget: "bbb",
    body: {
      ja: `
<p>ヒス束から分かれた<b>右脚</b>と<b>左脚</b>のどちらかが途切れると、その側の心室には電気が直接届かず、反対側から心筋をゆっくり伝わって遅れて興奮します。そのため QRS の幅が広がります（0.12秒以上で完全、0.11〜0.12秒で不完全）。</p>
<p>見分けるには V1 と V6 を見ます。遅れて興奮する心室の向きが、QRS の最後の波になって現れます。</p>
<table>
<tr><th></th><th>右脚ブロック（RBBB）</th><th>左脚ブロック（LBBB）</th></tr>
<tr><td>V1</td><td>rSR′ 型。上向きの山が2つ並ぶ「うさぎの耳」（M字）。右室が最後に興奮するので、右前を向く V1 で最後が上向きになる</td><td>深く幅の広い下向きの波（QS 型や rS 型）。左室が最後に興奮して V1 から遠ざかるため</td></tr>
<tr><td>V6、I</td><td>幅の広いS波</td><td>幅が広く、てっぺんに切れ込みのあるR波。ふだん見られる小さなq波がない</td></tr>
<tr><td>ST・T</td><td>V1〜V3 で陰性T波になりやすい</td><td>QRSと逆向きのST・T変化がほぼ必ず出る</td></tr>
</table>
<p>覚え方：<b>V1 の QRS の最後が上向きなら右脚、下向きなら左脚</b>。</p>
<p class="memo">右脚ブロックは健康な人にも見られることがあります。左脚ブロックは高血圧、虚血性心疾患、心筋症などの心臓の病気に伴うことが多く、ST・T の変化があるため心筋梗塞の診断が難しくなります。</p>`,
      en: `
<p>If the <b>right</b> or <b>left bundle branch</b> is blocked, that ventricle is activated late, slowly through muscle from the other side, so the QRS widens (≥ 0.12 s complete; 0.11–0.12 s incomplete).</p>
<p>Look at V1 and V6. The late-activated ventricle shows up as the last part of the QRS.</p>
<table>
<tr><th></th><th>RBBB</th><th>LBBB</th></tr>
<tr><td>V1</td><td>rSR′: two upward peaks, “rabbit ears” (M shape). The right ventricle activates last, toward V1</td><td>Deep, wide negative complex (QS or rS), because the left ventricle activates last, away from V1</td></tr>
<tr><td>V6, I</td><td>Wide S wave</td><td>Broad R wave with a notched top; the normal small q wave is absent</td></tr>
<tr><td>ST–T</td><td>Often T inversion in V1–V3</td><td>ST–T almost always opposite to the QRS</td></tr>
</table>
<p>Memory aid: <b>the end of the QRS in V1 points up in RBBB and down in LBBB</b>.</p>
<p class="memo">RBBB can occur in healthy people. LBBB usually accompanies heart disease (hypertension, ischemic heart disease, cardiomyopathy) and its ST–T changes make diagnosing MI difficult.</p>`,
    },
    quiz: [
      {
        q: { ja: "QRS幅 0.14秒、V1 で rSR′ 型、V6 で幅広いS波。どれか。", en: "QRS 0.14 s, rSR′ in V1, wide S in V6. What is it?" },
        options: [{ ja: "完全右脚ブロック", en: "Complete RBBB" }, { ja: "完全左脚ブロック", en: "Complete LBBB" }, { ja: "WPW症候群", en: "WPW" }, { ja: "正常", en: "Normal" }],
        answer: 0,
        why: { ja: "V1 の最後が上向き（R′）で、V6 に幅広いS波があるのは右脚ブロック。", en: "Terminal R′ in V1 with a wide S in V6 is RBBB." },
      },
      {
        q: { ja: "左脚ブロックの特徴はどれか。", en: "Which is a feature of LBBB?" },
        options: [{ ja: "V6 で幅広いR波があり、q波がない", en: "Broad R in V6 without a q wave" }, { ja: "V1 で rSR′ 型", en: "rSR′ in V1" }, { ja: "PR が短い", en: "Short PR" }, { ja: "QRS幅が0.08秒", en: "QRS 0.08 s" }],
        answer: 0,
        why: { ja: "左脚ブロックでは中隔の興奮の向きが逆になり、V6 の小さなq波が消える。", en: "In LBBB the septum depolarizes in the opposite direction, so the small q in V6 disappears." },
      },
      {
        q: { ja: "脚ブロックで QRS 幅が広がる理由はどれか。", en: "Why is the QRS wide in bundle branch block?" },
        options: [{ ja: "片方の心室が心筋を伝わってゆっくり遅れて興奮するから", en: "One ventricle is activated late and slowly through muscle" }, { ja: "心房の興奮が遅れるから", en: "Atrial activation is delayed" }, { ja: "房室結節の伝導が遅いから", en: "AV nodal conduction is slow" }, { ja: "心拍数が速いから", en: "The heart rate is fast" }],
        answer: 0,
        why: { ja: "速い刺激伝導系を使えない側は、心筋を細胞から細胞へゆっくり伝わるので時間がかかる。", en: "Without the fast conduction system, activation spreads cell to cell through muscle, which takes longer." },
      },
    ],
  },
  {
    id: "stemi",
    title: { ja: "心筋梗塞（STEMI）", en: "Myocardial infarction (STEMI)" },
    widget: "stemi",
    body: {
      ja: `
<p>心臓に血液を送る<b>冠動脈</b>が血栓で詰まると、その先の心筋に血液が届かなくなります。心筋の壁の外側まで傷つくと、その場所を見ている誘導で <b>ST が上がり</b>ます。これを ST上昇型心筋梗塞（<b>STEMI</b>）と呼びます。反対側から見ている誘導では、同じ変化が逆向きに見えて ST が下がります（<b>鏡像変化</b>）。</p>
<p><b>STEMI と考える目安</b>（心筋梗塞の第4次普遍的定義）：隣り合う2つ以上の誘導で、J点（QRSの終わり）の ST が新しく上がっている。</p>
<ul>
<li>V2、V3 以外の誘導：1 mm（0.1 mV）以上</li>
<li>V2、V3：40歳以上の男性で 2 mm 以上、40歳未満の男性で 2.5 mm 以上、女性で 1.5 mm 以上</li>
</ul>
<p>（左脚ブロックや左室肥大がない場合の基準です）</p>
<p><b>時間とともに形が変わります</b>。下の図のボタンで順番に見てください。T波が高く尖る → ST が上がる → 異常Q波が出る → T波が陰性になる → ST が戻り異常Q波が残る、と進みます。</p>
<table>
<tr><th>部位</th><th>ST が上がる誘導</th><th>詰まった血管（目安）</th></tr>
<tr><td>前壁中隔</td><td>V1〜V4</td><td>左前下行枝（LAD）</td></tr>
<tr><td>広範前壁</td><td>V1〜V6、I、aVL</td><td>左前下行枝の根元に近い部分</td></tr>
<tr><td>側壁</td><td>I、aVL、V5、V6</td><td>左回旋枝（LCx）または対角枝</td></tr>
<tr><td>下壁</td><td>II、III、aVF（I、aVL で鏡像の ST低下）</td><td>右冠動脈（RCA）が多い</td></tr>
<tr><td>後壁</td><td>通常の12誘導では上がらない。V1〜V3 で ST低下と高いR波</td><td>左回旋枝または右冠動脈</td></tr>
</table>
<p>下壁梗塞のときは、右胸部に貼る V4R で ST が上がっていないか（右室梗塞の合併）も確かめます。</p>
<p class="memo">ST が上がるのは心筋梗塞だけではありません。早期再分極、急性心膜炎（広い範囲の ST上昇と PR部分の低下）、左室肥大、左脚ブロックでも ST が上がって見えます。胸痛のある人では、心電図を時間をおいて繰り返しとって変化を見ます。</p>`,
      en: `
<p>When a <b>coronary artery</b> is blocked by a clot, the muscle beyond it loses its blood supply. When injury extends through the wall, <b>ST elevation</b> appears in the leads facing that area: ST-elevation myocardial infarction (<b>STEMI</b>). Leads looking from the opposite side see the mirror image, ST depression (<b>reciprocal change</b>).</p>
<p><b>STEMI criteria</b> (Fourth Universal Definition of MI): new ST elevation at the J point in two contiguous leads of</p>
<ul>
<li>≥ 1 mm (0.1 mV) in leads other than V2–V3</li>
<li>In V2–V3: ≥ 2 mm in men ≥ 40 years, ≥ 2.5 mm in men < 40 years, ≥ 1.5 mm in women</li>
</ul>
<p>(in the absence of LBBB or LVH)</p>
<p><b>The pattern changes over time</b>: peaked T waves → ST elevation → Q waves → T inversion → ST returns while Q waves persist. Step through it with the buttons below.</p>
<table>
<tr><th>Area</th><th>Leads with ST elevation</th><th>Likely artery</th></tr>
<tr><td>Anteroseptal</td><td>V1–V4</td><td>LAD</td></tr>
<tr><td>Extensive anterior</td><td>V1–V6, I, aVL</td><td>Proximal LAD</td></tr>
<tr><td>Lateral</td><td>I, aVL, V5, V6</td><td>LCx or diagonal</td></tr>
<tr><td>Inferior</td><td>II, III, aVF (reciprocal depression in I, aVL)</td><td>Usually RCA</td></tr>
<tr><td>Posterior</td><td>None on the standard 12 leads; ST depression with tall R in V1–V3</td><td>LCx or RCA</td></tr>
</table>
<p>In inferior MI, check right-sided lead V4R for ST elevation (right ventricular involvement).</p>
<p class="memo">ST elevation is not unique to MI: early repolarization, acute pericarditis (widespread ST elevation with PR depression), LVH and LBBB can all elevate the ST. In a patient with chest pain, repeat the ECG over time and look for change.</p>`,
    },
    quiz: [
      {
        q: { ja: "II、III、aVF で ST が上がり、I、aVL で ST が下がっている。最も考えられる詰まった血管はどれか。", en: "ST elevation in II, III, aVF with ST depression in I and aVL. The most likely culprit artery is:" },
        options: [{ ja: "右冠動脈", en: "RCA" }, { ja: "左前下行枝", en: "LAD" }, { ja: "左主幹部", en: "Left main" }, { ja: "肺動脈", en: "Pulmonary artery" }],
        answer: 0,
        why: { ja: "下壁梗塞。I、aVL の ST低下は鏡像変化で、責任血管は右冠動脈が多い。", en: "Inferior MI with reciprocal change in I and aVL; usually the RCA." },
      },
      {
        q: { ja: "急性心筋梗塞で最も早く出る心電図変化はどれか。", en: "The earliest ECG change in acute MI is:" },
        options: [{ ja: "T波が高く尖る（超急性期T波）", en: "Tall peaked (hyperacute) T waves" }, { ja: "異常Q波", en: "Pathological Q waves" }, { ja: "陰性T波", en: "T-wave inversion" }, { ja: "PR延長", en: "PR prolongation" }],
        answer: 0,
        why: { ja: "発症直後は T波が高く幅広くなり、次に ST が上がる。異常Q波や陰性T波は時間がたってから出る。", en: "Hyperacute T waves come first, then ST elevation; Q waves and T inversion appear later." },
      },
      {
        q: { ja: "V1〜V3 で ST低下と高いR波がある。考えるべき梗塞はどれか。", en: "ST depression with tall R waves in V1–V3. Which infarct should you consider?" },
        options: [{ ja: "後壁梗塞", en: "Posterior MI" }, { ja: "前壁中隔梗塞", en: "Anteroseptal MI" }, { ja: "下壁梗塞", en: "Inferior MI" }, { ja: "側壁梗塞", en: "Lateral MI" }],
        answer: 0,
        why: { ja: "後壁の変化を前から見ているので、ST上昇が ST低下に、Q波が高いR波に、上下逆に見える。背中側の V7〜V9 で確かめる。", en: "V1–V3 view the posterior wall from the front, so ST elevation and Q waves appear inverted as ST depression and tall R. Confirm with V7–V9." },
      },
    ],
  },
];
