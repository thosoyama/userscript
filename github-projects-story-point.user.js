// ==UserScript==
// @name         Github projects story points
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.5
// @description  ラベルでポイント管理
// @author       hosoyama@mediba.jp
// @match        https://github.com/*/*/projects/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

const debounce = (() => {
    let timer;
    return (callback, interval) => {
        clearTimeout(timer);
        timer = setTimeout(callback, interval);
    };
})();

const calc = () => {
    const columns = Array.from(document.querySelectorAll('.js-project-column'));

    // 列毎のポイントを集計
    const points = columns.map(column => Array.from(column.querySelectorAll('.js-card-filter'))
        .filter(label => !label.closest('.d-none') && /^:?[.\d]+$/.test(label.innerText.trim()))
        .map((label) => Number(label.innerText.replace(/^:/, '').trim()))
        .reduce((a, b) => a + b, 0));

    // 合計ポイント集計
    const totalPoint = points.reduce((a, b) => a + b, 0);

    // 描画
    columns.forEach((column, index) => {
        const label = `${points[index]}/${totalPoint}`;
        const storyPoint = column.querySelector('.user-js-column-story-point');

        if (storyPoint.innerText !== label) {
            storyPoint.innerText = label;
        }

        storyPoint.style.display = label === '0/0' ? 'none' : '';
    });
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const target = mutation.target;
        if (!target.classList) {
            return;
        }

        if (target.classList.contains('js-project-columns-container')) {
            debounce(main, 300);
        } else if (target.classList.contains('js-project-column-cards')) {
            debounce(calc, 300);
        } else if (target.classList.contains('js-project-column-card')) {
            debounce(calc, 300);
        }
    });
});

const reset = () => {
    const columns = Array.from(document.querySelectorAll('.js-project-column'));
    columns.forEach((column) => {
        let point = column.querySelector('.user-js-column-story-point');
        if (!point) {
            const count = column.querySelector('.js-column-card-count');
            point = count.cloneNode();
            point.classList.remove('js-column-card-count');
            point.classList.add('user-js-column-story-point');
            count.parentNode.insertBefore(point, count.nextSibling);
        }
        point.innerText = '';
    });
    observer.disconnect();
    observer.observe(document.querySelector('.js-project-columns-container'), {
        childList: true,
        subtree: true,
        attributes: true,
    });
};

const main = () => {
    reset();
    calc();
};

const init = () => {
    var style = document.createElement('style');
    style.textContent = `
        .user-js-column-story-point {
            letter-spacing: 1px;
            text-indent: 1px;
        }
    `;
    document.querySelector('head').appendChild(style);
    main();
};

window.addEventListener('load', init, false);
