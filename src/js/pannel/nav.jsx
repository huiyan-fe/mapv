import React from 'react';
import Action from '../basic/mavAction';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: null
        }
    }

    componentDidMount() {

    }

    changeNav(nav) {
        if (this.state.nav == nav) {
            nav = null;
        }
        this.setState({
            nav: nav
        }, function () {
            Action.emit({
                data: {
                    type: 'changeNav',
                    data: nav
                }
            });
        })
    }

    render() {
        return (
            <div className="map-nav">
                <div className="map-logo"></div>
                <div className={"map-nav-block map-nav-layer " + (this.state.nav == 'layers' ? 'active' : '') }
                    onClick={this.changeNav.bind(this, 'layers') }>
                    <span className="map-nav-icon">&#xe94b; </span>
                    <span className="map-nav-text">图层</span>
                </div>
                <div className={"map-nav-block map-nav-layer " + (this.state.nav == 'data' ? 'active' : '') }
                    onClick={this.changeNav.bind(this, 'data') }>
                    <span className="map-nav-icon">&#xe1db; </span>
                    <span className="map-nav-text">数据</span>
                </div>
            </div>
        );
    };
};

export default Nav;

