var express = require('express');
var app = express();
var mdwebserv = require('./src/MarkdownWebserver');

mdwebserv.init(app, express);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('resources'));

app.get('/*', function (req, res) {
    res.send(
        mdwebserv.processRequest(req)
    );
})

app.listen(80, function () {
    console.log('INFO - Webserver is listening on port 80!');
});