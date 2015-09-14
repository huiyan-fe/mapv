!function(){
    var Mapv;

;var util = {
    isPlainObject: function (obj) {
        var key;
        var class2type = {};
        var hasOwn = class2type.hasOwnProperty;

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || typeof obj !== 'object' || obj.nodeType) {
            return false;
        }

        // Not own constructor property must be Object
        var hasNoOwn = !hasOwn.call(obj, 'constructor');
        var hasNoOwnPrototypeOf = !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
        if (obj.constructor && hasNoOwn && hasNoOwnPrototypeOf) {
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    },
    /**
     * 深度扩展一个对象
     */
    extend: function (destination, source) {
        var i,
            toStr = Object.prototype.toString,
            astr = '[object Array]';
        destination = destination || {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                if (util.isPlainObject(source[i])) {
                    destination[i] = (toStr.call(source[i]) === astr) ? [] : {};
                    arguments.callee(destination[i], source[i]);
                    destination[i] = source[i];
                } else {
                    destination[i] = source[i];
                }
            }
        }
        return destination;
    },

    /**
     * copy an object
     * @param {Object} obj the obj
     * @return {Object} new object
     */
    copy: function (obj) {
        return this.extend({}, obj);
    },
    /**
     * 为类型构造器建立继承关系
     * @name baidu.lang.inherits
     * @function
     * @grammar baidu.lang.inherits(subClass, superClass[, className])
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @remark
     *
    使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
    这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
    <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
     * @shortcut inherits
     * @meta standard
     */
    inherits: function (subClass, superClass) {
        var key;
        var proto;
        var selfProps = subClass.prototype;
        var Clazz = new Function();
        Clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new Clazz();
        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;
    },

    // 在页面中添加样式
    addCssByStyle: function (cssString) {
        var doc = document;
        var style = doc.createElement('style');
        style.setAttribute('type', 'text/css');
        if (style.styleSheet) { // IE
            style.styleSheet.cssText = cssString;
        } else { // w3c
            var cssText = doc.createTextNode(cssString);
            style.appendChild(cssText);
        }

        var heads = doc.getElementsByTagName('head');
        if (heads.length) {
            heads[0].appendChild(style);
        } else {
            doc.documentElement.appendChild(style);
        }
    },

    // 获取坐标的中心点
    getGeoCenter: function (geo) {
        var minX = geo[0][0];
        var minY = geo[0][1];
        var maxX = geo[0][0];
        var maxY = geo[0][1];
        for (var i = 1; i < geo.length; i++) {
            minX = Math.min(minX, geo[i][0]);
            maxX = Math.max(maxX, geo[i][0]);
            minY = Math.min(minY, geo[i][1]);
            maxY = Math.max(maxY, geo[i][1]);
        }
        return [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];
    }


}
;var MVCObject;
(function() {

    function Accessor(target, targetKey) {
        var self = this;
        self.target = target;
        self.targetKey = targetKey;
    }

    Accessor.prototype.transform = function(from, to) {
        var self = this;
        self.from = from;
        self.to = to;
        self.target.notify(self.targetKey);
        return self;
    }

    MVCObject = (function() {

        var getterNameCache = {};
        var setterNameCache = {};
        var uuid = 0;
        var bindings = '__bindings__';
        var accessors = '__accessors__';
        var uid = '__uid__';

        function capitalize(str) {
            return str.substr(0, 1).toUpperCase() + str.substr(1);
        }

        function getUid(obj) {
            return obj[uid] || (obj[uid] = ++uuid);
        }

        function toKey(key) {
            return '_' + key;
        }

        function getGetterName(key) {
            if (getterNameCache.hasOwnProperty(key)) {
                return getterNameCache[key];
            } else {
                return getterNameCache[key] = 'get' + capitalize(key);
            }
        }

        function getSetterName(key) {
            if (setterNameCache.hasOwnProperty(key)) {
                return setterNameCache[key];
            } else {
                return setterNameCache[key] = 'set' + capitalize(key);
            }
        }

        /**
         * @description 这个函数的触发需要时机
         * 在一个key所在的终端对象遍历到时触发
         * 同时传播给所有直接、间接监听targetKey的对象
         * 在调用MVCObject的set方法时开始遍历
         *
         * @param target {MVCObject} 继承了MVCObject的对象
         * @param targetKey {String} 当前对象中被监听的字段
         * @return {void}
         */
        function triggerChange(target, targetKey) {
            var evt = targetKey + '_changed';

            /**
             * 优先检测并执行目标对象key对应的响应方法
             * 其次检测并执行默认方法
             */
            if (target[evt]) {
                target[evt]();
            } else if (typeof target.changed === 'function') {
                target.changed(targetKey);
            }

            if (target[bindings] && target[bindings][targetKey]) {
                var ref = target[bindings][targetKey];
                var bindingObj, bindingUid;
                for (bindingUid in ref) {
                    if (ref.hasOwnProperty(bindingUid)) {
                        bindingObj = ref[bindingUid];
                        triggerChange(bindingObj.target, bindingObj.targetKey);
                    }
                }
            }
        }

        function MVCObject() {};
        var proto = MVCObject.prototype;

        /**
         * @description 从依赖链中获取对应key的值
         * @param {String} key 关键值
         * @return {mixed} 对应的值
         */
        proto.get = function(key) {
            var self = this;
            if (self[accessors] && self[accessors].hasOwnProperty(key)) {
                var accessor = self[accessors][key];
                var targetKey = accessor.targetKey;
                var target = accessor.target;
                var getterName = getGetterName(targetKey);
                var value;
                if (target[getterName]) {
                    value = target[getterName]();
                } else {
                    value = target.get(targetKey);
                }
                if (accessor.to) {
                    value = accessor.to(value);
                }
            } else if (self.hasOwnProperty(toKey(key))) {
                value = self[toKey(key)];
            }
            return value;
        };

        /**
         * @description set方法遍历依赖链直到找到key的持有对象设置key的值;
         * 有三个分支
         * @param {String} key 关键值
         * @param {all} value 要给key设定的值,可以是所有类型
         * @return {this}
         */
        proto.set = function(key, value) {
            var self = this;
            if (self[accessors] && self[accessors].hasOwnProperty(key)) {
                var accessor = self[accessors][key];
                var targetKey = accessor.targetKey;
                var target = accessor.target;
                var setterName = getSetterName(targetKey);
                if (accessor.from) {
                    value = accessor.from(value);
                }
                if (target[setterName]) {
                    target[setterName](value);
                } else {
                    target.set(targetKey, value);
                }
            } else {
                this[toKey(key)] = value;
                triggerChange(self, key);
            }
            return self;
        };

        /**
         * @description 没个MVCObject对象各自的响应对应的key值变化时的逻辑
         */
        proto.changed = function() {};

        /**
         * @description 手动触发对应key的事件传播
         * @param {String} key 关键值
         * @return {this}
         */
        proto.notify = function(key) {
            var self = this;
            if (self[accessors] && self[accessors].hasOwnProperty(key)) {
                var accessor = self[accessors][key];
                var targetKey = accessor.targetKey;
                var target = accessor.target;
                target.notify(targetKey);
            } else {
                triggerChange(self, key);
            }
            return self;
        };

        proto.setValues = function(values) {
            var self = this;
            var key, setterName, value;
            for (key in values) {
                if (values.hasOwnProperty(key)) {
                    value = values[key];
                    setterName = getSetterName(key);
                    if (self[setterName]) {
                        self[setterName](value);
                    } else {
                        self.set(key, value);
                    }
                }
            }
            return self;
        };

        proto.setOptions = proto.setValues;

        /**
         * @description 将当前对象的一个key与目标对象的targetKey建立监听和广播关系
         * @param key {String} 当前对象上的key
         * @param target {Object} 目标对象
         * @param tarrgetKey {String} 目标对象上的key
         * @param noNotify {Boolean}
         * @return {Accessor}
         */
        proto.bindTo = function(key, target, targetKey, noNotify) {
            targetKey || (targetKey = key);

            var self = this;
            self.unbind(key);

            self[accessors] || (self[accessors] = {});
            target[bindings] || (target[bindings] = {});
            target[bindings][targetKey] || (target[bindings][targetKey] = {});

            var binding = new Accessor(self, key);
            var accessor = new Accessor(target, targetKey);

            self[accessors][key] = accessor;
            target[bindings][targetKey][getUid(self)] = binding;

            if (!noNotify) {
                triggerChange(self, key);
            }

            return accessor;
        };

        /**
         * @description 解除当前对象上key与目标对象的监听
         * @param {String} key 关键字
         * @return {this}
         */
        proto.unbind = function(key) {
            var self = this;
            if (self[accessors]) {
                var accessor = self[accessors][key];
                if (accessor) {
                    var target = accessor.target;
                    var targetKey = accessor.targetKey;
                    self[toKey(key)] = self.get(key);
                    delete target[bindings][targetKey][getUid(self)];
                    delete self[accessors][key];
                }
            }
            return self;
        }

        proto.unbindAll = function() {
            var self = this;
            if (self[accessors]) {
                var ref = self[accessors];
                for (var key in ref) {
                    if (ref.hasOwnProperty(key)) {
                        self.unbind(key);
                    }
                }
            }
            return self;
        };

        proto.initOptions = function(options) {

            for (var key in options) {

                this[getGetterName(key)] = (function(key) {
                    return function () {
                        return this.get(key);
                    }
                })(key);

                this[getSetterName(key)] = (function(key) {
                    return function (value) {
                        this.set(key, value);
                    }
                })(key);

                this[toKey(key)] = options[key];

            }

        }

        return MVCObject;

    })();

})();

Mapv.MVCObject = MVCObject;
;function Class () {
    this.__listeners = {}; // 存储自定义事件对象
}

util.inherits(Class, MVCObject);

/**
 * 注册对象的事件监听器
 * @grammar obj.addEventListener(type, handler[, key])
 * @param 	{string}   type         自定义事件的名称
 * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
 * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
Class.prototype.addEventListener = function (type, handler) {
    typeof this.__listeners[type] != "object" && (this.__listeners[type] = []);
    this.__listeners[type].push(handler);

    return this;
}


/**
 * 移除对象的事件监听器。
 * @grammar obj.removeEventListener(type, handler)
 * @param {string}   type     事件类型
 * @param {Function} handler  要移除的事件监听函数
 * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 */
Class.prototype.removeEventListener = function (type, handler) {
    var fns = this.__listeners[type];

    if (!fns) {
        return false;
    }

    for (var i = fns.length; i >= 0; i--) {
        if (fns[i] === handler) {
            fns.splice(i, 1);
        }
    }

    return this;
};

/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行
 * @grammar obj.dispatchEvent(event, options)
 * @param {String} 事件名称
 * @param {Object} options 扩展参数
 */
Class.prototype.dispatchEvent = function (type, options) {
    var event = util.extend({}, options);

    var fns = this.__listeners[type];

    if (!fns) {
        return false;
    }

    for (var i = fns.length - 1; i >= 0; i--) {
        fns[i].call(this, event);
    }

    return this;
    
}

Class.prototype.dispose = function () {
}

