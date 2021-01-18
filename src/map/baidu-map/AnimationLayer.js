import clear from "../../canvas/clear";
import BaseLayer from "../BaseLayer";
import CanvasLayer from "./CanvasLayer";

var global = typeof window === 'undefined' ? {} : window;
var BMap = global.BMap || global.BMapGL;

class AnimationLayer extends BaseLayer{
    constructor (map, dataSet, options) {

        super(map, dataSet, options);
        this.map = map;
        this.options = options || {};
        this.dataSet = dataSet;

        var canvasLayer = new CanvasLayer({
            map: map,
            zIndex: this.options.zIndex,
            update: this._canvasUpdate.bind(this)
        });

        // 动画循环次数
        this.animateLoopFrequency = 0;

        this.init(this.options);

        this.canvasLayer = canvasLayer;
        this.transferToMercator();
        var self = this;
        dataSet.on('change', function() {
            self.transferToMercator();
            canvasLayer.draw();
        });
        this.ctx = canvasLayer.canvas.getContext('2d');

        this.start();
    }

    draw() {
        this.canvasLayer.draw();
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
        
    }

    // 经纬度左边转换为墨卡托坐标
    transferToMercator() {
        var map = this.map;
        var mapType = map.getMapType();
        var projection;
        if (mapType.getProjection) {
            projection = mapType.getProjection();
        } else {
            projection = {
                lngLatToPoint: function(point) {
                    var mc = map.lnglatToMercator(point.lng, point.lat);
                    return {
                        x: mc[0],
                        y: mc[1]
                    }
                }
            }
        }

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

    _canvasUpdate() {
        var ctx = this.ctx;
        if (!ctx) {
            return;
        }
        //clear(ctx);
        var map = this.map;
        var projection;
        var mcCenter;
        if  (map.getMapType().getProjection) {
            projection = map.getMapType().getProjection();
            mcCenter = projection.lngLatToPoint(map.getCenter());
        } else  {
            mcCenter = {
                x: map.getCenter().lng,
                y: map.getCenter().lat
            };
            if (mcCenter.x > -180 && mcCenter.x < 180) {
                mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                mcCenter = {x: mcCenter[0], y: mcCenter[1]}
            }
            projection = {
                lngLatToPoint: function(point) {
                    var mc = map.lnglatToMercator(point.lng, point.lat);
                    return {
                        x: mc[0],
                        y: mc[1]
                    }
                }
            };
        }
        var zoomUnit;
        if (projection.getZoomUnits) {
            zoomUnit = projection.getZoomUnits(map.getZoom());
        } else {
            zoomUnit = Math.pow(2, 18 - map.getZoom());
        }
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

        clear(ctx);

        var dataGetOptions = {
            fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
            transferCoordinate: function(coordinate) {
                if (!coordinate) {
                    return;
                }
                var x = (coordinate[0] - nwMc.x) / zoomUnit;
                var y = (nwMc.y - coordinate[1]) / zoomUnit;
                return [x, y];
            }
        }
        this.data = this.dataSet.get(dataGetOptions);
        this.processData(this.data);
        this.drawAnimation();
    }
    
    drawAnimation() {
        var ctx = this.ctx;
        var data = this.data;
        if (!data) {
            return;
        }
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();

        ctx.save();
        if (this.options.shadowColor) {
            ctx.shadowColor = this.options.shadowColor;
        }

        if (this.options.shadowBlur) {
            ctx.shadowBlur = this.options.shadowBlur;
        }

        if (this.options.globalAlpha) {
            ctx.globalAlpha = this.options.globalAlpha;
        }

        if (this.options.globalCompositeOperation) {
            ctx.globalCompositeOperation = this.options.globalCompositeOperation;
        }
        var options = this.options;
        var hasCalcAnimateLoopFrequency = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i].geometry.type === 'Point') {
                ctx.beginPath();
                var maxSize = data[i].size || this.options.size;
                var minSize = data[i].minSize || this.options.minSize || 0;
                if (data[i]._size === undefined) {
                    data[i]._size = minSize;
                }
                ctx.arc(data[i].geometry._coordinates[0], data[i].geometry._coordinates[1], data[i]._size, 0, Math.PI * 2, true);
                ctx.closePath();

                data[i]._size++;

                if (data[i]._size > maxSize) {
                    data[i]._size = minSize;
                }
                ctx.lineWidth = 1;
                ctx.strokeStyle = data[i].strokeStyle || data[i]._strokeStyle || options.strokeStyle || 'yellow';
                ctx.stroke();
                var fillStyle = data[i].fillStyle || data[i]._fillStyle || options.fillStyle;
                if (fillStyle) {
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                }
            } else if (data[i].geometry.type === 'LineString') {
                ctx.beginPath();
                var size = data[i].size || this.options.size || 5;
                var minSize = data[i].minSize || this.options.minSize || 0;
                if (data[i]._index === undefined) {
                    data[i]._index = 0;
                }
                var index = data[i]._index;
                
                ctx.arc(data[i].geometry._coordinates[index][0], data[i].geometry._coordinates[index][1], size, 0, Math.PI * 2, true);
                ctx.closePath();
                data[i]._index = data[i]._index + (data[i]._step || 1);
                var strokeStyle = data[i].strokeStyle || options.strokeStyle;
                var fillStyle = data[i].fillStyle || options.fillStyle || 'yellow';
                ctx.fillStyle = fillStyle;
                ctx.fill();
                if (strokeStyle && options.lineWidth) {
                    ctx.lineWidth = options.lineWidth || 1;
                    ctx.strokeStyle = strokeStyle;
                    ctx.stroke();
                }
                if (data[i]._index >= data[i].geometry._coordinates.length) {
                    if (options.isRound) {
                        data[i]._step = -1;
                        data[i]._index = data[i].geometry._coordinates.length - 1;
                    } else {
                        data[i]._index = 0;
                        // 达到了临界值，并且在此次循环中动画次数没有计算，则加1 
                        !hasCalcAnimateLoopFrequency && this.animateLoopFrequency++;
                        // 开关关掉，一次循环中只能加一次动画执行次数
                        hasCalcAnimateLoopFrequency = true;
                    }
                } 
                if (data[i]._index < 0 && options.isRound) {
                    data[i]._step = 1;
                    data[i]._index = 0;
                    !hasCalcAnimateLoopFrequency && this.animateLoopFrequency++;
                    hasCalcAnimateLoopFrequency = true;
                }
            }
        }
        ctx.restore();
    }

    animate() {
        var prevAnimateLoopFrequency = this.animateLoopFrequency;
        this.drawAnimation();
        var animateTime = this.options.animateTime || 100;
        var stayTime = this.options.stayTime;
        // 动画有停留的时间，并且 循环次数也改变了，则使用停留时间
        if (stayTime && this.animateLoopFrequency != prevAnimateLoopFrequency) {
            this.hide();
            this.timeout = setTimeout(() => {
                this.canvasLayer.show();
                this.animate();
            }, stayTime);
        } else {
            this.timeout = setTimeout(this.animate.bind(this), animateTime);
        }
        var timesTimer = null;
        if (this.options.times !== undefined && this.animateLoopFrequency >= this.options.times) {
            this.stop();
            timesTimer && clearTimeout(timesTimer);
            timesTimer = setTimeout(this.hide.bind(this), animateTime)
            return;
        }
    }

    start() {
        this.stop();
        this.animate();
    }

    stop() {
        clearTimeout(this.timeout);
    }

    unbindEvent() {
    }

    hide() {
        this.canvasLayer.hide();
        this.stop();
    }

    show() {
        this.start();
    }

    clearData() {
        this.dataSet && this.dataSet.clear();
        this.update({
            options: null
        });
    }

    destroy() {
        this.stop();
        this.unbindEvent();
        this.clearData();
        this.map.removeOverlay(this.canvasLayer);
        this.canvasLayer = null;
    }
}

export default AnimationLayer;
