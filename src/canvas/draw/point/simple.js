/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, data) {
        
        context.save();
        
        for (var i = 0; i < data.length; i++) {

            var item = data[i];

            context.beginPath();
            context.moveTo(item.x, item.y);
            context.arc(item.x, item.y, item.count, 0, Math.PI * 2);
            context.fill();

        };

        context.restore();

    },
    isPointInPath: function (context, point, data) {

        for (var i = 0; i < data.length; i++) {

            context.beginPath();
            context.arc(item.x, item.y, item.count, 0, Math.PI * 2);
            if (context.isPointInPath(point.x, point.y)) {
                return data[i];
            }

        }

        return false;

    }
}
