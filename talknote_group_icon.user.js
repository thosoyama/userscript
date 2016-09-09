// ==UserScript==
// @name         TalknoteGroupIcon
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.6
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
            position: absolute;
            right: 0;
        }
        .left_link > a {
            position: relative;
        }
        .left_link > a > .left_link_txt {
            position: absolute;
            left: 25px;
        }
        .ex-tgi-left-icon {
            width: 20px;
            height: 20px;
            border-radius: 20px;
            margin-top: -1px;
        }
    `;
    $('<style/>').text(styels).appendTo($('head'));

    // APIからグループの情報を取得してアイコンを埋める
    function addLeftMenuGroupIcon() {
        $.ajax({
            url: 'https://company.talknote.com/mediba.jp/ajax/group/list'
        }).done(function(json) {
            var $img = $('<img>').addClass('ex-tgi-left-icon').attr({
                src: 'data:image/vnd.microsoft.icon;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAWGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/wYJFP8ECBL/BAgS/wQIEv8ECBL/BAgS/wQIEv8UGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/w0QGv8ECBL/BAgS/wQIEv8ECBL/BAgS/wQIEv8NEBr/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8GCRT/BAgS/wQIEv8ECBL/BAgS/wQIEv8ECBL/FBgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/GRwl/1pcY/9fYWj/X2Fo/19haP9fYWj/X2Fo/1tdZP8bHij/ExYg/xYYIv8WGCL/Fhgi/xYYIv8WGCL/EBMe/zo9Rf9fYWj/X2Fo/19haP9fYWj/X2Fo/19haP86PUX/EBMe/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xseKP9bXWT/X2Fo/19haP9fYWj/X2Fo/19haP9aXGP/GRwl/xMWIP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/IiUu//////////////////////////////////////8qLTb/DRAc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/AgYQ/5KUmP////////////////////////////////+SlJj/AgYQ/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DRAc/yotNv//////////////////////////////////////IiUu/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygrNP/v7/D////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Lz8/8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4iKjv////////////////////////////////+Iio7/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/y8/P////////////////////////////w8fH/IiUu/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////////83OUH/Cw4Y/xYYIv8WGCL/Fhgi/xYYIv8WGCL/AgUP/6Gipv////////////////////////////////+hoqb/AgUP/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Cg0Y/zk7RP/////////////////////////////////r6+z/HyIr/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////////+Cg4n/AAAK/xYYIv8WGCL/Fhgi/xYYIv8NEBr/GBsl/+Tl5v/////////////////////////////////k5eb/GBsl/w0QGv8WGCL/Fhgi/xYYIv8WGCL/AAAK/4aHjf/////////////////////////////////T1Nb/EhUf/xIVH/8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P/////////////////////////////////z9fX/RUhQ/wAACv8KDRj/DRAc/wQHEv8EBxL/pqer////////////////////////////////////////////pqer/wYJFP8GCRT/DRAc/woNGP8AAAr/RUhQ//P19f////////////////////////////////+qrK//BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////9vb3/4SFiv85O0T/LS84/1FTW/+/wML//////////////////////////////////////////////////////7/Awv9RU1v/LS84/zk7RP+EhYr/9vb3//////////////////////////////////////9jZWv/BgkU/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////+fn5////////////////////////////////////////////////////////////////////////////+fn5/////////////////////////////////////////////////+fn5/8YGyX/ERQe/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////21vdf8CBhD/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////urq+/wgLFv8TFiD/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MzMz/GBsl/w0QHP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////////////////////////////////////9fX2/1tdZP9bXWT/9fX2/////////////////////////////////////////////////////////////////7W2uf8ZHCb/Cg0Y/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs//P19f////////////////////////////////////////////////////////////////////////////////+xsrb/MzY+/wIGEP8CBhD/MzY+/7Gytv/////////////////////////////////////////////////j4+X/b3F3/wgMFv8NEBr/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+Pj5f/y8/P/8vPz//Lz8//y8/P/8vPz/+Pj5f9zdXv/pqer/9bX2f/v7/D/8vPz/+fn5//Gx8r/jY6T/z9CSv8GChX/Cg0Y/xYYIv8WGCL/Cg0Y/wYKFf8/Qkr/jY6T/8bHyv/n5+f/8vPz/+/v8P/W19n/ra6y/2Vnbv8bHij/AgYQ/xMWIP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/yImLv8kJzD/JCcw/yQnMP8kJzD/JCcw/yQnMP8ICxb/BAcS/xYYIv8iJS7/IiUu/x0gKv8NEBr/AgYQ/woNGP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8KDRj/AgYQ/w0QGv8dICr/JCcw/yQnMP8WGCL/BgkU/wYJFP8RFB7/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xATHv8QEx7/EBMe/xATHv8QEx7/EBMe/xATHv8WGCL/Fhgi/xIVH/8SFR//EhUf/xIVH/8SFR//Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8RFB7/ERQe/xEUHv8RFB7/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
            });
            $('#left_menu_timeline').find('.left_link > a').prepend($img);

            $.each(json.data.groups, function(i, item) {
                $('#left_group_list > li').each(function(j, groupElement) {
                    if (!groupElement.id.match(/^g_left_(\d+)$/)) {
                        return;
                    }
                    if (item.group_id !== Number(RegExp.$1)) {
                        return;
                    }

                    var $el = $(groupElement).find('#g_left_link_' + item.group_id + ' .left_link_txt');
                    var $icon = $('<img>').attr('src', item.g_file_name_40).addClass('ex-tgi-left-icon');
                    if ($el.parent().find('.ex-tgi-left-icon').size()) {
                        return;
                    }

                    $el.parent().prepend($icon);

                    return false;
                });
            });
        });
    }

    // APIからメッセージの情報を取得してアイコンを埋める
    var dm = null;
    function addLeftMenuDMIcon() {
        setTimeout(function() {
            if (dm) {
                _addDMIcon(dm);
                return;
            }
            $.ajax({
                url: 'https://company.talknote.com/mediba.jp/ajax/dm/threads?fetch_unread=1&fetch_last_feed=1&limit=150&padding=1&hold=true&_context=api&include_hidden=1&include_request=1&fields%5B%5D=last_feed_content&include_invite_count=true'
            }).done(function(data) {
                dm = data;
                _addDMIcon(dm);
            });
        }, 1);
    }
    function _addDMIcon(data) {
        $.each(data.data.msg, function(i, item) {
            $('#left_dm_list > li').each(function(j, dmElement) {
                if (!dmElement.id.match(/^dm_left_(\d+)$/)) {
                    return;
                }
                if (item.id !== Number(RegExp.$1)) {
                    return;
                }

                var $el = $(dmElement).find('#dm_left_link_' + item.id + ' .left_link_txt');
                var $icon = $('<img>').attr('src', item.icon_url_m).addClass('ex-tgi-left-icon');
                if ($el.parent().find('.ex-tgi-left-icon').size()) {
                    return;
                }

                $el.parent().prepend($icon);

                return false;
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
                if (node.id && node.id === $('#left_dm_list').children().last().attr('id')) {
                    addLeftMenuDMIcon();
                }
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})(jQuery.noConflict(true));
