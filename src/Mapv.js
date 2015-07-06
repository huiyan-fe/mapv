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
    this._layers = [];
    this._initOptions(options);
    this._initDrawScale();
    this._initDataRange();
    this._initGeodata();
    // this._initDrawer();
    // this._initLayer();
    this._initDrawTypeControl();
    this._initOptionDataControl();
    this.setOptions(options);

    new DataControl(this);
}
util.inherits(Mapv, Class);
Mapv.prototype._initDrawScale = function () {
    this.Scale = new DrawScale();
};
Mapv.prototype._initOptionDataControl = function () {
    this.OptionalData = new OptionalData(this);
};
/**
 * reset the options
 * @param {Object} options the option
 * @param {Object} wipe    if you want wipe some data user this
 *                         if the value is true , the data of the key will wiped
 *                         forexample {drawOptions:true,map:false}
 *                             will wipe the drawOtions,while the map is false , it'll keeped
 */
Mapv.prototype.setOptions = function (options, wipe) {
    util.extend(this.options, options);
    // console.log('@@@@@@',this.drawer.scale)
    return;
    if(options.data !== undefined) {
        this.geoData.setData(options.data);
    }
    this.layer.draw();

    if(drawer.scale) {
        drawer.scale(this.Scale);
        this.Scale.show();
    } else {
        this.Scale.hide();
    }
    // drawer.drawMap(this, this.ctx, this.options.data);
};
/**
 * @param {}
 * 初始化参数
 */
Mapv.prototype._initOptions = function (options) {
    var defaultOptions = {
        drawType: 'simple'
    };
    options = options || {};
    this.options = util.extend(defaultOptions, options);
};
Mapv.prototype._initGeodata = function () {
    this.geoData = new GeoData(this);
};
Mapv.prototype._initDataRange = function () {
    this._dataRangeCtrol = new DataRangeControl();
    this.options.map.addControl(this._dataRangeCtrol);
}
Mapv.prototype._initDrawer = function () {
    this._drawer = {};
}
Mapv.prototype._initDrawTypeControl = function () {
    this._drawTypeControl = new DrawTypeControl({
        mapv: this
    });
    this.options.map.addControl(this._drawTypeControl);
};
Mapv.prototype.getMap = function () {
    return this.options.map;
};
Mapv.prototype.getDataRangeCtrol = function () {
    return this._dataRangeCtrol;
};
Mapv.prototype.getOptions = function () {
    return this.options;
};
