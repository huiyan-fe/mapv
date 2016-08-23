(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function linesPatternBrush(ctx, geo, drawOptions) {

    ctx.beginPath();

    var p1 = geo[0];
    var p2 = geo[1];
    ctx.moveTo(p1[0], p1[1]);

    for (var i = 1; i < geo.length; i++) {
        var midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1[0], p1[1], midPoint[0], midPoint[1]);
        p1 = geo[i];
        p2 = geo[i + 1];
    }

    var pattern = ctx.createPattern(getPattern(), 'repeat');
    ctx.strokeStyle = pattern;
    ctx.stroke();
}

function midPointBtw(p1, p2) {
    return [
        p1[0] + (p2[0] - p1[0]) / 2,
        p1[1] + (p2[1] - p1[1]) / 2
    ];
}

function getPattern() {
    var patternCanvas = document.createElement('canvas'),
        dotWidth = 10,
        dotDistance = 5,
        patternCtx = patternCanvas.getContext('2d');

    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

    patternCtx.strokeStyle = 'green';
    patternCtx.lineWidth = 5;
    patternCtx.beginPath();
    patternCtx.moveTo(0, 5);
    patternCtx.lineTo(10, 5);
    patternCtx.closePath();
    patternCtx.stroke();
    
    return patternCanvas;
}

brushes.linesPattern = linesPatternBrush;

})();
