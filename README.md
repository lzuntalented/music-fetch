#介绍
一个基于phantomjs的网易云音乐pc页数据爬虫工具

##功能

* 抓取首页推荐歌单列表
* 抓取全部分类信息
* 抓取分类下所有歌单列表
* 抓取歌单下歌曲列表
* 抓取歌曲详细信息

##使用
>npm install
* node getRecommend.js (首页推荐歌单列表，缓存文件 list-recommend.json)
* node getCat.js (全部分类信息，缓存文件 cat-list.json)
* node getCatList.js (分类下所有歌单列表，缓存文件 cat-分类名-list.json)
* node getList.js (歌单下歌曲列表，缓存文件 list-歌单Id.json)
* node getMusciInfo.js (歌曲详细信息，缓存文件 song-歌曲id-list.json)

##other
更多内容待开发