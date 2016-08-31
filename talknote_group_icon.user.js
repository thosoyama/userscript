// ==UserScript==
// @name         TalknoteGroupIcon
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.1
// @description  Talknoteのサイドメニューにグループアイコンを表示する
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    function addLeftMenuGroupIcon() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4 && xhr.status !== 200) {
                return;
            }
            var resp = JSON.parse(xhr.responseText);
            resp.data.groups.forEach(function(item) {
                document.querySelectorAll('#left_group_list > li').forEach(function(groupElement) {
                    if (groupElement.id.match(/^g_left_(\d+)$/)) {
                        if (item.group_id === Number(RegExp.$1)) {
                            var el = groupElement.querySelector('#g_left_link_' + item.group_id + ' .left_link_txt');
                            var icon = document.createElement('img');
                            icon.src = item.g_file_name_20;
                            icon.style.width = '20px';
                            icon.style.height = '20px';
                            icon.style.marginTop = '-15px';
                            icon.style.marginRight = '2px';
                            el.parentNode.insertBefore(icon, el);
                        }
                    }
                });
            });
        };
        xhr.open( 'GET', 'https://company.talknote.com/mediba.jp/ajax/group/list', false );
        xhr.send(null);
        xhr.abort();
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0, l = mutation.addedNodes.length; i < l; i++) {
                var node = mutation.addedNodes[i];
                if (node.id && node.id === 'left_menu_timeline') {
                    addLeftMenuGroupIcon();
                }
            }
        });
    });
    observer.observe(document.getElementById('left_group_list'), { childList: true });
})();
