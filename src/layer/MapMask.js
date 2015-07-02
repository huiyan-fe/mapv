/**
 * 一直覆盖在当前地图视野的覆盖物
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param 
 * {
 *     map 地图实例对象
 *     elementTag 覆盖物容器的标签类型，默认是div，我们这canvas用的多
 * }
 */ 

function MapMask(options){
    this.options = options || {};
    this.initElement();
    this._map = options.map;
    this.show();
}

MapMask.prototype = new BMap.Overlay();
MapMask.prototype.initialize = function(map){
    this._map = map;
    var elementTag = this.options.elementTag || "div";
    var element = this.element = document.createElement(elementTag);
    var size = map.getSize();
    element.width = size.width;
    element.height = size.height;
    element.style.cssText = "position:absolute;"
                            + "left:0;" 
                            + "top:0;"
                            + "width:" + size.width + "px;"
                            + "height:" + size.height + "px";
    map.getPanes().labelPane.appendChild(this.element);
    return this.element;
}

MapMask.prototype.initElement = function(map){
}

MapMask.prototype.draw = function(){
    var map = this._map;
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
    this.element.style.left = pixel.x + "px";
    this.element.style.top = pixel.y + "px";
    this.dispatchEvent('draw');
}

MapMask.prototype.getContainer = function(){
    return this.element;
}

MapMask.prototype.show = function(){
    this._map.addOverlay(this);
}

MapMask.prototype.hide = function(){
    this._map.removeOverlay(this);
}

