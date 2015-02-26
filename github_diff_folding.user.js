// ==UserScript==
// @name         GitHubのdiff表示を折りたたむ
// @namespace    https://github.com/hosoyama-mediba/userscript/
// @version      0.1
// @description  差分比較の領域を折り畳むトグルボタンと個別にON/OFF可能なチェックボックスを追加します
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    setInterval(function() {
        if (!location.pathname.match(/files$/) || $('.folding-button').size()) {
            return;
        }
        var toggleButton, folding, $foldingCheckbox;

        folding = false;

        $toggleButton = $('<a href="#" class="folding-button minibutton">Folding</a>');
        $('#diff #toc .button-group').append($toggleButton);

        $toggleButton.on('click', function(e) {
            if (folding = !folding) {
                $(this).addClass('selected')
                $('.diff-table').hide();
            } else {
                $(this).removeClass('selected')
                $('.diff-table').show();
            }
            $('#diff .show-file-datas input[type="checkbox"]').prop('checked', folding);
            return false;
        });

        $foldingCheckbox = $('<span class="show-file-datas" style="display: inline-block;-webkit-user-select: none;-moz-user-select: none;user-select: none;margin-right:10px;"><label><input type="checkbox"> Hide Lines </label></span>');
        $('#diff .file-header .file-actions').prepend($foldingCheckbox);
        $('#diff .show-file-datas input[type="checkbox"]').on('click', function(e) {
            if ($(this).prop('checked')) {
                $(this).parent().parent().parent().parent().parent().find('.diff-table').hide();
            } else {
                $(this).parent().parent().parent().parent().parent().find('.diff-table').show();
            }
        });
    }, 500);
})();
