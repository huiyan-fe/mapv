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



class THREE {
    constructor(dmo) {
        var gl = new GL(dmo);

        Object.keys(China).map((province) => {
            China[province].geomerty.map((geo) => {
                let path = [];
                path = path.concat(geo.map((point) => {
                    return [point[0] * 100, point[1] * 100, 0];
                }));
                gl.Path({
                    path
                });
            });
        });

        return gl;
    }
}



export default THREE;