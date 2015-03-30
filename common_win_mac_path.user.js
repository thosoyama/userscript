// ==UserScript==
// @name         Win⇔Macファイルパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.9
// @description  TalknoteかRedmine上でファイルサーバのパスを選択するとWin,Mac用に変換したパスを表示します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @match        http://au-project.mediba.local/*
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
        .win-mac-path-area {
            display: block;
            margin: 0;
            padding: 0;
            border: 1px solid #169;
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
            box-shadow: 10px 10px 10px rgba(0,0,0,0.4);
        }
        .win-mac-path-area a {
            display: block;
            margin: 0;
            padding: 10px;
            color: #169;
            text-decoration: none;
        }
        .win-mac-path-area a:hover {
            color: #c44;
        }
        .win-mac-path-area a:focus {
            outline: 3px solid #49c;
            outline-radius: 5px;
            outline-offset: -1px;
        }
        .win-mac-path-area hr {
            display: block;
            margin: 0;
            border: 1px solid #169;
            border-width:1px 0 0 0;
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);
    $(document).on('mouseup', function(e) {
        var sel, range, target, matches, win2mac = true, $target = $(e.target), url;

        if ($target.hasClass('win-mac-path-area') || $target.parent().hasClass('win-mac-path-area')) {
            return;
        }

        $('.win-mac-path-area').remove();

        sel = window.getSelection();
        if (!sel) {
            return;
        }
        target = sel.toString();
        if (!target) {
            return;
        }
        target = target.replace(/\r?\n.*/gm, '');
        matches = target.match(/^(?:[a-zA-Z]:|\\\\FILE03\\fileshare)((?:(?:\\[^\\]+)+)\\?)$/i);
        if (!matches) {
            matches = target.match(/^smb:\/\/file03\/fileshare((?:(?:\/[^\/]+)+)\/?)$/i);
            if (!matches) {
                return;
            }
            win2mac = false;
        }

        $('body').append($('<div class="win-mac-path-area"></div>'));
        $('.win-mac-path-area').append($('<a href="' + target + '" tabindex="10001">' + target + '</a>'));
        $('.win-mac-path-area').append($('<hr>'));

        url = win2mac
            ? 'smb://file03/fileshare' + matches[1].replace(/\\/g, '/')
            : 'W:' + matches[1].replace(/\//g, '\\');
        $('.win-mac-path-area').append($('<a href="' + url + '" tabindex="10002">' +  url + '</a>'));

        range = document.createRange();
        range.selectNodeContents($('.win-mac-path-area a').get(0).firstChild);
        $('.win-mac-path-area a').get(0).focus();

        sel.removeAllRanges();
        sel.addRange(range);
    });
})();
