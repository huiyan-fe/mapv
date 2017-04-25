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

        var canvasLayerOptions = {
            map: map,
            animate: false,
            updateHandler: function() {
                self._canvasUpdate();
            },
            resolutionScale: resolutionScale
        };

        var canvasLayer = this.canvasLayer = new CanvasLayer(canvasLayerOptions);

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
                map.addListener('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.addListener('mousemove', this.mousemoveEvent);
            }
        }
    }

    unbindEvent(e) {
        var map = this.map;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.removeListener('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.removeListener('mousemove', this.mousemoveEvent);
            }
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

        var map = this.map;
        var mapProjection = map.getProjection();
        var scale = Math.pow(2, map.zoom) * resolutionScale;
        var offset = mapProjection.fromLatLngToPoint(this.canvasLayer.getTopLeft());
        var dataGetOptions = {
            //fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
            transferCoordinate: function(coordinate) {
                var latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
                var worldPoint = mapProjection.fromLatLngToPoint(latLng);
                var pixel = {
                    x: (worldPoint.x - offset.x) * scale,
                    y: (worldPoint.y - offset.y) * scale,
                }
                return [pixel.x, pixel.y];
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

        var latLng = new google.maps.LatLng(0, 0);
        var worldPoint = mapProjection.fromLatLngToPoint(latLng);
        var pixel = {
            x: (worldPoint.x - offset.x) * scale,
            y: (worldPoint.y - offset.y) * scale,
        }


        if (self.options.unit == 'm' && self.options.size) {
            self.options._size = self.options.size / zoomUnit;
        } else {
            self.options._size = self.options.size;
        }

        this.drawContext(context, new DataSet(data), self.options, pixel);

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
        this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
        this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
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
