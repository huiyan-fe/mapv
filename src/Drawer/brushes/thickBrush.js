(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function thickBrush(ctx, geo, drawOptions) {
    ctx.beginPath();
    var lastPoint = geo[0];

    for (var i = 1; i < geo.length; i++) {
        var currentPoint = geo[i];
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);
          
        for (var j = 0; j < dist; j += 2) {
            var x = lastPoint[0] + (Math.sin(angle) * j);
            var y = lastPoint[1] + (Math.cos(angle) * j);
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(0.3, 0.3);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        }
          
        lastPoint = currentPoint;

    }

    colorize(ctx);

}

var img = new Image();
img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAB50RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNS4xqx9I6wAAABR0RVh0Q3JlYXRpb24gVGltZQAxLzQvMTJldbXMAAACIklEQVRYhbWX227bMBBEj25pLk2KImj+/w+LvjRxJVN5ICeebKmqsmUBC11AkYezQy3VAPfADfAF6IEZGIE/wKFcH7nS0QEPJZ6AbwbUFZhUzvM1AHryzB+B7wWgBd6AX5wUUaRrANyQFXgGXoCBLP3Pcq2Z/yanY1eIvsQtOQU/gK/knD8ZgMe0J0QPNOR8C+K53D8WgGQxA697QvSh845swgeyEj1ZDW8jiF2M2ZPzeiidvpYBB+CObEgB6KyB38hKXATRkVeBvgP3ZeA7ckq0HBtOq2AqcWQHFTo++0D3g4WM2hrE0SCkytkATXg2l2etDT6UtoI47gXRlbNm5SGQjs9qOMQU2m+G8M+tS+szUzup4UokLoTo7NoBxhLu8gghY0blNqXDAVwJQUgNKeG+kHljOjYVry7ce9HR4AJRSXaIuESjh1YhIkCEcE9ECKVEEA4g1VbTUQOoQXg6IoSipsRqOpYAHCSa0yVegqiZsgqxBrAG4f0o4jv/hPgfAO/Qzen1oOWkRsvfSnhJPwtAELVaIAgMpA3gi9+ILQAO4W53JZYgFlOxFcAhavUgkeVXDWnsnZiO+VwAB4m+8DyrojaV9h9KXALgndbKsyAUVYhLAdTpUlHSsQSQ9gBwiFgPXAlv92HevQAihG9ikz13pUZg2hPAIbyiuuQ++AiM/c4AgtBGxlfJgbytazgVt3QNAEH4niCRf/cH8tJMBWh6B2crbJFfpZtGAAAAAElFTkSuQmCC';

function colorize(ctx) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 0);
    ctx.stroke();
    ctx.restore();
    var color = ctx.getImageData(0, 0, 1, 1).data;
    ctx.clearRect(0, 0, 1, 1);

    var colored = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 3, len = colored.data.length, j; i < len; i += 4) {
        colored.data[i - 3] = color[0];
        colored.data[i - 2] = color[1];
        colored.data[i - 1] = color[2];
    }
    ctx.putImageData(colored, 0, 0);
}

function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
}

function angleBetween(point1, point2) {
    return Math.atan2( point2[0] - point1[0], point2[1] - point1[1] );
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

brushes.thick = thickBrush;

})();
