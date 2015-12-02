/**
 * @file draw grad on the map
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

/* globals Drawer mercatorProjection BMap util */

var min;
var max;
var _this = {}

function DensityDrawer() {
    this.Scale;
    this.masker = {};
    Drawer.apply(this, arguments);

    // init
    this.init()
}

DensityDrawer.prototype.init = function(){
    var self = this;
    var mapv = this.getMapv();
    //init events
    var options = this.getDrawOptions();
    // console.log()
    if (options.events) {
        for(var i in options.events) {
            addEventFn(i);
        }
    }

    function addEventFn(i){
        mapv.mapEvent.addEvent(i,function(e){
            var cache = null;
            var point = null;
            // console.log(self.grids)
            if(options.type == 'honeycomb'){
                // console.log(e.offsetX, e.offsetY)
                // var count = data[i].count;
                var pX = e.offsetX;
                var pY = e.offsetY;
                //
                var fixYIndex = Math.round((pY - _this.startY) / _this.depthY);
                var fixY = fixYIndex * _this.depthY + _this.startY;
                var fixXIndex = Math.round((pX - _this.startX) / _this.depthX);
                var fixX = fixXIndex * _this.depthX + _this.startX;
                //
                if (fixYIndex % 2) {
                    fixX = fixX - _this.depthX / 2;
                }
                point = self.grids[fixX+'|'+fixY].len;
            }else{
                for (var j in self.grids) {
                    var pos = j.split('_');
                    if (e.offsetX - pos[0] <= _this.gridStep  && e.offsetY - pos[1] <= _this.gridStep ){
                        point = self.grids[j];

                        break;
                    }
                }
            }
            options.events[i](e, point);
        })
    }
}


util.inherits(DensityDrawer, Drawer);

DensityDrawer.prototype.scale = function (scale) {
    var self = this;
    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };
        self.ctx = self.getCtx();
        self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        self.drawMap();
    });
    this.Scale = scale;
};

DensityDrawer.prototype.drawMap = function () {
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
    // 左上角墨卡托坐标

    window.console.time('computerMapData');
    var obj = {
        data: data,
        nwMc: nwMc,
        size: size,
        zoomUnit: zoomUnit,
        ctx: ctx
    };

    var gridsObj = {};
    if (this.getDrawOptions().type === 'honeycomb') {
        gridsObj = honeycombGrid(obj);
    } else {
        gridsObj = recGrids(obj, map);
    }
    // console.log(gridsObj);

    var grids = this.grids = gridsObj.grids;
    this.dataRange.setMax(gridsObj.max);
    this.dataRange.setMin(gridsObj.min);
    var max = gridsObj.max;
    var min = gridsObj.min;
    // console.log(gridsObj);
    window.console.timeEnd('computerMapData');

    window.console.time('drawMap');
    var obj = {
        size: size,
        zoomUnit: zoomUnit,
        max: max,
        min: min,
        ctx: ctx,
        grids: grids,
        fillColors: param.colors,
        dataRange: this.dataRange,
        sup: self
    };

    var gridsObj = {};
    if (this.getDrawOptions().type === 'honeycomb') {
        drawHoneycomb.call(this,obj);
    } else {
        drawRec.call(this,obj);
    }
    window.console.timeEnd('drawMap');

    this.Scale && this.Scale.set({
        max: max,
        min: min,
        colors: this.getDrawOptions().gradient || 'default'
    });

    this.endDrawMap();
};

function recGrids(obj, map) {
    var data = obj.data;
    var nwMc = obj.nwMc;
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var max;
    var min;

    var grids = {};

    var gridStep = _this.gridStep = size / zoomUnit;

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


    return {
        grids: grids,
        max: max,
        min: min
    };
}

function drawRec(obj) {
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var max = obj.max;
    var min = obj.min;
    var ctx = obj.ctx;
    var grids = obj.grids;
    var fillColors = obj.fillColors;
    var self = obj.sup;
    var options = formatParam.call(this);


    var gridStep = size / zoomUnit;
    var step = (max - min + 1) / 10;

    for (var i in grids) {
        var sp = i.split('_');
        var x = sp[0];
        var y = sp[1];
        var v = (grids[i] - min) / step;
        //var color = fillColors[v | 0];
        var color = obj.dataRange.getColorByGradient(grids[i]);
        try{
            if(options.opacity){
                var alpha = parseInt(color.match(/rgba\(.+?\,.+?\,.+?\,(.+?)\)/)[1] * options.opacity)/255;
                color = color.replace(/(rgba\(.+?\,.+?\,.+?\,).+?(\))/,'$1'+ alpha +'$2');
            }
        }catch(e){

        }

        var isTooSmall = self.masker.min && (grids[i] < self.masker.min);
        var isTooBig = self.masker.max && (grids[i] > self.masker.max);
        if (grids[i] === 0 || isTooSmall || isTooBig) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
        } else {
            ctx.fillStyle = color;
        }
        ctx.fillRect(x, y, gridStep - 1, gridStep - 1);


        if (self.getDrawOptions().label && self.getDrawOptions().label.show) {
            ctx.save();
            ctx.textBaseline = 'top';
            if (grids[i] !== 0 && !isTooSmall && !isTooBig) {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                console.log(x + 10)
                ctx.fillText(grids[i], parseInt(x) + gridStep/2 , parseInt(y) + gridStep/2);
            }
            ctx.restore();
        }
    }
}

