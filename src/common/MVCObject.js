/**
 * @file MVC架构
 *
 */
var MVCObject;
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
