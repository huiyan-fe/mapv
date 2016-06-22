import React from 'react';
import ReactDOM from 'react-dom';

//
import Map from './map/map.jsx';
import Nav from './pannel/nav.jsx';
import Layers from './pannel/layers.jsx';
import Style from './pannel/style.jsx';

class MyComponent extends React.Component {
    render() {
        return (
            <div>
                <Map/>
                <Nav/>
                <Layers/>
                <Style/>
            </div>
        );
    };
};

ReactDOM.render(<MyComponent />, document.getElementById('container'));

