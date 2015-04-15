(function ($) {

    var $form = $("#search-form");
    var $area = $form.find(".area");
    var $prefecture = $form.find(".prefecture");
    var $lines = $form.find(".lines");
    var $stationList = $(".station-list");

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

    $area.on("init-data", function (event, areaData) {
        var $self = $(this);

        var areaArray = areaData.area;
        appendOptions($self, areaArray);

        $prefecture.trigger("load-data", $self.val());
        $lines.trigger("init-data");
    });

    $area.on("change", function (event) {
        var $self = $(this);

        $prefecture.trigger("load-data", $self.val());
        $lines.trigger("init-data");
    });

    $prefecture.on("load-data", function (event, areaName) {
        var $self = $(this);

        if (areaName === "") {
            setEmptyOption($self, "--");
            return;
        }

        callApi(
            {
                method: "getPrefectures",
                area: areaName
            },
        function (data) {
            var prefectureArray = data.response.prefecture;
            appendOptions($self, prefectureArray);
            $lines.trigger("load-data", $self.val());
        }
        );
    });

    $prefecture.on("change", function (event) {
        var $self = $(this);

        $lines.trigger("load-data", $self.val());
    });

    $lines.on("init-data", function (event) {
        var $self = $(this);
        setEmptyOption($self, "--");
    });

    $lines.on("load-data", function (event, prefectureName) {
        var $self = $(this);

        if (prefectureName === "") {
            setEmptyOption($self, "--");
            return;
        }

        callApi(
            {
                method: "getLines",
                prefecture: prefectureName
            },
        function (data) {
            var lineArray = data.response.line;
            appendOptions($self, lineArray);
        }
        );
    });

    $lines.on("change", function (event) {
        var $self = $(this);

        $stationList.trigger("load-data", $self.val());
    });


    $stationList.on("load-data", function (event, lineName) {

        var $self = $(this);
        var $tbody = $self.find("tbody");

        $tbody.empty();

        if (lineName === "") {
            return;
        }


        callApi(
            {
                method: "getStations",
                line: lineName
            },
        function (data) {
            var stations = data.response.station;
            $.each(stations, function (index, item) {
                var $tr = $("<tr>");

                $tr.append($("<td>").text(item.prefecture));
                $tr.append($("<td>").text(item.line));
                $tr.append($("<td>").text(item.name));
                $tr.append($("<td>").text(item.x));
                $tr.append($("<td>").text(item.y));

                $tbody.append($tr);
            });
        }
        );
    });

    $(document).ready(function (event) {
        callApi(
            {
                method: "getAreas"
            },
        function (data) {
            $area.trigger("init-data", data.response);
        }
        );
    });
})($);