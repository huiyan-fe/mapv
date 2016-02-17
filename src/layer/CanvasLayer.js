/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param
 * {
 *     map 地图实例对象
 * }
 */

function CanvasLayer(options){
    this.options = options || {};
    this.paneName = this.options.paneName || 'labelPane';
    this.zIndex = this.options.zIndex || 0;
    this.context = this.options.context || '2d';
    this._map = options.map;
    this.show();
}

CanvasLayer.prototype = new BMap.Overlay();

CanvasLayer.prototype.initialize = function(map){
    this._map = map;
    var canvas = this.canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;"
                         + "left:0;"
                         + "top:0;"
                         + "z-index:" + this.zIndex + ";";
    this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    var that = this;
    map.addEventListener('resize', function () {
        that.adjustSize();
        that.draw();
    });
    return this.canvas;
}

CanvasLayer.prototype.adjustSize = function(){
    var size = this._map.getSize();
    var canvas = this.canvas;
    var pixelRatio;

    if (this.context == 'webgl') {
        pixelRatio = 1;
    } else {
        pixelRatio = (function(context) {
                var backingStore = context.backingStorePixelRatio ||
                            context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

                return (window.devicePixelRatio || 1) / backingStore;
            })(canvas.getContext('2d'));
    }

    canvas.width = size.width * pixelRatio;
    canvas.height = size.height * pixelRatio;
    canvas.style.width = size.width + "px";
    canvas.style.height = size.height + "px";
}

CanvasLayer.prototype.draw = function(){
    var map = this._map;
    var size = map.getSize();
    var center = map.getCenter();
    if (center) {
        var pixel = map.pointToOverlayPixel(center);
        this.canvas.style.left = pixel.x - size.width / 2 + 'px';
        this.canvas.style.top = pixel.y - size.height / 2 + 'px';
        this.dispatchEvent('draw');
        this.options.update && this.options.update.call(this);
    }
}

CanvasLayer.prototype.getContainer = function(){
    return this.canvas;
}

CanvasLayer.prototype.show = function(){
    if (!this.canvas) {
        this._map.addOverlay(this);
    }
    this.canvas.style.display = "block";
}

CanvasLayer.prototype.hide = function(){
    this.canvas.style.display = "none";
    //this._map.removeOverlay(this);
}

CanvasLayer.prototype.setZIndex = function(zIndex){
    this.canvas.style.zIndex = zIndex;
}

CanvasLayer.prototype.getZIndex = function(){
    return this.zIndex;
}
