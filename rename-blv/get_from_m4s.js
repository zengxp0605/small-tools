const path = require("path");
const exec = require("child_process").exec;
// Ref: https://github.com/jprichardson/node-fs-extra
const fs = require("fs-extra");

// Ref: https://github.com/manidlou/node-klaw-sync
const klawSync = require("klaw-sync");

let sourceDir = process.argv[2] || "/Users/jasonzeng/Downloads/525507222/";
let targetDir = process.argv[3] || "./output/";

if (!sourceDir) {
  console.error("请输入源文件目录");
  process.exit();
}

const sleep = async (ms) => new Promise((reslove) => setTimeout(reslove, ms));

// 通过文件名 筛选
const filterEntryFile = (item) => item.path.includes("entry.json");

const paths = klawSync(sourceDir, { filter: filterEntryFile });

// console.log(paths);

async function makeMp4File() {
  for (let item of paths) {
    let entryData = fs.readJsonSync(item.path);
    let _baseDir = path.dirname(item.path);
    // 视频 文件所在目录
    let mvDir = `${_baseDir}/${entryData.type_tag}`;
    // let _titleDir = `${targetDir}/${entryData.title}`;
    // let isDirExists = fs.ensureDirSync(_titleDir);
    // if (!isDirExists) {
    //     fs.mkdirpSync(_titleDir);
    // }

    let fileName = entryData.page_data.part || "";
    let filterFn = (item) => path.extname(item.path) === ".blv";

    fileName = fileName.split(".")[0]; // 只取前面的序号
    let newFileName = targetDir + fileName + ".mp4";

    console.log(mvDir, fileName, newFileName);

    // 通过 ffmpeg命令转存文件
    // /Applications/ffmpeg -i video.m4s -i audio.m4s -codec copy Output.mp4
    let cmd = `/Applications/ffmpeg -i ${mvDir}/video.m4s -i ${mvDir}/audio.m4s -codec copy ${newFileName}`;
    // console.log(cmd);
    exec(cmd, function (error, stdout, stderr) {
      if (error) {
        console.error(error);
      } else {
        // 获取命令执行的输出
        console.log(cmd, stdout);
        console.log("---------------");
      }
    });

    await sleep(2000);
  }
}

makeMp4File();
