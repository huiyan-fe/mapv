(function(){

/**
 * @file basic
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */
function coloredBrush(ctx, geo, drawOptions) {
    
    ctx.beginPath();
    for (var j = 0; j < geo.length; j++) {
        drawPixels(ctx, geo[j][0], geo[j][1]);
    }
}

function drawPixels(ctx, x, y) {
  for (var i = -10; i < 10; i += 4) {
    for (var j = -10; j < 10; j += 4) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 
                         'light-blue', 'blue', 'purple'][getRandomInt(0, 6)];
        ctx.fillRect(x + i, y + j, 2, 4);
      }
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

brushes.colored = coloredBrush;

})();
