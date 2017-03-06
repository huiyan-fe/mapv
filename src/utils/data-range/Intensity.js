/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} [options]   Available options:
 *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
 */
function Intensity(options) {

    options = options || {};
    this.gradient = options.gradient || { 
        0.25: "rgba(0, 0, 255, 1)",
        0.55: "rgba(0, 255, 0, 1)",
        0.85: "rgba(255, 255, 0, 1)",
        1.0: "rgba(255, 0, 0, 1)"
    };
    this.maxSize = options.maxSize || 35;
    this.minSize = options.minSize || 0;
    this.max = options.max || 100;
    this.initPalette();
}

Intensity.prototype.initPalette = function () {

    var gradient = this.gradient;

    if (typeof document === 'undefined') {
        // var Canvas = require('canvas');
        // var paletteCanvas = new Canvas(256, 1);
    } else {
        var paletteCanvas = document.createElement('canvas');
    }

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    var paletteCtx = this.paletteCtx = paletteCanvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, 256, 1);

}

Intensity.prototype.getColor = function (value) {

    var imageData = this.getImageData(value);

    return "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] / 256 + ")";

}

Intensity.prototype.getImageData = function (value) {
    var max = this.max;

    if (value > max) {
        value = max;
    }

    var index = Math.floor(value / max * (256 - 1)) * 4;

    var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

    return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
}

/**
 * @param Number value 
 * @param Number max of value
 * @param Number max of size
 * @param Object other options
 */
Intensity.prototype.getSize = function (value) {

    var size = 0;
    var max = this.max;
    var maxSize = this.maxSize;
    var minSize = this.minSize;

    if (value > max) {
        value = max;
    }

    size = minSize + value / max * (maxSize - minSize);

    return size;

}

Intensity.prototype.getLegend = function (options) {
    var gradient = this.gradient;

    var paletteCanvas = document.createElement('canvas');

    var width = options.width || 20;
    var height = options.height || 180;

    paletteCanvas.width = width;
    paletteCanvas.height = height;

    var paletteCtx = paletteCanvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, width, height);

    return paletteCanvas;
}


export default Intensity;
