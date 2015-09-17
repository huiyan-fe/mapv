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
    var data = this.getLayer().getData();
    var ctx = this.getCtx();
    var drawOptions = this.getDrawOptions();

    ctx.beginPath();

    var radius = this.getRadius();

    var dataType = this.getLayer().getDataType();
    ctx.fill();

    this.endDrawMap();
}

