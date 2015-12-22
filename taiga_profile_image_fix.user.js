// ==UserScript==
// @name         Taigaのプロフィール画像を表示する( ˙-˙ )
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.4
// @description  なおるまで
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        http://taiga.mediba.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0, l = mutation.addedNodes.length; i < l; i++) {
                var $addedNode  = $(mutation.addedNodes[i]);

                // プロフィール画像追加
                $addedNode.find('img[src*=localhost\\:8000]').each(function() {
                    this.src = this.src.replace(/localhost\:8000/, 'taiga.mediba.jp');
                });

                // スプリントトグルボタン追加
                if (!$('#show-sprints').size() && $addedNode.attr('id') === 'show-tags') {
                    var $sprintToggleButton = $('<a>')
                       .attr({'id': 'show-sprints', 'class': 'trans-button active'})
                       .html('Sprint非表示')
                       .css('display', 'inline-block')
                       .on('click', function() {
                            var $this = $(this);
                            $this.html('Sprint' + ($this.hasClass('active') ? '' : '非') + '表示');
                            $('sidebar.menu-secondary.sidebar').toggle('fast');
                            $this.toggleClass('active');
                        });
                    $sprintToggleButton.insertAfter($(mutation.addedNodes[i]));
                }
            }
        })
    });
    observer.observe(document.body, { childList: true, subtree: true });

})(jQuery.noConflict(true));
