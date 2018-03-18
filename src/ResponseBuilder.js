var marked = require('marked');

class ResponseBuilder {
    init(dirLoader) {
        this.response = {};
        this.dirLoader = dirLoader;
        this.templEngine = require('./TemplateEngine');
        this.ErrorHandler = require('./ErrorHandler');
        this.contentGenFactory = require('./ContentGeneratorFactory');
        this.marked = marked;

        this.templEngine.init();
        this.contentGenFactory.init(this.templEngine);

        return this;
    }
    /** 
     * This should be called when a http request arrives. 
     */
    reset() {
        this.dirLoader.reset();
        return this;
    }

    /** 
     * Adds site name to the response object.
     */
    addName() {
        this.response.name = this.dirLoader.getMarkdownStructure().name;
        return this;
    }
    /**
     * Adds the content-part of site. Normally this a parsed markdown file, but also can be error message.
     * @param {*} path - the path-part of URL.
     */
    addContent(path) {
        var generator = this.contentGenFactory.getContentGenerator(path, this.dirLoader);
        this.response.content = marked(generator.generateContent());
        return this;
    }

    /** 
     * Adds the copyright information to the response object.
     * The information can be declared in `COPYRIGHT.md` user template.
     */
    addCopyRight() {
        var copy = "";
        try {
            copy_raw = this.dirLoader.getUserTemplate("COPYRIGHT.md");
            copy = this.marked(copy_raw.content);
        } catch (e) { }

        this.response.copyright = copy;
        return this;
    }

    /** 
     * Adds the left part of the screen (explorer menu).
     */
    addExplorer() {
        this.response.explorer = this.templEngine.renderExplorer(this.dirLoader.getMarkdownStructure());
        return this;
    }

    /** 
     * Renders the response object to HTML source and returns it.
     */
    toHtml() {
        return this.templEngine.renderMain(this.response);
    }
};

module.exports = new ResponseBuilder();