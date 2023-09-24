// ==UserScript==
// @name         Twitter Reloader
// @namespace    https://github.com/thosoyama
// @version      1.1.1
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
        column: 'div[aria-label="ホームタイムライン"] > div > div > div > div > div > div > div',
        header: 'header',
        headerInner: 'header > div',
        headerMenuWrapper: 'header > div > div',
        headerMenu: 'header > div > div > div',
        linksInHeader: 'header >div > div > div > div',
        mainHeader: 'main h2',
        hasNotSidebar: 'div:not(:has(div[data-testid="sidebarColumn"]))',
        headerIsMin: 'header > div:is()',
    };
    let isReady = false;
    function $(selector, target = window.document) {
        return target.querySelector(selector);
    }
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
        scrollTo(0, 0);
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
        if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
            console.info('Skip: visibility hidden.');
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
            const $headerInner = document.querySelector(selector.headerMenu);
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
    function installStyles() {
        const id = 'ex-tw-reloader';
        if ($(`#${id}`) !== null) {
            return;
        }
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
    ${selector.hasNotSidebar} ${selector.header} {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
    ${selector.hasNotSidebar} ${selector.headerMenuWrapper} {
      height: 53px !important;
    }
    ${selector.hasNotSidebar} ${selector.headerMenu} {
      background-color: #15202B !important;
    }
    ${selector.hasNotSidebar} ${selector.column} {
      padding-left: 95px !important;
      @media (max-width: 599px) {
        padding-left: 75px !important;
      }
    }
  `;
        document.head.append(style);
    }
    function handleHeaderMouseEvent(e) {
        if (!(e.target instanceof Node)) {
            return;
        }
        const $header = $(selector.header);
        const $menuWrapper = $(selector.headerMenuWrapper);
        if ($header.contains(e.target) && $menuWrapper.clientHeight === 53) {
            $menuWrapper.style.setProperty('height', '100%', 'important');
            console.group(e.type);
            handleEventAsync(e).finally(console.groupEnd);
            return;
        }
        if (!$header.contains(e.target) && $menuWrapper.clientHeight !== 53) {
            $(selector.headerMenuWrapper).style.setProperty('height', '53px', 'important');
        }
    }
    function installScript() {
        window.addEventListener('focus', handleEvent);
        window.addEventListener('click', handleEvent);
        window.addEventListener('visibilitychange', handleEvent);
        window.addEventListener('mouseover', handleHeaderMouseEvent);
        window.addEventListener('mouseout', handleHeaderMouseEvent);
    }
    installStyles();
    installScript();
    standby();

})();
