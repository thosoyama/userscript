// ==UserScript==
// @name         TalknoteGroupIcon
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.4
// @description  Talknoteのサイドメニューにグループアイコンを表示する
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @grant        none
// @noframes
// ==/UserScript==

(function($) {
    // CSS
    var styels = `
        .left_link_unread {
            margin-left: 5px !important;
        }
        .ex-tgi-left-icon {
            width: 20px;
            height: 20px;
            margin-top: -15px;
            margin-right: 2px;
            border-radius: 20px;
        }
    `;
    $('<style/>').text(styels).appendTo($('head'));

    // APIからグループの情報を取得してアイコンを埋める
    function addLeftMenuGroupIcon() {
        $.ajax({
            url: 'https://company.talknote.com/mediba.jp/ajax/group/list'
        }).done(function(json) {
            $.each(json.data.groups, function(i, item) {
                $('#left_group_list > li').each(function(j, groupElement) {
                    if (!groupElement.id.match(/^g_left_(\d+)$/)) {
                        return;
                    }
                    if (item.group_id !== Number(RegExp.$1)) {
                        return;
                    }
                    var $el = $(groupElement).find('#g_left_link_' + item.group_id + ' .left_link_txt');
                    var $icon = $('<img>').attr('src', item.g_file_name_20).addClass('ex-tgi-left-icon');
                    $el.parent().prepend($icon);
                    return false;
                });
            });
        });
    }

    // DOMの挿入を監視
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
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})(jQuery.noConflict(true));