;function DataRange(layer) {
    Class.call(this);

    this.initOptions({
        min: 0,
        max: 0,
    });

    this.set('layer', layer);
    this.bindTo('data', layer)
    this.bindTo('drawOptions', layer)
    this.bindTo('drawType', layer)

    var me = this;
}

util.inherits(DataRange, Class);

util.extend(DataRange.prototype, {
    defaultGradient: {
        '0.4': 'blue',
        '0.6': 'cyan',
        '0.7': 'lime',
        '0.8': 'yellow',
        '1.0': 'red'
    },
    colors: [
        'rgba(17, 102, 252, 0.8)',
        'rgba(52, 139, 251, 0.8)',
        'rgba(110, 176, 253, 0.8)',
        'rgba(255, 241, 193, 0.8)',
        'rgba(255, 146, 149, 0.8)',
        'rgba(253, 98, 104, 0.8)',
        'rgba(255, 0, 0, 0.8)',
        'rgba(255, 51, 61, 0.8)'
    ],

    // 根据count值获取对应的大小，在bubble绘制中用到
    getSize: function (count) {
        var size = 1;
        var splitList = this.splitList;

        for (var i = 0; i < splitList.length; i++) {
            if ((splitList[i].start === undefined
            || splitList[i].start !== undefined
            && count >= splitList[i].start)
            && (splitList[i].end === undefined
            || splitList[i].end !== undefined && count < splitList[i].end)) {
                size = splitList[i].size;
                break;
            }
        }

        return size;
    },

    // 根据count值获取对应的颜色，在choropleth中使用
    getColorByRange: function (count) {
        var color = 'rgba(50, 50, 255, 1)';
        var splitList = this.splitList;

        for (var i = 0; i < splitList.length; i++) {
            if ((splitList[i].start === undefined
            || splitList[i].start !== undefined
            && count >= splitList[i].start)
            && (splitList[i].end === undefined
            || splitList[i].end !== undefined && count < splitList[i].end)) {
                color = splitList[i].color;
                break;
            }
        }

        return color;
    },

    data_changed: function () {
        var data = this.get('data');
        if (data && data.length > 0) {
            this._min = data[0].count;
            this._max = data[0].count;
            for (var i = 0; i < data.length; i++) {
                this._max = Math.max(this._max, data[i].count);
                this._min = Math.min(this._min, data[i].count);
            }
        }
    },

    drawType_changed: function () {
        this.update();
    },

    drawOptions_changed: function () {
        this.update();
    },

    update: function () {

        var drawOptions = this.get("drawOptions");
        if (drawOptions && drawOptions.splitList) {
            this.splitList = drawOptions.splitList;

        } else {
            this.generalSplitList();
        }

        if (this.get("layer").getDrawType() === 'category') {
            if (drawOptions && drawOptions.splitList) {
                this.categorySplitList = drawOptions.splitList;
            } else {
                this.generalCategorySplitList();
            }
        }

        if (this.get("layer").getDrawType() === 'heatmap' || this.get("layer").getDrawType() === 'density' || this.get("layer").getDrawType() === 'intensity') {
            this.generalGradient(drawOptions.gradient || this.defaultGradient);
        }

        this.draw();
    },

    draw: function () {

        if (this.get("layer").getDataRangeControl()) {
            this.get("layer").dataRangeControl.show();
        }

        if (this.get("layer").getDrawType() === 'bubble') {
            this.get("layer").dataRangeControl.drawSizeSplit(this.splitList, this.get('drawOptions'));
        } else if (this.get("layer").getDrawType() === 'category') {
            this.get("layer").dataRangeControl.drawCategorySplit(this.categorySplitList, this.get('drawOptions'));
        } else if (this.get("layer").getDrawType() === 'choropleth') {
            this.get("layer").dataRangeControl.drawChoroplethSplit(this.splitList, this.get('drawOptions'));
        } else {
            this.get("layer").dataRangeControl.hide();
        }

    },

    generalSplitList: function () {
        var splitNum = Math.ceil((this._max - this._min) / 7);
        var index = this._min;
        this.splitList = [];
        var radius = 1;
        while (index < this._max) {
            this.splitList.push({
                start: index,
                end: index + splitNum,
                size: radius,
                color: this.colors[radius - 1]
            });
            index += splitNum;
            radius++;
        }
    },

    generalCategorySplitList: function () {
        var colors = ['rgba(255, 255, 0, 0.8)',
            'rgba(253, 98, 104, 0.8)',
            'rgba(255, 146, 149, 0.8)',
            'rgba(255, 241, 193, 0.8)',
            'rgba(110, 176, 253, 0.8)',
            'rgba(52, 139, 251, 0.8)',
            'rgba(17, 102, 252, 0.8)'];
        var data = this.get("data");
        this.categorySplitList = {};
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            if (this.categorySplitList[data[i].count] === undefined) {
                this.categorySplitList[data[i].count] = colors[count];
                count++;
            }
            if (count >= colors.length - 1) {
                break;
            }
        }

        this.categorySplitList['other'] = colors[colors.length - 1];
    },

    getCategoryColor: function (count) {
        var splitList = this.categorySplitList;

        var color = splitList['other'];

        for (var i in splitList) {
            if (count == i) {
                color = splitList[i];
                break;
            }
        }

        return color;
    },

    generalGradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;
    },

    getGradient: function () {
        return this._grad;
    },

    getColorByGradient: function (count) {
        var max = this.get("max") || 10;

        var index = count / max;
        if (index > 1) {
            index = 1;
        }
        index *= 255;
        index = parseInt(index, 10);
        index *= 4;

        var color = 'rgba(' + this._grad[index] + ', ' + this._grad[index + 1] + ', ' + this._grad[index + 2] + ',' + this._grad[index + 3] +')';
        return color;
    }

}); // end extend
;function Animation(opts) {
    var defaultOptions = {
        duration: 1000,  // 动画时长, 单位毫秒
        fps: 30,         // 每秒帧数
        delay: 0,        // 延迟执行时间，单位毫秒,如果delay为infinite则表示手动执行
        transition: Transitions.linear,
        onStop: function () {} // 调用stop停止时的回调函数
    };
    // 需要后续执行动画
    this._anis = [];

    if (opts) {
        for (var i in opts) {
            defaultOptions[i] = opts[i];
        }
    }
    this._opts = defaultOptions;

    if (isNumber(defaultOptions.delay)) {
        var me = this;
        setTimeout(function() {
            me.start();
        }, defaultOptions.delay);
    } 
    else if (defaultOptions.delay != Animation.INFINITE) {
        this.start();
    }
}
/**
 * 常量，表示动画无限循环
 */
Animation.INFINITE = "INFINITE";
/**
 * 启动动画方法
 */
Animation.prototype.start = function() {
    this._beginTime = getCurrentTime();
    this._endTime = this._beginTime + this._opts.duration;
    this._launch();
}
Animation.prototype.add = function(ani) {
    this._anis.push(ani);
}
Animation.prototype._launch = function() {
    var me = this;
    var now = getCurrentTime();

    if (now >= me._endTime) {        
        if (me._opts.render) me._opts.render(me._opts.transition(1));
        // finish()接口，时间线结束时对应的操作
        if (me._opts.finish) me._opts.finish();
        // 开始后续动画
        if (me._anis.length > 0) {
            var newAni = me._anis[0];
            newAni._anis = [].concat(me._anis.slice(1));
            newAni.start();
        }
        return;
    }

    me.schedule = me._opts.transition((now - me._beginTime) / me._opts.duration);
    // render()接口，用来实现每个脉冲所要实现的效果
    if (me._opts.render) me._opts.render(me.schedule);
    // 执行下一个动作
    if (!me.terminative) {
        me._timer = setTimeout(function () {
            me._launch()
        }, 1000 / me._opts.fps);
    }
};


/**
 * 停止当前动画
 * @type {Boolean 是否停止到动画的终止时刻}
 */
Animation.prototype.stop = function(gotoEnd) {
    this.terminative = true;
    for (var i = 0; i < this._anis.length; i ++) {
        this._anis[i].stop();
        this._anis[i] = null;
    }
    this._anis.length = 0;
    if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
    }
    this._opts.onStop(this.schedule);
    if (gotoEnd) {
        this._endTime = this._beginTime;
        this._launch();
    }
};


/**
 * 取消动画
 */
Animation.prototype.cancel = function() {
    if (this._timer) clearTimeout(this._timer);
    this._endTime = this._beginTime;
    this.schedule = 0;
};
/**
 * 设置动画结束后的回调函数
 * @param Function
 */
Animation.prototype.setFinishCallback = function(callback) {
    if (this._anis.length > 0) {
        this._anis[this._anis.length - 1]._opts.finish = callback;
    }
    else {
        this._opts.finish = callback;
    }
}
/**
 * 变换效果函数库
 */
var Transitions = {
    linear: function(t) {
        return t;
    },
    reverse: function(t) {
        return 1 - t;
    },
    easeInQuad: function(t) {
        return t * t;
    },
    easeInCubic: function(t) {
        return Math.pow(t, 3);
    },
    easeOutQuad: function(t) {
        return -(t * (t - 2));
    },
    easeOutCubic: function(t) {
        return Math.pow((t - 1), 3) + 1;
    },
    easeInOutQuad: function(t) {
        if (t < 0.5) {
            return t * t * 2;
        } else {
            return -2 * (t - 2) * t - 1;
        }
        return;
    },
    easeInOutCubic: function(t) {
        if (t < 0.5) {
            return Math.pow(t, 3) * 4;
        } else {
            return Math.pow(t - 1, 3) * 4 + 1;
        }
    },
    easeInOutSine: function(t) {
        return (1 - Math.cos(Math.PI * t)) / 2;
    }
};
Transitions['ease-in'] = Transitions.easeInQuad;
Transitions['ease-out'] = Transitions.easeOutQuad;

/**
 * 获取当前时间
 * @returns {String} 当前时间
 */
function getCurrentTime() {
    return (new Date).getTime();
}

/**
 * 是否是数字
 * @param {Mix}
 * @returns {Boolean}
 */
function isNumber(number) {
  return typeof number == "number";
}
;function SizeDataRange() {
    DataRange.call(this);
}

util.inherits(SizeDataRange, DataRange);

util.extend(SizeDataRange.prototype, {
    
}); // end extend
;function TimeLine(options) {
    Class.call(this);
}

util.inherits(TimeLine, Class);

util.extend(TimeLine.prototype, {
});

var timeLine = new TimeLine({
});
;/**
 * Mapv主类
 * @param {Object}
 */
function Mapv(options) {
    Class.call(this);

    this.initOptions($.extend({
        map: null, //地图参数
        drawTypeControl: false,
        drawTypeControlOptions: {
            a: 1
        }
    }, options));

    this._layers = [];
    this._initDrawScale();
    
    this.notify('drawTypeControl');
}

util.inherits(Mapv, Class);

Mapv.prototype._initDrawScale = function () {
    this.Scale = new DrawScale();
};

