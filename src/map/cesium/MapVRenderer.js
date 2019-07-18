import BaseLayer from "../BaseLayer";
import DataSet from "../../data/DataSet";


export class MapVRenderer extends BaseLayer {

    /**
     * Creates an instance of MapVRenderer.
     * @param {*} viewer cesium viewer
     * @param {*} dataset mapv dataset
     * @param {*} option mapvOptions
     * @param {*} mapVLayer
     * @memberof MapVRenderer
     */
    constructor(viewer, dataset, option, mapVLayer) {
        super(viewer, dataset, option)
        if (!BaseLayer) {
            return;
        }
        this.map = viewer,
            this.scene = viewer.scene,
            this.dataSet = dataset;
        option = option || {},
            this.init(option),
            this.argCheck(option),
            this.initDevicePixelRatio(),
            this.canvasLayer = mapVLayer,
            this.stopAniamation = !1,
            this.animation = option.animation,
            this.clickEvent = this.clickEvent.bind(this),
            this.mousemoveEvent = this.mousemoveEvent.bind(this),
            this.bindEvent()
    }
    initDevicePixelRatio() {
        this.devicePixelRatio = window.devicePixelRatio || 1
    }
    clickEvent(t) {
        var e = t.point;
        super.clickEvent(e, t)
    }
    mousemoveEvent(t) {
        var e = t.point;
        super.mousemoveEvent(e, t)
    }
    addAnimatorEvent() { }
    animatorMovestartEvent() {
        var t = this.options.animation;
        this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start)
    }
    animatorMoveendEvent() {
        this.isEnabledTime() && this.animator
    }
    bindEvent() {
        this.map;
        this.options.methods && (this.options.methods.click,
            this.options.methods.mousemove)
    }
    unbindEvent() {
        var t = this.map;
        this.options.methods && (this.options.methods.click && t.off("click", this.clickEvent),
            this.options.methods.mousemove && t.off("mousemove", this.mousemoveEvent))
    }
    getContext() {
        return this.canvasLayer.canvas.getContext(this.context)
    }
    init(t) {
        this.options = t,
            this.initDataRange(t),
            this.context = this.options.context || "2d",
            this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex(this.options.zIndex),
            this.initAnimator()
    }
    _canvasUpdate(t) {
        this.map;
        var e = this.scene;
        if (this.canvasLayer && !this.stopAniamation) {
            var i = this.options.animation
                , n = this.getContext();
            if (this.isEnabledTime()) {
                if (void 0 === t)
                    return void this.clear(n);
                "2d" === this.context && (n.save(),
                    n.globalCompositeOperation = "destination-out",
                    n.fillStyle = "rgba(0, 0, 0, .1)",
                    n.fillRect(0, 0, n.canvas.width, n.canvas.height),
                    n.restore())
            } else
                this.clear(n);
            if ("2d" === this.context)
                for (var o in this.options)
                    n[o] = this.options[o];
            else
                n.clear(n.COLOR_BUFFER_BIT);
            var a = {
                transferCoordinate: function (t) {
                    var i = Cesium.Cartesian3.fromDegrees(t[0], t[1])
                        , n = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, i);
                    return void 0 == n ? [-1, -1] : [n.x, n.y]
                }
            };
            void 0 !== t && (a.filter = function (e) {
                var n = i.trails || 10;
                return !!(t && e.time > t - n && e.time < t)
            }
            );
            var c = this.dataSet.get(a);
            this.processData(c),
                "m" == this.options.unit && this.options.size,
                this.options._size = this.options.size;
            var h = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, Cesium.Cartesian3.fromDegrees(0, 0));
            this.drawContext(n, new DataSet(c), this.options, h),
                this.options.updateCallback && this.options.updateCallback(t)
        }
    }
    updateData(t, e) {
        var i = t;
        i && i.get && (i = i.get()),
            void 0 != i && this.dataSet.set(i),
            super.update({
                options: e
            })
    }
    addData(t, e) {
        var i = t;
        t && t.get && (i = t.get()),
            this.dataSet.add(i),
            this.update({
                options: e
            })
    }
    getData() {
        return this.dataSet
    }
    removeData(t) {
        if (this.dataSet) {
            var e = this.dataSet.get({
                filter: function (e) {
                    return null == t || "function" != typeof t || !t(e)
                }
            });
            this.dataSet.set(e),
                this.update({
                    options: null
                })
        }
    }
    clearData() {
        this.dataSet && this.dataSet.clear(),
            this.update({
                options: null
            })
    }
    draw() {
        this.canvasLayer.draw()
    }
    clear(t) {
        t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height)
    }
}