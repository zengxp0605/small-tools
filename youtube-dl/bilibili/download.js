const co = require('co');
const Promise = require('bluebird');
const request = require('request');
const exec = require('child_process').exec;

// url like https://www.bilibili.com/video/av5892786/?p=2;
let baseUrl = 'https://www.bilibili.com/video/';
let pagelistUrl = 'https://api.bilibili.com/x/player/pagelist?aid=';

let videoNumber = process.argv[2] || '';

if (!videoNumber) {
	console.error('Please give a video number, like av5892786');
	process.exit();
}

videoNumber = videoNumber.replace('av', '');

let videoNumStr = 'av' + videoNumber;

// 每页的标题
// var rs = {}; for(let item of window.__INITIAL_STATE__.videoData.pages){ rs[item.page] = item.part }

// 可以通过这个链接获取 https://api.bilibili.com/x/player/pagelist?aid=16404880

// console.log(process.argv);

/**
 * getTitleData
 * @return {"1": "title", ...}
 */
function getTitleData() {
	return co(function* () {
		let body = yield getHtml(pagelistUrl + videoNumber);
		if (body) {
			body = JSON.parse(body)
			let data = body.data;
			let rs = {};
			for (let item of data) {
				rs[item.page] = item.part;
			}
			return rs;
		}

		return null;
	}).catch(console.error);
}


// Utility function that downloads a URL and invokes
// callback with the data.
function getHtml(url, isGzip = false) {
	return new Promise((resolve, rejext) => {
		// https.get(url, function (res) {
		// 	let data = "";
		// 	res.on('data', function (chunk) {
		// 		data += chunk;
		// 	});
		// 	res.on("end", function () {
		// 		resolve(data);
		// 	});
		// }).on("error", function () {
		// 	resolve(null);
		// });

		request({ url, gzip: isGzip }, function (err, response, body) {
			// console.log(body, url);
			resolve(body);
		});
	});
}

/**
 * Downall pagelist
 */
function downloadAll() {
	co(function* () {
		let data = yield getTitleData();
		console.log(data);
		if (!data) {
			throw 'PageList Empty';
		}

		for (let pageCount in data) {
			let title = data[pageCount];
			let fileName = title || 'rand_' + Math.ceil(Math.random() * 100000);
			let url = `${baseUrl}${videoNumStr}?p=${pageCount}`;
			let cmd = `youtube-dl ${url} -o ${fileName}.flv`;
			console.log(cmd);
			if (pageCount % 3 == 0) {
				//  每三个视频暂停5分钟
				yield Promise.delay(5 * 60 * 1000);
			}
			console.log(`CMD: ${cmd}`);
			exec(cmd, function (error, stdout, stderr) {
				if (error) {
					console.error(error);
				} else {
					// 获取命令执行的输出
					console.log(cmd, stdout);
					console.log('---------------');
				}
			});
		}
	}).catch(console.error);
}

downloadAll();