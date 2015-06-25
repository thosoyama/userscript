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



* [casperjs.utils.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/casperjs.utils.user.js)
 * 有効にしておくと、ブラウザのコンソールからcasperjsの__utils__のメソッドによる確認ができるようになります。
 * 例： `__utils__.exists('.recommend__box div'); // true or falseが返ってくる`


* [redmine_documents_tree.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/redmine_documents_tree.user.js)
 * Redmineの文書ページのリンクを階層構造を持たせて表示します。

* [redmine_news.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/redmine_news.user.js)
 * Redmineのニュースでチケットのプレビュー表示します。

* [redmine_backlog_story_point.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/redmine_backlog_story_point.user.js)
 * Redmineのバックログに制作ポイント、開発ポイント、その他ポイント、完了ポイントを追加。by 小室氏のブックマークレット。

* [common_win_mac_path.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/common_win_mac_path.user.js)
 * ファイルサーバのパスを選択するとMac用に変換したパスを表示します。

* [github_diff_folding.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/github_diff_folding.user.js)
 * GitHubの差分比較の領域を折り畳むトグルボタンと個別にON/OFF可能なチェックボックスを追加します。

* talknote_liquid_layout.user.js
 * Talknoteを横幅固定からリキッドレイアウトにします。
 * いらなくなるみたい！ https://talknote.zendesk.com/hc/ja/articles/204754175

* [github_liquid_layout.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/github_liquid_layout.user.js)
 * GitHubを横幅固定からリキッドレイアウトにします。HTMLのレビュー時等で多少は視野が広くなると思います。

* [thashtag.user.js](https://github.com/hosoyama-mediba/userscript/raw/master/thashtag.user.js)
 * Talknoteの左メニューによく使う検索ワードのリンクを追加します。自分で追加できます。

