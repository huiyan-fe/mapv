/**
 * @author kyle / http://nikai.us/
 */

var paletteCanvasCache = {};

export default {
    getColor: function (value, max, gradientOptions) {
        var paletteCanvas = document.createElement('canvas');
        paletteCanvas.width = 256;
        paletteCanvas.height = 1;

        var paletteCtx = paletteCanvas.getContext('2d');

        var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradientOptions) {
          gradient.addColorStop(key, gradientOptions[key]);
        }

        paletteCtx.fillStyle = gradient;
        paletteCtx.fillRect(0, 0, 256, 1);

        var index = Math.floor(value / max * (256 - 1)) * 4;
        var imageData = paletteCtx.getImageData(0, 0, 256, 1).data;
        return "rgba(" + imageData[index] + ", " + imageData[index + 1] + ", " + imageData[index + 2] + ", " + imageData[index + 3] + ")";
    }
}
