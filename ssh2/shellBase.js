const conf = require('./config');
const Client = require('ssh2').Client;

let _stream;
const conn = new Client();

module.exports = function ({ env = 'dev', cmds = '', isExec = false }) {

    conn.on('ready', function () {
		if(isExec){	
			// 执行简单的命令时,(不需要切换shell)
			//let cmds = `echo ${Date.now} >> test.txt`;
			conn.exec(cmds, function (err, stream) {
				if (err) throw err;
				stream.on('close', function (code, signal) {
					conn.end();
				}).on('data', function (data) {
					console.log('STDOUT: ' + data);
				}).stderr.on('data', function (data) {
					console.log('STDERR: ' + data);
				});
			});

			return;
		}
		
        let time = Date.now();
        console.log('Client :: ready', time);
        conn.shell(function (err, stream) {
            if (err) throw err;
            stream.on('close', function () {
                console.log('Stream :: close');
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function (data) {
                console.log('STDERR: ' + data);
            })

            // stream.write(`ssh -A www@21.158.201.135\n`);
            // // stream.write(`echo ${time} >> test.txt\n`);
            // stream.write('cd /data/httpd/test\n');
            // stream.write('svn up\n');
            // // stream.write(`echo ${time} >> update_time.txt\n`);
            // stream.end('exit\n');

            stream.end(cmds);

            setTimeout(() => {
                console.log('END!');
                conn.end();
            }, 5000);
        });
    }).connect(conf[env]);
};