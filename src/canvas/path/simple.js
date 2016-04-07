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

        }

        if (type == 'LineString') {

            context.moveTo(coordinates[0][0], coordinates[0][1]);
            for (var j = 1; j < coordinates.length; j++) {
                context.lineTo(coordinates[j][0], coordinates[j][1]);
            }

        }

        if (type == 'Polygon') {

            context.moveTo(coordinates[0][0], coordinates[0][1]);
            for (var j = 1; j < coordinates.length; j++) {
                context.lineTo(coordinates[j][0], coordinates[j][1]);
            }
            context.closePath();

        }
    }

}
