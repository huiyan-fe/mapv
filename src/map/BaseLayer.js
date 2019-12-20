/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "../data/DataSet";
import TWEEN from "../utils/Tween";
import Intensity from "../utils/data-range/Intensity";
import Category from "../utils/data-range/Category";
import Choropleth from "../utils/data-range/Choropleth";
import drawHeatmap from "../canvas/draw/heatmap";
import drawArrow from "../canvas/draw/arrow";
import drawClip from "../canvas/draw/clip";
import drawSimple from "../canvas/draw/simple";
import webglDrawSimple from "../webgl/draw/simple";
import drawGrid from "../canvas/draw/grid";
import drawCluster from "../canvas/draw/cluster";
import drawHoneycomb from "../canvas/draw/honeycomb";
import drawText from "../canvas/draw/text";
import drawIcon from "../canvas/draw/icon";
import pathSimple from "../canvas/path/simple";
import clear from "../canvas/clear";
import Supercluster from '../utils/supercluster';

if (typeof window !== 'undefined') {
    requestAnimationFrame(animate);
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}



class BaseLayer {
    constructor(map, dataSet, options) {
        if (!(dataSet instanceof DataSet)) {
            dataSet = new DataSet(dataSet);
        }

        this.dataSet = dataSet;
        this.map = map;

        if (options.draw === 'cluster' && !this.supercluster) {
            this.supercluster = new Supercluster({maxZoom: options.maxZoom || 19, radius: options.clusterRadius || 100});
            this.supercluster.load(dataSet.get());
            this.clusterDataSet = new DataSet();
        }
    }

