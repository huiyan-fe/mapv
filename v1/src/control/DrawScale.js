/**
 * @file drawScale
 * @author Mofei Zhu (zhuwenlong@baidu.com)
 */


function DrawScale() {

    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

DrawScale.prototype = new BMap.Control();

DrawScale.prototype.change = function (callback) {
    var self = this;
    self.changeFn = callback;
};

DrawScale.prototype.hide = function () {
    var self = this;
    self.box.style.display = 'none';
};

DrawScale.prototype.show = function () {
    var self = this;
    if (self.box) {
        self.box.style.display = 'block';
    }
};

DrawScale.prototype.set = function (obj) {
    var self = this;
    self.max = obj.max || self.max;
    self.min = obj.min || self.min;
    self.colors = obj.colors || self.colors;

    self._draw();
};

/**
 * init dom
 */
DrawScale.prototype.initialize = function (map) {
    var self = this;

    // prepare param
    // param-num
    self.changeFn = null;
    self.width = 55;
    self.height = 250;
    self.min = 0;
    self.max = 100;
    self.offsetTop = 10;
    self.offsetBottom = 10;
    self.drawHeight = self.height - self.offsetTop - self.offsetBottom;
    self.colors = [
        '#49ae22', '#77c01a', '#a0cd12', '#cadd0a', '#f8ed01', '#e1de03', '#feb60a', '#fe7e13', '#fe571b', '#fd3620'
    ];
    self.defaultColors = [
        '#49ae22', '#77c01a', '#a0cd12', '#cadd0a', '#f8ed01', '#e1de03', '#feb60a', '#fe7e13', '#fe571b', '#fd3620'
    ];
    // param-event
    self.point = {
        x: 0,
        y: 0
    };
    self.hoveredHandle = null;
    self.showHandle = false;
    self.handleStartPos = {
        // x: 0,
        val: self.min,
        yMin: self.offsetTop,
        yMax: self.offsetTop + self.drawHeight,
        y: self.offsetTop
    };
    self.handleEndPos = {
        // x: 0,
        val: self.max,
        yMin: self.offsetTop,
        yMax: self.offsetTop + self.drawHeight,
        y: self.offsetTop + self.drawHeight
    };

    // prepare dom
    var box = self.box = document.createElement('div');
    var canvas = document.createElement('canvas');
    canvas.width = self.width;
    canvas.height = self.height;
    canvas.style.cursor = 'pointer';
    box.style.border = '1px solid #999';
    box.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 0px 4px 2px';
    box.style.borderRadius = '6px';
    box.style.background = 'white';
    box.style.position = 'absolute';
    //box.style.right = '10px';
    //box.style.bottom = '10px';
    box.style.width = self.width + 'px';
    box.style.height = self.height + 'px';
    box.style.zIndex = 10000;
    box.appendChild(canvas);
    map.getContainer().appendChild(box);

    //
    self.ctx = canvas.getContext('2d');

    // draw it
    self._draw();

    this._Event();

    return box;
};

DrawScale.prototype._Event = function () {
    var self = this;
    var canvas = self.ctx.canvas;

    var canDrag = false;
    var mousePos = {
        x: 0,
        y: 0
    };
    var tarPos = {
        // x: 0,
        y: 0,
        name: null
    };

    canvas.addEventListener('mouseenter', function () {
        self.showHandle = true;
        self._draw();
    });

    canvas.addEventListener('mouseleave', function () {
        self.showHandle = false;
        self._draw();
    });

    canvas.addEventListener('mousedown', function (e) {
        var tar = self.hoveredHandle;
        if (tar) {
            mousePos.x = e.pageX;
            mousePos.y = e.pageY;
            var handleName = 'handle' + tar.name + 'Pos';
            tarPos.name = handleName;
            tarPos.y = self[handleName].y;
            canDrag = true;
        }
    });

    window.addEventListener('mousemove', function (e) {
        self.point.x = e.offsetX;
        self.point.y = e.offsetY;
        if (canDrag) {
            var desY = e.pageY - mousePos.y;
            self[tarPos.name].y = tarPos.y + desY;

            // set max and min
            var val = tarPos.y + desY;
            var max = self[tarPos.name].yMax;
            var min = self[tarPos.name].yMin;
            val = val > max ? max : val;
            val = val < min ? min : val;
            self[tarPos.name].y = val;
            // set max and min
            if (tarPos.name === 'handleStartPos') {
                self.handleEndPos.yMin = val;
            }
            if (tarPos.name === 'handleEndPos') {
                self.handleStartPos.yMax = val;
            }
            //
            e.preventDefault();
        }
        self._draw();
    });

    window.addEventListener('mouseup', function (e) {
        if (canDrag) {
            self.changeFn && self.changeFn(self.handleStartPos.val, self.handleEndPos.val);
            canDrag = false;
        }
    });
};

DrawScale.prototype._draw = function () {
    var self = this;
    var ctx = self.ctx;

    if (!ctx) {
        return;
    }

    // clear
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    self.hoveredHandle = null;

    // draw gradient
    var gradientOffsetLeft = 5;
    var gradientOffsetTop = self.offsetTop;
    var gradientWidth = 10;
    var gradientHeight = self.drawHeight;

    var tempColor;
    if (self.colors === 'default') {
        tempColor = self.defaultColors;
    } else {
        tempColor = self.colors;
    }
    var gradient = ctx.createLinearGradient(gradientOffsetLeft, gradientOffsetTop, gradientWidth, gradientHeight);
    var steps = gradientHeight / (tempColor.length - 1);
    if (self.colors instanceof Array || self.colors === 'default') {
        for (var i = 0; i < tempColor.length; i++) {
            var present = i * steps / self.height;
            gradient.addColorStop(present, tempColor[i]);
        }
    } else if (typeof (self.colors) === 'object') {
        for (var i in self.colors) {
            gradient.addColorStop(i, self.colors[i]);
        }
    }
    ctx.fillStyle = ctx.strokeStyle = gradient;
    ctx.fillRect(gradientOffsetLeft, gradientOffsetTop, gradientWidth, gradientHeight);
    // gradient end

    var startValOrigin = (self.handleStartPos.y - gradientOffsetTop) / gradientHeight * self.max | 0;
    var startVal = self.handleStartPos.val = startValOrigin + self.min;
    var endVal = self.handleEndPos.val = (self.handleEndPos.y - gradientOffsetTop) / gradientHeight * self.max | 0;

    // draw text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var textLeft = gradientOffsetLeft + gradientWidth + 5;
    ctx.fillText('- ' + self.min, textLeft, gradientOffsetTop);
    ctx.fillText('- ' + self.max, textLeft, gradientOffsetTop + gradientHeight);

    // draw range text
    ctx.save();
    ctx.fillStyle = 'grey';
    if (self.handleStartPos.y > gradientOffsetTop + 10) {
        ctx.fillText('- ' + startVal, textLeft, self.handleStartPos.y);
    }
    if (self.handleEndPos.y < gradientOffsetTop + gradientHeight - 10) {
        ctx.fillText('- ' + endVal, textLeft, self.handleEndPos.y);
    }
    ctx.restore();

    // draw handle
    if (self.showHandle) {
        drawTips({
            sup: self,
            name: 'Start',
            ctx: ctx,
            left: gradientOffsetLeft + gradientWidth,
            right: ctx.canvas.width - 5,
            top: self.handleStartPos.y,
            text: startVal
        });

        drawTips({
            sup: self,
            name: 'End',
            ctx: ctx,
            left: gradientOffsetLeft + gradientWidth,
            right: ctx.canvas.width - 5,
            top: self.handleEndPos.y,
            text: endVal
        });
    }

    // draw grey area
    ctx.save();
    ctx.fillStyle = '#ADABAB';
    var greyLeft = gradientOffsetLeft;
    var greyWidth = gradientWidth;
    ctx.fillRect(greyLeft, gradientOffsetTop, greyWidth, self.handleStartPos.y - self.offsetTop);
    ctx.fillRect(greyLeft, self.handleEndPos.y, greyWidth, gradientHeight - self.handleEndPos.y + self.offsetTop);
    ctx.restore();

    // hover
    if (self.hoveredHandle) {
        ctx.canvas.style.cursor = 'pointer';
    } else {
        ctx.canvas.style.cursor = 'default';
    }

};

function drawTips(obj) {
    // draw handle
    var hdlMid = obj.left;
    var hdlRight = obj.right;
    var hdlTop = obj.top;
    var ctx = obj.ctx;
    ctx.beginPath();
    ctx.moveTo(hdlMid + 8, hdlTop - 7);
    ctx.lineTo(hdlRight, hdlTop - 7);
    ctx.lineTo(hdlRight, hdlTop + 7);
    ctx.lineTo(hdlMid + 8, hdlTop + 7);
    ctx.lineTo(hdlMid, hdlTop);
    ctx.fill();

    // isHover
    var isHover = ctx.isPointInPath(obj.sup.point.x, obj.sup.point.y);
    if (isHover) {
        obj.sup.hoveredHandle = obj;
    }

    // add text
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText(obj.text, hdlMid + 8, hdlTop);
    ctx.restore();
}
