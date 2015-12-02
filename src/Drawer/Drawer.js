/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function Drawer(layer) {

    Class.call(this);

    this.mapv = layer._mapv;
    this.initOptions({
        layer: layer,
        map: layer.getMap(),
        ctx: null,
        mapv: null,
        animationOptions: {},
        drawOptions: {
            size: 2
        }
    });

    this.dataRange = new DataRange(layer);

    this.bindTo('ctx', layer);
    this.bindTo('animationOptions', layer);
    this.bindTo('drawOptions', layer);
    this.bindTo('mapv', layer);
    this.bindTo('map', layer);

}

util.inherits(Drawer, Class);

Drawer.prototype.beginDrawMap = function () {
    if (this.getLayer().getContext() == "2d") {
        this.beginDrawCanvasMap();
    }
};

Drawer.prototype.endDrawMap = function () {
    if (this.getLayer().getContext() == "2d") {
        this.endDrawCanvasMap();
    }
}

Drawer.prototype.beginDrawCanvasMap = function () {

    var drawOptions = this.getDrawOptions();
    var ctx = this.getCtx();
    var pixelRatio = util.getPixelRatio(ctx);

    ctx.save();

    ctx.scale(pixelRatio, pixelRatio);

    var property = [
        'globalCompositeOperation',
        'shadowColor',
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'globalAlpha',
        'fillStyle',
        'strokeStyle',
        'lineWidth',
        'lineCap',
        'lineJoin',
        'lineWidth',
        'miterLimit'
    ];

    for (var i = 0; i < property.length; i++) {
        if (drawOptions[property[i]]) {
            ctx[property[i]] = drawOptions[property[i]];
        }
    }

}

Drawer.prototype.endDrawCanvasMap = function () {
    var ctx = this.getCtx();
    ctx.restore();
}

Drawer.prototype.drawOptions_changed = function () {

    var drawOptions = this.getDrawOptions();
    if (drawOptions && drawOptions.splitList) {
        this.splitList = drawOptions.splitList;
    } else {
        this.generalSplitList();
    }

};

Drawer.prototype.colors = [
    'rgba(17, 102, 252, 0.8)',
    'rgba(52, 139, 251, 0.8)',
    'rgba(110, 176, 253, 0.8)',
    'rgba(255, 241, 193, 0.8)',
    'rgba(255, 146, 149, 0.8)',
    'rgba(253, 98, 104, 0.8)',
    'rgba(255, 0, 0, 0.8)',
    'rgba(255, 51, 61, 0.8)'
];

Drawer.prototype.generalSplitList = function () {
    var dataRange = this.getLayer().getDataRange();
    var splitNum = Math.ceil((dataRange.max - dataRange.min) / 7);
    var index = dataRange.min;
    this.splitList = [];
    var radius = 1;
    while (index < dataRange.max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            size: radius,
            color: this.colors[radius - 1]
        });
        index += splitNum;
        radius++;
    }
};

Drawer.prototype.getRadius = function () {
    var zoom = this.getMap().getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);

    var drawOptions = this.getDrawOptions();
    var radius = parseFloat(drawOptions.size) || 13;
    var unit = drawOptions.unit || 'px';
    if (unit === 'm') {
        radius = radius / zoomUnit;
    } else {
        radius = radius;
    }

    if (drawOptions.minPxSize && radius < drawOptions.minPxSize) {
        radius = drawOptions.minPxSize;
    }

    return radius;
}
