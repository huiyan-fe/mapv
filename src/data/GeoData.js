/**
 * @file 数据处理对象
 */

/* globals BMap map mercatorProjection*/

function GeoData(superObj) {
    var map = superObj.options.map;
    var data = superObj.options.data;
    this.super = superObj;
    this.setData(data);
    this.map = map;
}

/**
 * 重新计算相对于当前屏幕左上角的像素坐标
 */
GeoData.prototype.calculatePixel = function () {
<<<<<<< HEAD
    // console.log('???')
=======

>>>>>>> bc51f417d86bd5e698effebedbdf4cfcfb5cadf3
    // 墨卡托坐标计算方法
    var zoom = map.getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);
    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit,
        mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标

    var data = this.data;

    // data = [{
    //     count: 100,
    //     x: 12958157.19,
    //     y: 4825935.04
    // }]

    for (var j = 0; j < data.length; j++) {

        if (data[j].lng && data[j].lat) {
            var pixel = this.map.pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
            data[j].px = pixel.x;
            data[j].py = pixel.y;
        }

        if (data[j].x && data[j].y) {

            data[j].px = (data[j].x - nwMc.x) / zoomUnit;
            data[j].py = (nwMc.y - data[j].y) / zoomUnit;

        }

        // console.log(data[j])

        // if (j >= 5) {
        // break;
        // }
    }
};


GeoData.prototype.getData = function () {
    return this.data;
};

GeoData.prototype.setData = function (data) {
    // console.log('GGGG',data)
    if (!data) {
        this.data = [];
        return;
    }

    this._min = data[0].count;
    this._max = data[0].count;
    for (var i = 0; i < data.length; i++) {
        this._max = Math.max(this._max, data[i].count);
        this._min = Math.min(this._min, data[i].count);
    }
    this.data = data;
};

GeoData.prototype.getDataRange = function () {
    return {
        min: this._min,
        max: this._max
    };
};
