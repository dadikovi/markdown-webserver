var fs = require('fs');
var path = require('path');
var responseBuilder = require('./ResponseBuilder');
var dirLoader = require('./DirectoryLoader');

class MarkdownWebserver {
    /** 
     * This method must be called before webserver fully started.
     * It reads the provided markdown directory structure.
     */
    init(app, express) {
        this.app = app;
        this.express = express;

        var rootPath = this.parseRootPath();        
        this.checkIfPathExists(rootPath);
        dirLoader.parseDir(rootPath);
        this.handleResourceDirectory(rootPath);       
    }

    handleResourceDirectory(rootPath) {
        var resourceDir = path.join(rootPath, ".resources")
        console.log("INFO - resource directory: " + resourceDir);
        this.app.use(this.express.static("testdir/.resources"));
    }

    checkIfPathExists(path) {
        try {
            fs.readdirSync(path);
        } catch (err) {
            console.log("ERROR - The root markdown directory path you defined is invalid! " + err);
            process.exit();
        }
    }

    processRequest(req) {
        return responseBuilder
                .init(dirLoader)
                .reset()
                .addName()
                .addContent(req.path)
                .addCopyRight()
                .addExplorer()
                .toHtml()
    }
    
    parseRootPath() {
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
};

module.exports = new MarkdownWebserver();