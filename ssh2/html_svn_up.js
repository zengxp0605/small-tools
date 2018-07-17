
/**
 * 白板页面 snv 更新
 */
const shellBase = require('./shellBase');

let env = 'dev';
let time = Date.now();

let cmds = `
    ssh -A www@21.158.201.135\n
    cd /data/httpd/test\n
    svn up\n
    exit\n`;


//echo ${time} >> update_time.txt\n

shellBase({ env, cmds });