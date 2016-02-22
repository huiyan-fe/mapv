(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function penBrush(ctx, geo, drawOptions) {
    ctx.beginPath();
    for (var i = 1; i < geo.length; i++) {
        ctx.beginPath();
        ctx.moveTo(geo[i - 1][0], geo[i - 1][1]);
        ctx.lineWidth = Math.floor(Math.random() * 3) + 3;
        ctx.lineTo(geo[i][0], geo[i][1]);
        ctx.stroke();
    }
}

brushes.pen = penBrush;

})();
