var railsSearcher = angular.module("railsSearcher", []);

railsSearcher.controller("RailsCtrl", function ($scope, $http) {
    var callApi = function (param, successFunc) {

        $http.jsonp(
            "http://express.heartrails.com/api/json?callback=JSON_CALLBACK",
            {
                params: param
            }
        ).success(successFunc);
    };

    $scope.areas = [];
    $scope.prefectures = [];
    $scope.lines = [];
    $scope.stations = [];

    $scope.areaValue = null;
    $scope.prefectureValue = null;
    $scope.lineValue = null;

    var resetPrefectures = function () {
        $scope.prefectures = [];
        $scope.prefectureValue = null;
    };

    var resetLines = function () {
        $scope.lines = [];
        $scope.lineValue = null;
    };

    var resetStations = function () {
        $scope.stations = [];
    };

    $scope.init = function () {
        var param = {method: "getAreas"};
        callApi(
            param,
            function (data) {
                $scope.areas = data.response.area;
            }
        );
    };

    $scope.selectArea = function () {

        resetPrefectures();
        resetLines();
        resetStations();

        if ($scope.areaValue === null) {
            return;
        }

        var param = {
            method: "getPrefectures",
            area: $scope.areaValue
        };
        callApi(
            param,
            function (data) {
                $scope.prefectures = data.response.prefecture;
            }
        );
    };

    $scope.selectPrefecture = function () {

        resetLines();
        resetStations();

        if ($scope.prefectureValue === null) {
            return;
        }

        var param = {
            method: "getLines",
            prefecture: $scope.prefectureValue
        };
        callApi(
            param,
            function (data) {
                $scope.lines = data.response.line;
            }
        );
    };

    $scope.selectLine = function () {

        resetStations();

        if ($scope.lineValue === null) {
            return;
        }

        var param = {
            method: "getStations",
            line: $scope.lineValue
        };
        callApi(
            param,
            function (data) {
                $scope.stations = data.response.station;
            }
        );
    };
});