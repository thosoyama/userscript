// ==UserScript==
// @name         GitHubリキッドレイアウト
// @namespace    https://github.com/hosoyama-mediba/userscript/
// @version      0.2
// @description  GitHubを横幅固定からリキッドレイアウトにします
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
        .blob-code {
            font-family: Ricty,Consolas, "Liberation Mono", Menlo, Courier, monospace !important;
            font-size: 14px !important;
         }

        html {
            overflow-y: scroll !important;
        }


        .wrapper {
            padding: 0 15px !important;
        }

        .container {
            width: 100% !important;
        }

        #js-repo-pjax-container {
            width: 100% !important;
            padding-right: 38px !important;
        }

        .only-with-full-nav,
        .full-word {
            display: none !important;
        }

        .repository-sidebar {
            position: absolute !important;
            right: 0 !important;
            width: 38px !important;
        }

        .repository-sidebar .counter {
            display: none !important;
        }

        #discussion_bucket {
            margin-right: 160px !important;
        }
        .discussion-sidebar {
            position:relative !important;
            left: 160px !important;
        }
        .discussion-timeline {
            width: 100% !important;
            float: none !important;
        }

        .timeline-new-comment,
        .inline-comments,
        .inline-comment-form,
        .inline-comments,
        .inline-comment-form-container,
        .comment-holder {
            width: 100% !important;
            max-width: none !important;
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);
})();
