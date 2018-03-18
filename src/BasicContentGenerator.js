class BasicContentGenerator {
    init(dirLoader, path) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        this.path = path;
        return this;
    }

    generateContent() {
        try {
            var content = this.dirLoader.getContent(this.path);
        } catch (e) {
            if (e.reason !== undefined && e.reason === "NOT_FOUND") {
                return this.ErrorHandler.getNotFoundContent(this.dirLoader);
            }
        }

        if (content === undefined || content === null) {
            return this.ErrorHandler.getEmptyContent(this.dirLoader);
        }
        return content;
    }
}

module.exports = new BasicContentGenerator();