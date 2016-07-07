import React from 'react';
import ReactDOM from 'react-dom';

//
import Map from './map/map.jsx';
import Nav from './pannel/nav.jsx';
import Layers from './pannel/layers.jsx';
import Style from './pannel/style.jsx';
import Datas from './pannel/datas.jsx';
import Data from './basic/data';
import LoadData from './basic/loadData.js';


class MyComponent extends React.Component {
    componentDidMount() {
        new LoadData({
            addData: function (data) {;
                //let's image the data is string
                var lineData = [];
                for (var i in data) {
                    var _data = data[i];
                    var _paths = _data[0].split(',');
                    var path = [];
                    for (var i = 0; i < _paths.length; i += 2) {
                        path.push([_paths[i], _paths[i + 1]]);
                    }
                    var count = _data[1];
                    var value_a = _data[2];
                    var value_b = _data[3];

                    lineData.push({
                        count: count,
                        geometry: {
                            type: "LineString",
                            coordinates: path
                        },
                        userData: {
                            value_a: value_a,
                            value_b: value_b
                        }
                    })
                }
                Data.set('新建数据', { data: lineData, type: 'line' });
            }
        });
    }
    render() {
        return (
            <div>
                <Map/>
                <Nav/>
                <Layers/>
                <Datas/>
                <Style/>
            </div>
        );
    };
};

ReactDOM.render(<MyComponent />, document.getElementById('container'));

