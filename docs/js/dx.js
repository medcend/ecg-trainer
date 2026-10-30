// 出題する所見の辞書。name は選択肢の表示名、key は選択肢の一行解説、criteria は正解時の判定基準。
// 判定基準の出典は SRC にまとめ、各項目の src で参照する。

export const SRC = {
  aha_conduction: {
    ja: "AHA/ACC/HRS 心電図の標準化と判読に関する勧告 Part III（心室内伝導障害、2009）",
    en: "AHA/ACC/HRS Recommendations for the Standardization and Interpretation of the ECG, Part III: Intraventricular Conduction Disturbances (2009)",
  },
  aha_lvh: {
    ja: "AHA/ACC/HRS 勧告 Part V（心室肥大、2009）",
    en: "AHA/ACC/HRS Recommendations, Part V: ECG Changes Associated With Cardiac Chamber Hypertrophy (2009)",
  },
  aha_qt: {
    ja: "AHA/ACC/HRS 勧告 Part IV（ST部分、T波、U波、QT間隔、2009）",
    en: "AHA/ACC/HRS Recommendations, Part IV: The ST Segment, T and U Waves, and the QT Interval (2009)",
  },
  aha_mi: {
    ja: "AHA/ACC/HRS 勧告 Part VI（急性虚血と梗塞、2009）、心筋梗塞の第4次普遍的定義（2018）",
    en: "AHA/ACC/HRS Recommendations, Part VI: Acute Ischemia/Infarction (2009); Fourth Universal Definition of MI (2018)",
  },
  general: {
    ja: "一般的な心電図判読の基準（各種教科書で共通する内容）",
    en: "Standard ECG interpretation criteria common to major textbooks",
  },
};

