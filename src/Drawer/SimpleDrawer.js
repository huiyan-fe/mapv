/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function SimpleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(SimpleDrawer, Drawer);

SimpleDrawer.prototype.drawMap = function () {
    var data = this.getLayer().getData();
    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();

    ctx.fillStyle = drawOptions.fillStyle || "rgba(50, 50, 200, 0.8)";
    ctx.strokeStyle = drawOptions.strokeStyle;
    ctx.lineWidth = drawOptions.lineWidth || 1;

    ctx.beginPath();

    if (drawOptions.globalCompositeOperation) {
        ctx.globalCompositeOperation = drawOptions.globalCompositeOperation;
    }

    var zoomUnit = Math.pow(2, 18 - this.getMap().getZoom());

    var radius = drawOptions.radius || 3;

    var dataType = this.getLayer().getDataType();

    if (dataType === 'polyline' || dataType === 'polygon') {

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            ctx.moveTo(geo[0].x, geo[0].y);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j].x, geo[j].y);
            }
        }
        ctx.closePath();

        if (dataType === 'polygon') {
            ctx.fill();
        }

        if (drawOptions.strokeStyle || dataType === 'polyline') {
            ctx.stroke();
        } 

    } else {
        // console.log(data);
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                continue;
            }
            ctx.moveTo(item.px, item.py);
            ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
        }

        ctx.fill();

        if (drawOptions.strokeStyle) {
            ctx.stroke();
        }
    }

}

