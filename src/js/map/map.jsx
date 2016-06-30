import React from 'react';
import Store from '../basic/mavStore';
import Data from '../basic/data';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.layers = window.layers = {}
        this.state = {
            activeLayers: null
        }
    }

    componentDidMount() {
        var self = this;
        var map = this.map = new BMap.Map("map");
        map.centerAndZoom('中国', 5);
        map.setMapStyle({
            style: 'midnight'
        });

        Store.on(function (data) {
            if (data.type == 'layerChange') {
                if (self.layers[data.id]) {
                    self.layers[data.id].mapvLayer.set({
                        options: data.option
                    });
                } else {
                    if (data.data && data.option) {
                        var dataSet = new mapv.DataSet(data.data);
                        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, data.option);
                        self.layers[data.id] = {
                            mapvLayer: mapvLayer
                        }
                    }
                }
            }
        });
    }

    render() {
        return (
            <div id="map" ref="map"></div>
        );
    };
};

export default Map;

