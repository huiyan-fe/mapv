import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
    render() {
        return (<div> Hello World </div>);
    };
};

ReactDOM.render( < MyComponent / > , document.getElementById('container'));

