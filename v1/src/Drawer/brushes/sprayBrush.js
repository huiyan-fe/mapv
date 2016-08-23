(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function sprayBrush(ctx, geo, drawOptions) {
    ctx.beginPath();
    var density = 50;
    for (var i = 0; i < geo.length; i++) {
        for (var j = density; j--; ) {
          var radius = 10;
          var offsetX = getRandomInt(-radius, radius);
          var offsetY = getRandomInt(-radius, radius);
          ctx.fillRect(geo[i][0] + offsetX, geo[i][1] + offsetY, 1, 1);
        }
    }
}

brushes.spray = sprayBrush;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

})();
