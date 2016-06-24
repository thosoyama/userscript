// ==UserScript==
// @name        GTMイベントログ出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.1
// @description GTMとGAのイベントパラメータをコンソールにデバッグ出力します
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    $('body').append($('<script/>').text(`

        console.debug('GTMイベントの引数をデバッグ出力します');

        var ga_timer = setInterval(function() {
            if (typeof window.ga !== 'undefined') {
                var ga_original = window.ga;
                window.ga = function() {
                    console.debug('ga:', arguments);
                    ga_original.apply(window, arguments);
                };
                clearInterval(ga_timer);
            }
        }, 300);

        var gtm_timer = setInterval(function() {
            if (typeof window.dataLayer !== 'undefined') {
                var dataLayer_original = window.dataLayer.push;
                window.dataLayer.push = function() {
                    console.debug('dataLayer:', arguments[0]);
                    dataLayer_original.apply(window, arguments);
                };
                clearInterval(gtm_timer);
            }
        }, 300);

    `));
})(jQuery.noConflict(true));
