/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function Layer (options) {

    Class.call(this);

    this._drawer = {};

    this.initOptions($.extend({
        ctx: null,
        mapv: null,
        drawType: 'simple',
        data: [],
        zIndex: 1
    }, options));

    this.notify('mapv');

}

util.inherits(Layer, Class);

util.extend(Layer.prototype, {
    initialize: function () {
        if (this.mapMask) {
            return;
        }

        this.mapMask = new MapMask({
            map: this.getMapv().getMap(),
            zIndex: this.getZIndex(),
            elementTag: "canvas"
        });

        this.setCtx(this.mapMask.getContainer().getContext("2d"));

        var that = this;
        this.mapMask.addEventListener('draw', function () {
            that.draw();
        });
    },

    draw: function () {
        var ctx = this.getCtx();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = ctx.canvas.width;
        ctx.canvas.height = ctx.canvas.height;
        this._calculatePixel();

        this._getDrawer().drawMap();
    },

    mapv_changed: function () {
        if (!this.getMapv()) {
            this.mapMask && this.mapMask.hide();
            return;
        } else {
            this.mapMask && this.mapMask.show();
        }

        this.initialize();
        this.updateControl();

        this.draw();
    },

    drawType_changed: function () {
        this.updateControl();
        this.draw();
    },

    drawOptions_changed: function () {
        this.updateControl();
        var drawOptions = this.getDrawOptions();
        for (var key in drawOptions) {
            if (this._drawer[key]) {
                this._drawer[key].setDrawOptions(drawOptions[key]);
            }
        }
        this.draw();
    },

    updateControl: function () {
        var mapv = this.getMapv();
        var drawer = this._getDrawer();
        if (drawer.drawDataRange) {
            map.addControl(mapv.getDataRangeCtrol());
            drawer.drawDataRange(mapv.getDataRangeCtrol().getContainer());
        } else {
            map.removeControl(mapv.getDataRangeCtrol());
        }

        // for drawer scale
        if(drawer.scale) {
            drawer.scale(mapv.Scale);
            mapv.Scale.show();
        } else {
            mapv.Scale.hide();
        }

        mapv._drawTypeControl.showLayer(this);
        this.getMapv().OptionalData && this.getMapv().OptionalData.initController(this, this.getDrawType());
    },

    _getDrawer: function () {
        var drawType = this.getDrawType();

        if (!this._drawer[drawType]) {
            var funcName = drawType.replace(/(\w)/, function (v) {
                return v.toUpperCase();
            });
            funcName += 'Drawer';
            var drawer = this._drawer[drawType] = eval('(new ' + funcName + '(this))');
            drawer.setDrawOptions(this.getDrawOptions()[drawType]);
            if (drawer.scale) {
                drawer.scale(this.getMapv().Scale);
                this.getMapv().Scale.show();
            } else {
                this.getMapv().Scale.hide();
            }
        }
        return this._drawer[drawType];
    },

    _calculatePixel: function () {
        var map = this.getMapv().getMap();
        var mercatorProjection = map.getMapType().getProjection();
        // 墨卡托坐标计算方法
        var zoom = map.getZoom();
        var zoomUnit = Math.pow(2, 18 - zoom);
        var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit,
            mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

        var data = this.getData();

        for (var j = 0; j < data.length; j++) {

            if (data[j].lng && data[j].lat) {
                var pixel = this.getMapv().getMap().pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
                data[j].px = pixel.x;
                data[j].py = pixel.y;
            }

            if (data[j].x && data[j].y) {

                data[j].px = (data[j].x - nwMc.x) / zoomUnit;
                data[j].py = (nwMc.y - data[j].y) / zoomUnit;

            }
        }
    },

    data_changed: function () {
        var data = this.getData();

        if (!data || data.length < 1) {
            return;
        }

        this._min = data[0].count;
        this._max = data[0].count;
        for (var i = 0; i < data.length; i++) {
            this._max = Math.max(this._max, data[i].count);
            this._min = Math.min(this._min, data[i].count);
        }
    },

    getDataRange: function () {
        return {
            min: this._min,
            max: this._max
        };
    }
});

util.extend(Mapv.prototype, {

    addLayer: function (layer) {
        this._layers.push(layer);
        layer._layerAdd(this);
    },

    removeLayer: function (layer) {
        for (var i = this._layers.length--; i >= 0; i--) {
            if (this._layers[i] === layer) {
                this._layers.splice(i, 1);
            }
        }
    }
});
