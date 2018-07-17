
/**
 * 白板页面 snv 更新
 */
const shellBase = require('./shellBase');

let env = 'dev';
let gameName = 'test';

let cmds = `
    ssh -A www@21.158.201.141\n
    cd /data/httpd/${gameName}/game/\n
    git pl\n
    pm2 restart ${gameName}\n
    exit\n`;


//echo ${time} >> update_time.txt\n

shellBase({ env, cmds });