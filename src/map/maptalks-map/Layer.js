/**
 * MapV for maptalks.js (https://github.com/maptalks/maptalks.js)
 * @author fuzhenn / https://github.com/fuzhenn
 */
import * as maptalks from 'maptalks';
import BaseLayer from "../BaseLayer";
import clear from "../../canvas/clear";
import DataSet from "../../data/DataSet";
import TWEEN from "../../utils/Tween";

let Layer;
if (typeof(maptalks) !== 'undefined') {
    Layer = class extends maptalks.Layer{

        constructor(id, dataSet, options) {
            super(id, options);
            this.options_ = options;
            this.dataSet = dataSet;
            this._initBaseLayer(options);
        }
    
        _initBaseLayer(options) {
            const self = this;
            const baseLayer = this.baseLayer = new BaseLayer(null, this.dataSet, options);
            self.init(options);
            baseLayer.argCheck(options);
        } 
    
        clickEvent(e) {
            if (!this.baseLayer) {
                return;
            }
            const pixel = e.containerPoint;
            this.baseLayer.clickEvent(pixel, e.domEvent);
        }
    
        mousemoveEvent(e) {
            if (!this.baseLayer) {
                return;
            }
            const pixel = e.containerPoint;
            this.baseLayer.mousemoveEvent(pixel, e.domEvent);
        }
    
        getEvents() {
            return {
                'click' : this.clickEvent,
                'mousemove' : this.mousemoveEvent
            };
        }
        
        init(options) {
    
            const base = this.baseLayer;
    
            base.options = options;
    
            base.initDataRange(options);
    
            base.context = base.options.context || '2d';
    
            base.initAnimator();
        }
    
        addAnimatorEvent() {
            this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
            this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
        }
    
    }
    
    class LayerRenderer extends maptalks.renderer.CanvasRenderer {
    
        needToRedraw() {
            const base = this.layer.baseLayer;
            if (base.isEnabledTime()) {
                return true;
            }
            return super.needToRedraw();
        }
    
        draw() {
            const base = this.layer.baseLayer;
            if (!this.canvas || !base.isEnabledTime() || this._shouldClear) {
                this.prepareCanvas();
                this._shouldClear = false;
            }
            this._update(this.gl || this.context, this._mapvFrameTime);
            delete this._mapvFrameTime;
            this.completeRender();
        }
    
        drawOnInteracting() {
            this.draw();
            this._shouldClear = false;
        }
    
        onSkipDrawOnInteracting() {
            this._shouldClear = true;
        }
    
        _canvasUpdate(time) {
            this.setToRedraw();
            this._mapvFrameTime = time;
        }
    
        _update(context, time) {
            if (!this.canvas) {
                return;
            }
    
            const self = this.layer.baseLayer;
    
            const animationOptions = self.options.animation;
    
            const map = this.getMap();
    
            if (self.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return;
                }
                if (self.context == '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }
    
            if (self.context == '2d') {
                for (const key in self.options) {
                    context[key] = self.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }
    
            let scale = 1;
            if (self.context === '2d' && self.options.draw !== 'heatmap') {
                //in heatmap.js, devicePixelRatio is being mulitplied independently
                scale = self.canvasLayer.devicePixelRatio;
            }
    
            //reuse to save coordinate instance creation
            const coord = new maptalks.Coordinate(0, 0);
            const dataGetOptions = {
                fromColumn: self.options.coordType === 'bd09mc' ? 'coordinates_mercator' : 'coordinates',
                transferCoordinate: function(coordinate) {
                    coord.x = coordinate[0];
                    coord.y = coordinate[1];
                    const r = map.coordToContainerPoint(coord)._multi(scale).toArray();
                    return r;
                }
            }
    
            if (time !== undefined) {
                dataGetOptions.filter = function(item) {
                    const trails = animationOptions.trails || 10;
                    if (time && item.time > (time - trails) && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
    
            // get data from data set
            const data = self.dataSet.get(dataGetOptions);
    
            self.processData(data);
    
            if (self.options.unit == 'm') {
                if (self.options.size) {
                    self.options._size = self.options.size / zoomUnit;
                }
                if (self.options.width) {
                    self.options._width = self.options.width / zoomUnit;
                }
                if (self.options.height) {
                    self.options._height = self.options.height / zoomUnit;
                }
            } else {
                self.options._size = self.options.size;
                self.options._height = self.options.height;
                self.options._width = self.options.width;
            }
    
            const zeroZero = new maptalks.Point(0, 0);
            //screen position of the [0, 0] point
            const zeroZeroScreen = map._pointToContainerPoint(zeroZero)._multi(scale);
            self.drawContext(context, data, self.options, zeroZeroScreen);
    
            //console.timeEnd('draw');
    
            //console.timeEnd('update')
            self.options.updateCallback && self.options.updateCallback(time);
        }
    
        createCanvas() {
            if (this.canvas) {
                return;
            }
            const map = this.getMap();
            const size = map.getSize();
            const r = maptalks.Browser.retina ? 2 : 1,
                w = r * size.width,
                h = r * size.height;
            this.canvas = maptalks.Canvas.createCanvas(w, h, map.CanvasClass);
            const mapvContext = this.layer.baseLayer.context;
            if (mapvContext === '2d') {
                this.context = this.canvas.getContext('2d');
                if (this.layer.options['globalCompositeOperation']) {
                    this.context.globalCompositeOperation = this.layer.options['globalCompositeOperation'];
                }
            } else {
                const attributes = {
                    'alpha': true,
                    'preserveDrawingBuffer' : true,
                    'antialias' : false
                };
                this.gl = this.canvas.getContext('webgl', attributes);
            }
    
            this.onCanvasCreate();
    
            this._bindToMapv();
    
            this.layer.fire('canvascreate', {
                'context' : this.context,
                'gl' : this.gl
            });
        }
    
        _bindToMapv() {
            //some bindings needed by mapv baselayer
            const base = this.layer.baseLayer;
            this.devicePixelRatio = maptalks.Browser.retina ? 2 : 1;
            base.canvasLayer = this;
            base._canvasUpdate = this._canvasUpdate.bind(this);
            base.getContext = function () {
                const renderer = self.getRenderer();
                return renderer.gl || renderer.context;
            };
        }
    }
    
    Layer.registerRenderer('canvas', LayerRenderer);
}

export default Layer;
