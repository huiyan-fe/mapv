/**
 * @file draw grad on the map
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

/* globals Drawer mercatorProjection BMap util */

var min;
var max;


function DensityDrawer() {
    this.Scale;
    this.masker = {};
    this.mapv = null;
    this.ctx = null;
    Drawer.apply(this, arguments);
}

util.inherits(DensityDrawer, Drawer);

DensityDrawer.prototype.scale = function (scale) {
    var self = this;
    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };

        self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        self.drawMap();
        // window.console.log(min, max);
    });
    this.Scale = scale;
};

DensityDrawer.prototype.drawMap = function (mapv, ctx) {
    mapv = this.mapv = this.mapv || mapv;
    ctx = this.ctx = this.ctx || ctx;

    // TODO: ser workder
    max = min = undefined;
    var data = mapv.geoData.getData();

    var map = mapv.getMap();
    var zoom = map.getZoom();
    var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);

    // setMapStyle(map);

    var param = formatParam.call(this);
    var gridWidth = param.gridWidth;
    var fillColors = param.colors;

    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMcX = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    var nwMc = new BMap.Pixel(nwMcX, mcCenter.y + (map.getSize().height / 2) * zoomUnit);
    // 左上角墨卡托坐标

    var gridStep = gridWidth / zoomUnit;

    var startXMc = parseInt(nwMc.x / gridWidth, 10) * gridWidth;
    var startX = (startXMc - nwMc.x) / zoomUnit;

    var stockXA = [];
    var stickXAIndex = 0;
    while ((startX + stickXAIndex * gridStep) < map.getSize().width) {
        var value = startX + stickXAIndex * gridStep;
        stockXA.push(value.toFixed(2));
        stickXAIndex++;
    }

    var startYMc = parseInt(nwMc.y / gridWidth, 10) * gridWidth + gridWidth;
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
        x = sp[0];
        y = sp[1];
        var v = (grids[i] - min) / step;
        var color = fillColors[v | 0];

        var isTooSmall = this.masker.min && (grids[i] < this.masker.min);
        var isTooBig = this.masker.max && (grids[i] > this.masker.max);
        if (grids[i] === 0 || isTooSmall || isTooBig) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
        } else {
            ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',0.4)';
        }
        ctx.fillRect(x, y, gridStep - 1, gridStep - 1);

        if (this.drawOptions.showNum) {
            ctx.save();
            // ctx.fillStyle = 'black';
            ctx.textBaseline = 'top';
            if (grids[i] !== 0 && !isTooSmall && !isTooBig) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillText(grids[i], x, y);

            }
            ctx.restore();
        }
    }
    // this.drawDataRange(mapv._dataRangeCtrol.getContainer());
    window.console.timeEnd('drawMap');
    // console.timeEnd('drawMap')

    // console.log()
    this.Scale && this.Scale.set({
        max: max,
        min: min,
        colors: 'default'
    });
};

// DensityDrawer.prototype.drawDataRange = function (canvas, data, drawOptions) {
//     canvas.width = 30;
//     canvas.height = 256;
//     canvas.style.width = '30px';
//     canvas.style.height = '256px';

//     var ctx = canvas.getContext('2d');

//     var gradient = ctx.createLinearGradient(0, 0, 0, 256);

//     // canvas.width = 1;
//     // canvas.height = 256;

//     var grad = this.colorBar;

//     for (var i in grad) {
//         gradient.addColorStop(i, grad[i]);
//     }

//     ctx.fillStyle = gradient;
//     ctx.fillRect(2, 10, 7, 236);

//     // draw max and min
//     ctx.beginPath();
//     ctx.moveTo(10, 10);
//     ctx.lineTo(13, 10);
//     ctx.stroke();
//     ctx.font = '10px sans-serif';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(min || 0, 15, 10);

//     ctx.beginPath();
//     ctx.moveTo(10, 246);
//     ctx.lineTo(13, 246);
//     ctx.stroke();
//     ctx.font = '10px sans-serif';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(max || 0, 15, 246);

//     // console.log(max, min)
// };

/**
 * format param
 * @return {[type]} [description]
 */
function formatParam() {

    var options = this.drawOptions;
    // console.log(options)
    var fillColors = this.fillColors = [
        [73, 174, 34],
        [119, 191, 26],
        [160, 205, 18],
        [202, 221, 10],
        [248, 237, 1],
        [225, 222, 3],
        [254, 182, 10],
        [254, 126, 19],
        [254, 84, 27],
        [253, 54, 32]
    ];

    this.colorBar = {};
    for (var i = 0; i < fillColors.length; i++) {
        var pos = (i + 1) / fillColors.length;
        var r = fillColors[i][0];
        var g = fillColors[i][1];
        var b = fillColors[i][2];
        this.colorBar[pos] = 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    var gridWidth = options.gridWidth || '50';
    gridWidth = gridWidth + (options.gridUnit || 'px');
    if (/px$/.test(gridWidth)) {
        gridWidth = parseInt(gridWidth, 10) * this.zoomUnit;
    } else {
        gridWidth = parseInt(gridWidth, 10);
    }
    // console.log(gridWidth, options.gridWidth)
    return {
        gridWidth: gridWidth,
        colors: fillColors
    };
}
