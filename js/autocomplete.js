AN_APP.Autocomplete = (function () {

    var utils = AN_APP.utils;

    var Autocomplete = function (param) {
        this.timerId = null;
        this.cnt_elem = null;
        this.container_elem = null;
        this.combo_elem = null;
        this.list_elem = null;
        this.input_elem = null;
        this.pattern = "";
        this.choice = "";
        this.param = param;
        this.activeItem = null;
    }

    Autocomplete.prototype = {
        constructor: AN_APP.Autocomplete,
        getData: function () {
            return this.param.source.getData({ pattern: this.pattern, num: this.param.num })
        },

        clear: function () {
            this.pattern = "";
            this.input_elem.value = "";
            this.activeItem = null;
            this.addChoicesElem();
            if (!this.activeItem) {
                this.setActiveFirst();
            }
            clearTimeout(this.timerId);
        },

        updateList: function () {
            var txt = this.input_elem.value;
            if (this.pattern !== txt) {
                this.pattern = txt;
                this.activeItem = null;
                this.addChoicesElem();
                if (!this.activeItem) {
                    this.setActiveFirst();
                }
            }

        },

        init: function () {
            this.cnt_elem = document.querySelector(this.param.selector);
            this.setChoice(this.param.source.auto_choice);
            this.prepareHtmlElem();
            this.addChoicesElem();
            this.close();
            this.appendHtmlElem();
        },

        addChoicesElem: function () {
            var data = this.getData();

            if (data.length) {
                this.list_elem.innerHTML = "";
                this.list_elem.appendChild(this.getHtmlChoiceArr(data));
            }
            else {
                this.list_elem.innerHTML = "<li> <p>No results for <span>" + this.input_elem.value + "</span></p></li>";
            }

        },
        getHtmlChoiceArr: function (chArr) {
            var docFr, i, lng = chArr.length;
            docFr = document.createDocumentFragment();
            for (i = 0; i < lng; i++) {
                docFr.appendChild(this.getHtmlChoice(chArr[i]));
            }
            return docFr;
        },
        getHtmlChoice: function (choice) {
            var elem, a_elem;
            elem = document.createElement("li");
            a_elem = document.createElement("a");
            a_elem.rel = choice.key;
            a_elem.innerHTML = choice.value;
            if (this.choice.key === choice.key) {
                a_elem.className = "ui-active";
                this.activeItem = a_elem;
            }
            elem.appendChild(a_elem);
            return elem;
        },

        overItem: function (e) {
            if (e.target.nodeName.toLowerCase() == "a") {
                this.setActive(e.target);
            }
        },
        moveNext: function () {
            var elem = this.getNextItem();
            if (elem) {
                this.setActive(elem);
            }
        },
        movePrev: function () {
            var elem = this.getPrevItem();
            if (elem) {
                this.setActive(elem);
            }
        },

        getNextItem: function () {
            var elem = this.activeItem.parentNode.nextSibling;
            return this.findAndCheckItem(elem)

        },
        getPrevItem: function () {
            var elem = this.activeItem.parentNode.previousSibling;
            return this.findAndCheckItem(elem);
        },
        findAndCheckItem: function (elem) {
            if (elem) {

                if (elem.nodeName.toLowerCase() == "li") {
                    elem = elem.firstChild;
                }
                if (elem.nodeName.toLowerCase() !== "a") {
                    elem = null
                }
            }
            return elem;
        },
        setActiveFirst: function () {
            var elem = this.list_elem.querySelector("a");

            if (elem) {
                this.setActive(elem);
            }
            else {
                this.activeItem = null;
            }
        },
        setActive: function (elem) {
            if (this.activeItem) {
                this.activeItem.className = "";
            }
            elem.className = "ui-active";
            this.activeItem = elem;
        },

        setActiveChoice: function () {
            this.setChoice({ key: this.activeItem.rel,
                value: this.activeItem.innerHTML
            });
        },
        setChoice: function (new_choice) {
            this.choice = new_choice;
            this.cnt_elem.innerHTML = this.choice.value;
            this.cnt_elem.rel = this.choice.key;
        },
        appendHtmlElem: function () {
            this.cnt_elem.parentNode.replaceChild(this.container_elem, this.cnt_elem);
            this.container_elem.insertBefore(this.cnt_elem, this.container_elem.firstChild);
        },
        prepareHtmlElem: function () {
            this.container_elem = utils.createElement("div", 'ui-autocomplete-container');
            this.cnt_elem.className = "ui-autocomplete";
            this.combo_elem = utils.createElement("div", 'ui-autocomplete-combo');
            this.list_elem = utils.createElement("ul", 'ui-autocomplete-list');
            this.input_elem = document.createElement("input");
            this.input_elem.type = "text";
            this.combo_elem.appendChild(this.input_elem);
            this.combo_elem.appendChild(this.list_elem);
            this.container_elem.appendChild(this.combo_elem);
            this.addEvents();
            this.setActiveFirst();
        },
        addEvents: function () {
            var self = this;
            utils.addEvent(this.cnt_elem, "click", function (e) { self.toggle(); });
            utils.addEvent(this.input_elem, "keyup", function (e) { self.keyCombo(e); });
            utils.addEvent(this.list_elem, "click", function (e) { self.complete(e); });
            utils.addEvent(this.input_elem, "blur", function (e) { self.inputBlur(e) });
            utils.addEvent(this.list_elem, "mouseover", function (e) { self.overItem(e); });
        },

        toggle: function () {
            if (utils.hasClass(this.cnt_elem, "ui-open")) {
                this.close();
            }
            else {
                this.open();
            }
        },

        keyCombo: function (e) {
            var self = this;
            switch (e.keyCode) {
                case utils.KEY.ENTER: this.complete(e);
                    break;
                case utils.KEY.DOWN: this.moveNext();
                    break;
                case utils.KEY.UP: this.movePrev();
                    break;
                default: self.updateList();
                    break;
            }
        },
        inputBlur: function (e) {
            this.closeWithDelay();
        },
        complete: function (e) {
            if (e.target.nodeName.toLowerCase() !== "a" && e.target.nodeName.toLowerCase() !== "input") {
                return false;
            }

            this.setActiveChoice();
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            this.close();
        },

        closeWithDelay: function () {
            var self = this;
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            this.timerId = setTimeout(function () { self.close() }, 150)

        },
        close: function (e) {
            utils.addClass(this.combo_elem, "hidden");
            utils.removeClass(this.cnt_elem, "ui-open");
        },
        open: function (e) {
            this.clear();
            utils.addClass(this.cnt_elem, "ui-open");
            utils.removeClass(this.combo_elem, "hidden");
            if (!this.activeItem) {
                this.setActiveFirst();
            }
            this.input_elem.focus();
        }
    };

    return Autocomplete;
} ());






