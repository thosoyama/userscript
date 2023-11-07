// ==UserScript==
// @name         Amazon
// @namespace    https://github.com/thosoyama
// @version      1.0.0
// @description  Amazon
// @author       https://github.com/thosoyama
// @homepage     https://github.com/thosoyama/userscript
// @homepageURL  https://github.com/thosoyama/userscript
// @updateURL    https://github.com/thosoyama/userscript/raw/master/dist/amazon.user.js
// @downloadURL  https://github.com/thosoyama/userscript/raw/master/dist/amazon.user.js
// @supportURL   https://github.com/thosoyama/userscript/issues
// @match        https://www.amazon.co.jp/*&pg=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    function main() {
        const button = document.querySelector('.a-pagination .a-last:not(:has(>a))');
        if (!button) {
            return;
        }
        const currentPageUrl = location.href;
        const currentPageNumber = location.href.match(/pg=(\d+)/)?.[1];
        if (!currentPageNumber) {
            return;
        }
        const link = document.createElement('a');
        link.href = currentPageUrl.replace(/pg=\d+/, `pg=${Number(currentPageNumber) + 1}`);
        link.innerHTML = button.innerHTML;
        button.classList.remove('a-disabled');
        button.innerHTML = '';
        button.append(link);
    }
    main();

})();
