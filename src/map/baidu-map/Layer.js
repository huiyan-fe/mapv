/**
 * @author kyle / http://nikai.us/
 */

import CanvasLayer from "./CanvasLayer";
import clear from "../../canvas/clear";
import drawHeatmap from "../../canvas/draw/heatmap";
import drawSimple from "../../canvas/draw/simple";
import webglDrawSimple from "../../webgl/draw/simple";
import drawGrid from "../../canvas/draw/grid";
import drawHoneycomb from "../../canvas/draw/honeycomb";
import drawText from "../../canvas/draw/text";
import drawIcon from "../../canvas/draw/icon";
import DataSet from "../../data/DataSet";
import Intensity from "../../utils/data-range/Intensity";
import Category from "../../utils/data-range/Category";
import Choropleth from "../../utils/data-range/Choropleth";
import Animator from "../../utils/animation/Animator";
import TWEEN from "../../utils/animation/Tween";
import pathSimple from "../../canvas/path/simple";

if (typeof window !== 'undefined') {
    requestAnimationFrame(animate);
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

function Layer(map, dataSet, options) {
    if (!(dataSet instanceof DataSet)) {
        dataSet = new DataSet(dataSet);
    }

    this.dataSet = dataSet;

    var self = this;
    var data = null;
    options = options || {};

    self.map = map;

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

Layer.prototype.clickEvent = function(e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        pathSimple.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.click(data[i], e);
            return;
        }
    }

    this.options.methods.click(null, e);
}

Layer.prototype.mousemoveEvent = function(e) {
    var pixel = e.pixel;
    var context = this.canvasLayer.canvas.getContext(this.context);
    var data = this.dataSet.get();
    for (var i = 0; i < data.length; i++) {
        context.beginPath();
        pathSimple.draw(context, data[i], this.options);
        if (context.isPointInPath(pixel.x * this.canvasLayer.devicePixelRatio, pixel.y * this.canvasLayer.devicePixelRatio)) {
            this.options.methods.mousemove(data[i], e);
            return;
        }
    }
    this.options.methods.mousemove(null, e);
}

