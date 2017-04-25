
function Canvas(width, height) {

    var canvas;

    if (typeof document === 'undefined') {

        var Canvas = require('canvas');
        canvas = new Canvas(width, height);

    } else {

        var canvas= document.createElement('canvas');

        if (width) {
            canvas.width = width;
        }

        if (height) {
            canvas.height = height;
        }

    }

    return canvas;
}

export default Canvas;