Mapv.prototype.drawTypeControl_changed = function () {
    if (this.getDrawTypeControl()) {
        if (!this.drawTypeControl) {
            this.drawTypeControl = new DrawTypeControl({
                mapv: this
            });
        }
        this.getMap().addControl(this.drawTypeControl);
    } else {
        if (this.drawTypeControl) {
            this.getMap().removeControl(this.drawTypeControl);
        }
    }
}
;function CanvasLayer(options){
    this.options = options || {};
    this.paneName = this.options.paneName || 'labelPane';
    this.zIndex = this.options.zIndex || 0;
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
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
}

CanvasLayer.prototype.draw = function(){
    var map = this._map;
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var pixel = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
    this.canvas.style.left = pixel.x + "px";
    this.canvas.style.top = pixel.y + "px";
    this.dispatchEvent('draw');
    this.options.update && this.options.update.call(this);
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
;function Layer (options) {
    Class.call(this);

    this._drawer = {};

    this.initOptions($.extend({
        ctx: null,
        animationCtx: null,
        mapv: null,
        paneName: 'labelPane',
        map: null,
        context: '2d',
        data: [],
        dataType: 'point',
        animationOptions: {
            size: 5
        },
        coordType: 'bd09ll',
        drawType: 'simple',
        animation: false,
        geometry: null,
        dataRangeControl: true,
        zIndex: 1
    }, options));

    this.dataRangeControl = new DataRangeControl();

    this.notify('data');
    this.notify('mapv');

}

util.inherits(Layer, Class);

util.extend(Layer.prototype, {
    initialize: function () {
        if (this.canvasLayer) {
            return;
        }

        this.bindTo('map', this.getMapv());

        this.getMap().addControl(this.dataRangeControl);


        var that = this;

        this.canvasLayer = new CanvasLayer({
            map: this.getMap(),
            zIndex: this.getZIndex(),
            paneName : this.getPaneName(),
            update: function () {
                that.draw();
            },
            elementTag: "canvas"
        });

        this.setCtx(this.canvasLayer.getContainer().getContext(this.getContext()));

        if (this.getAnimation()) {
            this.animationLayer = new CanvasLayer({
                map: this.getMap(),
                zIndex: this.getZIndex(),
                elementTag: "canvas"
            });

            this.setAnimationCtx(this.animationLayer.getContainer().getContext(this.getContext()));
        }

    },

    draw: function () {

        var me = this;

        if (!this.getMapv()) {
            return;
        }

        var ctx = this.getCtx();

        if (!ctx) {
            return false;
        }

        this._calculatePixel();

        if (this.getAnimation() !== 'time') {

            if (this.getContext() == '2d') {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }

            this._getDrawer().drawMap();

        }


        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationFlag) {
            this.drawAnimation();

            this._animationFlag = true;
        }


        var animationOptions = this.getAnimationOptions() || {};
        if (this.getDataType() === 'polyline' && this.getAnimation() && !this._animationTime) {
            this._animationTime = true;
            var timeline = this.timeline = new Animation({
                duration: animationOptions.duration || 10000,  // 动画时长, 单位毫秒
                fps: animationOptions.fps || 30,         // 每秒帧数
                delay: animationOptions.delay || Animation.INFINITE,        // 延迟执行时间，单位毫秒,如果delay为infinite则表示手动执行
                transition: Transitions[animationOptions.transition || "linear"],
                onStop: animationOptions.onStop || function (e) { // 调用stop停止时的回调函数
                    console.log('stop', e);
                }, 
                render: function(e) {

                    if (me.getContext() == '2d') {
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                    var time = parseInt(parseFloat(me._minTime) + (me._maxTime - me._minTime) * e);
                    me._getDrawer().drawMap(time);

                    animationOptions.render && animationOptions.render(time);

                }
            });

            timeline.setFinishCallback(function(){
                //setTimeout(function(){
                    timeline.start();
                //}, 3000);
            });

            timeline.start();
        }

        this.dispatchEvent('draw');

    },

    drawAnimation: function () {
        var animationCtx = this.getAnimationCtx();

        if (!animationCtx ) {
            return false;
        }

        animationCtx.clearRect(0, 0, animationCtx.canvas.width, animationCtx.canvas.height);

        var that = this;
        this._getDrawer().drawAnimation();

        if (this.getAnimation()) {
            requestAnimationFrame(function () {
                that.drawAnimation();
            });
        }
    },

    animation_changed: function () {
        if (this.getAnimation()) {
            this.drawAnimation();
        }
    },

    mapv_changed: function () {

        if (!this.getMapv()) {
            this.canvasLayer && this.canvasLayer.hide();
            return;
        } else {
            this.canvasLayer && this.canvasLayer.show();
        }

        this.initialize();

        this.updateControl();

        this.draw();
    },

    drawType_changed: function () {
        this.updateControl();
        this.draw();
    },

    drawOptions_changed: function () {
        this.draw();
    },

    updateControl: function () {
        var mapv = this.getMapv();

        if (!mapv) {
            return;
        }

        var drawer = this._getDrawer();
        var map = this.getMap();

        // for drawer scale
        if(drawer.scale && this.getDataRangeControl()) {
            drawer.scale(mapv.Scale);
            mapv.Scale.show();
        } else {
            mapv && mapv.Scale.hide();
        }

        // mapv._drawTypeControl.showLayer(this);
        this.getMapv().OptionalData && this.getMapv().OptionalData.initController(this, this.getDrawType());
    },
    _getDrawer: function () {
        var drawType = this.getDrawType();
        if (!this._drawer[drawType]) {
            var funcName = drawType.replace(/(\w)/, function (v) {
                return v.toUpperCase();
            });
            funcName += 'Drawer';
            var drawer = this._drawer[drawType] = eval('(new ' + funcName + '(this))');
            if (drawer.scale) {
                if (this.getMapv()) {
                    drawer.scale(this.getMapv().Scale);
                    this.getMapv().Scale.show();
                }
            } else {
                this.getMapv().Scale.hide();
            }
        }
        return this._drawer[drawType];
    },
    _calculatePixel: function () {
        var map = this.getMapv().getMap();
        var mercatorProjection = map.getMapType().getProjection();

        console.time('parseData');
        // 墨卡托坐标计算方法
        var zoom = map.getZoom();
        var zoomUnit = Math.pow(2, 18 - zoom);
        var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
        var nwMc = new BMap.Pixel(mcCenter.x - (map.getSize().width / 2) * zoomUnit,
            mcCenter.y + (map.getSize().height / 2) * zoomUnit); //左上角墨卡托坐标
        var data = this.getData();
        var map = this.getMap();
        for (var j = 0; j < data.length; j++) {
            if (data[j].lng && data[j].lat && !data[j].x && !data[j].y) {

                var pixel = mercatorProjection.lngLatToPoint(new BMap.Point(data[j].lng, data[j].lat));
                data[j].x = pixel.x;
                data[j].y = pixel.y;
                //var pixel = map.pointToPixel(new BMap.Point(data[j].lng, data[j].lat));
                //data[j].px = pixel.x;
                //data[j].py = pixel.y;
            }
            if (data[j].x && data[j].y) {
                data[j].px = (data[j].x - nwMc.x) / zoomUnit;
                data[j].py = (nwMc.y - data[j].y) / zoomUnit;
            }
            if (data[j].geo) {
                var tmp = [];
                if (this.getCoordType() === 'bd09ll') {
                    for (var i = 0; i < data[j].geo.length; i++) {
                        var pixel = map.pointToPixel(new BMap.Point(data[j].geo[i][0], data[j].geo[i][1]));
                        tmp.push([pixel.x, pixel.y, parseFloat(data[j].geo[i][2])]);
                    }
                } else if (this.getCoordType() === 'bd09mc') {
                    for (var i = 0; i < data[j].geo.length; i++) {
                        tmp.push([(data[j].geo[i][0] - nwMc.x) / zoomUnit, (nwMc.y - data[j].geo[i][1]) / zoomUnit, parseFloat(data[j].geo[i][2])]);
                    }
                }
                data[j].pgeo = tmp;
            }
        }
        console.timeEnd('parseData');
    },
    data_changed: function () {
        var data = this.getData();
        if (data) {
            if (this.getDataType() === "polyline" && this.getAnimation()) {
                for (var i = 0; i < data.length; i++) {
                    data[i].index = parseInt(Math.random() * data[i].geo.length, 10);
                }
            }

            if (this.getDataType() === "polyline" && this.getAnimation() === 'time') {
                this._minTime = data[0] && data[0].geo[0][2];
                this._maxTime = this._minTime;
                for (var i = 0; i < data.length; i++) {
                    var geo = data[i].geo;
                    for (var j = 0; j < geo.length; j++) {
                        var time = geo[j][2];
                        if (time < this._minTime) {
                            this._minTime = time;
                        }
                        if (time > this._maxTime) {
                            this._maxTime = time;
                        }
                    }
                }
                //this._minTime = 1439568000;
                //this._maxTime = 1439827200;
            }

            if (data.length > 0) {
                this._min = data[0].count;
                this._max = this._max;
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].count === undefined || data[i].count === null) {
                    data[i].count = 1;
                }
                this._max = Math.max(this._max, data[i].count);
                this._min = Math.min(this._min, data[i].count);
            }
            this.draw();
        }
    },
    getDataRange: function () {
        return {
            minTime: this._minTime,
            maxTime: this._maxTime,
            min: this._min,
            max: this._max
        };
    },
    zIndex_changed: function () {
        var zIndex = this.getZIndex();
        this.canvasLayer.setZIndex(zIndex);
    },

    dataRangeControl_changed: function () {
        this.updateControl();
        this._getDrawer().notify('drawOptions');
    }
});

;function DataControl(superObj) {
    this.initDom();
    this.initEvent();
    this.super = superObj;
    this.geoData = superObj.geoData;
    // console.log(this.geoData.setData);
}

DataControl.prototype.initDom = function () {
    var control = this.control = document.createElement('div');

    var input = this.input = document.createElement('input');
    input.type = 'file';
    var tipstitle = document.createElement('div');
    tipstitle.textContent = '自定义数据：';
    var tips = document.createElement('div');
    tips.textContent = '拖拽文件到窗口或者选择自定义文件';

    control.appendChild(tipstitle);
    control.appendChild(tips);
    control.appendChild(input);
    control.style.fontSize = '12px';
    control.style.lineHeight = '1.8em';
    control.style.position = 'absolute';
    control.style.bottom = '50px';
    control.style.left = '10px';
    control.style.padding = '10px 20px';
    control.style.color = '#FFF';
    control.style.background = 'rgba(0,0,0,0.5)';
    control.style.zIndex = '100000';
    control.style.overflow = 'hidden';
    control.style.webkitTransition = 'all 0.5s ease-in';

    var history = document.createElement('div');
    var historyTitle = document.createElement('div');
    historyTitle.textContent = '历史数据';
    this.history = document.createElement('div');
    history.appendChild(historyTitle);
    history.appendChild(this.history);
    control.appendChild(history);

    document.body.appendChild(control);
};

