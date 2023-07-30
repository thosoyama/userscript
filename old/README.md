# userscript

## 概要

ブラウザ用のユーザースクリプトを作って貯めていくリポジトリです。

## ユーザースクリプトのインストール方法

1. 拡張のインストール
 * Google Chromeの場合は[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja)拡張をインストールしてください。
 * Firefoxの場合は[greasemoneky](https://addons.mozilla.org/ja/firefox/addon/greasemonkey/)アドオンをインストールしてください。
 * Safariの場合は[tampermonkey.net](https://tampermonkey.net)から拡張をダウンロードしてインストールしてください。
1. ユーザースクリプトのインストール
 * 下記よりスクリプト名をクリックするとインストール用の画面やダイアログが出るのでインストールしてください。

## ユーザースクリプト

* [ga_event_viewer.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/ga_event_viewer.user.js)
 * ローカル環境以外でもコンソールにcatchTrEventの引数が見えるようになるやつ。
 * 普段は無効にしておこう。

* [common_win_mac_path.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/common_win_mac_path.user.js)
 * ファイルサーバのパスを選択するとMac用に変換したパスを表示します。
