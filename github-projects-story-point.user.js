// ==UserScript==
// @name         Github projects story points
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
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
    columns.forEach((column) => {
        const point = Array.from(column.querySelectorAll('.js-card-filter-label'))
            .filter(label => !label.closest('.d-none') && /^\d+$/.test(label.innerText.trim()))
            .map((label) => Number(label.innerText.trim()))
            .reduce((a, b) => a + b, 0);

        const storyPoint = column.querySelector('.js-column-story-point');
        if (storyPoint.innerText !== `${point}pt`) {
            storyPoint.innerText = `${point}pt`;
        }
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
        let point = column.querySelector('.js-column-story-point');
        if (!point) {
            const count = column.querySelector('.js-column-card-count');
            point = count.cloneNode();
            point.classList.remove('js-column-card-count');
            point.classList.add('js-column-story-point');
            point.innerText = `0pt`;
            count.parentNode.insertBefore(point, count.nextSibling);
        }
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

window.addEventListener('load', main, false);
