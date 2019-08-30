/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import DataSet from "../../data/DataSet";

export default {
    draw: function(context, dataSet, options) {
        context.save();
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        var pointCountMax;
        var pointCountMin;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.properties && item.properties.cluster) {
                if (pointCountMax === undefined) {
                    pointCountMax = item.properties.point_count;
                }
                if (pointCountMin === undefined) {
                    pointCountMin = item.properties.point_count;
                }
                pointCountMax = Math.max(pointCountMax, item.properties.point_count);
                pointCountMin = Math.min(pointCountMin, item.properties.point_count);
            }
        }

        var intensity = new Intensity({
            min: pointCountMin,
            max: pointCountMax,
            minSize: options.minSize || 8,
            maxSize: options.maxSize || 30,
            gradient: options.gradient
        });

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            context.beginPath();
            if (item.properties && item.properties.cluster) {
                context.arc(coordinates[0], coordinates[1], intensity.getSize(item.properties.point_count), 0, Math.PI * 2);
                context.fillStyle = intensity.getColor(item.properties.point_count);
                context.fill();
                
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

                    var text = item.properties.point_count;
                    var textWidth = context.measureText(text).width;
                    context.fillText(text, coordinates[0] + .5 - textWidth / 2, coordinates[1] + .5 + 3);
                }


            } else {
                context.arc(coordinates[0], coordinates[1], options.size || 5, 0, Math.PI * 2);
                context.fillStyle = options.fillStyle || 'red';
                context.fill();
            }
        }
        context.restore();
    }
}
