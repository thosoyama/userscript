// ==UserScript==
// @name         Talknoteリキッドレイアウト
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.4
// @description  Talknoteリキッドレイアウトにします
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
#wrapper, #message_text , #share ul.tab_list {
	width: 100% !important;
}
#scrollable_wrapper {
    width: auto !important;
    padding: 0 210px 0 15px !important;
}
#container {
	width: 100% !important;
    margin-right: -200px !important;
}
#left_nav {
	margin-left: 10px !important;
}
.logo_cont {
	margin-right: -210px !important;
}
#post_message .action {
    width: 100% !important;
}
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);

    setInterval(function() {
        $('#contents').css({width:  '' + ($('#container').width() - $('#right_nav').width() - 50) + 'px'});
        $('#tab_feed_sort').css({left: '' + ($('#contents').width() - 35) + 'px'});
    }, 300);
})();
