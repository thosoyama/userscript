// ==UserScript==
// @name         Win⇔Macファイルパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1.3
// @description  TalknoteかRedmine上でファイルサーバのパスを選択するとWin,Mac用に変換したパスを表示します
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
    line-height: 1;
}
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);
    $(document).on('mouseup', function() {
        var sel, range, contents, target, matches, win2mac = true;

        $('.win-mac-path-area').remove();

        sel = window.getSelection();
        contents = sel.getRangeAt(0).cloneContents();
        if (!contents.hasChildNodes()) {
            return;
        }

        target = contents.firstChild.nodeValue || contents.firstChild.innerHTML;
        matches = target.match(/^(?:[a-zA-Z]:|\\\\FILE03\\fileshare)((?:(?:\\[^\\]+)+)\\?)$/);
        if (!matches) {
            matches = target.match(/^smb:\/\/file03\/fileshare((?:(?:\/[^\/]+)+)\/?)$/);
            if (!matches) {
                return;
            }
            win2mac = false;
        }

        if (win2mac) {
            $('body').append($('<p class="win-mac-path-area">' + 'smb://file03/fileshare' + matches[1].replace(/\\/g, '/') + '</p>'));
        } else {
            $('body').append($('<p class="win-mac-path-area">' + 'W:' + matches[1].replace(/\//g, '\\') + '</p>'));
        }

        range = document.createRange();
        range.selectNodeContents($('.win-mac-path-area').get(0).firstChild);

        sel.removeAllRanges();
        sel.addRange(range);
    });
})();
