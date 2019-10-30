const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world.');
})

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your App is running at http://%s:%s', host, port);
});
