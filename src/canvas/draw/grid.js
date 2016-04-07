/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";

export default {
    draw: function (context, data) {

        context.save();

        var grids = {};

        var gridWidth = 50;

        for (var i = 0; i < data.length; i++) {
            var gridKey = Math.floor(data[i].x / gridWidth) + "," + Math.floor(data[i].y / gridWidth);
            if (!grids[gridKey]) {
                grids[gridKey] = 0;
            }
            grids[gridKey] += ~~(data[i].count || 1);
        }

        for (var gridKey in grids) {
            gridKey = gridKey.split(",");

            var intensity = new Intensity({
                max: 100
            });

            context.beginPath();
            context.rect(gridKey[0] * gridWidth + .5, gridKey[1] * gridWidth + .5, gridWidth - 1, gridWidth - 1);
            context.fillStyle = intensity.getColor(grids[gridKey]);
            context.fill();
        }

        context.restore();
    }
}
