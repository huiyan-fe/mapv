/**
 * @file draw grad on the map
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

/* globals Drawer mercatorProjection BMap util */

var min;
var max;

function ClusterDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ClusterDrawer, Drawer);

ClusterDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    // console.log('ClusterDrawer');
    window.console.time('computerMapData');
    var ctx = this.getCtx();

    // TODO: ser workder
    max = min = undefined;

    var data = this.getLayer().getData();

    var map = this.getMapv().getMap();
    var zoom = map.getZoom();
    var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);

    // setMapStyle(map);

    var param = this.formatParam();
    // console.log(param)

    console.log(param)
    var size = param.size;

    var mercatorProjection = map.getMapType().getProjection();

    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMcX = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    var nwMc = new BMap.Pixel(nwMcX, mcCenter.y + (map.getSize().height / 2) * zoomUnit);
    // 左上角墨卡托坐标

    var gridStep = size / zoomUnit;

    var startXMc = parseInt(nwMc.x / size, 10) * size;
    var startX = (startXMc - nwMc.x) / zoomUnit;

    var stockXA = [];
    var stickXAIndex = 0;
    while ((startX + stickXAIndex * gridStep) < map.getSize().width) {
        var value = startX + stickXAIndex * gridStep;
        stockXA.push(value.toFixed(2));
        stickXAIndex++;
    }

    var startYMc = parseInt(nwMc.y / size, 10) * size + size;
    var startY = (nwMc.y - startYMc) / zoomUnit;
    var stockYA = [];
    var stickYAIndex = 0;
    while ((startY + stickYAIndex * gridStep) < map.getSize().height) {
        value = startY + stickYAIndex * gridStep;
        stockYA.push(value.toFixed(2));
        stickYAIndex++;
    }

    var grids = {};
    for (var i = 0; i < stockXA.length; i++) {
        for (var j = 0; j < stockYA.length; j++) {
            var name = stockXA[i] + '_' + stockYA[j];
            grids[name] = 0;
        }
    }

    for (var i = 0; i < data.length; i++) {
        var x = data[i].px;
        var y = data[i].py;
        var val = parseInt(data[i].count, 10);
        var isSmallX = x < stockXA[0];
        var isSmallY = y < stockYA[0];
        var isBigX = x > (Number(stockXA[stockXA.length - 1]) + Number(gridStep));
        var isBigY = y > (Number(stockYA[stockYA.length - 1]) + Number(gridStep));
        if (isSmallX || isSmallY || isBigX || isBigY) {
            continue;
        }
        for (var j = 0; j < stockXA.length; j++) {
            var dataX = Number(stockXA[j]);
            if ((x >= dataX) && (x < dataX + gridStep)) {
                for (var k = 0; k < stockYA.length; k++) {
                    var dataY = Number(stockYA[k]);
                    if ((y >= dataY) && (y < dataY + gridStep)) {
                        // grids[stockXA[j] + '_' + stockYA[k]] += 1;
                        grids[stockXA[j] + '_' + stockYA[k]] += val;
                        val = grids[stockXA[j] + '_' + stockYA[k]];
                    }
                }
            }
        }
        min = min || val;
        max = max || val;
        min = min > val ? val : min;
        max = max < val ? val : max;
    }

    var step = (max - min + 1) / 10;
    window.console.timeEnd('computerMapData');

    window.console.time('drawMap');
    for (var i in grids) {
        var sp = i.split('_');
        x = Number(sp[0]);
        y = Number(sp[1]);
        var v = (grids[i] - min) / step;
        v = v < 0 ? 0 : v;

        var cx = x + gridStep / 2;
        var cy = y + gridStep / 2;

        ctx.fillStyle = param.fillStyle || '#fa8b2e';

        ctx.beginPath();

        ctx.arc(cx, cy, v * 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 8 * v / 10;
        ctx.strokeStyle = param.strokeStyle || '#fff';
        ctx.stroke();

        // if (this.drawOptions.showNum) {
        ctx.save();
        // ctx.fillStyle = 'black';
        ctx.font = 30 * v / 10 + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (grids[i] !== 0 && param.label.show) {

            ctx.fillStyle =  '#fff';
            ctx.fillText(grids[i], cx, cy);
            ctx.restore();
        }
        // }
    }

    window.console.timeEnd('drawMap');
    this.endDrawMap();
};

// ClusterDrawer.prototype.drawDataRange = function (canvas, data, drawOptions) {
// };

/**
 * format param
 * @return {[type]} [description]
 */
ClusterDrawer.prototype.formatParam = function () {
    var options = this.getDrawOptions();
    options = JSON.stringify(options);
    options = JSON.parse(options);

    var size = options.size || 60;
    size = size + (options.unit || 'px');
    if (/px$/.test(size)) {
        size = parseInt(size, 10) * this.zoomUnit;
    } else {
        size = parseInt(size, 10);
    }
    options.size = size;
    return options
};
