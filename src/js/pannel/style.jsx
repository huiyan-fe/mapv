import React from 'react';
import Store from '../basic/mavStore';

class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moduleShow: true,
            type: 'data' // edit | data
        }
    }

    componentDidMount() {
        var self = this;
        Store.on(function (data) {
            if (data.type == 'newLayer') {
                self.setState({
                    moduleShow: true,
                    type: 'data'
                })
            }
        });
    }

    changeStyle(data) {
        this.setState({
            type: data
        })
    }

    render() {
        console.log(this.state.type)
        return (
            <div className="map-style" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-style-info">
                    <div className="map-style-info-name"><span className="map-style-info-name-liststyle"></span>图层名称435</div>
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

