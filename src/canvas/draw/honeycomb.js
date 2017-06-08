/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import DataSet from "../../data/DataSet";

function hex_corner(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

export default {
    draw: function(context, dataSet, options) {

        context.save();

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        for (var key in options) {
            context[key] = options[key];
        }

        var grids = {};

        var offset = options.offset || {
            x: 10,
            y: 10
        }

        var r = options._size || options.size || 40;
        r = r / 2 / Math.sin(Math.PI / 3);
        var dx = r * 2 * Math.sin(Math.PI / 3);
        var dy = r * 1.5;

        var binsById = {};

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            var py = (coordinates[1] - offset.y) / dy,
                pj = Math.round(py),
                px = (coordinates[0] - offset.x) / dx - (pj & 1 ? .5 : 0),
                pi = Math.round(px),
                py1 = py - pj;

            if (Math.abs(py1) * 3 > 1) {
                var px1 = px - pi,
                    pi2 = pi + (px < pi ? -1 : 1) / 2,
                    pj2 = pj + (py < pj ? -1 : 1),
                    px2 = px - pi2,
                    py2 = py - pj2;
                if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
            }

            var id = pi + "-" + pj,
                bin = binsById[id];
            if (bin) {
                bin.push(data[i])
            } else {
                bin = binsById[id] = [data[i]];
                bin.i = pi;
                bin.j = pj;
                bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                bin.y = pj * dy;
            }
        }

        var intensity = new Intensity({
            max: options.max || 100,
            maxSize: r,
            gradient: options.gradient
        });

        for (var key in binsById) {

            var item = binsById[key];

            context.beginPath();

            for (var j = 0; j < 6; j++) {

                var result = hex_corner({
                    x: item.x + offset.x,
                    y: item.y + offset.y
                }, r, j);

                context.lineTo(result[0], result[1]);

            }

            context.closePath();

            var count = 0;
            for (var i = 0; i < item.length; i++) {
                count += item[i].count || 1;
            }
            item.count = count;

            context.fillStyle = intensity.getColor(count);
            context.fill();
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        if (options.label && options.label.show !== false) {

            context.fillStyle = options.label.fillStyle || 'white';

            if (options.label.font) {
                context.font = options.label.font;
            }

            if (options.label.shadowColor) {
                context.shadowColor = options.label.shadowColor;
            }

            if (options.label.shadowBlur) {
                context.shadowBlur = options.label.shadowBlur;
            }

            for (var key in binsById) {
                var item = binsById[key];
                var text = item.count;
                if (text < 0) {
                    text = text.toFixed(2);
                } else {
                    text = ~~text;
                }
                var textWidth = context.measureText(text).width;
                context.fillText(text, item.x + offset.x - textWidth / 2, item.y + offset.y + 5);
            }
        }

        context.restore();
    }
}
