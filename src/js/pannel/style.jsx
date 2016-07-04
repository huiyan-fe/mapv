import React from 'react';
import Store from '../basic/mavStore';
import Action from '../basic/mavAction';
import Data from '../basic/data';
import Config from '../basic/config';

class Nav extends React.Component {

    constructor(props) {
        super(props);

        this.drawType = Config.drawType;

        this.state = {
            moduleShow: false,
            layers: {},
            dataType: null, //point line polygon self
            drawType: 'simple'
        }
    }

    componentDidMount() {
        var self = this;
        Store.on(function (data) {
            if (data.type == 'newLayer') {
                var id = data.layerId;
                var layers = self.state.layers;
                layers[id] = {
                    data: [],
                    option: {}
                }

                self.setState({
                    moduleShow: true,
                    type: 'data',
                    layerName: data.name,
                    activeId: id,
                    layers: layers
                });
            } else if (data.type == 'changeLayer') {
                self.setState({
                    activeId: data.layerId
                });
            }
        });
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
        // console.log(type, options)
        var names = {
            fillStyle: {
                name: '填充颜色',
                type: 'color',
            },
            shadowColor: {
                name: '阴影颜色',
                type: 'color',
            },
            shadowBlur: {
                name: '阴影模糊',
                type: 'range',
            },
            size: {
                name: '大小',
                type: 'range'
            },
            // line
            strokeStyle: {
                name: '线条颜色',
                type: 'color',
            },
            lineWidth: {
                name: '线条宽度',
                type: 'range'
            },

            maxSize: {
                name: '最大半径',
                type: 'range'
            },
            max: {
                name: '最大阀值',
                type: 'range'
            }

        }

        var ipt;
        if (names[type]) {
            switch (names[type].type) {
                case 'color':
                    var color = options;
                    var testRGBA = color.match(/rgba\((.+?),(.+?),(.+?),(.+?)\)/);
                    if (testRGBA && testRGBA.length >= 4) {
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
                        min="1"
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
        } else {
            console.warn(type, ' is not configed')
            return '';
        }


    }

    changeDataType(type) {
        // console.log(type)
        var self = this;
        var id = self.state.activeId;
        var layers = self.state.layers;

        var _data = Data(type);
        layers[id] = {
            data: _data.data,
            option: _data.options
        }

        self.setState({
            dataType: type, //point line polygon self
            layers: layers
        })

        Action.emit({
            data: {
                type: 'layerChange',
                id: id,
                data: layers[id].data,
                option: layers[id].option
            }
        });
    }

    changeDrawType(type) {
        var dataType = this.state.dataType;
        var option = Config.drawType[type].config ? Config.drawType[type].config[dataType] : {}
        this.state.layers[this.state.activeId].option = option;
        this.setState({
            drawType: type
        });

        Action.emit({
            data: {
                type: 'layerChange',
                id: this.state.activeId,
                option: option
            }
        });
    }

    render() {
        // options
        var options = [];
        if (this.state.layers[this.state.activeId]) {
            var _options = this.state.layers[this.state.activeId].option;
            for (var i in _options) {
                options.push(this.getControl(i, _options[i]));
            }
        };

        // layer type
        var layerTypes = [];
        var dataType = this.state.dataType;
        for (var i in this.drawType) {
            var types = this.drawType[i];
            if (types.useData.indexOf(dataType) != -1) {
                layerTypes.push(
                    <span className={"map-style-dataTypes-block " + (this.state.drawType == i ? 'active' : '') }
                        key={"dataType_" + types.name}
                        onClick={this.changeDrawType.bind(this, i) }
                        >
                        {types.name}
                    </span>
                )
            }
        }

        return (
            <div className="map-style" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-style-info">
                    <div className="map-style-info-name">
                        <span className="map-style-info-name-liststyle"></span>
                        {this.state.layerName}
                    </div>
                    <div className="map-style-info-fn">
                        <span className="map-style-info-fn-btn active">
                            <span className="map-style-info-fn-icon">&#xe90c; </span>
                            <span>调整样式</span>
                        </span>
                    </div>
                </div>

                <div className="map-style-datablock" style={{ display: this.state.type == 'data' ? 'block' : 'none' }}>
                    <div className="map-style-datatitle">&#xe964; 选择数据</div>
                    <div>
                        <p className={"radio-block " + (this.state.dataType == 'point' ? 'active' : '') }
                            onClick={this.changeDataType.bind(this, 'point') }>
                            <span className="radio"></span>DEMO点数据
                        </p>
                        <p className={"radio-block " + (this.state.dataType == 'line' ? 'active' : '') }
                            onClick={this.changeDataType.bind(this, 'line') }>
                            <span className="radio"></span>DEMO线数据
                        </p>
                        <p className={"radio-block " + (this.state.dataType == 'polygon' ? 'active' : '') }
                            onClick={this.changeDataType.bind(this, 'polygon') }
                            style={{ display: 'none' }}>
                            <span className="radio"></span>DEMO面数据
                        </p>
                        <p className={"radio-block " + (this.state.dataType == 'self' ? 'active' : '') }
                            onClick={this.changeDataType.bind(this, 'self') }>
                            <span className="radio"></span>自定义数据
                        </p>
                    </div>
                </div>

                <div className="map-style-datablock"
                    style={{ display: (this.state.dataType === null ? 'none' : '') }}>
                    <div className="map-style-datatitle">&#xe9b8; 图层类型</div>
                    <div className="map-style-dataTypes">
                        {layerTypes}
                    </div>
                    <div className="map-style-datatitle">&#xe992; 调整参数</div>
                    {options}
                </div>
            </div>
        );
    };
};

//point line polygon self
export default Nav;

