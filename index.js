var express = require('express');
var fs = require('fs');
var path = require('path');
var ResponseBuilder = require('./ResponseBuilder');
var DirectoryLoader = require('./DirectoryLoader');

var app = express();
var dirLoader = new DirectoryLoader();

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
        new ResponseBuilder
            .init(dirLoader)
            .reset()
            .addName()
            .addContent(req.path)
            .addCopyRight()
            .addExplorer()
            .toHtml()
    );
})

app.listen(80, function () {
    console.log('INFO - markdown-webserver is listening on port 80!');
});

function readDirectory() {
    var rootPath = parseRootPath()

    try {
        /* Just to check if this is a valid directory */
        fs.readdirSync(rootPath);
        dirLoader.parseDir(rootPath);

        resourceDir = path.join(rootPath, ".resources")
        console.log("INFO - resource directory: " + resourceDir);
        app.use(express.static("testdir/.resources"));
    } catch (err) {
        console.log("ERROR - The root markdown directory path you defined is invalid! " + err);
        process.exit();
    }
}

function parseRootPath() {
    var rootPath = "";

    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === "-p") {
            rootPath = process.argv[i + 1];
        }
    }

    if (rootPath === "") {
        console.log("ERROR - Please define the path of your root markdown directory with -p option!");
        process.exit();
    } else {
        return rootPath;
    }
}

readDirectory();