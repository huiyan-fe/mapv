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
    this.Scale = new DrawScale();

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
        this.getMap().addControl(this.Scale);

        var that = this;

        this.canvasLayer = new CanvasLayer({
            map: this.getMap(),
            context: this.getContext(),
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

        var me = this;

        if (!this.getMapv()) {
            return;
        }

        var ctx = this.getCtx();

        if (!ctx) {
            return false;
        }

        this._calculatePixel();

        if (this.getAnimation() !== 'time') {

            if (this.getContext() == '2d') {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }

            this._getDrawer().drawMap();

        }


        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationFlag) {
            this.drawAnimation();

            this._animationFlag = true;
        }


        var animationOptions = this.getAnimationOptions() || {};
        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationTime) {
            this._animationTime = true;
            var timeline = this.timeline = new Animation({
                duration: animationOptions.duration || 10000,  // 动画时长, 单位毫秒
                fps: animationOptions.fps || 30,         // 每秒帧数
                delay: animationOptions.delay || Animation.INFINITE,        // 延迟执行时间，单位毫秒,如果delay为infinite则表示手动执行
                transition: Transitions[animationOptions.transition || "linear"],
                onStop: animationOptions.onStop || function (e) { // 调用stop停止时的回调函数
                    console.log('stop', e);
                },
                render: function(e) {

                    if (me.getContext() == '2d') {
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                    var time = parseInt(parseFloat(me._minTime) + (me._maxTime - me._minTime) * e);
                    me._getDrawer().drawMap(time);

                    animationOptions.render && animationOptions.render(time);

                }
            });

            timeline.setFinishCallback(function(){
                //setTimeout(function(){
                    timeline.start();
                //}, 3000);
            });

            timeline.start();
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
            drawer.scale(this.Scale);
            this.Scale.show();
        } else {
            this.Scale.hide();
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
                    drawer.scale(this.Scale);
                    this.Scale.show();
                }
            } else {
                this.Scale.hide();
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
                        tmp.push([pixel.x, pixel.y, parseFloat(data[j].geo[i][2])]);
                    }
                } else if (this.getCoordType() === 'bd09mc') {
                    for (var i = 0; i < data[j].geo.length; i++) {
                        tmp.push([(data[j].geo[i][0] - nwMc.x) / zoomUnit, (nwMc.y - data[j].geo[i][1]) / zoomUnit, parseFloat(data[j].geo[i][2])]);
                    }
                }
                data[j].pgeo = tmp;
            }
        }
        console.timeEnd('parseData');
    },
    data_changed: function () {
        var data = this.getData();
        if (data) {
            if (this.getDataType() === "polyline" && this.getAnimation()) {
                for (var i = 0; i < data.length; i++) {
                    data[i].index = parseInt(Math.random() * data[i].geo.length, 10);
                }
            }

            if (this.getDataType() === "polyline" && this.getAnimation() === 'time') {
                this._minTime = data[0] && data[0].geo[0][2];
                this._maxTime = this._minTime;
                for (var i = 0; i < data.length; i++) {
                    var geo = data[i].geo;
                    for (var j = 0; j < geo.length; j++) {
                        var time = geo[j][2];
                        if (time < this._minTime) {
                            this._minTime = time;
                        }
                        if (time > this._maxTime) {
                            this._maxTime = time;
                        }
                    }
                }
                //this._minTime = 1439568000;
                //this._maxTime = 1439827200;
            }

            if (data.length > 0) {
                this._min = data[0].count;
                this._max = this._max;
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].count === undefined || data[i].count === null) {
                    data[i].count = 1;
                }
                this._max = Math.max(this._max, data[i].count);
                this._min = Math.min(this._min, data[i].count);
            }
            this.draw();
        }
    },
    getDataRange: function () {
        return {
            minTime: this._minTime,
            maxTime: this._maxTime,
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
