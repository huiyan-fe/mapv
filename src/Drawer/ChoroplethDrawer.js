/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function ChoroplethDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ChoroplethDrawer, Drawer);

ChoroplethDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var data = this.getLayer().getData();
    var dataType = this.getLayer().getDataType();

    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();

    var label = drawOptions.label;
    var zoom = this.getMap().getZoom();
    if (label) {
        if (label.font) {
            ctx.font = label.font;
        }
    }

    if (dataType === 'polyline' || dataType === 'polygon') { // 画线或面

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            ctx.beginPath();
            ctx.moveTo(geo[0][0], geo[0][1]);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }

            ctx.fillStyle = this.dataRange.getColorByRange(data[i].count);

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
            }

            if (dataType === 'polygon') {
                ctx.closePath();
                ctx.fill();
            }

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i].count, center[0], center[1]);
            }

        }

    } else { // 画点

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

        if (drawOptions.strokeStyle) {
            ctx.stroke();
        }
    }

    this.endDrawMap();
};
