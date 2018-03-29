var path_module = require('path');
var fs = require('fs');
var modules = [];

class PluginLoader {
    static loadModules(path) {
        var stat = fs.lstatSync(path);

        if (stat.isDirectory()) {
            var files = fs.readdirSync(path);            
            var f, l = files.length;
            for (var i = 0; i < l; i++) {
                f = path_module.join(path, files[i]);
                PluginLoader.loadModules(f);
            }
        } else {
            console.log("INFO - Found plugin on path: " + path);
            modules.push(require(path));
        }
    }
    getPlugins() {
        this.init();
        return modules;
    }
    init() {
        var DIR = path_module.join(__dirname, '../markdown-webserver-modules');
        PluginLoader.loadModules(DIR);
    }
}

module.exports = new PluginLoader();