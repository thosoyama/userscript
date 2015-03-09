// ==UserScript==
// @name        バックログのストーリーポイント集計
// @namespace   https://github.com/hosoyama-mediba/userscript
// @version     0.1
// @description バックログに制作ポイント・開発のポイント・完了ポイントを追加します
//              小室さんのブックマークレットを勝手に改変
// @author      Terunobu Hosoyama <hosoyama@mediba.jp>
// @match       http://au-project.mediba.local/rb/master_backlog/dolphin
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

(function() {
    if (!$ || $('#backlogs_container').length !== 1) {
        alert('ごめんなさい、ここじゃちょっと。');
        return;
    }
    var distributor = {
        selector: {
            backlog: '#backlogs_container div.backlog',
            sprint:  'div.header div.name',
            stories: 'ul.stories li',
            subject: 'div.subject',
            point:   'div.story_points div.t',
            closed:  'ul.stories li.closed',
            header:  'div.header'
        },
        select: function(name, context){
            var selector = this.selector[name];
            return context ? $(selector, context) : $(selector);
        },
        style: function(){
            return '#backlogs_container div.backlog ul.stories li.story-seisaku {background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#FAE0E7)); background: -moz-linear-gradient(top, #EEE, #FAE0E7); filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#FAE0E7); background-color: #FAE0E7;} #backlogs_container div.backlog ul.stories li.story-kaihatsu {background: -webkit-gradient(linear, left top, left bottom, from(#EEE), to(#E0E7FA)); background: -moz-linear-gradient(top, #EEE, #E0E7FA); filter: progid:DXImageTransform.Microsoft.Gradient(Enabled=1,GradientType=0,StartColorStr=#EEEEEE,EndColorStr=#E0E7FA); background-color: #E0E7FA;}';
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
        /*
        backlog: function(){
            var that = this,
                sprint = this.sprint(),
                $backlog = this.select('backlog').filter(function(){
                    return that.select('sprint', this).text().indexOf(sprint) > -1;
                });
            if (!$backlog.length) {
                if (confirm('バックログは見つかりませんでした。\nもう一度探しますか？')) {
                    $backlog = this.backlog();
                }
            } else if ($backlog.length > 1) {
                if (confirm('ごめんなさい、よくわからない…。\nもう一度探しますか？')) {
                    $backlog = this.backlog();
                }
            }
            return $backlog;
        },
        sprint: function(msg, i){
            msg = msg || '対象スプリントを教えてください。';
            i = i || 0;
            var sprint = prompt(msg);
            if (sprint === null) {
                throw '';
            } else if (!sprint.length) {
                if (i > 10) {
                    throw 'ごめんなさい、もういいです';
                }
                sprint = this.sprint('何か入れてください…。', ++i);
            }
            return sprint;
        },
        */
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
            var all = this.point(this.select('stories', $backlog)),
                seisaku = this.point(this.story($backlog, '制作')),
                kaihatsu = this.point(this.story($backlog, '開発')),
                closed = this.point(this.select('closed', $backlog)),
                txt = '';

            txt += '<span style="margin-left:10px;">制作:' + seisaku.toFixed(1);
            txt += '<span style="margin-left:10px;">開発:' + kaihatsu.toFixed(1) + '</span>';
            txt += '<span style="margin-left:10px;">その他:' + (all - seisaku - kaihatsu).toFixed(1) + '</span>';
            txt += '<span style="margin-left:10px;">完了:' + closed.toFixed(1) + '</span>';

            this.select('header', $backlog).after($('<div class="header"><div class="velocity">' + txt + '</div></div>'));
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
