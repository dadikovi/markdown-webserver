var marked = require('marked');

class BasicContentGenerator {
    init(dirLoader, path) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        this.path = path;
        return this;
    }

    generateContent() {
        try {
            var content_raw = this.dirLoader.getContent(this.path);
        } catch (e) {
            if (e.reason !== undefined && e.reason === "NOT_FOUND") {
                return marked(this.ErrorHandler.getNotFoundContent(this.dirLoader));
            }
        }

        if (content_raw === undefined || content_raw === null) {
            return marked(this.ErrorHandler.getEmptyContent(this.dirLoader));
        }
        return marked(content_raw);
    }
}

module.exports = new BasicContentGenerator();