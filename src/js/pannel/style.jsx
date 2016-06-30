import React from 'react';
import Store from '../basic/mavStore';
import Action from '../basic/mavAction';
import Data from '../basic/data';

class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moduleShow: true,
            type: 'data' // edit | data
        }
        this.layers = {}
    }

    componentDidMount() {
        var self = this;
        Store.on(function (data) {
            if (data.type == 'newLayer') {
                var id = data.layerId;
                self.setState({
                    moduleShow: true,
                    type: 'data',
                    layerName: data.name,
                    activeId: id
                });

                self.layers[id] = {
                    data: Data('point'),
                    option: {
                        fillStyle: 'rgba(151, 192, 247, 0.6)',
                        shadowColor: 'rgba(151, 192, 247, 0.5)',
                        shadowBlur: 10,
                        size: 5,
                        draw: 'simple'
                    }
                }

                Action.emit({
                    data: {
                        type: 'layerChange',
                        id: id,
                        data: self.layers[id].data,
                        option: self.layers[id].option
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

    changeValue() {

    }

    render() {
        var names = {
            'fillStyle': '填充颜色',
            'shadowColor': '阴影颜色',
            'shadowBlur': '阴影模糊',
            'size': '大小',
            'draw': '绘图类型',
        }
        // options
        var options = [];
        if (this.layers[this.state.activeId]) {
            var _options = this.layers[this.state.activeId].option;
            for (var i in _options) {
                options.push(
                    <div className="map-style-optiosblock"
                        key={"options_" + i}>
                        <span className="options-name">{names[i]}</span>
                        <input value={_options[i]} onChange={this.changeValue}/>
                    </div>);
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

