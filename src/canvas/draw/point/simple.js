/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, dataSet, options) {

        var data = dataSet.get();
        
        context.save();

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            context.save();

            if (item.fillStyle) {
                context.fillStyle = item.fillStyle;
            }

            if (item.strokeStyle) {
                context.strokeStyle = item.strokeStyle;
            }

            var coordinates = item.geometry.coordinates;

            context.beginPath();
            context.moveTo(item.x, item.y);

            var size = item.size || options.size || 5;
            context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
            context.fill();

            context.restore();

        };

        context.restore();

    }
}
