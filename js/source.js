AN_APP.source.auto_choice = { key: "city_0", value: "Korkino" };
AN_APP.source.list = [{ key: "city_NY", value: "NY" },
    { key: "city_0", value: "Korkino" },
    { key: "city_M", value: "Moscow" },
    { key: "city_K1", value: "Kiev" },
    { key: "city_O", value: "Odessa" },
    { key: "city_2", value: "Donetsk" },
    { key: "city_3", value: "Cherkassy" },
    { key: "city_4", value: "Kirovograd" },
    { key: "city_5", value: "Chernigiv" },
    { key: "city_6", value: "Chernivzi" },
    { key: "city_7", value: "Kovel" }
    ];
AN_APP.source.getData = function (param) {
    return this.list.filter(this.filterPattern, param).slice(0, param.num);
};

AN_APP.source.filterPattern = function (element) {
    var re = new RegExp("^" + this.pattern, "i");
    return re.test(element.value);
};