Layer.prototype.bindEvent = function(e) {
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

Layer.prototype.unbindEvent = function(e) {
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
Layer.prototype.transferToMercator = function() {
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

Layer.prototype._canvasUpdate = function(time) {
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

    //console.time('update')
    var context = this.canvasLayer.canvas.getContext(self.context);

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

    var scale = 1;
    if (this.context != '2d') {
        scale = this.canvasLayer.devicePixelRatio;
    }

    var dataGetOptions = {
        fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
        transferCoordinate: function(coordinate) {

            // if (self.options.coordType == 'bd09mc') {
                var x = (coordinate[0] - nwMc.x) / zoomUnit * scale;
                var y = (nwMc.y - coordinate[1]) / zoomUnit * scale;
                return [x, y];
            // }

            // var pixel = map.pointToPixel(new BMap.Point(coordinate[0], coordinate[1]));
            // return [pixel.x, pixel.y];
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

    // deal with data based on draw

    // TODO: 部分情况下可以不用循环，比如heatmap
    //console.time('setstyle');

    var draw = self.options.draw;
    if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth' || draw == 'simple') {

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (self.options.draw == 'bubble') {
                data[i]._size = self.intensity.getSize(item.count);
            } else {
                data[i]._size = undefined;
            } 

            if (self.options.draw == 'intensity') {
                if (data[i].geometry.type === 'LineString') {
                    data[i].strokeStyle = item.strokeStyle || self.intensity.getColor(item.count);
                } else {
                    data[i].fillStyle = item.fillStyle || self.intensity.getColor(item.count);
                }
            } else if (self.options.draw == 'category') {
                data[i].fillStyle = item.fillStyle || self.category.get(item.count);
            } else if (self.options.draw == 'choropleth') {
                data[i].fillStyle = item.fillStyle || self.choropleth.get(item.count);
            }
        }

    }

    //console.timeEnd('setstyle');

    if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
        return;
    }

    //console.time('draw');
    // draw

    if (self.options.unit == 'm' && self.options.size) {
        self.options._size = self.options.size / zoomUnit;
    } else {
        self.options._size = self.options.size;
    }

    switch (self.options.draw) {
        case 'heatmap':
            drawHeatmap.draw(context, new DataSet(data), self.options);
            break;
        case 'grid':
        case 'honeycomb':
            /*
            if (data.length <= 0) {
                break;
            }

            var minx = data[0].geometry.coordinates[0];
            var maxy = data[0].geometry.coordinates[1];
            for (var i = 1; i < data.length; i++) {
                minx = Math.min(data[i].geometry.coordinates[0], minx);
                maxy = Math.max(data[i].geometry.coordinates[1], maxy);
            }
            var nwPixel = map.pointToPixel(new BMap.Point(minx, maxy));
            */
            var nwPixel = map.pointToPixel(new BMap.Point(0, 0));
            self.options.offset = {
                x: nwPixel.x,
                y: nwPixel.y
            };
            if (self.options.draw == 'grid') {
                drawGrid.draw(context, new DataSet(data), self.options);
            } else {
                drawHoneycomb.draw(context, new DataSet(data), self.options);
            }
            break;
        case 'text':
            drawText.draw(context, new DataSet(data), self.options);
            break;
        case 'icon':
            drawIcon.draw(context, data, self.options);
            break;
        case 'clip':
            context.save();
            context.fillStyle = self.options.fillStyle || 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            drawSimple.draw(context, data, self.options);
            context.beginPath();
            pathSimple.drawDataSet(context, new DataSet(data), self.options); 
            context.clip();
            clear(context);
            context.restore();
            break;
        default:
            if (self.options.context == "webgl") {
                webglDrawSimple.draw(self.canvasLayer.canvas.getContext('webgl'), data, self.options);
            } else {
                drawSimple.draw(context, data, self.options);
            }
    }
    //console.timeEnd('draw');

    //console.timeEnd('update')
    self.options.updateCallback && self.options.updateCallback(time);
}

Layer.prototype.isEnabledTime = function() {

    var animationOptions = this.options.animation;

    var flag = (
        animationOptions 
        && !(animationOptions.enabled === false) 
    );

    return flag;
}

Layer.prototype.argCheck = function(options) {
    if (options.draw == 'heatmap') {
        if (options.strokeStyle) {
            console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
        }
    }
}

Layer.prototype.init = function(options) {
    var self = this;

    self.options = options;

    this.context = self.options.context || '2d';

    self.intensity = new Intensity({
        maxSize: self.options.maxSize,
        minSize: self.options.minSize,
        gradient: self.options.gradient,
        max: self.options.max || this.dataSet.getMax('count')
    });

    self.category = new Category(self.options.splitList);
    self.choropleth = new Choropleth(self.options.splitList);
    if (self.options.splitList === undefined) {
        self.category.generateByDataSet(this.dataSet);
    }

    if (self.options.zIndex) {
        this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
    }

    if (self.options.splitList === undefined) {
        var min = self.options.min || this.dataSet.getMin('count');
        var max = self.options.max || this.dataSet.getMax('count');
        self.choropleth.generateByMinMax(min, max);
    }

    var animationOptions = self.options.animation;

    if (self.options.draw == 'time' || self.isEnabledTime()) {
        //if (!self.animator) {
            if (!animationOptions.stepsRange) {
                animationOptions.stepsRange = {
                    start: this.dataSet.getMin('time') || 0,
                    end: this.dataSet.getMax('time') || 0
                }
            }

            var steps = { step: animationOptions.stepsRange.start };
            self.animator = new TWEEN.Tween(steps)
                .onUpdate(function() {
                    self._canvasUpdate(this.step);
                })
                .repeat(Infinity);

            self.map.addEventListener('movestart', function() {
                if (self.isEnabledTime() && self.animator) {
                    self.animator.stop();
                }
            });

            self.map.addEventListener('moveend', function() {
                if (self.isEnabledTime() && self.animator) {
                    self.animator.start();
                }
            });
        //}

        var duration = animationOptions.duration * 1000 || 5000;

        self.animator.to({ step: animationOptions.stepsRange.end }, duration);
        self.animator.start();

    } else {
        self.animator && self.animator.stop();
    }
}

Layer.prototype.show = function() {
    this.map.addOverlay(this.canvasLayer);
}

Layer.prototype.hide = function() {
    this.map.removeOverlay(this.canvasLayer);
}

Layer.prototype.destroy = function() {
    this.unbindEvent();
    this.hide();
}

/**
 * obj.options
 */
Layer.prototype.update = function(obj) {
    var self = this;
    var _options = obj.options;
    var options = self.options;
    for (var i in _options) {
        options[i] = _options[i];
    }
    self.init(options);
    self.canvasLayer.draw();
}


Layer.prototype.setOptions = function(options) {
    var self = this;
    self.init(options);
    self.canvasLayer.draw();
}

Layer.prototype.set = function(obj) {
    var conf = {
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        strokeStyle: '#000000',
        fillStyle: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowColor: 'rgba(0, 0, 0, 0)',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        lineDashOffset: 0,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
    }
    var self = this;
    var ctx = self.canvasLayer.canvas.getContext(self.context);
    for (var i in conf) {
        ctx[i] = conf[i];
    }
    self.init(obj.options);
    self.canvasLayer.draw();
}

Layer.prototype.getLegend = function(options) {
    var draw = this.options.draw;
    var legend = null;
    if (self.options.draw == 'intensity' || self.options.draw == 'heatmap') {
        return this.intensity.getLegend(options);
    } 
}

export default Layer;
