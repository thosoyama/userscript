// ==UserScript==
// @name        GAイベントの引数をコンソール出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.5
// @description GAのイベントパラメータをコンソールにデバッグ出力します
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    var script = $('<script/>').text(`
        var gaTimer;
        var gaReadyCallback = function() {
            console.log('GAイベントの引数をデバッグ出力します');
            var gaOrig = window.ga;
            window.ga = function(...args) {
                console.log('ga:', ...args);
                gaOrig.apply(window, arguments);
            };
            clearInterval(gaTimer);
        };

        gaTimer = setInterval(function() {
            if (typeof window.ga !== 'undefined') {
                window.ga(gaReadyCallback);
            }
        }, 500);
    `);
    $('body').append(script);
})(jQuery.noConflict(true));
