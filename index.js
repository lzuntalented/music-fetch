/**
 * Created by lz on 2017/11/20.
 * 废弃文件
 */
const phantom = require('phantom');
const jsdom = require("jsdom");
const fs = require('fs');

let timeHandler = null;
let requestArr = [];
let receiveArr = [];

function startTimer(page) {
    timeHandler && clearTimeout(timeHandler);
    setTimeout(() => {
        if(receiveArr.length >= requestArr.length){
            doAfterJqLoad(page);
        }
    }, 1000);
}

async function doAfterJqLoad(page) {
    console.log('eval js start');
    let html = await page.evaluate(function() {
        return window.g_iframe.contentWindow.document.all[0].outerHTML;
    });

    const { window } = new jsdom.JSDOM(html);
    const $ = require('jquery')(window);

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
    console.log(list);
    fs.writeFile('list.json', JSON.stringify(list), function () {
        console.log('write end');
    })
    // console.log($('#discover-module').html());

}

async function start() {
    const instance = await phantom.create();
    const page = await instance.createPage();

    page.on('onResourceRequested', function(requestData) {
        if(!(/\.(jpg|png|gif)/.test(requestData.url) || /weblog/.test(requestData.url))){
            requestArr.push(requestData.id);
            // console.log(requestArr)
        }
    });

    page.on('onResourceReceived', function(requestData) {
        let id = requestData.id;
        let stage = requestData.stage;
        if(!(/\.(jpg|png|gif)/.test(requestData.url) || /weblog/.test(requestData.url))){
            if(requestArr.indexOf(id) > -1){
                if(stage === 'end'){
                    receiveArr.push(id);
                    // console.log(receiveArr)
                    if(receiveArr.length >= requestArr.length){
                        startTimer(page);
                    }
                }
            }
        }
    });

    const status = await page.open('http://music.163.com/');
    const content = await page.property('content');
}

start();