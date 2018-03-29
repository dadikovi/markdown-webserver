class PluginLoader {
    constructor() {
        this.modules = [];
    }
    loadModules(path) {
        fs.lstat(path, function(err, stat) {
            if (stat.isDirectory()) {
                fs.readdir(path, function(err, files) {
                    var f, l = files.length;
                    for (var i = 0; i < l; i++) {
                        f = path_module.join(path, files[i]);
                        loadModules(f);
                    }
                });
            } else {
                this.modules.append(require(path));
            }
        });
    }
    getPlugins() {
        this.init();
        return this.modules;
    }
    init() {
        var DIR = path_module.join(__dirname, 'markdown-webserver-modules');
        loadModules(DIR);
    }
}

module.exports = new PluginLoader();