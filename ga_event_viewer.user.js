// ==UserScript==
// @name        GAイベントの引数をコンソール出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.4
// @description GAのイベントパラメータをコンソールにデバッグ出力します
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    $('body').append($('<script/>').text(`
        console.debug('GAイベントの引数をデバッグ出力します');
        var timer = setInterval(function() {
            if (typeof window.ga !== 'undefined') {
                var gaOrig = window.ga;
                window.ga = function() {
                    console.debug('ga:', arguments);
                    gaOrig.apply(window, arguments);
                };
                clearInterval(timer);
            }
        }, 500);
    `));
})(jQuery.noConflict(true));
