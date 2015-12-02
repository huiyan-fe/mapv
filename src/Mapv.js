/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 * 地图可视化库，目前依赖与百度地图api，在百度地图api上展示点数据
 *
 */

/**
 * Mapv主类
 * @param {Object}
 */
function Mapv(options) {
    Class.call(this);

    this.initOptions($.extend({
        map: null, //地图参数
        drawTypeControl: false,
        drawTypeControlOptions: {
            a: 1
        }
    }, options));

    this._layers = [];
    //this._initDrawScale();
    this._fixPinchZoom();
    
    this.notify('drawTypeControl');
}

util.inherits(Mapv, Class);

Mapv.prototype._initDrawScale = function () {
    this.Scale = new DrawScale();
};

Mapv.prototype.drawTypeControl_changed = function () {
    if (this.getDrawTypeControl()) {
        if (!this.drawTypeControl) {
            this.drawTypeControl = new DrawTypeControl({
                mapv: this
            });
        }
        this.getMap().addControl(this.drawTypeControl);
    } else {
        if (this.drawTypeControl) {
            this.getMap().removeControl(this.drawTypeControl);
        }
    }
}

// 执行pinch手势操作后，将地图的中心点改为两个触摸点的中心点，
// 使放大的区域能够显示在viewport的中心
Mapv.prototype._fixPinchZoom = function() {
    var bmap = this.getMap();
    var _zoom = bmap.getZoom();
    var _touchMidPoint;
    var _offset = bmap.getContainer().getBoundingClientRect();

    bmap.addEventListener('touchstart', function(e) {
        if (e.targetTouches.length == 2) {
            var touches = e.targetTouches;

            var middlePoint = {
                x: (touches[0].clientX + touches[1].clientX) / 2 - _offset.left,
                y: (touches[0].clientY + touches[1].clientY) / 2 - _offset.top
            }

            _touchMidPoint = bmap.pixelToPoint(middlePoint);
        }
    });

    bmap.addEventListener('touchcancel', function(e) {
        _touchMidPoint = null;
    });

    bmap.addEventListener('zoomend', function(e) {
        var newZoom = bmap.getZoom();
        if (newZoom > _zoom && _touchMidPoint) { // 放大时才修改中心点
            bmap.panTo(_touchMidPoint);
        }
        _zoom = newZoom; 
        _touchMidPoint = null;
    });
}
