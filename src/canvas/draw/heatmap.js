/**
 * @author kyle / http://nikai.us/
 */

import utilsColorPalette from "../utils/colorPalette";
import Intensity from "../../utils/data-range/Intensity";
import pathSimple from "../path/simple";
import Canvas from "../../utils/Canvas";
import DataSet from "../../data/DataSet";

function createCircle(size) {

    var shadowBlur = size / 2;
    var r2 = size + shadowBlur;
    var offsetDistance = 10000;

    var circle = new Canvas(r2 * 2, r2 * 2);
    var context = circle.getContext('2d');

    context.shadowBlur = shadowBlur;
    context.shadowColor = 'black';
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;

    context.beginPath();
    context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
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

function drawGray(context, dataSet, options) {

    var max = options.max || 100;
    // console.log(max)
    var size = options._size;
    if (size == undefined) {
        size = options.size;
        if (size == undefined) {
            size = 13;
        }
    }

    var color = new Intensity({
        gradient: options.gradient,
        max: max
    })

    var circle = createCircle(size);

    var data = dataSet;



    var dataOrderByAlpha = {};

    data.forEach(function(item, index) {
        var count = item.count === undefined ? 1 : item.count;
        var alpha = Math.min(1, count / max).toFixed(2);
        dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
        dataOrderByAlpha[alpha].push(item);
    });

    for (var i in dataOrderByAlpha) {
        if (isNaN(i)) continue;
        var _data = dataOrderByAlpha[i];
        context.beginPath();
        if (!options.withoutAlpha) {
            context.globalAlpha = i;
        }
        _data.forEach(function(item, index) {
            if (!item.geometry) {
                return;
            }

            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            var type = item.geometry.type;
            if (type === 'Point') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circle.width / 2, coordinates[1] - circle.height / 2);
            } else if (type === 'LineString') {
                pathSimple.draw(context, item, options);
            } else if (type === 'Polygon') {

            }
        });
        // console.warn(i, i * max, color.getColor(i * max))
        context.strokeStyle = color.getColor(i * max);
        context.stroke();
    }
}

function draw(context, dataSet, options) {
    var strength = options.strength || 0.3;
    context.strokeStyle = 'rgba(0,0,0,' + strength + ')';

    options = options || {};

    var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

    context.save();
    //console.time('drawGray')
    drawGray(context, data, options);
    //console.timeEnd('drawGray');
    // return false;
    if (!options.absolute) {
        //console.time('changeColor');
        var colored = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        colorize(colored.data, utilsColorPalette.getImageData({
            defaultGradient: options.gradient || { 
                0.25: "rgba(0, 0, 255, 1)",
                0.55: "rgba(0, 255, 0, 1)",
                0.85: "rgba(255, 255, 0, 1)",
                1.0: "rgba(255, 0, 0, 1)"
            }
        }), options);
        //console.timeEnd('changeColor');
        context.putImageData(colored, 0, 0);

        context.restore();
    }
}

export default {
    draw: draw
}
