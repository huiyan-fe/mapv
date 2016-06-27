import React from 'react';
import Store from '../basic/mavStore';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleShow: false,
            layers: [],
            activeLayer: null
        }
    }

    componentDidMount() {
        var self = this;
        Store.on(function (data) {
            if (data == 'layers') {
                self.setState({
                    moduleShow: true
                })
            }
        })
    }

    addNewLayer() {
        var layers = this.state.layers;
        layers.push({
            'name': '图层-' + layers.length,
            'show': 'true'
        });
        this.setState({
            layers: layers,
            activeLayer: layers.length - 1
        });
    }

    changeActive(index) {
        this.setState({
            activeLayer: index
        });
    }

    render() {
        var self = this;
        var layers = this.state.layers.map((item, index) => {
            return (
                <li key={"layers-" + index}
                    className={index === self.state.activeLayer ? "active" : ""}
                    onClick={this.changeActive.bind(this, index) }>
                    <span className="map-lists-show">&#xe9ce; </span><span>{item.name}</span>
                </li>
            );
        });
        layers = layers.length > 0 ? layers : <li className="nodate"><span>木有图层，请新建图层</span></li>;
        return (
            <div className="map-layers" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-layers-info">
                    <div className="map-layers-info-title">图层名称</div>
                    <div className="map-layers-opt" onClick={this.addNewLayer.bind(this) }>
                        <span className="map-layers-opt-new">&#xeae3; </span>
                        <span>新建图层</span>
                    </div>
                </div>
                <ul className="map-layers-list">
                    {layers}
                </ul>
            </div>
        );
    };
};

export default Nav;

