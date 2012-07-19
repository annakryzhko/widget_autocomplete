

AN_APP.utils.addEvent = function (elem, type, handler, isCaptured) {
    isCaptured = isCaptured || false;
    elem.addEventListener(type, handler, isCaptured);
}
AN_APP.utils.removeEvent = function (elem, type, handler, isCaptured) {
    isCaptured = isCaptured || false;
    elem.removeEventListener(type, handler, isCaptured);
}

AN_APP.utils.addClass = function (elem, classAdd) {
    if (!this.hasClass(elem, classAdd)) {
        elem.className += " " + classAdd;
    }
}
AN_APP.utils.hasClass = function (elem, class_) {
    var re = new RegExp("\\b" + class_ + "\\b", "gi");
    return re.test(elem.className);
}
AN_APP.utils.removeClass = function (elem, classReplace) {
    var re = new RegExp("\\b" + classReplace + "\\b", "gi");
    elem.className = elem.className.replace(re, "");
}
AN_APP.utils.createElement = function (tagName, className) {
    var elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}
AN_APP.utils.KEY = { ENTER: 13, UP: 38, DOWN: 40 }



