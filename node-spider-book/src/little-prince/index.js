const cheerio = require('cheerio');
const { get } = require('../util/httpRequest');
const { delay } = require('../util');

module.exports = class Index {
    static init() {
        // testBaidu();
        new Index().start();

    }

    constructor() {
        // 起始列表页url
        this.startUrl = 'http://www.newxue.com/mingzhu/littleprince/';
    }

    async start() {
        try {
            let pageList = await this.getPagesList();
            console.log("pageList: ", pageList);
            let i = 0;
            for (let p of pageList) {
                let { title, href } = p;
                let fileName = i + '_' + (title + '').replace(' ', '') + '.txt';
                let detail = await this.getPageDetail(href);
                let text = this._parseDetail(detail);
                this._writeOutFile(fileName, text);
                await delay(1000);
                i++;
                // if (i > 3) {
                //     break;
                // }
            }
        } catch (e) {
            console.error(e);
        }
    }

    _writeOutFile(fileName, text) {
        require('fs').writeFileSync(require('path').join(__dirname, './out/' + fileName), text);
    }

    // 获取详情页内容
    async getPageDetail(url) {
        let res = await get(url);
        let $ = cheerio.load(res.text, { decodeEntities: false });
        // 去除 #dashu_text 内多余的内容
        $('div#xsdh').remove();
        $('p.nextpage').remove();

        let html = $('div#dashu_text').html();

        if (!html) {
            html = $('div.zz_text').html();
        }
        // console.log('html: ', html);
        // require('fs').writeFileSync('./tmp.html', html);
        return html;
    }

    /**
     * 处理详情页的html
     * - 替换<p> 标签为换行
     * - 替换</p> 为空
     */
    _parseDetail(html) {
        html = html.replace(/<p>/g, '\r\n');
        html = html.replace(/<\/p>/g, '    ');
        return html;
    }

    // 获取列表页
    async getPagesList() {
        let list = [];
        let res = await get(this.startUrl);
        let $ = cheerio.load(res.text);
        $('div.xslttext ul li a').each((idx, ele) => {
            // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
            // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
            let news = {
                title: $(ele).text(),
                href: $(ele).attr('href')
            };
            list.push(news)
        });
        return list;
    }

}

async function testBaidu() {
    let res = await superagent.get('http://news.baidu.com/');
    let hotNews = getHotNews(res);
    console.log(hotNews);
}

let getHotNews = (res) => {
    let hotNews = [];
    // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

    /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
       以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
     */
    let $ = cheerio.load(res.text);

    // 找到目标数据所在的页面元素，获取数据
    $('div#pane-news ul li a').each((idx, ele) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        let news = {
            title: $(ele).text(),        // 获取新闻标题
            href: $(ele).attr('href')    // 获取新闻网页链接
        };
        hotNews.push(news)              // 存入最终结果数组
    });
    return hotNews
};
