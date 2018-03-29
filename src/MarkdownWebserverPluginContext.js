module.exports = class MarkdownWebserverPluginContext {
    constructor(builder) {
        this.widgetArea = require('./WidgetArea');
        this.dirLoader = builder.dirLoader;
        this.markdownWebserver = builder.markdownWebserver;
        this.widgets = [];
        this.responseHooks = [];
    }
    static get Builder() {
        class Builder {
            addMarkdownWebserver(markdownWebserver) {
                this.markdownWebserver = markdownWebserver;
                return this;
            }
            addDirLoader(dirLoader) {
                this.dirLoader = dirLoader;
                return this;
            }
            build() {
                return new MarkdownWebserverPluginContext(this);
            }
        }

        return new Builder();
    }    

    /**
     * Registers a new widget. A widget is a custom html code which will be rendered in the given widget area.
     * As widget area a field of this.widgetArea must be passed.
     * @param {*} widget - required format: { htmlString, widgetArea }
     */
    registerWidget(widget) {
        this.widgets.push(widget);
    }
}