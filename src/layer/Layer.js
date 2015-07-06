/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function Layer(map, mapv, drawCbk) {
    this.ctx = null;
    this.drawCbk = drawCbk;
    this.map = map;
    this.mapv = mapv;
    var mapMask = new MapMask({
        map: map,
        elementTag: "canvas"
    });

    this.ctx = mapMask.getContainer().getContext("2d");
    var that = this;
    mapMask.addEventListener('draw', function() {
        that.draw();
    });
}

Layer.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.width = ctx.canvas.width;
    ctx.canvas.height = ctx.canvas.height;
    this.mapv.geoData.calculatePixel();
    this.drawCbk.call(this, ctx);
}
