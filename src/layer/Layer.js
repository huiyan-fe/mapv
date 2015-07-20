/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function Layer (options) {
    Class.call(this);

    this._drawer = {};

    this.initOptions($.extend({
        ctx: null,
        animationCtx: null,
        mapv: null,
        map: null,
        data: [],
        dataType: 'point',
        animationOptions: {
            radius: 5
        },
        coordType: 'bd09ll',
        drawType: 'simple',
        animation: false,
        geometry: null,
        zIndex: 1
    }, options));

    this.notify('data');
    this.notify('mapv');

}

util.inherits(Layer, Class);

util.extend(Layer.prototype, {
    initialize: function () {
        if (this.mapMask) {
            return;
        }

        this.setMap(this.getMapv().getMap());
        this.bindTo('map', this.getMapv());

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

        if (this.getAnimation()) {
            this.animationMask = new MapMask({
                map: this.getMapv().getMap(),
                zIndex: this.getZIndex(),
                elementTag: "canvas"
            });

            this.setAnimationCtx(this.animationMask.getContainer().getContext("2d"));
        }

    },

    draw: function () {
        var ctx = this.getCtx();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this._calculatePixel();

        this._getDrawer().drawMap();

        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationFlag) {
            this.drawAnimation();
            this._animationFlag = true;
        }

    },

    drawAnimation: function () {
        var animationCtx = this.getAnimationCtx();
        animationCtx.clearRect(0, 0, animationCtx.canvas.width, animationCtx.canvas.height);

        var that = this;
        this._getDrawer().drawAnimation();

        if (this.getAnimation()) {
            requestAnimationFrame(function () {
                that.drawAnimation();
            });
        }
    },

    animation_changed: function () {
        if (this.getAnimation()) {
            this.drawAnimation();
        }
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
        this.draw();
    },

    updateControl: function () {
        console.log('update con')
        var mapv = this.getMapv();
        console.log('update con1')
        var drawer = this._getDrawer();
        console.log('update con2')
        if (drawer.drawDataRange) {
            map.addControl(mapv.getDataRangeCtrol());
            drawer.drawDataRange(mapv.getDataRangeCtrol().getContainer());
        } else {
            map.removeControl(mapv.getDataRangeCtrol());
        }
        console.log('update con3')
        // for drawer scale
        if(drawer.scale) {
            drawer.scale(mapv.Scale);
            mapv.Scale.show();
        } else {
            mapv.Scale.hide();
        }
        console.log('update con4')
        // mapv._drawTypeControl.showLayer(this);
        this.getMapv().OptionalData && this.getMapv().OptionalData.initController(this, this.getDrawType());
        console.log('update conend')
    },
    _getDrawer: function () {
        console.log('1')
        var drawType = this.getDrawType();
        console.log('2')
        if (!this._drawer[drawType]) {
            console.log('***')
            var funcName = drawType.replace(/(\w)/, function (v) {
                return v.toUpperCase();
            });
            funcName += 'Drawer';
            var drawer = this._drawer[drawType] = eval('(new ' + funcName + '(this))');
            drawer.setDrawOptions(this.getDrawOptions()/*[drawType]*/);
            if (drawer.scale) {
                drawer.scale(this.getMapv().Scale);
                this.getMapv().Scale.show();
            } else {
                this.getMapv().Scale.hide();
            }
        }
        console.log('3')
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
        var map = this.getMap();
        for (var j = 0; j < data.length; j++) {
            if (data[j].lng && data[j].lat) {
                var pixel = map.pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
                data[j].px = pixel.x;
                data[j].py = pixel.y;
            }
            if (data[j].x && data[j].y) {
                data[j].px = (data[j].x - nwMc.x) / zoomUnit;
                data[j].py = (nwMc.y - data[j].y) / zoomUnit;
            }
            if (data[j].geo) {
                var tmp = [];
                if (this.getCoordType() === 'bd09ll') {
                    for (var i = 0; i < data[j].geo.length; i++) {
                        var pixel = map.pointToPixel(new BMap.Point(data[j].geo[i][0], data[j].geo[i][1]));
                        tmp.push([pixel.x, pixel.y]);
                    }
                } else if (this.getCoordType() === 'bd09mc') {
                    for (var i = 0; i < data[j].geo.length; i++) {
                        tmp.push([(data[j].geo[i][0] - nwMc.x) / zoomUnit, (nwMc.y - data[j].geo[i][1]) / zoomUnit]);
                    }
                }
                data[j].pgeo = tmp;
            }
        }
    },
    data_changed: function () {
        var data = this.getData();
        if (!data || data.length < 1) {
            return;
        }
        if (this.getDataType() === "polyline" && this.getAnimation()) {
            for (var i = 0; i < data.length; i++) {
                data[i].index = parseInt(Math.random() * data[i].geo.length, 10);
            }
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
