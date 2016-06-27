import React from 'react';

class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moduleShow: false,
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="map-style" style={{ display: this.state.moduleShow ? 'block' : 'none' }}>
                <div className="map-style-info">
                    <div className="map-style-info-name"><span className="map-style-info-name-liststyle"></span>图层名称435</div>
                    <div className="map-style-info-fn">
                        <span className="map-style-info-fn-btn active">
                            <span className="map-style-info-fn-icon">&#xe90c; </span>
                            <span>修改样式</span>
                        </span>
                        <span className="map-style-info-fn-btn">
                            <span className="map-style-info-fn-icon">&#xe99c; </span>
                            <span>修改数据</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    };
};

export default Nav;

