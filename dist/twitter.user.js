// ==UserScript==
// @name         Twitter Reloader
// @namespace    https://github.com/thosoyama
// @version      1.3.4
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

(function (exports) {
    'use strict';

    function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const exId = 'ex-tw-reloader';
    const selector = {
        ex: `#${exId}`,
        timeline: 'div[aria-label="ホームタイムライン"]',
        column: 'div[aria-label="ホームタイムライン"] > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)',
        header: 'header',
        headerInner: 'header > div:nth-of-type(1)',
        headerMenuWrapper: 'header > div:nth-of-type(1) > div:nth-of-type(1)',
        headerMenu: 'header > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)',
        linksInHeader: 'header > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)',
        mainHeader: 'main h2',
        sidebar: 'div[data-testid="sidebarColumn"]',
        hasNotSidebar: '#react-root:not(:has(div[data-testid="sidebarColumn"]))',
        metaThemeColor: 'meta[name="theme-color"]',
    };
    let isReady = false;
    let timer;
    function $(key, target = window.document) {
        return target.querySelector(selector[key]);
    }
    function $$(key, target = window.document) {
        return Array.from(target.querySelectorAll(selector[key]));
    }
    const hex2rgb = (hex, alpha) => {
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }
        if (![3, 6].includes(hex.length) || /^[\dA-Fa-f]+}$/.test(hex)) {
            throw new Error(`Invalid hex ${hex}`);
        }
        if (alpha !== undefined && (alpha > 1 || alpha < 0)) {
            throw new Error(`Invalid alpha ${alpha}`);
        }
        if (hex.length === 3) {
            hex = Array.from(hex)
                .flatMap((s) => [s, s])
                .join('');
        }
        const rgb = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
            .map((str) => Number.parseInt(str, 16))
            .join(',');
        return alpha === undefined ? `rgb(${rgb})` : `rgba(${rgb},${alpha})`;
    };
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
        if ($('sidebar')) {
            return;
        }
        const ev = e;
        if (ev.type === 'mouseleave') {
            $('headerMenuWrapper')?.style.setProperty('height', '53px', 'important');
            return;
        }
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
    function handleMouseMoveEvent(e) {
        if ($('sidebar')) {
            return;
        }
        const { x } = e;
        const headerWidth = $('headerMenuWrapper')?.getBoundingClientRect().width ?? 68;
        const height = x > 0 && x <= headerWidth ? '100%' : '53px';
        $('headerMenuWrapper')?.style.setProperty('height', height, 'important');
    }
    function installStyles() {
        const id = 'ex-tw-reloader';
        if ($('ex') !== null) {
            return;
        }
        const themeColor = $('metaThemeColor')?.content ?? '#15202B';
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
      background-color: ${hex2rgb(themeColor, 0.75)} !important;
      cursor: pointer;
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
        document.addEventListener('mousemove', handleMouseMoveEvent);
    }
    installStyles();
    installEventHandler();
    standby();

    exports.hex2rgb = hex2rgb;

    return exports;

})({});
