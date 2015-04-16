(function ($) {

    var appendOptions = function ($targetSelect, itemValues) {
        $targetSelect.empty();

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

    var callApi = function (paramData, doneFunc) {

        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: paramData
        }).done(doneFunc);
    };

    var RailsSearcher = function ($form, $table) {
        var self = this;
        this._$form = $form;
        this._$areas = $form.find(".area");
        this._$prefecture = $form.find(".prefecture");
        this._$lines = $form.find(".lines");
        this._areas = new RailsSelector(this._$areas);
        this._prefecture = new RailsSelector(this._$prefecture);
        this._lines = new RailsSelector(this._$lines);
        this._resultTable = new ResultTable($table);

        this.init = function () {
            self._$areas.on("change", self._selectArea);
            self._$prefecture.on("change", self._selectPrefecture);
            self._$lines.on("change", self._selectLines);

            var apiParam = {method: "getAreas"};

            callApi(
                apiParam,
                function (data) {
                    self._areas.loadData(data.response.area);
                    self._prefecture.initData();
                    self._lines.initData();
                    self._resultTable.reset();
                }
            );
        };

        this._selectArea = function (event) {

            var selectValue = self._areas.getSelectValue();

            if (selectValue === "") {

                self._prefecture.initData();
                self._lines.initData();
                self._resultTable.reset();

                return;
            }

            var apiParam = {
                method: "getPrefectures",
                area: selectValue
            };

            callApi(
                apiParam,
                function (data) {

                    self._prefecture.loadData(data.response.prefecture);
                    self._lines.initData();
                }
            );
        };

        this._selectPrefecture = function (event) {

            var selectValue = self._prefecture.getSelectValue();

            if (selectValue === "") {

                self._lines.initData();

                return;
            }

            var apiParam = {
                method: "getLines",
                prefecture: selectValue
            };

            callApi(
                apiParam,
                function (data) {

                    self._lines.loadData(data.response.line);
                    self._resultTable.reset();
                }
            );
        };

        this._selectLines = function (event) {

            var selectValue = self._lines.getSelectValue();

            self._resultTable.reset();

            if (selectValue === "") {
                return;
            }

            var apiParam = {
                method: "getStations",
                line: selectValue
            };

            callApi(
                apiParam,
                function (data) {

                    self._resultTable.loadData(data.response.station);
                }
            );
        };
    };

    var RailsSelector = function ($targetSelect) {
        this._$target = $targetSelect;
        this.getSelectValue = function () {
            return this._$target.val();
        };
        this.loadData = function (dataArray) {
            appendOptions(this._$target, dataArray);
        };
        this.initData = function () {
            setEmptyOption(this._$target, "--");
        };
    };

    var ResultTable = function ($targetTable) {
        var self = this;
        this._$table = $targetTable;
        this._$tbody = $targetTable.find("tbody");
        this.reset = function () {
            this._$tbody.empty();
        };
        this.loadData = function (stationArray) {

            $.each(stationArray, function (index, item) {
                var $tr = $("<tr>");

                $tr.append($("<td>").text(item.prefecture));
                $tr.append($("<td>").text(item.line));
                $tr.append($("<td>").text(item.name));
                $tr.append($("<td>").text(item.x));
                $tr.append($("<td>").text(item.y));

                self._$tbody.append($tr);
            });
        };
    };

    $(document).ready(function (event) {
        var searcher = new RailsSearcher($("#search-form"), $(".station-list"));
        searcher.init();
    });
})($);