
const path = require('path');

// Ref: https://github.com/jprichardson/node-fs-extra
const fs = require('fs-extra');

// Ref: https://github.com/manidlou/node-klaw-sync
const klawSync = require('klaw-sync');

const basePath = 'd:/tmp/';

// Async/Await:
async function copyFiles() {
    try {
        // await fs.copy('d:/tmp/myfile', 'd:/tmp/mynewfile')
        //   await fs.copy('d:/tmp/myfile/test.txt', 'd:/tmp/new/')

        let rs = fs.readJSONSync('d:/tmp/data.json');
        console.log('success!', rs, typeof rs);
    } catch (err) {
        console.error(err)
    }
}
// copyFiles()

let sourceDir = process.argv[2] || '';
let targetDir = process.argv[3] || './';

if (!sourceDir) {
    console.error('请输入源文件目录');
    process.exit();
}

// console.log('-----', sourceDir, targetDir);

// 通过文件后缀筛选文件
// const filterFn = item => path.extname(item.path) === '.js'

// 通过文件名 筛选
const filterEntryFile = item => item.path.includes('entry.json')

const paths = klawSync(sourceDir, { filter: filterEntryFile })

// console.log(paths);

for (let item of paths) {
    let entryData = fs.readJsonSync(item.path);
    let _baseDir = path.dirname(item.path);
    // 视频 .blv 文件所在目录
    let _blvDir = `${_baseDir}/${entryData.type_tag}`;
    let _titleDir = `${targetDir}/${entryData.title}`;
    let isDirExists = fs.ensureDirSync(_titleDir);
    if (!isDirExists) {
        fs.mkdirpSync(_titleDir);
    }

    let fileBaseName = entryData.page_data.part || '';
    let filterFn = item => path.extname(item.path) === '.blv';
    let subPaths = klawSync(_blvDir, { filter: filterFn })

    // console.log(item.path, entryData.title, JSON.stringify({
    //     isDirExists, _baseDir, _blvDir, subPaths, fileBaseName
    // }));

    let needExtNum = subPaths.length <= 1 ? false : true;
    let count = 0;
    // 逐个拷贝 .blv 文件
    for (let subItem of subPaths) {
        // 转存为 .flv格式的文件
        let _ext = '.flv'; // path.extname(subItem.path);
        let newFileName = `${_titleDir}/${fileBaseName}`;
        if (needExtNum) {
            newFileName += count + '' + _ext;
            count++;
        } else {
            newFileName += _ext;
        }

        console.log(`正在拷贝: ${subItem.path} ==> ${newFileName}`);
        // 开始拷贝文件
        fs.copyFileSync(subItem.path, newFileName);
    }
}
