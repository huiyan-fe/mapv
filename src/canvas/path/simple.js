/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function(context, data, options) {
        var type = data.geometry.type;
        var coordinates = data.geometry.coordinates;

        if (type == 'Point') {

            context.moveTo(data.x, data.y);

            var size = data.size || options.size || 5;
            context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);

        } else if (type == 'LineString') {
            context.moveTo(coordinates[0][0], coordinates[0][1]);
            for (var j = 1; j < coordinates.length; j++) {
                context.lineTo(coordinates[j][0], coordinates[j][1]);
            }

        } else if (type == 'Polygon') {

            this.drawPolygon(context, coordinates);
            context.closePath();

        } else if (type == 'MultiPolygon') {
            for (var i = 0; i < coordinates.length; i++) {
                var polygon = coordinates[i];
                this.drawPolygon(context, polygon);
            }
            context.closePath();
        } else {
            console.log('type' + type + 'is not support now!');
        }
    },

    drawPolygon: function(context, coordinates) {

        for (var i = 0; i < coordinates.length; i++) {

            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.moveTo(coordinate[0][0], coordinate[0][1]);
        }

    }

}