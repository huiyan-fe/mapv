/**
 * @file 选址绘制类型控件
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals util BMap BMAP_ANCHOR_TOP_LEFT BMAP_ANCHOR_TOP_RIGHT*/

util.addCssByStyle(
    [
        '#MapvDrawTypeControl { list-style:none; position:absolute; right:0px; top:0px; bottom:0px; padding:0; margin:0; }',
        '#MapvDrawTypeControl li{ padding:0; margin:0; cursor:pointer; margin:1px 0;',
        'color:#fff; padding:5px; background:rgba(0, 0, 0, 0.5); }',
        '#MapvDrawTypeControl li.current{ background:rgba(0, 0, 255, 0.5); }'
    ].join('\n')
);

function DrawTypeControl(options) {
    Class.call(this);
    options = options || {};

    this.initOptions($.extend({
        mapv: null,
        drawTypeControlOptions: {},
        layer: null
    }, options));

    this.bindTo('drawTypeControlOptions', this.getMapv());

    // console.log('@@@@@@', options)
    this.mapv = options.mapv;
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

util.inherits(DrawTypeControl, Class);
util.inherits(DrawTypeControl, BMap.Control);

DrawTypeControl.prototype.initialize = function (map) {
    var ul = this.ul = document.createElement('ul');
    ul.setAttribute('id', 'MapvDrawTypeControl');

    var me = this;

    ul.addEventListener('click', function (e) {
        var target = e.target;
        if (target.nodeName === 'LI') {
            var parentNode = target.parentNode;
            var children = parentNode.getElementsByTagName('li');
            for (var i = 0; i < children.length; i++) {
                children[i].className = '';
            }
            var drawType = target.getAttribute('drawType');
            target.className = 'current';

            me.layer.setDrawType(drawType);

        }
    });

    this.showLayer();

    // 添加DOM元素到地图中
    map.getContainer().appendChild(ul);
    // 将DOM元素返回
    return ul;

};

DrawTypeControl.prototype.getContainer = function () {
    return this.ul;
};

DrawTypeControl.prototype.drawTypeControlOptions_changed = function () {
    this.layer = this.getDrawTypeControlOptions().layer;

    if (!this.layer) {
        return;
    }

    this.showLayer();

}

DrawTypeControl.prototype.showLayer = function () {
    if (!this.layer) {
        return;
    }
    // get the drawTypes from options by Mofei
    var ul = this.ul;
    ul.innerHTML = "";
    var drawTypes = ['simple', 'heatmap', 'density', 'bubble', 'category', 'choropleth', 'intensity', 'cluster'];
    for (var i = 0; i < drawTypes.length; i++) {
        var key = drawTypes[i];
        var li = document.createElement('li');
        if (this.layer.getDrawType() === key) {
            li.className = 'current';
        }
        li.setAttribute('drawType', key);
        li.innerHTML = key;
        ul.appendChild(li);
    }

}
