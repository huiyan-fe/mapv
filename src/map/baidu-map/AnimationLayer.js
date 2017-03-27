
import clear from "../../canvas/clear";
import CanvasLayer from "./CanvasLayer";

class AnimationLayer{
    constructor (map, dataSet, options) {
        this.map = map;
        this.options = options || {};
        var canvasLayer = new CanvasLayer({
            map: map,
            update: this._canvasUpdate.bind(this)
        });
        this.dataSet = dataSet;
        this.transferToMercator();
        this.ctx = canvasLayer.canvas.getContext('2d');

        this.start();
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
        //clear(ctx);


        var map = this.map;
        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var projection = map.getMapType().getProjection();

        var mcCenter = projection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit, mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

        var dataGetOptions = {
            fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
            transferCoordinate: function(coordinate) {
                var x = (coordinate[0] - nwMc.x) / zoomUnit;
                var y = (nwMc.y - coordinate[1]) / zoomUnit;
                return [x, y];
            }
        }
        var data = this.dataSet.get(dataGetOptions);
        

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();

        for (var i = 0; i < data.length; i++) {
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
            ctx.strokeStyle = data[i].strokeStyle || options.strokeStyle || 'yellow';
            ctx.stroke();
        }
            
            
    }

    animate() {
        this._canvasUpdate();
        this.timeout = setTimeout(this.animate.bind(this), 100);
    }

    start() {
        this.stop();
        this.animate();
    }

    stop() {
        clearTimeout(this.timeout);
    }
}

export default AnimationLayer;
