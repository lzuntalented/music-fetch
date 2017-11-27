/**
 * Created by lz on 2017/11/22.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取首页推荐歌单列表
 */
class getRecommend extends FetchBase{
    parserDom($){
        let list = [];
        $('#discover-module .m-cvrlst').find('li').each(function (idx, item) {
            let img = $(item).find('img');
            let a = $(item).find('a.msk');
            list.push({
                img: img.attr('src'),
                url: a.attr('href'),
                title: a.attr('title')
            })
        });
        fs.writeFile('list-recommend.json', JSON.stringify(list), function (err) {
            console.log('write end ' + (err ? 'fail' : 'success'));
        })
    }
}
//
var g = new getRecommend('http://music.163.com/', 2000);
