// ==UserScript==
// @name         GitHubのdiff表示を折りたたむ
// @namespace    https://github.com/hosoyama-mediba/userscript/
// @version      0.5
// @description  差分比較の領域を折り畳むトグルボタンと個別にON/OFF可能なチェックボックスを追加します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://github.com/*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// ==/UserScript==

(function($) {
    setInterval(function() {
        if ((!location.pathname.match(/files$/) && !location.pathname.match(/commit\/[0-9a-zA-Z]+?$/)) || $('.folding-button').size()) {
            return;
        }
        var toggleButton, folding, $foldingCheckbox;

        folding = false;

        $toggleButton = $('<a href="#" class="btn btn-sm folding-button">Folding</a>');
        $('#toc .btn-group').append($toggleButton);

        $toggleButton.on('click', function(e) {
            if (folding = !folding) {
                $(this).addClass('selected')
                $('.file .data.highlight').hide();
                $('.file .render-wrapper').hide();
            } else {
                $(this).removeClass('selected')
                $('.file .data.highlight').show();
                $('.file .render-wrapper').show();
            }
            $('.file .show-file-datas input[type="checkbox"]').prop('checked', folding);
            return false;
        });

        $foldingCheckbox = $('<span class="show-file-datas" style="display: inline-block;-webkit-user-select: none;-moz-user-select: none;user-select: none;margin-right:10px;"><label><input type="checkbox"> Hide Lines </label></span>');
        $('.file-header .file-actions').prepend($foldingCheckbox);
        $('.show-file-datas input[type="checkbox"]').on('click', function(e) {
            $parent = $(this).parent().parent().parent().parent().parent();
            if ($(this).prop('checked')) {
                $parent.find('.data.highlight').hide();
                $parent.find('.render-wrapper').hide();
            } else {
                $parent.find('.data.highlight').show();
                $parent.find('.render-wrapper').show();
            }
            $parent = null;
        });
    }, 500);
})(jQuery.noConflict(true));
