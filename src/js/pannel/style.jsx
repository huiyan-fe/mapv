import React from 'react';
import Store from '../basic/mavStore';
import Action from '../basic/mavAction';
import Data from '../basic/data';

class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moduleShow: false,
            type: 'data', // edit | data
            layers: {}
        }
    }

    componentDidMount() {
        var self = this;
        Store.on(function (data) {
            if (data.type == 'newLayer') {
                var id = data.layerId;
                var layers = self.state.layers;
                layers[id] = {
                    data: Data('point'),
                    option: {
                        fillStyle: 'rgba(151, 192, 247, 0.6)',
                        shadowColor: 'rgba(151, 192, 247, 0.5)',
                        shadowBlur: 10,
                        size: 5,
                        draw: 'simple'
                    }
                }

                self.setState({
                    moduleShow: true,
                    type: 'data',
                    layerName: data.name,
                    activeId: id,
                    layers: layers
                });


                Action.emit({
                    data: {
                        type: 'layerChange',
                        id: id,
                        data: layers[id].data,
                        option: layers[id].option
                    }
                });
            } else if (data.type == 'changeLayer') {
                self.setState({
                    activeId: data.layerId
                });
            }
        });
    }

    changeStyle(data) {
        this.setState({
            type: data
        })
    }

    changeValue(type) {
        var activeId = this.state.activeId;
        var option = this.state.layers[activeId].option;
        option[type] = this.refs[type].value;
        this.setState({
            layers: this.state.layers
        });

        Action.emit({
            data: {
                type: 'layerChange',
                id: activeId,
                option: option
            }
        });
    }

    getControl(type, options) {
        var names = {
            'fillStyle': {
                name: '填充颜色',
                type: 'color',
            },
            'shadowColor': {
                name: '阴影颜色',
                type: 'color',
            },
            'shadowBlur': {
                name: '阴影模糊',
                type: 'range',
            },
            'size': {
                name: '大小',
                type: 'range'
            },
            'draw': {
                name: '绘图类型',
                type: 'select',
                options: ['simple', 'bubble', 'intensity', 'category', 'choropleth', 'heatmap', 'grid', 'honeycomb', 'text', 'icon'],
            },
        }

        var ipt;
        switch (names[type].type) {
            case 'color':
                var color = options;
                var testRGBA = color.match(/rgba\((.+?),(.+?),(.+?),(.+?)\)/);
                if (testRGBA.length >= 4) {
                    var R = Number(testRGBA[1]).toString(16);
                    R = R.length <= 1 ? '0' + R : R;
                    var G = Number(testRGBA[2]).toString(16);
                    G = G.length <= 1 ? '0' + G : G;
                    var B = Number(testRGBA[3]).toString(16);
                    B = B.length <= 1 ? '0' + B : B;
                    color = '#' + R + G + B;
                }
                ipt = <input value={color}
                    type='color'
                    onChange={this.changeValue.bind(this, type) }
                    ref={type}/>;
                break;
            case 'range':
                ipt = <input value={options}
                    type='range'
                    onChange={this.changeValue.bind(this, type) }
                    ref={type}/>;
                break;
            case 'select':
                var opts = names.draw.options.map(function (item, index) {
                    return <option key={"select_item_" + index} value={item}>{item}</option>
                });
                ipt = (
                    <select onChange={this.changeValue.bind(this, type) } ref={type}>{opts}</select>
                );
                break;
        }

        return (
            <div className="map-style-optiosblock"
                key={"options_" + type}>
                <span className="options-name">{names[type].name}</span>
                {ipt}
            </div>);
    }

    render() {
        var names = {
            'fillStyle': {
                name: '填充颜色',
                type: 'color',
            },
            'shadowColor': {
                name: '阴影颜色',
                type: 'color',
            },
            'shadowBlur': {
                name: '阴影模糊',
                type: 'range',
            },
            'size': {
                name: '大小',
                type: 'range'
            },
            'draw': {
                name: '绘图类型',
                type: 'select',
                options: ['simple', 'bubble', 'intensity', 'category', 'choropleth', 'heatmap', 'grid', 'honeycomb', 'text', 'icon'],
            },
        }
        // options
        var options = [];
        if (this.state.layers[this.state.activeId]) {
            var _options = this.state.layers[this.state.activeId].option;
            for (var i in _options) {
                options.push(this.getControl(i, _options[i]));
            }
        };

        return (
            <div className="map-style" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-style-info">
                    <div className="map-style-info-name"><span className="map-style-info-name-liststyle"></span>{this.state.layerName}</div>
                    <div className="map-style-info-fn">
                        <span className={"map-style-info-fn-btn " + (this.state.type == 'edit' ? 'active' : '') }
                            onClick={this.changeStyle.bind(this, 'edit') }>
                            <span className="map-style-info-fn-icon">&#xe90c; </span>
                            <span>调整样式</span>
                        </span>
                        <span className={"map-style-info-fn-btn " + (this.state.type == 'data' ? 'active' : '') }
                            onClick={this.changeStyle.bind(this, 'data') }>
                            <span className="map-style-info-fn-icon">&#xe99c; </span>
                            <span>修改数据</span>
                        </span>
                    </div>
                </div>
                <div className="map-style-datablock">
                    <div className="map-style-datatitle">图层类型</div>
                    <div className="map-style-datatitle">调整参数</div>
                    {options}
                </div>
                <div className="map-style-datablock">
                    <div className="map-style-datatitle">数据来源</div>
                    <p><span className="radio active"></span>DEMO点数据</p>
                    <p><span className="radio"></span>DEMO线数据</p>
                    <p><span className="radio"></span>DEMO面数据</p>
                    <p><span className="radio"></span>自定义数据</p>
                </div>
            </div>
        );
    };
};

export default Nav;

