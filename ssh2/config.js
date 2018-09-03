module.exports = {
    ali: {
      host: '106.15.201.155',
        port: 22,
        username: 'root',
        privateKey: require('fs').readFileSync('C:/Users/zxp/.ssh/id_rsa.pub', 'utf-8'); 
    },

    // 开发环境
    dev: {
        host: '101.89.12.130',
        port: 22,
        username: 'dev-user',
        password: 'test2',
    },
    // 测试环境
    test: {
        host: '101.89.12.130',
        port: 22,
        username: 'test-user',
        password: 'test2',
    },
};