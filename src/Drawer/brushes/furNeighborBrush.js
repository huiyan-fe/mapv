(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function furNeighborBrush(ctx, geo, drawOptions) {

    for (var i = 1; i < geo.length; i++) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(geo[i - 1][0], geo[i - 1][1]);
        ctx.lineTo(geo[i][0], geo[i][1]);
        ctx.globalAlpha = 1;
        ctx.stroke();
      
        for (var j = 0, len = i; j < len; j++) {
            var dx = geo[j][0] - geo[i][0];
            var dy = geo[j][1] - geo[i][1];
            var d = dx * dx + dy * dy;

            if (d < 50 * 50 && Math.random() < d / 50 * 50) {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.1;
                ctx.moveTo( geo[i][0] + (dx * 0.2), geo[i][1] + (dy * 0.2));
                ctx.lineTo( geo[j][0] - (dx * 0.2), geo[j][1] - (dy * 0.2));
                ctx.stroke();
            }
        }
    }
}

brushes.furNeighbor = furNeighborBrush;

})();
