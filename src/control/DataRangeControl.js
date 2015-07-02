/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 * legend控件
 */

function DataRangeControl(){
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

DataRangeControl.prototype = new BMap.Control();

DataRangeControl.prototype.initialize = function(map){
    var canvas = this.canvas = document.createElement("canvas");
    canvas.style.background = "#fff";
    canvas.style.boxShadow = "rgba(0,0,0,0.2) 0 0 4px 2px";
    canvas.style.border = "1px solid #999999";
    canvas.style.borderRadius = "4px";
    // 添加DOM元素到地图中
    map.getContainer().appendChild(canvas);
    // 将DOM元素返回
    return canvas;
}

DataRangeControl.prototype.getContainer = function(map){
    return this.canvas;
}
