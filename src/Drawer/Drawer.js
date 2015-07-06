/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals util */

function Drawer(mapv) {
    this.mapv = mapv;
    this.drawOptions = {};
}

Drawer.prototype.defaultDrawOptions = {
    radius: 2
};

Drawer.prototype.drawMap = function () {};

// we need defined drawDataRange so that in Mapv.js
//      we can shwo or remove range cans by drawer.drawDataRange
// Drawer.prototype.drawDataRange = function () {};

Drawer.prototype.setDrawOptions = function (drawOptions) {
    var defaultObj = util.copy(this.defaultDrawOptions);
    this.drawOptions = util.extend(defaultObj, drawOptions);
    if (this.drawOptions.splitList) {
        this.splitList = this.drawOptions.splitList;
    } else {
        this.generalSplitList();
    }

    this.drawDataRange && this.drawDataRange();

    // console.log('set-----',this.drawOptions);
};

Drawer.prototype.getDrawOptions = function () {
    // console.log('get-----',this.drawOptions);
    return this.drawOptions;
};

Drawer.prototype.clearDrawOptions = function (drawOptions) {
    this.drawOptions = {};
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
    var dataRange = this.mapv.geoData.getDataRange();
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
