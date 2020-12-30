/**
 * @author kyle / http://nikai.us/
 */

import BaseLayer from '../BaseLayer';
import CanvasLayer from './CanvasLayer';
import clear from '../../canvas/clear';
import Intensity from '../../utils/data-range/Intensity';

var global = typeof window === 'undefined' ? {} : window;
var BMap = global.BMap || global.BMapGL;

class Layer extends BaseLayer {
    constructor(map, dataSet, options) {
        super(map, dataSet, options);

        var self = this;
        options = options || {};

        this.clickEvent = this.clickEvent.bind(this);
        this.mousemoveEvent = this.mousemoveEvent.bind(this);
        this.tapEvent = this.tapEvent.bind(this);

        self.init(options);
        self.argCheck(options);
        self.transferToMercator();

        var canvasLayer = (this.canvasLayer = new CanvasLayer({
            map: map,
            context: this.context,
            updateImmediate: options.updateImmediate,
            paneName: options.paneName,
            mixBlendMode: options.mixBlendMode,
            enableMassClear: options.enableMassClear,
            zIndex: options.zIndex,
            update() {
                self._canvasUpdate();
            }
        }));

        dataSet.on('change', function () {
            self.transferToMercator();
            // 数据更新后重新生成聚合数据
            if (options.draw === 'cluster') {
                self.refreshCluster();
            }
            canvasLayer.draw();
        });
    }

    clickEvent(e) {
        var pixel = e.pixel;
        super.clickEvent(pixel, e);
    }

    mousemoveEvent(e) {
        var pixel = e.pixel;
        super.mousemoveEvent(pixel, e);
    }

    tapEvent(e) {
        var pixel = e.pixel;
        super.tapEvent(pixel, e);
    }

