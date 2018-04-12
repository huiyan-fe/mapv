
import clear from "../../canvas/clear";
import BaseLayer from "../BaseLayer";
import CanvasLayer from "./CanvasLayer";

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

    _canvasUpdate() {
        var ctx = this.ctx;
        if (!ctx) {
            return;
        }
        //clear(ctx);
        var map = this.map;
        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var projection = map.getMapType().getProjection();

        var mcCenter = projection.lngLatToPoint(map.getCenter());
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

                data[i]._index++;

                if (data[i]._index >= data[i].geometry._coordinates.length) {
                    data[i]._index = 0;
                }

                var strokeStyle = data[i].strokeStyle || options.strokeStyle;
                var fillStyle = data[i].fillStyle || options.fillStyle || 'yellow';
                ctx.fillStyle = fillStyle;
                ctx.fill();
                if (strokeStyle && options.lineWidth) {
                    ctx.lineWidth = options.lineWidth || 1;
                    ctx.strokeStyle = strokeStyle;
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    animate() {
        this.drawAnimation();
        var animateTime = this.options.animateTime || 100;
        this.timeout = setTimeout(this.animate.bind(this), animateTime);
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
}

export default AnimationLayer;
