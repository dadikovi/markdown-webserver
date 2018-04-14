var GIT_RELOAD_PATH = "/git_reload/";
var path = require('path');

class Git {
    init(markdownWebserverPluginContext) {
        
        this.reload(markdownWebserverPluginContext);
        
        markdownWebserverPluginContext.registerWidget({
            htmlString : this.getUiHtml(), 
            widgetArea : markdownWebserverPluginContext.widgetArea.LEFT_MAIN_TOP
        });

        markdownWebserverPluginContext.registerResponseBuilder(this);

        markdownWebserverPluginContext.registerUiScript({
            path: path.join('git', 'resources', 'script.ui.js')
        });

        markdownWebserverPluginContext.registerContentGenerator(this);
    }

    getUiHtml() {
        return "<a title=\"Click here to refresh immediately.\" onclick=\"refresh();\" style=\"margin: -20px 40px 30px 40px; color: #000; cursor: pointer; display: block;\">" + 
                    "<img src=\"/markdown-webserver-modules/git/resources/git.png\" style=\"height: 20px;\"> " + 
                    "Last refreshed: {{lastRefreshTime}}" + 
                "</a>";
    }

    reload(markdownWebserverPluginContext) {
        this.templEngine = markdownWebserverPluginContext.templEngine;
        this.dirLoader = markdownWebserverPluginContext.dirLoader;
        console.log("INFO - Git plugin reloaded.");
    }

    addResponseFields(response) {
        response.lastRefreshTime = this.parseTime(this.dirLoader.lastReload);
    }

    parseTime(time) {
        return this.addZero(time.getHours()) + ":" + this.addZero(time.getMinutes());
    }

    addZero(digit) {
        if(digit < 10) {
            return "0" + digit;
        } else {
            return "" + digit;
        }
    }

    contentGeneratorMethod(path) {
        if (path.startsWith(GIT_RELOAD_PATH)) {
            this.dirLoader.parseDir(this.dirLoader.rootPath, false);
            return {
                generateContent: function() {
                    return "# Git repository pulled successfully.\nHowever, this URL should be called only with AJAX request.";
                }
            };
        } else {
            return null;
        }
    }
}

module.exports = new Git();