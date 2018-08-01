/**
 * @author kyle / http://nikai.us/
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

export default {
    draw: function (context, dataSet, options) {
        
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // console.log('xxxx',options)
        context.save();

        for (var key in options) {
            context[key] = options[key];
        }


        // console.log(data);
        if (options.bigData) {
            context.save();
            context.beginPath();

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                pathSimple.draw(context, item, options);

            };

            var type = options.bigData;

            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                context.fill();
                
                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }

            } else if (type == 'LineString') {
                context.stroke();
            }

            context.restore();
        } else {

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                context.save();

                if (item.fillStyle || item._fillStyle) {
                    context.fillStyle = item.fillStyle || item._fillStyle;
                }

                if (item.strokeStyle || item._strokeStyle) {
                    context.strokeStyle = item.strokeStyle || item._strokeStyle;
                }

                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }
                
                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                var type = item.geometry.type;

                context.beginPath();

                pathSimple.draw(context, item, options);
                options.multiPolygonDraw = function() {
                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                }

                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }

                } else if (type == 'LineString') {
                    if (item.lineWidth || item._lineWidth) {
                        context.lineWidth = item.lineWidth || item._lineWidth;
                    }
                    context.stroke();
                }

                context.restore();

            };
        }

        context.restore();

    }
}
