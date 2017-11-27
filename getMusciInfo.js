/**
 * Created by lz on 2017/11/22.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取分类列表
 */
class getMusciInfo extends FetchBase{
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
        // 写入文件
        fs.writeFile('song-'+ this.getSongId() +'.json', JSON.stringify(obj), function (err) {
            console.log('write end ' + (err ? 'fail' : 'success'));
        })
    }

    /**
     * 获取歌曲id
     * @returns {string|void|XML|*}
     */
    getSongId(){
        return this.url.replace(/.*id=([0-9]*)/ig, '$1');
    }
}
//
var g = new getMusciInfo('http://music.163.com/song?id=247835', 2000);
