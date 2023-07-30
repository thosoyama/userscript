// ==UserScript==
// @name         Twitter Reloader
// @namespace    https://github.com/thosoyama
// @version      1.0.0
// @description  フォーカス時にリロード
// @author       https://github.com/thosoyama
// @homepage     https://github.com/thosoyama/userscript
// @homepageURL  https://github.com/thosoyama/userscript
// @updateURL    https://github.com/thosoyama/userscript/raw/master/dist/twitter.user.js
// @downloadURL  https://github.com/thosoyama/userscript/raw/master/dist/twitter.user.js
// @supportURL   https://github.com/thosoyama/userscript/issues
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const selector = {
        timeline: 'div[aria-label="ホームタイムライン"]',
        header: 'header >div > div > div',
        linksInHeader: 'header >div > div > div > div',
        mainHeader: 'main h2',
    };
    let isReady = false;
    function standby(ms = 20000) {
        isReady = false;
        return new Promise((resolve) => setTimeout(() => {
            isReady = true;
            resolve();
        }, ms));
    }
    async function reloadTimelineForHome() {
        const $timeline = document.querySelector(selector.timeline);
        if ($timeline === null) {
            return;
        }
        $timeline.style.transition = 'opacity 250ms ease-out';
        $timeline.style.opacity = '0';
        document.querySelector(selector.mainHeader)?.parentElement?.parentElement?.click();
        await timeout(500);
        $timeline.style.transition = 'opacity 250ms ease-in';
        $timeline.style.opacity = '1';
    }
    async function reloadTimeline() {
        const $timeline = document.querySelector(selector.timeline);
        if ($timeline === null) {
            return;
        }
        $timeline.style.transition = 'opacity 250ms ease-out';
        $timeline.style.opacity = '0';
        await timeout(450);
        scrollTo(0, 500);
        await timeout(50);
        scrollTo(0, 0);
        $timeline.style.transition = 'opacity 250ms ease-in';
        $timeline.style.opacity = '1';
    }
    async function handleEventAsync(e) {
        if (!isReady) {
            console.info('Skip: not ready.');
            return;
        }
        const scrollPosition = window.scrollY;
        if (scrollPosition > 0) {
            console.info('Skip: scrolled by user.');
            return;
        }
        const $timeline = document.querySelector(selector.timeline);
        if ($timeline === null) {
            console.info('Skip: no such timeline element.');
            return;
        }
        if (e.type === 'click' && e.target !== null) {
            const $headerInner = document.querySelector(selector.header);
            if (!$headerInner?.contains(e.target)) {
                console.info('Skip: not header clicked.');
                return;
            }
            const $headerLinks = Array.from(document.querySelectorAll(selector.linksInHeader));
            if ($headerLinks.some(($el) => $el.contains(e.target))) {
                console.info('Skip: invalid header click.');
                return;
            }
        }
        console.info('Start reloading.');
        standby();
        const reload = location.pathname === '/home' ? reloadTimelineForHome : reloadTimeline;
        reload();
    }
    function handleEvent(e) {
        console.group(e.type);
        handleEventAsync(e).finally(console.groupEnd);
    }
    window.addEventListener('focus', handleEvent);
    window.addEventListener('click', handleEvent);
    window.addEventListener('visibilitychange', handleEvent);
    standby();

})();