DataControl.prototype.initEvent = function () {
    var self = this;
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {

        var text = reader.result;
        var draw = formatRender(text);

        if (draw) {
            var filenames = localStorage.getItem('filenames') || '{}';
            filenames = JSON.parse(filenames);
            if (!reader.fileName || !reader.fileSize) {
                console.log('no fileName or fileSize , save faild ');
                return false;
            }
            for (var i in filenames) {
                if (filenames[i].name === this.fileName && filenames[i].size === this.fileSize) {
                    return false;
                }
            }
            var saveName = this.fileName + this.fileSize + parseInt(Math.random() * 1e17, 10).toString(36);
            filenames[saveName] = {
                size: this.fileSize,
                name: this.fileName
            };
            // console.log(filenames)
            localStorage.setItem('filenames', JSON.stringify(filenames));
            localStorage.setItem(saveName, JSON.stringify(text));
            self.initHistory();
        }
    });

    self.history.addEventListener('click', function (e) {
        var node = e.target;
        if (node.nodeName === 'A') {
            var storageName = node.getAttribute('storageName');
            var dataStr = localStorage.getItem(storageName);
            formatRender(dataStr);
        }
        return false;
    });

    self.input.addEventListener('change', function (e) {
        reader.readAsText(e.target.files[0]);
        reader.fileName = e.target.files[0].name;
        reader.fileSize = e.target.files[0].size;
    });

    document.addEventListener('dragover', function (event) {
        event.preventDefault();
    }, false);
    document.addEventListener('drop', function (event) {
        event.preventDefault();
        reader.readAsText(event.dataTransfer.files[0]);
        reader.fileName = event.dataTransfer.files[0].name;
        reader.fileSize = event.dataTransfer.files[0].size;
        return false;
    });

    function formatRender(dataStr) {

        var data;
        var wrongType = false;

        try {
            data = JSON.parse(dataStr.replace(/\s/g, ''));
            // console.log('??!@',data)
            var count = 0;
            while (typeof (data) === 'string' && count <= 10) {
                data = JSON.parse(data);
                count++;
            }
            wrongType = false;
        } catch (e) {
            wrongType = true;
        }

        if (wrongType) {
            try {
                data = [];
                var dataT = dataStr.split('\n');
                if (dataT.length <= 1) {
                    dataT = dataStr.split('\\n');
                }

                var keys = dataT[0].split(',');
                // console.log(keys)
                for (var i = 1; i < keys.length; i++) {
                    var values = dataT[i].split(',');
                    var obj = {};
                    var nonameIndex = 0;
                    for (var j = 0; j < values.length; j++) {
                        var name = keys[j] || 'noname' + (nonameIndex++);
                        name = name.replace(/\\r/g, '');
                        obj[name] = Number(values[j].replace(/\\r/g, '').replace(/\"/g, ''));
                    }
                    data.push(obj);
                }

                data = JSON.stringify(data).replace(/\\r/g, '');

                data = JSON.parse(data);

                wrongType = false;
            } catch (e) {
                window.console.log(e);
                wrongType = true;
            }
        }

        if (wrongType) {
            alert('数据格式错误，请检查是否为json或者csv格式数据');
            return false;
        }

        self.geoData.setData(data);
        console.log(self.super._layers)
        for(var i=0;i<self.super._layers.length;i++){
                self.super._layers[i].draw();
        }

        return true;
    }

};
;function DataRangeControl(){

    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

DataRangeControl.prototype = new BMap.Control();

util.extend(DataRangeControl.prototype, {

    initialize: function(map){
        var canvas = this.canvas = document.createElement('canvas');
        canvas.style.background = '#fff';
        canvas.style.boxShadow = 'rgba(0,0,0,0.2) 0 0 4px 2px';
        canvas.style.border = '1px solid #999999';
        canvas.style.borderRadius = '4px';
        // 添加DOM元素到地图中
        map.getContainer().appendChild(canvas);
        // 将DOM元素返回
        return canvas;
    },

    getContainer: function(){
        return this.canvas;
    },

    drawSizeSplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 100;
        canvas.height = 190;
        canvas.style.width = '100px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');

        var height = 10;

        var maxSize = 0;
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i].size > maxSize) {
                maxSize = splitList[i].size;
            }
        }

        for (var i = 0; i < splitList.length; i++) {
            height += splitList[i].size;
            ctx.beginPath();
            ctx.arc(maxSize + 5, height, splitList[i].size, 0, Math.PI * 2, false);
            var startText = splitList[i].start || '~';
            var endText = splitList[i].end || '~';
            var text =  startText + ' - ' + endText;
            ctx.closePath();
            ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';
            ctx.fill();
            ctx.fillStyle = 'rgba(30, 30, 30, 1)';
            ctx.fillText(text, maxSize * 2 + 10, height + 6);
            var addHeight = splitList[i].size + 5;
            if (addHeight < 15) {
                addHeight = 15;
            }
            height += addHeight;
        }
    },

    drawCategorySplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 80;
        canvas.height = 190;
        canvas.style.width = '80px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');
        var i = 0;
        for (var key in splitList) {
            ctx.fillStyle = splitList[key];
            ctx.beginPath();
            ctx.arc(15, i * 25 + 15, 5, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillText(key, 25, i * 25 + 20);
            i++;
        }
    },

    drawChoroplethSplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 100;
        canvas.height = 190;
        canvas.style.width = '100px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';

        for (var i = 0; i < splitList.length; i++) {
            ctx.beginPath();
            ctx.arc(15, i * 25 + 15, 5, 0, Math.PI * 2, false);
            var text = (splitList[i].start || '~') + ' - ' + (splitList[i].end || '~');
            ctx.closePath();
            ctx.fillStyle = splitList[i].color;
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillText(text, 25, i * 25 + 20);
        };
    },

    hide: function () {
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    },

    show: function () {
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }

});
;function DrawScale() {
    this.init();
    this._Event();
}

DrawScale.prototype.change = function (callback) {
    var self = this;
    self.changeFn = callback;
};

DrawScale.prototype.hide = function () {
    var self = this;
    self.box.style.display = 'none';
};

DrawScale.prototype.show = function () {
    var self = this;
    self.box.style.display = 'block';
};

DrawScale.prototype.set = function (obj) {
    var self = this;
    self.max = obj.max || self.max;
    self.min = obj.min || self.min;
    self.colors = obj.colors || self.colors;

    self._draw();
};

/**
 * init dom
 */
DrawScale.prototype.init = function () {
    var self = this;

    // prepare param
    // param-num
    self.changeFn = null;
    self.width = 55;
    self.height = 250;
    self.min = 0;
    self.max = 100;
    self.offsetTop = 10;
    self.offsetBottom = 10;
    self.drawHeight = self.height - self.offsetTop - self.offsetBottom;
    self.colors = [
        '#49ae22', '#77c01a', '#a0cd12', '#cadd0a', '#f8ed01', '#e1de03', '#feb60a', '#fe7e13', '#fe571b', '#fd3620'
    ];
    self.defaultColors = [
        '#49ae22', '#77c01a', '#a0cd12', '#cadd0a', '#f8ed01', '#e1de03', '#feb60a', '#fe7e13', '#fe571b', '#fd3620'
    ];
    // param-event
    self.point = {
        x: 0,
        y: 0
    };
    self.hoveredHandle = null;
    self.showHandle = false;
    self.handleStartPos = {
        // x: 0,
        val: self.min,
        yMin: self.offsetTop,
        yMax: self.offsetTop + self.drawHeight,
        y: self.offsetTop
    };
    self.handleEndPos = {
        // x: 0,
        val: self.max,
        yMin: self.offsetTop,
        yMax: self.offsetTop + self.drawHeight,
        y: self.offsetTop + self.drawHeight
    };

    // prepare dom
    var box = self.box = document.createElement('div');
    var canvas = document.createElement('canvas');
    canvas.width = self.width;
    canvas.height = self.height;
    canvas.style.cursor = 'pointer';
    box.style.border = '1px solid #999';
    box.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 0px 4px 2px';
    box.style.borderRadius = '6px';
    box.style.background = 'white';
    box.style.position = 'absolute';
    box.style.right = '10px';
    box.style.bottom = '10px';
    box.style.width = self.width + 'px';
    box.style.height = self.height + 'px';
    box.style.zIndex = 10000;
    box.appendChild(canvas);
    document.body.appendChild(box);

    //
    self.ctx = canvas.getContext('2d');

    // draw it
    self._draw();
};

DrawScale.prototype._Event = function () {
    var self = this;
    var canvas = self.ctx.canvas;

    var canDrag = false;
    var mousePos = {
        x: 0,
        y: 0
    };
    var tarPos = {
        // x: 0,
        y: 0,
        name: null
    };

    canvas.addEventListener('mouseenter', function () {
        self.showHandle = true;
        self._draw();
    });

    canvas.addEventListener('mouseleave', function () {
        self.showHandle = false;
        self._draw();
    });

    canvas.addEventListener('mousedown', function (e) {
        var tar = self.hoveredHandle;
        if (tar) {
            mousePos.x = e.pageX;
            mousePos.y = e.pageY;
            var handleName = 'handle' + tar.name + 'Pos';
            tarPos.name = handleName;
            tarPos.y = self[handleName].y;
            canDrag = true;
        }
    });

    window.addEventListener('mousemove', function (e) {
        self.point.x = e.offsetX;
        self.point.y = e.offsetY;
        if (canDrag) {
            var desY = e.pageY - mousePos.y;
            self[tarPos.name].y = tarPos.y + desY;

            // set max and min
            var val = tarPos.y + desY;
            var max = self[tarPos.name].yMax;
            var min = self[tarPos.name].yMin;
            val = val > max ? max : val;
            val = val < min ? min : val;
            self[tarPos.name].y = val;
            // set max and min
            if (tarPos.name === 'handleStartPos') {
                self.handleEndPos.yMin = val;
            }
            if (tarPos.name === 'handleEndPos') {
                self.handleStartPos.yMax = val;
            }
            //
            e.preventDefault();
        }
        self._draw();
    });

    window.addEventListener('mouseup', function (e) {
        if (canDrag) {
            self.changeFn && self.changeFn(self.handleStartPos.val, self.handleEndPos.val);
            canDrag = false;
        }
    });
};

