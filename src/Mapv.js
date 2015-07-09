/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 * 地图可视化库，目前依赖与百度地图api，在百度地图api上展示点数据
 *
 */

/* globals Layer GeoData DrawTypeControl OptionalData util DataControl DrawScale DataRangeControl*/

/**
 * @param {Object}
 */
function Mapv(options) {
    Class.call(this);

    this.initOptions({
        map: null, //地图参数
        dataRangeCtrol: null
    });

    this.setOptions(options);

    this._layers = [];

    this._initDrawScale();
    this._initDataRange();
    this._initDrawTypeControl();
    this._initOptionDataControl();

    new DataControl(this);
}

util.inherits(Mapv, Class);

Mapv.prototype._initDrawScale = function () {
    this.Scale = new DrawScale();
};

Mapv.prototype._initOptionDataControl = function () {
    this.OptionalData = new OptionalData(this);
};

Mapv.prototype._initDataRange = function () {
    this.setDataRangeCtrol(new DataRangeControl()); 
    this.getMap().addControl(this.getDataRangeCtrol());
}

Mapv.prototype._initDrawTypeControl = function () {
    this._drawTypeControl = new DrawTypeControl({
        mapv: this
    });
    this.getMap().addControl(this._drawTypeControl);
};
