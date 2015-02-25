// ==UserScript==
// @name         GitHubリキッドレイアウト
// @namespace    https://github.com/hosoyama-mediba/userscript/
// @version      0.1
// @description  GitHubを横幅固定からリキッドレイアウトにします
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(function() {
    $('.wrapper').css({padding: '0 15px'});
    $('.container').css({width: '100%'});
    $('#js-repo-pjax-container').css({width: '100%', paddingRight: '38px'});
    $('.full-word').hide();
    $('.only-with-full-nav').hide();
    $('.repository-sidebar').css({position: 'absolute', right:'0', width: '38px'});

    var intervalTimer = setInterval(function() {
        if ((location.pathname.match(/\//g)||[]).length && $('.counter').size()) {
            $('.repository-sidebar .counter').hide();
        }
        var w = $('#discussion_bucket').width() - $('.discussion-sidebar').width() - 15;
        $('.discussion-timeline').css({width: '' + w + 'px'});
        $('.timeline-new-comment , .inline-comments , .inline-comment-form , .inline-comments , .inline-comment-form-container , .comment-holder').css({maxWidth: '100%'});
    }, 300);
})();
