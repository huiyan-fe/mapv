/**
 * @author kyle / http://nikai.us/
 */

import Intensity from "../../utils/data-range/Intensity";
import pathSimple from "../path/simple";
import Canvas from "../../utils/Canvas";
import DataSet from "../../data/DataSet";
import {devicePixelRatio} from "../../utils/window";

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
    var min = options.min || 0;
    // console.log(max)
    var size = options._size;
    if (size == undefined) {
        size = options.size;
        if (size == undefined) {
            size = 13;
        }
    }

    var intensity = new Intensity({
        gradient: options.gradient,
        max: max,
        min: min
    });

    var circle = createCircle(size);
    var circleHalfWidth = circle.width / 2;
    var circleHalfHeight = circle.height / 2;

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
        context.strokeStyle = intensity.getColor(i * max);
        _data.forEach(function(item, index) {
            if (!item.geometry) {
                return;
            }

            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            var type = item.geometry.type;
            if (type === 'Point') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circleHalfWidth, coordinates[1] - circleHalfHeight);
            } else if (type === 'LineString') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.beginPath();
                pathSimple.draw(context, item, options);
                context.stroke();
            } else if (type === 'Polygon') {

            }
        });

    }
}

function draw(context, dataSet, options) {
    if (context.canvas.width <= 0 || context.canvas.height <= 0) {
        return;
    }

    var strength = options.strength || 0.3;
    context.strokeStyle = 'rgba(0,0,0,' + strength + ')';

    var shadowCanvas = new Canvas(context.canvas.width, context.canvas.height);
    var shadowContext = shadowCanvas.getContext('2d');
    shadowContext.scale(devicePixelRatio, devicePixelRatio);

    options = options || {};

    var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

    context.save();

    var intensity = new Intensity({
        gradient: options.gradient
    });

    //console.time('drawGray')
    drawGray(shadowContext, data, options);

    //console.timeEnd('drawGray');
    // return false;
    if (!options.absolute) {
        //console.time('changeColor');
        var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
        colorize(colored.data, intensity.getImageData(), options);
        //console.timeEnd('changeColor');
        context.putImageData(colored, 0, 0);

        context.restore();
    }

    intensity = null;
    shadowCanvas = null;
}

export default {
    draw: draw
}
