// ==UserScript==
// @name         TalknoteIcon
// @namespace    https://github.com/hosoyama-mediba/userscript
// @version      0.20
// @description  Talknoteのサイドメニューにアイコンを表示する
// @author       Terunobu Hosoyama <hosoyama@mediba.jp>
// @match        https://company.talknote.com/mediba.jp/*
// @match        https://*.company.talknote.com/mediba.jp/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

$(() => {
    // CSS
    var styels = `
        #left_nav {
            width: 257px !important;
        }
        .left_link_unread {
            position: absolute;
            right: 10px;
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

    var groups = [];
    var msg = [];
    var userId = MasterDataHolder.user.user_id;

    // APIからグループの情報を取得してアイコンを埋める
    function addLeftMenuGroupIcon() {
        var $img = $('<img>').addClass('ex-tgi-left-icon').attr({
            src: 'data:image/vnd.microsoft.icon;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAWGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/wYJFP8ECBL/BAgS/wQIEv8ECBL/BAgS/wQIEv8UGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/w0QGv8ECBL/BAgS/wQIEv8ECBL/BAgS/wQIEv8NEBr/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8GCRT/BAgS/wQIEv8ECBL/BAgS/wQIEv8ECBL/FBgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/GRwl/1pcY/9fYWj/X2Fo/19haP9fYWj/X2Fo/1tdZP8bHij/ExYg/xYYIv8WGCL/Fhgi/xYYIv8WGCL/EBMe/zo9Rf9fYWj/X2Fo/19haP9fYWj/X2Fo/19haP86PUX/EBMe/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xseKP9bXWT/X2Fo/19haP9fYWj/X2Fo/19haP9aXGP/GRwl/xMWIP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/IiUu//////////////////////////////////////8qLTb/DRAc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/AgYQ/5KUmP////////////////////////////////+SlJj/AgYQ/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DRAc/yotNv//////////////////////////////////////IiUu/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/w8fH////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Dx8f8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4qMkP////////////////////////////////+KjJD/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygrNP/v7/D////////////////////////////v7/D/ICMs/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////Lz8/8oLDT/DhEc/xYYIv8WGCL/Fhgi/xYYIv8WGCL/BAcS/4iKjv////////////////////////////////+Iio7/BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/DhEc/ygsNP/y8/P////////////////////////////w8fH/IiUu/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////////83OUH/Cw4Y/xYYIv8WGCL/Fhgi/xYYIv8WGCL/AgUP/6Gipv////////////////////////////////+hoqb/AgUP/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Cg0Y/zk7RP/////////////////////////////////r6+z/HyIr/xATHv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P////////////////////////////////+Cg4n/AAAK/xYYIv8WGCL/Fhgi/xYYIv8NEBr/GBsl/+Tl5v/////////////////////////////////k5eb/GBsl/w0QGv8WGCL/Fhgi/xYYIv8WGCL/AAAK/4aHjf/////////////////////////////////T1Nb/EhUf/xIVH/8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P/////////////////////////////////z9fX/RUhQ/wAACv8KDRj/DRAc/wQHEv8EBxL/pqer////////////////////////////////////////////pqer/wYJFP8GCRT/DRAc/woNGP8AAAr/RUhQ//P19f////////////////////////////////+qrK//BAcS/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////9vb3/4SFiv85O0T/LS84/1FTW/+/wML//////////////////////////////////////////////////////7/Awv9RU1v/LS84/zk7RP+EhYr/9vb3//////////////////////////////////////9jZWv/BgkU/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////+fn5////////////////////////////////////////////////////////////////////////////+fn5/////////////////////////////////////////////////+fn5/8YGyX/ERQe/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////21vdf8CBhD/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////urq+/wgLFv8TFiD/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MzMz/GBsl/w0QHP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+/v8P//////////////////////////////////////////////////////////////////////////////////////9fX2/1tdZP9bXWT/9fX2/////////////////////////////////////////////////////////////////7W2uf8ZHCb/Cg0Y/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs//P19f////////////////////////////////////////////////////////////////////////////////+xsrb/MzY+/wIGEP8CBhD/MzY+/7Gytv/////////////////////////////////////////////////j4+X/b3F3/wgMFv8NEBr/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8QEx7/ICMs/+Pj5f/y8/P/8vPz//Lz8//y8/P/8vPz/+Pj5f9zdXv/pqer/9bX2f/v7/D/8vPz/+fn5//Gx8r/jY6T/z9CSv8GChX/Cg0Y/xYYIv8WGCL/Cg0Y/wYKFf8/Qkr/jY6T/8bHyv/n5+f/8vPz/+/v8P/W19n/ra6y/2Vnbv8bHij/AgYQ/xMWIP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/yImLv8kJzD/JCcw/yQnMP8kJzD/JCcw/yQnMP8ICxb/BAcS/xYYIv8iJS7/IiUu/x0gKv8NEBr/AgYQ/woNGP8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8KDRj/AgYQ/w0QGv8dICr/JCcw/yQnMP8WGCL/BgkU/wYJFP8RFB7/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xATHv8QEx7/EBMe/xATHv8QEx7/EBMe/xATHv8WGCL/Fhgi/xIVH/8SFR//EhUf/xIVH/8SFR//Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8RFB7/ERQe/xEUHv8RFB7/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8WGCL/Fhgi/xYYIv8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
        });
        var $a = $('#left_menu_timeline').find('.left_link > a');
        if (!$a.find('img').length) {
            $('#left_menu_timeline').find('.left_link > a').prepend($img);
        }

        $.each(groups, (i, item) => {
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
    }

    // APIからメッセージの情報を取得してアイコンを埋める
    function addLeftMenuDMIcon() {
        console.log('addLeftMenuDMIcon');
        $.each(msg, (i, item) => {
            $('#left_dm_list > li').each((j, dmElement) => {
                var dmId = item.dm_id;
                if (!dmId || !dmElement.id.match(/^dm_left_(\d+)$/) || item.dm_id !== Number(RegExp.$1)) {
                    return;
                }

                var $el = $(dmElement).find('#dm_left_link_' + dmId + ' .left_link_txt');
                var $icon = $('<img>').attr('src', item.icon_url_m).addClass('ex-tgi-left-icon');
                var $target = $el.parent();


                setTimeout(() => {
                    if ($target.find('.ex-tgi-left-icon').length) {
                        return;
                    }
                    $target.prepend($icon);
                }, 100);

                return false;
            });
        });
    }

    // メッセージリストのアイテム更新時にアイコンを埋める
    function addMessageIcon(id, node) {
        console.log('addMessageIcon',id, node);
        if (!msg.length) {
            return;
        }

        var item = $.grep(msg, (i) => {
            return i.dm_id === Number(id) || i.id === Number(id);
        })[0];

        if (!item) {
            return;
        }

        var $icon = $('<img>').attr('src', item.icon_url_m).addClass('ex-tgi-left-icon');
        var $target = $(node).find('.left_link a');

        if (node.className === 'active') {
            setTimeout(() => {
                var $target = $('#dm_left_' + id).find('.left_link a');
                if ($target.find('.ex-tgi-left-icon').size()) {
                    return;
                }
                $target.prepend($icon);
            }, 300);
        } else {
            $target.prepend($icon);
        }
    }

    // DOMの挿入を監視
    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            var target = mutation.target;
            if (mutation.target.id && mutation.target.id.match(/^dm_left_(\d+)$/)) {
                addLeftMenuDMIcon();
                return;
            }
            for (var i = 0, l = mutation.addedNodes.length; i < l; i++) {
                var node = mutation.addedNodes[i];
                if (!node.id) {
                    return;
                }
                if (node.id === 'left_menu_timeline') {
                    addLeftMenuGroupIcon();
                    addLeftMenuDMIcon();
                }
                if (node.id.match(/^dm_left_(\d+)$/)) {
                    addMessageIcon(RegExp.$1, node);
                }
            }
        });
    });

    function getDataAsync(db, storeName) {
        return new Promise((resolve, reject) => {
            try {
                var transaction = db.transaction([storeName], 'readwrite');
                var store = transaction.objectStore(storeName);
                var request = store.get('data');
                request.onsuccess = (event) => {
                    if (!event.target.result) {
                        reject();
                        return;
                    }
                    resolve(event.target.result.models);
                };
            } catch(e) {
                reject(storeName);
            }
        });
    }

    function getInfo() {
        return new Promise((resolve, reject) => {
            var openRequest = indexedDB.open('Talknote-WebApp');
            openRequest.onsuccess = (event) => {
                var db = event.target.result;

                // Todo:初回アクセスは非対応
                if (!db.objectStoreNames.length) {
                    db.close();
                    resolve();
                    return;
                }

                // 2回目以降のアクセスでIndexedDBを見に行く
                Promise.all([
                    getDataAsync(db, `Session-${userId}-Group`).then((data) => { groups = data; }),
                    getDataAsync(db, `Session-${userId}-DmThread`).then((data) => { msg = data; }),
                ]).then(() => {
                    db.close();
                    resolve();
                }).catch((reject) => {
                    db.close();
                    console.log('IndexedDBから取得失敗:再読込してね');
                    reject();
                });
            };
        });
    }

    getInfo().then(() => {
        observer.observe(document, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
        });
    });
});
