/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function Layer (options) {

    Class.call(this);

    this.ctx = null;
    this._drawer = {};

    this.options = {
        drawType: 'simple',
        data: []
    };

    util.extend(this.options, options);
    this.setData(this.options.data);
}

util.inherits(Layer, Class);

util.extend(Layer.prototype, {
    initialize: function () {
        if (this.mapMask) {
            return;
        }

        this.mapMask = new MapMask({
            map: this._mapv.getMap(),
            zIndex: this.options.zIndex,
            elementTag: "canvas"
        });

        this.ctx = this.mapMask.getContainer().getContext("2d");

        var that = this;
        this.mapMask.addEventListener('draw', function () {
            that.draw();
        });
    },

    draw: function () {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = ctx.canvas.width;
        ctx.canvas.height = ctx.canvas.height;
        this._calculatePixel();

        this._getDrawer().drawMap(this._mapv, ctx);
    },

    _layerAdd: function (mapv) {
        this._mapv = mapv;
        var map = this._mapv.getMap();
        this.initialize();
        this.updateControl();

        this.draw();
    },

    getData: function () {
        return this.options.data;
    },

    setDrawType: function (drawType) {
        this.options.drawType = drawType;
        this.updateControl();
        this.draw();
    },

    updateControl: function () {
        var mapv = this._mapv;
        var drawer = this._getDrawer();
        if (drawer.drawDataRange) {
            map.addControl(mapv._dataRangeCtrol);
            drawer.drawDataRange(mapv._dataRangeCtrol.getContainer());
        } else {
            map.removeControl(mapv._dataRangeCtrol);
        }
        mapv._drawTypeControl.showLayer(this);
        this._mapv.OptionalData && this._mapv.OptionalData.initController(this, this.options.drawType);
    },

    _getDrawer: function () {
        var drawType = this.options.drawType;

        if (!this._drawer[drawType]) {
            var funcName = drawType.replace(/(\w)/, function (v) {
                return v.toUpperCase();
            });
            funcName += 'Drawer';
            var drawer = this._drawer[drawType] = eval('(new ' + funcName + '(this))');
            drawer.setDrawOptions(this.options.drawOptions[drawType]);
            if (drawer.scale) {
                drawer.scale(this._mapv.Scale);
                this._mapv.Scale.show();
            } else {
                this._mapv.Scale.hide();
            }
        }
        return this._drawer[drawType];
    },

    _calculatePixel: function () {
        var map = this._mapv.getMap();
        var mercatorProjection = map.getMapType().getProjection();
        // 墨卡托坐标计算方法
        var zoom = map.getZoom();
        var zoomUnit = Math.pow(2, 18 - zoom);
        var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit,
            mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

        var data = this.options.data;

        for (var j = 0; j < data.length; j++) {

            if (data[j].lng && data[j].lat) {
                var pixel = this._mapv.getMap().pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
                data[j].px = pixel.x;
                data[j].py = pixel.y;
            }

            if (data[j].x && data[j].y) {

                data[j].px = (data[j].x - nwMc.x) / zoomUnit;
                data[j].py = (nwMc.y - data[j].y) / zoomUnit;

            }
        }
    },

    setData: function (data) {
        // console.log('GGGG',data)
        if (!data) {
            this.data = [];
            return;
        }

        this._min = data[0].count;
        this._max = data[0].count;
        for (var i = 0; i < data.length; i++) {
            this._max = Math.max(this._max, data[i].count);
            this._min = Math.min(this._min, data[i].count);
        }
        this.options.data = data;
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

