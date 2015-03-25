// ==UserScript==
// @name        THashTag
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.2
// @description Talknoteの左メニューにハッシュタグのリンクを追加します
// @include     https://company.talknote.com/mediba.jp/*
// @exclude
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant       none
// ==/UserScript==

(function() {
    var scriptText = (function () {/*
        window.tHashTagCallBack = function(response) {
            var tags = response || [
                'あさかい報告',
                'スプリントレビュー',
                'アルファ',
                'ベータ',
                'お悩み',
            ];
            var leftMenu = document.getElementsByClassName('left_menu')[0];
            if (!leftMenu) {
                return;
            }
            var tagRoot = document.createElement('li');
            leftMenu.appendChild(tagRoot);
            var titleLink = document.createElement('a');
            titleLink.href = '#';
            titleLink.innerHTML = 'ハッシュタグ';
            tagRoot.appendChild(titleLink);
            var tagUlist = document.createElement('ul');
            tagRoot.appendChild(tagUlist);
            var tagList = document.createElement('li');
            tagUlist.appendChild(tagList);
            for (var i = 0, l = tags.length; i < l; i++) {
                var tagLink = document.createElement('a');
                tagLink.href = '/mediba.jp/search?keyword=%23' + encodeURIComponent(tags[i]);
                tagLink.innerHTML = '#' + tags[i];
                tagList.appendChild(tagLink);
            }
        };
    */}).toString().replace(/(\n)/g, '').split('*')[1];

    var script = document.createElement('script');
    script.textContent = scriptText;
    document.body.appendChild(script);

    script = document.createElement('script');
    script.src = 'https://develop.mdev.auone.jp/webapi/thashtag.js';
    document.body.appendChild(script);
})();
