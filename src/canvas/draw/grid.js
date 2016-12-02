/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";

export default {
    draw: function(context, dataSet, options) {

        context.save();

        var data = dataSet.get();

        var grids = {};

        var size = options._size || options.size || 50;

        var offset = options.offset || {
            x: 0,
            y: 0
        }

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            var gridKey = Math.floor((coordinates[0] - offset.x) / size) + "," + Math.floor((coordinates[1] - offset.y) / size);
            if (!grids[gridKey]) {
                grids[gridKey] = 0;
            }
            grids[gridKey] += ~~(data[i].count || 1);
        }

        for (var gridKey in grids) {
            gridKey = gridKey.split(",");

            var intensity = new Intensity({
                max: options.max || 100,
                gradient: options.gradient
            });

            context.beginPath();
            context.rect(gridKey[0] * size + .5 + offset.x, gridKey[1] * size + .5 + offset.y, size, size);
            context.fillStyle = intensity.getColor(grids[gridKey]);
            context.fill();
            if (options.showText) {
                context.fillStyle = 'white';
                context.fillText(grids[gridKey], gridKey[0] * size + .5 + offset.x + size / 2, gridKey[1] * size + .5 + offset.y + size / 2);
            }
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        context.restore();
    }
}
