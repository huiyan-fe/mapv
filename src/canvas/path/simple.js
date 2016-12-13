/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "../../data/DataSet";

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
                if (options.symbol === 'rect') {
                    context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                } else {
                    context.moveTo(coordinates[0], coordinates[1]);
                    context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
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
                }
                context.closePath();
                break;
            default:
                console.log('type' + type + 'is not support now!');
                break;
        }
    },

    drawPolygon: function(context, coordinates) {

        for (var i = 0; i < coordinates.length; i++) {

            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
        }

    }

}
