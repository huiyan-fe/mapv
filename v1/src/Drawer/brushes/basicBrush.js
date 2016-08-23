(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function basicBrush(ctx, geo, drawOptions) {
    ctx.beginPath();
    ctx.moveTo(geo[0][0], geo[0][1]);
    for (var i = 1; i < geo.length; i++) {
        ctx.lineTo(geo[i][0], geo[i][1]);
    }
    ctx.stroke();
}

brushes.basic = basicBrush;

})();
