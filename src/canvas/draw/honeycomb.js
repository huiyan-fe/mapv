/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
function hex_corner(center, size, i) {
    var angle_deg = 60 * i   + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

export default {
    draw: function (context, dataSet, options) {

        context.save();

        var data = dataSet.get();

        var grids = {};

        var gridWidth = options.gridWidth || 1;

        var offset = options.offset || {
            x: 0,
            y: 0
        }

        var width = context.canvas.width + 100;
        var height = context.canvas.height + 100;

        //The maximum radius the hexagons can have to still fit the screen
        var r = options.size || 40;
        var dx = r * 2 * Math.sin(Math.PI / 3);
        var dy = r * 1.5;

        var binsById = {};

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry.coordinates;
            var py = coordinates[1]  / dy, pj = Math.round(py),
                px = coordinates[0] / dx - (pj & 1 ? .5 : 0), pi = Math.round(px),
                py1 = py - pj;

            if (Math.abs(py1) * 3 > 1) {
                var px1 = px - pi,
                    pi2 = pi + (px < pi ? -1 : 1) / 2,
                    pj2 = pj + (py < pj ? -1 : 1),
                    px2 = px - pi2,
                    py2 = py - pj2;
                if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
            }

            var id = pi + "-" + pj, bin = binsById[id];
            if (bin) bin.push(data[i]); else {
                bin = binsById[id] = [data[i]];
                bin.i = pi;
                bin.j = pj;
                bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                bin.y = pj * dy;
            }
        }
         
        console.log(binsById);
        for (var key in binsById) {

            var item = binsById[key];

            var intensity = new Intensity({
                max: options.max || 100,
                gradient: options.gradient
            });

            context.beginPath();

            for (var j = 0; j < 6; j++) {
                var result = hex_corner({x: item.x, y: item.y}, r, j);
                context.lineTo(result[0], result[1], 5, 5);
            }

            context.fillStyle = intensity.getColor(item.length);
            context.fill();
        }

        context.restore();
    }
}
