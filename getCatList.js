/**
 * Created by lz on 2017/11/23.
 */
const FetchBase = require('./FetchBase');
const fs = require('fs');
/**
 * 获取分类歌单列表
 */
class GetCatList extends FetchBase{
    constructor(url, delay){
        const cat = url.replace(/.*cat=([^&]*)/ig, '$1');
        const fileName = 'cat-' + cat + '-list.json';
        fs.unlink(fileName,function () {

        });
        super(url, delay);
    }

    parserDom($){
        var list = [];
        $('#m-disc-pl-c .m-cvrlst').find('li').each(function (idx, item) {
            let img = $(item).find('img');
            let a = $(item).find('a.msk');
            list.push({
                img: img.attr('src'),
                url: a.attr('href'),
                title: a.attr('title')
            })
        });
        // console.log(list);
        // console.log(this.url);

        const nextPage = $('#m-pl-pager .znxt');
        const noNext = nextPage.hasClass('js-disabled');
        if(!noNext){
            this.initVar();
            this.clickNext();
        }

        // 写入文件
        this.save(list);
        if(noNext){
            // 任务结束
            console.log('task run end');
            this.instance.exit();
        }
    }

    /**
     * 保存到文件
     * @param list
     */
    save(list){
        const cat = this.url.replace(/.*cat=([^&]*)/ig, '$1');
        const fileName = 'cat-' + cat + '-list.json';
        let content = '[]';
        try {
            content = fs.readFileSync(fileName);
        }catch (e){}
        content = JSON.parse(content);
        content = content.concat(list);
        fs.writeFileSync(fileName, JSON.stringify(content));
        console.log('write list ' + content.length);
    }

    /**
     * 点击下一页
     * @returns {Promise.<*>}
     */
    async clickNext(){
        let link = await this.page.evaluate(function() {
            var nt = window.g_iframe.contentWindow.document.querySelectorAll('#m-pl-pager .znxt');
            nt[0].click();
            return window.location.href;
        });
        // console.log(link);
        return link;
    }
}

var g = new GetCatList('http://music.163.com/discover/playlist/?cat=%E6%AC%A7%E7%BE%8E', 2000);