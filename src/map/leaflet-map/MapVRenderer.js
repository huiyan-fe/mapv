// https://github.com/SuperMap/iClient-JavaScript
import BaseLayer from "../BaseLayer";
/**
 * @class MapVRenderer
 * @classdesc 地图渲染类。
 * @category Visualization MapV
 * @private
 * @extends mapv.BaseLayer
 * @param {L.Map} map - 待渲染的地图。
 * @param {L.Layer} layer - 待渲染的图层。
 * @param {DataSet} dataSet - 待渲染的数据集。
 * @param {Object} options - 渲染的参数。
 */
export class MapVRenderer extends BaseLayer {

    constructor(map, layer, dataSet, options) {
        super(map, dataSet, options);
        if (!BaseLayer) {
            return;
        }


        var self = this;
        options = options || {};

        self.init(options);
        self.argCheck(options);
        this.canvasLayer = layer;
        this.clickEvent = this.clickEvent.bind(this);
        this.mousemoveEvent = this.mousemoveEvent.bind(this);
        this._moveStartEvent = this.moveStartEvent.bind(this);
        this._moveEndEvent = this.moveEndEvent.bind(this);
        this._zoomStartEvent = this.zoomStartEvent.bind(this);
        this.bindEvent();
    }

    /**
     * @function MapVRenderer.prototype.clickEvent
     * @description 点击事件。
     * @param {Object} e - 触发对象。
     */
    clickEvent(e) {
        var offset = this.map.containerPointToLayerPoint([0, 0]);
        var devicePixelRatio = this.devicePixelRatio = this.canvasLayer.devicePixelRatio = window.devicePixelRatio;
        var pixel = e.layerPoint;
        super.clickEvent(L.point((pixel.x - offset.x) / devicePixelRatio, (pixel.y - offset.y) / devicePixelRatio), e);
    }

    /**
     * @function MapVRenderer.prototype.mousemoveEvent
     * @description 鼠标移动事件。
     * @param {Object} e - 触发对象。
     */
    mousemoveEvent(e) {
        var pixel = e.layerPoint;
        super.mousemoveEvent(pixel, e);
    }

