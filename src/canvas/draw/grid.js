/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import DataSet from "../../data/DataSet";

export default {
    draw: function(context, dataSet, options) {

        context.save();

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

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

        var intensity = new Intensity({
            max: options.max || 100,
            gradient: options.gradient
        });

        for (var gridKey in grids) {
            gridKey = gridKey.split(",");

            context.beginPath();
            context.rect(gridKey[0] * size + .5 + offset.x, gridKey[1] * size + .5 + offset.y, size, size);
            context.fillStyle = intensity.getColor(grids[gridKey]);
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

            for (var gridKey in grids) {
                gridKey = gridKey.split(",");
                var text = grids[gridKey];
                var textWidth = context.measureText(text).width;
                context.fillText(text, gridKey[0] * size + .5 + offset.x + size / 2 - textWidth / 2, gridKey[1] * size + .5 + offset.y + size / 2 + 5);
            }
        }

        context.restore();
    }
}
