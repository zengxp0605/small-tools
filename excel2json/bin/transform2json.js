
/**
 * 从excel 导入配置到 config 文件夹下, 存为json格式
 */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const nodeXlsx = require('node-xlsx').default;

function toAbsPath(p) {
    return path.join(__dirname, p);
}

class Transfrom {
    constructor({
        filePath,
        formatObj = null,
    }) {
        this.formatObj = formatObj;
        this.filePath = toAbsPath(filePath);
        console.log(`要处理的文件,${this.filePath}`);
        this._completeSheets = [];

        let stime = Date.now();
        this.init();

        console.log(
            `已完成的sheet数量: ${this._completeSheets.length}`
            , `耗时: ${Date.now() - stime} ms`
            , this._completeSheets
        );
    }

    init() {
        return this._importConfigData();
    }

    _makeConfigPath(fileName) {
        return toAbsPath(path.join('../config', fileName));
    }

    _importConfigData() {
        // Parse a buffer
        // const workSheetsFromBuffer = nodeXlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`));
        // Parse a file
        const sheetsDataFromFile = nodeXlsx.parse(this.filePath);
        /* 格式如: [ // 每个sheet一行数据
            {"name":"_物品列表","data":[["id","name"],[1001,"游戏币"],[1002,"钻石"]]},
            {"name":"test2","data":[["id","name"],[1001,"游戏币"],[1002,"钻石"]]}
            ]
        */
        // console.log(filePath, JSON.stringify(sheetsDataFromFile));

        // fs.writeFileSync(toAbsPath('../tmp.json'), JSON.stringify(sheetsDataFromFile), 'utf8');

        for (let item of sheetsDataFromFile) {

            this._importBySheetName(item.name, item.data);
        }
    }

    _importBySheetName(sheetName, data) {
        if (!data || !data.length) {
            return;
        }
        let fixedCfgRow = data.shift(); // sheet 第一行为预设的文件配置
        let { fileName, fullPath } = this._checkRow1Config(fixedCfgRow);
        if (!fullPath) {
            return;
        }

        let fixedKeysRow = data.shift(); // 第二行为保存的key
        data.shift();  // 第三行为多余的标题描述

        // 根据不要保存的文件名整理成不同的格式
        let parsedData = this._parseData(fileName, fixedKeysRow, data);

        if (!parsedData) {
            return;
        }

        this._saveConfig(fullPath, parsedData);
        this._completeSheets.push(sheetName);
        console.log(`处理完成--${sheetName}--已保存为: ${fullPath}`);
    }

    _saveConfig(fullPath, parsedData) {
        fs.writeFileSync(fullPath, JSON.stringify(parsedData), 'utf8');
    }

    /**
     * 第一行
     * fileName 保存的文件名
     */
    _checkRow1Config(fixedCfgRow) {
        if (fixedCfgRow.length !== 2) {
            return {};
        }
        if (fixedCfgRow[0] !== 'fileName') {
            return {};
        }

        let fileName = (fixedCfgRow[1] + '').replace('.json', '');

        let fullPath = this._makeConfigPath(fileName + '.json');
        return { fileName, fullPath };
    }

    _parseData(fileName, fixedKeysRow, data) {
        if (this.formatObj) {
            if (typeof this.formatObj[fileName] === 'function') {
                return this.formatObj[fileName](fixedKeysRow, data);
            } else {
                console.error(`定义了formatObj,但是没有 ${fileName} 方法`);
                return;
            }
        }

        let parsedData;
        switch (fileName) {
            case 'cfg_item':
                parsedData = this.__parseCommon(fixedKeysRow, data);
                break;
            case 'cfg_other':
                parsedData = this.__parseOther(fixedKeysRow, data);
                break;
            default:
                parsedData = this.__parseCommon(fixedKeysRow, data);
        }

        return parsedData;
    }

    __parseCommon(keys, data) {
        let arr = [];
        for (let row of data) {
            let tmpObj = {};
            for (let i = 0; i < row.length; i++) {
                let k = keys[i] || `unknow-key-${i}`;
                let val = row[i];
                tmpObj[k] = val;
            }
            arr.push(tmpObj);
        }
        return arr;
    }

    __parseOther(keys, data) {

        return data;
    }

}



function getXlsxFile() {
    let excelPath = '../excel';
    let fileArr = fs.readdirSync(toAbsPath(excelPath));

    let file = '';
    for (let f of fileArr) {
        let ext = _.last((f + '').split('.'));
        if (ext === 'xlsx' || ext === 'xls') {
            file = f;
            break; // 只读取一个文件
        }
    }

    return `${excelPath}/${file}`;
}


let filePath = getXlsxFile();

new Transfrom({
    filePath,
    // formatObj: require('./formatObj'), // 传入一个数据处理类
});
