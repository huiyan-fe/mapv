/**
 * @file 普通的绘制方式
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function LineDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(LineDrawer, Drawer);

LineDrawer.prototype.drawMap = function(time) {
    this.beginDrawMap();
    var self = this;
    var ctx = this.getCtx();

    // TODO: use workder
    var data = this.getLayer().getData();

    var map = this.getMapv().getMap();
    var zoom = map.getZoom();
    var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);

    var param = formatParam.call(this);
    var size = param.size;

    var mercatorProjection = map.getMapType().getProjection();
    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMcX = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    var nwMc = new BMap.Pixel(nwMcX, mcCenter.y + (map.getSize().height / 2) * zoomUnit);

    // var grids = recGrids();
    // drawRec(grids);
    // var grids = {};
    // var gridStep = size / zoomUnit;
    // var startXMc = parseInt(nwMc.x / size, 10) * size;
    // var startX = (startXMc - nwMc.x) / zoomUnit;

    // var stockXA = [];
    // var stickXAIndex = 0;
    // while ((startX + stickXAIndex * gridStep) < map.getSize().width) {
    //     var value = startX + stickXAIndex * gridStep;
    //     stockXA.push(value.toFixed(2));
    //     stickXAIndex++;
    // }

    // var startYMc = parseInt(nwMc.y / size, 10) * size + size;
    // var startY = (nwMc.y - startYMc) / zoomUnit;
    // var stockYA = [];
    // var stickYAIndex = 0;
    // while ((startY + stickYAIndex * gridStep) < map.getSize().height) {
    //     value = startY + stickYAIndex * gridStep;
    //     stockYA.push(value.toFixed(2));
    //     stickYAIndex++;
    // }

    // for (var i = 0; i < stockXA.length; i++) {
    //     for (var j = 0; j < stockYA.length; j++) {
    //         var name = stockXA[i] + '_' + stockYA[j];
    //         grids[name] = 0;
    //     }
    // }
    // console.log(grids);

    // var map = this.getMapv().getMap();
    // var zoom = map.getZoom();
    // var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);
    // var mercatorProjection = map.getMapType().getProjection();
    // var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    // var mcLeft = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    // var mcTop = mcCenter.y + (map.getSize().height / 2) * zoomUnit;
    // var mcLeftTop = new BMap.Pixel(mcLeft, mcTop);

    // // grade 
    // var startMcXD = mcLeftTop.x - parseInt(mcLeftTop.x / 100) * 100;
    // var startMcYD = mcLeftTop.y - parseInt(mcLeftTop.y / 100) * 100;
    // console.log(startMcXD, startMcYD)
    // ctx.fillStyle = 'rgba(0,0,0,0.6)';
    // var gradeBorder = 100;
    // for (var i = -startMcYD; i < gradeBorder + map.getSize().height; i += gradeBorder) {
    //     for (var j = -startMcXD; j < gradeBorder + map.getSize().width; j += gradeBorder) {

    //         ctx.fillRect(i, j, gradeBorder - 1, gradeBorder - 1)
    //     }
    // }

    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(100,100,10,0.4)'
    ctx.lineWidth = 0.8
    for (var i = 0, len = data.length; i < len; i++) {
        ctx.beginPath();
        var pgeo = data[i].pgeo;
        ctx.moveTo(pgeo[0][0], pgeo[0][1]);
        for (var j = 1; j < pgeo.length; j++) {
            if (pgeo[j][0] < -100 && pgeo[j][1] < -100) {
                continue;
            }
            ctx.lineTo(pgeo[j][0], pgeo[j][1]);
        }
        // ctx.closePath();
        ctx.stroke();
        // break;
    }

    this.endDrawMap();



    function recGrids() {
        // var data = obj.data;
        // var nwMc = obj.nwMc;
        var size = 10;
        // var zoomUnit = obj.zoomUnit;
        var max;
        var min;

        var grids = {};

        // var gridStep = size / zoomUnit;
        var gridStep = size;

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

        for (var i = 0; i < stockXA.length; i++) {
            for (var j = 0; j < stockYA.length; j++) {
                var name = stockXA[i] + '_' + stockYA[j];
                grids[name] = 0;
            }
        }

        for (var i = 0; i < data.length; i++) {
            var pgeos = data[i].pgeo;
            for (var geoIndex in pgeos) {
                var x = pgeos[geoIndex][0];
                var y = pgeos[geoIndex][1];
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
                                grids[stockXA[j] + '_' + stockYA[k]] += val;
                                val = grids[stockXA[j] + '_' + stockYA[k]];
                                pgeos[geoIndex][0] = stockXA[j];
                                pgeos[geoIndex][1] = stockYA[k];
                            }
                        }
                    }
                }
                min = min || val;
                max = max || val;
                min = min > val ? val : min;
                max = max < val ? val : max;
            }
        }


        return {
            grids: grids,
            max: max,
            min: min
        };
    }


    function drawRec(grids) {
        console.log(grids);
        for (var i in grids.grids) {
            var sp = i.split('_');
            var x = sp[0];
            var y = sp[1];
            // ctx.beginPath();
            // ctx.fillStyle = "blue";
            // ctx.arc(x, y, 1, 0, 2 * Math.PI);
            // ctx.fill();
        }
    }


}
