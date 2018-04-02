var fs = require('fs');
const path = require('path');
var BreakException = {};
var NotFoundException = {
    reason: "NOT_FOUND"
};

class DirectoryLoader {

    static get REFRESH_TIMEOUT() {
        return 5 * 60 * 1000;
    }

    init(server) {
        this.server = server;
    }

    /**
     * This is the main method which reads the given root directory and parse it.
     * @param {*} rootPath 
     */
    parseDir(rootPath) {
        this.handleGitRepo(rootPath);

        var dirName = this.parseName(rootPath);
        this.templateDir = null;
        this.markdownStructure = {
            name: dirName,
            files: this.discover(rootPath, "", [])
        };

        this.server.directoryReloaded();

        this.scheduleNextParse(this, rootPath);
    }

    handleGitRepo(root) {
        if (this.isGitRepo) {
            try {
                require('simple-git')(root).pull(function () {
                    console.log("INFO - Successfully pulled git repo.");
                });
            } catch (e) {
                console.log("WARNING - error during git repo pull: " + e);
            }
        }
    }

    scheduleNextParse(dirLoader, rootPath) {
        setTimeout(function () {
            dirLoader.parseDir(rootPath);
        }, DirectoryLoader.REFRESH_TIMEOUT);
        console.log("INFO - state refreshed.");
    }

    discover(dir, rel, mdStruct) {
        var mdStruct = mdStruct || [];
        var files = fs.readdirSync(dir);
        var dirLoader = this;

        files.forEach(function (file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                if (file === ".markdown-webserver") {
                    console.log("INFO - user-defined templates found!");
                    dirLoader.templateDir = {
                        files: dirLoader.discover(path.join(dir, file), rel + "/" + file, [])
                    };
                } else if (file === ".git") {
                    dirLoader.isGitRepo = true;
                } else {
                    mdStruct.push({
                        name: file,
                        path: null,
                        content: null,
                        files: dirLoader.discover(path.join(dir, file), rel + "/" + file, [])
                    });
                    if (mdStruct[mdStruct.length - 1].files.length === 0) {
                        mdStruct.splice(mdStruct.length - 1, 1);
                    }
                }
            } else {
                if (file.match(/\.(md|txt|markdown)$/i)) {
                    mdStruct.push({
                        name: file,
                        path: rel + "/" + file,
                        content: fs.readFileSync(path.join(dir, file), 'utf8'),
                        files: null
                    });
                }
            }
        });

        return mdStruct.sort(this.compareDirectory);
    }

    getMarkdownStructure() {
        return this.markdownStructure;
    }

    getLeafArray() {
        var array = [];
        DirectoryLoader.doRecursive(this.markdownStructure, function (file) {
            if (file.files === null) {
                array.push(file);
            }
        });

        return array;
    }

    getContent(path) {
        var levels = path.split("/");
        var content_i = this.markdownStructure;
        for (var i = 0; i < levels.length; i++) {
            content_i = this.get(content_i, decodeURIComponent(levels[i]));
            content_i.isSelectedParent = true;
        }
        content_i.isSelectedParent = false;
        content_i.isSelected = true;
        return content_i.content;
    }

    reset() {
        this.resetSelectedState();
    }

    resetSelectedState() {
        DirectoryLoader.doRecursive(this.markdownStructure, function (file) {
            file.isSelected = false;
            file.isSelectedParent = false;
        })
    }

    static doRecursive(element, method) {
        element.files.forEach(function (file) {
            method(file);
            if (file.files !== null) {
                DirectoryLoader.doRecursive(file, method);
            }
        });
    }

    getUserTemplate(key) {
        return this.get(this.templateDir, key);
    }

    get(struct, key) {
        var value = undefined;

        try {
            struct.files.forEach(function (file) {
                if (file.name === key) {
                    value = file;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (value === undefined) {
            console.log("WARNING! Requested key did not found: " + key);
            throw NotFoundException;
        } else {
            return value;
        }
    }

    parseName(rootPath) {
        return path.basename(rootPath);
    }

    compareDirectory(a, b) {
        if (a.files !== null && b.files === null) {
            return -1;
        } else if (b.files !== null && a.files === null) {
            return 1;
        } else {
            return a.name - b.name;
        }
    }
};

module.exports = new DirectoryLoader();