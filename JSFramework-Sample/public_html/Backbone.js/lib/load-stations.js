var mediator = {};
_.extend(mediator, Backbone.Events);

var appendOptions = function ($targetSelect, itemValues) {

    setEmptyOption($targetSelect, "--");
    $.each(itemValues, function (index, item) {

        var $option = $("<option/>");
        $option.val(item);
        $option.text(item);

        $targetSelect.append($option);
    });
};
var setEmptyOption = function ($targetSelect, label) {

    $targetSelect.empty();

    var $option = $("<option/>");
    $option.val("");
    $option.text(label);

    $targetSelect.append($option);
};

var Area = Backbone.Model.extend({
    url: "http://express.heartrails.com/api/json",
    defaults: {
        value: "",
        list: []
    },
    parse: function (data) {

        return {
            value: this.get("value"),
            list: data.response.area
        };
    }
});

var Prefecture = Backbone.Model.extend({
    url: "http://express.heartrails.com/api/json",
    defaults: {
        value: "",
        list: []
    },
    parse: function (data) {

        return {
            value: this.get("value"),
            list: data.response.prefecture
        };
    },
    reset: function () {
        this.set("value", "");
        this.set("list", []);
    }
});

var Line = Backbone.Model.extend({
    url: "http://express.heartrails.com/api/json",
    defaults: {
        value: "",
        list: []
    },
    parse: function (data) {

        return {
            value: this.get("value"),
            list: data.response.line
        };
    },
    reset: function () {
        this.set("value", "");
        this.set("list", []);
    }
});

var SearchView = Backbone.View.extend({
    el: "form#search-form",
    condition: {
        area: new Area(),
        prefecture: new Prefecture(),
        line: new Line()
    },
    events: {
        "change .area": "changeArea",
        "change .prefecture": "changePrefecture",
        "change .lines": "changeLine"
    },
    initialize: function (event) {
        var self = this;
        _.bindAll(this, "render", "changeArea", "changePrefecture", "changeLine");

        var $prefectures = this.$el.find(".prefecture");
        appendOptions($prefectures, []);

        var $lines = this.$el.find(".lines");
        appendOptions($lines, []);

        this.condition.area.fetch({
            data: {method: "getAreas"},
            dataType: "jsonp",
            method: "GET",
            success: this.render
        });
    },
    render: function () {

        var $areas = this.$el.find(".area");
        appendOptions($areas, this.condition.area.get("list"));
        $areas.val(this.condition.area.get("value"));

        if (this.condition.prefecture.get("value") === "") {
            var $prefectures = this.$el.find(".prefecture");
            appendOptions($prefectures, this.condition.prefecture.get("list"));
        }

        if (this.condition.line.get("value") === "") {
            var $lines = this.$el.find(".lines");
            appendOptions($lines, this.condition.line.get("list"));
            mediator.trigger("resetStations");
        } else {
            mediator.trigger("getStations", this.condition.line.get("value"));
        }
    }
    ,
    changeArea: function (event) {
        var self = this;

        var selectedArea = this.$el.find(".area").val();
        this.condition.prefecture.reset();
        this.condition.line.reset();

        this.condition.area.set("value", selectedArea);

        if (selectedArea === "") {

            self.render();
            return;
        }

        this.condition.prefecture.fetch({
            data: {
                method: "getPrefectures",
                area: selectedArea
            },
            dataType: "jsonp",
            method: "GET",
            success: this.render
        });
    },
    changePrefecture: function (event) {
        var self = this;

        this.condition.line.reset();

        var selectedPrefecture = this.$el.find(".prefecture").val();
        this.condition.prefecture.set("value", selectedPrefecture);

        if (selectedPrefecture === "") {

            self.render();
            return;
        }

        this.condition.line.fetch({
            data: {
                method: "getLines",
                prefecture: selectedPrefecture
            },
            dataType: "jsonp",
            method: "GET",
            success: this.render
        });
    },
    changeLine: function (event) {

        var selectedLine = this.$el.find(".lines").val();
        this.condition.line.set("value", selectedLine);
        this.render();
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
    url: "http://express.heartrails.com/api/json",
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