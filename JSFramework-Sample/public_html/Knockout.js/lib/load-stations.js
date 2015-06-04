var searchForm = {
    areas: ko.observableArray([]),
    prefectures: ko.observableArray([]),
    lines: ko.observableArray([]),
    stations: ko.observableArray([]),

    areaValue: ko.observable(""),
    prefectureValue: ko.observable(""),
    lineValue: ko.observable(""),

    initilize: function () {

        var self = this;
        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: {method: "getAreas"}
        }).done(function (data) {
            self.areas(data.response.area);
        });
    },
    selectArea: function () {

        var self = this;

        this._resetPrefecture();
        this._resetLine();
        this._resetStation();

        var selectedValue = this.areaValue();

        if (selectedValue == null || selectedValue == "") {

            return false;
        }

        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: {
                method: "getPrefectures",
                area: selectedValue
            }
        }).done(function (data) {
            self.prefectures(data.response.prefecture);
        });
    },
    selectPrefecture: function () {

        var self = this;

        this._resetLine();
        this._resetStation();

        var selectedValue = this.prefectureValue();

        if (selectedValue == null || selectedValue == "") {

            return false;
        }

        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: {
                method: "getLines",
                prefecture: selectedValue
            }
        }).done(function (data) {
            self.lines(data.response.line);
        });
    },
    selectLines: function () {

        var self = this;

        this._resetStation();

        var selectedValue = this.lineValue();

        if (selectedValue == null || selectedValue == "") {

            return false;
        }

        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: {
                method: "getStations",
                line: selectedValue
            }
        }).done(function (data) {
            self.stations(data.response.station);
        });
    },
    _resetPrefecture: function () {
        this.prefectures([]);
        this.prefectureValue("");
    },
    _resetLine: function () {
        this.lines([]);
        this.lineValue("");
    },
    _resetStation: function () {
        this.stations([]);
    }
};

ko.applyBindings(searchForm);
searchForm.initilize();
