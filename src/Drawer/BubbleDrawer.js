/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function BubbleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(BubbleDrawer, Drawer);

BubbleDrawer.prototype.drawMap = function () {

    var data = this.getLayer().getData();

    var ctx = this.getCtx();

    ctx.save();

    var drawOptions = this.getDrawOptions();

    if (drawOptions.globalCompositeOperation) {
        ctx.globalCompositeOperation = drawOptions.globalCompositeOperation;
    }

    ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';
    ctx.strokeStyle = drawOptions.strokeStyle;
    ctx.lineWidth = drawOptions.lineWidth || 1;

    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        var size = this.getRadius(item.count);
        ctx.beginPath();
        ctx.arc(item.px, item.py, size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        if (drawOptions.strokeStyle) {
            ctx.stroke();
        }
    }

    ctx.restore();
}

BubbleDrawer.prototype.getRadius = function (val) {

    var size = 1;
    var splitList = this.splitList;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined
        || splitList[i].start !== undefined
        && val >= splitList[i].start)
        && (splitList[i].end === undefined
        || splitList[i].end !== undefined && val < splitList[i].end)) {
            size = splitList[i].size;
            break;
        }
    }

    return size;

};

// BubbleDrawer.prototype.drawDataRange = function () {
//     var canvas = this.getMapv().getDataRangeCtrol().getContainer();
//     canvas.width = 100;
//     canvas.height = 190;
//     canvas.style.width = '100px';
//     canvas.style.height = '190px';
//     var ctx = canvas.getContext('2d');
//     ctx.fillStyle = this.getDrawOptions().fillStyle || 'rgba(50, 50, 200, 0.8)';
//     var splitList = this.splitList;
//
//     for (var i = 0; i < splitList.length; i++) {
//         ctx.beginPath();
//         ctx.arc(15, i * 25 + 20, splitList[i].radius, 0, Math.PI * 2, false);
//         var startText = splitList[i].start || '~';
//         var endText = splitList[i].end || '~';
//         var text =  startText + ' - ' + endText;
//         ctx.fillText(text, 25, i * 25 + 25);
//         ctx.closePath();
//         ctx.fill();
//     }
// };
