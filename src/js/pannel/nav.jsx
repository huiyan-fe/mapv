import React from 'react';

class Nav extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <div className="map-nav">
                <div className="map-logo"></div>
                <div className="map-nav-block map-nav-layer active">
                    <span className="map-nav-icon">&#xe94b;</span>
                    <span className="map-nav-text">图层</span>
                </div>
            </div>
        );
    };
};

export default Nav;

