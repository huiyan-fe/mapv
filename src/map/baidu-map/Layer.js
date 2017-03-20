/**
 * @author kyle / http://nikai.us/
 */

import BaseLayer from "../BaseLayer";
import CanvasLayer from "./CanvasLayer";
import clear from "../../canvas/clear";
import DataSet from "../../data/DataSet";
import TWEEN from "../../utils/Tween";

class Layer extends BaseLayer{

    constructor(map, dataSet, options) {

        super(map, dataSet, options);

        var self = this;
        var data = null;
        options = options || {};

        self.init(options);
        self.argCheck(options);
        self.transferToMercator();
        this.dataSet.on('change', function() {
            self.transferToMercator();
        });

        var canvasLayer = this.canvasLayer = new CanvasLayer({
            map: map,
            context: this.context,
            paneName: options.paneName,
            mixBlendMode: options.mixBlendMode,
            enableMassClear: options.enableMassClear,
            zIndex: options.zIndex,
            update: function() {
                self._canvasUpdate();
            }
        });

        dataSet.on('change', function() {
            canvasLayer.draw();
        });

        this.clickEvent = this.clickEvent.bind(this);
        this.mousemoveEvent = this.mousemoveEvent.bind(this);
        this.bindEvent();

    }

    clickEvent(e) {
        var pixel = e.pixel;
        super.clickEvent(pixel, e);
    }

    mousemoveEvent(e) {
        var pixel = e.pixel;
        super.mousemoveEvent(pixel, e);
    }

    bindEvent(e) {
        var map = this.map;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.setDefaultCursor("default");
                map.addEventListener('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.addEventListener('mousemove', this.mousemoveEvent);
            }
        }
    }

    unbindEvent(e) {
        var map = this.map;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.removeEventListener('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.removeEventListener('mousemove', this.mousemoveEvent);
            }
        }
    }

    // 经纬度左边转换为墨卡托坐标
    transferToMercator() {
        var projection = this.map.getMapType().getProjection();

        if (this.options.coordType !== 'bd09mc') {
            var data = this.dataSet.get();
            data = this.dataSet.transferCoordinate(data, function(coordinates) {
                var pixel = projection.lngLatToPoint({
                    lng: coordinates[0],
                    lat: coordinates[1]
                });
                return [pixel.x, pixel.y];
            }, 'coordinates', 'coordinates_mercator');
            this.dataSet._set(data);
        }
    }

    getContext() {
        return this.canvasLayer.canvas.getContext(this.context);
    }

    _canvasUpdate(time) {
        if (!this.canvasLayer) {
            return;
        }

        var self = this;

        var animationOptions = self.options.animation;

        var map = this.canvasLayer._map;

        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var projection = map.getMapType().getProjection();

        var mcCenter = projection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

        var context = this.getContext();

        if (self.isEnabledTime()) {
            if (time === undefined) {
                clear(context);
                return;
            }
            if (this.context == '2d') {
                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.fillStyle = 'rgba(0, 0, 0, .1)';
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.restore();
            }
        } else {
            clear(context);
        }

        if (this.context == '2d') {
            for (var key in self.options) {
                context[key] = self.options[key];
            }
        } else {
            context.clear(context.COLOR_BUFFER_BIT);
        }

        if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
            return;
        }

        var scale = 1;
        if (this.context != '2d') {
            scale = this.canvasLayer.devicePixelRatio;
        }

        var dataGetOptions = {
            fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
            transferCoordinate: function(coordinate) {
                var x = (coordinate[0] - nwMc.x) / zoomUnit * scale;
                var y = (nwMc.y - coordinate[1]) / zoomUnit * scale;
                return [x, y];
            }
        }

        if (time !== undefined) {
            dataGetOptions.filter = function(item) {
                var trails = animationOptions.trails || 10;
                if (time && item.time > (time - trails) && item.time < time) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        // get data from data set
        var data = self.dataSet.get(dataGetOptions);

        this.processData(data);

        var nwPixel = map.pointToPixel(new BMap.Point(0, 0));

        if (self.options.unit == 'm') {
            if (self.options.size) {
                self.options._size = self.options.size / zoomUnit;
            }
            if (self.options.width) {
                self.options._width = self.options.width / zoomUnit;
            }
            if (self.options.height) {
                self.options._height = self.options.height / zoomUnit;
            }
        } else {
            self.options._size = self.options.size;
            self.options._height = self.options.height;
            self.options._width = self.options.width;
        }

        this.drawContext(context, data, self.options, nwPixel);

        //console.timeEnd('draw');

        //console.timeEnd('update')
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

    addAnimatorEvent() {
        this.map.addEventListener('movestart', this.animatorMovestartEvent.bind(this));
        this.map.addEventListener('moveend', this.animatorMoveendEvent.bind(this));
    }

    show() {
        this.map.addOverlay(this.canvasLayer);
    }

    hide() {
        this.map.removeOverlay(this.canvasLayer);
    }

    draw() {
        self.canvasLayer.draw();
    }
}

export default Layer;
