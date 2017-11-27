/**
 * Created by lz on 2017/11/22.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取分类列表
 */
class GetCat extends FetchBase{
    parserDom($){
        var list = [];
        $('#cateListBox .bd dd').each(function (idx, item) {
            $(item).find('a').each(function (id, it) {
                list.push({
                    link: $(it).attr('href'),
                    name: $(it).attr('data-cat')
                });
            });
        });
        // console.log(list);
        // 写入文件
        fs.writeFile('cat-list.json', JSON.stringify(list), function (err) {
            console.log('write end ' + (err ? 'fail' : 'success'));
        })
    }
}
//
var g = new GetCat('http://music.163.com/discover/playlist', 2000);
