// ==UserScript==
// @name         Win⇔Macファイルパス変換
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      1.15
// @description  TalknoteかRedmine上でファイルサーバのパスを選択するとWin,Mac用に変換したパスを表示します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @match        https://*.google.com/*
// @match        https://github.com/*
// @match        http://au-project.mediba.local/*
// @match        https://creative-m.backlog.jp/*
// @match        http://lodge.mediba.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
    var style = document.createElement('style');
    style.textContent = (function () {/*
        .ex-win2mac {
            display: none;
            margin: 0;
            padding: 0;
            border: 1px solid #169;
            border-radius: 3px;
            background-color: #fff;
            color: #336;
            font-size: 14px;
            font-family: Ricty, Osaka-mono, "Osaka-等幅", "ＭＳ ゴシック", monospace;
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
            background-color: #fff;
            text-decoration: none;
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

    $('.ex-win2mac__link').on('mouseover focus', function(e) {
        var self = this;
        this.focus();
        setTimeout(function() {
            var r = document.createRange();
            var s = window.getSelection();
            r.selectNodeContents(self.firstChild);
            s.removeAllRanges();
            s.addRange(r);
        }, 0);
    }).on('click', function() {
        $dialog.hide();
        location.href = this.href;
        return false;
    });

    var filenameFilter = function(filepath) {
        var isMac = filepath.indexOf('smb:') === 0;
        var names = [];
        filepath.split(/[\/\\]/).forEach(function(val, idx, ary) {
            names[idx] = val.replace(/ /g, '%20');
        })
        return names.join(isMac ? '/' : '\\');
    };

    $(document).on('mouseup', function(e) {
        if ($(e.target).hasClass('ex-win2mac') || $(e.target).parent().hasClass('ex-win2mac')) {
            return;
        }

        $dialog.hide();

        var selectedText = window.getSelection().toString().trim().replace(/\r?\n.*/gm, '');
        if (!selectedText.length) {
            return;
        }

        var matches = selectedText.match(/^(?:([a-zA-Z]):|\\\\(?:mediba-)?(file0\d)\\fileshare)((?:(?:\\[^\\]+)+)\\?)$/i);
        var win2mac = true;
        if (!matches) {
            matches = selectedText.match(/^smb:\/\/(?:mediba-)?(file0\d)(?:\.mediba\.local)?\/fileshare((?:(?:\/[^\/]+)+)\/?)$/i);
            if (!matches) {
                return;
            }
            win2mac = false;
        }
        var volume = (matches[1] || matches[2]).toLowerCase();
        var win2macVolumeMap = {
            file02 : 'file02',
            file03 : 'file03',
            v      : 'file02',
            w      : 'file03'
        };
        var mac2winVolumeMap = {
            file02 : 'V',
            file03 : 'W'
        };
        var convertedText = win2mac
            ? 'smb://' + win2macVolumeMap[volume] + '/fileshare' + matches[3].replace(/\\/g, '/')
            : mac2winVolumeMap[volume] + ':'+ matches[2].replace(/\//g, '\\');

        var $1stLink = $('.ex-win2mac__link:first-child').attr({href: filenameFilter(selectedText)}).text(selectedText);
        var $2ndLink = $('.ex-win2mac__link:last-child').attr({href: filenameFilter(convertedText)}).text(convertedText);

        $dialog.show();
        $1stLink.focus();
    });
})(jQuery.noConflict(true));
