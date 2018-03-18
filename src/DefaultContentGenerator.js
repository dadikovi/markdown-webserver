var marked = require('marked');

class DefaultContentGenerator {
    init(dirLoader) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        return this;
    }

    generateContent() {
        return marked(this.ErrorHandler.getDefaultContent(this.dirLoader));
    }
}

module.exports = new DefaultContentGenerator();