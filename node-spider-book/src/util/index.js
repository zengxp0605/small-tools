module.exports = class Index {
    static async delay(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
}