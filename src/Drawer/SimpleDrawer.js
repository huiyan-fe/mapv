/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function SimpleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(SimpleDrawer, Drawer);

SimpleDrawer.prototype.drawMap = function (mapv, ctx) {
    var data = this._layer.getData();

    var drawOptions = this.drawOptions;

    ctx.fillStyle = drawOptions.fillStyle || "rgba(50, 50, 200, 0.8)";
    ctx.strokeStyle = drawOptions.strokeStyle;

    ctx.beginPath();

    if (drawOptions.globalCompositeOperation) {
        ctx.globalCompositeOperation = drawOptions.globalCompositeOperation;
    }

    var radius = drawOptions.radius || 3;
    // console.log(data);
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
            continue;
        }
        ctx.moveTo(item.px, item.py);
        ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI);
    }

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

    ctx.fill();
}
