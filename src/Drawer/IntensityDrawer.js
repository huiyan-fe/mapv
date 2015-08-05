/**
 * @file 按渐变颜色分类绘制方法
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function IntensityDrawer() {
    this.masker = {
        min: 0,
        max: 0
    };
    Drawer.apply(this, arguments);

    // 临时canvas，用来绘制颜色条，获取颜色
    this._tmpCanvas = document.createElement('canvas');
}

util.inherits(IntensityDrawer, Drawer);

IntensityDrawer.prototype.defaultGradient = {
    '0.0': 'yellow',
    '1.0': 'red'
};

IntensityDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var self = this;
    var ctx = this.getCtx();

    var data = this.getLayer().getData();
    var drawOptions = this.getDrawOptions();
    ctx.strokeStyle = drawOptions.strokeStyle;

    var ctxW = ctx.canvas.width;
    var ctxH = ctx.canvas.height;

    window.console.time('drawMap');

    var radius = this.getRadius();

    var dataType = this.getLayer().getDataType();

    var label = drawOptions.label;
    var zoom = this.getMap().getZoom();
    if (label) {
        if (label.font) {
            ctx.font = label.font;
        }
    }

    if (dataType === 'polygon') {

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            ctx.beginPath();
            ctx.moveTo(geo[0][0], geo[0][1]);
            ctx.fillStyle = this.dataRange.getColorByGradient(data[i].count);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }
            ctx.closePath();
            ctx.fill();

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i].count, center[0], center[1]);
            }
        }

    } else { 

        // 画点数据
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            if (item.px < 0 || item.px > ctxW || item.py < 0 || item.py > ctxH) {
                continue;
            }
            var isTooSmall = self.masker.min && (item.count < self.masker.min);
            var isTooBig = self.masker.max && (item.count > self.masker.max);
            if (isTooSmall || isTooBig) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(item.px, item.py);
            ctx.fillStyle = this.dataRange.getColorByGradient(item.count);
            ctx.arc(item.px, item.py, radius || 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

    }

    window.console.timeEnd('drawMap');

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

    this.Scale && this.Scale.set({
        min: 0,
        max: self.getMax(),
        colors: this.getGradient()
    });

    this.dataRange.setMax(self.getMax());

    this.endDrawMap();
};

IntensityDrawer.prototype.getGradient = function () {
    return this.getDrawOptions().gradient || this.defaultGradient;
}

IntensityDrawer.prototype.scale = function (scale) {
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

IntensityDrawer.prototype.getMax = function () {
    var dataRange = this.getLayer().getDataRange();
    var max = dataRange.max;

    if (this.getDrawOptions().max) {
        max = this.getDrawOptions().max;
    }
    return max;
};
