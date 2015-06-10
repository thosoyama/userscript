// ==UserScript==
// @name        CasperJS Utilsを有効にする
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.1
// @description CasperJSの__utils__メソッドをconsoleから実行して確認できるようにします
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://*/*
// @match       https://*/*
// @grant       none
// ==/UserScript==

(function(){
    void(function(){
        if(!document.getElementById('CasperUtils')){
            var CasperUtils=document.createElement('script');
            CasperUtils.id='CasperUtils';
            CasperUtils.src='https://rawgit.com/n1k0/casperjs/master/modules/clientutils.js';
            document.documentElement.appendChild(CasperUtils);
            var interval=setInterval(function(){
                if(typeof ClientUtils==='function'){
                    window.__utils__=new window.ClientUtils();
                    clearInterval(interval);
                }
            },50);
        }
    }());
})();
