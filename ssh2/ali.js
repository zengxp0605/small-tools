const conf = require('./config');
const Client = require('ssh2').Client;

const conn = new Client();
conn.on('ready', function () {
    conn.exec('echo 222 >> test.txt; echo 3333;', function (err, stream) {
        if (err) throw err;

        stream.on('close', function (code, signal) {
            conn.end();
        }).on('data', function (data) {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
        });
    });
}).connect(conf.ali);
