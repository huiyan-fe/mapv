/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";

export default {
    draw: function (context, dataSet, options) {

        context.save();

        var data = dataSet.get();

        var grids = {};

        var gridWidth = options.gridWidth || 50;

        var offset = options.offset || {
            x: 0,
            y: 0
        }

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry.coordinates;
            var gridKey = Math.floor((coordinates[0] + offset.x)/ gridWidth) + "," + Math.floor((coordinates[1] + offset.y) / gridWidth);
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
            context.rect(gridKey[0] * gridWidth + .5 - offset.x, gridKey[1] * gridWidth + .5 - offset.y, gridWidth - 1, gridWidth - 1);
            context.fillStyle = intensity.getColor(grids[gridKey]);
            context.fill();
        }

        context.restore();
    }
}
