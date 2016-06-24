import React from 'react';

class Nav extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <div className="map-layers">
                <div className="map-layers-info">
                    <div className="map-layers-info-title">图层名称</div>
                    <div className="map-layers-opt"><span  className="map-layers-opt-new">&#xeae3;</span><span>新建图层</span></div>
                </div>
                <ul className="map-layers-list">
                    <li className="active"><span className="map-lists-show">&#xe9ce;</span><span>图层名称</span><span>435</span></li>
                    <li><span className="map-lists-show">&#xe9d1;</span><span>图层名称</span><span>435</span></li>
                </ul>
            </div>
        );
    };
};

export default Nav;

