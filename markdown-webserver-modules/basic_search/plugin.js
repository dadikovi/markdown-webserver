var path = require('path');
var searchContentGenerator = require('./src/SearchContentGenerator');
var searchEngine = require('./src/SearchEngine');
var SEARCH_PATH = "/search/";
var SEARCH_RESULT_TEMPLATE = "searchresult.mustache";
var SEATCH_RESULT_TEMPLATE_KEY = "basic_search_searchresult";

class BasicSearch {
    init(markdownWebserverPluginContext) {
        
        this.reload(markdownWebserverPluginContext);
        
        markdownWebserverPluginContext.registerWidget({
            htmlString : this.getSearchFormHTML(), 
            widgetArea : markdownWebserverPluginContext.widgetArea.LEFT_MAIN_TOP
        });
        markdownWebserverPluginContext.registerUiScript({
            path: path.join('basic_search', 'resources', 'search.ui.js')
        });
        markdownWebserverPluginContext.registerStyle({
            path: path.join('basic_search', 'resources', 'search.css')
        });
        markdownWebserverPluginContext.registerContentGenerator(this);
        markdownWebserverPluginContext.registerTemplate(path.join(__dirname, 'templates', SEARCH_RESULT_TEMPLATE), SEATCH_RESULT_TEMPLATE_KEY);
    }

    contentGeneratorMethod(path) {
        if (path.startsWith(SEARCH_PATH)) {
            return searchContentGenerator.init(this.dirLoader, searchEngine, this.templEngine, path.substr(SEARCH_PATH.length), SEATCH_RESULT_TEMPLATE_KEY);
        } else {
            return null;
        }
    }

    reload(markdownWebserverPluginContext) {
        this.templEngine = markdownWebserverPluginContext.templEngine;
        this.dirLoader = markdownWebserverPluginContext.dirLoader;
        console.log("INFO - Search plugin reloaded. " + this.dirLoader);
    }
    
    getSearchFormHTML() {
        return "<div class=\"search-container\">\n" +
        "<input type=\"text\" placeholder=\"Search...\" name=\"search\" id=\"searchquery\">\n" +
        "<button id=\"searchbutton\" type=\"submit\"><i class=\"fa fa-search\"></i></button>\n" +
        "</div>";
    }
}

module.exports = new BasicSearch();