    getDefaultContextConfig() {
        return {
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
    }

    initDataRange(options) {
        var self = this;
        self.intensity = new Intensity({
            maxSize: self.options.maxSize,
            minSize: self.options.minSize,
            gradient: self.options.gradient,
            max: self.options.max || this.dataSet.getMax('count')
        });
        self.category = new Category(self.options.splitList);
        self.choropleth = new Choropleth(self.options.splitList);
        if (self.options.splitList === undefined) {
            self.category.generateByDataSet(this.dataSet, self.options.color);
        }
        if (self.options.splitList === undefined) {
            var min = self.options.min || this.dataSet.getMin('count');
            var max = self.options.max || this.dataSet.getMax('count');
            self.choropleth.generateByMinMax(min, max);
        }
    }

    getLegend(options) {
        var draw = this.options.draw;
        var legend = null;
        var self = this;
        if (self.options.draw == 'intensity' || self.options.draw == 'heatmap') {
            return this.intensity.getLegend(options);
        } else if (self.options.draw == 'category') {
            return this.category.getLegend(options);
        }
    }

    processData(data) {
        var self = this;
        var draw = self.options.draw;
        if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth' || draw == 'simple') {

            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                if (self.options.draw == 'bubble') {
                    data[i]._size = self.intensity.getSize(item.count);
                } else {
                    data[i]._size = undefined;
                }

                var styleType = '_fillStyle';

                if (data[i].geometry.type === 'LineString' || self.options.styleType === 'stroke') {
                    styleType = '_strokeStyle';
                }

                if (self.options.draw == 'intensity') {
                    data[i][styleType] = self.intensity.getColor(item.count);
                } else if (self.options.draw == 'category') {
                    data[i][styleType] = self.category.get(item.count);
                } else if (self.options.draw == 'choropleth') {
                    data[i][styleType] = self.choropleth.get(item.count);
                }
            }

        }
    }

    isEnabledTime() {

        var animationOptions = this.options.animation;

        var flag = (
            animationOptions &&
            !(animationOptions.enabled === false)
        );

        return flag;
    }

    argCheck(options) {
        if (options.draw == 'heatmap') {
            if (options.strokeStyle) {
                console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
            }
        }
    }

    drawContext(context, dataSet, options, nwPixel) {
        var self = this;
        switch (self.options.draw) {
            case 'heatmap':
                drawHeatmap.draw(context, dataSet, self.options);
                break;
            case 'grid':
            case 'cluster':
            case 'honeycomb':
                self.options.offset = {
                    x: nwPixel.x,
                    y: nwPixel.y
                };
                if (self.options.draw === 'grid') {
                    drawGrid.draw(context, dataSet, self.options);
                } else if (self.options.draw === 'cluster') {
                    drawCluster.draw(context, dataSet, self.options);
                } else {
                    drawHoneycomb.draw(context, dataSet, self.options);
                }
                break;
            case 'text':
                drawText.draw(context, dataSet, self.options);
                break;
            case 'icon':
                drawIcon.draw(context, dataSet, self.options);
                break;
            case 'clip':
                drawClip.draw(context, dataSet, self.options);
                break;
            default:
                if (self.options.context == "webgl") {
                    webglDrawSimple.draw(self.canvasLayer.canvas.getContext('webgl'), dataSet, self.options);
                } else {
                    drawSimple.draw(context, dataSet, self.options);
                }
        }

        if (self.options.arrow && self.options.arrow.show !== false) {
            drawArrow.draw(context, dataSet, self.options);
        }
    }

    isPointInPath(context, pixel) {
        var context = this.canvasLayer.canvas.getContext(this.context);
        var data;
        if (this.options.draw === 'cluster') {
            data = this.clusterDataSet.get();
        } else {
            data = this.dataSet.get();
        }
        for (var i = 0; i < data.length; i++) {
            context.beginPath();
            let options = this.options;
            var x = pixel.x * this.canvasLayer.devicePixelRatio;
            var y = pixel.y * this.canvasLayer.devicePixelRatio;

            options.multiPolygonDraw = function() {
                if (context.isPointInPath(x, y)) {
                    return data[i];
                }
            }

            pathSimple.draw(context, data[i], options);

            var geoType = data[i].geometry && data[i].geometry.type;
            if (geoType.indexOf('LineString') > -1) {
                if (context.isPointInStroke && context.isPointInStroke(x, y)) {
                    return data[i];
                }
            } else {

                if (context.isPointInPath(x, y)) {
                    return data[i];
                }
            }
        }
    }

    clickEvent(pixel, e) {
        if (!this.options.methods) {
            return;
        }
        var dataItem = this.isPointInPath(this.getContext(), pixel);

        if (dataItem) {
            this.options.methods.click(dataItem, e);
        } else {
            this.options.methods.click(null, e);
        }

    }

    mousemoveEvent(pixel, e) {
        if (!this.options.methods) {
            return;
        }
        var dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            this.options.methods.mousemove(dataItem, e);
        } else {
            this.options.methods.mousemove(null, e);
        }
    }
    tapEvent(pixel, e) {
        if (!this.options.methods) {
            return;
        }
        var dataItem = this.isPointInPath(this.getContext(), pixel);
        if (dataItem) {
            this.options.methods.tap(dataItem, e);
        } else {
            this.options.methods.tap(null, e);
        }
    }

    /**
     * obj.options
     */
    update(obj, isDraw) {
        var self = this;
        var _options = obj.options;
        var options = self.options;
        for (var i in _options) {
            options[i] = _options[i];
        }
        self.init(options);
        if (isDraw !== false) {
            self.draw();
        }
    }

    setOptions(options) {
        var self = this;
        self.dataSet.reset();
        // console.log('xxx1')
        self.init(options);
        // console.log('xxx')
        self.draw();
    }

    set(obj) {
        var self = this;
        var ctx = this.getContext();
        var conf = this.getDefaultContextConfig();
        for (var i in conf) {
            ctx[i] = conf[i];
        }
        self.init(obj.options);
        self.draw();
    }

    destroy() {
        this.unbindEvent();
        this.hide();
    }

    initAnimator() {
        var self = this;
        var animationOptions = self.options.animation;

        if (self.options.draw == 'time' || self.isEnabledTime()) {

            if (!animationOptions.stepsRange) {
                animationOptions.stepsRange = {
                    start: this.dataSet.getMin('time') || 0,
                    end: this.dataSet.getMax('time') || 0
                }
            }

            this.steps = { step: animationOptions.stepsRange.start };
            self.animator = new TWEEN.Tween(this.steps)
                .onUpdate(function () {
                    self._canvasUpdate(this.step);
                })
                .repeat(Infinity);

            this.addAnimatorEvent();

            var duration = animationOptions.duration * 1000 || 5000;

            self.animator.to({ step: animationOptions.stepsRange.end }, duration);
            self.animator.start();

        } else {
            self.animator && self.animator.stop();
        }
    }

    addAnimatorEvent() {}

    animatorMovestartEvent() {
        var animationOptions = this.options.animation;
        if (this.isEnabledTime() && this.animator) {
            this.steps.step = animationOptions.stepsRange.start;
            this.animator.stop();
        }
    }

    animatorMoveendEvent() {
        if (this.isEnabledTime() && this.animator) {
            this.animator.start();
        }
    }
}

export default BaseLayer;
