// ==UserScript==
// @name        Talknote検索ブックマーク
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.6
// @description Talknoteの左メニューに検索ワードのリンクを追加します
// @include     https://company.talknote.com/mediba.jp/*
// @exclude
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant       none
// ==/UserScript==

(function() {
    if ($('.thashtag-links').size()) {
        return;
    }
    var $style = $('<style/>').text((function () {/*
        .thashtag-link {
            position: relative;
        }
        .thashtag-form__span {
            line-height: 1;
            height: 27px;
            display: block;
            background: url(/images/navi_bg170x27.png) 0 0 no-repeat;
            background-position: 0 0;
            padding: 0 8px;
            font-weight: bold;
            font-size: 12px;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
        }
        .thashtag-form__text {
            width: 100px;
        }
        .thashtag-form__add {
            position: absolute;
            right: 0;
            margin-right: 8px;
            line-height: 20px;
        }
        .thashtag-form__add:hover {
            text-decoration: underline;
        }
        .thashtag-form__del {
            position: absolute;
            right: 0;
            margin-right: 8px;
        }
        .thashtag-form__del:hover {
            font-weight: bold;
            color: #f66;
            text-decoration: underline;
        }

    */}).toString().split('*')[1]);

    var $script = $('<script/>').text((function () {/*
        window.tHashTagCallBack = function(response) {
            var words, $fragment, createNewLink, setting, i, l, urlPrefix = '/mediba.jp/search?keyword=';

            $.cookie.json = true;

            words = response || [
                '#あさかい報告',
                '#スプリントレビュー',
                '#アルファ',
                '#ベータ',
                '#お悩み'
            ];

            createNewLink = function(word, necessary) {
                var $link = $('<a/>').attr({href: urlPrefix + encodeURIComponent(word), title: word, class: 'thashtag-link'}).html(word);
                if (!necessary) {
                    var $deleteButton = $('<span class="thashtag-form__del" data-key="' + word + '" title="削除">✕</span>');
                    $deleteButton.on('click', function() {
                        var setting = $.cookie('thashtag') || {};
                        delete setting[$(this).data('key')];
                        $.cookie('thashtag', setting, {path: '/', expires: 365});
                        $(this).parent().remove();
                        return false;
                    });
                    $link.append($deleteButton);
                }
                return $link;
            };

            $fragment = $(document.createDocumentFragment());
            for (i = 0, l = words.length; i < l; i++) {
                $fragment.append(createNewLink(words[i], true));
            }
            setting = $.cookie('thashtag') || {};
            for (i in setting) {
                $fragment.append(createNewLink(i));
            }

            $('.left_menu').append($('<li><a>検索ブックマーク</a><ul><li class="thashtag-links"></li></ul></li>'));
            $('.thashtag-links').append($fragment);

            $('.left_menu > li:last-child').append('<ul><li class="thashtag-form"><span class="thashtag-form__span"><input type="text" class="thashtag-form__text"><button class="thashtag-form__add">追加</button></span></li></ul>');
            $('.thashtag-form__text').keypress(function(e) {
                if (e.which === 13) {
                    return $('.thashtag-form__add').click();
                }
            });
            $('.thashtag-form__add').on('click', function() {
                var value = $('.thashtag-form__text').val().trim();
                if (!value.length) {
                    return false;
                }
                var setting = $.cookie('thashtag') || {};
                if (value in setting || $.inArray(value, words) >= 0) {
                    alert('「' + value + '」は既に登録済です');
                    return false;
                }
                setting[value] = 1;
                $.cookie('thashtag', setting, {path: '/', expires: 365});
                $('.thashtag-links').append(createNewLink(value));
                $('.thashtag-form__text').val('');
                return false;
            });
        };
    */}).toString().replace(/(\n)/g, '').split('*')[1]);

    $('head')
        .append($style)
        .append($script)
        .append($('<script src="https://alpha.mdev.auone.jp/jenkins/userContent/thashtag.jsonp"/>'));
})();
