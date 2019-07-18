import { MapVRenderer } from "./MapVRenderer";

var mapVLayer;
if (typeof (Cesium) !== 'undefined') {
    var defIndex = 0;
    var r = Cesium;
    class MapVLayer {
        /**
         *Creates an instance of MapVLayer.
         * @param {*} viewer
         * @param {*} dataset
         * @param {*} options
         * @param {*} container default viewer.container
         * @memberof MapVLayer
         */
        constructor(viewer, dataset, options, container) {
            this.map = viewer,
                this.scene = viewer.scene,
                this.mapvBaseLayer = new MapVRenderer(viewer, dataset, options, this),
                this.mapVOptions = options,
                this.initDevicePixelRatio(),
                this.canvas = this._createCanvas(),
                this.render = this.render.bind(this);
            if (container) {
                this.container = container;
            } else {
                const inner = viewer.container.querySelector('.cesium-viewer-cesiumWidgetContainer')
                this.container = inner ? inner : viewer.container;
            }
            this.addInnerContainer();

            // void 0 != container ? (this.container = container,
            //     container.appendChild(this.canvas)) : (this.container = viewer.container,
            //         this.addInnerContainer()),
            this.bindEvent();
            this._reset();
        }
        initDevicePixelRatio() {
            this.devicePixelRatio = window.devicePixelRatio || 1
        }
        addInnerContainer() {
            this.container.appendChild(this.canvas)
        }
        bindEvent() {
            var that = this;

            this.innerMoveStart = this.moveStartEvent.bind(this);
            this.innerMoveEnd = this.moveEndEvent.bind(this);
            this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this);
            this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);

            var t = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

            t.setInputAction(function (t) {
                that.innerMoveEnd()
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            t.setInputAction(function (t) {
                that.innerMoveEnd()
            }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
            this.handler = t;
        }
        unbindEvent() {
            this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this);
            this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this);
            this.scene.postRender.removeEventListener(this._reset, this);
            this.handler && (this.handler.destroy(), this.handler = null)
        }
        moveStartEvent() {
            if (this.mapvBaseLayer) {
                this.mapvBaseLayer.animatorMovestartEvent();
                this.scene.postRender.addEventListener(this._reset, this);
            }
        }
        moveEndEvent() {
            if (this.mapvBaseLayer) {
                this.scene.postRender.removeEventListener(this._reset, this),
                    this.mapvBaseLayer.animatorMoveendEvent();
                this._reset();
            }
        }
        zoomStartEvent() {
            this._unvisiable()
        }
        zoomEndEvent() {
            this._unvisiable()
        }
        addData(t, e) {
            void 0 != this.mapvBaseLayer && this.mapvBaseLayer.addData(t, e)
        }
        updateData(t, e) {
            void 0 != this.mapvBaseLayer && this.mapvBaseLayer.updateData(t, e)
        }
        getData() {
            return this.mapvBaseLayer && (this.dataSet = this.mapvBaseLayer.getData()),
                this.dataSet
        }
        removeData(t) {
            void 0 != this.mapvBaseLayer && this.mapvBaseLayer && this.mapvBaseLayer.removeData(t)
        }
        removeAllData() {
            void 0 != this.mapvBaseLayer && this.mapvBaseLayer.clearData()
        }
        _visiable() {
            return this.canvas.style.display = "block",
                this
        }
        _unvisiable() {
            return this.canvas.style.display = "none",
                this
        }
        _createCanvas() {
            var t = document.createElement("canvas");
            t.id = this.mapVOptions.layerid || "mapv" + defIndex++ ,
                t.style.position = "absolute",
                t.style.top = "0px",
                t.style.left = "0px",
                t.style.pointerEvents = "none",
                t.style.zIndex = this.mapVOptions.zIndex || 0,
                t.width = parseInt(this.map.canvas.width),
                t.height = parseInt(this.map.canvas.height),
                t.style.width = this.map.canvas.style.width,
                t.style.height = this.map.canvas.style.height;
            var e = this.devicePixelRatio;
            return "2d" == this.mapVOptions.context && t.getContext(this.mapVOptions.context).scale(e, e),
                t
        }
        _reset() {
            this.resizeCanvas();
            this.fixPosition();
            this.onResize();
            this.render();
        }
        draw() {
            this._reset()
        }
        show() {
            this._visiable()
        }
        hide() {
            this._unvisiable()
        }
        destroy() {
            this.remove()
        }
        remove() {
            void 0 != this.mapvBaseLayer && (this.removeAllData(),
                this.mapvBaseLayer.clear(this.mapvBaseLayer.getContext()),
                this.mapvBaseLayer = void 0,
                this.canvas.parentElement.removeChild(this.canvas))
        }
        update(t) {
            void 0 != t && this.updateData(t.data, t.options)
        }
        resizeCanvas() {
            if (void 0 != this.canvas && null != this.canvas) {
                var t = this.canvas;
                t.style.position = "absolute",
                    t.style.top = "0px",
                    t.style.left = "0px",
                    t.width = parseInt(this.map.canvas.width),
                    t.height = parseInt(this.map.canvas.height),
                    t.style.width = this.map.canvas.style.width,
                    t.style.height = this.map.canvas.style.height
            }
        }
        fixPosition() { }
        onResize() { }
        render() {
            void 0 != this.mapvBaseLayer && this.mapvBaseLayer._canvasUpdate()
        }
    }
    mapVLayer = function (viewer, dataSet, mapVOptions, container) {
        return new MapVLayer(viewer, dataSet, mapVOptions, container);
    };
}

export default mapVLayer;