export const DX = {
  // ---- 12誘導 ----
  NORM: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "正常心電図", en: "Normal ECG" },
    key: { ja: "洞調律、各間隔と電気軸が正常で、ST-T変化や異常Q波がない", en: "Sinus rhythm with normal intervals and axis, no ST-T change or pathological Q waves" },
    criteria: {
      ja: "洞調律（I、II、aVF で陽性のP波が各QRSの前にある）、心拍数60〜100/分、PR 120〜200 ms、QRS幅120 ms未満、QTc 正常範囲、電気軸 −30°〜+90°。ST偏位、T波異常、異常Q波がない。",
      en: "Sinus rhythm (upright P in I, II, aVF preceding each QRS), rate 60–100/min, PR 120–200 ms, QRS < 120 ms, normal QTc, axis −30° to +90°, with no ST deviation, T-wave abnormality or pathological Q waves.",
    },
    confuse: ["SBRAD", "STACH", "1AVB", "LNGQT"],
  },
  STACH: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "洞頻脈", en: "Sinus tachycardia" },
    key: { ja: "洞調律で心拍数100/分超", en: "Sinus rhythm faster than 100/min" },
    criteria: {
      ja: "P波の形と向きは洞調律と同じ（I、II、aVF で陽性）で、各P波にQRSが続き、心拍数が100/分を超える。心拍数が速いとP波が前のT波に重なって見えにくくなるので、心房粗動や上室頻拍との区別に注意する。",
      en: "P waves have sinus morphology (upright in I, II, aVF), each followed by a QRS, at a rate above 100/min. At fast rates the P wave may merge with the preceding T wave, so distinguish it from atrial flutter or SVT.",
    },
    confuse: ["AFLT", "AFIB", "NORM"],
  },
  SBRAD: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "洞徐脈", en: "Sinus bradycardia" },
    key: { ja: "洞調律で心拍数60/分未満", en: "Sinus rhythm slower than 60/min" },
    criteria: {
      ja: "洞調律で心拍数が60/分未満（50/分未満を基準とする文献もある）。P波の形、PR間隔は正常で、すべてのP波にQRSが続く。",
      en: "Sinus rhythm below 60/min (some references use 50/min). P-wave morphology and PR interval are normal, and every P wave conducts.",
    },
    confuse: ["NORM", "1AVB", "3AVB"],
  },
  AFIB: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "心房細動", en: "Atrial fibrillation" },
    key: { ja: "P波がなく、RR間隔が不規則", en: "No P waves and irregularly irregular RR intervals" },
    criteria: {
      ja: "明らかなP波がなく、基線に不規則な細動波（f波、V1で見やすい）がある。RR間隔は絶対的に不整（規則性がまったくない）。",
      en: "No discernible P waves; irregular fibrillatory (f) waves on the baseline, best seen in V1; RR intervals are irregularly irregular.",
    },
    confuse: ["AFLT", "PAC", "STACH"],
  },
  AFLT: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "心房粗動", en: "Atrial flutter" },
    key: { ja: "鋸歯状の粗動波（F波）、心房レート約250〜350/分", en: "Sawtooth flutter (F) waves at an atrial rate of about 250–350/min" },
    criteria: {
      ja: "基線が平坦にならず、鋸歯状の粗動波（F波）が規則正しく続く。通常型では II、III、aVF で陰性の鋸歯状波が見やすい。心房レートは約250〜350/分で、房室伝導比（2:1、4:1など）によってRR間隔が決まる。伝導比が変わるとRR間隔も不規則になる。",
      en: "Continuous regular sawtooth flutter (F) waves without an isoelectric baseline, typically negative in II, III and aVF in typical flutter. Atrial rate is about 250–350/min; the ventricular rate depends on the conduction ratio (2:1, 4:1, …), and variable conduction makes RR intervals irregular.",
    },
    confuse: ["AFIB", "STACH", "PAC"],
  },
  PAC: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "心房期外収縮", en: "Premature atrial complex" },
    key: { ja: "早期に出る形の違うP′波と、幅の狭いQRS", en: "Early, differently shaped P′ wave followed by a narrow QRS" },
    criteria: {
      ja: "予定より早い時期に、洞調律のP波と形の違うP′波が出て、続くQRSは通常は洞調律と同じ幅の狭い形。後の休止は不完全代償性のことが多い。P′波が先行するT波に重なって見えにくいことがある。",
      en: "A premature P′ wave with a different morphology from the sinus P wave, usually followed by a narrow QRS identical to sinus beats. The following pause is usually non-compensatory. The P′ wave may be hidden in the preceding T wave.",
    },
    confuse: ["PVC", "AFIB", "AFLT"],
  },
  PVC: {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "心室期外収縮", en: "Premature ventricular complex" },
    key: { ja: "先行するP波のない、早期の幅広いQRS", en: "Early wide QRS without a preceding P wave" },
    criteria: {
      ja: "先行するP波がなく、予定より早く出る幅広い（多くは120 ms以上）異常な形のQRS。T波はQRSと逆向きのことが多い。後の休止は完全代償性のことが多い（期外収縮をはさむRR間隔が、通常のRR間隔のちょうど2倍）。",
      en: "A premature, wide (usually ≥ 120 ms) and bizarre QRS with no preceding P wave; the T wave is usually opposite in direction to the QRS. The pause is typically fully compensatory (the RR interval surrounding the PVC equals two normal RR intervals).",
    },
    confuse: ["PAC", "CRBBB", "CLBBB"],
  },
  "1AVB": {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "I度房室ブロック", en: "First-degree AV block" },
    key: { ja: "PR間隔200 ms超で、すべてのP波にQRSが続く", en: "PR > 200 ms with every P wave conducted" },
    criteria: {
      ja: "PR間隔が200 msを超えて一定に延長し、すべてのP波にQRSが続く（QRSの脱落はない）。",
      en: "A constant PR interval longer than 200 ms, with every P wave followed by a QRS (no dropped beats).",
    },
    confuse: ["3AVB", "NORM", "SBRAD"],
  },
  CRBBB: {
    kind: "12lead", level: 3, src: "aha_conduction",
    name: { ja: "完全右脚ブロック", en: "Complete right bundle branch block" },
    key: { ja: "QRS幅120 ms以上、V1でrsR′型、I と V6で幅広いS波", en: "QRS ≥ 120 ms, rsR′ in V1, wide S in I and V6" },
    criteria: {
      ja: "成人で QRS幅 120 ms以上。V1 または V2 で rsr′、rsR′、rSR′ 型（M字型）。I と V6 の S波が R波より長い、または40 ms を超える。V5、V6 の R波頂点時間は正常。",
      en: "QRS duration ≥ 120 ms in adults; rsr′, rsR′ or rSR′ in V1 or V2; S wave in I and V6 longer than the R wave or > 40 ms; normal R-peak time in V5 and V6.",
    },
    confuse: ["CLBBB", "WPW", "PVC"],
  },
  CLBBB: {
    kind: "12lead", level: 3, src: "aha_conduction",
    name: { ja: "完全左脚ブロック", en: "Complete left bundle branch block" },
    key: { ja: "QRS幅120 ms以上、I、V6で幅広いR波とq波の消失", en: "QRS ≥ 120 ms, broad notched R in I and V6 without q waves" },
    criteria: {
      ja: "成人で QRS幅 120 ms以上。I、aVL、V5、V6 で幅広く結節やスラーのあるR波。I、V5、V6 で q波がない。V5、V6 の R波頂点時間が60 msを超える。ST-T は通常 QRS の主な向きと逆になる。",
      en: "QRS duration ≥ 120 ms in adults; broad notched or slurred R in I, aVL, V5 and V6; absent q waves in I, V5 and V6; R-peak time > 60 ms in V5 and V6. ST-T is usually opposite to the main QRS deflection.",
    },
    confuse: ["CRBBB", "PACE", "LVH", "WPW"],
  },
  LAFB: {
    kind: "12lead", level: 3, src: "aha_conduction",
    name: { ja: "左脚前枝ブロック", en: "Left anterior fascicular block" },
    key: { ja: "電気軸 −45°〜−90°、aVLでqR型、QRS幅120 ms未満", en: "Axis −45° to −90°, qR in aVL, QRS < 120 ms" },
    criteria: {
      ja: "前額面の電気軸が −45°〜−90°。aVL で qR 型、aVL の R波頂点時間が45 ms以上。II、III、aVF で rS 型。QRS幅は120 ms未満。",
      en: "Frontal-plane axis between −45° and −90°; qR pattern in aVL with R-peak time ≥ 45 ms; rS in II, III and aVF; QRS duration < 120 ms.",
    },
    confuse: ["LPFB", "IMI", "CLBBB"],
  },
  LPFB: {
    kind: "12lead", level: 3, src: "aha_conduction",
    name: { ja: "左脚後枝ブロック", en: "Left posterior fascicular block" },
    key: { ja: "電気軸 +90°〜+180°、I と aVLでrS型、III と aVFでqR型", en: "Axis +90° to +180°, rS in I and aVL, qR in III and aVF" },
    criteria: {
      ja: "成人で前額面の電気軸が +90°〜+180°。I と aVL で rS 型、III と aVF で qR 型。QRS幅は120 ms未満。右室肥大や側壁梗塞など、右軸偏位を起こすほかの原因がないことが前提。",
      en: "Frontal-plane axis between +90° and +180° in adults; rS in I and aVL; qR in III and aVF; QRS < 120 ms. Other causes of right axis deviation, such as RVH or lateral MI, must be excluded.",
    },
    confuse: ["LAFB", "CRBBB", "ASMI"],
  },
  LVH: {
    kind: "12lead", level: 3, src: "aha_lvh",
    name: { ja: "左室肥大", en: "Left ventricular hypertrophy" },
    key: { ja: "SV1＋RV5（またはRV6）≧ 3.5 mV などの高電位", en: "High voltage such as SV1 + RV5/RV6 ≥ 3.5 mV" },
    criteria: {
      ja: "QRSの高電位が基本。代表的な基準は Sokolow-Lyon（SV1＋RV5 または RV6 ≧ 3.5 mV ＝ 35 mm）と Cornell（RaVL＋SV3 が男性で2.8 mV超、女性で2.0 mV超）。側壁誘導の ST低下と非対称な陰性T波（ストレイン型）を伴うことがある。電位だけでは偽陽性もあり、年齢、体格、性別の影響を受ける。",
      en: "Based mainly on increased QRS voltage: Sokolow-Lyon (SV1 + RV5 or RV6 ≥ 3.5 mV = 35 mm) or Cornell (RaVL + SV3 > 2.8 mV in men, > 2.0 mV in women). Lateral ST depression with asymmetric T inversion (strain) may accompany it. Voltage criteria are affected by age, body habitus and sex.",
    },
    confuse: ["CLBBB", "ASMI", "LNGQT"],
  },
  WPW: {
    kind: "12lead", level: 3, src: "general",
    name: { ja: "WPW症候群（心室早期興奮）", en: "WPW pattern (ventricular pre-excitation)" },
    key: { ja: "PR短縮（120 ms未満）とデルタ波", en: "Short PR (< 120 ms) with a delta wave" },
    criteria: {
      ja: "PR間隔が120 ms未満に短縮し、QRSの立ち上がりがなだらかなデルタ波になる。その分QRS幅が広がり（多くは110〜120 ms以上）、二次性のST-T変化を伴う。デルタ波の向きで副伝導路の位置を推定する。",
      en: "Short PR interval (< 120 ms) with a slurred QRS upstroke (delta wave), a correspondingly wide QRS (often ≥ 110–120 ms) and secondary ST-T changes. Delta-wave polarity helps localize the accessory pathway.",
    },
    confuse: ["CLBBB", "CRBBB", "IMI"],
  },
  PACE: {
    kind: "12lead", level: 3, src: "general",
    name: { ja: "ペースメーカ調律", en: "Paced rhythm" },
    key: { ja: "ペーシングスパイクの直後に捕捉波形が続く", en: "Pacing spikes followed by captured complexes" },
    criteria: {
      ja: "鋭く細いペーシングスパイクの直後に、捕捉されたP波（心房ペーシング）またはQRS（心室ペーシング）が続く。右室ペーシングでは左脚ブロック型の幅広いQRSになることが多い。双極ペーシングではスパイクが小さく見えにくいことがある。",
      en: "Narrow pacing spikes immediately followed by captured P waves (atrial pacing) or QRS complexes (ventricular pacing). Right ventricular pacing usually produces a wide LBBB-like QRS. Bipolar pacing spikes can be very small.",
    },
    confuse: ["CLBBB", "PVC", "3AVB"],
  },
  "3AVB": {
    kind: "12lead", level: 4, src: "general",
    name: { ja: "完全房室ブロック（III度）", en: "Complete (third-degree) AV block" },
    key: { ja: "P波とQRSが無関係に出る（房室解離）", en: "P waves and QRS complexes march independently (AV dissociation)" },
    criteria: {
      ja: "P波は一定の間隔で、QRSも別の一定の間隔で出て、両者の間に関係がない（PR間隔がばらばら）。心房レートが心室レートより速い。補充調律は、接合部起源なら幅の狭いQRS（40〜60/分）、心室起源なら幅の広いQRS（20〜40/分）。",
      en: "P waves and QRS complexes each occur at their own regular rate with no relationship between them (varying PR). The atrial rate exceeds the ventricular rate. The escape rhythm is narrow if junctional (40–60/min) or wide if ventricular (20–40/min).",
    },
    confuse: ["1AVB", "SBRAD", "PACE"],
  },
  LNGQT: {
    kind: "12lead", level: 3, src: "aha_qt",
    name: { ja: "QT延長", en: "Prolonged QT interval" },
    key: { ja: "QTc が男性450 ms以上、女性460 ms以上", en: "QTc ≥ 450 ms (men) or ≥ 460 ms (women)" },
    criteria: {
      ja: "心拍数で補正したQT（QTc）が、男性で450 ms以上、女性で460 ms以上を延長の目安とする。500 msを超えるとTorsade de pointesの危険が高い。原因として薬剤、低K血症、低Ca血症、先天性QT延長症候群などを考える。",
      en: "Heart-rate-corrected QT (QTc) ≥ 450 ms in men or ≥ 460 ms in women. Above 500 ms the risk of torsade de pointes is high. Consider drugs, hypokalemia, hypocalcemia and congenital long-QT syndrome.",
    },
    confuse: ["NORM", "LVH", "SBRAD"],
  },
  IMI: {
    kind: "12lead", level: 3, src: "aha_mi",
    name: { ja: "下壁梗塞", en: "Inferior myocardial infarction" },
    key: { ja: "II、III、aVFで異常Q波", en: "Pathological Q waves in II, III and aVF" },
    criteria: {
      ja: "下壁誘導（II、III、aVF）に異常Q波（幅40 ms以上、または深さがR波の1/4以上）がある。急性期は同じ誘導でST上昇し、対側の I、aVL で ST低下が見られる。責任血管は右冠動脈が多く、左回旋枝のこともある。III 単独のQ波は正常でも見られるので、連続する2誘導以上で判断する。",
      en: "Pathological Q waves (≥ 40 ms wide or ≥ 1/4 of the R wave) in the inferior leads II, III and aVF; in the acute phase ST elevation in these leads with reciprocal ST depression in I and aVL. The culprit is usually the RCA, sometimes the LCx. An isolated Q in III can be normal, so require two contiguous leads.",
    },
    confuse: ["ASMI", "LAFB", "WPW"],
  },
  ASMI: {
    kind: "12lead", level: 3, src: "aha_mi",
    name: { ja: "前壁中隔梗塞", en: "Anteroseptal myocardial infarction" },
    key: { ja: "V1〜V3（V4）で異常Q波またはQS型", en: "Q or QS waves in V1–V3 (V4)" },
    criteria: {
      ja: "V1〜V3（V4まで及ぶこともある）に異常Q波またはQS型があり、R波の増高が見られない。急性期は同じ誘導で ST上昇する。責任血管は左前下行枝。左脚ブロックや左室肥大でも V1〜V3 で QS型になることがあるので区別する。",
      en: "Pathological Q or QS complexes in V1–V3 (sometimes V4) with loss of R-wave progression; ST elevation in the same leads in the acute phase. The culprit is the LAD. LBBB and LVH can also produce QS in V1–V3.",
    },
    confuse: ["IMI", "CLBBB", "LVH"],
  },

  // ---- モニター ----
  M_NSR: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "正常洞調律", en: "Normal sinus rhythm" },
    key: { ja: "RR間隔が一定、各QRSの前にP波、60〜100/分", en: "Regular RR, a P wave before each QRS, 60–100/min" },
    criteria: {
      ja: "RR間隔がほぼ一定で、各QRSの前に同じ形のP波があり、心拍数は60〜100/分。",
      en: "Regular RR intervals, an identical P wave before every QRS, and a rate of 60–100/min.",
    },
    confuse: ["M_SBRAD", "M_PAC", "M_AFIB"],
  },
  M_SBRAD: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "洞徐脈", en: "Sinus bradycardia" },
    key: { ja: "洞調律で心拍数60/分未満", en: "Sinus rhythm slower than 60/min" },
    criteria: {
      ja: "各QRSの前に同じ形のP波があり、RR間隔はほぼ一定で、心拍数が60/分未満。",
      en: "A uniform P wave before each QRS, regular RR intervals and a rate below 60/min.",
    },
    confuse: ["M_NSR", "M_2TO1AVB", "M_ASYS"],
  },
  M_PAC: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心房期外収縮", en: "Premature atrial complexes" },
    key: { ja: "早期に出る幅の狭いQRS（前に形の違うP′波）", en: "Early narrow QRS preceded by an abnormal P′ wave" },
    criteria: {
      ja: "洞調律の中に、予定より早い幅の狭いQRSが散発する。その前に形の違うP′波があり、後の休止は不完全代償性のことが多い。",
      en: "Occasional early narrow QRS complexes within sinus rhythm, preceded by an abnormal P′ wave, usually with a non-compensatory pause.",
    },
    confuse: ["M_PVC", "M_AFIB", "M_NSR"],
  },
  M_PVC: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心室期外収縮（散発）", en: "Isolated premature ventricular complexes" },
    key: { ja: "早期に出る幅広いQRS、前にP波なし", en: "Early wide QRS with no preceding P wave" },
    criteria: {
      ja: "洞調律の中に、先行するP波のない早期の幅広いQRSが散発する（連続しない）。後の休止は完全代償性のことが多い。",
      en: "Occasional early wide QRS complexes without preceding P waves (not consecutive) within sinus rhythm, usually with a compensatory pause.",
    },
    confuse: ["M_PAC", "M_BIGEM", "M_VT"],
  },
  M_BIGEM: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心室期外収縮の二段脈", en: "Ventricular bigeminy" },
    key: { ja: "正常収縮と心室期外収縮が1拍ずつ交互", en: "Normal beats and PVCs alternate one to one" },
    criteria: {
      ja: "正常のQRSと心室期外収縮が1拍ずつ交互に続く。脈拍を触れると、期外収縮の拍出が弱く脈が半分に数えられることがある。",
      en: "Each normal beat is followed by a PVC. Peripheral pulse may be counted at half the monitor rate because PVCs eject poorly.",
    },
    confuse: ["M_TRIGEM", "M_PVC", "M_VT"],
  },
  M_TRIGEM: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心室期外収縮の三段脈", en: "Ventricular trigeminy" },
    key: { ja: "正常2拍ごとに心室期外収縮1拍", en: "One PVC after every two normal beats" },
    criteria: {
      ja: "正常のQRS 2拍に心室期外収縮1拍が続く繰り返し。",
      en: "A repeating pattern of two normal beats followed by one PVC.",
    },
    confuse: ["M_BIGEM", "M_PVC", "M_PAC"],
  },
  M_AFIB: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心房細動", en: "Atrial fibrillation" },
    key: { ja: "P波がなく、RR間隔が不規則", en: "No P waves, irregularly irregular RR" },
    criteria: {
      ja: "P波がなく基線が細かく揺れ（f波）、RR間隔に規則性がまったくない。",
      en: "No P waves, a fibrillating baseline (f waves) and completely irregular RR intervals.",
    },
    confuse: ["M_AFL", "M_PAC", "M_NOISE"],
  },
  M_AFL: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心房粗動", en: "Atrial flutter" },
    key: { ja: "鋸歯状の粗動波（F波）が規則正しく続く", en: "Regular sawtooth flutter waves" },
    criteria: {
      ja: "基線が鋸歯状の粗動波（F波、約250〜350/分）に置き換わる。房室伝導比が一定ならRR間隔は規則的、伝導比が変わると不規則になる。",
      en: "The baseline is replaced by regular sawtooth flutter waves (about 250–350/min). RR intervals are regular with fixed conduction and irregular with variable conduction.",
    },
    confuse: ["M_AFIB", "M_NSR", "M_PAC"],
  },
  M_PACED: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "ペースメーカ調律", en: "Paced rhythm" },
    key: { ja: "ペーシングスパイクの直後に幅広いQRS", en: "Pacing spikes followed by wide QRS complexes" },
    criteria: {
      ja: "ペーシングスパイクの直後に、心室を捕捉した幅広いQRSが続く。スパイクの後にQRSが出なければペーシング不全、自己の心拍を感知せずにスパイクが出ればセンシング不全を考える。",
      en: "Each pacing spike is followed by a wide captured QRS. A spike without a following QRS suggests failure to capture; spikes that ignore intrinsic beats suggest undersensing.",
    },
    confuse: ["M_VT", "M_PVC", "M_BIGEM"],
  },
  M_2TO1AVB: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "2:1 房室ブロック", en: "2:1 AV block" },
    key: { ja: "P波2つにQRSが1つだけ続く", en: "Only every second P wave is conducted" },
    criteria: {
      ja: "規則正しいP波のうち、2つに1つだけQRSが続く（II度房室ブロックの一型）。2:1 伝導が続く部分だけでは、Wenckebach型かMobitz II型かを区別できない。伝導比が変わる部分のPR間隔の変化を見て判断する。",
      en: "Regular P waves with only every second one conducted (a form of second-degree AV block). During fixed 2:1 conduction, Wenckebach and Mobitz II cannot be distinguished; look at PR behavior where the ratio changes.",
    },
    confuse: ["M_SBRAD", "M_PAC", "M_NSR"],
  },
  M_VT: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心室頻拍", en: "Ventricular tachycardia" },
    key: { ja: "幅広いQRSが100/分超で連続", en: "Consecutive wide QRS complexes faster than 100/min" },
    criteria: {
      ja: "幅広いQRSが100/分を超えて3拍以上連続する。30秒以上続くか血行動態が破綻するものを持続性とする。単形性ではQRSの形が一定。脈が触れない場合は心室細動と同じく除細動の対象。",
      en: "Three or more consecutive wide QRS complexes at more than 100/min; sustained if longer than 30 s or hemodynamically unstable. Monomorphic VT has uniform QRS shape. Pulseless VT is treated like VF with defibrillation.",
    },
    confuse: ["M_VF", "M_PACED", "M_AFL"],
  },
  M_VF: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心室細動", en: "Ventricular fibrillation" },
    key: { ja: "形も振幅も不規則な波、QRSを識別できない", en: "Chaotic waves of varying shape and amplitude, no identifiable QRS" },
    criteria: {
      ja: "形、振幅、間隔がまったく不規則な波が続き、QRSとT波を区別できない。心拍出はなく、ただちに除細動の対象。アーチファクトとの区別には、患者の意識と脈拍の確認が必要。",
      en: "Continuous chaotic waves of varying shape, amplitude and timing with no identifiable QRS or T wave. There is no cardiac output and immediate defibrillation is indicated. Check the patient to exclude artifact.",
    },
    confuse: ["M_VT", "M_NOISE", "M_ASYS"],
  },
  M_ASYS: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "心静止", en: "Asystole" },
    key: { ja: "電気活動がなくほぼ平坦", en: "Nearly flat line without electrical activity" },
    criteria: {
      ja: "QRSがなく、ほぼ平坦な波形が続く。電極外れや感度設定の低さでも平坦に見えるので、別の誘導や感度を変えて確認する。除細動の適応はなく、心肺蘇生と薬剤投与を行う。",
      en: "No QRS complexes and a nearly flat trace. Lead disconnection or low gain can mimic it, so confirm in another lead or at higher gain. Defibrillation is not indicated; perform CPR and give drugs.",
    },
    confuse: ["M_VF", "M_SBRAD", "M_NOISE"],
  },
  M_NOISE: {
    kind: "monitor", level: 4, src: "general",
    name: { ja: "アーチファクト（雑音）", en: "Artifact (noise)" },
    key: { ja: "体動や電極の問題による波形の乱れ", en: "Distortion from movement or electrode problems" },
    criteria: {
      ja: "体動、筋電図、電極の接触不良などで波形が乱れる。乱れの中に規則正しいQRSが追えることが多く、患者の意識や脈拍と合わない。心室細動や心室頻拍と誤認しやすいので、まず患者を確認する。",
      en: "Distortion caused by movement, muscle tremor or poor electrode contact. Regular QRS complexes can often still be traced through it, and the patient's condition does not match. It is easily mistaken for VF or VT, so check the patient first.",
    },
    confuse: ["M_VF", "M_AFIB", "M_VT"],
  },
};

