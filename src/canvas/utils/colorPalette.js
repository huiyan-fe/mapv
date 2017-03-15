/**
 * @author kyle / http://nikai.us/
 */

import Canvas from "../../utils/Canvas";

export default {
    getImageData: function(config) {
        var gradientConfig = config.gradient || config.defaultGradient;
        var canvas = new Canvas(256, 1);
        var paletteCtx = canvas.getContext('2d');

        var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradientConfig) {
          gradient.addColorStop(parseFloat(key), gradientConfig[key]);
        }

        paletteCtx.fillStyle = gradient;
        paletteCtx.fillRect(0, 0, 256, 1);

        return paletteCtx.getImageData(0, 0, 256, 1).data;
    }
}
