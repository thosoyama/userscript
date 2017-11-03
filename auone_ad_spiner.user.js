// ==UserScript==
// @name         スピナーテスト
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
// @description  CSSアニメーションのスピナーを配置する
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://auone.jp/
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

document.styleSheets[0].insertRule('.news__item--ad a:first-child { position: relative; }', 0);
document.styleSheets[0].insertRule('.news__item--ad { background: none !important; }', 0);
document.styleSheets[0].insertRule('.adcon-toprich_loading { position:relative; background: none !important; }', 0);

var style = document.createElement('style');
style.textContent = `
    .spin {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 20px;
        display: flex;
        justify-content: space-between;
        z-index: 0;
    }
    .spin > div {
        height: 100%;
        width: 5px;
        background-color: #ccc;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }
    .spin > .spin__rect2 {
        animation-delay: -1.1s;
    }
    .spin > .spin__rect3 {
        animation-delay: -1.0s;
    }
    .spin > .spin__rect4 {
        animation-delay: -0.9s;
    }
    .spin > .spin__rect5 {
        animation-delay: -0.8s;
    }
    @keyframes sk-stretchdelay {
        0%, 40%, 100% {
            transform: scaleY(0.5);
        }  20% {
            transform: scaleY(1.0);
        }
    }
`;
document.querySelector('head').appendChild(style);

const spiner = document.createElement('div');
spiner.className = 'spin';
spiner.innerHTML = `
    <div class="spin__rect1"></div>
    <div class="spin__rect2"></div>
    <div class="spin__rect3"></div>
    <div class="spin__rect4"></div>
    <div class="spin__rect5"></div>
`;

window.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('#adcon-toprich');
    banner.firstChild.style.position = 'relative';
    banner.insertBefore(spiner.cloneNode(true), topBanner.firstChild);
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const target = mutation.target;
        if (target.className.indexOf('news__item--ad') !== -1 && !target.querySelector('.spin')) {
            const loader = spiner.cloneNode(true);
            target.insertBefore(loader, target.firstChild);
        }
    });
});

observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
});
