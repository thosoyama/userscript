// ==UserScript==
// @name        日報入力
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.3
// @description 日報入力をちょっとだけ楽にするやつ
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://mediba-pjtweb01/ip_web/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// ==/UserScript==

(function($) {

    // ====================================================
    // プロジェクトコード
    // ====================================================
    var pno = ['MP', '00000633', '001'];

    // ====================================================
    // トップ
    // ====================================================
    if (location.pathname.match(/^\/ip_web\/$/)) {
        window.openWindow1 = function() {
            location.href = '/ip_web/scripts/MN000000.aspx';
        }
    }

    // ====================================================
    // メニュー
    // ====================================================
    if (location.pathname.match(/MN010215/)) {
        $('#btnNippou').click();
    }

    // ====================================================
    // 日報一覧
    // ====================================================
    if (location.pathname.match(/NP010215/)) {
    }

    // ====================================================
    // 日報入力
    // ====================================================
    if (location.pathname.match(/NP010320/)) {
        if (!$('#txtKaishiJikan').val().length) {
            $('#btnSetKinmuJikan').click();
        } else {
            var $syuryoJikan = $('#txtShuryoJikan');
            if ($syuryoJikan.val() === '17:30') {
                $syuryoJikan.val('18:30');
                $('#btnCalcJitsudouJikan').click();
                return;
            }
            var sagyoJikan = $('.MeisaiBgColor').text().match(/実働時間\s+：\s+(\d+:\d+)/)[1];
            $('#txtSagyoJikan').val(sagyoJikan);
            $('#txtProNo1').val(pno[0]);
            $('#txtProNo2').val(pno[1]);
            $('#txtProEdaNo').val(pno[2]);
            
            var $btnLink = $('.BtnLink');
            if ($btnLink.size() === 2) {
                var addSagyoJikan = $btnLink.parent().parent().find('td').get(2).innerText.trim();
                if (parseInt(sagyoJikan, 10) === parseInt(addSagyoJikan, 10)) {
                    if (!$('#btnSakujo').size()) {
                        $('#btnTouroku').click();
                    }
                } else {
                    $btnLink.get(1).click();
                }
            }
        }
    }

    // ====================================================
    // 入力確認
    // ====================================================
    if (location.pathname.match(/NP010430/)) {
        $('#btnOK').click();
        return;
    }

    // ====================================================
    // ログアウト
    // ====================================================
    if (location.pathname.match(/MN88888/)) {
        location.href = '/ip_web/';
    }

})(jQuery.noConflict(true));
