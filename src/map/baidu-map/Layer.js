/**
 * @author kyle / http://nikai.us/
 */

import CanvasLayer from "./CanvasLayer";
import clear from "../../canvas/clear";
import drawHeatmap from "../../canvas/draw/heatmap";
import drawSimple from "../../canvas/draw/simple";
import drawGrid from "../../canvas/draw/grid";
import drawHoneycomb from "../../canvas/draw/honeycomb";
import drawText from "../../canvas/draw/text";
import drawIcon from "../../canvas/draw/icon";
import DataSet from "../../data/DataSet";
import Intensity from "../../utils/data-range/Intensity";
import Category from "../../utils/data-range/Category";
import Choropleth from "../../utils/data-range/Choropleth";
import Animator from "../../utils/animation/Animator";
import pathSimple from "../../canvas/path/simple";

function Layer(map, dataSet, options) {
    if (!(dataSet instanceof DataSet)) {
        dataSet = new DataSet(dataSet);
    }

    var self = this;
    var data = null;
    options = options || {};

    self.init(options);
    self.argCheck(options);

    self.map = map;

    var canvasLayer = this.canvasLayer = new CanvasLayer({
        map: map,
        paneName: options.paneName,
        mixBlendMode: options.mixBlendMode,
        zIndex: options.zIndex,
        update: update
    });

    dataSet.on('change', function() {
        canvasLayer.draw();
    });

    var animationOptions = self.options.animation;
    var isEnabledTime = (
        animationOptions 
        && !(animationOptions.enabled === false) 
    );

    if (self.options.draw == 'time' || isEnabledTime) {
        var animator = new Animator(function(time) {
            update.call(canvasLayer, time);
        }, {
            steps: animationOptions.steps || 100,
            stepsRange: animationOptions.stepsRange || 100,
            animationDuration: animationOptions.duration || 10
        });
        animator.start();

        map.addEventListener('movestart', function() {
            animator.pause();
        });

        map.addEventListener('moveend', function() {
            animator.start();
        });
    }

    if (self.options.methods) {
        if (self.options.methods.click) {
            map.setDefaultCursor("default");
            map.addEventListener('click', function(e) {
                var pixel = e.pixel;
                var context = canvasLayer.canvas.getContext('2d');
                var data = dataSet.get();
                for (var i = 0; i < data.length; i++) {
                    context.beginPath();
                    pathSimple.draw(context, data[i], self.options);
                    if (context.isPointInPath(pixel.x * canvasLayer.devicePixelRatio, pixel.y * canvasLayer.devicePixelRatio)) {
                        self.options.methods.click(data[i]);
                    }
                }
            });
        }
    }

    var zoomUnit = Math.pow(2, 18 - map.getZoom());
    var projection = map.getMapType().getProjection();

    var mcCenter = projection.lngLatToPoint(map.getCenter());
    var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

    function update(time) {
        //console.time('update')
        var context = this.canvas.getContext("2d");

        if (isEnabledTime) {
            if (time === undefined) {
                return;
            }
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = 'rgba(0, 0, 0, .1)';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        } else {
            clear(context);
        }

        for (var key in self.options) {
            context[key] = self.options[key];
        }

        var dataGetOptions = {
            transferCoordinate: function(coordinate) {

                if (self.options.coordType == 'bd09mc') {
                    var x = (coordinate[0] - nwMc.x) / zoomUnit;
                    var y = (nwMc.y - coordinate[1]) / zoomUnit;
                    return [x, y];
                }

                var pixel = map.pointToPixel(new BMap.Point(coordinate[0], coordinate[1]));
                return [pixel.x, pixel.y];
            }
        }


        if (time !== undefined) {
            dataGetOptions.filter = function(item) {
                var trails = animationOptions.trails || 5;
                if (time && item.time > (time - trails) && item.time < time) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        // get data from data set
        data = dataSet.get(dataGetOptions);

        // deal with data based on draw

        // TODO: 部分情况下可以不用循环，比如heatmap
        //console.time('setstyle');

        var draw = self.options.draw;
        if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth') {

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (self.options.draw == 'bubble') {
                    data[i].size = self.intensity.getSize(item.count);
                } else if (self.options.draw == 'intensity') {
                    if (data[i].geometry.type === 'LineString') {
                        data[i].strokeStyle = self.intensity.getColor(item.count);
                    } else {
                        data[i].fillStyle = self.intensity.getColor(item.count);
                    }
                } else if (self.options.draw == 'category') {
                    data[i].fillStyle = self.category.get(item.count);
                } else if (self.options.draw == 'choropleth') {
                    data[i].fillStyle = self.choropleth.get(item.count);
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
                context.fillStyle = options.fillStyle || 'rgba(0, 0, 0, 0.5)';
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                drawSimple.draw(context, data, self.options);
                context.beginPath();
                pathSimple.drawDataSet(context, new DataSet(data), self.options); 
                context.clip();
                clear(context);
                context.restore();
                break;
            default:
                drawSimple.draw(context, data, self.options);
        }
        //console.timeEnd('draw');

        //console.timeEnd('update')
        options.updateCallback && options.updateCallback(time);
    };

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

    self.intensity = new Intensity({
        maxSize: self.options.maxSize,
        gradient: self.options.gradient,
        max: self.options.max
    });

    self.category = new Category(self.options.splitList);
    self.choropleth = new Choropleth(self.options.splitList);
}

Layer.prototype.show = function() {
    this.map.addOverlay(this.canvasLayer);
}

Layer.prototype.hide = function() {
    this.map.removeOverlay(this.canvasLayer);
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
    var ctx = self.canvasLayer.canvas.getContext("2d");
    for (var i in conf) {
        ctx[i] = conf[i];
    }
    self.init(obj.options);
    self.canvasLayer.draw();
}

export default Layer;
