// ==UserScript==
// @name         Win→Macパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
// @description  ドライブレターから始まるファイルサーバのパスを選択するとMac用に変換したパスを表示します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        http://*/*
// @match        https://*/*
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
    border: 1px solid #c66;
    border-radius: 5px;
    background-color: #fee;
    color: #c66;
}
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);
    $(document).on('mouseup', function() {
        var sel, range, contents, target, matches;

        $('.win-mac-path-area').remove();

        sel = window.getSelection();
        if (sel.type !== 'Range') {
            return;
        }

        range = window.getSelection().getRangeAt(0);
        contents = range.cloneContents();
        if (!contents.hasChildNodes()) {
            return;
        }

        target = contents.firstChild.nodeValue || contents.firstChild.innerHTML;
        matches = target.match(/^[a-zA-Z]:((?:(?:\\[^\\]+)+)\\?)$/);
        if (!matches) {
            return;
        }
        $(range.startContainer.parentNode).append($('<p class="win-mac-path-area">' + 'smb://file03/fileshare' + matches[1].replace(/\\/g, '/') + '</p>'));

        var macRange = document.createRange();
        macRange.selectNodeContents($('.win-mac-path-area').get(0).firstChild);

        sel.removeAllRanges();
        sel.addRange(macRange);
    });
})();
