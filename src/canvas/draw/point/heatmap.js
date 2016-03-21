/**
 * @author kyle / http://nikai.us/
 */

import utilsColorPalette from "../../utils/colorPalette";

function createCircle(radius) {

    var circle = document.createElement('canvas');
    var context = circle.getContext('2d');
    var shadowBlur = 13;
    var r2 = radius + shadowBlur;
    var offsetDistance = 10000;

    circle.width = circle.height = r2 * 2;

    context.shadowBlur = shadowBlur;
    context.shadowColor = 'black';
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;

    context.beginPath();
    context.arc(r2 - offsetDistance, r2 - offsetDistance, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    return circle;
}

function colorize(pixels, gradient, options) {

    var maxOpacity = options.maxOpacity || 0.8;
    for (var i = 3, len = pixels.length, j; i < len; i += 4) {
        j = pixels[i] * 4; // get gradient color from opacity value

        if (pixels[i] / 256 > maxOpacity) {
            pixels[i] = 256 * maxOpacity;
        }

        pixels[i - 3] = gradient[j];
        pixels[i - 2] = gradient[j + 1];
        pixels[i - 1] = gradient[j + 2];
    }
}

function draw(context, data, options) {

    options = options || {};

    context.save();

    var max = options.max || 100;
    var radius = options.radius || 13;
    var circle = createCircle(radius);

    data.forEach(function(item) {

        context.globalAlpha = item.count / max;
        context.drawImage(circle, item.x - circle.width / 2, item.y - circle.height / 2);

    });

    var colored = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    colorize(colored.data, utilsColorPalette.getImageData({
        defaultGradient: options.gradient || { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
    }), options);

    context.putImageData(colored, 0, 0);

    context.restore();

}

export default {
    draw: draw
}
