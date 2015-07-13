// ==UserScript==
// @name        GAイベントの引数をコンソール出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.3
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
    
    console.debug('GAイベントの引数をデバッグ出力します');

    // catchTrEvent
    //var cte = setInterval(function() {
    //    if (typeof catchTrEvent !== 'undefined') {
    //        var catchTrEventOrig = catchTrEvent;
    //        catchTrEvent = function() {
    //            console.debug('catchTrEvent:', arguments);
    //            catchTrEventOrig.apply(window, arguments);
    //        };
    //        clearInterval(cte);
    //    }
    //}, 300);

    // trEvent
    var te = setInterval(function() {
        if (typeof trEvent !== 'undefined') {
            var trEventOrig = trEvent;
            trEvent = function() {
                console.debug('trEvent:', arguments);
                trEventOrig.apply(window, arguments);
            };
            clearInterval(te);
        }
    }, 300);

    // trEventBeTimeControl
    var tebtc = setInterval(function() {
        if (typeof trEventBeTimeControl !== 'undefined') {
            var trEventBeTimeControlOrig = trEventBeTimeControl;
            trEventBeTimeControl = function() {
                console.debug('trEventBeTimeControl:', arguments);
                trEventBeTimeControlOrig.apply(window, arguments);
            };
            clearInterval(tebtc);
        }
    }, 300);

    */}).toString().replace(/(\n)/g, '\n').split('*')[1]));
})(jQuery.noConflict(true));
