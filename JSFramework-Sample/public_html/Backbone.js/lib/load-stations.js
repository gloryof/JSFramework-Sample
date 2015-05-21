var mediator = {};
_.extend(mediator, Backbone.Events);

var SearchView = Backbone.View.extend({
    el: "form#search-form",
    condition: {
        areaValue: "",
        areas: [],
        prefectureValue: "",
        prefectures: [],
        lineValue: "",
        lines: []
    },
    events: {
        "change .area": "changeArea",
        "change .prefecture": "changePrefecture",
        "change .lines": "changeLine"
    },
    initialize: function (event) {
        var self = this;
        _.bindAll(this, "render", "changeArea", "changePrefecture", "changeLine");

        $.ajax({
            data: {method: "getAreas"},
            dataType: "jsonp",
            method: "GET",
            url: "http://express.heartrails.com/api/json"
        }).done(function (data) {
            self.condition.areas = data.response.area;
            self.render();
        });

        var $prefectures = this.$el.find(".prefecture");
        this._appendOptions($prefectures, []);

        var $lines = this.$el.find(".lines");
        this._appendOptions($lines, []);
    },
    render: function () {

        var $areas = this.$el.find(".area");
        this._appendOptions($areas, this.condition.areas);
        $areas.val(this.condition.areaValue);

        if (this.condition.prefectureValue === "") {
            var $prefectures = this.$el.find(".prefecture");
            this._appendOptions($prefectures, this.condition.prefectures);
        }

        if (this.condition.lineValue === "") {
            var $lines = this.$el.find(".lines");
            this._appendOptions($lines, this.condition.lines);
            mediator.trigger("resetStations");
        } else {
            mediator.trigger("getStations", this.condition.lineValue);
        }
    }
    ,
    changeArea: function (event) {
        var self = this;

        this.condition.prefectures = [];
        this.condition.lines = [];

        this.condition.prefectureValue = "";
        this.condition.lineValue = "";

        this.condition.areaValue = this.$el.find(".area").val();

        if (this.condition.areaValue === "") {

            self.render();
            return;
        }

        $.ajax({
            data: {
                method: "getPrefectures",
                area: this.condition.areaValue
            },
            dataType: "jsonp",
            method: "GET",
            url: "http://express.heartrails.com/api/json"
        }).done(function (data) {
            self.condition.prefectures = data.response.prefecture;
            self.render();
        });
    },
    changePrefecture: function (event) {
        var self = this;

        this.condition.lines = [];
        this.condition.lineValue = "";

        this.condition.prefectureValue = this.$el.find(".prefecture").val();

        if (this.condition.prefectureValue === "") {

            self.render();
            return;
        }

        $.ajax({
            data: {
                method: "getLines",
                prefecture: this.condition.prefectureValue
            },
            dataType: "jsonp",
            method: "GET",
            url: "http://express.heartrails.com/api/json"
        }).done(function (data) {
            self.condition.lines = data.response.line;
            self.render();
        });
    },
    changeLine: function (event) {
        var self = this;

        this.condition.lineValue = this.$el.find(".lines").val();
        this.render();
    },
    _appendOptions: function ($targetSelect, itemValues) {

        this._setEmptyOption($targetSelect, "--");
        $.each(itemValues, function (index, item) {

            var $option = $("<option/>");
            $option.val(item);
            $option.text(item);

            $targetSelect.append($option);
        });
    },
    _setEmptyOption: function ($targetSelect, label) {

        $targetSelect.empty();

        var $option = $("<option/>");
        $option.val("");
        $option.text(label);

        $targetSelect.append($option);
    }
});

var SearchResult = Backbone.Model.extend({
    defaults: {
        prefecture: "",
        line: "",
        name: "",
        x: "",
        y: ""
    }
});

var SearchResults = Backbone.Collection.extend({
    model: SearchResult,
    parse: function (result) {

        return result.response.station;
    }
});

var SearchResultView = Backbone.View.extend({
    el: "table#station-list>tbody",
    collection: new SearchResults(),
    initialize: function (event) {
        var self = this;
        _.bindAll(this, "render", "getStations", "resetStations");

        mediator.on('resetStations', this.resetStations);
        mediator.on('getStations', this.getStations);
    },
    render: function () {
        var models = this.collection.models;
        var $targetElement = this.$el;

        $targetElement.empty();
        $.each(models, function (index, item) {
            var $tr = $("<tr/>");

            $tr.append($("<td>").text(item.get("prefecture")));
            $tr.append($("<td>").text(item.get("line")));
            $tr.append($("<td>").text(item.get("name")));
            $tr.append($("<td>").text(item.get("x")));
            $tr.append($("<td>").text(item.get("y")));

            $targetElement.append($tr);
        });
    },
    getStations: function (lineValue) {

        this.collection.fetch({
            url: "http://express.heartrails.com/api/json",
            data: {
                method: "getStations",
                line: lineValue
            },
            dataType: "jsonp",
            success: this.render
        });
    },
    resetStations: function () {
        this.collection = new SearchResults();
        this.render();
    }
});

var seerchView = new SearchView();
var serachResultView = new SearchResultView();