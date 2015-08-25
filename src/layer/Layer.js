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
        paneName: 'labelPane',
        map: null,
        context: '2d',
        data: [],
        dataType: 'point',
        animationOptions: {
            size: 5
        },
        coordType: 'bd09ll',
        drawType: 'simple',
        animation: false,
        geometry: null,
        dataRangeControl: true,
        zIndex: 1
    }, options));

    this.dataRangeControl = new DataRangeControl();

    this.notify('data');
    this.notify('mapv');

}

util.inherits(Layer, Class);

util.extend(Layer.prototype, {
    initialize: function () {
        if (this.canvasLayer) {
            return;
        }

        this.bindTo('map', this.getMapv());

        this.getMap().addControl(this.dataRangeControl);


        var that = this;

        this.canvasLayer = new CanvasLayer({
            map: this.getMap(),
            zIndex: this.getZIndex(),
            paneName : this.getPaneName(),
            update: function () {
                that.draw();
            },
            elementTag: "canvas"
        });

        this.setCtx(this.canvasLayer.getContainer().getContext(this.getContext()));

        if (this.getAnimation()) {
            this.animationLayer = new CanvasLayer({
                map: this.getMap(),
                zIndex: this.getZIndex(),
                elementTag: "canvas"
            });

            this.setAnimationCtx(this.animationLayer.getContainer().getContext(this.getContext()));
        }

    },

    draw: function () {

        if (!this.getMapv()) {
            return;
        }

        var ctx = this.getCtx();

        if (!ctx) {
            return false;
        }

        if (this.getContext() == '2d') {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        this._calculatePixel();

        this._getDrawer().drawMap();

        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationFlag) {
            this.drawAnimation();
            this._animationFlag = true;
        }

        this.dispatchEvent('draw');

    },

    drawAnimation: function () {
        var animationCtx = this.getAnimationCtx();

        if (!animationCtx ) {
            return false;
        }

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
            this.canvasLayer && this.canvasLayer.hide();
            return;
        } else {
            this.canvasLayer && this.canvasLayer.show();
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
        var mapv = this.getMapv();

        if (!mapv) {
            return;
        }

        var drawer = this._getDrawer();
        var map = this.getMap();

        // for drawer scale
        if(drawer.scale && this.getDataRangeControl()) {
            drawer.scale(mapv.Scale);
            mapv.Scale.show();
        } else {
            mapv && mapv.Scale.hide();
        }

        // mapv._drawTypeControl.showLayer(this);
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
            if (drawer.scale) {
                if (this.getMapv()) {
                    drawer.scale(this.getMapv().Scale);
                    this.getMapv().Scale.show();
                }
            } else {
                this.getMapv().Scale.hide();
            }
        }
        return this._drawer[drawType];
    },
    _calculatePixel: function () {
        var map = this.getMapv().getMap();
        var mercatorProjection = map.getMapType().getProjection();

        console.time('parseData');
        // 墨卡托坐标计算方法
        var zoom = map.getZoom();
        var zoomUnit = Math.pow(2, 18 - zoom);
        var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit,
            mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标
        var data = this.getData();
        var map = this.getMap();
        for (var j = 0; j < data.length; j++) {
            if (data[j].lng && data[j].lat && !data[j].x && !data[j].y) {

                var pixel = mercatorProjection.lngLatToPoint(new BMap.Point(data[j].lng, data[j].lat));
                data[j].x = pixel.x;
                data[j].y = pixel.y;
                //var pixel = map.pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
                //data[j].px = pixel.x;
                //data[j].py = pixel.y;
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
        console.timeEnd('parseData');
    },
    data_changed: function () {
        var data = this.getData();
        if (data && data.length > 0) {
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
            this.draw();
        }
    },
    getDataRange: function () {
        return {
            min: this._min,
            max: this._max
        };
    },
    zIndex_changed: function () {
        var zIndex = this.getZIndex();
        this.canvasLayer.setZIndex(zIndex);
    },

    dataRangeControl_changed: function () {
        this.updateControl();
        this._getDrawer().notify('drawOptions');
    }
});
