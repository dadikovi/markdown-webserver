var marked = require('marked');

class ContentGeneratorFactory {
    init() {
        this.defaultContentGenerator = require('./DefaultContentGenerator');
        this.basicContentGenerator = require('./BasicContentGenerator');
    }

    getContentGenerator(path, dirLoader) {
        if (path === "/" || path === "") {
            return this.defaultContentGenerator.init(dirLoader);
        } else if (path.startsWith("/")) {
            return this.basicContentGenerator.init(dirLoader, path.substr(1));
        }
    }
}

module.exports = new ContentGeneratorFactory();