var express = require('express');
var fs = require('fs');
const path = require('path');
var JSON = require('JSON');
var marked = require('marked');

var app = express();
var DirectoryLoader = require('./DirectoryLoader');
var TemplateEngine = require('./TemplateEngine');
var ErrorHandler = require('./ErrorHandler');

var dirLoader;
var templEngine;

dirLoader = new DirectoryLoader();
templEngine = new TemplateEngine();

templEngine.init();
readDirectory();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('resources'));

app.get('/*', function (req, res) {
    reset();
    var content = getContent(req.path);
    var responseHTML = getResponseHTML(content);
    res.send(responseHTML);
})

app.listen(80, function () {
    console.log('INFO - markdown-webserver is listening on port 80!');
});

function reset() {
    dirLoader.reset();
}

function getContent(path) {
    if (path === "/" || path === "") {
        return marked(ErrorHandler.getDefaultContent(dirLoader));
    } else if (path.startsWith("/")) {
        path = path.substr(1);
    }

    try {
        var content_raw = dirLoader.getContent(path);
    } catch (e) {
        if (e.reason !== undefined && e.reason === "NOT_FOUND") {
            return marked(ErrorHandler.getNotFoundContent(dirLoader));
        }
    }

    if (content_raw === undefined || content_raw === null) {
        return marked(ErrorHandler.getEmptyContent(dirLoader));
    }
    return marked(content_raw);
}

function getResponseHTML(content = "") {
    var markdownStructure = dirLoader.getMarkdownStructure();
    var copyright = getCopyright();
    var explorer = templEngine.renderExplorer(markdownStructure);
    return templEngine.renderMain({
        name: markdownStructure.name,
        explorer: explorer,
        content: content,
        copyright: copyright
    });
}

function getCopyright() {
    var copy = "";
    try {
        copy_raw = dirLoader.getUserTemplate("COPYRIGHT.md");
        copy = marked(copy_raw.content);
    } catch (e) {}

    return copy;
}

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