/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, data) {

        context.save();

        var gridWidth = 100;
        
        var column = context.canvas.width / gridWidth;
        var rows = context.canvas.height / gridWidth;

        var origin = {
            x: 0,
            y: 0
        }

        var gridOffset = {
            x: origin.x % gridWidth,
            y: gridWidth + origin.y % gridWidth
        }

        var startX = - (origin.x / gridWidth);
        var startY = - (origin.y / gridWidth);

        for (var i = startX; i < column; i++) {

            for (var j = startY; j < rows; j++) {

                context.beginPath();
                context.rect(i * gridWidth, j * gridWidth, gridWidth, gridWidth);
                context.stroke();
                context.fill();

            }

        };

        context.restore();
    }
}
