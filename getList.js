/**
 * Created by lz on 2017/11/21.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取歌单详情
 * 成功后写入 list-歌单id.json文件中
 */
class GetList extends FetchBase{
    constructor(url, delay){
        // 歌单id
        super(url, delay);
        this.listId = url.replace(/.*\?id=([0-9])/ig,'$1');
    }

    /**
     * 页面加载完成之后执行
     * @returns {Promise.<void>}
     */
    parserDom($){
        // 歌单歌曲列表解析
        let list = [];
        $('#song-list-pre-cache tbody tr').each(function (idx, item) {
            let children = $(item).children();

            // 歌曲名字
            let nameDom = $(children[1]).find('b');
            let name = nameDom.attr('title');
            // 歌曲链接
            let songLink = nameDom.parent().attr('href');
            // 歌曲时长
            let time = $(children[2]).find('.u-dur');
            time = time.text();
            // 歌手
            let authorDom = $(children[3]).find('.text');
            let author = authorDom.attr('title');
            // 歌手链接
            let authorLink = authorDom.find('a').attr('href');
            // 专辑
            let albumDom = $(children[4]).find('a');
            let album = albumDom.attr('title');
            // 专辑链接
            let albumLink = albumDom.attr('href');

            list.push({
                name: name,
                time: time,
                author: author,
                album: album,
                authorLink: authorLink,
                albumLink: albumLink,
                songLink: songLink
            });
        });
        // console.log(list);
        // 写入文件
        fs.writeFile('list-' + this.listId + '.json', JSON.stringify(list), function (err) {
            console.log('write end ' + (err ? 'fail' : 'success'));
        })
    }
}

new GetList('http://music.163.com/playlist?id=924680166');