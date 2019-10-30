
const request = require('superagent');
require('superagent-charset')(request);

module.exports = class Request {

    static async get(url, charset = 'utf-8') {
        return new Promise((resolve, reject) => {

            request.get(url)
                .buffer(true)
                .charset('gbk')
                .set('Referer', 'https://www.google.com')
                .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });

    }
}