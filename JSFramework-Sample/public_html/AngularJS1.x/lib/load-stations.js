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
        if ($scope.areaValue === null) {
            $scope.prefectures = [];
            $scope.lines = [];
            $scope.rails = [];

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
        if ($scope.prefectureValue === null) {
            $scope.lines = [];
            $scope.rails = [];

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
        if ($scope.lineValue === null) {
            $scope.rails = [];

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