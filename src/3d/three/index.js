import GL from '../engine/gl.js';
import Data from '../engine/data/china.js';


let China = {};
Data.features.forEach((data) => {
    const name = data.properties.name;
    const center = data.properties.cp;
    const geomerty = data.geometry.coordinates;
    China[name] = {
        center,
        geomerty
    }
});

let Paths = China['安徽'].geomerty[0].map((point) => {
    return [point[0], point[1], 0];
});

const x = 1000; // 10m

class THREE {
    constructor(dmo) {
        var gl = new GL(dmo);
        Object.keys(China).map((province) => {
            China[province].geomerty.map((geo) => {
                const path = geo.map((point) => {
                    return [point[0] * 100, point[1] * 100, 0];
                });
                gl.Path({
                    path
                });
            });
        });

        gl.Path({
            path: [
                [0, 0, 0],
                [100, 0, 0]
            ],
            color: '#f00'
        });

        gl.Path({
            path: [
                [0, 0, 0],
                [0, 100, 0]
            ],
            color: '#00f'
        });

        gl.Path({
            path: [
                [0, 0, 0],
                [0, 0, 100]
            ],
            color: '#0f0'
        });

        var a = gl.Plane({
            width: 100,
            height: 100,
            color: '#eee'
        });
        a.translate(0, 1, 10)
    }
}



export default THREE;