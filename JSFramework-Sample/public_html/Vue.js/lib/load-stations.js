var railSearch = new Vue({
    el: ".rails-search",
    data: {
        areas: [{text: "--", value: ""}],
        prefectures: [{text: "--", value: ""}],
        lines: [{text: "--", value: ""}],
        stations: [] ,
        areaValue: "",
        prefectureValue: "",
        lineValue: ""
    },
    ready: function () {

        var self = this;
        $.ajax({
            method: "GET",
            url: "http://express.heartrails.com/api/json",
            dataType: "jsonp",
            data: {method: "getAreas"}
        }).done(function (data) {
            self.areas = [];

            self.areas.push({text: "--", value: ""});

            var receivedDatas = data.response.area;
            for (var i = 0; i < receivedDatas.length; i++) {

                var receiveData = receivedDatas[i];
                self.areas.push({text: receiveData, value: receiveData});
            }
        });
    },
    methods: {
        seletArea: function () {

            this._resetPrefectures();
            this._resetLines();
            this._resetStations();

            var selectedValue = this.areaValue;

            if (selectedValue === "") {

                return;
            }

            var self = this;
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                data: {
                    method: "getPrefectures",
                    area: selectedValue
                }
            }).done(function (data) {

                var receivedDatas = data.response.prefecture;
                for (var i = 0; i < receivedDatas.length; i++) {

                    var receiveData = receivedDatas[i];
                    self.prefectures.push({text: receiveData, value: receiveData});
                }
            });
        },
        seletPrefecture: function () {

            this._resetLines();
            this._resetStations();

            var selectedValue = this.prefectureValue;

            if (selectedValue === "") {

                return;
            }

            var self = this;
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                data: {
                    method: "getLines",
                    prefecture: selectedValue
                }
            }).done(function (data) {

                var receivedDatas = data.response.line;
                for (var i = 0; i < receivedDatas.length; i++) {

                    var receiveData = receivedDatas[i];
                    self.lines.push({text: receiveData, value: receiveData});
                }
            });
        },
        seletLine: function () {

            this._resetStations();

            var selectedValue = this.lineValue;

            if (selectedValue === "") {

                return;
            }

            var self = this;
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                data: {
                    method: "getStations",
                    line: selectedValue
                }
            }).done(function (data) {

                var receivedDatas = data.response.station;
                for (var i = 0; i < receivedDatas.length; i++) {

                    self.stations.push(receivedDatas[i]);
                }
            });
        },
        _resetPrefectures: function () {
            this.prefectures = [{text: "--", value: ""}];
            this.prefectureValue = "";
        },
        _resetLines: function () {
            this.lines = [{text: "--", value: ""}];
            this.lineValue = "";
        },
        _resetStations: function () {
            this.stations = [{text: "--", value: ""}];
        }
    }
});