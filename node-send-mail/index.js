const path = require('path');
const execSync = require('child_process').execSync;
const { sendMail } = require('./sendMail');


// demo
// const attachments = [
//     {   // utf-8 string as an attachment
//         filename: 'text1.txt',
//         content: 'hello world!'
//     },
//     {   // file on disk as an attachment
//         // filename: 'text3.txt',
//         path: 'C:/Users/e-books/老人与海.mobi' // stream this file
//     }
// ];

const attachments = [];

// 获取临时文件目录 tmpAtt 下发附件
const filePath = path.join(__dirname, './tmpAtt');
const files = require('fs').readdirSync(filePath);


for (let name of files) {
    if (name === '.gitkeep') {
        continue;
    }
    attachments.push({
        filename: name,
        path: path.join(filePath, name),
    });
}

console.log(files, filePath, attachments);

// wen: 769949023@kindle.cn
async function sendToMyKindle() {
    const emails = [
        // '1548398984@qq.com',
        'jasonzeng0605@kindle.cn'
    ];
    const param = {
        to: emails,
        subject: 'Kindle books',
        content: '',
    };
    if (attachments.length) {
        param.attachments = attachments;
    }

    let rs = await sendMail(param);
    console.log(rs);
    if (!rs) {
        return;
    }
    for (let item of attachments) {
        console.log('Remove file', item.path);
        execSync(`rm -rf ${item.path}`)
    }
}

sendToMyKindle();
