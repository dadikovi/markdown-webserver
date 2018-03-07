function collapseAll() {
    document.querySelectorAll("li.expandable > p").forEach(function(obj){
        collapse(obj);
    })
}
function collapse(obj) {
    parent = obj.parentNode;
    parent.classList.add("explorer-collapsed");
    obj.setAttribute("onClick", "expand(this);");
}
function expand(obj) {
    parent = obj.parentNode;
    parent.classList.remove("explorer-collapsed");
    obj.setAttribute("onClick", "collapse(this);");
}

console.log("UI started.");
collapseAll();