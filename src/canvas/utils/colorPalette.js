export default {
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
