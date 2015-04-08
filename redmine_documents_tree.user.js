// ==UserScript==
// @name        Redmine文書のタイトルをツリー構造化
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.3
// @description 文書のタイトルをスラッシュで区切ると階層構造になります
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://au-project.mediba.local/projects/*/documents
// @grant       none
// ==/UserScript==

function objectSort(object) {
    var sorted = {};
    var array = [];
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            array.push(key);
        }
    }
    array.sort(); 
    for (var i = 0; i < array.length; i++) {
        sorted[array[i]] = object[array[i]];
    }
    return sorted;
}

(function() {
    var style = document.createElement('style');
    style.textContent = (function () {/*
        #content .author {
            margin-left: 1em;
            font-size: 0.9em;
            color: #888;
        }
        #content ul {
            margin: 12px 0;
            list-style: none;
        }
        #content > ul {
            padding: 0;
        }
        #content li > a {
            padding-left: 12px;
            cursor: pointer;
        }
        #content > ul > li > a {
            padding-left: 12px;
        }
        #content li {
            margin: 12px 0;
            font-family: 'Trebuchet MS', Verdana, sans-serif;
            font-size: 12px;
            font-weight: bold;
        }
        .ex-content {
            background: #ffffdd;
            padding: 6px;
            margin-bottom: 6px;
            border: 1px solid #d7d7d7;
        }
        .attachments {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .attachments p {
            margin: 0 0 12px 0 !important;
        }
    */}).toString().replace(/(\n)/g, '').split('*')[1];
    document.getElementsByTagName('head')[0].appendChild(style);

    $('#content').find('.wiki').remove();

    var dictionary = {};
    var $title = $('#content').find('h4');

    var aryEach = function(ary, dic) {
        var key = ary.shift();
        if (ary.length <= 1) {
            dic[key] = {data: ary.shift(), list: {}};
            return;
        }
        if (!(key in dic)) {
            dic[key] = {data: undefined, list: {}};
        }
        return aryEach(ary, dic[key].list);
    };

    $title.each(function() {
        var $em = $(this).next().find('em').remove();
        $(this).append($em);

        var $link = $(this).find('a');
        var titles = $link.text().split('/');
        var name = titles[titles.length - 1];
        $link.data({name: name, update: $em.text()});
        titles[titles.length] = $link;
        aryEach(titles, dictionary);
    });

    dictionary = objectSort(dictionary);
    
    var html = '';
    var hashEach = function(key, dic) {
        if (dic[key].data) {
            html += '<li>';
            html += '<a class="ex-target collapsible collapsed" href="' + dic[key].data.attr('href') + '">' + dic[key].data.data('name') + '</a>';
            html += '<span class="author">' + dic[key].data.data('update') + '</span>';
            html += '<a href="' + dic[key].data.attr('href') + '" target="_blank"><img src="/images/bullet_go.png" style="vertical-align:text-bottom;"></a>';
            html += '</li>';
        } else {
            html += '<li class=""><a class="ex-parent collapsible">' + key + '</a></li>';
        }
        for (var i in dic[key].list) {
            html += '<li><ul>';
            hashEach(i, dic[key].list);
        }
        html += '</ul></li>';
    };
    
    for (var i in dictionary) {
        html += '<ul>';
        hashEach(i, dictionary);
        html += '</ul>';
    }

    $('#content > h4').remove();
    $('#content > p').remove();

    $('#content').on('click', '.ex-parent', function(e) {
        $(this).parent().siblings().toggle('fast');
        $(this).toggleClass('collapsed');
    });

    $('#content').on('click', '.ex-target', function(e) {
        var self = this;
        var $exContent = $(self).parent().find('.attachments');
        if ($exContent.size()) {
            $exContent.toggle('fast');
            $(self).toggleClass('collapsed');
        } else {
            $.ajax({
                url: this.href,
                timeout: 3000,
                success: function(data) {
                    var $innerIssue = $(data).find('#content').removeAttr('id').addClass('ex-content').find('.attachments').css('display', 'none');
                    if (!$innerIssue.size()) {
                        $innerIssue = $('<div class="attachments" style="display:none;">添付ファイルはありません</div>');
                    } else {
                        $innerIssue.find('.delete').remove();
                        $innerIssue.find('p').each(function() {
                            this.innerHTML = this.innerHTML.replace(/<\/a>[\s\S]+?<span/gm, '</a><span');
                        });
                    }
                    var $li = $('<li/>');
                    var $ul = $('<ul/>');
                    $li.append($innerIssue);
                    $ul.append($li);
                    $(self).parent().append($ul);
                    $(self).toggleClass('collapsed');
                    $innerIssue.show('fast');
                }
            });
        }
        return false;
    });

    $(html).insertAfter($('#content > h3'));
    $('.ex-parent').click();

    var $openAll = $('<a class="icon icon-zoom-in">すべて展開</a>');
    $openAll.on('click', function() {
        if ($(this).hasClass('icon-zoom-in')) {
            $('.ex-parent').parent().siblings().show('fast');
            $('.ex-parent').removeClass('collapsed');
            $openAll.toggleClass('icon-zoom-in');
            $openAll.toggleClass('icon-zoom-out');
            $openAll.text('すべて畳む');
            $('.ex-target').each(function() {
                if ($(this).siblings().find('.attachments').size()) {
                    $(this).siblings().find('.attachments').show('fast');
                    $(this).removeClass('collapsed');
                }
            });
        } else {
            $('.ex-parent').parent().siblings().hide('fast');
            $('.ex-parent').addClass('collapsed');
            $openAll.toggleClass('icon-zoom-in');
            $openAll.toggleClass('icon-zoom-out');
            $openAll.text('すべて展開');
            $('.ex-target').each(function() {
                if ($(this).siblings().find('.attachments').size()) {
                    $(this).siblings().find('.attachments').hide('fast');
                    $(this).addClass('collapsed');
                }
            });
        }
    });
    $('.contextual').prepend($openAll);

})();