DrawScale.prototype._draw = function () {
    var self = this;
    var ctx = self.ctx;
    // clear
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    self.hoveredHandle = null;

    // draw gradient
    var gradientOffsetLeft = 5;
    var gradientOffsetTop = self.offsetTop;
    var gradientWidth = 10;
    var gradientHeight = self.drawHeight;

    var tempColor;
    if (self.colors === 'default') {
        tempColor = self.defaultColors;
    } else {
        tempColor = self.colors;
    }
    var gradient = ctx.createLinearGradient(gradientOffsetLeft, gradientOffsetTop, gradientWidth, gradientHeight);
    var steps = gradientHeight / (tempColor.length - 1);
    if (self.colors instanceof Array || self.colors === 'default') {
        for (var i = 0; i < tempColor.length; i++) {
            var present = i * steps / self.height;
            gradient.addColorStop(present, tempColor[i]);
        }
    } else if (typeof (self.colors) === 'object') {
        for (var i in self.colors) {
            gradient.addColorStop(i, self.colors[i]);
        }
    }
    ctx.fillStyle = ctx.strokeStyle = gradient;
    ctx.fillRect(gradientOffsetLeft, gradientOffsetTop, gradientWidth, gradientHeight);
    // gradient end

    var startValOrigin = (self.handleStartPos.y - gradientOffsetTop) / gradientHeight * self.max | 0;
    var startVal = self.handleStartPos.val = startValOrigin + self.min;
    var endVal = self.handleEndPos.val = (self.handleEndPos.y - gradientOffsetTop) / gradientHeight * self.max | 0;

    // draw text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var textLeft = gradientOffsetLeft + gradientWidth + 5;
    ctx.fillText('- ' + self.min, textLeft, gradientOffsetTop);
    ctx.fillText('- ' + self.max, textLeft, gradientOffsetTop + gradientHeight);

    // draw range text
    ctx.save();
    ctx.fillStyle = 'grey';
    if (self.handleStartPos.y > gradientOffsetTop + 10) {
        ctx.fillText('- ' + startVal, textLeft, self.handleStartPos.y);
    }
    if (self.handleEndPos.y < gradientOffsetTop + gradientHeight - 10) {
        ctx.fillText('- ' + endVal, textLeft, self.handleEndPos.y);
    }
    ctx.restore();

    // draw handle
    if (self.showHandle) {
        drawTips({
            sup: self,
            name: 'Start',
            ctx: ctx,
            left: gradientOffsetLeft + gradientWidth,
            right: ctx.canvas.width - 5,
            top: self.handleStartPos.y,
            text: startVal
        });

        drawTips({
            sup: self,
            name: 'End',
            ctx: ctx,
            left: gradientOffsetLeft + gradientWidth,
            right: ctx.canvas.width - 5,
            top: self.handleEndPos.y,
            text: endVal
        });
    }

    // draw grey area
    ctx.save();
    ctx.fillStyle = '#ADABAB';
    var greyLeft = gradientOffsetLeft;
    var greyWidth = gradientWidth;
    ctx.fillRect(greyLeft, gradientOffsetTop, greyWidth, self.handleStartPos.y - self.offsetTop);
    ctx.fillRect(greyLeft, self.handleEndPos.y, greyWidth, gradientHeight - self.handleEndPos.y + self.offsetTop);
    ctx.restore();

    // hover
    if (self.hoveredHandle) {
        ctx.canvas.style.cursor = 'pointer';
    } else {
        ctx.canvas.style.cursor = 'default';
    }

};

function drawTips(obj) {
    // draw handle
    var hdlMid = obj.left;
    var hdlRight = obj.right;
    var hdlTop = obj.top;
    var ctx = obj.ctx;
    ctx.beginPath();
    ctx.moveTo(hdlMid + 8, hdlTop - 7);
    ctx.lineTo(hdlRight, hdlTop - 7);
    ctx.lineTo(hdlRight, hdlTop + 7);
    ctx.lineTo(hdlMid + 8, hdlTop + 7);
    ctx.lineTo(hdlMid, hdlTop);
    ctx.fill();

    // isHover
    var isHover = ctx.isPointInPath(obj.sup.point.x, obj.sup.point.y);
    if (isHover) {
        obj.sup.hoveredHandle = obj;
    }

    // add text
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText(obj.text, hdlMid + 8, hdlTop);
    ctx.restore();
}
;/* globals util BMap BMAP_ANCHOR_TOP_LEFT BMAP_ANCHOR_TOP_RIGHT*/

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
;/* globals util */

function OptionalData(superObj) {
    // set params
    var options = superObj.options || {};
    this.drawType = options.drawType;
    this.super = superObj;
    // init options
    this.options = options.drawOptions || {};
    // init css
    this.initCSS();
    // append dom to body
    this.initDom();
    // bind event
    this.bindEvent();
}

OptionalData.prototype.initCSS = function () {
    util.addCssByStyle([
        '.controlBox { position:absolute; left:0px; top:0px; background:rgba(0,0,0,0.5); padding:10px; }',
        '.controlBox input {border-radius:6px; border:none; padding:10px;}',
        '.controlBox button ',
        '{ padding:8px 10px; border:none; width:40%; margin-left: 10px; border-radius:6px; cursor:pointer; }',
        '.controlBoxBlock { color:#fff; padding: 10px; }',
        '.controlBoxTitle { display:inline-block; width:100px; text-align:right; padding-right:10px; }'
    ].join('\n'));
};

/**
 * append the content to body
 * @return {DOM} return the appneded dom
 */
OptionalData.prototype.initDom = function () {
    var box = this.box = document.createElement('div');
    box.className = 'controlBox';
    var contentBox = this.contentBox = document.createElement('div');
    var btnBox = document.createElement('div');
    btnBox.style.textAlign = 'center';
    var updateBtn = this.updateBtn = document.createElement('button');
    var resetBtn = this.resetBtn = document.createElement('button');
    updateBtn.textContent = 'update';
    resetBtn.textContent = 'reset';
    box.appendChild(contentBox);
    btnBox.appendChild(updateBtn);
    btnBox.appendChild(resetBtn);
    box.appendChild(btnBox);
    document.body.appendChild(box);
    return box;
};

/**
 * init the controller to box
 */

OptionalData.prototype.initController = function (layer, drawType) {
  return false
    this._layer = layer;
    var self = this;
    var options;

    if (drawType) {
        var drawer = layer._getDrawer(drawType);
        options = self.options = drawer.getDrawOptions();
        self.drawType = drawType;
    } else {
        options = self.options;
    }

    var editTag = options.editable;

    if (!editTag) {
        self.box.style.display = 'none';
        return false;
    } else {
        self.box.style.display = 'block';
    }

    self.contentBox.innerHTML = '';

    var newTag = [];
    for (var i = 0; i < editTag.length; i++) {
        var tag = editTag[i];
        if (typeof (tag) === 'string') {
            tag = {
                name: tag,
                type: 'text'
            };
            editTag[i] = tag;
        }
        if (options[tag.name]) {
            makeLabelInput(tag);
            editTag[i]._oldVal = options[tag.name];
            newTag.push(editTag[i]);
        }
    }
    options.editable = newTag;

    function makeLabelInput(tag) {
        var box = document.createElement('div');
        box.className = 'controlBoxBlock';

        var span = document.createElement('span');
        span.textContent = tag.name;
        span.className = 'controlBoxTitle';
        // span.style.padding = '0 10px';

        // if type equal value , show normal inoput
        // if type equal option , show checkboxk
        var optionBox;
        if (tag.type === 'text' || tag.type === 'color') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.name = tag.name;
            input.value = options[tag.name];
            input.type = tag.type;
            optionBox.appendChild(input);
        } else if (tag.type === 'option') {
            optionBox = document.createElement('span');
            for (var i = 0; i < tag.value.length; i++) {
                var label = document.createElement('label');
                label.style.padding = '0 10px 0  0';
                label.style.cursor = 'pointer';
                var radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = tag.name;
                radio.value = tag.value[i];
                if (options[tag.name] === tag.value[i]) {
                    radio.checked = true;
                }
                var labelSpan = document.createElement('span');
                labelSpan.textContent = tag.value[i];
                label.appendChild(radio);
                label.appendChild(labelSpan);
                optionBox.appendChild(label);
            }
        } else if (tag.type === 'check') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.name = tag.name;
            input.checked = options[tag.name];
            optionBox.appendChild(input);
        } else if (tag.type === 'json') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.setAttribute("isJson", true);
            input.name = tag.name;
            input.value = JSON.stringify(options[tag.name]);
            optionBox.appendChild(input);
        } else {
            return false;
        }

        box.appendChild(span);
        box.appendChild(optionBox);
        self.contentBox.appendChild(box);
    }
};

/**
 * bind update and reset button's event
 */
OptionalData.prototype.bindEvent = function () {
    var self = this;
    this.updateBtn.onclick = function () {
        for (var i = 0; i < self.options.editable.length; i++) {
            var name = self.options.editable[i].name;
            var val = self.contentBox.querySelector('input[name="' + name + '"]');
            if (val) {
                if (val.type === 'radio') {
                    val = self.contentBox.querySelector('input[name="' + name + '"]:checked');
                    self.options[name] = val.value;
                } else if (val.type === 'checkbox') {
                    val = self.contentBox.querySelector('input[name="' + name + '"]');
                    self.options[name] = val.checked;
                } else {
                    if (val.getAttribute('isJson') === 'true') {
                        console.log(1);
                        self.options[name] = JSON.parse(val.value);
                    } else {
                        self.options[name] = val.value;
                    }
                }

            }
        }

        var drawer = self._layer._getDrawer(self.drawType);
        drawer.setDrawOptions(self.options);
        self._layer.draw();
    };

    this.resetBtn.onclick = function () {
        for (var i = 0; i < self.options.editable.length; i++) {
            var name = self.options.editable[i].name;
            var oldVal = self.options.editable[i]._oldVal;
            self.options[name] = oldVal;
        }
        var drawer = this._layer._getDrawer(self.drawType);
        drawer.setDrawOptions(self.options);
        this._layer.draw();
        self.initController();
        // console.log('reset', self.options);
    };
};
;function Drawer(layer) {

    Class.call(this);

    this.mapv = layer._mapv;
    this.initOptions({
        layer: layer,
        map: layer.getMap(),
        ctx: null,
        mapv: null,
        animationOptions: {},
        drawOptions: {
            size: 2
        }
    });

    this.dataRange = new DataRange(layer);

    this.bindTo('ctx', layer);
    this.bindTo('animationOptions', layer);
    this.bindTo('drawOptions', layer);
    this.bindTo('mapv', layer);
    this.bindTo('map', layer);

}

util.inherits(Drawer, Class);

Drawer.prototype.beginDrawMap = function () {
    if (this.getLayer().getContext() == "2d") {
        this.beginDrawCanvasMap();
    }
};

Drawer.prototype.endDrawMap = function () {
    if (this.getLayer().getContext() == "2d") {
        this.endDrawCanvasMap();
    }
}

Drawer.prototype.beginDrawCanvasMap = function () {

    var drawOptions = this.getDrawOptions();
    var ctx = this.getCtx();

    ctx.save();

    var property = [
        'globalCompositeOperation', 
        'shadowColor', 
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'globalAlpha',
        'fillStyle',
        'strokeStyle',
        'lineWidth',
        'lineCap',
        'lineJoin',
        'lineWidth',
        'miterLimit'
    ];

    for (var i = 0; i < property.length; i++) {
        if (drawOptions[property[i]]) {
            ctx[property[i]] = drawOptions[property[i]];
        }
    }

}

Drawer.prototype.endDrawCanvasMap = function () {
    var ctx = this.getCtx();
    ctx.restore();
}

Drawer.prototype.drawOptions_changed = function () {

    var drawOptions = this.getDrawOptions();
    if (drawOptions && drawOptions.splitList) {
        this.splitList = drawOptions.splitList;
    } else {
        this.generalSplitList();
    }

};

Drawer.prototype.colors = [
    'rgba(17, 102, 252, 0.8)',
    'rgba(52, 139, 251, 0.8)',
    'rgba(110, 176, 253, 0.8)',
    'rgba(255, 241, 193, 0.8)',
    'rgba(255, 146, 149, 0.8)',
    'rgba(253, 98, 104, 0.8)',
    'rgba(255, 0, 0, 0.8)',
    'rgba(255, 51, 61, 0.8)'
];

