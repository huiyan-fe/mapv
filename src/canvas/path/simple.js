/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "../../data/DataSet";
import {draw as drawHoneycomb} from "../shape/honeycomb";

export default {
    drawDataSet: function (context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            this.draw(context, item, options);
        }

    },
    draw: function (context, data, options) {
        var type = data.geometry.type;
        var coordinates = data.geometry._coordinates || data.geometry.coordinates;
        var symbol = options.symbol || 'circle';
        switch (type) {
            case 'Point':
                var size = data._size || data.size || options._size || options.size || 5;
                if (symbol === 'circle') {
                    if (options.bigData === 'Point') {
                        context.moveTo(coordinates[0], coordinates[1]);
                    }
                    context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
                } else if (symbol === 'rect') {
                    context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                } else if (symbol === 'honeycomb') {
                    drawHoneycomb(context, coordinates[0], coordinates[1], size);
                }
                break;
            case 'LineString':
                for (var j = 0; j < coordinates.length; j++) {
                    var x = coordinates[j][0];
                    var y = coordinates[j][1];
                    if (j == 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                }
                break;
            case 'Polygon':
                this.drawPolygon(context, coordinates);
                break;
            case 'MultiPolygon':
                for (var i = 0; i < coordinates.length; i++) {
                    var polygon = coordinates[i];
                    this.drawPolygon(context, polygon);
                    if (options.multiPolygonDraw) {
                        options.multiPolygonDraw();
                    }
                }
                break;
            default:
                console.log('type' + type + 'is not support now!');
                break;
        }
    },

    drawPolygon: function(context, coordinates) {
        context.beginPath();

        for (var i = 0; i < coordinates.length; i++) {
            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
        }

    }

}
