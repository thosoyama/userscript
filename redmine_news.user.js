// ==UserScript==
// @name        Redmineのニュースでチケットのプレビュー表示
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.3
// @description Redmineのニュースでチケットのプレビュー表示します。
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://au-project.mediba.local/news/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// ==/UserScript==

(function($) {
    $('head').append($('<style/>').text((function () {/*
        .ex-issue_container {
            display:none;
            position: fixed;
            left: 6em;
            top: 40px;
            max-width: 800px;
            max-height: 85%;
            border: 1px solid #666;
            border-radius: 4px;
            margin: 0;
            padding: 10px;
            box-shadow: 10px 10px 10px rgba(0,0,0,0.4);
            background-color: #fff;
            overflow: auto;
        }
        .ex-issue_container #ex-content {
            width: 100%;
            border: none;
            background-color: #fff;
        }
        .noscroll {
            overflow: hidden;
            margin-right: 15px;
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1]));
    
    $container = $('<div class="ex-issue_container"/>');
    $('body').append($container);

    $('#wrapper').on('click', function(e) {
        $container.is(':visible') && $container.hide('fast');
        $('html').removeClass('noscroll');
    });

    $('a.issue, a.external[href^="http://au-project.mediba.local/issues/"]').each(function() {
        $issue = $(this);
        $issue.on('mouseover', function(e) {
            if ($container.is(':visible')) {
                return;
            }
            $container.html('<img src="http://au-project.mediba.local/images/loading.gif">');
            $container.show('fast');
            $.ajax({
                url: this.href,
                timeout: 3000,
                success: function(data) {
                    var $innerIssue = $(data).find('#content').attr('id', 'ex-content');
                    $innerIssue.find('script').text('');
                    $container.html($innerIssue);
                    $('html').addClass('noscroll');
                },
                error: function(data) {
                    $container.html('<img src="http://au-project.mediba.local/images/delete.png">');
                    setTimeout(function() {
                        $container.hide('fast');
                        $('html').removeClass('noscroll');
                    }, 1000);
                }
            });
            return false;
        });
    });
})(jQuery.noConflict(true));
