

# youtube-dl 下载工具, 基于nodejs 做的批量下载

## 使用前安装
> 需要先安装 youtube-dl: [官网](http://rg3.github.io/youtube-dl/)  
> [windows download](https://yt-dl.org/latest/youtube-dl.exe)
```
npm install
```

## Bilibili 列表批量下载
> 文件会下载到当前目录,下载后保存为播放时的文件名
```
cd bilibili
# av5892786 是需要下载链接里获取的 如: https://www.bilibili.com/video/av16404880/?p=1
node download.js av5892786
```