// PTB-XL の所見コード（循環器医がつけたもの）の表示名
export const SCP = {
  NDT: ["非診断的T波異常", "non-diagnostic T abnormalities"],
  NST_: ["非特異的ST変化", "non-specific ST changes"],
  DIG: ["ジギタリス効果", "digitalis effect"],
  LNGQT: ["QT延長", "long QT interval"],
  NORM: ["正常心電図", "normal ECG"],
  IMI: ["下壁梗塞", "inferior MI"],
  ASMI: ["前壁中隔梗塞", "anteroseptal MI"],
  LVH: ["左室肥大", "left ventricular hypertrophy"],
  LAFB: ["左脚前枝ブロック", "left anterior fascicular block"],
  ISC_: ["非特異的な虚血性変化", "non-specific ischemic changes"],
  IRBBB: ["不完全右脚ブロック", "incomplete RBBB"],
  "1AVB": ["I度房室ブロック", "first degree AV block"],
  IVCD: ["非特異的心室内伝導障害", "non-specific intraventricular conduction disturbance"],
  ISCAL: ["前側壁誘導の虚血性変化", "ischemic in anterolateral leads"],
  CRBBB: ["完全右脚ブロック", "complete RBBB"],
  CLBBB: ["完全左脚ブロック", "complete LBBB"],
  ILMI: ["下側壁梗塞", "inferolateral MI"],
  "LAO/LAE": ["左房負荷", "left atrial overload/enlargement"],
  AMI: ["前壁梗塞", "anterior MI"],
  ALMI: ["前側壁梗塞", "anterolateral MI"],
  ISCIN: ["下壁誘導の虚血性変化", "ischemic in inferior leads"],
  INJAS: ["前壁中隔誘導の心内膜下障害", "subendocardial injury in anteroseptal leads"],
  LMI: ["側壁梗塞", "lateral MI"],
  ISCIL: ["下側壁誘導の虚血性変化", "ischemic in inferolateral leads"],
  LPFB: ["左脚後枝ブロック", "left posterior fascicular block"],
  ISCAS: ["前壁中隔誘導の虚血性変化", "ischemic in anteroseptal leads"],
  INJAL: ["前側壁誘導の心内膜下障害", "subendocardial injury in anterolateral leads"],
  ISCLA: ["側壁誘導の虚血性変化", "ischemic in lateral leads"],
  RVH: ["右室肥大", "right ventricular hypertrophy"],
  ANEUR: ["心室瘤に合うST-T変化", "ST-T changes compatible with ventricular aneurysm"],
  "RAO/RAE": ["右房負荷", "right atrial overload/enlargement"],
  EL: ["電解質異常または薬剤の影響", "electrolyte disturbance or drug effect"],
  WPW: ["WPW症候群", "Wolff-Parkinson-White syndrome"],
  ILBBB: ["不完全左脚ブロック", "incomplete LBBB"],
  IPLMI: ["下後側壁梗塞", "inferoposterolateral MI"],
  ISCAN: ["前壁誘導の虚血性変化", "ischemic in anterior leads"],
  IPMI: ["下後壁梗塞", "inferoposterior MI"],
  SEHYP: ["中隔肥大", "septal hypertrophy"],
  INJIN: ["下壁誘導の心内膜下障害", "subendocardial injury in inferior leads"],
  INJLA: ["側壁誘導の心内膜下障害", "subendocardial injury in lateral leads"],
  PMI: ["後壁梗塞", "posterior MI"],
  "3AVB": ["III度房室ブロック", "third degree AV block"],
  INJIL: ["下側壁誘導の心内膜下障害", "subendocardial injury in inferolateral leads"],
  "2AVB": ["II度房室ブロック", "second degree AV block"],
  ABQRS: ["QRSの形の異常", "abnormal QRS"],
  PVC: ["心室期外収縮", "ventricular premature complex"],
  STD_: ["非特異的ST低下", "non-specific ST depression"],
  VCLVH: ["左室肥大の電位基準を満たす", "voltage criteria for LVH"],
  QWAVE: ["Q波あり", "Q waves present"],
  LOWT: ["低振幅T波", "low amplitude T waves"],
  NT_: ["非特異的T波変化", "non-specific T-wave changes"],
  PAC: ["心房期外収縮", "atrial premature complex"],
  LPR: ["PR延長", "prolonged PR interval"],
  INVT: ["陰性T波", "inverted T waves"],
  LVOLT: ["低電位", "low QRS voltages"],
  HVOLT: ["高電位", "high QRS voltage"],
  TAB_: ["T波異常", "T-wave abnormality"],
  STE_: ["非特異的ST上昇", "non-specific ST elevation"],
  "PRC(S)": ["期外収縮", "premature complex(es)"],
  SR: ["洞調律", "sinus rhythm"],
  AFIB: ["心房細動", "atrial fibrillation"],
  STACH: ["洞頻脈", "sinus tachycardia"],
  SARRH: ["洞不整脈", "sinus arrhythmia"],
  SBRAD: ["洞徐脈", "sinus bradycardia"],
  PACE: ["ペースメーカ（正常作動）", "normal functioning pacemaker"],
  SVARR: ["上室性不整脈", "supraventricular arrhythmia"],
  BIGU: ["二段脈（起源不明）", "bigeminal pattern (unknown origin)"],
  AFLT: ["心房粗動", "atrial flutter"],
  SVTAC: ["上室頻拍", "supraventricular tachycardia"],
  PSVT: ["発作性上室頻拍", "paroxysmal SVT"],
  TRIGU: ["三段脈（起源不明）", "trigeminal pattern (unknown origin)"],
};

// MIT-BIH の拍の種類
export const BEAT = {
  N: ["正常拍", "normal"], A: ["心房期外収縮", "atrial premature"], V: ["心室期外収縮", "PVC"],
  "/": ["ペーシング拍", "paced"], L: ["左脚ブロック拍", "LBBB beat"], R: ["右脚ブロック拍", "RBBB beat"],
  F: ["融合収縮", "fusion"], J: ["接合部期外収縮", "junctional premature"], E: ["心室補充収縮", "ventricular escape"],
  j: ["接合部補充収縮", "junctional escape"], a: ["変行伝導を伴う心房期外収縮", "aberrated APC"],
  S: ["上室期外収縮", "supraventricular premature"], f: ["ペーシングとの融合", "fusion of paced and normal"],
  Q: ["分類不能", "unclassifiable"],
};