    bindEvent(e) {
        this.unbindEvent();
        var map = this.map;
        var timer = 0;
        var that = this;

        if (this.options.methods) {
            if (this.options.methods.click) {
                map.setDefaultCursor('default');
                map.addEventListener('click', this.clickEvent);
            }
            if (this.options.methods.mousemove) {
                map.addEventListener('mousemove', this.mousemoveEvent);
            }

            if ('ontouchend' in window.document && this.options.methods.tap) {
                map.addEventListener('touchstart', function (e) {
                    timer = new Date();
                });
                map.addEventListener('touchend', function (e) {
                    if (new Date() - timer < 300) {
                        that.tapEvent(e);
                    }
                });
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
    transferToMercator(dataSet) {
        if (!dataSet) {
            dataSet = this.dataSet;
        }

        var map = this.map;

        var mapType = map.getMapType();
        var projection;
        if (mapType.getProjection) {
            projection = mapType.getProjection();
        } else {
            projection = {
                lngLatToPoint: function (point) {
                    var mc = map.lnglatToMercator(point.lng, point.lat);
                    return {
                        x: mc[0],
                        y: mc[1]
                    };
                }
            };
        }

        if (this.options.coordType !== 'bd09mc') {
            var data = dataSet.get();
            data = dataSet.transferCoordinate(
                data,
                function (coordinates) {
                    if (coordinates[0] < -180 || coordinates[0] > 180 || coordinates[1] < -90 || coordinates[1] > 90) {
                        return coordinates;
                    } else {
                        var pixel = projection.lngLatToPoint({
                            lng: coordinates[0],
                            lat: coordinates[1]
                        });
                        return [pixel.x, pixel.y];
                    }
                },
                'coordinates',
                'coordinates_mercator'
            );
            dataSet._set(data);
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
        var animationOptions = this.options.animation;
        var map = this.canvasLayer._map;
        var projection;
        var mcCenter;
        if (map.getMapType().getProjection) {
            projection = map.getMapType().getProjection();
            mcCenter = projection.lngLatToPoint(map.getCenter());
        } else {
            mcCenter = {
                x: map.getCenter().lng,
                y: map.getCenter().lat
            };
            if (mcCenter.x > -180 && mcCenter.x < 180) {
                mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                mcCenter = {x: mcCenter[0], y: mcCenter[1]};
            }
            projection = {
                lngLatToPoint: function (point) {
                    var mc = map.lnglatToMercator(point.lng, point.lat);
                    return {
                        x: mc[0],
                        y: mc[1]
                    };
                }
            };
        }
        var zoomUnit;
        if (projection.getZoomUnits) {
            zoomUnit = projection.getZoomUnits(map.getZoom());
        } else {
            zoomUnit = Math.pow(2, 18 - map.getZoom());
        }
        //左上角墨卡托坐标
        var nwMc = new BMap.Pixel(
            mcCenter.x - (map.getSize().width / 2) * zoomUnit,
            mcCenter.y + (map.getSize().height / 2) * zoomUnit
        );

        var context = this.getContext();
        if (this.isEnabledTime()) {
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
            for (var key in this.options) {
                context[key] = this.options[key];
            }
        } else {
            context.clear(context.COLOR_BUFFER_BIT);
        }

        if (
            (this.options.minZoom && map.getZoom() < this.options.minZoom) ||
            (this.options.maxZoom && map.getZoom() > this.options.maxZoom)
        ) {
            return;
        }

        var scale = 1;
        if (this.context != '2d') {
            scale = this.canvasLayer.devicePixelRatio;
        }

        var dataGetOptions = {
            fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
            transferCoordinate: function (coordinate) {
                var x = ((coordinate[0] - nwMc.x) / zoomUnit) * scale;
                var y = ((nwMc.y - coordinate[1]) / zoomUnit) * scale;
                return [x, y];
            }
        };

        if (time !== undefined) {
            dataGetOptions.filter = function (item) {
                var trails = animationOptions.trails || 10;
                if (time && item.time > time - trails && item.time < time) {
                    return true;
                } else {
                    return false;
                }
            };
        }

        // get data from data set
        var data;
        var zoom = this.getZoom();
        if (this.options.draw === 'cluster' && (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)) {
            var bounds = this.map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            var clusterData = this.supercluster.getClusters([sw.lng, sw.lat, ne.lng, ne.lat], zoom);
            this.pointCountMax = this.supercluster.trees[zoom].max;
            this.pointCountMin = this.supercluster.trees[zoom].min;
            var intensity = {};
            var color = null;
            var size = null;
            if (this.pointCountMax === this.pointCountMin) {
                color = this.options.fillStyle;
                size = this.options.minSize || 8;
            } else {
                intensity = new Intensity({
                    min: this.pointCountMin,
                    max: this.pointCountMax,
                    minSize: this.options.minSize || 8,
                    maxSize: this.options.maxSize || 30,
                    gradient: this.options.gradient
                });
            }
            for (var i = 0; i < clusterData.length; i++) {
                var item = clusterData[i];
                if (item.properties && item.properties.cluster_id) {
                    clusterData[i].size = size || intensity.getSize(item.properties.point_count);
                    clusterData[i].fillStyle = color || intensity.getColor(item.properties.point_count);
                } else {
                    clusterData[i].size = self.options.size;
                }
            }

            this.clusterDataSet.set(clusterData);
            this.transferToMercator(this.clusterDataSet);
            data = self.clusterDataSet.get(dataGetOptions);
        } else {
            data = self.dataSet.get(dataGetOptions);
        }

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

        if (self.options.max) {
            this.intensity.setMax(self.options.max);
        }

        if (self.options.min) {
            this.intensity.setMin(self.options.min);
        }

        this.initAnimator();
        this.bindEvent();
    }

    getZoom() {
        return this.map.getZoom();
    }

    addAnimatorEvent() {
        this.map.addEventListener('movestart', this.animatorMovestartEvent.bind(this));
        this.map.addEventListener('moveend', this.animatorMoveendEvent.bind(this));
    }

    show() {
        this.map.addOverlay(this.canvasLayer);
        this.bindEvent();
    }

    hide() {
        this.unbindEvent();
        this.map.removeOverlay(this.canvasLayer);
    }

    draw() {
        this.canvasLayer && this.canvasLayer.draw();
    }

    clearData() {
        this.dataSet && this.dataSet.clear();
        this.update({
            options: null
        });
    }

    destroy() {
        this.unbindEvent();
        this.clearData();
        this.map.removeOverlay(this.canvasLayer);
        this.canvasLayer = null;
    }
}

export default Layer;
