// ==UserScript==
// @name         Talknoteリキッドレイアウト
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
// @description  Talknoteリキッドレイアウトにします
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @grant        none
// ==/UserScript==

(function() {
    $('#wrapper, #message_text , #share ul.tab_list').css({width: '100%'});
    $('#left_nav').css({marginLeft: '10px'});
    var intervalTimer = setInterval(function() {
        $('#container').css({width: '' + ($('#wrapper').width() - $('#left_nav').width() - 35) + 'px'});
        $('#contents').css({width:  '' + ($('#container').width() - $('#right_nav').width() - 50) + 'px'});
        $('#tab_feed_sort').css({left: '' + ($('#contents').width() - 40) + 'px'});
    }, 300);
})();
