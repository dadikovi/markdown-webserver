var NO_RESULTS = -1;

/** 
 * Very simple search implementation:
 *  - Does not order the results.
 *  - It can find only full matches.
 *  - It can find only the first match in a given file.
 * Should be evolved.
 */
class SearchEngine {
    doSearch(mdArray, query) {
        var resultArray = [];

        for (var i = 0; i < mdArray.length; i++) {
            var file = mdArray[i];
            var at = file.content.search(query);
            if (at !== NO_RESULTS) {
                resultArray.push(this.createResultObject(file, query, at));
            }
        }

        return resultArray;
    }

    createResultObject(file, query, at) {
        return {
            name: this.calculateName(file, query),
            path: file.path,
            content: this.calculateContent(file, query, at)
        };
    }

    calculateName(file, query) {
        var dotPos = file.name.lastIndexOf(".");
        var printableName = file.name.substring(0, dotPos);
        return printableName.replace(query, "<span class=\"match\">" + query + "</span>");
    }

    calculateContent(file, query, at) {
        var lineStart = this.getLineStart(file.content, at);
        var lineEnd = this.getLineEnd(file.content, at);
        var line = file.content.substring(lineStart, lineEnd);
        return line.replace(query, "<span class=\"match\">" + query + "</span>");
    }

    getLineStart(text, pos) {
        var textBefore = text.substring(0, pos);
        return textBefore.lastIndexOf("\n");
    }

    getLineEnd(text, pos) {
        var textAfter = text.substring(pos);
        return textAfter.search("\n") + pos;
    }
}

module.exports = new SearchEngine();