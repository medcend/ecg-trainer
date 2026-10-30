# 心電図トレーニング（ECG Trainer）

心電図検定の練習用 Web アプリ。基礎レッスン13本と、4級、3級の演習（12誘導185問、モニター88区間）が入っている。
スマホにもインストールでき（PWA）、一度開けばオフラインでも使える。

## フォルダ

| 場所 | 中身 |
| --- | --- |
| `docs/` | 公開するアプリ本体（GitHub Pages はここを配信する） |
| `docs/data/` | 心電図データ（PTB-XL、MIT-BIH から変換したもの） |
| `tools/` | データを作り直すスクリプト |
| `出題範囲とデータ対応表.md` | 出題範囲と公開データの対応の調査メモ |

## GitHub Pages で公開する（最初の1回）

1. GitHub Desktop で「File → Add Local Repository」からこのフォルダを選ぶ
2. 「Publish repository」を押す。名前は `ecg-trainer` などにし、「Keep this code private」のチェックを外す（無料プランの GitHub Pages は公開リポジトリが必要）
3. github.com でそのリポジトリを開き、「Settings → Pages」で、Source を「Deploy from a branch」、Branch を `main`、フォルダを `/docs` にして Save
4. 1〜2分で `https://<ユーザー名>.github.io/ecg-trainer/` が開けるようになる

更新したときは、GitHub Desktop で Commit して Push するだけでよい。
画面や JS を変えたときは、`docs/sw.js` の `VERSION` を上げると、インストール済みのアプリにも新しい版が届く。

## スマホにインストールする

- **iPhone（Safari）**：公開 URL を開き、共有ボタン →「ホーム画面に追加」
- **Android、Mac（Chrome）**：公開 URL を開き、アドレスバーのインストールボタン

最初に開いたときに心電図データ（約23 MB）を端末に保存する。画面の下に「オフラインでも使えます」と出たら完了。

## Mac とスマホで成績を共有する（Firebase の設定）

成績は「同期コード」ごとに Firebase の Firestore に保存する。Google アカウントがあれば無料枠で使える。

1. https://console.firebase.google.com/ で「プロジェクトを追加」（Google アナリティクスはオフでよい）
2. 左のメニュー「構築 → Authentication」→「始める」→「Sign-in method」で **匿名** を有効にする
3. 「構築 → Firestore Database」→「データベースを作成」。場所は `asia-northeast1`（東京）、本番環境モードで作成
4. Firestore の「ルール」タブを次の内容に置き換えて「公開」

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /sync/{code} {
         allow get: if request.auth != null && code.size() >= 20;
         allow create, update: if request.auth != null && code.size() >= 20
           && request.resource.data.keys().hasOnly(['devices']);
         allow list, delete: if false;
       }
     }
   }
   ```

5. 「プロジェクトの設定（歯車）→ 全般 → マイアプリ」で Web アプリ（`</>`）を追加し、表示される `firebaseConfig` の中身を `docs/js/firebase-config.js` に貼る

   ```js
   export const FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

6. 「Authentication → 設定 → 承認済みドメイン」に `<ユーザー名>.github.io` を追加
7. Commit して Push。アプリの「成績」画面で「同期コードを作る」を押し、「同期リンクをコピー」でスマホに送って開く

`firebaseConfig` の値はブラウザに配られる前提の公開情報で、データは上のルールで守られる。
同期コード（同期リンク）を知っている人は成績を読めるので、他人には送らないこと。

## Mac で動かして確かめる

```bash
python3 -m http.server 8765 --directory docs
```

http://localhost:8765 を開く。

## 症例の選び方

- 12誘導（`tools/build_ptbxl.py`）：PTB-XL のうち、人が確認済みでノイズの記載がなく、目的の所見のラベルがあり、GE 12SL の計測値が診断基準と合う記録だけを使う。計測値から明らかに当てはまる所見は、選択肢から外す
- モニター（`tools/build_monitor.py`）：MIT-BIH の医師の調律注釈の区間に20秒が丸ごと入り、拍の種類の並びが所見と合う区間を使う。MIT-BIH 悪性心室性のデータは注釈と見た目が合わない区間があったので、振幅と規則性で絞り、雑音の区間は目視で確認したものだけにした。心静止は実記録3区間と合成2区間

## データの作り直し

```bash
python3 -m venv venv && ./venv/bin/pip install wfdb numpy scipy
./venv/bin/python tools/build_ptbxl.py --meta ptbxl_database.csv --feat 12sl_features.csv --raw <DL先> --out docs/data
./venv/bin/python tools/build_monitor.py --raw <mitdb と vfdb を置いたフォルダ> --out docs/data
```

`ptbxl_database.csv` は PTB-XL 1.0.3、`12sl_features.csv` は PTB-XL+ 1.0.1 の `features/` から取得する。

## 出典

- PTB-XL 1.0.3、PTB-XL+ 1.0.1（CC BY 4.0）
- MIT-BIH Arrhythmia Database、MIT-BIH Malignant Ventricular Ectopy Database（ODC-By 1.0）
- いずれも PhysioNet（https://physionet.org）
