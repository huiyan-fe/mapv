import { MapVRenderer } from "./MapVRenderer";

var mapVLayer;
if (typeof (L) !== 'undefined') {
    /**
     * @class mapVLayer
     * @classdesc MapV 图层。
     * @category Visualization MapV
     * @extends {L.Layer}
     * @param {mapv.DataSet} dataSet - MapV 图层数据集。
     * @param {Object} mapVOptions - MapV 图层参数。
     * @param {Object} options - 参数。
     * @param {string} [options.attributionPrefix] - 版权信息前缀。
     * @param {string} [options.attribution='© 2018 百度 MapV'] - 版权信息。
     * @fires mapVLayer#loaded
     */
    var MapVLayer = L.Layer.extend({

        options: {
            attributionPrefix: null,
            attribution: ''
        },

        initialize: function (dataSet, mapVOptions, options) {
            options = options || {};
            this.dataSet = dataSet || {};
            this.mapVOptions = mapVOptions || {};
            this.render = this.render.bind(this);
            L.Util.setOptions(this, options);
            if (this.options.attributionPrefix) {
                this.options.attribution = this.options.attributionPrefix + this.options.attribution;
            }

            this.canvas = this._createCanvas();
            L.stamp(this);
        },

        /**
         * @private
         * @function mapVLayer.prototype.onAdd
         * @description 添加地图图层。
         * @param {L.Map} map - 要添加的地图。
         */
        onAdd: function (map) {
            this._map = map;
            var overlayPane = this.getPane();
            var container = this.container = L.DomUtil.create("div", "leaflet-layer leaflet-zoom-animated", overlayPane);
            container.appendChild(this.canvas);
            var size = map.getSize();
            container.style.width = size.x + "px";
            container.style.height = size.y + "px";
            this.renderer = new MapVRenderer(map, this, this.dataSet, this.mapVOptions);
            this.draw();
            /**
             * @event mapVLayer#loaded
             * @description 图层添加完成之后触发。
             */
            this.fire("loaded");
        },

        // _hide: function () {
        //     this.canvas.style.display = 'none';
        // },

        // _show: function () {
        //     this.canvas.style.display = 'block';
        // },

        /**
         * @private
         * @function mapVLayer.prototype.onRemove
         * @description 删除地图图层。
         */
        onRemove: function () {
            L.DomUtil.remove(this.container);
            this.renderer.destroy();
        },

        /**
         * @function mapVLayer.prototype.addData
         * @description 追加数据。
         * @param {Object} data - 要追加的数据。
         * @param {Object} options - 要追加的值。
         */
        addData: function (data, options) {
            this.renderer.addData(data, options);
        },

        /**
         * @function mapVLayer.prototype.update
         * @description 更新图层。
         * @param {Object} opt - 待更新的数据。
         * @param {Object} data - mapv 数据集。
         * @param {Object} options - mapv 绘制参数。
         */
        update: function (opt) {
            this.renderer.update(opt);
        },

        /**
         * @function mapVLayer.prototype.getData
         * @description 获取数据。
         * @returns {mapv.DataSet} mapv 数据集。
         */
        getData: function () {
            if (this.renderer) {
                this.dataSet = this.renderer.getData();
            }
            return this.dataSet;
        },

        /**
         * @function mapVLayer.prototype.removeData
         * @description 删除符合过滤条件的数据。
         * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
         * @example
         *  filter=function(data){
         *    if(data.id=="1"){
         *      return true
         *    }
         *    return false;
         *  }
         */
        removeData: function (filter) {
            this.renderer && this.renderer.removeData(filter);
        },

        /**
         * @function mapVLayer.prototype.clearData
         * @description 清除数据。
         */
        clearData: function () {
            this.renderer.clearData();
        },

        /**
         * @function mapVLayer.prototype.draw
         * @description 绘制图层。
         */
        draw: function () {
            return this._reset();
        },

        /**
         * @function mapVLayer.prototype.setZIndex
         * @description 设置 canvas 层级。
         * @param {number} zIndex - canvas 层级。
         */
        setZIndex: function (zIndex) {
            this.canvas.style.zIndex = zIndex;
        },

        /**
         * @function mapVLayer.prototype.render
         * @description 渲染。
         */
        render: function () {
            this.renderer._canvasUpdate();
        },

        /**
         * @function mapVLayer.prototype.getCanvas
         * @description 获取 canvas。
         * @returns {HTMLElement} 返回 mapV 图层包含的 canvas 对象。
         */
        getCanvas: function () {
            return this.canvas;
        },

        /**
         * @function mapVLayer.prototype.getContainer
         * @description 获取容器。
         * @returns {HTMLElement} 返回包含 mapV 图层的 dom 对象。
         */
        getContainer: function () {
            return this.container;
        },

        /**
         * @function mapVLayer.prototype.getTopLeft
         * @description 获取左上角坐标。
         * @returns {L.Bounds} 返回左上角坐标。
         */
        getTopLeft: function () {
            var map = this._map;
            var topLeft;
            if (map) {
                var bounds = map.getBounds();
                topLeft = bounds.getNorthWest();
            }
            return topLeft;

        },

        _createCanvas: function () {
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = 0 + "px";
            canvas.style.left = 0 + "px";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = this.options.zIndex || 600;
            var global$2 = typeof window === 'undefined' ? {} : window;
            var devicePixelRatio = this.devicePixelRatio = global$2.devicePixelRatio;
            if (!this.mapVOptions.context || this.mapVOptions.context === '2d') {
                canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
            }
            return canvas;
        },


        _resize: function () {
            var canvas = this.canvas;
            if (!canvas) {
                return;
            }

            var map = this._map;
            var size = map.getSize();
            canvas.width = size.x;
            canvas.height = size.y;
            canvas.style.width = size.x + 'px';
            canvas.style.height = size.y + 'px';
            var bounds = map.getBounds();
            var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
            L.DomUtil.setPosition(canvas, topLeft);

        },

        _reset: function () {
            this._resize();
            this._render()
        },
        redraw: function () {
            this._resize();
            this._render()
        },
        _render: function () {
            this.render();
        }

    });

    mapVLayer = function (dataSet, mapVOptions, options) {
        return new MapVLayer(dataSet, mapVOptions, options);
    };
}
export default mapVLayer;