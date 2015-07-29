/**
 * @file 按颜色分类绘制方法
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function CategoryDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(CategoryDrawer, Drawer);

CategoryDrawer.prototype.drawMap = function () {

    var data = this.getLayer().getData();
    var ctx = this.getCtx();


    var drawOptions = this.getDrawOptions();

    ctx.strokeStyle = drawOptions.strokeStyle;

    var radius = this.getRadius();
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        ctx.beginPath();
        ctx.moveTo(item.px, item.py);
        ctx.fillStyle = this.dataRange.getCategoryColor(item.count);
        ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

};

// CategoryDrawer.prototype.drawDataRange = function () {
//     var canvas = this.getMapv().getDataRangeCtrol().getContainer();
//     canvas.width = 80;
//     canvas.height = 190;
//     canvas.style.width = "80px";
//     canvas.style.height = "190px";
//
//     var ctx = canvas.getContext("2d");
//
//     var splitList = this.splitList;
//
//     var i = 0;
//     for (var key in splitList) {
//         ctx.fillStyle = splitList[key];
//         ctx.beginPath();
//         ctx.arc(15, i * 25 + 15, 5, 0, Math.PI * 2, false);
//         ctx.closePath();
//         ctx.fill();
//         ctx.fillStyle = '#333';
//         ctx.fillText(key, 25, i * 25 + 20);
//         i++;
//     }
// };
