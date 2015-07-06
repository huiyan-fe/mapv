/**
 * @file 选址绘制类型控件
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

/* globals util BMap BMAP_ANCHOR_TOP_LEFT BMAP_ANCHOR_TOP_RIGHT*/

util.addCssByStyle(
    [
        '#MapvDrawTypeControl { list-style:none; position:absolute; left:10px; top:10px; padding:0; margin:0; }',
        '#MapvDrawTypeControl li{ padding:0; margin:0; cursor:pointer; margin:1px 0;',
        'color:#fff; padding:5px; background:rgba(0, 0, 0, 0.5); }',
        '#MapvDrawTypeControl li.current{ background:rgba(0, 0, 255, 0.5); }'
    ].join('\n')
);

function DrawTypeControl(options) {
    options = options || {};
    // console.log('@@@@@@', options)
    this.mapv = options.mapv;
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

DrawTypeControl.prototype = new BMap.Control();

DrawTypeControl.prototype.initialize = function (map) {
    var ul = this.ul = document.createElement('ul');
    // console.log(this.mapv.options.drawOptions)
    // var drawTypes = {
    //     simple: '普通打点',
    //     bubble: '普通打点',
    //     choropleth: '普通打点',
    //     density: '普通打点',
    //     heatmap: '普通打点',
    //     category: '普通打点',
    //     intensity: '普通打点'
    // };

<<<<<<< HEAD
    // get the drawTypes from options by Mofei
    var drawTypes = this.mapv.options.drawOptions;

    ul.setAttribute('id', 'MapvDrawTypeControl');

    for (var key in drawTypes) {
        var li = document.createElement('li');
        if (this.mapv.options.drawType === key) {
            li.className = 'current';
        }
        li.setAttribute('drawType', key);
        li.innerHTML = key;
        ul.appendChild(li);
    }

=======

    ul.setAttribute('id', 'MapvDrawTypeControl');

>>>>>>> bc51f417d86bd5e698effebedbdf4cfcfb5cadf3
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
<<<<<<< HEAD
            me.mapv.setOptions({
                drawType: drawType
            });
=======
            me._layer.setDrawType(drawType);
>>>>>>> bc51f417d86bd5e698effebedbdf4cfcfb5cadf3
        }
    });

    // 添加DOM元素到地图中
    map.getContainer().appendChild(ul);
    // 将DOM元素返回
    return ul;

};

DrawTypeControl.prototype.getContainer = function () {
    return this.ul;
};
<<<<<<< HEAD
=======

DrawTypeControl.prototype.showLayer = function (layer) {
    this._layer = layer;
    // get the drawTypes from options by Mofei
    var ul = this.ul;
    ul.innerHTML = "";
    var drawTypes = layer.options.drawOptions;
    for (var key in drawTypes) {
        var li = document.createElement('li');
        if (layer.options.drawType === key) {
            li.className = 'current';
        }
        li.setAttribute('drawType', key);
        li.innerHTML = key;
        ul.appendChild(li);
    }

}
>>>>>>> bc51f417d86bd5e698effebedbdf4cfcfb5cadf3
