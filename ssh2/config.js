module.exports = {
    ali: {
        host: '16.15.21.155',
        port: 22,
        username: 'root2',
        password: 'tttt',
        //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
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