Drawer.prototype.generalSplitList = function () {
    var dataRange = this.getLayer().getDataRange();
    var splitNum = Math.ceil((dataRange.max - dataRange.min) / 7);
    var index = dataRange.min;
    this.splitList = [];
    var radius = 1;
    while (index < dataRange.max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            size: radius,
            color: this.colors[radius - 1]
        });
        index += splitNum;
        radius++;
    }
};

Drawer.prototype.getRadius = function () {
    var zoom = this.getMap().getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);

    var drawOptions = this.getDrawOptions();
    var radius = parseFloat(drawOptions.size) || 13;
    var unit = drawOptions.unit || 'px';
    if (unit === 'm') {
        radius = radius / zoomUnit;
    } else {
        radius = radius;
    }

    if (drawOptions.minPxSize && radius < drawOptions.minPxSize) {
        radius = drawOptions.minPxSize;
    }

    return radius;
}
;/* globals Drawer, util */

function BubbleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(BubbleDrawer, Drawer);

BubbleDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var data = this.getLayer().getData();

    var ctx = this.getCtx();


    var drawOptions = this.getDrawOptions();

    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        var size = this.dataRange.getSize(item.count);
        ctx.beginPath();
        ctx.arc(item.px, item.py, size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        if (drawOptions.strokeStyle) {
            ctx.stroke();
        }
    }

    this.endDrawMap();
}
;/* globals Drawer, util */

function CategoryDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(CategoryDrawer, Drawer);

CategoryDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var data = this.getLayer().getData();
    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();

    var radius = this.getRadius();
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        ctx.beginPath();
        ctx.moveTo(item.px, item.py);
        ctx.fillStyle = this.dataRange.getCategoryColor(item.count);
        ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

    this.endDrawMap();
};
;/* globals Drawer, util */

function ChoroplethDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ChoroplethDrawer, Drawer);

ChoroplethDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var data = this.getLayer().getData();
    var dataType = this.getLayer().getDataType();

    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();

    var label = drawOptions.label;
    var zoom = this.getMap().getZoom();
    if (label) {
        if (label.font) {
            ctx.font = label.font;
        }
    }

    if (dataType === 'polyline' || dataType === 'polygon') { // 画线或面

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            ctx.beginPath();
            ctx.moveTo(geo[0][0], geo[0][1]);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }

            ctx.fillStyle = this.dataRange.getColorByRange(data[i].count);

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
            }

            if (dataType === 'polygon') {
                ctx.closePath();
                ctx.fill();
            }

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i].count, center[0], center[1]);
            }

        }

    } else { // 画点

        var radius = this.getRadius(); 
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            ctx.fillStyle = this.dataRange.getColorByRange(item.count);
            ctx.beginPath();
            ctx.moveTo(item.px, item.py);
            ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        if (drawOptions.strokeStyle) {
            ctx.stroke();
        }
    }

    this.endDrawMap();
};
;/* globals Drawer mercatorProjection BMap util */

var min;
var max;

function ClusterDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(ClusterDrawer, Drawer);

ClusterDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    // console.log('ClusterDrawer');
    window.console.time('computerMapData');
    var ctx = this.getCtx();

    // TODO: ser workder
    max = min = undefined;

    var data = this.getLayer().getData();

    var map = this.getMapv().getMap();
    var zoom = map.getZoom();
    var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);

    // setMapStyle(map);

    var param = this.formatParam();
    // console.log(param)

    console.log(param)
    var size = param.size;

    var mercatorProjection = map.getMapType().getProjection();

    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMcX = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    var nwMc = new BMap.Pixel(nwMcX, mcCenter.y + (map.getSize().height / 2) * zoomUnit);
    // 左上角墨卡托坐标

    var gridStep = size / zoomUnit;

    var startXMc = parseInt(nwMc.x / size, 10) * size;
    var startX = (startXMc - nwMc.x) / zoomUnit;

    var stockXA = [];
    var stickXAIndex = 0;
    while ((startX + stickXAIndex * gridStep) < map.getSize().width) {
        var value = startX + stickXAIndex * gridStep;
        stockXA.push(value.toFixed(2));
        stickXAIndex++;
    }

    var startYMc = parseInt(nwMc.y / size, 10) * size + size;
    var startY = (nwMc.y - startYMc) / zoomUnit;
    var stockYA = [];
    var stickYAIndex = 0;
    while ((startY + stickYAIndex * gridStep) < map.getSize().height) {
        value = startY + stickYAIndex * gridStep;
        stockYA.push(value.toFixed(2));
        stickYAIndex++;
    }

    var grids = {};
    for (var i = 0; i < stockXA.length; i++) {
        for (var j = 0; j < stockYA.length; j++) {
            var name = stockXA[i] + '_' + stockYA[j];
            grids[name] = 0;
        }
    }

    for (var i = 0; i < data.length; i++) {
        var x = data[i].px;
        var y = data[i].py;
        var val = parseInt(data[i].count, 10);
        var isSmallX = x < stockXA[0];
        var isSmallY = y < stockYA[0];
        var isBigX = x > (Number(stockXA[stockXA.length - 1]) + Number(gridStep));
        var isBigY = y > (Number(stockYA[stockYA.length - 1]) + Number(gridStep));
        if (isSmallX || isSmallY || isBigX || isBigY) {
            continue;
        }
        for (var j = 0; j < stockXA.length; j++) {
            var dataX = Number(stockXA[j]);
            if ((x >= dataX) && (x < dataX + gridStep)) {
                for (var k = 0; k < stockYA.length; k++) {
                    var dataY = Number(stockYA[k]);
                    if ((y >= dataY) && (y < dataY + gridStep)) {
                        // grids[stockXA[j] + '_' + stockYA[k]] += 1;
                        grids[stockXA[j] + '_' + stockYA[k]] += val;
                        val = grids[stockXA[j] + '_' + stockYA[k]];
                    }
                }
            }
        }
        min = min || val;
        max = max || val;
        min = min > val ? val : min;
        max = max < val ? val : max;
    }

    var step = (max - min + 1) / 10;
    window.console.timeEnd('computerMapData');

    window.console.time('drawMap');
    for (var i in grids) {
        var sp = i.split('_');
        x = Number(sp[0]);
        y = Number(sp[1]);
        var v = (grids[i] - min) / step;
        v = v < 0 ? 0 : v;

        var cx = x + gridStep / 2;
        var cy = y + gridStep / 2;

        ctx.fillStyle = param.fillStyle || '#fa8b2e';

        ctx.beginPath();

        ctx.arc(cx, cy, v * 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 8 * v / 10;
        ctx.strokeStyle = param.strokeStyle || '#fff';
        ctx.stroke();

        // if (this.drawOptions.showNum) {
        ctx.save();
        // ctx.fillStyle = 'black';
        ctx.font = 30 * v / 10 + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (grids[i] !== 0 && param.label.show) {

            ctx.fillStyle =  '#fff';
            ctx.fillText(grids[i], cx, cy);
            ctx.restore();
        }
        // }
    }

    window.console.timeEnd('drawMap');
    this.endDrawMap();
};

// ClusterDrawer.prototype.drawDataRange = function (canvas, data, drawOptions) {
// };

/**
 * format param
 * @return {[type]} [description]
 */
ClusterDrawer.prototype.formatParam = function () {
    var options = this.getDrawOptions();

    var size = options.size || 60;
    size = size + (options.unit || 'px');
    if (/px$/.test(size)) {
        size = parseInt(size, 10) * this.zoomUnit;
    } else {
        size = parseInt(size, 10);
    }
    options.size = size;
    return options
};
;/* globals Drawer mercatorProjection BMap util */

var min;
var max;

function DensityDrawer() {
    this.Scale;
    this.masker = {};
    Drawer.apply(this, arguments);
}

util.inherits(DensityDrawer, Drawer);

DensityDrawer.prototype.scale = function (scale) {
    var self = this;
    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };
        self.ctx = self.getCtx();
        self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        self.drawMap();
    });
    this.Scale = scale;
};

DensityDrawer.prototype.drawMap = function () {
    this.beginDrawMap();

    var self = this;
    var ctx = this.getCtx();

    // TODO: use workder
    var data = this.getLayer().getData();

    var map = this.getMapv().getMap();
    var zoom = map.getZoom();
    var zoomUnit = this.zoomUnit = Math.pow(2, 18 - zoom);

    var param = formatParam.call(this);
    var size = param.size;

    var mercatorProjection = map.getMapType().getProjection();
    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var nwMcX = mcCenter.x - (map.getSize().width / 2) * zoomUnit;
    var nwMc = new BMap.Pixel(nwMcX, mcCenter.y + (map.getSize().height / 2) * zoomUnit);
    // 左上角墨卡托坐标

    window.console.time('computerMapData');
    var obj = {
        data: data,
        nwMc: nwMc,
        size: size,
        zoomUnit: zoomUnit,
        ctx: ctx
    };

    var gridsObj = {};
    if (this.getDrawOptions().type === 'honeycomb') {
        gridsObj = honeycombGrid(obj);
    } else {
        gridsObj = recGrids(obj, map);
    }
    // console.log(gridsObj);

    var grids = gridsObj.grids;
    this.dataRange.setMax(gridsObj.max);
    this.dataRange.setMin(gridsObj.min);
    var max = gridsObj.max;
    var min = gridsObj.min;
    // console.log(gridsObj);
    window.console.timeEnd('computerMapData');

    window.console.time('drawMap');
    var obj = {
        size: size,
        zoomUnit: zoomUnit,
        max: max,
        min: min,
        ctx: ctx,
        grids: grids,
        fillColors: param.colors,
        dataRange: this.dataRange,
        sup: self
    };

    var gridsObj = {};
    if (this.getDrawOptions().type === 'honeycomb') {
        drawHoneycomb.call(this,obj);
    } else {
        drawRec.call(this,obj);
    }
    window.console.timeEnd('drawMap');

    this.Scale && this.Scale.set({
        max: max,
        min: min,
        colors: this.getDrawOptions().gradient || 'default'
    });

    this.endDrawMap();
};

