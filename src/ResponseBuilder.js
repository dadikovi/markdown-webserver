var marked = require('marked');
var widgetArea = require('./WidgetArea');

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
            var copy_raw = this.dirLoader.getUserTemplate("COPYRIGHT.md");
            copy = this.marked(copy_raw.content);
        } catch (e) {
            console.log("WARNING - copyright information was not found or could not be parsed!");
            console.log(e);
        }

        this.response.copyright = copy;
        return this;
    }

    /** 
     * Adds the HTML source of search form into the response object. 
     */
    addWidgets() {
        this.response.widgets_lmt = "";
        for(var i = 0; i<this.widgets.length; i++) {
            var widget = this.widgets[i];
            if(widget.widgetArea === widgetArea.LEFT_MAIN_TOP) {
                this.response.widgets_lmt += " " + widget.htmlString;
            }
        }
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

    registerWidgets(widgets) {
        this.widgets = widgets;
    }
};

module.exports = new ResponseBuilder();