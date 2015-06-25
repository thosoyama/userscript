// ==UserScript==
// @name        GAに送信するイベントパラメータをコンソールに出力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.1
// @description GAのイベントパラメータをコンソールにデバッグ出力します
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @noframes
// ==/UserScript==

(function($) {
    
    $('head').append($('<script/>').text((function () {/*
    
    var timeerId = setInterval(function() {
        if (typeof window.ga !== 'undefined') {
            console.debug('GAのイベントパラメータをコンソールにデバッグ出力します');
            window.ga_orig = window.ga;
            window.ga = function() {
                console.debug(arguments);
                ga_orig();
            };
            clearInterval(timeerId);
        }
    }, 500);
    
    */}).toString().replace(/(\n)/g, '').split('*')[1]));
    
})(jQuery.noConflict(true));
