(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function neighborBrush(ctx, geo, drawOptions) {

    ctx.beginPath();

    for (var i = 1; i < geo.length; i++) {

        ctx.moveTo(geo[i - 1][0], geo[i - 1][1]);
        ctx.lineTo(geo[i][0], geo[i][1]);
      
        for (var j = 0, len = i; j < len; j++) {
            var dx = geo[j][0] - geo[i][0];
            var dy = geo[j][1] - geo[i][1];
            var d = dx * dx + dy * dy;

            if (d > 10 * 10 && d < 30 * 30) {
                ctx.moveTo( geo[i][0] + (dx * 0.2), geo[i][1] + (dy * 0.2));
                ctx.lineTo( geo[j][0] - (dx * 0.2), geo[j][1] - (dy * 0.2));
            }
        }
    }

    ctx.stroke();


}

brushes.neighbor = neighborBrush;

})();
