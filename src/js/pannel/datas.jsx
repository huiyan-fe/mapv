import React from 'react';
import Store from '../basic/mavStore';
import Action from '../basic/mavAction';


class Datas extends React.Component {
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
            if (data.type == 'changeNav') {
                var moduleShow = data.data == 'data' ? true : false;
                self.setState({
                    moduleShow: moduleShow
                })
            }
        });
    }

    render() {
        return (
            <div className="map-layers" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-layers-info">
                    <div className="map-layers-info-title">数据管理</div>
                    <div className="map-layers-opt">
                        <span className="map-layers-opt-new">&#xe03c; </span>
                        <span>拖拽文件以添加数据</span>
                    </div>
                </div>
                <ul className="map-layers-list">
                    <li>数据一</li>
                </ul>
            </div>
        );
    };
};

export default Datas;

