class SearchContentGenerator {
    init(dirLoader, searchEngine, templEngine, path) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        this.searchEngine = searchEngine;
        this.templEngine = templEngine;
        this.path = path;
        return this;
    }

    generateContent() {
        var query = decodeURIComponent(this.path);
        var results = this.searchEngine.doSearch(this.dirLoader.getLeafArray(), query);
        return this.templEngine.renderSearchContent({query: query, results: results});
    }
}

module.exports = new SearchContentGenerator();