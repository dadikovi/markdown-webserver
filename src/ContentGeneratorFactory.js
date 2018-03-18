var marked = require('marked');
var EMPTY_STRING = "";
var EMPTY_PATH = "/";
var SEARCH_PATH = "/search/";

class ContentGeneratorFactory {
    init(templateEngine) {
        this.defaultContentGenerator = require('./DefaultContentGenerator');
        this.basicContentGenerator = require('./BasicContentGenerator');
        this.searchContentGenerator = require('./SearchContentGenerator');
        
        this.searchEngine = require('./SearchEngine');
        this.templEngine = templateEngine;
    }

    getContentGenerator(path, dirLoader) {
        if (path === EMPTY_PATH || path === EMPTY_STRING) {
            return this.defaultContentGenerator.init(dirLoader);
        } else if (path.startsWith(SEARCH_PATH)) {
            return this.searchContentGenerator.init(dirLoader, this.searchEngine, this.templEngine, path.substr(SEARCH_PATH.length));
        } else if (path.startsWith(EMPTY_PATH)) {
            return this.basicContentGenerator.init(dirLoader, path.substr(EMPTY_PATH.length));
        }
    }
}

module.exports = new ContentGeneratorFactory();