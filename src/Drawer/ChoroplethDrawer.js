/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function ChoroplethDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ChoroplethDrawer, Drawer);

ChoroplethDrawer.prototype.drawMap = function (mapv, ctx) {

    var data = mapv.geoData.getData();

    var drawOptions = this.drawOptions;

    ctx.strokeStyle = drawOptions.strokeStyle;

    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        ctx.fillStyle = this.getColor(item.count);
        ctx.beginPath();
        ctx.moveTo(item.px, item.py);
        ctx.arc(item.px, item.py, drawOptions.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

};

ChoroplethDrawer.prototype.drawDataRange = function () {
    var canvas = this.mapv.getDataRangeCtrol().getContainer();
    var drawOptions = this.drawOptions;
    canvas.width = 100;
    canvas.height = 190;
    canvas.style.width = '100px';
    canvas.style.height = '190px';
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';

    var splitList = this.splitList;

    for (var i = 0; i < splitList.length; i++) {
        ctx.fillStyle = splitList[i].color;
        ctx.beginPath();
        ctx.arc(15, i * 25 + 15, drawOptions.radius, 0, Math.PI * 2, false);
        var text = (splitList[i].start || '~') + ' - ' + (splitList[i].end || '~');
        ctx.fillText(text, 25, i * 25 + 20);
        ctx.closePath();
        ctx.fill();
    }
};

ChoroplethDrawer.prototype.getColor = function (val) {
    var splitList = this.splitList;

    var color = 'yellow';

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && val >= splitList[i].start) && (splitList[i].end === undefined || splitList[i].end !== undefined && val < splitList[i].end)) {
            color = splitList[i].color;
            break;
        }
    }
    
    return color;
};
