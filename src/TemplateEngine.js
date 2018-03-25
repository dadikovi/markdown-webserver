var fs = require('fs');
const path = require('path');
var Mustache = require('mustache');

class TemplateEngine {
    constructor() {
        this.templates = [{
                name: "explorer",
                content: null
            },
            {
                name: "main",
                content: null
            },
            {
                name: "searchresult",
                content: null
            },
            {
                name: "searchform",
                content: null
            }
        ];
    }
    init() {
        this.templates.forEach(function (template) {
            template.content = fs.readFileSync("templates/" + template.name + ".mustache", "utf8");
        });
    }
    getTemplateContent(name) {
        var ret = "";
        this.templates.forEach(function (template) {
            if (template.name === name) {
                ret = template.content;
            }
        });

        if (ret === "") {
            console.log("WARNING! Template with name " + name + " was not found!");
        }

        return ret;
    }
    renderExplorer(data) {
        return Mustache.to_html(this.getTemplateContent("explorer"), data, {
            explorer: this.getTemplateContent("explorer")
        });
    }
    renderMain(data) {
        return Mustache.to_html(this.getTemplateContent("main"), data);
    }
    renderSearchContent(data) {
        return Mustache.to_html(this.getTemplateContent("searchresult"), data);
    }
    renderSearchForm() {
        return  Mustache.to_html(this.getTemplateContent("searchform"), {});
    }
};

module.exports = new TemplateEngine();