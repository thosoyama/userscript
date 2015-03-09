// ==UserScript==
// @name        Redmine:マスターバックログのストーリーポイント集計
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.4
// @description バックログに制作のポイント・開発のポイント・その他のポイント・終了したポイントを追加します
//              小室さんのブックマークレットを勝手に改変
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://au-project.mediba.local/rb/master_backlog/dolphin
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant       none
// ==/UserScript==

(function() {
    var distributor = {
        selector: {
            backlog: '#backlogs_container div.backlog',
            sprint:  'div.header div.name',
            stories: 'ul.stories li',
            subject: 'div.subject',
            point:   'div.story_points div.t',
            closed:  'ul.stories li.closed',
            header:  'div.header',
            velocoty:'div.header div.velocity.story_tooltip'
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
                .ex-points {
                    line-height: 30px;
                    text-align: right;
                    padding-right: 2px;
                }
                #product_backlog_container .header .close_sprint {
                    width: auto;
                }
            */}).toString().replace(/(\n)/g, '').split('*')[1];
        },
        init: function(){
            if ($('#my-style-added').length) {
                return;
            }
            var $style = $('<style/>').attr({type: 'text/css', id: 'my-style-added'});
            $style.text(this.style());
            $('head').append($style);
        },
        run: function(){
            this.select('stories').removeClass('story-seisaku story-kaihatsu');
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
                /* this.reset($backlog); */
            }
        },
        story: function($backlog, end){
            var that = this,
                off = (end.length + 1) * -1,
                regexp = new RegExp('/[ 　]*' + end + '$');
            return this.select('stories', $backlog).filter(function(){
                //return that.select('subject', this).text().trim().slice(off) === '/' + end;
                return that.select('subject', this).text().trim().match(regexp);
            });
        },
        color: function($backlog){
            this.story($backlog, '制作').addClass('story-seisaku');
            this.story($backlog, '開発').addClass('story-kaihatsu');
        },
        popPoints: function($backlog){
            var all      = this.point(this.select('stories', $backlog)),
                closed   = this.point(this.select('closed', $backlog)),
                seisaku  = this.point(this.story($backlog, '制作')),
                kaihatsu = this.point(this.story($backlog, '開発')),
                txt      = '';
            
            this.select('velocoty', $backlog).text(closed.toFixed(1) + '/' + all.toFixed(1));

            txt += '<span style="margin-left:15px;">制作:' + seisaku.toFixed(1);
            txt += '<span style="margin-left:15px;">開発:' + kaihatsu.toFixed(1) + '</span>';
            txt += '<span style="margin-left:15px;">その他:' + (all - seisaku - kaihatsu).toFixed(1) + '</span>';

            this.select('header', $backlog).after($('<div class="header"><div class="ex-points">' + txt + '</div></div>'));
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
})();
