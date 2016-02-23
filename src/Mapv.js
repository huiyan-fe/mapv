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

    this.notify('drawTypeControl');
    this.mapEvent = new MapEvent(options.map);
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