function recGrids(obj, map) {
    var data = obj.data;
    var nwMc = obj.nwMc;
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var max;
    var min;

    var grids = {};

    var gridStep = size / zoomUnit;

    var startXMc = parseInt(nwMc.x / size, 10) * size;

    var startX = (startXMc - nwMc.x) / zoomUnit;

    var stockXA = [];
    var stickXAIndex = 0;
    while ((startX + stickXAIndex * gridStep) < map.getSize().width) {
        var value = startX + stickXAIndex * gridStep;
        stockXA.push(value.toFixed(2));
        stickXAIndex++;
    }

    var startYMc = parseInt(nwMc.y / size, 10) * size + size;
    var startY = (nwMc.y - startYMc) / zoomUnit;
    var stockYA = [];
    var stickYAIndex = 0;
    while ((startY + stickYAIndex * gridStep) < map.getSize().height) {
        value = startY + stickYAIndex * gridStep;
        stockYA.push(value.toFixed(2));
        stickYAIndex++;
    }

    for (var i = 0; i < stockXA.length; i++) {
        for (var j = 0; j < stockYA.length; j++) {
            var name = stockXA[i] + '_' + stockYA[j];
            grids[name] = 0;
        }
    }

    for (var i = 0; i < data.length; i++) {
        var x = data[i].px;
        var y = data[i].py;
        var val = parseInt(data[i].count, 10);
        var isSmallX = x < stockXA[0];
        var isSmallY = y < stockYA[0];
        var isBigX = x > (Number(stockXA[stockXA.length - 1]) + Number(gridStep));
        var isBigY = y > (Number(stockYA[stockYA.length - 1]) + Number(gridStep));
        if (isSmallX || isSmallY || isBigX || isBigY) {
            continue;
        }
        for (var j = 0; j < stockXA.length; j++) {
            var dataX = Number(stockXA[j]);
            if ((x >= dataX) && (x < dataX + gridStep)) {
                for (var k = 0; k < stockYA.length; k++) {
                    var dataY = Number(stockYA[k]);
                    if ((y >= dataY) && (y < dataY + gridStep)) {
                        grids[stockXA[j] + '_' + stockYA[k]] += val;
                        val = grids[stockXA[j] + '_' + stockYA[k]];
                    }
                }
            }
        }
        min = min || val;
        max = max || val;
        min = min > val ? val : min;
        max = max < val ? val : max;
    }


    return {
        grids: grids,
        max: max,
        min: min
    };
}

function drawRec(obj) {
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var max = obj.max;
    var min = obj.min;
    var ctx = obj.ctx;
    var grids = obj.grids;
    var fillColors = obj.fillColors;
    var self = obj.sup;
    var options = formatParam.call(this);


    var gridStep = size / zoomUnit;
    var step = (max - min + 1) / 10;

    for (var i in grids) {
        var sp = i.split('_');
        var x = sp[0];
        var y = sp[1];
        var v = (grids[i] - min) / step;
        //var color = fillColors[v | 0];
        var color = obj.dataRange.getColorByGradient(grids[i]);
        try{
            if(options.opacity){
                var alpha = parseInt(color.match(/rgba\(.+?\,.+?\,.+?\,(.+?)\)/)[1] * options.opacity)/255;
                color = color.replace(/(rgba\(.+?\,.+?\,.+?\,).+?(\))/,'$1'+ alpha +'$2');
            }
        }catch(e){

        }

        var isTooSmall = self.masker.min && (grids[i] < self.masker.min);
        var isTooBig = self.masker.max && (grids[i] > self.masker.max);
        if (grids[i] === 0 || isTooSmall || isTooBig) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
        } else {
            ctx.fillStyle = color;
        }
        ctx.fillRect(x, y, gridStep - 1, gridStep - 1);


        if (self.getDrawOptions().label && self.getDrawOptions().label.show) {

            ctx.save();
            ctx.textBaseline = 'top';
            if (grids[i] !== 0 && !isTooSmall && !isTooBig) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillText(grids[i], x, y);
            }
            ctx.restore();
        }
    }
}

function honeycombGrid(obj) {
    var data = obj.data;
    var nwMc = obj.nwMc;
    var size = obj.size;
    var zoomUnit = obj.zoomUnit;
    var ctx = obj.ctx;
    var max;
    var min;

    var grids = {};

    var gridStep = size / zoomUnit;

    var depthX = gridStep;
    var depthY = gridStep * 3 / 4;

    var sizeY = 2 * size * 3 / 4;
    var startYMc = parseInt(nwMc.y / sizeY + 1, 10) * sizeY;
    var startY = (nwMc.y - startYMc) / zoomUnit;
    startY = parseInt(startY, 10);

    // var yIsOdd = !!(startYMc / sizeY % 2);

    var sizeX = depthX * size;
    var startXMc = parseInt(nwMc.x / sizeX, 10) * sizeX;
    var startX = (startXMc - nwMc.x) / zoomUnit;
    startX = parseInt(startX, 10);

    var endX = parseInt(ctx.canvas.width + sizeX / zoomUnit, 10);
    var endY = parseInt(ctx.canvas.height + sizeY / zoomUnit, 10);

    var pointX = startX;
    var pointY = startY;

    var odd = false;
    while (pointY < endY) {
        while (pointX < endX) {
            var x = odd ? pointX - depthX / 2 : pointX;
            x = parseInt(x, 10);
            grids[x + '|' + pointY] = grids[x + '|' + pointY] || {
                x: x,
                y: pointY,
                len: 0
            };

            pointX += depthX;
        }
        odd = !odd;
        pointX = startX;
        pointY += depthY;
    }

    for (var i in data) {
        var count = data[i].count;
        var pX = data[i].px;
        var pY = data[i].py;

        var fixYIndex = Math.round((pY - startY) / depthY);
        var fixY = fixYIndex * depthY + startY;
        var fixXIndex = Math.round((pX - startX) / depthX);
        var fixX = fixXIndex * depthX + startX;

        if (fixYIndex % 2) {
            fixX = fixX - depthX / 2;
        }
        if (fixX < startX || fixX > endX || fixY < startY || fixY > endY) {
            continue;
        }

        if (grids[fixX + '|' + fixY]) {
            grids[fixX + '|' + fixY].len += count;
            var num = grids[fixX + '|' + fixY].len;
            max = max || num;
            min = min || num;
            max = Math.max(max, num);
            min = Math.min(min, num);
        }
    }

    return {
        grids: grids,
        max: max,
        min: min
    };

}

function drawHoneycomb(obj) {
    var options = formatParam.call(this);
    // console.log(options)
    // return false;
    var ctx = obj.ctx;
    var grids = obj.grids;
    var gridsW = obj.size / obj.zoomUnit;

    var color = obj.fillColors;
    var step = (obj.max - obj.min - 1) / color.length;

    var drowZero = false;

    // console.log()
    for (var i in grids) {
        var x = grids[i].x;
        var y = grids[i].y;
        var count = grids[i].len;
        var level = count / step | 0;
        level = level >= color.length ? color.length - 1 : level;
        level = level < 0 ? 0 : level;
        var useColor = obj.dataRange.getColorByGradient(count);
        try{
            if(options.opacity){
                var alpha = parseInt(useColor.match(/rgba\(.+?\,.+?\,.+?\,(.+?)\)/)[1] * options.opacity)/255;
                useColor = useColor.replace(/(rgba\(.+?\,.+?\,.+?\,).+?(\))/,'$1'+ alpha +'$2');
            }
        }catch(e){

        }
        
        // console.log(useColor);
        var isTooSmall = obj.sup.masker.min && (obj.sup.masker.min > count);
        var isTooBig = obj.sup.masker.max && (obj.sup.masker.max < count);
        if (count > 0 && !isTooSmall && !isTooBig) {
            draw(x, y, gridsW - 1, useColor, ctx);
        } else {
            if(drowZero){
                draw(x, y, gridsW - 1, 'rgba(0,0,0,0.4)', ctx);
            }
        }

        // draw text
        if (obj.sup.getDrawOptions().label &&  obj.sup.getDrawOptions().label.show && !isTooSmall && !isTooBig) {
            if(!(count==0 && drowZero==false)){
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillText(count, x, y);
                ctx.restore();
            }
        }
    }
    // console.log(obj, step);
}

var r =0;g=0;b=0;
function draw(x, y, gridStep, color, ctx) {
    ctx.beginPath();
    ctx.fillStyle = color;

    ctx.moveTo(x, y - gridStep / 2);
    ctx.lineTo(x + gridStep / 2, y - gridStep / 4);
    ctx.lineTo(x + gridStep / 2, y + gridStep / 4);
    ctx.lineTo(x, y + gridStep / 2);
    ctx.lineTo(x - gridStep / 2, y + gridStep / 4);
    ctx.lineTo(x - gridStep / 2, y - gridStep / 4);
    ctx.fill();
    ctx.closePath();
}


/**
 * format param
 * @return {[type]} [description]
 */
function formatParam() {

    var options = this.getDrawOptions();
    options = JSON.stringify(options);
    options = JSON.parse(options);
    // console.log(options)
    var fillColors = this.fillColors = [
        [73, 174, 34],
        [119, 191, 26],
        [160, 205, 18],
        [202, 221, 10],
        [248, 237, 1],
        [225, 222, 3],
        [254, 182, 10],
        [254, 126, 19],
        [254, 84, 27],
        [253, 54, 32]
    ];

    var size = options.size || '50';
    size = size + (options.unit || 'px');
    if (/px$/.test(size)) {
        size = parseInt(size, 10) * this.zoomUnit;
    } else {
        size = parseInt(size, 10);
    }
    options.size = size;
    options.colors = fillColors;
    return options
}
;/* globals Drawer, util drawOptions map*/

function HeatmapDrawer() {
    var self = this;
    self.masker = {};
    Drawer.apply(this, arguments);
    this._max = 20;
    this._data = [];
}

util.inherits(HeatmapDrawer, Drawer);

HeatmapDrawer.prototype.drawMap = function () {
    // console.log('---??? do ')
    var self = this;

    self.Scale && self.Scale.set({
        min: 0,
        max: self.getMax(),
        colors: this.getGradient()
    });

    this.beginDrawMap();

    var ctx = this.getCtx();

    this._width = ctx.canvas.width;
    this._height = ctx.canvas.height;
    var data = this.getLayer().getData();
    this._data = data;
    console.time('drawHeatMap');
    this.drawHeatmap();
    console.timeEnd('drawHeatMap');

    this.endDrawMap();
};

HeatmapDrawer.prototype.scale = function (scale) {
    var self = this;

    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };

        self.drawMap();
    });
    self.Scale = scale;
};

