/**
 * Created by lz on 2017/11/22.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取分类列表
 */
class getMusciInfo extends FetchBase{
    constructor(url, delay){
        super(url, delay);
        this.checkMp3 = false;
        this.musicUrl = '';
    }

    parserDom($){
        // 歌名
        let name = $('.m-lycifo .cnt .tit .f-ff2');
        name = name.text();

        const list = $('.m-lycifo .des a.s-fc7');
        // 歌手
        let author = '';
        // 专辑
        let album = '';
        list.each(function (idx, item) {
            if(idx === 0){
                author = $(item).text();
            }else{
                album = $(item).text();
            }
        });

        const content = $('.m-lycifo #lyric-content');
        content.find('.crl').remove();
        const more = content.find('#flag_more');
        content.append(more.html());
        more.remove();

        let html = content.html();
        // 歌词
        const lyric = html.replace(/<br>/g, '\n');

        // 评论数
        const commentCount = $('.m-lycifo .m-info #cnt_comment_count').text();

        const obj = {
            name,
            author,
            album,
            commentCount,
            lyric
        }

        if(!this.checkMp3){
            this.checkMp3 = true;
            this.initVar();
            this.addPlayUrl(obj);
        }
    }

    /**
     * 添加歌曲播放地址链接
     * @param obj
     * @returns {Promise.<void>}
     */
    async addPlayUrl(obj){
        await this.page.evaluate(function() {
            var nt = window.g_iframe.contentWindow.document.querySelectorAll('#content-operation .u-btni-addply');
            nt[0].click();
        });
        await setTimeout(()=>{
            obj.playUrl = this.musicUrl;
            // 写入文件
            fs.writeFile('song-'+ this.getSongId() +'.json', JSON.stringify(obj), function (err) {
                console.log('write end ' + (err ? 'fail' : 'success'));
            })
        }, 3000);
    }

    /**
     * 获取歌曲id
     * @returns {string|void|XML|*}
     */
    getSongId(){
        return this.url.replace(/.*id=([0-9]*)/ig, '$1');
    }

    /**
     * 资源请求时接口
     * @param requestData
     */
    requestBeforeCB(requestData){
        if(this.checkMp3){
            if(/player\/url/.test(requestData.url)){
                this.replayPlayUrl(requestData);
            }
        }
    }

    /**
     * 重构歌曲地址请求
     * @param requestData
     * @returns {Promise.<void>}
     */
    async replayPlayUrl(requestData){
        const page = await this.instance.createPage();
        await page.open(requestData.url, 'POST', requestData.postData);
        const content = await page.property('content');
        this.musicUrl = content.replace(/.*(http:\/\/.*\.mp3).*/ig,'$1');
    }
}
//
var g = new getMusciInfo('http://music.163.com/song?id=247835', 2000);