    /**
     * @function MapVRenderer.prototype.bindEvent
     * @description 绑定鼠标移动和鼠标点击事件。
     * @param {Object} e - 触发对象。
     */
    bindEvent() {
        var map = this.map;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.on('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.on('mousemove', this.mousemoveEvent);
            }
        }
        this.map.on('movestart', this._moveStartEvent);
        this.map.on('moveend', this._moveEndEvent);
        this.map.on('zoomstart', this._zoomStartEvent);
    }
    /**
     * @function MapVRenderer.prototype.destroy
     * @description 释放资源。
     */
    destroy() {
        this.unbindEvent();
        this.clearData();
        this.animator && this.animator.stop();
        this.animator = null;
        this.canvasLayer = null;
    }
    /**
     * @function MapVRenderer.prototype.unbindEvent
     * @description 解绑鼠标移动和鼠标滑动触发的事件。
     * @param {Object} e - 触发对象。
     */
    unbindEvent() {
        var map = this.map;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.off('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.off('mousemove', this.mousemoveEvent);
            }
        }
        this.map.off('movestart', this._moveStartEvent);
        this.map.off('moveend', this._moveEndEvent);
        this.map.off('zoomstart', this._zoomStartEvent);
    }

    /**
     * @function MapVRenderer.prototype.getContext
     * @description 获取信息。
     */
    getContext() {
        return this.canvasLayer.getCanvas().getContext(this.context);
    }

    /**
     * @function MapVRenderer.prototype.addData
     * @description 添加数据。
     * @param {Object} data - 待添加的数据。
     * @param  {Object} options - 待添加的数据信息。
     */
    addData(data, options) {
        var _data = data;
        if (data && data.get) {
            _data = data.get();
        }
        this.dataSet.add(_data);
        this.update({
            options: options
        });
    }

    /**
     * @function MapVRenderer.prototype.update
     * @description 更新图层。
     * @param {Object} opt - 待更新的数据。
     * @param {Object} opt.data - mapv数据集。
     * @param {Object} opt.options - mapv绘制参数。
     */
    update(opt) {
        var update = opt || {};
        var _data = update.data;
        if (_data && _data.get) {
            _data = _data.get();
        }
        if (_data != undefined) {
            this.dataSet.set(_data);
        }
        super.update({
            options: update.options
        });
    }

    /**
     * @function MapVRenderer.prototype.getData
     * @description 获取数据
     */
    getData() {
        return this.dataSet;
    }

    /**
     * @function MapVRenderer.prototype.removeData
     * @description 删除符合过滤条件的数据。
     * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
     */
    removeData(filter) {
        if (!this.dataSet) {
            return;
        }
        var newData = this.dataSet.get({
            filter: function (data) {
                return (filter != null && typeof filter === "function") ? !filter(data) : true;
            }
        });
        this.dataSet.set(newData);
        this.update({
            options: null
        });
    }

    /**
     * @function MapVRenderer.prototype.clearData
     * @description 清除数据
     */
    clearData() {
        this.dataSet && this.dataSet.clear();
        this.update({
            options: null
        });
    }

    _canvasUpdate(time) {
        if (!this.canvasLayer) {
            return;
        }

        var self = this;

        var animationOptions = self.options.animation;

        var context = this.getContext();
        var map = this.map;
        if (self.isEnabledTime()) {
            if (time === undefined) {
                this.clear(context);
                return;
            }
            if (this.context === '2d') {
                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.fillStyle = 'rgba(0, 0, 0, .1)';
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.restore();
            }
        } else {
            this.clear(context);
        }

        if (this.context === '2d') {
            for (var key in self.options) {
                context[key] = self.options[key];
            }
        } else {
            context.clear(context.COLOR_BUFFER_BIT);
        }

        if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
            return;
        }

        var bounds = map.getBounds();
        //获取当前像素下的地理范围
        var dw = bounds.getEast() - bounds.getWest();
        var dh = bounds.getNorth() - bounds.getSouth();
        var mapCanvas = map.getSize();

        var resolutionX = dw / mapCanvas.x,
            resolutionY = dh / mapCanvas.y;
        //var centerPx = map.latLngToLayerPoint(map.getCenter());

        //获取屏幕左上角的地理坐标坐标
        //左上角屏幕坐标为0,0
        var topLeft = this.canvasLayer.getTopLeft();

        var topLeftPX = map.latLngToContainerPoint(topLeft);
        // 获取精确的像素坐标. https://github.com/SuperMap/iClient-JavaScript/blob/eacc26952b8915bba0122db751d766056c5fb24d/src/leaflet/core/Base.js
        // var topLeftPX = map.latLngToAccurateContainerPoint(topLeft);
        // var lopLeft = map.containerPointToLatLng([0, 0]);
        var dataGetOptions = {
            transferCoordinate: function (coordinate) {
                var offset;
                if (self.context === '2d') {
                    offset = map.latLngToContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                    // offset = map.latLngToAccurateContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                } else {
                    offset = {
                        'x': (coordinate[0] - topLeft.lng) / resolutionX,
                        'y': (topLeft.lat - coordinate[1]) / resolutionY
                    };
                }
                var pixel = {
                    x: offset.x - topLeftPX.x,
                    y: offset.y - topLeftPX.y
                };
                return [pixel.x, pixel.y];
            }
        };

        if (time !== undefined) {
            dataGetOptions.filter = function (item) {
                var trails = animationOptions.trails || 10;
                return (time && item.time > (time - trails) && item.time < time);
            }
        }

        var data = self.dataSet.get(dataGetOptions);

        this.processData(data);

        self.options._size = self.options.size;

        var worldPoint = map.latLngToContainerPoint(L.latLng(0, 0));
        var pixel = {
            x: worldPoint.x - topLeftPX.x,
            y: worldPoint.y - topLeftPX.y
        };
        this.drawContext(context, data, self.options, pixel);

        self.options.updateCallback && self.options.updateCallback(time);
    }

    init(options) {

        var self = this;

        self.options = options;

        this.initDataRange(options);

        this.context = self.options.context || '2d';

        if (self.options.zIndex) {
            this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
        }

        this.initAnimator();
    }

    addAnimatorEvent() { }

    /**
     * @function MapVRenderer.prototype.moveStartEvent
     * @description 开始移动事件。
     */
    moveStartEvent() {
        var animationOptions = this.options.animation;
        if (this.isEnabledTime() && this.animator) {
            this.steps.step = animationOptions.stepsRange.start;
            this._hide();
        }
    }

    /**
     * @function MapVRenderer.prototype.moveEndEvent
     * @description 结束移动事件。
     */
    moveEndEvent() {
        this.canvasLayer.draw();
        this._show();
    }

    /**
     * @function MapVRenderer.prototype.zoomStartEvent
     * @description 隐藏渲染样式。
     */
    zoomStartEvent() {
        this._hide();
    }

    /**
     * @function MapVRenderer.prototype.clear
     * @description 清除信息。
     * @param {string} context - 指定要清除的信息。
     */
    clear(context) {
        context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    _hide() {
        this.canvasLayer.canvas.style.display = 'none';
    }

    _show() {
        this.canvasLayer.canvas.style.display = 'block';
    }

    /**
     * @function MapVRenderer.prototype.draw
     * @description 绘制渲染
     */
    draw() {
        this.canvasLayer.draw();
    }
}