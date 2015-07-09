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
    if (drawOptions.shadowColor) {
        ctx.shadowColor = drawOptions.shadowColor || 'black';
    }
    if (drawOptions.shadowBlur) {
        ctx.shadowBlur = drawOptions.shadowBlur;
    }

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
            ctx.moveTo(geo[0][0], geo[0][1]);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }
        }

        if (dataType === 'polygon') {
            ctx.closePath();
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

/**
 * 绘制动画
 */
SimpleDrawer.prototype.drawAnimation = function () {
    var data = this.getLayer().getData();
    var dataType = this.getLayer().getDataType();
    var animationOptions = this.getLayer().getAnimationOptions();
    var ctx = this.getLayer().getAnimationCtx();

    if (dataType === 'polyline') {
        for (var i = 0, len = data.length; i < len; i++) {
            var index = data[i].index;
            var pgeo = data[i].pgeo;

            /* 设定渐变区域 */
            var x = pgeo[index][0];
            var y = pgeo[index][1];
            var grad  = ctx.createRadialGradient(x, y, 0, x, y, animationOptions.radius);
            grad.addColorStop(0,'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.4,'rgba(255, 255, 255, 0.9)');
            grad.addColorStop(1,'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.arc(x, y, animationOptions.radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            data[i].index++;
            if (data[i].index >= data[i].pgeo.length) {
                data[i].index = 0;
            }
        }
    }
}
