// ==UserScript==
// @name         Win→Macパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.5
// @description  ドライブレターから始まるファイルサーバのパスを選択するとMac用に変換したパスを表示します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @match        http://au-project.mediba.local/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
.win-mac-path-area {
    display: block;
    margin: 1em 0;
    padding: 5px;
    border: 1px solid #66f;
    border-radius: 5px;
    background-color: #fff;
    color: #336;
    font-size: 14px;
    font-family: monospace;
    position: fixed;
    z-index: 10000;
    width: 600px;
    top: 40%;
    left: 50%;
    margin-left: -300px;    
}
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);
    $(document).on('mouseup', function() {
        var sel, range, contents, target, matches;

        $('.win-mac-path-area').remove();

        sel = window.getSelection();
        contents = sel.getRangeAt(0).cloneContents();
        if (!contents.hasChildNodes()) {
            return;
        }

        target = contents.firstChild.nodeValue || contents.firstChild.innerHTML;
        matches = target.match(/^[a-zA-Z]:((?:(?:\\[^\\]+)+)\\?)$/);
        if (!matches) {
            return;
        }

        $('body').append($('<p class="win-mac-path-area">' + 'smb://file03/fileshare' + matches[1].replace(/\\/g, '/') + '</p>'));

        var range = document.createRange();
        range.selectNodeContents($('.win-mac-path-area').get(0).firstChild);

        sel.removeAllRanges();
        sel.addRange(range);
    });
})();
