// ==UserScript==
// @name        e-staffingの定時変更
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.1
// @description 定時ボタンクリックすると17:30が入力されるので18:30にする。区分も通常を選択状態にする。
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       https://timecard2.e-staffing.ne.jp/staff/001_004.cfm
// @grant       none
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.textContent = (function () {/*
        if (typeof window.SetRegTime === 'function') {
            window.SetRegTimeBk = window.SetRegTime;
            window.SetRegTime = function(n) {
                window.SetRegTimeBk(n);
                var f4 = document.main4_form.elements;
    			f4['endhh_text' + n].value = '18';
                f4['hd_select'  + n].selectedIndex = 1;
            };
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.body.appendChild(script);
})();
