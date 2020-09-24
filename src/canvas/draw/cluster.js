/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "../../data/DataSet";

export default {
    draw: function(context, dataSet, options) {
        context.save();
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        var iconOffset = options.iconOffset || {
            x: 0,
            y: 0
        }

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            context.beginPath();
            if (item.properties && item.properties.cluster) {
                context.arc(coordinates[0], coordinates[1], item.size, 0, Math.PI * 2);
                context.fillStyle = item.fillStyle;
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
                var x = coordinates[0];
                var y = coordinates[1];
                if (options.icon) {
                    
                    var iconWidth = options.iconWidth;
                    var iconHeight = options.iconHeight;

                    x = x - iconWidth / 2 + iconOffset.x;
                    y = y - iconHeight / 2 + iconOffset.y;

                    if (iconWidth && iconHeight) {
                        context.drawImage(options.icon, x, y, iconWidth, iconHeight);
                    } else {
                        context.drawImage(options.icon, x, y);
                    }
                } else {
                    context.arc(x, y, options.size || 5, 0, Math.PI * 2);
                    context.fillStyle = options.fillStyle || 'red';
                    context.fill();
                }
            }
        }
        context.restore();
    }
}
