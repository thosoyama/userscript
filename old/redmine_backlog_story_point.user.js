// ==UserScript==
// @name        Redmine:マスターバックログのストーリーポイント集計
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.12
// @description バックログに制作のポイント・開発のポイント・その他のポイント・終了したポイントを追加します
//              小室さんのブックマークレットを勝手に改変
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://au-project.mediba.local/rb/master_backlog/dolphin
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// ==/UserScript==

(function($) {
    var distributor = {
        selector: {
            backlog: '#backlogs_container div.backlog',
            sprint:  'div.header div.name',
            stories: 'ul.stories li',
            id:      'div.id div.v',
            subject: 'div.subject',
            point:   'div.story_points div.t',
            closed:  'ul.stories li.closed',
            header:  'div.header',
            velocity:'div.header div.velocity',
            menu:    'div.menu .items a'
        },
        select: function(name, context){
            var selector = this.selector[name];
            return context ? $(selector, context) : $(selector);
        },
        style: function(){
            return (function () {/*
                #backlogs_container div.backlog ul.stories li.story-seisaku {
                    background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#FAE0E7));
                    background: -moz-linear-gradient(top, #EEE, #FAE0E7);
                    filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#FAE0E7);
                    background-color: #FAE0E7;
                }
                #backlogs_container div.backlog ul.stories li.story-kaihatsu {
                    background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#E0E7FA));
                    background: -moz-linear-gradient(top, #EEE, #E0E7FA);
                    filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#E0E7FA);
                    background-color: #E0E7FA;
                }
                #backlogs_container div.backlog ul.stories li.story-separator {
                    background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#ccc));
                    background: -moz-linear-gradient(top, #EEE, #ccc);
                    filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#ccc);
                    background-color: #ccc;
                }
                #backlogs_container div.backlog ul.stories li.story-separator .subject {
                    padding: 0;
                    min-height: 28px;
                    line-height: 28px;
                }
                #backlogs_container div.backlog ul.stories li:hover {
                    background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#FFF));
                    background: -moz-linear-gradient(top, #EEE, #FFF);
                    filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#FFFFFF);
                    background-color: #FFF;
                }
                .ex-points {
                    line-height: 30px;
                    text-align: right;
                    padding-right: 2px;
                }
                .ex-copy-btn {
                    display:block;
                    float: left;
                    margin: 7px 0 0 3px;
                    padding: 0;
                    width:45px;
                    line-height:14px;
                    font-size:10px;
                    text-align:center;
                    color: #CC0000;
                    background-color:#CCC;
                    background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#CCC));
                    background: -moz-linear-gradient(top, #EEE, #CCC);
                    text-decoration:none;
                    -moz-border-radius:4px;
                    -webkit-border-radius:4px;
                    border-radius:4px;
                    border: 1px solid #AAAAAA
                }
                .ex-copy-btn-hover {
                    background-color:#BBB;
                    background: -webkit-gradient(linear, left top, left bottom, from(#DDD), to(#BBB));
                    background: -moz-linear-gradient(top, #DDD, #BBB);
                }
                #product_backlog_container .header .close_sprint {
                    width: auto !important;
                }
                .header .fff-right {
                    width: 238px !important;
                    margin-left: -238px !important;
                }
                .ex-separator-subject {
                    margin: 0;
                    text-align: center;
                }
            */}).toString().replace(/(\n)/g, '').split('*')[1];
        },
        init: function(){
            var $style = $('<style/>').attr({type: 'text/css', id: 'my-style-added'});
            $style.text(this.style());
            $('head').append($style).append($('<script/>').attr({src: 'http://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.5/ZeroClipboard.min.js'}));
        },
        run: function(){
            this.select('stories').removeClass('story-seisaku story-kaihatsu story-separator');
            var $backlogs = this.select('backlog'),
                $backlog,
                i,
                l;

            for (i = 0, l = $backlogs.length; i < l; i++) {
                $backlog = $($backlogs.get(i));
                if ($backlog.length !== 1) {
                    return;
                }
                this.color($backlog);
                this.popPoints($backlog);
                this.copyButton($backlog);
                /* this.reset($backlog); */
            }
        },
        story: function($backlog, end, isSeparator){
            var that = this,
                off = (end.length + 1) * -1,
                regexp = new RegExp((isSeparator ? '' : '/[ 　]*') + end + '$');
            return this.select('stories', $backlog).filter(function(){
                //return that.select('subject', this).text().trim().slice(off) === '/' + end;
                return that.select('subject', this).text().trim().match(regexp);
            });
        },
        color: function($backlog){
            this.story($backlog, '制作').addClass('story-seisaku');
            this.story($backlog, '開発').addClass('story-kaihatsu');
            this.separator(this.story($backlog, '■■■■', true));
        },
        separator: function($story){
            $story.addClass('story-separator');
            $story.find('.subject').addClass('ex-separator-subject');
            $story.find('.fff-left').hide();
            $story.find('.fff-right').hide();
        },
        popPoints: function($backlog){
            var all      = this.point(this.select('stories', $backlog)),
                closed   = this.point(this.select('closed', $backlog)),
                seisaku  = this.point(this.story($backlog, '制作')),
                kaihatsu = this.point(this.story($backlog, '開発')),
                txt      = '',
                that     = this;
            
            setTimeout(function() {
                that.select('velocity', $backlog).text(closed.toFixed(1) + '/' + all.toFixed(1));
            }, 500);

            txt += '<span style="margin-left:15px;">制作:' + seisaku.toFixed(1);
            txt += '<span style="margin-left:15px;">開発:' + kaihatsu.toFixed(1) + '</span>';
            txt += '<span style="margin-left:15px;">その他:' + (all - seisaku - kaihatsu).toFixed(1) + '</span>';

            this.select('header', $backlog).after($('<div class="header"><div class="ex-points">' + txt + '</div></div>'));
        },
        copyButton: function($backlog) {
            if (!navigator.mimeTypes['application/x-shockwave-flash']) {
                return;
            }
            var that  = this,
                timer = setInterval(function() {
                if (typeof ZeroClipboard !== 'function') {
                    return;
                }
                var clip, $button = $('<button class="ex-copy-btn" data-clipboard-text="">コピー</button>');
                $('.ex-points', $backlog).before($button);
                $button.hover(
                    function() {
                        $(this).addClass('ex-copy-btn-hover')
                    }, function() {
                        $(this).removeClass('ex-copy-btn-hover')
                    }
                );
                clip = new ZeroClipboard($button.get(0));
                clip.on('ready', function() {
                    clip.on("beforecopy", function() {
                        var copyText = '';
                        that.select('stories', $backlog).each(function() {
                            var id    = that.select('id', $(this)).text(),
                                point = that.select('point', $(this)).text(),
                                title = that.select('subject', $(this)).text();
                            copyText += '#' + id.trim() + ' ' + (!point.trim().length ? 'x.x' : point.trim()) + 'pt ' + title.trim() + '\n';
                        });
                        $button.get(0).dataset.clipboardText = copyText;
                        copyText && alert('クリップボードにコピーしました\n\n' + copyText);
                    });
                });
                clearInterval(timer);
            }, 300);
        },
        point: function($stories){
            var point = 0.0,
                that = this;
            $stories.each(function(){
                var p = parseFloat(that.select('point', this).text());
                if (!isNaN(p)) {
                    point += p;
                }
            });
            return point;
        },
        reset: function($backlog){
            var $stories = this.select('stories', $backlog);
            setTimeout(function(){
                $stories.removeClass('story-seisaku story-kaihatsu');
            }, 20000);
        }
    };
    distributor.init();
    try {
        distributor.run();
    } catch (msg) {
       msg && console.error(msg);
    }
})(jQuery.noConflict(true));
