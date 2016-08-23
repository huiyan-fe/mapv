/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 * 一些常用的方法库
 */

var util = {
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
                    util.extend(destination[i], source[i]);
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
    },

    // 获取Device的Pixel Ratio
    getPixelRatio: function(context) {
        var backingStore = context.backingStorePixelRatio ||
                            context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    }

};
