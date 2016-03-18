(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.mapv = global.mapv || {})));
}(this, function (exports) { 'use strict';

    var version = "0.0.0";

    var _3d = '3d';

    var drawPointSimple = {
        draw: function(context, data) {
            
            data.forEach(function(item) {

                context.beginPath();
                context.arc(item.x, item.y, item.size, 0, Math.PI * 2);
                context.fill();

            });

        }
    }

    var utilsColorPalette = {
        getImageData: function(config) {
            var gradientConfig = config.gradient || config.defaultGradient;
            var paletteCanvas = document.createElement('canvas');
            var paletteCtx = paletteCanvas.getContext('2d');

            paletteCanvas.width = 256;
            paletteCanvas.height = 1;

            var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
            for (var key in gradientConfig) {
              gradient.addColorStop(key, gradientConfig[key]);
            }

            paletteCtx.fillStyle = gradient;
            paletteCtx.fillRect(0, 0, 256, 1);

            return paletteCtx.getImageData(0, 0, 256, 1).data;
        }
    }

    function createCircle(radius) {

        var circle = document.createElement('canvas');
        var ctx = circle.getContext('2d');
        var shadowBlur = 13;
        var r2 = radius + shadowBlur;
        var offsetDistance = 10000;

        circle.width = circle.height = r2 * 2;

        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = ctx.shadowOffsetY = offsetDistance;

        ctx.beginPath();
        ctx.arc(r2 - offsetDistance, r2 - offsetDistance, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return circle;
    }

    function colorize(pixels, gradient) {

        var maxOpacity = 0.8;
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

    function draw(ctx, data, options) {
        var max = 30;
        var radius = 13;
        var circle = createCircle(radius);

        data.forEach(function(item) {

            ctx.globalAlpha = item.size / max;
            ctx.drawImage(circle, item.x - circle.width / 2, item.y - circle.height / 2);

        });


        var colored = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        colorize(colored.data, utilsColorPalette.getImageData({
            defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
        }));
        ctx.putImageData(colored, 0, 0);
    }

    var drawPointHeatmap = {
        draw: draw
    }

    var point = {
        draw: function (context, data, options) {

            context.save();

            for (var key in options) {
                context[key] = options[key];
            }

            if (options.draw == 'heatmap') {
                drawPointHeatmap.draw(context, data);
            } else {
                drawPointSimple.draw(context, data);
            }

            context.restore();

        }
    }

    exports.version = version;
    exports.X = _3d;
    exports.canvasPoint = point;
    exports.canvasDrawPointSimple = drawPointSimple;

}));