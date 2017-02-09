import {GL} from './gl';

var gl = new GL('webgl');

var plane = gl.Plane({width: 100, height: 100, color:'#eee'})

var plane2 = gl.Plane({width: 5, height: 5, color: '#ddd'})
               .translate(0,0,-2)
               .scale(2,2,2)

var plane3 = gl.Plane({width: 2, height: 2, color: '#f00'})
               .translate(0,0,-4)
               .rotate(45*Math.PI/180,[1,1,0])

var wall = gl.Wall({
    path:[[-4,0],[4,0]],
    color: '#ccc'
})
