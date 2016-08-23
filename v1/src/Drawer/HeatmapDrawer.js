/**
 * @file Heatmap Draw
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

HeatmapDrawer.prototype.drawMap = function () {
    // console.log('---??? do ')
    var self = this;

    self.Scale && self.Scale.set({
        min: 0,
        max: self.getMax(),
        colors: this.getGradient()
    });

    this.beginDrawMap();

    var ctx = this.getCtx();

    this._width = ctx.canvas.width;
    this._height = ctx.canvas.height;

    var data = this.getLayer().getData();
    this._data = data;

    if (this._width > 0 && this._height > 0) {
        console.time('drawHeatMap');
        this.drawHeatmap();
        console.timeEnd('drawHeatMap');
    }

    this.endDrawMap();
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
        return this.getDrawOptions().gradient || this.defaultGradient;
    },

    getMax: function () {
        var max = this._max;
        if (this.getDrawOptions().max !== undefined) {
            max = this.getDrawOptions().max;
        } else {
            var dataRange = this.getLayer().getDataRange();
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

    radius: function (r) {

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = document.createElement('canvas'),
            ctx = circle.getContext('2d');

        var shadowBlur = 0;

        if (this.getDrawOptions().shadowBlur !== undefined) {
            shadowBlur = parseFloat(this.getDrawOptions().shadowBlur);
        } else {
            shadowBlur = 0;
        }

        var r2 = this._r = r + shadowBlur;

        if (this.getDrawOptions().type === 'rect') {
            circle.width = circle.height = r2;
        } else {
            circle.width = circle.height = r2 * 2;
        }

        var offsetDistance;

        if (this.getDrawOptions().shadowBlur !== undefined) {
            ctx.shadowBlur = shadowBlur;
            ctx.shadowColor = 'black';
            offsetDistance = 10000;

        } else {
            offsetDistance = 0;

            var grad  = ctx.createRadialGradient(r2 - offsetDistance, r2 - offsetDistance, 0, r2 - offsetDistance, r2 - offsetDistance, r);
            /* 设定各个位置的颜色 */
            grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
        }

        ctx.shadowOffsetX = ctx.shadowOffsetY = offsetDistance;

        ctx.beginPath();
        if (this.getDrawOptions().type === 'rect') {
            ctx.fillRect(-offsetDistance, -offsetDistance, circle.width, circle.height);
        } else {
            ctx.arc(r2 - offsetDistance, r2 - offsetDistance, r, 0, Math.PI * 2, true);
        }
        ctx.closePath();
        ctx.fill();

        return this;
    },

    drawHeatmap: function (minOpacity) {
        // if (!this._circle) {
        this.radius(this.getRadius());
        // }

        var ctx = this.getCtx();
        ctx.save();

        ctx.clearRect(0, 0, this._width, this._height);

        // console.log(this.masker)
        // draw a grayscale heatmap by putting a blurred circle at each data point
        var dataType = this.getLayer().getDataType();
        var max = this.getMax();
        if (dataType === 'polyline') {
            ctx.strokeStyle = this.getDrawOptions().strokeStyle || 'rgba(0, 0, 0, 0.8)';

            /*
            ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0.1;
            ctx.shadowColor = 'black';
            */

            ctx.lineWidth = this.getDrawOptions().lineWidth || 1;
            ctx.beginPath();
            for (var i = 0, len = this._data.length; i < len; i++) {
                p = this._data[i];
                var geo = p.pgeo;
                ctx.beginPath();
                ctx.moveTo(geo[0][0], geo[0][1]);
                for (var j = 1; j < geo.length; j++) {
                    ctx.lineTo(geo[j][0], geo[j][1]);
                }
                ctx.globalAlpha = Math.max(p.count / max, minOpacity === undefined ? 0.05 : minOpacity);
                ctx.stroke();
            }

        } else {

            var boundary = this.getDrawOptions().boundary || this._circle.width + 50;

            console.time('drawImageData');
            console.log('data', this._data.length, this._data);
            for (var i = 0, len = this._data.length, p; i < len; i++) {
                p = this._data[i];
                if (p.px < -boundary || p.py < -boundary || p.px > ctx.canvas.width + boundary || p.py > ctx.canvas.height + boundary) {
                    //continue;
                }
                // if (p.count < this.masker.min || p.count > this.masker.max) {
                //     continue;
                // }
                // console.log(p.count)
                ctx.globalAlpha = Math.max(p.count / max, minOpacity === undefined ? 0.05 : minOpacity);
                ctx.drawImage(this._circle, p.px - this._r, p.py - this._r);
            }
            console.timeEnd('drawImageData');
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        // console.log( this._width, this._height)

        var colored = ctx.getImageData(0, 0, this._width, this._height);
        console.time('colorize');
        this.colorize(colored.data, this.dataRange.getGradient());
        console.timeEnd('colorize');
        ctx.putImageData(colored, 0, 0);

        ctx.restore();
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

        var maxOpacity = this.getDrawOptions().maxOpacity || 0.8;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value

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
