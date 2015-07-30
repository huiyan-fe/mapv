/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function ChoroplethDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ChoroplethDrawer, Drawer);

ChoroplethDrawer.prototype.drawMap = function () {

    var data = this.getLayer().getData();
    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();

    ctx.strokeStyle = drawOptions.strokeStyle;

    var radius = this.getRadius(); 
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        ctx.fillStyle = this.dataRange.getColorByRange(item.count);
        ctx.beginPath();
        ctx.moveTo(item.px, item.py);
        ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    console.log(this.splitList);

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

};
