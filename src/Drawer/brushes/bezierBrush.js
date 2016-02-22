(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function bezierBrush(ctx, geo, drawOptions) {
    ctx.beginPath();
    ctx.moveTo(geo[0][0], geo[0][1]);
    var p1 = geo[0];
    var p2 = geo[1];
    for (var i = 1; i < geo.length; i++) {
        var midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1[0], p1[1], midPoint.x, midPoint.y);
        p1 = geo[i];
        p2 = geo[i + 1];
    }
    ctx.stroke();
}

function midPointBtw(p1, p2) {
    return {
        x: p1[0] + (p2[0] - p1[0]) / 2,
        y: p1[1] + (p2[1] - p1[1]) / 2
    };
}

brushes.bezier = bezierBrush;

})();
