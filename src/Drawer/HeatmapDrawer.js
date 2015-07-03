/**
 * @file ***
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util drawOptions map*/

function HeatmapDrawer() {
    var self = this;
    self.masker = {};
    Drawer.apply(this, arguments);
    this._max = 20;
    this._data = [];
}

util.inherits(HeatmapDrawer, Drawer);

HeatmapDrawer.prototype.drawMap = function (mapv, ctx) {
    var self = this;
    mapv = self.mapv = self.mapv || mapv;
    ctx = self.ctx = self.ctx || ctx;
    this._ctx = ctx;
    this._map = map;
    this._width = ctx.canvas.width;
    this._height = ctx.canvas.height;
    var data = this._layer.getData();
    // var drawOptions = this.drawOptions;
    this._data = data;
    this.drawHeatmap();

    self.Scale.set({
        min: 0,
        max: self.getMax(),
        colors: this.getGradient()
    });
};

HeatmapDrawer.prototype.scale = function (scale) {
    var self = this;

    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };

        self.drawMap();
    });
    self.Scale = scale;
};

// HeatmapDrawer.prototype.drawDataRange = function () {
//     var canvas = this.mapv.getDataRangeCtrol().getContainer();
//     canvas.width = 60;
//     canvas.height = 160;
//     canvas.style.width = '60px';
//     canvas.style.height = '160px';

//     var ctx = canvas.getContext('2d');

//     var gradient = ctx.createLinearGradient(0, 0, 0, 160);

//     var grad = this.getGradient();

//     for (var i in grad) {
//         gradient.addColorStop(i, grad[i]);
//     }

//     ctx.fillStyle = gradient;
//     ctx.fillRect(5, 5, 30, 150);

//     ctx.fillStyle = '#333';
//     ctx.fillText(0, 37, 15);
//     ctx.fillText(this.getMax(), 37, 153);
// };

util.extend(HeatmapDrawer.prototype, {

    defaultRadius: 10,

    defaultGradient: {
        '0.4': 'blue',
        '0.6': 'cyan',
        '0.7': 'lime',
        '0.8': 'yellow',
        '1.0': 'red'
    },

    getGradient: function () {
        return this.drawOptions.gradient || this.defaultGradient;
    },

    getRadius: function () {
        var zoom = this._map.getZoom();
        var zoomUnit = Math.pow(2, 18 - zoom);
        var distance = this.drawOptions.radius || 200;
        return distance / zoomUnit;
    },

    getMax: function () {
        var max = this._max;
        if (this.drawOptions.max !== undefined) {
            max = this.drawOptions.max;
        } else {
            var dataRange = this.mapv.geoData.getDataRange();
            max = dataRange.min + (dataRange.max - dataRange.min) * 0.7;
        }
        return max;
    },

    data: function (data) {
        this._data = data;
        return this;
    },

    max: function (max) {
        this._max = max;
        return this;
    },

    add: function (point) {
        this._data.push(point);
        return this;
    },

    clear: function () {
        this._data = [];
        return this;
    },

    radius: function (r, blur) {
        blur = blur || 15;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = document.createElement('canvas'),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        if (this.drawOptions.type === 'rect') {
            circle.width = circle.height = r2;
        } else {
            circle.width = circle.height = r2 * 2;
        }

        ctx.shadowOffsetX = ctx.shadowOffsetY = 200;
        if (this.drawOptions.blur) {
            ctx.shadowBlur = blur;
        }
        ctx.shadowColor = 'black';

        ctx.beginPath();
        if (this.drawOptions.type === 'rect') {
            ctx.fillRect(-200, -200, circle.width, circle.height);
        } else {
            ctx.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
        }
        ctx.closePath();
        ctx.fill();

        return this;
    },

    gradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;

        return this;
    },

    drawHeatmap: function (minOpacity) {
        // if (!this._circle) {
        this.radius(this.getRadius());
        // }
        // if (!this._grad) {
        this.gradient(this.getGradient());
        // }

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        // console.log(this.masker)
        // draw a grayscale heatmap by putting a blurred circle at each data point
        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            if (p.px < 0 || p.py < 0 || p.px > ctx.canvas.width || p.py > ctx.canvas.height) {
                continue;
            }
            // if (p.count < this.masker.min || p.count > this.masker.max) {
            //     continue;
            // }
            // console.log(p.count)
            ctx.globalAlpha = Math.max(p.count / this.getMax(), minOpacity === undefined ? 0.05 : minOpacity);
            ctx.drawImage(this._circle, p.px - this._r, p.py - this._r);
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        // console.log( this._width, this._height)
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this.colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    },

    colorize: function (pixels, gradient) {
        var jMin = 0;
        var jMax = 1024;
        if (this.masker.min) {
            jMin = this.masker.min / this.getMax() * 1024;
        }

        if (this.masker.max) {
            jMax = this.masker.max / this.getMax() * 1024;
        }

        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value

            var maxOpacity = this.drawOptions.maxOpacity || 0.8;
            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }

            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            } else {
                pixels[i] = 0;
            }
        }
    }
});