function honeycombGrid(obj) {
    var data = obj.data;
    var nwMc = obj.nwMc;
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var ctx = obj.ctx;
    var max;
    var min;

    var grids = {};

    var gridStep = _this.gridStep = size / zoomUnit;

    var depthX = _this.depthX =gridStep;
    var depthY = _this.depthY = gridStep * 3 / 4;

    var sizeY = 2 * size * 3 / 4;
    var startYMc = parseInt(nwMc.y / sizeY + 1, 10) * sizeY;
    var startY = (nwMc.y - startYMc) / zoomUnit;
    startY = _this.startY = parseInt(startY, 10);

    var startXMc = parseInt(nwMc.x / size, 10) * size;
    var startX = (startXMc - nwMc.x) / zoomUnit;
    startX = _this.startX = parseInt(startX, 10);

    var endX = parseInt(ctx.canvas.width + depthX, 10);
    var endY = parseInt(ctx.canvas.height + depthY, 10);

    var pointX = startX;
    var pointY = startY;

    var odd = false;
    while (pointY < endY) {
        while (pointX < endX) {
            var x = odd ? pointX - depthX / 2 : pointX;
            x = parseInt(x, 10);
            grids[x + '|' + pointY] = grids[x + '|' + pointY] || {
                x: x,
                y: pointY,
                len: 0
            };

            pointX += depthX;
        }
        odd = !odd;
        pointX = startX;
        pointY += depthY;
    }

    for (var i in data) {
        var count = data[i].count;
        var pX = data[i].px;
        var pY = data[i].py;

        var fixYIndex = Math.round((pY - startY) / depthY);
        var fixY = fixYIndex * depthY + startY;
        var fixXIndex = Math.round((pX - startX) / depthX);
        var fixX = fixXIndex * depthX + startX;

        if (fixYIndex % 2) {
            fixX = fixX - depthX / 2;
        }
        if (fixX < startX || fixX > endX || fixY < startY || fixY > endY) {
            continue;
        }

        if (grids[fixX + '|' + fixY]) {
            grids[fixX + '|' + fixY].len += count;
            var num = grids[fixX + '|' + fixY].len;
            max = max || num;
            min = min || num;
            max = Math.max(max, num);
            min = Math.min(min, num);
        }
    }

    return {
        grids: grids,
        max: max,
        min: min
    };

}

function drawHoneycomb(obj) {
    var options = formatParam.call(this);
    // console.log(options)
    // return false;
    var ctx = obj.ctx;
    var grids = obj.grids;
    var gridsW = obj.size / obj.zoomUnit;

    var color = obj.fillColors;
    var step = (obj.max - obj.min - 1) / color.length;

    var drowZero = false;

    // console.log()
    for (var i in grids) {
        var x = grids[i].x;
        var y = grids[i].y;
        var count = grids[i].len;
        var level = count / step | 0;
        level = level >= color.length ? color.length - 1 : level;
        level = level < 0 ? 0 : level;
        var useColor = obj.dataRange.getColorByGradient(count);
        try{
            if(options.opacity){
                var alpha = parseInt(useColor.match(/rgba\(.+?\,.+?\,.+?\,(.+?)\)/)[1] * options.opacity)/255;
                useColor = useColor.replace(/(rgba\(.+?\,.+?\,.+?\,).+?(\))/,'$1'+ alpha +'$2');
            }
        }catch(e){

        }

        // console.log(useColor);
        var isTooSmall = obj.sup.masker.min && (obj.sup.masker.min > count);
        var isTooBig = obj.sup.masker.max && (obj.sup.masker.max < count);
        if (count > 0 && !isTooSmall && !isTooBig) {
            draw(x, y, gridsW - 1, useColor, ctx);
        } else {
            if(drowZero){
                draw(x, y, gridsW - 1, 'rgba(0,0,0,0.4)', ctx);
            }
        }

        // draw text
        if (obj.sup.getDrawOptions().label &&  obj.sup.getDrawOptions().label.show && !isTooSmall && !isTooBig) {
            if(!(count==0 && drowZero==false)){
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillText(count, x, y);
                ctx.restore();
            }
        }
    }
    // console.log(obj, step);
}

var r =0, g=0, b=0;
function draw(x, y, gridStep, color, ctx) {
    ctx.beginPath();
    ctx.fillStyle = color;

    ctx.moveTo(x, y - gridStep / 2);
    ctx.lineTo(x + gridStep / 2, y - gridStep / 4);
    ctx.lineTo(x + gridStep / 2, y + gridStep / 4);
    ctx.lineTo(x, y + gridStep / 2);
    ctx.lineTo(x - gridStep / 2, y + gridStep / 4);
    ctx.lineTo(x - gridStep / 2, y - gridStep / 4);
    ctx.fill();
    ctx.closePath();
}


/**
 * format param
 * @return {[type]} [description]
 */
function formatParam() {

    var options = this.getDrawOptions();
    options = JSON.stringify(options);
    options = JSON.parse(options);
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

    var size = options.size || '50';
    size = size + (options.unit || 'px');
    if (/px$/.test(size)) {
        size = parseInt(size, 10) * this.zoomUnit;
    } else {
        size = parseInt(size, 10);
    }
    options.size = size;
    options.colors = fillColors;
    return options
}
