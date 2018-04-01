class SearchContentGenerator {
    init(dirLoader, searchEngine, templEngine, path) {
        this.dirLoader = dirLoader;
        this.searchEngine = searchEngine;
        this.templEngine = templEngine;
        this.path = path;
        console.log("SearchContentGenerator - " + this.dirLoader);
        return this;
    }

    generateContent() {
        var query = decodeURIComponent(this.path);
        var results = this.searchEngine.doSearch(this.dirLoader.getLeafArray(), query);
        return this.templEngine.renderSearchContent({query: query, results: results});
    }
}

module.exports = new SearchContentGenerator();