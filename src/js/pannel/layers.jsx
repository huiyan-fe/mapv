import React from 'react';
import Store from '../basic/mavStore';
import Action from '../basic/mavAction';


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
            if (data.type == 'changeNav' && data.data == 'layers') {
                self.setState({
                    moduleShow: true
                })
            }
        });
    }

    addNewLayer() {
        var layers = this.state.layers;
        var layerID = layers.length;
        var name = '图层-' + layerID;
        layers.push({
            id: layerID,
            name: name,
            show: true
        });
        this.setState({
            layers: layers,
            activeLayer: layerID
        });

        Action.emit({
            data: {
                type: 'newLayer',
                name: name,
                layerId: layerID
            }
        });
    }

    changeActive(index) {
        this.setState({
            activeLayer: index
        });

        Action.emit({
            data: {
                type: 'changeLayer',
                layerId: index
            }
        });
    }

    render() {
        var self = this;
        var layers = this.state.layers.map((item, index) => {
            return (
                <li key={"layers-" + index}
                    className={item.id === self.state.activeLayer ? "active" : ""}
                    onClick={this.changeActive.bind(this, item.id) }>
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

