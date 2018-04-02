var fs = require('fs');
var path = require('path');
var responseBuilder = require('./ResponseBuilder');
var dirLoader = require('./DirectoryLoader');
var pluginLoader = require('./PluginLoader');
var pluginContext = require('./MarkdownWebserverPluginContext');

class MarkdownWebserver {
    /** 
     * This method must be called before webserver fully started.
     * The full initialization of webserver is done here, the order of elements is important.
     */
    init(app, express) {
        this.app = app;
        this.express = express;
        this.plugins = pluginLoader.getPlugins();
        this.initDirLoader();
        this.initResponseBuilder();
        this.initPlugins();
        this.handleResourceDirectory(this.rootPath);
    }

    initDirLoader() {
        var rootPath = this.parseRootPath();
        this.checkIfPathExists(rootPath);
        dirLoader.init(this);
        dirLoader.parseDir(rootPath);
        console.log("INFO - Directory loader inited successfully.");
        this.rootPath = rootPath;
    }

    initResponseBuilder() {
        responseBuilder.init(dirLoader);
        console.log("INFO - Response builder inited successfully.");
    }

    initPlugins() {
        var context = this.createPluginContext();
        for (var i = 0; i < this.plugins.length; i++) {
            this.plugins[i].object.init(context);
        }
        this.processContext(context);
        this.pluginsInited = true;
        console.log("INFO - Plugins inited successfully.");
    }

    /** 
     * This is a hook which is called when directoryLoader reloads the directory structure.
     */
    directoryReloaded() {
        this.reloadPlugins();
        responseBuilder.init(dirLoader);
    }

    reloadPlugins() {
        if (this.pluginsInited) {
            var context = this.createPluginContext();
            for (var i = 0; i < this.plugins.length; i++) {
                this.plugins[i].object.reload(context);
            }
        }
    }

    createPluginContext() {
        return pluginContext
            .Builder
            .addMarkdownWebserver(this)
            .addDirLoader(dirLoader)
            .addTemplEngine(responseBuilder.templEngine)
            .build();
    }

    processContext(context) {
        responseBuilder.registerWidgets(context.widgets);
        responseBuilder.registerScripts(context.scripts);
        responseBuilder.registerStyles(context.styles);
        responseBuilder.registerContentGenerators(context.contentGenerators);
        responseBuilder.templEngine.addPluginTemplates(context.templateFiles);

        for (var i = 0; i < context.resourceDirs.length; i++) {
            this.app.use(this.express.static(context.resourceDirs[i]));
        }
    }

    // TODO this is a poor solution for static resource handling...
    handleResourceDirectory(rootPath) {
        var resourceDir = path.join(rootPath, ".resources")
        console.log("INFO - resource directory: " + resourceDir);
        this.app.use(this.express.static("testdir/.resources"));
    }

    /**
     * This method is called when a request arrives to application.
     * @param {} req 
     */
    processRequest(req) {
        return responseBuilder
            .reset()
            .addName()
            .addContent(req.path)
            .addCopyRight()
            .addExplorer()
            .addWidgets()
            .addStyles()
            .addScripts()
            .toHtml()
    }

    checkIfPathExists(path) {
        try {
            fs.readdirSync(path);
        } catch (err) {
            console.log("ERROR - The root markdown directory path you defined is invalid! " + err);
            process.exit();
        }
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