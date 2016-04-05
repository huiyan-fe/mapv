/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, dataSet, options) {

        var data = dataSet.get();

        context.save();

        for (var i = 0, len = data.length; i < len; i++) {

            var item = data[i];

            var coordinates = item.geometry.coordinates;

            context.beginPath();
            context.moveTo(coordinates[0][0], coordinates[0][1]);
            for (var j = 1; j < coordinates.length; j++) {
                context.lineTo(coordinates[j][0], coordinates[j][1]);
            }

            context.stroke();

        }

        context.restore();

    }
}
