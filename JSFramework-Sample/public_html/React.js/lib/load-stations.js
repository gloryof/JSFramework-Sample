var CreditMessage = React.createClass({
    render: function() {
        return (
            <p>
                Web APIは「<a href="http://express.heartrails.com/">HeartRails Express</a>」を使用させていただいています。
            </p>
        );
    }
});

var AreaSelect = React.createClass({
    changeFunction: function(event) {
        this.props.changeFunction(event.target.value);
    },
    render: function() {
        
        var selectedValue = this.props.selectedValue;
        var options = this.props.areas.map(function(area) {
            var selected = area.value == selectedValue ? true : false;
            return (
                <option value={area.value} selected={selected}>{area.text}</option>
            );
        });
        return (
            <select name="area" class="area" onChange={this.changeFunction}>
                <option value="">--</option>
                {options}
            </select>
        );
    }
});

var PrefectureSelect = React.createClass({
    changeFunction: function(event) {
        this.props.changeFunction(event.target.value);
    },
    render: function() {

        var selectedValue = this.props.selectedValue;
        var options = this.props.prefectures.map(function(prefecture) {
            var selected = prefecture.value == selectedValue ? true : false;
            return (
                <option value={prefecture.value} selected={selected}>{prefecture.text}</option>
            );
        });
        return (
            <select name="prefecture" class="prefecture" onChange={this.changeFunction}>
                <option value="">--</option>
                {options}
            </select>
        );
    }
});

var LineSelect = React.createClass({
    changeFunction: function(event) {
        this.props.changeFunction(event.target.value);
    },
    render: function() {

        var selectedValue = this.props.selectedValue;
        var options = this.props.lines.map(function(line) {
            var selected = line.value == selectedValue ? true : false;
            return (
                <option value={line.value} selected={selected}>{line.text}</option>
            );
        });
        return (
            <select name="line" class="line" onChange={this.changeFunction}>
                <option value="">--</option>
                {options}
            </select>
        );
    }
})

var SearchForm = React.createClass({
    getInitialState() {
        return {
            condition: {
                area: {
                    selectedValue: "",
                    list: this.props.areas
                },
                prefecture: {
                    selectedValue: "",
                    list: []
                },
                line: {
                    selectedValue: "",
                    list: []
                }
            }
        };
    },
    selectArea: function(value) {

        var self = this;
        var newState = this.state;
        newState.condition.area.selectedValue = value;

        newState.condition.prefecture.selectedValue = "";
        newState.condition.prefecture.list = [];

        newState.condition.line.selectedValue = "";
        newState.condition.line.list = [];

        this.props.changeStations([]);

        if (value != "") {
            
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                async: false,
                data: {
                    method: "getPrefectures",
                    area: value
                }
            }).done(function (data) {

                var results = data.response.prefecture;
                for (var i = 0; i < results.length; i++) {

                    var value = results[i];
                    newState.condition.prefecture.list.push({text:value, value:value}); ;
                }
                self.setState(newState);
            });
        }
    },
    selectPrefecture: function(value) {
        
        var self = this;
        var newState = this.state;
        newState.condition.prefecture.selectedValue = value;

        newState.condition.line.selectedValue = "";
        newState.condition.line.list = [];
        
        this.props.changeStations([]);

        if (value != "") {
            
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                async: false,
                data: {
                    method: "getLines",
                    prefecture: value
                }
            }).done(function (data) {

                var results = data.response.line;
                for (var i = 0; i < results.length; i++) {

                    var value = results[i];
                    newState.condition.line.list.push({text:value, value:value}); ;
                }
                self.setState(newState);
            });
        }
    },
    selectLine: function(value) {
        
        var self = this;
        var newState = this.state;
        newState.condition.line.selectedValue = value;

        if (value != "") {
            
            $.ajax({
                method: "GET",
                url: "http://express.heartrails.com/api/json",
                dataType: "jsonp",
                async: false,
                data: {
                    method: "getStations",
                    line: value
                }
            }).done(function (data) {

                self.props.changeStations(data.response.station);
                self.setState(newState);
            });
        } else {
            
            this.props.changeStations([]);
        }
    },
    render: function() {
        return (
            <section>
                <form id="search-form">
                    <fieldset>
                        <legend>抽出条件</legend>
                        <ul>
                            <li>
                                <AreaSelect
                                    areas={this.state.condition.area.list}
                                    selectValue={this.state.condition.area.selectedValue}
                                    changeFunction={this.selectArea} />
                            </li>
                            <li>
                                <PrefectureSelect
                                   prefectures={this.state.condition.prefecture.list}
                                   selectedValue={this.state.condition.prefecture.selectedValie}
                                   changeFunction={this.selectPrefecture}/>
                            </li>
                            <li>
                                <LineSelect
                                    lines={this.state.condition.line.list}
                                    selectedValue={this.state.condition.line.selectedValue}
                                    changeFunction={this.selectLine}/>
                            </li>
                        </ul>
                    </fieldset>
                </form>
            </section>
        );
    }
});

var ResultRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.rowData.prefecture}</td>
                <td>{this.props.rowData.line}</td>
                <td>{this.props.rowData.name}</td>
                <td>{this.props.rowData.x}</td>
                <td>{this.props.rowData.y}</td>
            </tr>
        );
    }
});

var SearchResult = React.createClass({
    render: function() {
        
        var rows = this.props.stations.map(function(station) {
            return (
                <ResultRow rowData={station} />
            );
        });
        return (
            <section>
                <table class="station-list">
                    <thead>
                        <tr>
                            <th>都道府県</th>
                            <th>路線名</th>
                            <th>駅名</th>
                            <th>経度</th>
                            <th>緯度</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </section>
        );
    }
});

var RailsSearcher = React.createClass({
    getInitialState() {
        return {
            stations: []
        }
    },
    setStations: function(paramStations) {
        this.setState({stations: paramStations});
    },
    render: function() {
        return (
            <div>
                <CreditMessage />
                <SearchForm areas={this.props.areas} changeStations={this.setStations} />
                <SearchResult stations={this.state.stations} />
            </div>
        );
    }
});

$.ajax({
    method: "GET",
    url: "http://express.heartrails.com/api/json",
    dataType: "jsonp",
    data: {method: "getAreas"}
}).done(function (data) {
    var areas = [];

    areas = [];

    var receivedDatas = data.response.area;
    for (var i = 0; i < receivedDatas.length; i++) {

        var receiveData = receivedDatas[i];
        areas.push({text: receiveData, value: receiveData});
    }

    React.render(
        <RailsSearcher areas={areas} />,
        document.getElementById("rails-search")
    );
});
