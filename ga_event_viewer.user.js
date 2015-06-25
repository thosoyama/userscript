// ==UserScript==
// @name        catchTrEventの引数をコンソール出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.2
// @description GAのイベントパラメータをコンソールにデバッグ出力します
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    
    $('body').append($('<script/>').text((function () {/*
    
    console.debug('catchTrEventの引数をコンソール出力');

    // catchTrEvent
    var cte = setInterval(function() {
        if (typeof catchTrEvent !== 'undefined') {
            var catchTrEventOrig = catchTrEvent;
            catchTrEvent = function() {
                console.debug(arguments);
                catchTrEventOrig.apply(window, arguments);
            };
            clearInterval(cte);
        }
    }, 300);

    */}).toString().replace(/(\n)/g, '\n').split('*')[1]));
    
})(jQuery.noConflict(true));