util.extend(HeatmapDrawer.prototype, {

    defaultRadius: 10,

    defaultGradient: {
        '0.4': 'blue',
        '0.6': 'cyan',
        '0.7': 'lime',
        '0.8': 'yellow',
        '1.0': 'red'
    },

    getGradient: function () {
        return this.getDrawOptions().gradient || this.defaultGradient;
    },

    getMax: function () {
        var max = this._max;
        if (this.getDrawOptions().max !== undefined) {
            max = this.getDrawOptions().max;
        } else {
            var dataRange = this.getLayer().getDataRange();
            max = dataRange.min + (dataRange.max - dataRange.min) * 0.7;
        }
        return max;
    },

    data: function (data) {
        this._data = data;
        return this;
    },

    max: function (max) {
        this._max = max;
        return this;
    },

    add: function (point) {
        this._data.push(point);
        return this;
    },

    clear: function () {
        this._data = [];
        return this;
    },

    radius: function (r) {

        if (this.getDrawOptions().shadowBlur !== undefined) {
            var blur = parseFloat(this.getDrawOptions().shadowBlur);
        } else {
            var blur = 15;
        }

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = document.createElement('canvas'),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        if (this.getDrawOptions().type === 'rect') {
            circle.width = circle.height = r2;
        } else {
            circle.width = circle.height = r2 * 2;
        }

        var offsetDistance = 10000;

        ctx.shadowOffsetX = ctx.shadowOffsetY = offsetDistance;

        ctx.shadowBlur = blur;

        ctx.shadowColor = 'black';

        ctx.beginPath();
        if (this.getDrawOptions().type === 'rect') {
            ctx.fillRect(-offsetDistance, -offsetDistance, circle.width, circle.height);
        } else {
            ctx.arc(r2 - offsetDistance, r2 - offsetDistance, r, 0, Math.PI * 2, true);
        }
        ctx.closePath();
        ctx.fill();

        return this;
    },

    drawHeatmap: function (minOpacity) {
        // if (!this._circle) {
        this.radius(this.getRadius());
        // }

        var ctx = this.getCtx();
        ctx.save();

        ctx.clearRect(0, 0, this._width, this._height);

        // console.log(this.masker)
        // draw a grayscale heatmap by putting a blurred circle at each data point
        var dataType = this.getLayer().getDataType();
        if (dataType === 'polyline') {
            ctx.strokeStyle = this.getDrawOptions().strokeStyle || 'rgba(0, 0, 0, 0.05)';

            /*
            ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0.1;
            ctx.shadowColor = 'black';
            */

            ctx.lineWidth = this.getDrawOptions().lineWidth || 1;
            for (var i = 0, len = this._data.length; i < len; i++) {
                p = this._data[i];
                var geo = p.pgeo;
                ctx.moveTo(geo[0][0], geo[0][1]);
                for (var j = 1; j < geo.length; j++) {
                    ctx.lineTo(geo[j][0], geo[j][1]);
                }
            }
            ctx.stroke();

        } else {

            var boundary = this.getDrawOptions().boundary || 50;

            console.time('drawImageData');
            console.log('data', this._data.length, this._data);
            var max = this.getMax();
            for (var i = 0, len = this._data.length, p; i < len; i++) {
                p = this._data[i];
                if (p.px < -boundary || p.py < -boundary || p.px > ctx.canvas.width + boundary || p.py > ctx.canvas.height + boundary) {
                    continue;
                }
                // if (p.count < this.masker.min || p.count > this.masker.max) {
                //     continue;
                // }
                // console.log(p.count)
                ctx.globalAlpha = Math.max(p.count / max, minOpacity === undefined ? 0.05 : minOpacity);
                ctx.drawImage(this._circle, p.px - this._r, p.py - this._r);
            }
            console.timeEnd('drawImageData');
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        // console.log( this._width, this._height)
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        console.time('colorize');
        this.colorize(colored.data, this.dataRange.getGradient());
        console.timeEnd('colorize');
        ctx.putImageData(colored, 0, 0);

        ctx.restore();
        return this;
    },

    colorize: function (pixels, gradient) {
        var jMin = 0;
        var jMax = 1024;
        if (this.masker.min) {
            jMin = this.masker.min / this.getMax() * 1024;
        }

        if (this.masker.max) {
            jMax = this.masker.max / this.getMax() * 1024;
        }

        var maxOpacity = this.getDrawOptions().maxOpacity || 0.8;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value

            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }

            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            } else {
                pixels[i] = 0;
            }
        }
    }
});
;/* globals Drawer, util */

function IntensityDrawer() {
    this.masker = {
        min: 0,
        max: 0
    };
    Drawer.apply(this, arguments);

    // 临时canvas，用来绘制颜色条，获取颜色
    this._tmpCanvas = document.createElement('canvas');
}

util.inherits(IntensityDrawer, Drawer);

IntensityDrawer.prototype.defaultGradient = {
    '0.0': 'yellow',
    '1.0': 'red'
};

IntensityDrawer.prototype.drawMap = function () {
    this.Scale && this.Scale.set({
        min: 0,
        max: this.getMax(),
        colors: this.getGradient()
    });

    this.dataRange.setMax(this.getMax());

    this.beginDrawMap();

    var self = this;
    var ctx = this.getCtx();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    var data = this.getLayer().getData();
    var drawOptions = this.getDrawOptions();
    ctx.strokeStyle = drawOptions.strokeStyle;

    var ctxW = ctx.canvas.width;
    var ctxH = ctx.canvas.height;

    window.console.time('drawMap');

    var radius = this.getRadius();

    var dataType = this.getLayer().getDataType();

    var label = drawOptions.label;
    var zoom = this.getMap().getZoom();
    if (label) {
        if (label.font) {
            ctx.font = label.font;
        }
    }

    if (dataType === 'polygon') {

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var geo = item.pgeo;

            var isTooSmall = self.masker.min && (item.count < self.masker.min);
            var isTooBig = self.masker.max && (item.count > self.masker.max);
            if (isTooSmall || isTooBig) {
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(geo[0][0], geo[0][1]);
            ctx.fillStyle = this.dataRange.getColorByGradient(data[i].count);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }
            ctx.closePath();
            ctx.fill();

            if (drawOptions.strokeStyle) {
                ctx.stroke();
            }

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i].count, center[0], center[1]);
            }
        }

    } else { 

        // 画点数据
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            if (item.px < 0 || item.px > ctxW || item.py < 0 || item.py > ctxH) {
                continue;
            }
            var isTooSmall = self.masker.min && (item.count < self.masker.min);
            var isTooBig = self.masker.max && (item.count > self.masker.max);
            if (isTooSmall || isTooBig) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(item.px, item.py);
            ctx.fillStyle = this.dataRange.getColorByGradient(item.count);
            ctx.arc(item.px, item.py, radius || 1, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

    }

    window.console.timeEnd('drawMap');

    if (drawOptions.strokeStyle) {
        ctx.stroke();
    }

    this.endDrawMap();
};

IntensityDrawer.prototype.getGradient = function () {
    return this.getDrawOptions().gradient || this.defaultGradient;
}

IntensityDrawer.prototype.scale = function (scale) {
    var self = this;

    scale.change(function (min, max) {
        self.masker = {
            min: min,
            max: max
        };

        self.drawMap();
    });
    self.Scale = scale;
};

IntensityDrawer.prototype.getMax = function () {
    var dataRange = this.getLayer().getDataRange();
    var max = dataRange.max;

    if (this.getDrawOptions().max) {
        max = this.getDrawOptions().max;
    }
    return max;
};
;function SimpleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(SimpleDrawer, Drawer);

SimpleDrawer.prototype.drawMap = function (time) {
    if (this.getLayer().getContext() === 'webgl') {
        this.drawWebglMap();
        return;
    }

    this.beginDrawMap();

    var data = this.getLayer().getData();
    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();
    //console.log('????',drawOptions)

    ctx.beginPath();

    var radius = this.getRadius();

    var dataType = this.getLayer().getDataType();

    if (dataType === 'polyline' || dataType === 'polygon') { // 画线或面

        var label = drawOptions.label;
        var zoom = this.getMap().getZoom();
        if (label) {
            if (label.font) {
                ctx.font = label.font;
            }
            var labelKey = label.key || 'count';
        }

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            var startIndex = 0, //开始的索引
                endIndex = geo.length - 1; //结束的索引

            if (time) { // 按时间动画展示
                for (var j = 0; j < geo.length; j++) {
                    if (parseFloat(geo[j][2]) < time - 60 * 60 * 3) {
                        startIndex = j;
                    }
                    endIndex = j;
                    if (parseFloat(geo[j][2]) > time) {
                        break;
                    }
                }
            }

            if (startIndex >= endIndex) {
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(geo[startIndex][0], geo[startIndex][1]);

            for (var j = startIndex + 1; j <= endIndex; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
            }

            if (dataType === 'polygon') {
                ctx.closePath();
                ctx.fill();
            }

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                ctx.save();
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i][labelKey], center[0], center[1]);
                ctx.restore();
            }

        }


    } else { // 画点

        if (drawOptions.strokeStyle || drawOptions.globalCompositeOperation) {
            // 圆描边或设置颜色叠加方式需要一个个元素进行绘制
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(item.px, item.py);
                ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
                ctx.fill();
                if (drawOptions.strokeStyle) {
                    ctx.stroke();
                }
            }

        } else {
            //普通填充可一起绘制路径，最后再统一填充，性能上会好点
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.moveTo(item.px, item.py);
                if (radius < 2) {
                    ctx.fillRect(item.px, item.py, radius * 2, radius * 2);
                } else {
                    ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
                }
            }

            ctx.fill();
        }

    }

    this.endDrawMap();
}

/**
 * 绘制动画
 */
SimpleDrawer.prototype.drawAnimation = function () {
    var layer = this.getLayer();
    var data = layer.getData();
    var dataType = layer.getDataType();
    var animationOptions = layer.getAnimationOptions();
    var animation = layer.getAnimation();
    var ctx = layer.getAnimationCtx();

    if (dataType === 'polyline') {
        if (animation === 'time') {
        } else {
            for (var i = 0, len = data.length; i < len; i++) {
                var index = data[i].index;
                var pgeo = data[i].pgeo;

                /* 设定渐变区域 */
                var x = pgeo[index][0];
                var y = pgeo[index][1];
                var grad  = ctx.createRadialGradient(x, y, 0, x, y, animationOptions.size);
                grad.addColorStop(0,'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.4,'rgba(255, 255, 255, 0.9)');
                grad.addColorStop(1,'rgba(255, 255, 255, 0)');
                ctx.fillStyle = grad;

                ctx.beginPath();
                ctx.arc(x, y, animationOptions.size, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                data[i].index++;
                if (data[i].index >= data[i].pgeo.length) {
                    data[i].index = 0;
                }
            }
        }
    }
}

// 使用webgl来绘点，支持更大数据量的点
SimpleDrawer.prototype.drawWebglMap = function () {

    var data = this.getLayer().getData();

    if (!data) {
        return;
    }

    var gl = this.getCtx();

    var vs, fs, vs_s, fs_s;

    vs = gl.createShader(gl.VERTEX_SHADER);
    fs = gl.createShader(gl.FRAGMENT_SHADER);

    vs_s = [
        'attribute vec4 a_Position;',
        'attribute float a_PointSize;',
        'void main() {',
            'gl_Position = a_Position;',
            'gl_PointSize = a_PointSize;',
        '}'
    ].join('');

    fs_s = [
        'precision mediump float;',
        'uniform vec4 u_FragColor;',
        'void main() {',
            'gl_FragColor = u_FragColor;',
        '}'
    ].join('');

    var program = gl.createProgram();
    gl.shaderSource(vs, vs_s);
    gl.compileShader(vs);
    gl.shaderSource(fs, fs_s);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    var verticesData = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];

        var x = (item.px - halfCanvasWidth) / halfCanvasWidth;
        var y = (halfCanvasHeight - item.py) / halfCanvasHeight;

        if (x < -1 || x > 1 || y < -1 || y > 1) {
            continue;
        }
        verticesData.push(x, y);
        count++;
    }

    var vertices = new Float32Array(verticesData);
    var n = count; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, this.getRadius());

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = this.getDrawOptions().fillStyle;
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor,
    colored[0] / 255,
    colored[1] / 255,
    colored[2] / 255,
    colored[3] / 255);
    gl.drawArrays(gl.POINTS, 0 , n);
}
;    Mapv.Layer = Layer;
    this.Mapv = Mapv;
}();
