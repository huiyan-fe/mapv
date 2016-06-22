import React from 'react';

class Map extends React.Component {

    componentDidMount() {
        var map = this.map = new BMap.Map("map");
        map.centerAndZoom('中国', 5);
        map.setMapStyle({
            style: 'midnight'
        });
    }

    render() {
        return (
            <div id="map" ref="map">
            </div>
        );
    };
};

export default Map;

