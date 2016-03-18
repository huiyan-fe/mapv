export default {
    draw: function (context, data) {
        
        for (var i = 0; i < data.length; i++) {

            var item = data[i];

            context.beginPath();
            context.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            context.fill();

        };

    },
    isPointInPath: function (context, point, data) {
    }
}
