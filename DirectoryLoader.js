var fs = require('fs');
const path = require('path');
var BreakException = {};
var NotFoundException = {reason: "NOT_FOUND"};

module.exports = class DirectoryLoader {

    parseDir(rootPath) {
        var dirName = this.parseName(rootPath);
        this.markdownStructure = {name: dirName, files: DirectoryLoader.discover(rootPath, "", [])};
    }

    static discover(dir, rel, mdStruct) {
        var mdStruct = mdStruct || [];
        var files = fs.readdirSync(dir);

        files.forEach(function(file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                mdStruct.push({
                     name: file, 
                     path: null, 
                     content: null, 
                     files: DirectoryLoader.discover(path.join(dir, file), rel+"/"+file, [])});
            }
            else {
                mdStruct.push({
                    name: file, 
                    path: rel+"/"+file,
                    content: fs.readFileSync(path.join(dir, file), 'utf8'),
                    files:null});
            }
        });

        return mdStruct;
    }

    getMarkdownStructure() {
        return this.markdownStructure;
    }

    getContent(path) {
        var levels = path.split("/");
        var content_i = this.markdownStructure;
        for(var i=0; i<levels.length; i++) {
            content_i = this.get(content_i, decodeURIComponent(levels[i]));
        }
        console.log(content_i.content);
        return content_i.content;
    }

    get(struct, key) {
        var value = undefined;

        try {
            struct.files.forEach(function(file){
                if(file.name === key) {
                    value = file;
                    throw BreakException;
                }
            });
        } catch(e) {
            if(e !== BreakException) throw e;
        }

        if(value === undefined) {
            console.log("WARNING! Requested key did not found: " + key);
            throw NotFoundException;
        } else {
            return value;
        }
    }

    parseName(rootPath) {
        return path.basename(rootPath);
    }
};