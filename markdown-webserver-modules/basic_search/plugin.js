var path = require('path');

class BasicSearch {
    init(markdownWebserverPluginContext) {
        markdownWebserverPluginContext.registerWidget({
            htmlString : this.getSearchFormHTML(), 
            widgetArea : markdownWebserverPluginContext.widgetArea.LEFT_MAIN_TOP
        });
        markdownWebserverPluginContext.registerUiScript({
            path: path.join(__dirname, 'resources/search.ui.js')
        });
        markdownWebserverPluginContext.registerStyle({
            path: path.join(__dirname, 'resources/search.css')
        });
    }
    
    getSearchFormHTML() {
        return "<div class=\"search-container\">\n" +
        "<input type=\"text\" placeholder=\"Search...\" name=\"search\" id=\"searchquery\">\n" +
        "<button id=\"searchbutton\" type=\"submit\"><i class=\"fa fa-search\"></i></button>\n" +
        "</div>";
    }
}

module.exports = new BasicSearch();