/**
 * @file 选址绘制类型控件
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals util BMap BMAP_ANCHOR_TOP_LEFT BMAP_ANCHOR_TOP_RIGHT*/

util.addCssByStyle(
    [
        '#MapvDrawTypeControl { list-style:none; position:absolute; right:0px; top:0px; bottom:0px; padding:0; margin:0;',
        'border-radius: 5px; overflow: hidden; border: 1px solid rgb(153, 153, 153); box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 4px 2px;}',
        '#MapvDrawTypeControl li{ padding:0; margin:0; cursor:pointer; ',
        'color:#333; padding:5px; background:rgba(255, 255, 255, 1); border-bottom: 1px solid #aaa;}',
        '#MapvDrawTypeControl li.current{ background:#999; color:#fff;}'
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
    this.defaultAnchor = this.getDrawTypeControlOptions().anchor || BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = this.getDrawTypeControlOptions().offset || new BMap.Size(10, 10);
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

            if (me.getDrawTypeControlOptions().drawOptions && me.getDrawTypeControlOptions().drawOptions[drawType]) {
                me.layer.setDrawOptions(me.getDrawTypeControlOptions().drawOptions[drawType]);
            }

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
    
    if (this.getDrawTypeControlOptions().anchor !== undefined) {
        this.setAnchor(this.getDrawTypeControlOptions().anchor);
    }

    if (this.getDrawTypeControlOptions().offset !== undefined) {
        this.setOffset(this.getDrawTypeControlOptions().offset);
    }

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
