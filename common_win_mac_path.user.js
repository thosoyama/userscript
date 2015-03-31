// ==UserScript==
// @name         Win⇔Macファイルパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      1.1
// @description  TalknoteかRedmine上でファイルサーバのパスを選択するとWin,Mac用に変換したパスを表示します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @match        http://au-project.mediba.local/*
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
        .ex-win2mac {
            display: none;
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
        .ex-win2mac a {
            display: block;
            margin: 0;
            padding: 10px;
            color: #169;
            text-decoration: none;
        }
        .ex-win2mac a:hover {
            color: #c44;
        }
        .ex-win2mac a:focus {
            outline: 3px solid #49c;
            outline-radius: 5px;
            outline-offset: -1px;
        }
        .ex-win2mac hr {
            display: block;
            margin: 0;
            border: 1px solid #169;
            border-width:1px 0 0 0;
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);

    var $dialog = $('<div class="ex-win2mac"></div>');
    $('body').prepend($dialog);

    $dialog
        .append($('<a href="" class="ex-win2mac__link" tabindex="10001"></a>'))
        .append($('<hr>'))
        .append($('<a href="" class="ex-win2mac__link" tabindex="10002"></a>'));

    $('.ex-win2mac__link').on('focus', function(e) {
        var self = this;
        setTimeout(function() {
            var r = document.createRange();
            var s = window.getSelection();
            r.selectNodeContents(self.firstChild);
            s.removeAllRanges();
            s.addRange(r);
        }, 0);
    });
    
    $(document).on('mouseup', function(e) {
        if ($(e.target).hasClass('ex-win2mac') || $(e.target).parent().hasClass('ex-win2mac')) {
            return;
        }

        $dialog.hide();

        var selectedText = window.getSelection().toString().trim().replace(/\r?\n.*/gm, '');
        if (!selectedText.length) {
            return;
        }

        var matches = selectedText.match(/^(?:[a-zA-Z]:|\\\\FILE03\\fileshare)((?:(?:\\[^\\]+)+)\\?)$/i);
        var win2mac = true;
        if (!matches) {
            matches = selectedText.match(/^smb:\/\/file03\/fileshare((?:(?:\/[^\/]+)+)\/?)$/i);
            if (!matches) {
                return;
            }
            win2mac = false;
        }

        var convertedText = win2mac
            ? 'smb://file03/fileshare' + matches[1].replace(/\\/g, '/')
            : 'W:' + matches[1].replace(/\//g, '\\');

        var $1stLink = $('.ex-win2mac__link:first-child').attr({href: selectedText}).text(selectedText);
        var $2ndLink = $('.ex-win2mac__link:last-child').attr({href: convertedText}).text(convertedText);

        $dialog.show();
        $1stLink.focus();
    });
})();
