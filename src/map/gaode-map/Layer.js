/**
 * MapV for AMap
 * @author sakitam-fdd - https://github.com/sakitam-fdd
 */

import BaseLayer from "../BaseLayer";
import clear from "../../canvas/clear";
import DataSet from "../../data/DataSet";
import TWEEN from "../../utils/Tween";

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (width, height, Canvas) => {
    if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas
    } else {
        // create a new canvas instance in node.js
        // the canvas class needs to have a default constructor without any parameter
        return new Canvas(width, height)
    }
};

class Layer extends BaseLayer {
    constructor(map = null, dataSet, options) {
        super(map, dataSet, options);

        this.options = options;

        /**
         * internal
         * @type {{canvas: null, devicePixelRatio: number}}
         */
        this.canvasLayer = {
            canvas: null,
            devicePixelRatio: window.devicePixelRatio
        };

        /**
         * canvas layer
         * @type {null}
         * @private
         */
        this.layer_ = null;

        this.initDataRange(options);
        this.initAnimator();
        this.onEvents()
        map.on('complete', function () {
            this.init(map, options);
            this.argCheck(options);
        }, this);
    }

    /**
     * init mapv layer
     * @param map
     * @param options
     */
    init(map, options) {
        if (map) {
            this.map = map;
            this.context = this.options.context || '2d';
            this.getCanvasLayer();
        } else {
            throw new Error('not map object')
        }
    }

    /**
     * update layer
     * @param time
     * @private
     */
    _canvasUpdate(time) {
        this.render(this.canvasLayer.canvas, time);
    }

    /**
     * render layer
     * @param canvas
     * @param time
     * @returns {Layer}
     */
    render(canvas, time) {
        if (!canvas) return;
        const map = this.map;
        const context = canvas.getContext(this.context);
        const animationOptions = this.options.animation;
        if (this.isEnabledTime()) {
            if (time === undefined) {
                clear(context);
                return this;
            }
            if (this.context === '2d') {
                context.save();
                context.globalCompositeOperation = 'destination-out';
                context.fillStyle = 'rgba(0, 0, 0, .1)';
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.restore();
            }
        } else {
            clear(context);
        }

        if (this.context === '2d') {
            for (const key in this.options) {
                context[key] = this.options[key];
            }
        } else {
            context.clear(context.COLOR_BUFFER_BIT);
        }
        const dataGetOptions = {
            transferCoordinate: function (coordinate) {
                const _pixel = map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1]));
                return [_pixel['x'], _pixel['y']];
            }
        };

        if (time !== undefined) {
            dataGetOptions.filter = function (item) {
                const trails = animationOptions.trails || 10;
                if (time && item.time > (time - trails) && item.time < time) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        const data = this.dataSet.get(dataGetOptions);
        this.processData(data);

        if (this.options.unit === 'm') {
            if (this.options.size) {
                this.options._size = this.options.size / zoomUnit;
            }
            if (this.options.width) {
                this.options._width = this.options.width / zoomUnit;
            }
            if (this.options.height) {
                this.options._height = this.options.height / zoomUnit;
            }
        } else {
            this.options._size = this.options.size;
            this.options._height = this.options.height;
            this.options._width = this.options.width;
        }

        this.drawContext(context, new DataSet(data), this.options, {x: 0, y: 0});
        this.options.updateCallback && this.options.updateCallback(time);
        return this
    }

    /**
     * get canvas layer
     */
    getCanvasLayer() {
        if (!this.canvasLayer.canvas && !this.layer_) {
            const canvas = this.canvasFunction();
            const bounds = this.map.getBounds();
            this.layer_ = new AMap.CanvasLayer({
                canvas: canvas,
                bounds: this.options.bounds || bounds,
                zooms: this.options.zooms || [0, 22],
            });
            this.layer_.setMap(this.map);
            this.map.on('mapmove', this.canvasFunction, this);
            this.map.on('zoomchange', this.canvasFunction, this);
        }
    }

    /**
     * canvas constructor
     * @returns {*}
     */
    canvasFunction() {
        const [width, height] = [this.map.getSize().width, this.map.getSize().height]
        if (!this.canvasLayer.canvas) {
            this.canvasLayer.canvas = createCanvas(width, height)
        } else {
            this.canvasLayer.canvas.width = width;
            this.canvasLayer.canvas.height = height;
            const bounds = this.map.getBounds();
            if (this.layer_) {
                this.layer_.setBounds(this.options.bounds || bounds);
            }
        }
        this.render(this.canvasLayer.canvas)
        return this.canvasLayer.canvas
    }

    /**
     * remove layer
     */
    removeLayer() {
        if (!this.map) return;
        this.unEvents();
        this.map.removeLayer(this.layer_);
        delete this.map;
        delete this.layer_;
        delete this.canvasLayer.canvas;
    }

    getContext() {
        return this.canvasLayer.canvas.getContext(this.context);
    }

    /**
     * handle click event
     * @param event
     */
    clickEvent(event) {
        const pixel = event.pixel;
        super.clickEvent(pixel, event);
    }

    /**
     * handle mousemove/pointermove event
     * @param event
     */
    mousemoveEvent(event) {
        const pixel = event.pixel;
        super.mousemoveEvent(pixel, event);
    }

    /**
     * add animator event
     */
    addAnimatorEvent() {
        this.map.on('movestart', this.animatorMovestartEvent, this);
        this.map.on('moveend', this.animatorMoveendEvent, this);
    }

    /**
     * bind event
     */
    onEvents() {
        const map = this.map;
        this.unEvents();
        if (this.options.methods) {
            if (this.options.methods.click) {
                map.on('click', this.clickEvent, this);
            }
            if (this.options.methods.mousemove) {
                map.on('mousemove', this.mousemoveEvent, this);
            }
        }
    }

    /**
     * unbind events
     */
    unEvents() {
        const map = this.map;
        if (this.options.methods) {
            if (this.options.methods.click) {
                map.off('click', this.clickEvent, this);
            }
            if (this.options.methods.mousemove) {
                map.off('mousemove', this.mousemoveEvent, this);
            }
        }
    }
}

export default Layer