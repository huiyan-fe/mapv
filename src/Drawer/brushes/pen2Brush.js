(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function pen2Brush(ctx, geo, drawOptions) {
    ctx.beginPath();
    var lastPoint = geo[0];
    ctx.lineWidth = 1;

    for (var i = 1; i < geo.length; i++) {
        var currentPoint = geo[i];

        ctx.moveTo(lastPoint[0] - getRandomInt(0, 2), lastPoint[1] - getRandomInt(0, 2));
        ctx.lineTo(currentPoint[0] - getRandomInt(0, 2), currentPoint[1] - getRandomInt(0, 2));
      
        ctx.moveTo(lastPoint[0], lastPoint[1]);
        ctx.lineTo(currentPoint[0], currentPoint[1]);
      
        ctx.moveTo(lastPoint[0] + getRandomInt(0, 2), lastPoint[1] + getRandomInt(0, 2));
        ctx.lineTo(currentPoint[0] + getRandomInt(0, 2), currentPoint[1] + getRandomInt(0, 2));

        lastPoint = currentPoint;
    }

    ctx.stroke();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

brushes.pen2 = pen2Brush;

})();
