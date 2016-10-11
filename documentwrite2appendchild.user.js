// ==UserScript==
// @name         Replace document.write()
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
// @description  To disable document.write()
// @author       hosoyama@mediba.jp
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
    var script = document.createElement('script');
    script.innerHTML = `
        document._write = document.write;
        document.write = function(arg) {
            if (arg.match(/^<script.+src="\\s*([^"\\s]+)/)) {
                var script = document.createElement('script');
                script.async = true;
                script.src = RegExp.$1;
                document.querySelector('head').appendChild(script);
            } else if (arg.match(/<iframe.+?src="\\s*([^"\\s]+)/)) {
                var iframe = document.createElement('iframe');
                iframe.src = RegExp.$1;
                iframe.width = 0;
                iframe.height = 0;
                iframe.style.display = 'none';
                document.querySelector('body').appendChild(iframe);
            } else {
                document._write(arg);
                return;
            }
        };
    `;
    document.querySelector('head').appendChild(script);
})();
