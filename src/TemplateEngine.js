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
        }
        ];
    }
    init() {
        if(!this.inited) {
            this.templates.forEach(function (template) {
                template.content = fs.readFileSync("templates/" + template.name + ".mustache", "utf8");
            });
            this.inited = true;
        }
    }
    addPluginTemplates(pluginTemplates) {
        for (var i = 0; i < pluginTemplates.length; i++) {
            this.templates.push({
                name: pluginTemplates[i].key,
                content: fs.readFileSync(pluginTemplates[i].file, "utf8")
            });
        }
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
    abstractRender(name, data) {
        return Mustache.to_html(Mustache.to_html(this.getTemplateContent(name), data), data);
    }
    renderMain(data) {
        return this.abstractRender("main", data);
    }
};

module.exports = new TemplateEngine();