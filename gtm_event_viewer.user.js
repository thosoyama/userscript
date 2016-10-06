// ==UserScript==
// @name        スクロールイベントデバッグ
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.4
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
        var gtm_timer = setInterval(function() {
            if (typeof window.dataLayer !== 'undefined') {
                var dataLayer_original = window.dataLayer.push;
                window.dataLayer.push = function(o) {
                    if (o.event === 'ScrollDistance') {
                        console.log('scroll:', [o.eventCategory, o.eventAction, o.eventLabel]);
                    }
                    dataLayer_original.apply(window, arguments);
                };
                clearInterval(gtm_timer);
                console.debug('スクロールイベントデバッグON');
            }
        }, 500);
    `));
})(jQuery.noConflict(true));
