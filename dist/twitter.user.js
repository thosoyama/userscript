// ==UserScript==
// @name         Twitter Reloader
// @namespace    https://github.com/thosoyama
// @version      1.3.2
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

    const exId = 'ex-tw-reloader';
    const selector = {
        ex: `#${exId}`,
        timeline: 'div[aria-label="ホームタイムライン"]',
        column: 'div[aria-label="ホームタイムライン"] > div > div > div > div > div > div > div',
        header: 'header',
        headerInner: 'header > div',
        headerMenuWrapper: 'header > div > div',
        headerMenu: 'header > div > div > div',
        linksInHeader: 'header >div > div > div > div',
        mainHeader: 'main h2',
        sidebar: 'div[data-testid="sidebarColumn"]',
        hasNotSidebar: 'div:not(:has(div[data-testid="sidebarColumn"]))',
        headerIsMin: 'header > div:is()',
    };
    let isReady = false;
    let timer;
    function $(key, target = window.document) {
        return target.querySelector(selector[key]);
    }
    function $$(key, target = window.document) {
        return Array.from(target.querySelectorAll(selector[key]));
    }
    function standby(ms = 20000) {
        isReady = false;
        return new Promise((resolve) => setTimeout(() => {
            isReady = true;
            resolve();
        }, ms));
    }
    async function reloadTimelineForHome() {
        const $timeline = $('timeline');
        if ($timeline === null) {
            return;
        }
        $timeline.style.transition = 'opacity 250ms ease-out';
        $timeline.style.opacity = '0';
        $('mainHeader')?.parentElement?.parentElement?.click();
        await timeout(500);
        scrollTo(0, 0);
        $timeline.style.transition = 'opacity 250ms ease-in';
        $timeline.style.opacity = '1';
    }
    async function reloadTimelineForOther() {
        const $timeline = $('timeline');
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
    async function reloadTimeline(e) {
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
        const $timeline = $('timeline');
        if ($timeline === null) {
            console.info('Skip: no such timeline element.');
            return;
        }
        if (e.type === 'click' && e.target !== null) {
            const $headerInner = $('headerMenu');
            if (!$headerInner?.contains(e.target)) {
                console.info('Skip: not header clicked.');
                return;
            }
            const $headerLinks = $$('linksInHeader');
            if ($headerLinks.some(($el) => $el.contains(e.target))) {
                console.info('Skip: invalid header click.');
                return;
            }
        }
        console.info('Start reloading.');
        standby();
        const reload = location.pathname === '/home' ? reloadTimelineForHome : reloadTimelineForOther;
        reload();
    }
    function handleEvent(e) {
        console.group(e.type);
        reloadTimeline(e).finally(console.groupEnd);
    }
    function handleMouseEvent(e) {
        const ev = e;
        const height = ev.type === 'mouseenter' || $('sidebar') ? '100%' : '53px';
        $('headerMenuWrapper')?.style.setProperty('height', height, 'important');
        clearTimeout(timer);
        if (ev.type === 'mouseenter') {
            timer = setTimeout(() => {
                const scrollPosition = window.scrollY;
                if (scrollPosition === 0) {
                    console.group(ev.type);
                    reloadTimeline(ev).finally(console.groupEnd);
                }
            }, 1000);
        }
    }
    function installStyles() {
        const id = 'ex-tw-reloader';
        if ($('ex') !== null) {
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
      opacity: 0.75;
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
    function installEventHandler() {
        window.addEventListener('focus', handleEvent);
        window.addEventListener('click', handleEvent);
        window.addEventListener('visibilitychange', handleEvent);
        document.addEventListener('mouseenter', handleMouseEvent);
        document.addEventListener('mouseleave', handleMouseEvent);
    }
    installStyles();
    installEventHandler();
    standby();

})();
