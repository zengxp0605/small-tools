
## 转移手机端下载的 Bilibili视频文件(.blv)


### 手机下载的B站视频整理到电脑上

- 安卓手机下载后的存储路径: `/Android/data/tv.danmaku.bili/download`
> 连接到电脑后可能看不到`tv.danmaku.bili`这个文件夹, 可以在手机上将它重命名, 这里改名为 `aaa`


- 拷贝文件到指定目录
> 将`d:/tmp/aaa` 目录下的 `.blv` 文件整理到 `d:/tmp/bili`, 并改为 `.flv`后缀
```
node moveFiles.js 'd:/tmp/aaa' 'd:/tmp/bili'
```