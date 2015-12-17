// ==UserScript==
// @name         Taigaのプロフィール画像を表示する( ˙-˙ )
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.3
// @name         なおるまで( ˙-˙ )
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        http://taiga.mediba.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var $brokenImg = $(mutation.target).find('img[src*=localhost\\:8000]');
            $brokenImg.each(function() {
                this.src = this.src.replace(/localhost\:8000/, 'taiga.mediba.jp');
            });
        })
    });
    observer.observe(document.body, { childList: true, subtree: true });
})(jQuery.noConflict(true));
