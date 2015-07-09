/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals util */

function Drawer(layer) {
    Class.call(this);

    this.mapv = layer._mapv;
    this.initOptions({
        layer: layer,
        map: layer.getMap(),
        ctx: null,
        mapv: null,
        animationOptions: {},
        drawOptions: {
            radius: 2
        }
    });

    this.bindTo('ctx', layer)
    this.bindTo('animationOptions', layer)
    this.bindTo('mapv', layer)
    this.bindTo('map', layer)
}

util.inherits(Drawer, Class);

Drawer.prototype.drawMap = function () {
};

// we need defined drawDataRange so that in Mapv.js
//      we can shwo or remove range cans by drawer.drawDataRange
// Drawer.prototype.drawDataRange = function () {};

Drawer.prototype.drawOptions_changed = function () {
    var drawOptions = this.getDrawOptions();
    if (drawOptions && drawOptions.splitList) {
        this.splitList = drawOptions.splitList;
    } else {
        this.generalSplitList();
    }

    this.drawDataRange && this.drawDataRange();

};

Drawer.prototype.colors = [
    'rgba(17, 102, 252, 0.8)',
    'rgba(52, 139, 251, 0.8)',
    'rgba(110, 176, 253, 0.8)',
    'rgba(255, 241, 193, 0.8)',
    'rgba(255, 146, 149, 0.8)',
    'rgba(253, 98, 104, 0.8)',
    'rgba(255, 0, 0, 0.8)',
    'rgba(255, 51, 61, 0.8)'
];

Drawer.prototype.generalSplitList = function () {
    var dataRange = this.getLayer().getDataRange();
    var splitNum = Math.ceil((dataRange.max - dataRange.min) / 7);
    var index = dataRange.min;
    this.splitList = [];
    var radius = 1;
    while (index < dataRange.max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            radius: radius,
            color: this.colors[radius - 1]
        });
        index += splitNum;
        radius++;
    }
};
