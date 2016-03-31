/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, data, options) {

        for (var i = 0, len = data.length; i < len; i++) {

            context.beginPath();

            var item = data[i];
            var geo = item.geo;
            context.moveTo(geo[0][0], geo[0][1]);
            for (var j = 1; j < geo.length; j++) {
                context.lineTo(geo[j][0], geo[j][1]);
            }
            context.lineTo(geo[0][0], geo[0][1]);

            if (options.strokeStyle) {
                context.stroke();
            }

            context.closePath();
            context.fill();

        }
    }
}
