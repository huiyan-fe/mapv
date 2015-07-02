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
    this._initOptions(options);
    this._initDrawScale();
    this._initDataRange();
    this._initGeodata();

    // this._initDrawer();
    this._initLayer();
    this._initDrawTypeControl();
    this._initOptionDataControl();
    this.setOptions(options);

    // for data control
    // console.log('???', this.geoData);
    new DataControl(this);
}

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

    var drawer = this._getDrawer(this.options.drawType);
    drawer.setDrawOptions(this.options.drawOptions[this.options.drawType]);

    if (options.data !== undefined) {
        this.geoData.setData(options.data);
    }
    this.layer.draw();

    if (drawer.drawDataRange) {
        this.options.map.addControl(this._dataRangeCtrol);
        drawer.drawDataRange(this._dataRangeCtrol.getContainer());
    } else {
        this.options.map.removeControl(this._dataRangeCtrol);
    }

    if (drawer.scale) {
        drawer.scale(this.Scale);
        this.Scale.show();
    } else {
        this.Scale.hide();
    }

    this.OptionalData && this.OptionalData.initController(this.options.drawType);
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

/**
 * 初始化图层
 */
Mapv.prototype._initLayer = function () {
    var that = this;

    this.layer = new Layer(this.options.map, this, function (ctx) {
        // console.log('_initLayer')
        var drawType = that.options.drawType || 'simple';
        that.ctx = ctx;
        that._getDrawer(drawType).drawMap(that, ctx, that.options.data);
    });
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

Mapv.prototype._getDrawer = function (drawType) {

    if (!this._drawer) {
        this._initDrawer();
    }

    if (!this._drawer[drawType]) {
        var funcName = drawType.replace(/(\w)/, function (v) {
            return v.toUpperCase();
        });
        funcName += 'Drawer';
        var drawer = this._drawer[drawType] = eval('(new ' + funcName + '(this))');
        if (drawer.scale) {
            drawer.scale(this.Scale);
            this.Scale.show();
        } else {
            this.Scale.hide();
        }
    }
    return this._drawer[drawType];
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
