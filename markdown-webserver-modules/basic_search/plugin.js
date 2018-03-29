class BasicSearch {
    init(markdownWebserverPluginContext) {
        markdownWebserverPluginContext.registerWidget(this.getSearchFormHTML(), markdownWebserverPluginContext.widgetArea.LEFT_MAIN_TOP);
    }
    
    getSearchFormHTML() {
        return "<div class=\"search-container\">\n" +
        "<input type=\"text\" placeholder=\"Search...\" name=\"search\" id=\"searchquery\">\n" +
        "<button id=\"searchbutton\" type=\"submit\"><i class=\"fa fa-search\"></i></button>\n" +
        "</div>";
    }
}

module.exports = new BasicSearch();