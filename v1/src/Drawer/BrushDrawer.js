/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals Drawer, util */

function BrushDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(BrushDrawer, Drawer);

BrushDrawer.prototype.drawMap = function () {

    console.time('draw brush');

    this.beginDrawMap();

    var data = this.getLayer().getData();

    var ctx = this.getCtx();


    var drawOptions = this.getDrawOptions();

    var brush = drawOptions.brush || 'basic';

    for (var i = 0, len = data.length; i < len; i++) {
        var geo = data[i].pgeo;
        if (geo.length <= 0) {
            continue;
        }
        brushes[brush](ctx, geo, drawOptions);
    }

    this.endDrawMap();

    console.timeEnd('draw brush');
}
