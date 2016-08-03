// ==UserScript==
// @name        スクロールイベントデバッグ
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.3
// @description スクロールイベントの発火時にログ出力
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    $('body').append($('<script/>').text(`

        console.debug('スクロールイベントデバッグON');

        var gtm_timer = setInterval(function() {
            if (typeof window.dataLayer !== 'undefined') {
                var dataLayer_original = window.dataLayer.push;
                window.dataLayer.push = function(o) {
                    if (o.event === 'ScrollTiming') {
                        console.log(o.eventLabel + ': ' + o.eventTiming + 'ms');
                    }
                    dataLayer_original.apply(window, arguments);
                };
                clearInterval(gtm_timer);
            }
        }, 500);

    `));
})(jQuery.noConflict(true));
