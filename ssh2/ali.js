
/**
 * 拉取博客代码
 */
const shellBase = require('./shellBase');

let env = 'ali';

let now = Date.now();

let cmds = `
su www;
cd /data/httpd/blog/html/;
git pull origin master;
echo ${now} >> test.txt;
`;

shellBase({ env, cmds });
