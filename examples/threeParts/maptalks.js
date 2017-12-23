/*!
 * maptalks v0.36.2
 * LICENSE : BSD-3-Clause
 * (c) 2016-2017 maptalks.org
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.maptalks = global.maptalks || {})));
}(this, (function (exports) { 'use strict';

var INTERNAL_LAYER_PREFIX = '_maptalks__internal_layer_';

var GEOMETRY_COLLECTION_TYPES = ['MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];

var GEOJSON_TYPES = ['FeatureCollection', 'Feature', 'Point', 'LineString', 'Polygon'].concat(GEOMETRY_COLLECTION_TYPES);

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function now() {
    return Date.now();
}

function extend(dest) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        for (var k in src) {
            dest[k] = src[k];
        }
    }
    return dest;
}

function isNil(obj) {
    return obj == null;
}

function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
}

function isInteger(n) {
    return (n | 0) === n;
}

function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !!obj;
}

function isString(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'string' || obj.constructor !== null && obj.constructor === String;
}

function isFunction(obj) {
    if (isNil(obj)) {
        return false;
    }
    return typeof obj === 'function' || obj.constructor !== null && obj.constructor === Function;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function join(arr, seperator) {
    if (arr.join) {
        return arr.join(seperator || ',');
    } else {
        return Array.prototype.join.call(arr, seperator || ',');
    }
}

var IS_NODE = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]' && !process.versions['electron'] && !process.versions['nw'] && !process.versions['node-webkit'];

var requestAnimFrame = void 0;
var cancelAnimFrame = void 0;

(function () {
    if (IS_NODE) {
        requestAnimFrame = function requestAnimFrame(fn) {
            return setTimeout(fn, 16);
        };

        cancelAnimFrame = clearTimeout;
        return;
    }

    var requestFn = void 0,
        cancelFn = void 0;

    var timeToCall = 1000 / 30;
    function timeoutDefer(fn) {
        return setTimeout(fn, timeToCall);
    }

    function getPrefixed(name) {
        return window['webkit' + name] || window['moz' + name] || window['ms' + name];
    }
    if (typeof window != 'undefined') {

        requestFn = window['requestAnimationFrame'] || getPrefixed('RequestAnimationFrame') || timeoutDefer;
        cancelFn = window['cancelAnimationFrame'] || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
            window.clearTimeout(id);
        };
    } else {
        requestFn = timeoutDefer;
        cancelFn = clearTimeout;
    }

    requestAnimFrame = function requestAnimFrame(fn) {
        return requestFn(fn);
    };

    cancelAnimFrame = function cancelAnimFrame(id) {
        if (id) {
            cancelFn(id);
        }
    };
})();
function isSVG(url) {
    var prefix = 'data:image/svg+xml';
    if (url.length > 4 && url.slice(-4) === '.svg') {
        return 1;
    } else if (url.slice(0, prefix.length) === prefix) {
        return 2;
    }
    return 0;
}

function loadImage(img, imgDesc) {
    if (IS_NODE && loadImage.node) {
        loadImage.node(img, imgDesc);
        return;
    }
    img.src = imgDesc[0];
}

var uid = 0;

function UID() {
    return uid++;
}
var GUID = UID;

function parseJSON(str) {
    if (!str || !isString(str)) {
        return str;
    }
    return JSON.parse(str);
}

function pushIn(arr1, arr2) {
    for (var i = 0, l = arr2.length; i < l; i++) {
        arr1.push(arr2[i]);
    }
    return arr1.length;
}

function removeFromArray(obj, array) {
    var i = array.indexOf(obj);
    if (i > -1) {
        array.splice(i, 1);
    }
}

function mapArrayRecursively(arr, fn, context) {
    if (!Array.isArray(arr)) {
        return context ? fn.call(context, arr) : fn(arr);
    }
    var result = [];
    var p = void 0,
        pp = void 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        p = arr[i];
        if (isNil(p)) {
            result.push(null);
            continue;
        }
        if (Array.isArray(p)) {
            result.push(mapArrayRecursively(p, fn, context));
        } else {
            pp = context ? fn.call(context, p) : fn(p);
            result.push(pp);
        }
    }
    return result;
}

function getValueOrDefault(v, d) {
    return v === undefined ? d : v;
}

function sign(x) {
    if (Math.sign) {
        return Math.sign(x);
    }
    x = +x;
    if (x === 0 || isNaN(x)) {
        return Number(x);
    }
    return x > 0 ? 1 : -1;
}

function interpolate(a, b, t) {
    return a * (1 - t) + b * t;
}

function wrap(n, min, max) {
    var d = max - min;
    var w = ((n - min) % d + d) % d + min;
    return w;
}

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

function isArrayHasData(obj) {
    return Array.isArray(obj) && obj.length > 0;
}

function isURL(url) {
    if (!url) {
        return false;
    }
    var head = url.slice(0, 6);
    if (head === 'http:/' || head === 'https:' || head === 'file:/') {
        return true;
    }
    return false;
}

var cssUrlReWithQuote = /^url\((['"])(.+)\1\)$/i;

var cssUrlRe = /^url\(([^'"].*[^'"])\)$/i;

function isCssUrl(str) {
    if (!isString(str)) {
        return 0;
    }
    var head = str.slice(0, 6);
    if (head === 'http:/' || head === 'https:') {
        return 3;
    }
    if (cssUrlRe.test(str)) {
        return 1;
    }
    if (cssUrlReWithQuote.test(str)) {
        return 2;
    }
    return 0;
}

function extractCssUrl(str) {
    var test = isCssUrl(str);
    var matches = void 0;
    if (test === 3) {
        return str;
    }
    if (test === 1) {
        matches = cssUrlRe.exec(str);
        return matches[1];
    } else if (test === 2) {
        matches = cssUrlReWithQuote.exec(str);
        return matches[2];
    } else {
        return str;
    }
}

var b64chrs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function btoa(input) {
    if (typeof window !== 'undefined' && window.btoa) {
        return window.btoa(input);
    }
    var str = String(input);
    var output = '';
    for (var block, charCode, idx = 0, map = b64chrs; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new Error('\'btoa\' failed: The string to be encoded contains characters outside of the Latin1 range.');
        }
        block = block << 8 | charCode;
    }
    return output;
}

function computeDegree(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.atan2(dy, dx);
}

var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function equalMapView(obj1, obj2) {
    if (!obj1 && !obj2) {
        return true;
    } else if (!obj1 || !obj2) {
        return false;
    }
    for (var p in obj1) {
        if (p === 'center') {
            if (!obj2[p] || !approx(obj1[p][0], obj2[p][0]) || !approx(obj1[p][1], obj2[p][1])) {
                return false;
            }
        } else if (obj1[p] !== obj2[p]) {
            return false;
        }
    }
    return true;
}

function approx(val, expected, delta) {
    if (delta == null) {
        delta = 1e-6;
    }
    return val >= expected - delta && val <= expected + delta;
}

function flash(interval, count, cb, context) {
    if (!interval) {
        interval = 100;
    }
    if (!count) {
        count = 4;
    }
    var me = this;
    count *= 2;
    if (this._flashTimeout) {
        clearTimeout(this._flashTimeout);
    }

    function flashGeo() {
        if (count === 0) {
            me.show();
            if (cb) {
                if (context) {
                    cb.call(context);
                } else {
                    cb();
                }
            }
            return;
        }

        if (count % 2 === 0) {
            me.hide();
        } else {
            me.show();
        }
        count--;
        me._flashTimeout = setTimeout(flashGeo, interval);
    }
    this._flashTimeout = setTimeout(flashGeo, interval);
    return this;
}

var types = ['Unknown', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'];

function createFilter(filter) {
    return new Function('f', 'var p = (f && f.properties || {}); return ' + compile(filter));
}

function compile(filter) {
    if (!filter) return 'true';
    var op = filter[0];
    if (filter.length <= 1) return op === 'any' ? 'false' : 'true';
    var str = op === '==' ? compileComparisonOp(filter[1], filter[2], '===', false) : op === '!=' ? compileComparisonOp(filter[1], filter[2], '!==', false) : op === '<' || op === '>' || op === '<=' || op === '>=' ? compileComparisonOp(filter[1], filter[2], op, true) : op === 'any' ? compileLogicalOp(filter.slice(1), '||') : op === 'all' ? compileLogicalOp(filter.slice(1), '&&') : op === 'none' ? compileNegation(compileLogicalOp(filter.slice(1), '||')) : op === 'in' ? compileInOp(filter[1], filter.slice(2)) : op === '!in' ? compileNegation(compileInOp(filter[1], filter.slice(2))) : op === 'has' ? compileHasOp(filter[1]) : op === '!has' ? compileNegation(compileHasOp(filter[1])) : 'true';
    return '(' + str + ')';
}

function compilePropertyReference(property) {
    return property[0] === '$' ? 'f.' + property.substring(1) : 'p[' + JSON.stringify(property) + ']';
}

function compileComparisonOp(property, value, op, checkType) {
    var left = compilePropertyReference(property);
    var right = property === '$type' ? types.indexOf(value) : JSON.stringify(value);
    return (checkType ? 'typeof ' + left + '=== typeof ' + right + '&&' : '') + left + op + right;
}

function compileLogicalOp(expressions, op) {
    return expressions.map(compile).join(op);
}

function compileInOp(property, values) {
    if (property === '$type') values = values.map(function (value) {
        return types.indexOf(value);
    });
    var left = JSON.stringify(values.sort(compare));
    var right = compilePropertyReference(property);

    if (values.length <= 200) return left + '.indexOf(' + right + ') !== -1';

    return '' + ('function(v, a, i, j) {' + 'while (i <= j) { var m = (i + j) >> 1;' + '    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;' + '}' + 'return false; }(') + right + ', ' + left + ',0,' + (values.length - 1) + ')';
}

function compileHasOp(property) {
    return property === '$id' ? '"id" in f' : JSON.stringify(property) + ' in p';
}

function compileNegation(expression) {
    return '!(' + expression + ')';
}

function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

function getFilterFeature(geometry) {
    var json = geometry._toJSON(),
        g = json['feature'];
    g['type'] = types.indexOf(g['geometry']['type']);
    g['subType'] = json['subType'];
    return g;
}

function compileStyle(styles) {
    if (!Array.isArray(styles)) {
        return compileStyle([styles]);
    }
    var compiled = [];
    for (var i = 0; i < styles.length; i++) {
        if (styles[i]['filter'] === true) {
            compiled.push({
                filter: function filter() {
                    return true;
                },
                symbol: styles[i].symbol
            });
        } else {
            compiled.push({
                filter: createFilter(styles[i]['filter']),
                symbol: styles[i].symbol
            });
        }
    }
    return compiled;
}

function createFunction(parameters, defaultType) {
    var fun;

    if (!isFunctionDefinition(parameters)) {
        fun = function fun() {
            return parameters;
        };
        fun.isFeatureConstant = true;
        fun.isZoomConstant = true;
    } else {
        var zoomAndFeatureDependent = parameters.stops && _typeof(parameters.stops[0][0]) === 'object';
        var featureDependent = zoomAndFeatureDependent || parameters.property !== undefined;
        var zoomDependent = zoomAndFeatureDependent || !featureDependent;
        var type = parameters.type || defaultType || 'exponential';

        var innerFun;
        if (type === 'exponential') {
            innerFun = evaluateExponentialFunction;
        } else if (type === 'interval') {
            innerFun = evaluateIntervalFunction;
        } else if (type === 'categorical') {
            innerFun = evaluateCategoricalFunction;
        } else if (type === 'identity') {
            innerFun = evaluateIdentityFunction;
        } else {
            throw new Error('Unknown function type "' + type + '"');
        }

        if (zoomAndFeatureDependent) {
            var featureFunctions = {};
            var featureFunctionStops = [];
            for (var s = 0; s < parameters.stops.length; s++) {
                var stop = parameters.stops[s];
                if (featureFunctions[stop[0].zoom] === undefined) {
                    featureFunctions[stop[0].zoom] = {
                        zoom: stop[0].zoom,
                        type: parameters.type,
                        property: parameters.property,
                        stops: []
                    };
                }
                featureFunctions[stop[0].zoom].stops.push([stop[0].value, stop[1]]);
            }

            for (var z in featureFunctions) {
                featureFunctionStops.push([featureFunctions[z].zoom, createFunction(featureFunctions[z])]);
            }
            fun = function fun(zoom, feature) {
                return evaluateExponentialFunction({ stops: featureFunctionStops, base: parameters.base }, zoom)(zoom, feature);
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = false;
        } else if (zoomDependent) {
            fun = function fun(zoom) {
                return innerFun(parameters, zoom);
            };
            fun.isFeatureConstant = true;
            fun.isZoomConstant = false;
        } else {
            fun = function fun(zoom, feature) {
                return innerFun(parameters, feature[parameters.property]);
            };
            fun.isFeatureConstant = false;
            fun.isZoomConstant = true;
        }
    }

    return fun;
}

function evaluateCategoricalFunction(parameters, input) {
    for (var i = 0; i < parameters.stops.length; i++) {
        if (input === parameters.stops[i][0]) {
            return parameters.stops[i][1];
        }
    }
    return parameters.stops[0][1];
}

function evaluateIntervalFunction(parameters, input) {
    for (var i = 0; i < parameters.stops.length; i++) {
        if (input < parameters.stops[i][0]) break;
    }
    return parameters.stops[Math.max(i - 1, 0)][1];
}

function evaluateExponentialFunction(parameters, input) {
    var base = parameters.base !== undefined ? parameters.base : 1;

    var i = 0;
    while (true) {
        if (i >= parameters.stops.length) break;else if (input <= parameters.stops[i][0]) break;else i++;
    }

    if (i === 0) {
        return parameters.stops[i][1];
    } else if (i === parameters.stops.length) {
        return parameters.stops[i - 1][1];
    } else {
        return interpolate$1(input, base, parameters.stops[i - 1][0], parameters.stops[i][0], parameters.stops[i - 1][1], parameters.stops[i][1]);
    }
}

function evaluateIdentityFunction(parameters, input) {
    return input;
}

function interpolate$1(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    if (typeof outputLower === 'function') {
        return function () {
            var evaluatedLower = outputLower.apply(undefined, arguments);
            var evaluatedUpper = outputUpper.apply(undefined, arguments);
            return interpolate$1(input, base, inputLower, inputUpper, evaluatedLower, evaluatedUpper);
        };
    } else if (outputLower.length) {
        return interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper);
    } else {
        return interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper);
    }
}

function interpolateNumber(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    var difference = inputUpper - inputLower;
    var progress = input - inputLower;

    var ratio;
    if (base === 1) {
        ratio = progress / difference;
    } else {
        ratio = (Math.pow(base, progress) - 1) / (Math.pow(base, difference) - 1);
    }

    return outputLower * (1 - ratio) + outputUpper * ratio;
}

function interpolateArray(input, base, inputLower, inputUpper, outputLower, outputUpper) {
    var output = [];
    for (var i = 0; i < outputLower.length; i++) {
        output[i] = interpolateNumber(input, base, inputLower, inputUpper, outputLower[i], outputUpper[i]);
    }
    return output;
}

function isFunctionDefinition(obj) {
    return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && (obj.stops || obj.property && obj.type === 'identity');
}

function hasFunctionDefinition(obj) {
    for (var p in obj) {
        if (isFunctionDefinition(obj[p])) {
            return true;
        }
    }
    return false;
}

function interpolated(parameters) {
    return createFunction(parameters, 'exponential');
}

function piecewiseConstant(parameters) {
    return createFunction(parameters, 'interval');
}

function loadFunctionTypes(obj, argFn) {
    if (!obj) {
        return null;
    }
    var hit = false;
    if (Array.isArray(obj)) {
        var multResult = [],
            loaded;
        for (var i = 0; i < obj.length; i++) {
            loaded = loadFunctionTypes(obj[i], argFn);
            if (!loaded) {
                multResult.push(obj[i]);
            } else {
                multResult.push(loaded);
                hit = true;
            }
        }
        return hit ? multResult : obj;
    }
    var result = {
        '__fn_types_loaded': true
    },
        props = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            props.push(p);
        }
    }

    for (var _i = 0, len = props.length; _i < len; _i++) {
        p = props[_i];
        if (isFunctionDefinition(obj[p])) {
            hit = true;
            result['_' + p] = obj[p];
            (function (_p) {
                Object.defineProperty(result, _p, {
                    get: function get$$1() {
                        if (!this['__fn_' + _p]) {
                            this['__fn_' + _p] = interpolated(this['_' + _p]);
                        }
                        return this['__fn_' + _p].apply(this, argFn());
                    },
                    set: function set$$1(v) {
                        this['_' + _p] = v;
                    },
                    configurable: true,
                    enumerable: true
                });
            })(p);
        } else {
            result[p] = obj[p];
        }
    }
    return hit ? result : obj;
}

function getFunctionTypeResources(t) {
    if (!t || !t.stops) {
        return [];
    }
    var res = [];
    for (var i = 0, l = t.stops.length; i < l; i++) {
        res.push(t.stops[i][1]);
    }
    return res;
}



var index$1 = Object.freeze({
	createFilter: createFilter,
	getFilterFeature: getFilterFeature,
	compileStyle: compileStyle,
	isFunctionDefinition: isFunctionDefinition,
	hasFunctionDefinition: hasFunctionDefinition,
	interpolated: interpolated,
	piecewiseConstant: piecewiseConstant,
	loadFunctionTypes: loadFunctionTypes,
	getFunctionTypeResources: getFunctionTypeResources
});

var Symbolizer = function () {
    function Symbolizer() {
        classCallCheck(this, Symbolizer);
    }

    Symbolizer.prototype.getMap = function getMap() {
        return this.geometry.getMap();
    };

    Symbolizer.prototype.getPainter = function getPainter() {
        return this.painter;
    };

    Symbolizer.testColor = function testColor(prop) {
        if (!prop || !isString(prop)) {
            return false;
        }
        if (Symbolizer.colorProperties.indexOf(prop) >= 0) {
            return true;
        }
        return false;
    };

    return Symbolizer;
}();

Symbolizer.resourceProperties = ['markerFile', 'polygonPatternFile', 'linePatternFile', 'markerFillPatternFile', 'markerLinePatternFile'];

Symbolizer.resourceSizeProperties = [['markerWidth', 'markerHeight'], [], [null, 'lineWidth'], [], [null, 'markerLineWidth']];

Symbolizer.numericalProperties = {
    'lineWidth': 1,
    'lineOpacity': 1,
    'lineDx': 1,
    'lineDy': 1,
    'polygonOpacity': 1,
    'markerWidth': 1,
    'markerHeight': 1,
    'markerDx': 1,
    'markerDy': 1,
    'markerOpacity': 1,
    'markerFillOpacity': 1,
    'markerLineWidth': 1,
    'markerLineOpacity': 1,
    'textSize': 1,
    'textOpacity': 1,
    'textHaloRadius': 1,
    'textWrapWidth': 1,
    'textLineSpacing': 1,
    'textDx': 1,
    'textDy': 1
};

Symbolizer.colorProperties = ['lineColor', 'polygonFill', 'markerFill', 'markerLineColor', 'textFill'];

var CanvasSymbolizer = function (_Symbolizer) {
    inherits(CanvasSymbolizer, _Symbolizer);

    function CanvasSymbolizer() {
        classCallCheck(this, CanvasSymbolizer);
        return possibleConstructorReturn(this, _Symbolizer.apply(this, arguments));
    }

    CanvasSymbolizer.prototype._prepareContext = function _prepareContext(ctx) {
        if (isNumber(this.symbol['opacity'])) {
            if (ctx.globalAlpha !== this.symbol['opacity']) {
                ctx.globalAlpha = this.symbol['opacity'];
            }
        } else if (ctx.globalAlpha !== 1) {
            ctx.globalAlpha = 1;
        }
    };

    CanvasSymbolizer.prototype.remove = function remove() {};

    CanvasSymbolizer.prototype.setZIndex = function setZIndex() {};

    CanvasSymbolizer.prototype.show = function show() {};

    CanvasSymbolizer.prototype.hide = function hide() {};

    CanvasSymbolizer.prototype._defineStyle = function _defineStyle(style) {
        var _this2 = this;

        return loadFunctionTypes(style, function () {
            return [_this2.getMap().getZoom(), _this2.geometry.getProperties()];
        });
    };

    return CanvasSymbolizer;
}(Symbolizer);

var Point = function () {
    function Point(x, y) {
        classCallCheck(this, Point);

        if (!isNil(x) && !isNil(y)) {
            this.x = x;

            this.y = y;
        } else if (!isNil(x.x) && !isNil(x.y)) {
            this.x = x.x;
            this.y = x.y;
        } else if (isArrayHasData(x)) {
            this.x = x[0];
            this.y = x[1];
        }
        if (this._isNaN()) {
            throw new Error('point is NaN');
        }
    }

    Point.prototype.abs = function abs() {
        return new Point(Math.abs(this.x), Math.abs(this.y));
    };

    Point.prototype._abs = function _abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    };

    Point.prototype.copy = function copy() {
        return new Point(this.x, this.y);
    };

    Point.prototype._round = function _round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };

    Point.prototype.round = function round() {
        return new Point(Math.round(this.x), Math.round(this.y));
    };

    Point.prototype._ceil = function _ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };

    Point.prototype.ceil = function ceil() {
        return new Point(Math.ceil(this.x), Math.ceil(this.y));
    };

    Point.prototype._floor = function _floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };

    Point.prototype.floor = function floor() {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    };

    Point.prototype.equals = function equals(p) {
        return this.x === p.x && this.y === p.y;
    };

    Point.prototype.closeTo = function closeTo(p, delta) {
        if (!delta) {
            delta = 0;
        }
        return this.x >= p.x - delta && this.x <= p.x + delta && this.y >= p.y - delta && this.y <= p.y + delta;
    };

    Point.prototype.distanceTo = function distanceTo(point) {
        var x = point.x - this.x,
            y = point.y - this.y;
        return Math.sqrt(x * x + y * y);
    };

    Point.prototype._add = function _add(x, y) {
        if (!isNil(x.x)) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    };

    Point.prototype.add = function add(x, y) {
        var nx = void 0,
            ny = void 0;
        if (!isNil(x.x)) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Point(nx, ny);
    };

    Point.prototype._sub = function _sub(x, y) {
        if (!isNil(x.x)) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    };

    Point.prototype._substract = function _substract() {
        return this._sub.apply(this, arguments);
    };

    Point.prototype.sub = function sub(x, y) {
        var nx = void 0,
            ny = void 0;
        if (!isNil(x.x)) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Point(nx, ny);
    };

    Point.prototype.substract = function substract() {
        return this.sub.apply(this, arguments);
    };

    Point.prototype._multi = function _multi(n) {
        this.x *= n;
        this.y *= n;
        return this;
    };

    Point.prototype.multi = function multi(n) {
        return new Point(this.x * n, this.y * n);
    };

    Point.prototype.div = function div(n) {
        return this.multi(1 / n);
    };

    Point.prototype._div = function _div(n) {
        return this._multi(1 / n);
    };

    Point.prototype._isNaN = function _isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    };

    Point.prototype.toArray = function toArray$$1() {
        return [this.x, this.y];
    };

    Point.prototype.toJSON = function toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    };

    Point.prototype.mag = function mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Point.prototype.unit = function unit() {
        return this.copy()._unit();
    };

    Point.prototype._unit = function _unit() {
        this._div(this.mag());
        return this;
    };

    Point.prototype.perp = function perp() {
        return this.copy()._perp();
    };

    Point.prototype._perp = function _perp() {
        var y = this.y;
        this.y = this.x;
        this.x = -y;
        return this;
    };

    Point.prototype.isZero = function isZero() {
        return this.x === 0 && this.y === 0;
    };

    return Point;
}();

function isGradient(g) {
    return g && g['colorStops'];
}

function getGradientStamp(g) {
    var keys = [g['type']];
    if (g['places']) {
        keys.push(g['places'].join());
    }
    if (g['colorStops']) {
        var stops = [];
        for (var i = g['colorStops'].length - 1; i >= 0; i--) {
            stops.push(g['colorStops'][i].join());
        }
        keys.push(stops.join(','));
    }
    return keys.join('_');
}

function getSymbolStamp(symbol) {
    var keys = [];
    if (Array.isArray(symbol)) {
        for (var i = 0; i < symbol.length; i++) {
            keys.push(getSymbolStamp(symbol[i]));
        }
        return '[ ' + keys.join(' , ') + ' ]';
    }
    for (var p in symbol) {
        if (hasOwn(symbol, p)) {
            if (!isFunction(symbol[p])) {
                if (isGradient(symbol[p])) {
                    keys.push(p + '=' + getGradientStamp(symbol[p]));
                } else {
                    keys.push(p + '=' + symbol[p]);
                }
            }
        }
    }
    return keys.join(';');
}

function lowerSymbolOpacity(symbol, ratio) {
    function s(_symbol, _ratio) {
        var op = _symbol['opacity'];
        if (isNil(op)) {
            _symbol['opacity'] = _ratio;
        } else {
            _symbol['opacity'] *= _ratio;
        }
    }
    var lower = void 0;
    if (Array.isArray(symbol)) {
        lower = [];
        for (var i = 0; i < symbol.length; i++) {
            var d = extend({}, symbol[i]);
            s(d, ratio);
            lower.push(d);
        }
    } else {
        lower = extend({}, symbol);
        s(lower, ratio);
    }
    return lower;
}

function extendSymbol(symbol) {
    var sources = Array.prototype.slice.call(arguments, 1);
    if (!sources || !sources.length) {
        sources = [{}];
    }
    if (Array.isArray(symbol)) {
        var s = void 0,
            dest = void 0;
        var result = [];
        for (var i = 0, l = symbol.length; i < l; i++) {
            s = symbol[i];
            dest = {};
            for (var ii = 0, ll = sources.length; ii < ll; ii++) {
                if (!Array.isArray(sources[ii])) {
                    extend(dest, s, sources[ii] ? sources[ii] : {});
                } else if (!isNil(sources[ii][i])) {
                    extend(dest, s, sources[ii][i]);
                } else {
                    extend(dest, s ? s : {});
                }
            }
            result.push(dest);
        }
        return result;
    } else {
        var args = [{}, symbol];
        args.push.apply(args, sources);
        return extend.apply(this, args);
    }
}

var Size = function () {
    function Size(width, height) {
        classCallCheck(this, Size);

        if (isNumber(width) && isNumber(height)) {
            this.width = width;

            this.height = height;
        } else if (isNumber(width['width'])) {
            this.width = width.width;
            this.height = width.height;
        } else if (Array.isArray(width)) {
            this.width = width[0];
            this.height = width[1];
        }
    }

    Size.prototype.copy = function copy() {
        return new Size(this['width'], this['height']);
    };

    Size.prototype.add = function add(x, y) {
        var w = void 0,
            h = void 0;
        if (x instanceof Size) {
            w = this.width + x.width;
            h = this.height + x.height;
        } else {
            w = this.width + x;
            h = this.height + y;
        }
        return new Size(w, h);
    };

    Size.prototype.equals = function equals(size) {
        return this['width'] === size['width'] && this['height'] === size['height'];
    };

    Size.prototype.multi = function multi(ratio) {
        return new Size(this['width'] * ratio, this['height'] * ratio);
    };

    Size.prototype._multi = function _multi(ratio) {
        this['width'] *= ratio;
        this['height'] *= ratio;
        return this;
    };

    Size.prototype._round = function _round() {
        this['width'] = Math.round(this['width']);
        this['height'] = Math.round(this['height']);
        return this;
    };

    Size.prototype.toPoint = function toPoint() {
        return new Point(this['width'], this['height']);
    };

    Size.prototype.toArray = function toArray$$1() {
        return [this['width'], this['height']];
    };

    Size.prototype.toJSON = function toJSON() {
        return {
            'width': this['width'],
            'height': this['height']
        };
    };

    return Size;
}();

function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

var specialPattern = /[\b\t\r\v\f]/igm;

function escapeSpecialChars(str) {
    if (!isString(str)) {
        return str;
    }
    return str.replace(specialPattern, '');
}

function splitWords(chr) {
    return trim(chr).split(/\s+/);
}

var rulerCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;

function stringWidth(text, font) {
    if (stringWidth.node) {
        return stringWidth.node(text, font);
    }
    rulerCtx.font = font;
    return rulerCtx.measureText(text).width;
}

var fontHeight = {};

function stringLength(text, font) {
    if (stringLength.node) {
        return stringLength.node(text, font);
    } else {
        var w = stringWidth(text, font);
        if (!font) {
            font = '_default_';
        }
        if (!fontHeight[font]) {
            fontHeight[font] = getFontHeight(font);
        }
        return new Size(w, fontHeight[font]);
    }
}

function getFontHeight(font) {
    var domRuler = getDomRuler();
    if (font !== '_default_') {
        domRuler.style.font = font;
    }
    domRuler.innerHTML = '秦';
    var h = domRuler.clientHeight;

    removeDomNode(domRuler);
    return h;
}

function splitContent(content, font, wrapWidth, textWidth) {
    if (!content || content.length === 0) {
        return [{ 'text': '', 'width': 0 }];
    }
    var width = isNil(textWidth) ? stringWidth(content, font) : textWidth;
    var chrWidth = width / content.length,
        minChrCount = Math.floor(wrapWidth / chrWidth / 2);
    if (chrWidth >= wrapWidth || minChrCount <= 0) {
        return [{ 'text': '', 'width': wrapWidth }];
    }
    if (width <= wrapWidth) return [{ 'text': content, 'width': width }];
    var result = [];
    var testStr = content.substring(0, minChrCount),
        prew = chrWidth * minChrCount;
    for (var i = minChrCount, l = content.length; i < l; i++) {
        var chr = content[i];
        var w = stringWidth(testStr + chr);
        if (w >= wrapWidth) {
            result.push({ 'text': testStr, 'width': prew });
            testStr = content.substring(i, minChrCount + i);
            i += minChrCount - 1;
            prew = chrWidth * minChrCount;
        } else {
            testStr += chr;
            prew = w;
        }
        if (i >= l - 1) {
            prew = stringWidth(testStr);
            result.push({ 'text': testStr, 'width': prew });
        }
    }
    return result;
}

var contentExpRe = /\{([\w_]+)\}/g;

function replaceVariable(str, props) {
    if (!isString(str)) {
        return str;
    }
    return str.replace(contentExpRe, function (str, key) {
        if (!props) {
            return '';
        }
        var value = props[key];
        if (isNil(value)) {
            return '';
        } else if (Array.isArray(value)) {
            return value.join();
        }
        return value;
    });
}

function getAlignPoint(size, horizontalAlignment, verticalAlignment) {
    var width = size['width'],
        height = size['height'];
    var alignW = void 0,
        alignH = void 0;
    if (horizontalAlignment === 'left') {
        alignW = -width;
    } else if (horizontalAlignment === 'right') {
        alignW = 0;
    } else {
        alignW = -width / 2;
    }
    if (verticalAlignment === 'top') {
        alignH = -height;
    } else if (verticalAlignment === 'bottom') {
        alignH = 0;
    } else {
        alignH = -height / 2;
    }
    return new Point(alignW, alignH);
}

function getFont(style) {
    if (style['textFont']) {
        return style['textFont'];
    } else {
        return (style['textStyle'] && style['textStyle'] !== 'normal' ? style['textStyle'] + ' ' : '') + (style['textWeight'] && style['textWeight'] !== 'normal' ? style['textWeight'] + ' ' : '') + style['textSize'] + 'px ' + (style['textFaceName'][0] === '"' ? style['textFaceName'] : '"' + style['textFaceName'] + '"');
    }
}

function splitTextToRow(text, style) {
    var font = getFont(style),
        lineSpacing = style['textLineSpacing'] || 0,
        size = stringLength(text, font),
        textWidth = size['width'],
        textHeight = size['height'],
        wrapChar = style['textWrapCharacter'],
        textRows = [];
    var wrapWidth = style['textWrapWidth'];
    if (!wrapWidth || wrapWidth > textWidth) {
        wrapWidth = textWidth;
    }
    if (!isString(text)) {
        text += '';
    }
    var actualWidth = 0;
    if (wrapChar && text.indexOf(wrapChar) >= 0) {
        var texts = text.split(wrapChar);
        for (var i = 0, l = texts.length; i < l; i++) {
            var t = texts[i];
            var tWidth = stringWidth(t, font);
            if (tWidth > wrapWidth) {
                var contents = splitContent(t, font, wrapWidth, tWidth);
                for (var ii = 0, ll = contents.length; ii < ll; ii++) {
                    var w = contents[ii].width;
                    if (w > actualWidth) {
                        actualWidth = w;
                    }
                    textRows.push({
                        'text': contents[ii].text,
                        'size': new Size(w, textHeight)
                    });
                }
            } else {
                if (tWidth > actualWidth) {
                    actualWidth = tWidth;
                }
                textRows.push({
                    'text': t,
                    'size': new Size(tWidth, textHeight)
                });
            }
        }
    } else if (textWidth > wrapWidth) {
        var _contents = splitContent(text, font, wrapWidth, textWidth);
        for (var _i = 0; _i < _contents.length; _i++) {
            var _w = _contents[_i].width;
            if (_w > actualWidth) {
                actualWidth = _w;
            }
            textRows.push({
                'text': _contents[_i].text,
                'size': new Size(_w, textHeight)
            });
        }
    } else {
        if (textWidth > actualWidth) {
            actualWidth = textWidth;
        }
        textRows.push({
            'text': text,
            'size': size
        });
    }

    var rowNum = textRows.length;
    var textSize = new Size(actualWidth, textHeight * rowNum + lineSpacing * (rowNum - 1));
    return {
        'total': rowNum,
        'size': textSize,
        'rows': textRows,
        'rawSize': size
    };
}

var strings = Object.freeze({
	trim: trim,
	escapeSpecialChars: escapeSpecialChars,
	splitWords: splitWords,
	stringWidth: stringWidth,
	stringLength: stringLength,
	getFontHeight: getFontHeight,
	splitContent: splitContent,
	replaceVariable: replaceVariable,
	getAlignPoint: getAlignPoint,
	getFont: getFont,
	splitTextToRow: splitTextToRow
});

var first = function first(props) {
    return props[0];
};

var testProp = IS_NODE ? first : function (props) {

    var style = document.documentElement.style;

    for (var i = 0; i < props.length; i++) {
        if (props[i] in style) {
            return props[i];
        }
    }
    return false;
};

var TRANSFORM = testProp(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

var TRANSFORMORIGIN = testProp(['transformOrigin', 'WebkitTransformOrigin', 'OTransformOrigin', 'MozTransformOrigin', 'msTransformOrigin']);

var TRANSITION = testProp(['transition', 'WebkitTransition', 'OTransition', 'MozTransition', 'msTransition']);

var CSSFILTER = testProp(['filter', 'WebkitFilter', 'OFilter', 'MozFilter', 'msFilter']);

function createEl(tagName, className) {
    var el = document.createElement(tagName);
    if (className) {
        setClass(el, className);
    }
    return el;
}

function createElOn(tagName, style, container) {
    var el = createEl(tagName);
    if (style) {
        setStyle(el, style);
    }
    if (container) {
        container.appendChild(el);
    }
    return el;
}

function removeDomNode(node) {
    if (!node) {
        return this;
    }
    if (Browser$1.ielt9 || Browser$1.ie9) {
        var d = createEl('div');
        d.appendChild(node);
        d.innerHTML = '';
        d = null;
    } else if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    return this;
}

function addDomEvent(obj, typeArr, handler, context) {
    if (!obj || !obj.addEventListener || !typeArr || !handler) {
        return this;
    }
    var eventHandler = function eventHandler(e) {
        if (!e) {
            e = window.event;
        }
        handler.call(context || obj, e);
        return;
    };
    var types = typeArr.split(' ');
    for (var i = types.length - 1; i >= 0; i--) {
        var type = types[i];
        if (!type) {
            continue;
        }

        if (!obj['Z__' + type]) {
            obj['Z__' + type] = [];
        }
        var hit = listensDomEvent(obj, type, handler);
        if (hit >= 0) {
            removeDomEvent(obj, type, handler);
        }
        obj['Z__' + type].push({
            callback: eventHandler,
            src: handler
        });

        if (type === 'mousewheel' && Browser$1.gecko) {
            type = 'DOMMouseScroll';
        }
        obj.addEventListener(type, eventHandler, false);
    }
    return this;
}

function removeDomEvent(obj, typeArr, handler) {
    function doRemove(type, callback) {
        if (type === 'mousewheel' && Browser$1.gecko) {
            type = 'DOMMouseScroll';
        }
        obj.removeEventListener(type, callback, false);
    }
    if (!obj || !obj.removeEventListener || !typeArr) {
        return this;
    }
    var types = typeArr.split(' ');
    for (var i = types.length - 1; i >= 0; i--) {
        var type = types[i];
        if (!type) {
            continue;
        }

        if (!handler && obj['Z__' + type]) {
            var handlers = obj['Z__' + type];
            for (var j = 0, jlen = handlers.length; j < jlen; j++) {
                doRemove(handlers[j].callback);
            }
            delete obj['Z__' + type];
            return this;
        }
        var hit = listensDomEvent(obj, type, handler);
        if (hit < 0) {
            return this;
        }
        var hitHandler = obj['Z__' + type][hit];
        doRemove(type, hitHandler.callback);
        obj['Z__' + type].splice(hit, 1);
    }
    return this;
}

function listensDomEvent(obj, type, handler) {
    if (!obj || !obj['Z__' + type] || !handler) {
        return -1;
    }
    var handlers = obj['Z__' + type];
    for (var i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i].src === handler) {
            return i;
        }
    }
    return -1;
}

function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    return this;
}

function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    return this;
}

function preventSelection(dom) {
    dom.onselectstart = function () {
        return false;
    };
    dom.ondragstart = function () {
        return false;
    };
    dom.setAttribute('unselectable', 'on');
    return this;
}

function offsetDom(dom, offset) {
    if (!dom) {
        return null;
    }

    if (Browser$1.any3d) {
        setTransform(dom, offset);
    } else {
        dom.style.left = offset.x + 'px';
        dom.style.top = offset.y + 'px';
    }
    return offset;
}

function computeDomPosition(dom) {
    var style = window.getComputedStyle(dom);
    var padding = [parseInt(style['padding-left']), parseInt(style['padding-top'])];
    var rect = dom.getBoundingClientRect();

    var offsetWidth = dom.offsetWidth,
        offsetHeight = dom.offsetHeight;
    var scaleX = offsetWidth ? rect.width / offsetWidth : 1,
        scaleY = offsetHeight ? rect.height / offsetHeight : 1;
    dom.__position = [rect.left + padding[0], rect.top + padding[1], scaleX, scaleY];
    return dom.__position;
}

function getEventContainerPoint(ev, dom) {
    if (!ev) {
        ev = window.event;
    }
    var domPos = dom.__position;
    if (!domPos) {
        domPos = computeDomPosition(dom);
    }

    return new Point(ev.clientX / domPos[2] - domPos[0] - dom.clientLeft, ev.clientY / domPos[3] - domPos[1] - dom.clientTop);
}

function endsWith(str, suffix) {
    var l = str.length - suffix.length;
    return l >= 0 && str.indexOf(suffix, l) === l;
}

function setStyle(dom, strCss) {
    var cssText = dom.style.cssText;
    if (!endsWith(cssText, ';')) {
        cssText += ';';
    }
    dom.style.cssText = cssText + strCss;
    return this;
}

function hasClass(el, name) {
    if (el.classList !== undefined) {
        return el.classList.contains(name);
    }
    var className = getClass(el);
    return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

function addClass(el, name) {
    if (el.classList !== undefined && !hasClass(el, name)) {
        var classes = splitWords(name);
        for (var i = 0, len = classes.length; i < len; i++) {
            el.classList.add(classes[i]);
        }
    } else {
        var className = getClass(el);
        setClass(el, (className ? className + ' ' : '') + name);
    }
    return this;
}

function setClass(el, name) {
    if (isNil(el.className.baseVal)) {
        el.className = name;
    } else {
        el.className.baseVal = name;
    }
    return this;
}

function getClass(el) {
    return isNil(el.className.baseVal) ? el.className : el.className.baseVal;
}

function setOpacity(el, value) {
    el.style.opacity = value;
    return this;
}

function setTransform(el, offset) {
    var pos = offset || new Point(0, 0);
    el.style[TRANSFORM] = Browser$1.any3d ? 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0px)' : 'translate(' + pos.x + 'px,' + pos.y + 'px)';

    return this;
}

function setTransformMatrix(el, m) {
    var text = 'matrix(' + (isString(m) ? m : m.join()) + ')';
    if (el.style[TRANSFORM] !== text) {
        el.style[TRANSFORM] = text;
    }
    return this;
}

function removeTransform(el) {
    if (el.style[TRANSFORM]) {
        el.style[TRANSFORM] = '';
    }
    return this;
}

function isHTML(str) {
    return (/<[a-z\][\s\S]*>/i.test(str)
    );
}

function measureDom(parentTag, dom) {
    var ruler = getDomRuler(parentTag);
    if (isString(dom)) {
        ruler.innerHTML = dom;
    } else {
        ruler.appendChild(dom);
    }
    var result = new Size(ruler.clientWidth, ruler.clientHeight);
    removeDomNode(ruler);
    return result;
}

function getDomRuler(tag) {
    var span = document.createElement(tag);
    span.style.cssText = 'position:absolute;left:-10000px;top:-10000px;';
    document.body.appendChild(span);
    return span;
}

var on = addDomEvent;

var off = removeDomEvent;

var dom = Object.freeze({
	TRANSFORM: TRANSFORM,
	TRANSFORMORIGIN: TRANSFORMORIGIN,
	TRANSITION: TRANSITION,
	CSSFILTER: CSSFILTER,
	createEl: createEl,
	createElOn: createElOn,
	removeDomNode: removeDomNode,
	addDomEvent: addDomEvent,
	removeDomEvent: removeDomEvent,
	listensDomEvent: listensDomEvent,
	preventDefault: preventDefault,
	stopPropagation: stopPropagation,
	preventSelection: preventSelection,
	offsetDom: offsetDom,
	computeDomPosition: computeDomPosition,
	getEventContainerPoint: getEventContainerPoint,
	setStyle: setStyle,
	hasClass: hasClass,
	addClass: addClass,
	setClass: setClass,
	getClass: getClass,
	setOpacity: setOpacity,
	setTransform: setTransform,
	setTransformMatrix: setTransformMatrix,
	removeTransform: removeTransform,
	isHTML: isHTML,
	measureDom: measureDom,
	getDomRuler: getDomRuler,
	on: on,
	off: off
});

var DEFAULT_STROKE_COLOR = '#000';
var DEFAULT_FILL_COLOR = 'rgba(255,255,255,0)';
var DEFAULT_TEXT_COLOR = '#000';

var Canvas = {
    createCanvas: function createCanvas(width, height, canvasClass) {
        var canvas = void 0;
        if (!IS_NODE) {
            canvas = createEl('canvas');
            canvas.width = width;
            canvas.height = height;
        } else {
            canvas = new canvasClass(width, height);
        }
        return canvas;
    },
    prepareCanvasFont: function prepareCanvasFont(ctx, style) {
        ctx.textBaseline = 'top';
        ctx.font = getFont(style);
        var fill = style['textFill'];
        if (!fill) {
            fill = DEFAULT_TEXT_COLOR;
        }
        ctx.fillStyle = Canvas.getRgba(fill, style['textOpacity']);
    },
    prepareCanvas: function prepareCanvas(ctx, style, resources) {
        if (!style) {
            return;
        }
        var strokeWidth = style['lineWidth'];
        if (!isNil(strokeWidth) && ctx.lineWidth !== strokeWidth) {
            ctx.lineWidth = strokeWidth;
        }
        var strokeColor = style['linePatternFile'] || style['lineColor'] || DEFAULT_STROKE_COLOR;
        if (isCssUrl(strokeColor) && resources) {
            Canvas._setStrokePattern(ctx, strokeColor, strokeWidth, resources);

            style['lineDasharray'] = [];
        } else if (isGradient(strokeColor)) {
            if (style['lineGradientExtent']) {
                ctx.strokeStyle = Canvas._createGradient(ctx, strokeColor, style['lineGradientExtent']);
            } else {
                ctx.strokeStyle = 'rgba(0,0,0,1)';
            }
        } else {
                ctx.strokeStyle = strokeColor;
            }
        if (style['lineJoin']) {
            ctx.lineJoin = style['lineJoin'];
        }
        if (style['lineCap']) {
            ctx.lineCap = style['lineCap'];
        }
        if (ctx.setLineDash && isArrayHasData(style['lineDasharray'])) {
            ctx.setLineDash(style['lineDasharray']);
        }
        var fill = style['polygonPatternFile'] || style['polygonFill'] || DEFAULT_FILL_COLOR;
        if (isCssUrl(fill)) {
            var fillImgUrl = extractCssUrl(fill);
            var fillTexture = resources.getImage([fillImgUrl, null, null]);
            if (!fillTexture) {
                fillTexture = resources.getImage([fillImgUrl + '-texture', null, strokeWidth]);
            }
            if (isSVG(fillImgUrl) && fillTexture instanceof Image && (Browser$1.edge || Browser$1.ie)) {
                var w = fillTexture.width || 20,
                    h = fillTexture.height || 20;
                var canvas = Canvas.createCanvas(w, h);
                Canvas.image(canvas.getContext('2d'), fillTexture, 0, 0, w, h);
                fillTexture = canvas;
            }
            if (!fillTexture) {
                if (typeof console !== 'undefined') {
                    console.warn('img not found for', fillImgUrl);
                }
            } else {
                ctx.fillStyle = ctx.createPattern(fillTexture, 'repeat');
            }
        } else if (isGradient(fill)) {
            if (style['polygonGradientExtent']) {
                ctx.fillStyle = Canvas._createGradient(ctx, fill, style['polygonGradientExtent']);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0)';
            }
        } else {
                ctx.fillStyle = fill;
            }
    },
    _createGradient: function _createGradient(ctx, g, extent) {
        var gradient = null,
            places = g['places'];
        var min = extent.getMin(),
            max = extent.getMax(),
            width = extent.getWidth(),
            height = extent.getHeight();
        if (!g['type'] || g['type'] === 'linear') {
            if (!places) {
                places = [min.x, min.y, max.x, min.y];
            } else {
                if (places.length !== 4) {
                    throw new Error('A linear gradient\'s places should have 4 numbers.');
                }
                places = [min.x + places[0] * width, min.y + places[1] * height, min.x + places[2] * width, min.y + places[3] * height];
            }
            gradient = ctx.createLinearGradient.apply(ctx, places);
        } else if (g['type'] === 'radial') {
            if (!places) {
                var c = extent.getCenter()._round();
                places = [c.x, c.y, Math.abs(c.x - min.x), c.x, c.y, 0];
            } else {
                if (places.length !== 6) {
                    throw new Error('A radial gradient\'s places should have 6 numbers.');
                }
                places = [min.x + places[0] * width, min.y + places[1] * height, width * places[2], min.x + places[3] * width, min.y + places[4] * height, width * places[5]];
            }
            gradient = ctx.createRadialGradient.apply(ctx, places);
        }
        g['colorStops'].forEach(function (stop) {
            gradient.addColorStop.apply(gradient, stop);
        });
        return gradient;
    },
    _setStrokePattern: function _setStrokePattern(ctx, strokePattern, strokeWidth, resources) {
        var imgUrl = extractCssUrl(strokePattern);
        var imageTexture = void 0;
        if (IS_NODE) {
            imageTexture = resources.getImage([imgUrl, null, strokeWidth]);
        } else {
            var key = imgUrl + '-texture-' + strokeWidth;
            imageTexture = resources.getImage(key);
            if (!imageTexture) {
                var imageRes = resources.getImage([imgUrl, null, null]);
                if (imageRes) {
                    var w = void 0;
                    if (!imageRes.width || !imageRes.height) {
                        w = strokeWidth;
                    } else {
                        w = Math.round(imageRes.width * strokeWidth / imageRes.height);
                    }
                    var patternCanvas = Canvas.createCanvas(w, strokeWidth, ctx.canvas.constructor);
                    Canvas.image(patternCanvas.getContext('2d'), imageRes, 0, 0, w, strokeWidth);
                    resources.addResource([key, null, strokeWidth], patternCanvas);
                    imageTexture = patternCanvas;
                }
            }
        }
        if (imageTexture) {
            ctx.strokeStyle = ctx.createPattern(imageTexture, 'repeat');
        } else if (typeof console !== 'undefined') {
            console.warn('img not found for', imgUrl);
        }
    },
    clearRect: function clearRect(ctx, x1, y1, x2, y2) {
        ctx.canvas._drawn = false;
        ctx.clearRect(x1, y1, x2, y2);
    },
    fillCanvas: function fillCanvas(ctx, fillOpacity, x, y) {
        ctx.canvas._drawn = true;
        if (fillOpacity === 0) {
            return;
        }
        var isPattern = Canvas._isPattern(ctx.fillStyle);
        if (isNil(fillOpacity)) {
            fillOpacity = 1;
        }
        var alpha = void 0;
        if (fillOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= fillOpacity;
        }
        if (isPattern) {
            ctx.translate(x, y);
        }
        ctx.fill();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (fillOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },
    getRgba: function getRgba(color, op) {
        if (isNil(op)) {
            op = 1;
        }
        if (color[0] !== '#') {
            return color;
        }
        var r = void 0,
            g = void 0,
            b = void 0;
        if (color.length === 7) {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
        } else {
            r = parseInt(color.substring(1, 2), 16) * 17;
            g = parseInt(color.substring(2, 3), 16) * 17;
            b = parseInt(color.substring(3, 4), 16) * 17;
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
    },
    image: function image(ctx, img, x, y, width, height) {
        ctx.canvas._drawn = true;
        try {
            if (isNumber(width) && isNumber(height)) {
                ctx.drawImage(img, x, y, width, height);
            } else {
                ctx.drawImage(img, x, y);
            }
        } catch (error) {
            if (console) {
                console.warn('error when drawing image on canvas:', error);
                console.warn(img);
            }
        }
    },
    text: function text(ctx, _text, pt, style, textDesc) {
        Canvas._textOnMultiRow(ctx, textDesc['rows'], style, pt, textDesc['size'], textDesc['rawSize']);
    },
    _textOnMultiRow: function _textOnMultiRow(ctx, texts, style, point, splitTextSize, textSize) {
        var ptAlign = getAlignPoint(splitTextSize, style['textHorizontalAlignment'], style['textVerticalAlignment']),
            lineHeight = textSize['height'] + style['textLineSpacing'],
            basePoint = point.add(0, ptAlign.y),
            maxHeight = style['textMaxHeight'];
        var text = void 0,
            rowAlign = void 0,
            height = 0;
        for (var i = 0, len = texts.length; i < len; i++) {
            text = texts[i]['text'];
            rowAlign = getAlignPoint(texts[i]['size'], style['textHorizontalAlignment'], style['textVerticalAlignment']);
            Canvas._textOnLine(ctx, text, basePoint.add(rowAlign.x, i * lineHeight), style['textHaloRadius'], style['textHaloFill'], style['textHaloOpacity']);
            if (maxHeight > 0) {
                height += lineHeight;
                if (height + textSize['height'] >= maxHeight) {
                    break;
                }
            }
        }
    },
    _textOnLine: function _textOnLine(ctx, text, pt, textHaloRadius, textHaloFill, textHaloOp) {
        ctx.textBaseline = 'top';
        if (textHaloOp !== 0 && textHaloRadius !== 0) {
            var alpha = ctx.globalAlpha;

            if (textHaloOp) {
                ctx.globalAlpha *= textHaloOp;
            }

            if (textHaloRadius) {
                ctx.miterLimit = 2;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = textHaloRadius * 2 - 1;
                ctx.strokeStyle = textHaloFill;
                ctx.strokeText(text, Math.round(pt.x), Math.round(pt.y));
                ctx.lineWidth = 1;
                ctx.miterLimit = 10;
            }

            if (textHaloOp) {
                ctx.globalAlpha = alpha;
            }
        }
        Canvas.fillText(ctx, text, pt);
    },
    fillText: function fillText(ctx, text, point, rgba) {
        ctx.canvas._drawn = true;
        if (rgba) {
            ctx.fillStyle = rgba;
        }
        ctx.fillText(text, Math.round(point.x), Math.round(point.y));
    },
    _stroke: function _stroke(ctx, strokeOpacity, x, y) {
        ctx.canvas._drawn = true;
        if (strokeOpacity === 0) {
            return;
        }
        var isPattern = Canvas._isPattern(ctx.strokeStyle) && !isNil(x) && !isNil(y);
        if (isNil(strokeOpacity)) {
            strokeOpacity = 1;
        }
        var alpha = void 0;
        if (strokeOpacity < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= strokeOpacity;
        }
        if (isPattern) {
            ctx.translate(x, y);
        }
        ctx.stroke();
        if (isPattern) {
            ctx.translate(-x, -y);
        }
        if (strokeOpacity < 1) {
            ctx.globalAlpha = alpha;
        }
    },
    _path: function _path(ctx, points, lineDashArray, lineOpacity, ignoreStrokePattern) {
        if (!isArrayHasData(points)) {
            return;
        }

        function fillWithPattern(p1, p2) {
            var degree = computeDegree(p1, p2);
            ctx.save();
            ctx.translate(p1.x, p1.y - ctx.lineWidth / 2 / Math.cos(degree));
            ctx.rotate(degree);
            Canvas._stroke(ctx, lineOpacity);
            ctx.restore();
        }

        var isDashed = isArrayHasData(lineDashArray);
        var isPatternLine = ignoreStrokePattern === true ? false : Canvas._isPattern(ctx.strokeStyle);
        var point = void 0,
            prePoint = void 0,
            nextPoint = void 0;
        for (var i = 0, len = points.length; i < len; i++) {
            point = points[i];
            if (!isDashed || ctx.setLineDash) {
                ctx.lineTo(point.x, point.y);
                if (isPatternLine && i > 0) {
                    prePoint = points[i - 1];
                    fillWithPattern(prePoint, point);
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            } else if (isDashed) {
                if (i === len - 1) {
                    break;
                }
                nextPoint = points[i + 1];
                drawDashLine(ctx, point, nextPoint, lineDashArray, isPatternLine);
            }
        }
    },
    path: function path(ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        if (!isArrayHasData(points)) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        Canvas._path(ctx, points, lineDashArray, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
    },
    polygon: function polygon(ctx, points, lineOpacity, fillOpacity, lineDashArray) {
        if (!isArrayHasData(points)) {
            return;
        }
        function fillPolygon(points, i, op) {
            Canvas.fillCanvas(ctx, op, points[i][0].x, points[i][0].y);
        }
        var isPatternLine = Canvas._isPattern(ctx.strokeStyle),
            fillFirst = isArrayHasData(lineDashArray) && !ctx.setLineDash || isPatternLine;
        if (!isArrayHasData(points[0])) {
            points = [points];
        }
        var op = void 0,
            i = void 0,
            len = void 0;
        if (fillFirst) {
            ctx.save();
            for (i = 0, len = points.length; i < len; i++) {
                if (!isArrayHasData(points[i])) {
                    continue;
                }
                Canvas._ring(ctx, points[i], null, 0, true);
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    ctx.globalCompositeOperation = 'source-over';
                } else if (len > 1) {
                    ctx.fillStyle = '#fff';
                }
                Canvas._stroke(ctx, 0);
            }
            ctx.restore();
        }
        for (i = 0, len = points.length; i < len; i++) {
            if (!isArrayHasData(points[i])) {
                continue;
            }
            Canvas._ring(ctx, points[i], lineDashArray, lineOpacity);

            if (!fillFirst) {
                op = fillOpacity;
                if (i > 0) {
                    ctx.globalCompositeOperation = 'destination-out';
                    op = 1;
                }
                fillPolygon(points, i, op);
                if (i > 0) {
                    ctx.globalCompositeOperation = 'source-over';
                } else if (len > 1) {
                    ctx.fillStyle = '#fff';
                }
            }
            Canvas._stroke(ctx, lineOpacity);
        }
    },
    _ring: function _ring(ctx, ring, lineDashArray, lineOpacity, ignorePattern) {
        var isPattern = Canvas._isPattern(ctx.strokeStyle);
        if (!ignorePattern && isPattern && !ring[0].equals(ring[ring.length - 1])) {
            ring = ring.concat([ring[0]]);
        }
        ctx.beginPath();
        ctx.moveTo(ring[0].x, ring[0].y);
        Canvas._path(ctx, ring, lineDashArray, lineOpacity, ignorePattern);
        if (!isPattern) {
            ctx.closePath();
        }
    },
    _arcBetween: function _arcBetween(ctx, p1, p2, degree) {
        var a = degree,
            dist = p1.distanceTo(p2),
            r = dist / 2 / Math.sin(a / 2);

        var p1p2 = Math.asin((p2.y - p1.y) / dist);
        if (p1.x > p2.x) {
            p1p2 = Math.PI - p1p2;
        }

        var cp2 = 90 * Math.PI / 180 - a / 2,
            da = p1p2 - cp2;

        var dx = Math.cos(da) * r,
            dy = Math.sin(da) * r,
            cx = p1.x + dx,
            cy = p1.y + dy;

        var startAngle = Math.asin((p2.y - cy) / r);
        if (cx > p2.x) {
            startAngle = Math.PI - startAngle;
        }
        var endAngle = startAngle + a;

        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
    },
    _lineTo: function _lineTo(ctx, p) {
        ctx.lineTo(p.x, p.y);
    },
    bezierCurveAndFill: function bezierCurveAndFill(ctx, points, lineOpacity, fillOpacity) {
        ctx.beginPath();
        var start = points[0];
        ctx.moveTo(start.x, start.y);
        var args = [ctx];
        args.push.apply(args, points.splice(1));
        Canvas._bezierCurveTo.apply(Canvas, args);
        Canvas.fillCanvas(ctx, fillOpacity);
        Canvas._stroke(ctx, lineOpacity);
    },
    _bezierCurveTo: function _bezierCurveTo(ctx, p1, p2, p3) {
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    },
    ellipse: function ellipse(ctx, pt, width, height, lineOpacity, fillOpacity) {
        function bezierEllipse(x, y, a, b) {
            var k = 0.5522848,
                ox = a * k,
                oy = b * k;
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.closePath();
        }
        ctx.beginPath();
        if (width === height) {
            ctx.arc(pt.x, pt.y, width, 0, 2 * Math.PI);
        } else if (ctx.ellipse) {
            ctx.ellipse(pt.x, pt.y, width, height, 0, 0, Math.PI / 180 * 360);
        } else {
            bezierEllipse(pt.x, pt.y, width, height);
        }
        Canvas.fillCanvas(ctx, fillOpacity, pt.x - width, pt.y - height);
        Canvas._stroke(ctx, lineOpacity, pt.x - width, pt.y - height);
    },
    rectangle: function rectangle(ctx, pt, size, lineOpacity, fillOpacity) {
        ctx.beginPath();
        ctx.rect(pt.x, pt.y, size['width'], size['height']);
        Canvas.fillCanvas(ctx, fillOpacity, pt.x, pt.y);
        Canvas._stroke(ctx, lineOpacity, pt.x, pt.y);
    },
    sector: function sector(ctx, pt, size, angles, lineOpacity, fillOpacity) {
        var rad = Math.PI / 180;
        var startAngle = angles[0],
            endAngle = angles[1];

        function sector(ctx, x, y, radius, startAngle, endAngle) {
            var sDeg = rad * -endAngle;
            var eDeg = rad * -startAngle;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, sDeg, eDeg);
            ctx.lineTo(x, y);
            Canvas.fillCanvas(ctx, fillOpacity, x - radius, y - radius);
            Canvas._stroke(ctx, lineOpacity, x - radius, y - radius);
        }
        sector(ctx, pt.x, pt.y, size, startAngle, endAngle);
    },
    _isPattern: function _isPattern(style) {
        return !isString(style) && !('addColorStop' in style);
    },
    quadraticCurve: function quadraticCurve(ctx, points) {
        if (!points || points.length <= 2) {
            return;
        }
        var xc = (points[0].x + points[1].x) / 2,
            yc = (points[0].y + points[1].y) / 2;
        ctx.lineTo(xc, yc);
        var ctrlPts = Canvas._getQuadCurvePoints(points);
        for (var i = 0, len = ctrlPts.length; i < len; i += 4) {
            ctx.quadraticCurveTo(ctrlPts[i], ctrlPts[i + 1], ctrlPts[i + 2], ctrlPts[i + 3]);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    },
    _getQuadCurvePoints: function _getQuadCurvePoints(points) {
        var ctrlPts = [];
        var xc = void 0,
            yc = void 0;
        for (var i = 1, len = points.length; i < len - 1; i++) {
            xc = (points[i].x + points[i + 1].x) / 2;
            yc = (points[i].y + points[i + 1].y) / 2;
            ctrlPts.push(points[i].x, points[i].y, xc, yc);
        }
        return ctrlPts;
    },
    drawCross: function drawCross(ctx, p, lineWidth, color) {
        ctx.canvas._drawn = true;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(p.x - 5, p.y);
        ctx.lineTo(p.x + 5, p.y);
        ctx.moveTo(p.x, p.y - 5);
        ctx.lineTo(p.x, p.y + 5);
        ctx.stroke();
    },
    copy: function copy(canvas, c) {
        var target = c || createEl('canvas');
        target.width = canvas.width;
        target.height = canvas.height;
        target.getContext('2d').drawImage(canvas, 0, 0);
        return target;
    }
};

function drawDashLine(ctx, startPoint, endPoint, dashArray) {
    var fromX = startPoint.x,
        fromY = startPoint.y,
        toX = endPoint.x,
        toY = endPoint.y;
    var pattern = dashArray;
    var lt = function lt(a, b) {
        return a <= b;
    };
    var gt = function gt(a, b) {
        return a >= b;
    };
    var capmin = function capmin(a, b) {
        return Math.min(a, b);
    };
    var capmax = function capmax(a, b) {
        return Math.max(a, b);
    };

    var checkX = {
        thereYet: gt,
        cap: capmin
    };
    var checkY = {
        thereYet: gt,
        cap: capmin
    };

    if (fromY - toY > 0) {
        checkY.thereYet = lt;
        checkY.cap = capmax;
    }
    if (fromX - toX > 0) {
        checkX.thereYet = lt;
        checkX.cap = capmax;
    }

    ctx.moveTo(fromX, fromY);
    var offsetX = fromX;
    var offsetY = fromY;
    var idx = 0,
        dash = true;
    var ang = void 0,
        len = void 0;
    while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
        ang = Math.atan2(toY - fromY, toX - fromX);
        len = pattern[idx];

        offsetX = checkX.cap(toX, offsetX + Math.cos(ang) * len);
        offsetY = checkY.cap(toY, offsetY + Math.sin(ang) * len);

        if (dash) {
            ctx.lineTo(offsetX, offsetY);
        } else {
            ctx.moveTo(offsetX, offsetY);
        }

        idx = (idx + 1) % pattern.length;
        dash = !dash;
    }
}

var Coordinate = function () {
    function Coordinate(x, y) {
        classCallCheck(this, Coordinate);

        if (!isNil(x) && !isNil(y)) {
            this.x = +x;

            this.y = +y;
        } else if (Array.isArray(x)) {
            this.x = +x[0];
            this.y = +x[1];
        } else if (!isNil(x['x']) && !isNil(x['y'])) {
            this.x = +x['x'];
            this.y = +x['y'];
        }
        if (this._isNaN()) {
            throw new Error('coordinate is NaN');
        }
    }

    Coordinate.toNumberArrays = function toNumberArrays(coordinates) {
        if (!Array.isArray(coordinates)) {
            return [coordinates.x, coordinates.y];
        }
        return mapArrayRecursively(coordinates, function (coord) {
            return [coord.x, coord.y];
        });
    };

    Coordinate.toCoordinates = function toCoordinates(coordinates) {
        if (isNumber(coordinates[0]) && isNumber(coordinates[1])) {
            return new Coordinate(coordinates);
        }
        var result = [];
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var child = coordinates[i];
            if (Array.isArray(child)) {
                if (isNumber(child[0])) {
                    result.push(new Coordinate(child));
                } else {
                    result.push(Coordinate.toCoordinates(child));
                }
            } else {
                result.push(new Coordinate(child));
            }
        }
        return result;
    };

    Coordinate.prototype.copy = function copy() {
        return new Coordinate(this.x, this.y);
    };

    Coordinate.prototype._add = function _add(x, y) {
        if (x instanceof Coordinate) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y;
        }
        return this;
    };

    Coordinate.prototype.add = function add(x, y) {
        var nx = void 0,
            ny = void 0;
        if (x instanceof Coordinate) {
            nx = this.x + x.x;
            ny = this.y + x.y;
        } else {
            nx = this.x + x;
            ny = this.y + y;
        }
        return new Coordinate(nx, ny);
    };

    Coordinate.prototype._sub = function _sub(x, y) {
        if (x instanceof Coordinate) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y;
        }
        return this;
    };

    Coordinate.prototype._substract = function _substract() {
        return this._sub.apply(this, arguments);
    };

    Coordinate.prototype.sub = function sub(x, y) {
        var nx = void 0,
            ny = void 0;
        if (x instanceof Coordinate) {
            nx = this.x - x.x;
            ny = this.y - x.y;
        } else {
            nx = this.x - x;
            ny = this.y - y;
        }
        return new Coordinate(nx, ny);
    };

    Coordinate.prototype.substract = function substract() {
        return this.sub.apply(this, arguments);
    };

    Coordinate.prototype.multi = function multi(ratio) {
        return new Coordinate(this.x * ratio, this.y * ratio);
    };

    Coordinate.prototype._multi = function _multi(ratio) {
        this.x *= ratio;
        this.y *= ratio;
        return this;
    };

    Coordinate.prototype.equals = function equals(c) {
        if (!(c instanceof Coordinate)) {
            return false;
        }
        return this.x === c.x && this.y === c.y;
    };

    Coordinate.prototype._isNaN = function _isNaN() {
        return isNaN(this.x) || isNaN(this.y);
    };

    Coordinate.prototype.toArray = function toArray$$1() {
        return [this.x, this.y];
    };

    Coordinate.prototype.toFixed = function toFixed(n) {
        return new Coordinate(this.x.toFixed(n), this.y.toFixed(n));
    };

    Coordinate.prototype.toJSON = function toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    };

    return Coordinate;
}();

var Extent = function () {
    function Extent(p1, p2, p3, p4) {
        classCallCheck(this, Extent);

        this._clazz = Coordinate;
        var l = arguments.length;
        var proj = l > 0 ? arguments[l - 1] : null;
        if (proj && proj.unproject) {
            this.projection = arguments[l - 1];
        }
        this._dirty = true;
        this._initialize(p1, p2, p3, p4);
    }

    Extent.prototype._initialize = function _initialize(p1, p2, p3, p4) {
        this.xmin = null;

        this.xmax = null;

        this.ymin = null;

        this.ymax = null;
        if (isNil(p1)) {
            return;
        }
        var projection = this.projection;

        if (isNumber(p1) && isNumber(p2) && isNumber(p3) && isNumber(p4)) {
            if (projection) {
                this['xmin'] = p1;
                this['ymin'] = p2;
                this['xmax'] = p3;
                this['ymax'] = p4;
            } else {
                this['xmin'] = Math.min(p1, p3);
                this['ymin'] = Math.min(p2, p4);
                this['xmax'] = Math.max(p1, p3);
                this['ymax'] = Math.max(p2, p4);
            }
            return;
        } else if (Array.isArray(p1)) {
            if (projection) {
                this['xmin'] = p1[0];
                this['ymin'] = p1[1];
                this['xmax'] = p1[2];
                this['ymax'] = p1[3];
            } else {
                this['xmin'] = Math.min(p1[0], p1[2]);
                this['ymin'] = Math.min(p1[1], p1[3]);
                this['xmax'] = Math.max(p1[0], p1[2]);
                this['ymax'] = Math.max(p1[1], p1[3]);
            }
        } else if (isNumber(p1.x) && isNumber(p2.x) && isNumber(p1.y) && isNumber(p2.y)) {
            if (projection) {
                this['xmin'] = p1.x;
                this['ymin'] = p1.y;
                this['xmax'] = p2.x;
                this['ymax'] = p2.y;
            } else {
                if (p1.x > p2.x) {
                    this['xmin'] = p2.x;
                    this['xmax'] = p1.x;
                } else {
                    this['xmin'] = p1.x;
                    this['xmax'] = p2.x;
                }
                if (p1.y > p2.y) {
                    this['ymin'] = p2.y;
                    this['ymax'] = p1.y;
                } else {
                    this['ymin'] = p1.y;
                    this['ymax'] = p2.y;
                }
            }
        } else if (isNumber(p1['xmin']) && isNumber(p1['xmax']) && isNumber(p1['ymin']) && isNumber(p1['ymax'])) {
            this['xmin'] = p1['xmin'];
            this['ymin'] = p1['ymin'];
            this['xmax'] = p1['xmax'];
            this['ymax'] = p1['ymax'];
        }
    };

    Extent.prototype._add = function _add(p) {
        this._dirty = true;
        if (!isNil(p.x)) {
            this['xmin'] += p.x;
            this['ymin'] += p.y;
            this['xmax'] += p.x;
            this['ymax'] += p.y;
        } else if (!isNil(p.xmin)) {
            this['xmin'] += p.xmin;
            this['ymin'] += p.ymin;
            this['xmax'] += p.xmax;
            this['ymax'] += p.ymax;
        } else if (!isNil(p[0])) {
            this['xmin'] += p[0];
            this['ymin'] += p[1];
            this['xmax'] += p[0];
            this['ymax'] += p[1];
        }
        return this;
    };

    Extent.prototype.add = function add() {
        var e = new this.constructor(this['xmin'], this['ymin'], this['xmax'], this['ymax'], this.projection);
        return e._add.apply(e, arguments);
    };

    Extent.prototype._sub = function _sub(p) {
        this._dirty = true;
        if (!isNil(p.x)) {
            this['xmin'] -= p.x;
            this['ymin'] -= p.y;
            this['xmax'] -= p.x;
            this['ymax'] -= p.y;
        } else if (!isNil(p.xmin)) {
            this['xmin'] -= p.xmin;
            this['ymin'] -= p.ymin;
            this['xmax'] -= p.xmax;
            this['ymax'] -= p.ymax;
        } else if (!isNil(p[0])) {
            this['xmin'] -= p[0];
            this['ymin'] -= p[1];
            this['xmax'] -= p[0];
            this['ymax'] -= p[1];
        }
        return this;
    };

    Extent.prototype._substract = function _substract() {
        return this._sub.apply(this, arguments);
    };

    Extent.prototype.sub = function sub() {
        var e = new this.constructor(this['xmin'], this['ymin'], this['xmax'], this['ymax'], this.projection);
        return e._sub.apply(e, arguments);
    };

    Extent.prototype.substract = function substract() {
        return this.sub.apply(this, arguments);
    };

    Extent.prototype.round = function round() {
        return new this.constructor(Math.round(this['xmin']), Math.round(this['ymin']), Math.round(this['xmax']), Math.round(this['ymax']), this.projection);
    };

    Extent.prototype._round = function _round() {
        this._dirty = true;
        this['xmin'] = Math.round(this['xmin']);
        this['ymin'] = Math.round(this['ymin']);
        this['xmax'] = Math.round(this['xmax']);
        this['ymax'] = Math.round(this['ymax']);
        return this;
    };

    Extent.prototype.getMin = function getMin() {
        return new this._clazz(this['xmin'], this['ymin']);
    };

    Extent.prototype.getMax = function getMax() {
        return new this._clazz(this['xmax'], this['ymax']);
    };

    Extent.prototype.getCenter = function getCenter() {
        return new this._clazz((this['xmin'] + this['xmax']) / 2, (this['ymin'] + this['ymax']) / 2);
    };

    Extent.prototype.isValid = function isValid() {
        return isNumber(this['xmin']) && isNumber(this['ymin']) && isNumber(this['xmax']) && isNumber(this['ymax']);
    };

    Extent.prototype.equals = function equals(ext2) {
        return this['xmin'] === ext2['xmin'] && this['xmax'] === ext2['xmax'] && this['ymin'] === ext2['ymin'] && this['ymax'] === ext2['ymax'];
    };

    Extent.prototype.intersects = function intersects(ext2) {
        this._project(this);
        this._project(ext2);
        var rxmin = Math.max(this['pxmin'], ext2['pxmin']);
        var rymin = Math.max(this['pymin'], ext2['pymin']);
        var rxmax = Math.min(this['pxmax'], ext2['pxmax']);
        var rymax = Math.min(this['pymax'], ext2['pymax']);
        var intersects = !(rxmin > rxmax || rymin > rymax);
        return intersects;
    };

    Extent.prototype.within = function within(extent) {
        this._project(this);
        this._project(extent);
        return this.pxmin >= extent.pxmin && this.pxmax <= extent.pxmax && this.pymin >= extent.pymin && this.pymax <= extent.pymax;
    };

    Extent.prototype.contains = function contains(c) {
        this._project(this);
        var proj = this.projection;
        if (Array.isArray(c)) {
            c = new this._clazz(c);
        }
        if (proj) {
            c = proj.project(c);
        }
        return c.x >= this.pxmin && c.x <= this.pxmax && c.y >= this.pymin && c.y <= this.pymax;
    };

    Extent.prototype.getWidth = function getWidth() {
        return Math.abs(this['xmax'] - this['xmin']);
    };

    Extent.prototype.getHeight = function getHeight() {
        return Math.abs(this['ymax'] - this['ymin']);
    };

    Extent.prototype.getSize = function getSize() {
        return new Size(this.getWidth(), this.getHeight());
    };

    Extent.prototype.__combine = function __combine(extent) {
        if (!(extent instanceof this.constructor)) {
            extent = new this.constructor(extent, extent);
        }
        this._project(extent);
        this._project(this);
        var xmin = this['pxmin'];
        if (!isNumber(xmin)) {
            xmin = extent['pxmin'];
        } else if (isNumber(extent['pxmin'])) {
            if (xmin > extent['pxmin']) {
                xmin = extent['pxmin'];
            }
        }

        var xmax = this['pxmax'];
        if (!isNumber(xmax)) {
            xmax = extent['pxmax'];
        } else if (isNumber(extent['pxmax'])) {
            if (xmax < extent['pxmax']) {
                xmax = extent['pxmax'];
            }
        }

        var ymin = this['pymin'];
        if (!isNumber(ymin)) {
            ymin = extent['pymin'];
        } else if (isNumber(extent['pymin'])) {
            if (ymin > extent['pymin']) {
                ymin = extent['pymin'];
            }
        }

        var ymax = this['pymax'];
        if (!isNumber(ymax)) {
            ymax = extent['pymax'];
        } else if (isNumber(extent['pymax'])) {
            if (ymax < extent['pymax']) {
                ymax = extent['pymax'];
            }
        }
        var proj = this.projection;
        if (proj) {
            var min = proj.unproject(new this._clazz(xmin, ymin)),
                max = proj.unproject(new this._clazz(xmax, ymax));
            xmin = min.x;
            ymin = min.y;
            xmax = max.x;
            ymax = max.y;
        }
        return [xmin, ymin, xmax, ymax];
    };

    Extent.prototype._combine = function _combine(extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        this['xmin'] = ext[0];
        this['ymin'] = ext[1];
        this['xmax'] = ext[2];
        this['ymax'] = ext[3];
        this._dirty = true;
        return this;
    };

    Extent.prototype.combine = function combine(extent) {
        if (!extent) {
            return this;
        }
        var ext = this.__combine(extent);
        return new this.constructor(ext[0], ext[1], ext[2], ext[3], this.projection);
    };

    Extent.prototype.intersection = function intersection(extent) {
        if (!this.intersects(extent)) {
            return null;
        }
        var min = new this._clazz(Math.max(this['pxmin'], extent['pxmin']), Math.max(this['pymin'], extent['pymin'])),
            max = new this._clazz(Math.min(this['pxmax'], extent['pxmax']), Math.min(this['pymax'], extent['pymax']));
        var proj = this.projection;
        if (proj) {
            min = proj.unproject(min);
            max = proj.unproject(max);
        }
        return new this.constructor(min, max, proj);
    };

    Extent.prototype.expand = function expand(distance) {
        if (distance instanceof Size) {
            return new this.constructor(this['xmin'] - distance['width'], this['ymin'] - distance['height'], this['xmax'] + distance['width'], this['ymax'] + distance['height'], this.projection);
        } else {
            return new this.constructor(this['xmin'] - distance, this['ymin'] - distance, this['xmax'] + distance, this['ymax'] + distance, this.projection);
        }
    };

    Extent.prototype._expand = function _expand(distance) {
        if (distance instanceof Size) {
            this['xmin'] -= distance['width'];
            this['ymin'] -= distance['height'];
            this['xmax'] += distance['width'];
            this['ymax'] += distance['height'];
        } else {
            this['xmin'] -= distance;
            this['ymin'] -= distance;
            this['xmax'] += distance;
            this['ymax'] += distance;
        }
        this._dirty = true;
        return this;
    };

    Extent.prototype.toJSON = function toJSON() {
        return {
            'xmin': this['xmin'],
            'ymin': this['ymin'],
            'xmax': this['xmax'],
            'ymax': this['ymax']
        };
    };

    Extent.prototype.toArray = function toArray$$1() {
        var xmin = this['xmin'],
            ymin = this['ymin'],
            xmax = this['xmax'],
            ymax = this['ymax'];
        return [new this._clazz([xmin, ymax]), new this._clazz([xmax, ymax]), new this._clazz([xmax, ymin]), new this._clazz([xmin, ymin]), new this._clazz([xmin, ymax])];
    };

    Extent.prototype.copy = function copy() {
        return new this.constructor(this['xmin'], this['ymin'], this['xmax'], this['ymax'], this.projection);
    };

    Extent.prototype.convertTo = function convertTo(fn) {
        if (!this.isValid()) {
            return null;
        }
        var e = new this.constructor();
        var coords = this.toArray();
        var len = coords.length;
        coords.forEach(function (c, idx) {
            if (idx < len - 1) {
                e._combine(fn(c));
            }
        });
        return e;
    };

    Extent.prototype._project = function _project(ext) {
        if (!ext || !ext.isValid()) {
            return;
        }
        var proj = this.projection;
        if (proj) {
            if (ext._dirty) {
                var minmax = [ext.getMin(), ext.getMax()];
                minmax = proj.projectCoords(minmax);
                var min = minmax[0],
                    max = minmax[1];
                ext.pxmin = Math.min(min.x, max.x);
                ext.pymin = Math.min(min.y, max.y);
                ext.pxmax = Math.max(min.x, max.x);
                ext.pymax = Math.max(min.y, max.y);
            }
            delete ext._dirty;
        } else {
            ext.pxmin = ext.xmin;
            ext.pxmax = ext.xmax;
            ext.pymin = ext.ymin;
            ext.pymax = ext.ymax;
        }
    };

    return Extent;
}();

var PointExtent = function (_Extent) {
  inherits(PointExtent, _Extent);

  function PointExtent(p1, p2, p3, p4) {
    classCallCheck(this, PointExtent);

    var _this = possibleConstructorReturn(this, _Extent.call(this, p1, p2, p3, p4));

    _this._clazz = Point;
    return _this;
  }

  return PointExtent;
}(Extent);

var PointSymbolizer = function (_CanvasSymbolizer) {
    inherits(PointSymbolizer, _CanvasSymbolizer);

    function PointSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, PointSymbolizer);

        var _this = possibleConstructorReturn(this, _CanvasSymbolizer.call(this));

        _this.symbol = symbol;
        _this.geometry = geometry;
        _this.painter = painter;
        return _this;
    }

    PointSymbolizer.prototype.get2DExtent = function get2DExtent() {
        var map = this.getMap();
        var glZoom = map.getGLZoom();
        var extent = new PointExtent();
        var renderPoints = this._getRenderPoints()[0];
        for (var i = renderPoints.length - 1; i >= 0; i--) {
            if (renderPoints[i]) {
                extent._combine(map._pointToPoint(renderPoints[i], glZoom));
            }
        }
        return extent;
    };

    PointSymbolizer.prototype._getRenderPoints = function _getRenderPoints() {
        return this.getPainter().getRenderPoints(this.getPlacement());
    };

    PointSymbolizer.prototype._getRenderContainerPoints = function _getRenderContainerPoints(ignoreAltitude) {
        var painter = this.getPainter(),
            points = this._getRenderPoints()[0];
        if (painter.isSpriting()) {
            return points;
        }
        var dxdy = this.getDxDy();
        var cpoints = this.painter._pointContainerPoints(points, dxdy.x, dxdy.y, ignoreAltitude, true);
        if (!cpoints || !Array.isArray(cpoints[0])) {
            return cpoints;
        }
        var flat = [];
        for (var i = 0, l = cpoints.length; i < l; i++) {
            for (var ii = 0, ll = cpoints[i].length; ii < ll; ii++) {
                flat.push(cpoints[i][ii]);
            }
        }
        return flat;
    };

    PointSymbolizer.prototype._getRotationAt = function _getRotationAt(i) {
        var r = this.getRotation();
        if (!r) {
            r = 0;
        }
        var rotations = this._getRenderPoints()[1];
        if (!rotations || !rotations[i]) {
            return r;
        }

        var map = this.getMap();
        var p0 = rotations[i][0],
            p1 = rotations[i][1];
        if (map.isTransforming()) {
            var maxZoom = map.getGLZoom();
            p0 = map._pointToContainerPoint(rotations[i][0], maxZoom);
            p1 = map._pointToContainerPoint(rotations[i][1], maxZoom);
        }
        return r + computeDegree(p0, p1);
    };

    PointSymbolizer.prototype._rotate = function _rotate(ctx, origin, rotation) {
        if (rotation) {
            var dxdy = this.getDxDy();
            var p = origin.sub(dxdy);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(rotation);
            return this.getDxDy();
        }
        return null;
    };

    return PointSymbolizer;
}(CanvasSymbolizer);

var VectorMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(VectorMarkerSymbolizer, _PointSymbolizer);

    VectorMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (isNil(symbol['markerFile']) && !isNil(symbol['markerType']) && symbol['markerType'] !== 'path') {
            return true;
        }
        return false;
    };

    function VectorMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, VectorMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this._dynamic = hasFunctionDefinition(symbol);
        _this.style = _this._defineStyle(_this.translate());
        _this.strokeAndFill = _this._defineStyle(VectorMarkerSymbolizer.translateLineAndFill(_this.style));
        var lineWidth = _this.strokeAndFill['lineWidth'];
        if (lineWidth % 2 === 0) {
            _this.padding = 2;
        } else {
            _this.padding = 1.5;
        }
        return _this;
    }

    VectorMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 || style['polygonOpacity'] === 0 && style['lineOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }
        this._prepareContext(ctx);
        if (this.getPainter().isSpriting() || this.geometry.getLayer().getMask() === this.geometry || this._dynamic || this.geometry.getLayer().options['cacheVectorOnCanvas'] === false) {
            this._drawMarkers(ctx, cookedPoints, resources);
        } else {
            this._drawMarkersWithCache(ctx, cookedPoints, resources);
        }
    };

    VectorMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        var dx = s['markerDx'],
            dy = s['markerDy'];
        return new Point(dx, dy);
    };

    VectorMarkerSymbolizer.prototype._drawMarkers = function _drawMarkers(ctx, cookedPoints, resources) {
        var strokeAndFill = this.strokeAndFill;
        var gradient = isGradient(strokeAndFill['lineColor']) || isGradient(strokeAndFill['polygonFill']);
        if (!gradient) {
            Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        }
        for (var i = cookedPoints.length - 1; i >= 0; i--) {
            var point = cookedPoints[i];
            var origin = this._rotate(ctx, point, this._getRotationAt(i));
            if (origin) {
                point = origin;
            }

            this._drawVectorMarker(ctx, point, resources);
            if (origin) {
                ctx.restore();
            }
        }
    };

    VectorMarkerSymbolizer.prototype._drawMarkersWithCache = function _drawMarkersWithCache(ctx, cookedPoints, resources) {
        var stamp = this._stampSymbol();
        var image = resources.getImage(stamp);
        if (!image) {
            image = this._createMarkerImage(ctx, resources);
            resources.addResource([stamp, image.width, image.height], image);
        }
        var anchor = this._getAnchor(image.width, image.height);
        for (var i = cookedPoints.length - 1; i >= 0; i--) {
            var point = cookedPoints[i];
            var origin = this._rotate(ctx, point, this._getRotationAt(i));
            if (origin) {
                point = origin;
            }
            Canvas.image(ctx, image, point.x + anchor.x, point.y + anchor.y);
            if (origin) {
                ctx.restore();
            }
        }
    };

    VectorMarkerSymbolizer.prototype._calMarkerSize = function _calMarkerSize() {
        var lineWidth = this.strokeAndFill['lineWidth'],
            shadow = this.geometry.options['shadowBlur'],
            w = Math.round(this.style['markerWidth'] + lineWidth + 2 * shadow + this.padding * 2),
            h = Math.round(this.style['markerHeight'] + lineWidth + 2 * shadow + this.padding * 2);
        return [w, h];
    };

    VectorMarkerSymbolizer.prototype._createMarkerImage = function _createMarkerImage(ctx, resources) {
        var canvasClass = ctx.canvas.constructor,
            size = this._calMarkerSize(),
            canvas = Canvas.createCanvas(size[0], size[1], canvasClass),
            point = this._getCacheImageAnchor(size[0], size[1]);
        var context = canvas.getContext('2d');
        var gradient = isGradient(this.strokeAndFill['lineColor']) || isGradient(this.strokeAndFill['polygonFill']);
        if (!gradient) {
            Canvas.prepareCanvas(context, this.strokeAndFill, resources);
        }
        this._drawVectorMarker(context, point, resources);
        return canvas;
    };

    VectorMarkerSymbolizer.prototype._stampSymbol = function _stampSymbol() {
        if (!this._stamp) {
            this._stamp = [this.style['markerType'], isGradient(this.style['markerFill']) ? getGradientStamp(this.style['markerFill']) : this.style['markerFill'], this.style['markerFillOpacity'], this.style['markerFillPatternFile'], isGradient(this.style['markerLineColor']) ? getGradientStamp(this.style['markerLineColor']) : this.style['markerLineColor'], this.style['markerLineWidth'], this.style['markerLineOpacity'], this.style['markerLineDasharray'] ? this.style['markerLineDasharray'].join(',') : '', this.style['markerLinePatternFile'], this.style['markerWidth'], this.style['markerHeight'], this.style['markerHorizontalAlignment'], this.style['markerVerticalAlignment']].join('_');
        }
        return this._stamp;
    };

    VectorMarkerSymbolizer.prototype._getAnchor = function _getAnchor(w, h) {
        var shadow = this.geometry.options['shadowBlur'],
            margin = shadow + this.padding;
        var p = getAlignPoint(new Size(w, h), this.style['markerHorizontalAlignment'], this.style['markerVerticalAlignment']);
        if (p.x !== -w / 2) {
            p.x -= sign(p.x + w / 2) * margin;
        }
        if (p.y !== -h / 2) {
            p.y -= sign(p.y + h / 2) * margin;
        }
        return p;
    };

    VectorMarkerSymbolizer.prototype._getCacheImageAnchor = function _getCacheImageAnchor(w, h) {
        var shadow = this.geometry.options['shadowBlur'],
            margin = shadow + this.padding;
        var markerType = this.style['markerType'];
        if (markerType === 'bar' || markerType === 'pie' || markerType === 'pin') {
            return new Point(w / 2, h - margin);
        } else if (markerType === 'rectangle') {
            return new Point(margin, margin);
        } else {
            return new Point(w / 2, h / 2);
        }
    };

    VectorMarkerSymbolizer.prototype._getGraidentExtent = function _getGraidentExtent(points) {
        var e = new PointExtent(),
            m = this.getMarkerExtent();
        if (Array.isArray(points)) {
            for (var i = points.length - 1; i >= 0; i--) {
                e._combine(points[i]);
            }
        } else {
            e._combine(points);
        }
        e['xmin'] += m['xmin'];
        e['ymin'] += m['ymin'];
        e['xmax'] += m['xmax'];
        e['ymax'] += m['ymax'];
        return e;
    };

    VectorMarkerSymbolizer.prototype._drawVectorMarker = function _drawVectorMarker(ctx, point, resources) {
        var style = this.style,
            strokeAndFill = this.strokeAndFill,
            markerType = style['markerType'].toLowerCase(),
            vectorArray = VectorMarkerSymbolizer._getVectorPoints(markerType, style['markerWidth'], style['markerHeight']),
            lineOpacity = strokeAndFill['lineOpacity'],
            fillOpacity = strokeAndFill['polygonOpacity'];
        var gradient = isGradient(strokeAndFill['lineColor']) || isGradient(strokeAndFill['polygonFill']);
        if (gradient) {
            var gradientExtent = void 0;
            if (isGradient(strokeAndFill['lineColor'])) {
                gradientExtent = this._getGraidentExtent(point);
                strokeAndFill['lineGradientExtent'] = gradientExtent.expand(strokeAndFill['lineWidth']);
            }
            if (isGradient(strokeAndFill['polygonFill'])) {
                if (!gradientExtent) {
                    gradientExtent = this._getGraidentExtent(point);
                }
                strokeAndFill['polygonGradientExtent'] = gradientExtent;
            }
            Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        }

        var width = style['markerWidth'],
            height = style['markerHeight'],
            hLineWidth = style['markerLineWidth'] / 2;
        if (markerType === 'ellipse') {
            Canvas.ellipse(ctx, point, width / 2, height / 2, lineOpacity, fillOpacity);
        } else if (markerType === 'cross' || markerType === 'x') {
            for (var j = vectorArray.length - 1; j >= 0; j--) {
                vectorArray[j]._add(point);
            }

            Canvas.path(ctx, vectorArray.slice(0, 2), lineOpacity);
            Canvas.path(ctx, vectorArray.slice(2, 4), lineOpacity);
        } else if (markerType === 'diamond' || markerType === 'bar' || markerType === 'square' || markerType === 'rectangle' || markerType === 'triangle') {
            if (markerType === 'bar') {
                point = point.add(0, -hLineWidth);
            } else if (markerType === 'rectangle') {
                point = point.add(hLineWidth, hLineWidth);
            }
            for (var _j = vectorArray.length - 1; _j >= 0; _j--) {
                vectorArray[_j]._add(point);
            }

            Canvas.polygon(ctx, vectorArray, lineOpacity, fillOpacity);
        } else if (markerType === 'pin') {
            point = point.add(0, -hLineWidth);
            for (var _j2 = vectorArray.length - 1; _j2 >= 0; _j2--) {
                vectorArray[_j2]._add(point);
            }
            var lineCap = ctx.lineCap;
            ctx.lineCap = 'round';
            Canvas.bezierCurveAndFill(ctx, vectorArray, lineOpacity, fillOpacity);
            ctx.lineCap = lineCap;
        } else if (markerType === 'pie') {
            point = point.add(0, -hLineWidth);
            var angle = Math.atan(width / 2 / height) * 180 / Math.PI;
            var _lineCap = ctx.lineCap;
            ctx.lineCap = 'round';
            Canvas.sector(ctx, point, height, [90 - angle, 90 + angle], lineOpacity, fillOpacity);
            ctx.lineCap = _lineCap;
        } else {
            throw new Error('unsupported markerType: ' + markerType);
        }
    };

    VectorMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['markerPlacement'];
    };

    VectorMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['markerRotation'];
        if (!isNumber(r)) {
            return null;
        }

        return r * Math.PI / 180;
    };

    VectorMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent() {
        var dxdy = this.getDxDy(),
            style = this.style;
        var markerType = style['markerType'].toLowerCase();
        var width = style['markerWidth'],
            height = style['markerHeight'];
        var result = void 0;
        if (markerType === 'bar' || markerType === 'pie' || markerType === 'pin') {
            result = new PointExtent(dxdy.add(-width / 2, -height), dxdy.add(width / 2, 0));
        } else {
            result = new PointExtent(dxdy.add(-width / 2, -height / 2), dxdy.add(width / 2, height / 2));
        }
        if (this.style['markerLineWidth']) {
            result._expand(this.style['markerLineWidth'] / 2);
        }
        return result;
    };

    VectorMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'markerType': getValueOrDefault(s['markerType'], 'ellipse'),
            'markerFill': getValueOrDefault(s['markerFill'], '#00f'),
            'markerFillOpacity': getValueOrDefault(s['markerFillOpacity'], 1),
            'markerFillPatternFile': getValueOrDefault(s['markerFillPatternFile'], null),
            'markerLineColor': getValueOrDefault(s['markerLineColor'], '#000'),
            'markerLineWidth': getValueOrDefault(s['markerLineWidth'], 1),
            'markerLineOpacity': getValueOrDefault(s['markerLineOpacity'], 1),
            'markerLineDasharray': getValueOrDefault(s['markerLineDasharray'], []),
            'markerLinePatternFile': getValueOrDefault(s['markerLinePatternFile'], null),

            'markerDx': getValueOrDefault(s['markerDx'], 0),
            'markerDy': getValueOrDefault(s['markerDy'], 0),

            'markerWidth': getValueOrDefault(s['markerWidth'], 10),
            'markerHeight': getValueOrDefault(s['markerHeight'], 10),

            'markerRotation': getValueOrDefault(s['markerRotation'], 0)
        };
        var markerType = result['markerType'];
        var ha = void 0,
            va = void 0;
        if (markerType === 'bar' || markerType === 'pie' || markerType === 'pin') {
            ha = 'middle';
            va = 'top';
        } else if (markerType === 'rectangle') {
            ha = 'right';
            va = 'bottom';
        } else {
            ha = 'middle';
            va = 'middle';
        }

        result['markerHorizontalAlignment'] = getValueOrDefault(s['markerHorizontalAlignment'], ha);
        result['markerVerticalAlignment'] = getValueOrDefault(s['markerVerticalAlignment'], va);
        if (isNumber(s['markerOpacity'])) {
            if (isNumber(s['markerFillOpacity'])) {
                result['markerFillOpacity'] *= s['markerOpacity'];
            }
            if (isNumber(s['markerLineOpacity'])) {
                result['markerLineOpacity'] *= s['markerOpacity'];
            }
        }
        return result;
    };

    VectorMarkerSymbolizer.translateLineAndFill = function translateLineAndFill(s) {
        var result = {
            'lineColor': s['markerLineColor'],
            'linePatternFile': s['markerLinePatternFile'],
            'lineWidth': s['markerLineWidth'],
            'lineOpacity': s['markerLineOpacity'],
            'lineDasharray': s['markerLineDasharray'],
            'lineCap': 'butt',
            'lineJoin': 'round',
            'polygonFill': s['markerFill'],
            'polygonPatternFile': s['markerFillPatternFile'],
            'polygonOpacity': s['markerFillOpacity']
        };
        if (result['lineWidth'] === 0) {
            result['lineOpacity'] = 0;
        }
        return result;
    };

    VectorMarkerSymbolizer._getVectorPoints = function _getVectorPoints(markerType, width, height) {
        var hh = height / 2,
            hw = width / 2;
        var left = 0,
            top = 0;
        var v0 = void 0,
            v1 = void 0,
            v2 = void 0,
            v3 = void 0;
        if (markerType === 'triangle') {
            v0 = new Point(left, top - hh);
            v1 = new Point(left - hw, top + hh);
            v2 = new Point(left + hw, top + hh);
            return [v0, v1, v2];
        } else if (markerType === 'cross') {
            v0 = new Point(left - hw, top);
            v1 = new Point(left + hw, top);
            v2 = new Point(left, top - hh);
            v3 = new Point(left, top + hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'diamond') {
            v0 = new Point(left - hw, top);
            v1 = new Point(left, top - hh);
            v2 = new Point(left + hw, top);
            v3 = new Point(left, top + hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'square') {
            v0 = new Point(left - hw, top + hh);
            v1 = new Point(left + hw, top + hh);
            v2 = new Point(left + hw, top - hh);
            v3 = new Point(left - hw, top - hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'rectangle') {
            v0 = new Point(left, top);
            v1 = v0.add(width, 0);
            v2 = v0.add(width, height);
            v3 = v0.add(0, height);
            return [v0, v1, v2, v3];
        } else if (markerType === 'x') {
            v0 = new Point(left - hw, top + hh);
            v1 = new Point(left + hw, top - hh);
            v2 = new Point(left + hw, top + hh);
            v3 = new Point(left - hw, top - hh);
            return [v0, v1, v2, v3];
        } else if (markerType === 'bar') {
            v0 = new Point(left - hw, top - height);
            v1 = new Point(left + hw, top - height);
            v2 = new Point(left + hw, top);
            v3 = new Point(left - hw, top);
            return [v0, v1, v2, v3];
        } else if (markerType === 'pin') {
            var extWidth = height * Math.atan(hw / hh);
            v0 = new Point(left, top);
            v1 = new Point(left - extWidth, top - height);
            v2 = new Point(left + extWidth, top - height);
            v3 = new Point(left, top);
            return [v0, v1, v2, v3];
        }
        return [];
    };

    return VectorMarkerSymbolizer;
}(PointSymbolizer);

var DebugSymbolizer = function (_PointSymbolizer) {
    inherits(DebugSymbolizer, _PointSymbolizer);

    function DebugSymbolizer() {
        classCallCheck(this, DebugSymbolizer);
        return possibleConstructorReturn(this, _PointSymbolizer.apply(this, arguments));
    }

    DebugSymbolizer.prototype.getPlacement = function getPlacement() {
        return 'point';
    };

    DebugSymbolizer.prototype.getDxDy = function getDxDy() {
        return new Point(0, 0);
    };

    DebugSymbolizer.prototype.symbolize = function symbolize(ctx) {
        var geometry = this.geometry,
            layer = geometry.getLayer();
        if (!geometry.options['debug'] && layer && !layer.options['debug']) {
            return;
        }
        var map = this.getMap();
        if (!map || map.isZooming()) {
            return;
        }
        var color = layer.options['debugOutline'],
            op = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        var outline = this.getPainter().getContainerExtent().toArray();
        Canvas.polygon(ctx, [outline], op, 0);

        var points = this._getRenderContainerPoints(),
            id = this.geometry.getId(),
            cross = VectorMarkerSymbolizer._getVectorPoints('cross', 10, 10);
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (!isNil(id)) {
                Canvas.fillText(ctx, id, p.add(8, -4), color);
            }
            var c = [];
            for (var ii = 0; ii < cross.length; ii++) {
                c.push(cross[ii].add(p));
            }
            Canvas.path(ctx, c.slice(0, 2), op);
            Canvas.path(ctx, c.slice(2, 4), op);
        }
    };

    return DebugSymbolizer;
}(PointSymbolizer);

var ImageMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(ImageMarkerSymbolizer, _PointSymbolizer);

    ImageMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (!isNil(symbol['markerFile'])) {
            return true;
        }
        return false;
    };

    function ImageMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, ImageMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());
        return _this;
    }

    ImageMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        var style = this.style;
        if (style['markerWidth'] === 0 || style['markerHeight'] === 0 || style['markerOpacity'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }

        var img = this._getImage(resources);
        if (!img) {
            if (typeof console !== 'undefined') {
                console.warn('no img found for ' + (this.style['markerFile'] || this._url[0]));
            }
            return;
        }
        this._prepareContext(ctx);
        var width = style['markerWidth'];
        var height = style['markerHeight'];
        if (!isNumber(width) || !isNumber(height)) {
            width = img.width;
            height = img.height;
            style['markerWidth'] = width;
            style['markerHeight'] = height;
            var imgURL = [style['markerFile'], style['markerWidth'], style['markerHeight']];
            if (!resources.isResourceLoaded(imgURL)) {
                resources.addResource(imgURL, img);
            }
            var painter = this.getPainter();
            if (!painter.isSpriting()) {
                painter.removeCache();
            }
        }
        var alpha = void 0;

        if (this.symbol['markerType'] !== 'path' && isNumber(style['markerOpacity']) && style['markerOpacity'] < 1) {
            alpha = ctx.globalAlpha;
            ctx.globalAlpha *= style['markerOpacity'];
        }
        var alignPoint = getAlignPoint(new Size(width, height), style['markerHorizontalAlignment'], style['markerVerticalAlignment']);
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            var p = cookedPoints[i];
            var origin = this._rotate(ctx, p, this._getRotationAt(i));
            if (origin) {
                p = origin;
            }
            Canvas.image(ctx, img, p.x + alignPoint.x, p.y + alignPoint.y, width, height);
            if (origin) {
                ctx.restore();
            }
        }
        if (alpha !== undefined) {
            ctx.globalAlpha = alpha;
        }
    };

    ImageMarkerSymbolizer.prototype._getImage = function _getImage(resources) {
        var img = !resources ? null : resources.getImage([this.style['markerFile'], this.style['markerWidth'], this.style['markerHeight']]);
        return img;
    };

    ImageMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['markerPlacement'];
    };

    ImageMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['markerRotation'];
        if (!isNumber(r)) {
            return null;
        }

        return r * Math.PI / 180;
    };

    ImageMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        var dx = s['markerDx'],
            dy = s['markerDy'];
        return new Point(dx, dy);
    };

    ImageMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent(resources) {
        var url = this.style['markerFile'],
            img = resources ? resources.getImage(url) : null;
        var width = this.style['markerWidth'] || (img ? img.width : 0),
            height = this.style['markerHeight'] || (img ? img.height : 0);
        var dxdy = this.getDxDy();
        return new PointExtent(dxdy.add(-width / 2, 0), dxdy.add(width / 2, -height));
    };

    ImageMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        return {
            'markerFile': s['markerFile'],
            'markerOpacity': getValueOrDefault(s['markerOpacity'], 1),
            'markerWidth': getValueOrDefault(s['markerWidth'], null),
            'markerHeight': getValueOrDefault(s['markerHeight'], null),
            'markerRotation': getValueOrDefault(s['markerRotation'], 0),

            'markerDx': getValueOrDefault(s['markerDx'], 0),
            'markerDy': getValueOrDefault(s['markerDy'], 0),

            'markerHorizontalAlignment': getValueOrDefault(s['markerHorizontalAlignment'], 'middle'),
            'markerVerticalAlignment': getValueOrDefault(s['markerVerticalAlignment'], 'top') };
    };

    return ImageMarkerSymbolizer;
}(PointSymbolizer);

var StrokeAndFillSymbolizer = function (_CanvasSymbolizer) {
    inherits(StrokeAndFillSymbolizer, _CanvasSymbolizer);

    StrokeAndFillSymbolizer.test = function test(symbol, geometry) {
        if (!symbol) {
            return false;
        }
        if (geometry && geometry.type === 'Point') {
            return false;
        }
        for (var p in symbol) {
            var f = p.slice(0, 4);
            if (f === 'line' || f === 'poly') {
                return true;
            }
        }
        return false;
    };

    function StrokeAndFillSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, StrokeAndFillSymbolizer);

        var _this = possibleConstructorReturn(this, _CanvasSymbolizer.call(this));

        _this.symbol = symbol;
        _this.geometry = geometry;
        _this.painter = painter;
        if (geometry.type === 'Point') {
            return possibleConstructorReturn(_this);
        }
        _this.style = _this._defineStyle(_this.translate());
        return _this;
    }

    StrokeAndFillSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        var style = this.style;
        if (style['polygonOpacity'] === 0 && style['lineOpacity'] === 0) {
            return;
        }
        var paintParams = this._getPaintParams();
        if (!paintParams) {
            return;
        }
        this._prepareContext(ctx);
        var isGradient$$1 = isGradient(style['lineColor']),
            isPath = this.geometry.getJSONType() === 'Polygon' || this.geometry.type === 'LineString';
        if (isGradient$$1 && (style['lineColor']['places'] || !isPath)) {
            style['lineGradientExtent'] = this.getPainter().getContainerExtent()._expand(style['lineWidth']);
        }
        if (isGradient(style['polygonFill'])) {
            style['polygonGradientExtent'] = this.getPainter().getContainerExtent();
        }

        var points = paintParams[0],
            isSplitted = this.geometry.getJSONType() === 'Polygon' && points.length > 0 && Array.isArray(points[0][0]) || this.geometry.type === 'LineString' && points.length > 0 && Array.isArray(points[0]);

        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                Canvas.prepareCanvas(ctx, style, resources);
                if (isGradient$$1 && isPath && !style['lineColor']['places']) {
                    this._createGradient(ctx, points[i], style['lineColor']);
                }
                var params = [ctx, points[i]];
                if (paintParams.length > 1) {
                    params.push.apply(params, paintParams.slice(1));
                }
                params.push(style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']);
                this.geometry._paintOn.apply(this.geometry, params);
            }
        } else {
            Canvas.prepareCanvas(ctx, style, resources);
            if (isGradient$$1 && isPath && !style['lineColor']['places']) {
                this._createGradient(ctx, points, style['lineColor']);
            }
            var _params = [ctx];
            _params.push.apply(_params, paintParams);
            _params.push(style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']);
            this.geometry._paintOn.apply(this.geometry, _params);
        }

        if (ctx.setLineDash && Array.isArray(style['lineDasharray'])) {
            ctx.setLineDash([]);
        }
    };

    StrokeAndFillSymbolizer.prototype.get2DExtent = function get2DExtent() {
        var map = this.getMap();
        var extent = this.geometry._getPrjExtent();
        if (!extent) {
            return null;
        }

        if (!this._extMin || !this._extMax) {
            this._extMin = new Coordinate(0, 0);
            this._extMax = new Coordinate(0, 0);
        }
        this._extMin.x = extent['xmin'];
        this._extMin.y = extent['ymin'];
        this._extMax.x = extent['xmax'];
        this._extMax.y = extent['ymax'];
        var min = map._prjToPoint(this._extMin),
            max = map._prjToPoint(this._extMax);
        if (!this._pxExtent) {
            this._pxExtent = new PointExtent(min, max);
        } else {
            this._pxExtent['xmin'] = Math.min(min.x, max.x);
            this._pxExtent['xmax'] = Math.max(min.x, max.x);
            this._pxExtent['ymin'] = Math.min(min.y, max.y);
            this._pxExtent['ymax'] = Math.max(min.y, max.y);
        }
        return this._pxExtent._expand(this.style['lineWidth'] / 2);
    };

    StrokeAndFillSymbolizer.prototype._getPaintParams = function _getPaintParams() {
        return this.getPainter().getPaintParams(this.style['lineDx'], this.style['lineDy']);
    };

    StrokeAndFillSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'lineColor': getValueOrDefault(s['lineColor'], '#000'),
            'lineWidth': getValueOrDefault(s['lineWidth'], 2),
            'lineOpacity': getValueOrDefault(s['lineOpacity'], 1),
            'lineDasharray': getValueOrDefault(s['lineDasharray'], []),
            'lineCap': getValueOrDefault(s['lineCap'], 'butt'),
            'lineJoin': getValueOrDefault(s['lineJoin'], 'miter'),
            'linePatternFile': getValueOrDefault(s['linePatternFile'], null),
            'lineDx': getValueOrDefault(s['lineDx'], 0),
            'lineDy': getValueOrDefault(s['lineDy'], 0),
            'polygonFill': getValueOrDefault(s['polygonFill'], null),
            'polygonOpacity': getValueOrDefault(s['polygonOpacity'], 1),
            'polygonPatternFile': getValueOrDefault(s['polygonPatternFile'], null)
        };
        if (result['lineWidth'] === 0) {
            result['lineOpacity'] = 0;
        }

        if (this.geometry.type === 'LineString' && !result['polygonFill']) {
            result['polygonFill'] = result['lineColor'];
        }
        return result;
    };

    StrokeAndFillSymbolizer.prototype._createGradient = function _createGradient(ctx, points, lineColor) {
        if (!Array.isArray(points)) {
            return;
        }
        var len = points.length;
        var grad = ctx.createLinearGradient(points[0].x, points[0].y, points[len - 1].x, points[len - 1].y);
        lineColor['colorStops'].forEach(function (stop) {
            grad.addColorStop.apply(grad, stop);
        });
        ctx.strokeStyle = grad;
    };

    return StrokeAndFillSymbolizer;
}(CanvasSymbolizer);

var CACHE_KEY = '___text_symbol_cache';

var TextMarkerSymbolizer = function (_PointSymbolizer) {
    inherits(TextMarkerSymbolizer, _PointSymbolizer);

    TextMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (!isNil(symbol['textName'])) {
            return true;
        }
        return false;
    };

    function TextMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, TextMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this._dynamic = hasFunctionDefinition(symbol);
        _this.style = _this._defineStyle(_this.translate());
        if (_this.style['textWrapWidth'] === 0) {
            return possibleConstructorReturn(_this);
        }
        _this.strokeAndFill = _this._defineStyle(_this.translateLineAndFill(_this.style));
        var textContent = replaceVariable(_this.style['textName'], _this.geometry.getProperties());
        if (!_this._dynamic) {
            _this._cacheKey = genCacheKey(textContent, _this.style);
        }
        _this._descText(textContent);
        return _this;
    }

    TextMarkerSymbolizer.prototype.symbolize = function symbolize(ctx, resources) {
        if (this.style['textSize'] === 0 || this.style['textOpacity'] === 0 || this.style['textWrapWidth'] === 0) {
            return;
        }
        var cookedPoints = this._getRenderContainerPoints();
        if (!isArrayHasData(cookedPoints)) {
            return;
        }
        var style = this.style,
            strokeAndFill = this.strokeAndFill;
        var textContent = replaceVariable(this.style['textName'], this.geometry.getProperties());
        this._descText(textContent);
        this._prepareContext(ctx);
        Canvas.prepareCanvas(ctx, strokeAndFill, resources);
        Canvas.prepareCanvasFont(ctx, style);
        for (var i = 0, len = cookedPoints.length; i < len; i++) {
            var p = cookedPoints[i];
            var origin = this._rotate(ctx, p, this._getRotationAt(i));
            if (origin) {
                p = origin;
            }
            Canvas.text(ctx, textContent, p, style, this.textDesc);
            if (origin) {
                ctx.restore();
            }
        }
    };

    TextMarkerSymbolizer.prototype.getPlacement = function getPlacement() {
        return this.symbol['textPlacement'];
    };

    TextMarkerSymbolizer.prototype.getRotation = function getRotation() {
        var r = this.style['textRotation'];
        if (!isNumber(r)) {
            return null;
        }

        return r * Math.PI / 180;
    };

    TextMarkerSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.style;
        return new Point(s['textDx'], s['textDy']);
    };

    TextMarkerSymbolizer.prototype.getMarkerExtent = function getMarkerExtent() {
        var dxdy = this.getDxDy(),
            style = this.style;
        var size = this.textDesc['size'];
        var alignPoint = getAlignPoint(size, style['textHorizontalAlignment'], style['textVerticalAlignment']);
        var alignW = alignPoint.x,
            alignH = alignPoint.y;
        if (style['textHaloRadius']) {
            var r = style['textHaloRadius'];
            size = size.add(r * 2, r * 2);
        }
        return new PointExtent(dxdy.add(alignW, alignH), dxdy.add(alignW + size['width'], alignH + size['height']));
    };

    TextMarkerSymbolizer.prototype.translate = function translate() {
        var s = this.symbol;
        var result = {
            'textName': s['textName'],
            'textFaceName': getValueOrDefault(s['textFaceName'], 'monospace'),
            'textWeight': getValueOrDefault(s['textWeight'], 'normal'),
            'textStyle': getValueOrDefault(s['textStyle'], 'normal'),
            'textSize': getValueOrDefault(s['textSize'], 10),
            'textFont': getValueOrDefault(s['textFont'], null),
            'textFill': getValueOrDefault(s['textFill'], '#000'),
            'textOpacity': getValueOrDefault(s['textOpacity'], 1),

            'textHaloFill': getValueOrDefault(s['textHaloFill'], '#ffffff'),
            'textHaloRadius': getValueOrDefault(s['textHaloRadius'], 0),
            'textHaloOpacity': getValueOrDefault(s['textHaloOpacity'], 1),

            'textWrapWidth': getValueOrDefault(s['textWrapWidth'], null),
            'textWrapCharacter': getValueOrDefault(s['textWrapCharacter'], '\n'),
            'textLineSpacing': getValueOrDefault(s['textLineSpacing'], 0),

            'textDx': getValueOrDefault(s['textDx'], 0),
            'textDy': getValueOrDefault(s['textDy'], 0),

            'textHorizontalAlignment': getValueOrDefault(s['textHorizontalAlignment'], 'middle'),
            'textVerticalAlignment': getValueOrDefault(s['textVerticalAlignment'], 'middle'),
            'textAlign': getValueOrDefault(s['textAlign'], 'center'),

            'textRotation': getValueOrDefault(s['textRotation'], 0),

            'textMaxWidth': getValueOrDefault(s['textMaxWidth'], 0),
            'textMaxHeight': getValueOrDefault(s['textMaxHeight'], 0)
        };

        if (result['textMaxWidth'] > 0 && (!result['textWrapWidth'] || result['textWrapWidth'] > result['textMaxWidth'])) {
            if (!result['textWrapWidth']) {
                result['textMaxHeight'] = 1;
            }
            result['textWrapWidth'] = result['textMaxWidth'];
        }
        return result;
    };

    TextMarkerSymbolizer.prototype.translateLineAndFill = function translateLineAndFill(s) {
        return {
            'lineColor': s['textHaloRadius'] ? s['textHaloFill'] : s['textFill'],
            'lineWidth': s['textHaloRadius'],
            'lineOpacity': s['textOpacity'],
            'lineDasharray': null,
            'lineCap': 'butt',
            'lineJoin': 'round',
            'polygonFill': s['textFill'],
            'polygonOpacity': s['textOpacity']
        };
    };

    TextMarkerSymbolizer.prototype._descText = function _descText(textContent) {
        if (this._dynamic) {
            this.textDesc = this._measureText(textContent);
            return;
        }
        this.textDesc = this._loadFromCache();
        if (!this.textDesc) {
            this.textDesc = this._measureText(textContent);
            this._storeToCache(this.textDesc);
        }
    };

    TextMarkerSymbolizer.prototype._measureText = function _measureText(textContent) {
        var maxHeight = this.style['textMaxHeight'];
        var textDesc = splitTextToRow(textContent, this.style);
        if (maxHeight && maxHeight < textDesc.size.height) {
            textDesc.size.height = maxHeight;
        }
        return textDesc;
    };

    TextMarkerSymbolizer.prototype._storeToCache = function _storeToCache(textDesc) {
        if (IS_NODE) {
            return;
        }
        if (!this.geometry[CACHE_KEY]) {
            this.geometry[CACHE_KEY] = {};
        }
        this.geometry[CACHE_KEY][this._cacheKey] = { 'desc': textDesc, 'active': true };
    };

    TextMarkerSymbolizer.prototype._loadFromCache = function _loadFromCache() {
        if (!this.geometry[CACHE_KEY]) {
            return null;
        }
        var cache = this.geometry[CACHE_KEY][this._cacheKey];
        if (!cache) {
            return null;
        }
        cache.active = true;
        return cache.desc;
    };

    return TextMarkerSymbolizer;
}(PointSymbolizer);

TextMarkerSymbolizer.CACHE_KEY = CACHE_KEY;

function genCacheKey(textContent, style) {
    var key = [textContent];
    for (var p in style) {
        if (style.hasOwnProperty(p) && p.length > 4 && p.substring(0, 4) === 'text') {
            key.push(p + '=' + style[p]);
        }
    }
    return key.join('-');
}

var VectorPathMarkerSymbolizer = function (_ImageMarkerSymbolize) {
    inherits(VectorPathMarkerSymbolizer, _ImageMarkerSymbolize);

    VectorPathMarkerSymbolizer.test = function test(symbol) {
        if (!symbol) {
            return false;
        }
        if (isNil(symbol['markerFile']) && symbol['markerType'] === 'path') {
            return true;
        }
        return false;
    };

    function VectorPathMarkerSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, VectorPathMarkerSymbolizer);

        var _this = possibleConstructorReturn(this, _ImageMarkerSymbolize.call(this, symbol, geometry, painter));

        _this.style = _this._defineStyle(_this.translate());

        if (isNil(_this.style['markerWidth'])) {
            _this.style['markerWidth'] = 80;
        }
        if (isNil(_this.style['markerHeight'])) {
            _this.style['markerHeight'] = 80;
        }
        if (Browser$1.gecko) {
            _this._url = [getMarkerPathBase64(symbol, _this.style['markerWidth'], _this.style['markerHeight']), _this.style['markerWidth'], _this.style['markerHeight']];
        } else {
            _this._url = [getMarkerPathBase64(symbol), symbol['markerWidth'], symbol['markerHeight']];
        }
        return _this;
    }

    VectorPathMarkerSymbolizer.prototype._prepareContext = function _prepareContext() {};

    VectorPathMarkerSymbolizer.prototype._getImage = function _getImage(resources) {
        if (resources && resources.isResourceLoaded(this._url)) {
            return resources.getImage(this._url);
        }
        var image = new Image();
        image.src = this._url[0];
        if (resources) {
            resources.addResource(this._url, image);
        }
        return image;
    };

    return VectorPathMarkerSymbolizer;
}(ImageMarkerSymbolizer);

var defaultSymbol = {
    lineWidth: 1,
    polygonFill: '#fff',
    polygonOpacity: 0.5
};

var DrawAltitudeSymbolizer = function (_PointSymbolizer) {
    inherits(DrawAltitudeSymbolizer, _PointSymbolizer);

    DrawAltitudeSymbolizer.test = function test(symbol, geometry) {
        var layer = geometry.getLayer();
        if (!layer) {
            return false;
        }
        var type = geometry.getJSONType();

        return type === 'Marker' || type === 'LineString';
    };

    function DrawAltitudeSymbolizer(symbol, geometry, painter) {
        classCallCheck(this, DrawAltitudeSymbolizer);

        var _this = possibleConstructorReturn(this, _PointSymbolizer.call(this, symbol, geometry, painter));

        _this.style = geometry.getLayer().options['drawAltitude'];
        if (!_this.style || !isObject(_this.style)) {
            _this.style = {
                'lineWidth': 2
            };
        }
        if (!_this.style['lineWidth']) {
            _this.style['lineWidth'] = 0;
        }
        _this.dxdy = _this._defineStyle({
            'dx': symbol['textDx'] || symbol['markerDx'],
            'dy': symbol['textDy'] || symbol['markerDy']
        });
        return _this;
    }

    DrawAltitudeSymbolizer.prototype.symbolize = function symbolize(ctx) {
        var layer = this.geometry.getLayer();
        if (!layer.options['drawAltitude']) {
            return;
        }
        var properties = this.geometry.getProperties();
        if (!properties || !properties[layer.options['altitudeProperty']]) {
            return;
        }
        var style = this._getStyle();
        this._prepareContext(ctx);
        if (this.geometry.type === 'LineString') {
            var paintParams = this._getPaintParams(style['lineDx'], style['lineDy']);
            if (!paintParams) {
                return;
            }

            var groundPoints = this.getPainter().getPaintParams(style['lineDx'], style['lineDy'], true)[0];
            this._drawLineAltitude(ctx, paintParams[0], groundPoints);
        } else {
            var point = this._getRenderContainerPoints(),
                groundPoint = this._getRenderContainerPoints(true);
            if (!point || point.length === 0) {
                return;
            }
            this._drawMarkerAltitude(ctx, point[0], groundPoint[0]);
        }
    };

    DrawAltitudeSymbolizer.prototype.getDxDy = function getDxDy() {
        var s = this.dxdy;
        return new Point(s['dx'] || 0, s['dy'] || 0);
    };

    DrawAltitudeSymbolizer.prototype.get2DExtent = function get2DExtent() {
        if (this.geometry.type === 'LineString') {
            return StrokeAndFillSymbolizer.prototype.get2DExtent.apply(this);
        } else {
            return _PointSymbolizer.prototype.get2DExtent.call(this);
        }
    };

    DrawAltitudeSymbolizer.prototype.getPlacement = function getPlacement() {
        return 'point';
    };

    DrawAltitudeSymbolizer.prototype._getPaintParams = function _getPaintParams(dx, dy) {
        return this.getPainter().getPaintParams(dx || 0, dy || 0);
    };

    DrawAltitudeSymbolizer.prototype._drawMarkerAltitude = function _drawMarkerAltitude(ctx, point, groundPoint) {
        var style = this._getStyle();
        Canvas.prepareCanvas(ctx, style);
        Canvas.path(ctx, [point, groundPoint], style['lineOpacity'], null, style['lineDasharray']);
    };

    DrawAltitudeSymbolizer.prototype._drawLineAltitude = function _drawLineAltitude(ctx, points, groundPoints) {
        var style = this._getStyle();
        var isSplitted = points.length > 0 && Array.isArray(points[0]);

        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                this._drawLine(ctx, points[i], groundPoints[i]);
            }
        } else {
            this._drawLine(ctx, points, groundPoints);
        }

        if (ctx.setLineDash && Array.isArray(style['lineDasharray'])) {
            ctx.setLineDash([]);
        }
    };

    DrawAltitudeSymbolizer.prototype._drawLine = function _drawLine(ctx, points, groundPoints) {
        var style = this._getStyle();
        Canvas.prepareCanvas(ctx, style);
        for (var i = 0, l = points.length - 1; i < l; i++) {
            Canvas.polygon(ctx, [points[i], points[i + 1], groundPoints[i + 1], groundPoints[i]], style['lineOpacity'], style['polygonOpacity'], style['lineDasharray']);
        }
    };

    DrawAltitudeSymbolizer.prototype._getStyle = function _getStyle() {
        var style = this.geometry.getLayer().options['drawAltitude'];
        if (!isObject(style)) {
            style = defaultSymbol;
        }
        if (!style['lineWidth']) {
            style['lineWidth'] = 0;
            style['lineOpacity'] = 0;
        }
        return style;
    };

    return DrawAltitudeSymbolizer;
}(PointSymbolizer);



var index$2 = Object.freeze({
	Symbolizer: Symbolizer,
	CanvasSymbolizer: CanvasSymbolizer,
	DebugSymbolizer: DebugSymbolizer,
	ImageMarkerSymbolizer: ImageMarkerSymbolizer,
	PointSymbolizer: PointSymbolizer,
	StrokeAndFillSymbolizer: StrokeAndFillSymbolizer,
	TextMarkerSymbolizer: TextMarkerSymbolizer,
	VectorMarkerSymbolizer: VectorMarkerSymbolizer,
	VectorPathMarkerSymbolizer: VectorPathMarkerSymbolizer,
	DrawAltitudeSymbolizer: DrawAltitudeSymbolizer
});

function translateToSVGStyles(s) {
    var result = {
        'stroke': {
            'stroke': s['markerLineColor'],
            'stroke-width': s['markerLineWidth'],
            'stroke-opacity': s['markerLineOpacity'],
            'stroke-dasharray': null,
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'round'
        },
        'fill': {
            'fill': s['markerFill'],
            'fill-opacity': s['markerFillOpacity']
        }
    };

    if (result['stroke']['stroke-linecap'] === 'butt') {
        if (Browser$1.vml) {
            result['stroke']['stroke-linecap'] = 'flat';
        }
    }
    if (result['stroke']['stroke-width'] === 0) {
        result['stroke']['stroke-opacity'] = 0;
    }
    return result;
}

function getMarkerPathBase64(symbol, width, height) {
    if (!symbol['markerPath']) {
        return null;
    }
    var op = 1;
    var styles = translateToSVGStyles(symbol);

    if (isNumber(symbol['markerOpacity'])) {
        op = symbol['markerOpacity'];
    }
    if (isNumber(symbol['opacity'])) {
        op *= symbol['opacity'];
    }
    var svgStyles = {};
    if (styles) {
        for (var p in styles['stroke']) {
            if (styles['stroke'].hasOwnProperty(p)) {
                if (!isNil(styles['stroke'][p])) {
                    svgStyles[p] = styles['stroke'][p];
                }
            }
        }
        for (var _p in styles['fill']) {
            if (styles['fill'].hasOwnProperty(_p)) {
                if (!isNil(styles['fill'][_p])) {
                    svgStyles[_p] = styles['fill'][_p];
                }
            }
        }
    }

    var pathes = Array.isArray(symbol['markerPath']) ? symbol['markerPath'] : [symbol['markerPath']];
    var path = void 0;
    var pathesToRender = [];
    for (var i = 0; i < pathes.length; i++) {
        path = isString(pathes[i]) ? {
            'path': pathes[i]
        } : pathes[i];
        path = extend({}, path, svgStyles);
        path['d'] = path['path'];
        delete path['path'];
        pathesToRender.push(path);
    }
    var svg = ['<svg version="1.1"', 'xmlns="http://www.w3.org/2000/svg"'];
    if (op < 1) {
        svg.push('opacity="' + op + '"');
    }

    if (symbol['markerPathWidth'] && symbol['markerPathHeight']) {
        svg.push('viewBox="0 0 ' + symbol['markerPathWidth'] + ' ' + symbol['markerPathHeight'] + '"');
    }
    svg.push('preserveAspectRatio="none"');
    if (width) {
        svg.push('width="' + width + '"');
    }
    if (height) {
        svg.push('height="' + height + '"');
    }
    svg.push('><defs></defs>');

    for (var _i = 0; _i < pathesToRender.length; _i++) {
        var strPath = '<path ';
        for (var _p2 in pathesToRender[_i]) {
            if (pathesToRender[_i].hasOwnProperty(_p2)) {
                strPath += ' ' + _p2 + '="' + pathesToRender[_i][_p2] + '"';
            }
        }
        strPath += '></path>';
        svg.push(strPath);
    }
    svg.push('</svg>');
    var b64 = 'data:image/svg+xml;base64,' + btoa(svg.join(' '));
    return b64;
}

function getExternalResources(symbol, toAbsolute) {
    if (!symbol) {
        return [];
    }
    var symbols = symbol;
    if (!Array.isArray(symbol)) {
        symbols = [symbol];
    }
    var resources = [];
    var props = Symbolizer.resourceProperties;
    var res = void 0,
        resSizeProp = void 0;
    var w = void 0,
        h = void 0;
    for (var i = symbols.length - 1; i >= 0; i--) {
        symbol = symbols[i];
        if (!symbol) {
            continue;
        }
        if (toAbsolute) {
            symbol = convertResourceUrl(symbol);
        }
        for (var ii = 0; ii < props.length; ii++) {
            res = symbol[props[ii]];
            if (isFunctionDefinition(res)) {
                res = getFunctionTypeResources(res);
            }
            if (!res) {
                continue;
            }
            if (!Array.isArray(res)) {
                res = [res];
            }
            for (var iii = 0; iii < res.length; iii++) {
                if (res[iii].slice(0, 4) === 'url(') {
                    res[iii] = extractCssUrl(res[iii]);
                }
                resSizeProp = Symbolizer.resourceSizeProperties[ii];
                resources.push([res[iii], symbol[resSizeProp[0]], symbol[resSizeProp[1]]]);
            }
        }
        if (symbol['markerType'] === 'path' && symbol['markerPath']) {
            w = isFunctionDefinition(symbol['markerWidth']) ? 200 : symbol['markerWidth'];
            h = isFunctionDefinition(symbol['markerHeight']) ? 200 : symbol['markerHeight'];
            if (isFunctionDefinition(symbol['markerPath'])) {
                res = getFunctionTypeResources(symbol['markerPath']);
                var path = symbol['markerPath'];
                for (var _iii = 0; _iii < res.length; _iii++) {
                    symbol['markerPath'] = res[_iii];
                    resources.push([getMarkerPathBase64(symbol), w, h]);
                }
                symbol['markerPath'] = path;
            } else {
                resources.push([getMarkerPathBase64(symbol), w, h]);
            }
        }
    }
    return resources;
}

function convertResourceUrl(symbol) {
    if (!symbol) {
        return null;
    }

    var s = symbol;
    if (IS_NODE) {
        return s;
    }
    var props = Symbolizer.resourceProperties;
    var res = void 0;
    for (var ii = 0, len = props.length; ii < len; ii++) {
        res = s[props[ii]];
        if (!res) {
            continue;
        }
        s[props[ii]] = _convertUrlToAbsolute(res);
    }
    return s;
}

function _convertUrlToAbsolute(res) {
    if (isFunctionDefinition(res)) {
        var stops = res.stops;
        for (var i = 0; i < stops.length; i++) {
            stops[i][1] = _convertUrlToAbsolute(stops[i][1]);
        }
        return res;
    }
    var embed = 'data:';
    if (res.slice(0, 4) === 'url(') {
        res = extractCssUrl(res);
    }
    if (!isURL(res) && (res.length <= embed.length || res.substring(0, embed.length) !== embed)) {
        res = _absolute(location.href, res);
    }
    return res;
}

function _absolute(base, relative) {
    var stack = base.split('/'),
        parts = relative.split('/');
    if (relative.slice(0, 1) === 0) {
        return stack.slice(0, 3).join('/') + relative;
    } else {
        stack.pop();
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === '.') continue;
            if (parts[i] === '..') stack.pop();else stack.push(parts[i]);
        }
        return stack.join('/');
    }
}



var index = Object.freeze({
	now: now,
	extend: extend,
	isNil: isNil,
	isNumber: isNumber,
	isInteger: isInteger,
	isObject: isObject,
	isString: isString,
	isFunction: isFunction,
	hasOwn: hasOwn,
	join: join,
	IS_NODE: IS_NODE,
	get requestAnimFrame () { return requestAnimFrame; },
	get cancelAnimFrame () { return cancelAnimFrame; },
	isSVG: isSVG,
	loadImage: loadImage,
	UID: UID,
	GUID: GUID,
	parseJSON: parseJSON,
	pushIn: pushIn,
	removeFromArray: removeFromArray,
	mapArrayRecursively: mapArrayRecursively,
	getValueOrDefault: getValueOrDefault,
	sign: sign,
	interpolate: interpolate,
	wrap: wrap,
	clamp: clamp,
	isArrayHasData: isArrayHasData,
	isURL: isURL,
	isCssUrl: isCssUrl,
	extractCssUrl: extractCssUrl,
	btoa: btoa,
	computeDegree: computeDegree,
	emptyImageUrl: emptyImageUrl,
	equalMapView: equalMapView,
	flash: flash,
	translateToSVGStyles: translateToSVGStyles,
	getMarkerPathBase64: getMarkerPathBase64,
	getExternalResources: getExternalResources,
	convertResourceUrl: convertResourceUrl,
	isGradient: isGradient,
	getGradientStamp: getGradientStamp,
	getSymbolStamp: getSymbolStamp,
	lowerSymbolOpacity: lowerSymbolOpacity,
	extendSymbol: extendSymbol
});

var Browser = {};

if (!IS_NODE) {
        var ua = navigator.userAgent.toLowerCase(),
            doc = document.documentElement,
            ie = 'ActiveXObject' in window,
            webkit = ua.indexOf('webkit') !== -1,
            phantomjs = ua.indexOf('phantom') !== -1,
            android23 = ua.search('android [23]') !== -1,
            chrome = ua.indexOf('chrome') !== -1,
            gecko = ua.indexOf('gecko') !== -1 && !webkit && !window.opera && !ie,
            mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
            msPointer = !window.PointerEvent && window.MSPointerEvent,
            pointer = window.PointerEvent && navigator.pointerEnabled || msPointer,
            ie3d = ie && 'transition' in doc.style,
            webkit3d = 'WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !android23,
            gecko3d = 'MozPerspective' in doc.style,
            opera12 = 'OTransition' in doc.style,
            any3d = (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs;

        var chromeVersion = 0;
        if (chrome) {
                chromeVersion = ua.match(/chrome\/([\d.]+)/)[1];
        }

        var touch = !phantomjs && (pointer || 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);

        var webgl = void 0;
        try {
                var canvas = document.createElement('canvas');
                var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                webgl = gl && gl instanceof WebGLRenderingContext;
        } catch (err) {
                webgl = false;
        }

        Browser = {
                ie: ie,
                ielt9: ie && !document.addEventListener,
                edge: 'msLaunchUri' in navigator && !('documentMode' in document),
                webkit: webkit,
                gecko: gecko,
                android: ua.indexOf('android') !== -1,
                android23: android23,
                chrome: chrome,
                chromeVersion: chromeVersion,
                safari: !chrome && ua.indexOf('safari') !== -1,
                phantomjs: phantomjs,

                ie3d: ie3d,
                webkit3d: webkit3d,
                gecko3d: gecko3d,
                opera12: opera12,
                any3d: any3d,

                mobile: mobile,
                mobileWebkit: mobile && webkit,
                mobileWebkit3d: mobile && webkit3d,
                mobileOpera: mobile && window.opera,
                mobileGecko: mobile && gecko,

                touch: !!touch,
                msPointer: !!msPointer,
                pointer: !!pointer,

                retina: (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,

                language: navigator.browserLanguage ? navigator.browserLanguage : navigator.language,
                ie9: ie && document.documentMode === 9,
                ie10: ie && document.documentMode === 10,

                webgl: webgl
        };
}

var Browser$1 = Browser;

var Ajax = {
    jsonp: function jsonp(url, callback) {
        var name = '_maptalks_jsonp_' + UID();
        if (url.match(/\?/)) url += '&callback=' + name;else url += '?callback=' + name;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        window[name] = function (data) {
            callback(null, data);
            document.getElementsByTagName('head')[0].removeChild(script);
            script = null;
            delete window[name];
        };

        document.getElementsByTagName('head')[0].appendChild(script);
        return this;
    },

    get: function get(url, cb, options) {
        if (IS_NODE && Ajax.get.node) {
            return Ajax.get.node(url, cb, options);
        }
        var client = Ajax._getClient(cb);
        client.open('GET', url, true);
        if (options) {
            for (var k in options.headers) {
                client.setRequestHeader(k, options.headers[k]);
            }
            client.withCredentials = options.credentials === 'include';
            if (options['responseType']) {
                client.responseType = options['responseType'];
            }
        }
        client.send(null);
        return this;
    },

    post: function post(options, postData, cb) {
        if (IS_NODE && Ajax.post.node) {
            return Ajax.post.node(options, postData, cb);
        }
        var client = Ajax._getClient(cb);
        client.open('POST', options.url, true);
        if (!options.headers) {
            options.headers = {};
        }
        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if ('setRequestHeader' in client) {
            for (var p in options.headers) {
                if (options.headers.hasOwnProperty(p)) {
                    client.setRequestHeader(p, options.headers[p]);
                }
            }
        }
        if (!isString(postData)) {
            postData = JSON.stringify(postData);
        }
        client.send(postData);
        return this;
    },

    _wrapCallback: function _wrapCallback(client, cb) {
        return function () {
            if (client.readyState === 4) {
                if (client.status === 200) {
                    if (client.responseType === 'arraybuffer') {
                        var response = client.response;
                        if (response.byteLength === 0) {
                            cb(new Error('http status 200 returned without content.'));
                        } else {
                            cb(null, {
                                data: client.response,
                                cacheControl: client.getResponseHeader('Cache-Control'),
                                expires: client.getResponseHeader('Expires'),
                                contentType: client.getResponseHeader('Content-Type')
                            });
                        }
                    } else {
                        cb(null, client.responseText);
                    }
                } else {
                    cb(new Error(client.statusText + ',' + client.status));
                }
            }
        };
    },

    _getClient: function _getClient(cb) {
        var client = void 0;
        try {
            client = new XMLHttpRequest();
        } catch (e) {
            try {
                client = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                try {
                    client = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) {}
            }
        }
        client.onreadystatechange = Ajax._wrapCallback(client, cb);
        return client;
    },
    getArrayBuffer: function getArrayBuffer(url, callback, options) {
        if (!options) {
            options = {};
        }
        options['responseType'] = 'arraybuffer';
        return Ajax.get(url, callback, options);
    },
    getImage: function getImage(img, url, options) {
        return Ajax.getArrayBuffer(url, function (err, imgData) {
            if (err) {
                if (img.onerror) {
                    img.onerror(err);
                }
            } else if (imgData) {
                var URL = window.URL || window.webkitURL;
                var onload = img.onload;
                img.onload = function () {
                    if (onload) {
                        onload();
                    }
                    URL.revokeObjectURL(img.src);
                };
                var blob = new Blob([new Uint8Array(imgData.data)], { type: imgData.contentType });
                img.cacheControl = imgData.cacheControl;
                img.expires = imgData.expires;
                img.src = imgData.data.byteLength ? URL.createObjectURL(blob) : emptyImageUrl;
            }
        }, options);
    }
};

Ajax.getJSON = function (url, cb, options) {
    var callback = function callback(err, resp) {
        var data = resp ? parseJSON(resp) : null;
        cb(err, data);
    };
    if (options && options['jsonp']) {
        return Ajax.jsonp(url, callback);
    }
    return Ajax.get(url, callback, options);
};

var Eventable = function Eventable(Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class.prototype.on = function on$$1(eventsOn, handler, context) {
            if (!eventsOn) {
                return this;
            }
            if (!isString(eventsOn)) {
                return this._switch('on', eventsOn, handler);
            }
            if (!handler) {
                return this;
            }
            if (!this._eventMap) {
                this._eventMap = {};
            }
            var eventTypes = eventsOn.toLowerCase().split(' ');
            var evtType = void 0;
            if (!context) {
                context = this;
            }
            var handlerChain = void 0;
            for (var ii = 0, ll = eventTypes.length; ii < ll; ii++) {
                evtType = eventTypes[ii];
                handlerChain = this._eventMap[evtType];
                if (!handlerChain) {
                    handlerChain = [];
                    this._eventMap[evtType] = handlerChain;
                }
                var l = handlerChain.length;
                if (l > 0) {
                    for (var i = 0; i < l; i++) {
                        if (handler === handlerChain[i].handler && handlerChain[i].context === context) {
                            return this;
                        }
                    }
                }
                handlerChain.push({
                    handler: handler,
                    context: context
                });
            }
            return this;
        };

        _class.prototype.addEventListener = function addEventListener() {
            return this.on.apply(this, arguments);
        };

        _class.prototype.once = function once(eventTypes, handler, context) {
            if (!isString(eventTypes)) {
                var once = {};
                for (var p in eventTypes) {
                    if (eventTypes.hasOwnProperty(p)) {
                        once[p] = this._wrapOnceHandler(p, eventTypes[p], context);
                    }
                }
                return this._switch('on', once);
            }
            var evetTypes = eventTypes.split(' ');
            for (var i = 0, l = evetTypes.length; i < l; i++) {
                this.on(evetTypes[i], this._wrapOnceHandler(evetTypes[i], handler, context));
            }
            return this;
        };

        _class.prototype.off = function off$$1(eventsOff, handler, context) {
            if (!this._eventMap || !eventsOff) {
                return this;
            }
            if (!isString(eventsOff)) {
                return this._switch('off', eventsOff, handler);
            }
            if (!handler) {
                return this;
            }
            var eventTypes = eventsOff.split(' ');
            var eventType = void 0,
                listeners = void 0,
                wrapKey = void 0;
            if (!context) {
                context = this;
            }
            for (var j = 0, jl = eventTypes.length; j < jl; j++) {
                eventType = eventTypes[j].toLowerCase();
                wrapKey = 'Z__' + eventType;
                listeners = this._eventMap[eventType];
                if (!listeners) {
                    return this;
                }
                for (var i = listeners.length - 1; i >= 0; i--) {
                    var listener = listeners[i];
                    if ((handler === listener.handler || handler === listener.handler[wrapKey]) && listener.context === context) {
                        delete listener.handler[wrapKey];
                        listeners.splice(i, 1);
                    }
                }
            }
            return this;
        };

        _class.prototype.removeEventListener = function removeEventListener() {
            return this.off.apply(this, arguments);
        };

        _class.prototype.listens = function listens(eventType, handler, context) {
            if (!this._eventMap || !isString(eventType)) {
                return 0;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain || !handlerChain.length) {
                return 0;
            }
            var count = 0;
            for (var i = 0, len = handlerChain.length; i < len; i++) {
                if (handler) {
                    if (handler === handlerChain[i].handler && (isNil(context) || handlerChain[i].context === context)) {
                        return 1;
                    }
                } else {
                    count++;
                }
            }
            return count;
        };

        _class.prototype.copyEventListeners = function copyEventListeners(target) {
            var eventMap = target._eventMap;
            if (!eventMap) {
                return this;
            }
            var handlerChain = void 0;
            for (var eventType in eventMap) {
                handlerChain = eventMap[eventType];
                for (var i = 0, len = handlerChain.length; i < len; i++) {
                    this.on(eventType, handlerChain[i].handler, handlerChain[i].context);
                }
            }
            return this;
        };

        _class.prototype.fire = function fire() {
            if (this._eventParent) {
                return this._eventParent.fire.apply(this._eventParent, arguments);
            }
            return this._fire.apply(this, arguments);
        };

        _class.prototype._wrapOnceHandler = function _wrapOnceHandler(evtType, handler, context) {
            var me = this;
            var key = 'Z__' + evtType;
            var called = false;
            var fn = function onceHandler() {
                if (called) {
                    return;
                }
                delete fn[key];
                called = true;
                if (context) {
                    handler.apply(context, arguments);
                } else {
                    handler.apply(this, arguments);
                }
                me.off(evtType, onceHandler, this);
            };
            fn[key] = handler;
            return fn;
        };

        _class.prototype._switch = function _switch(to, eventKeys, context) {
            for (var p in eventKeys) {
                if (eventKeys.hasOwnProperty(p)) {
                    this[to](p, eventKeys[p], context);
                }
            }
            return this;
        };

        _class.prototype._clearListeners = function _clearListeners(eventType) {
            if (!this._eventMap || !isString(eventType)) {
                return;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain) {
                return;
            }
            this._eventMap[eventType] = null;
        };

        _class.prototype._clearAllListeners = function _clearAllListeners() {
            this._eventMap = null;
        };

        _class.prototype._setEventParent = function _setEventParent(parent) {
            this._eventParent = parent;
            return this;
        };

        _class.prototype._fire = function _fire(eventType, param) {
            if (!this._eventMap) {
                return this;
            }
            var handlerChain = this._eventMap[eventType.toLowerCase()];
            if (!handlerChain) {
                return this;
            }
            if (!param) {
                param = {};
            }
            param['type'] = eventType;
            param['target'] = this;

            var queue = handlerChain.slice(0);
            var context = void 0,
                bubble = void 0,
                passed = void 0;
            for (var i = 0, len = queue.length; i < len; i++) {
                if (!queue[i]) {
                    continue;
                }
                context = queue[i].context;
                bubble = true;
                passed = extend({}, param);
                if (context) {
                    bubble = queue[i].handler.call(context, passed);
                } else {
                    bubble = queue[i].handler(passed);
                }

                if (bubble === false) {
                    if (param['domEvent']) {
                        stopPropagation(param['domEvent']);
                    }
                }
            }
            return this;
        };

        return _class;
    }(Base);
};

var Handler = function () {
    function Handler(target) {
        classCallCheck(this, Handler);

        this.target = target;
    }

    Handler.prototype.enable = function enable() {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this.addHooks();
        return this;
    };

    Handler.prototype.disable = function disable() {
        if (!this._enabled) {
            return this;
        }
        this._enabled = false;
        this.removeHooks();
        return this;
    };

    Handler.prototype.enabled = function enabled() {
        return !!this._enabled;
    };

    Handler.prototype.remove = function remove() {
        this.disable();
        delete this.target;
        delete this.dom;
    };

    return Handler;
}();

var Handler$1 = Eventable(Handler);

var Class = function () {
    function Class(options) {
        classCallCheck(this, Class);

        if (!this || !this.setOptions) {
            throw new Error('Class instance is being created without "new" operator.');
        }
        this.setOptions(options);
        this.callInitHooks();
    }

    Class.prototype.callInitHooks = function callInitHooks() {
        var proto = Object.getPrototypeOf(this);
        this._visitInitHooks(proto);
        return this;
    };

    Class.prototype.setOptions = function setOptions(options) {
        if (!this.hasOwnProperty('options')) {
            this.options = this.options ? Object.create(this.options) : {};
        }
        if (!options) {
            return this;
        }
        for (var i in options) {
            this.options[i] = options[i];
        }
        return this;
    };

    Class.prototype.config = function config(conf) {
        if (!conf) {
            var config = {};
            for (var p in this.options) {
                if (this.options.hasOwnProperty(p)) {
                    config[p] = this.options[p];
                }
            }
            return config;
        } else {
            if (arguments.length === 2) {
                var t = {};
                t[conf] = arguments[1];
                conf = t;
            }
            for (var i in conf) {
                this.options[i] = conf[i];

                if (this[i] && this[i] instanceof Handler$1) {
                    if (conf[i]) {
                        this[i].enable();
                    } else {
                        this[i].disable();
                    }
                }
            }

            this.onConfig(conf);
        }
        return this;
    };

    Class.prototype.onConfig = function onConfig() {};

    Class.prototype._visitInitHooks = function _visitInitHooks(proto) {
        if (this._initHooksCalled) {
            return;
        }
        var parentProto = Object.getPrototypeOf(proto);
        if (parentProto._visitInitHooks) {
            parentProto._visitInitHooks.call(this, parentProto);
        }
        this._initHooksCalled = true;
        var hooks = proto._initHooks;
        if (hooks && hooks !== parentProto._initHooks) {
            for (var i = 0; i < hooks.length; i++) {
                hooks[i].call(this);
            }
        }
    };

    Class.addInitHook = function addInitHook(fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };
        var proto = this.prototype;
        var parentProto = Object.getPrototypeOf(proto);
        if (!proto._initHooks || proto._initHooks === parentProto._initHooks) {
            proto._initHooks = [];
        }
        proto._initHooks.push(init);
        return this;
    };

    Class.include = function include() {
        for (var _len2 = arguments.length, sources = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            sources[_key2] = arguments[_key2];
        }

        for (var i = 0; i < sources.length; i++) {
            extend(this.prototype, sources[i]);
        }
        return this;
    };

    Class.mergeOptions = function mergeOptions(options) {
        var proto = this.prototype;
        var parentProto = Object.getPrototypeOf(proto);
        if (!proto.options || proto.options === parentProto.options) {
            proto.options = proto.options ? Object.create(proto.options) : {};
        }
        extend(proto.options, options);
        return this;
    };

    return Class;
}();

var registeredTypes = {};

var JSONAble = (function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class.registerJSONType = function registerJSONType(type) {
            if (!type) {
                return this;
            }
            registeredTypes[type] = this;
            return this;
        };

        _class.getJSONClass = function getJSONClass(type) {
            if (!type) {
                return null;
            }
            return registeredTypes[type];
        };

        _class.prototype.getJSONType = function getJSONType() {
            if (this._jsonType === undefined) {
                var clazz = Object.getPrototypeOf(this).constructor;
                for (var p in registeredTypes) {
                    if (registeredTypes[p] === clazz) {
                        this._jsonType = p;
                        break;
                    }
                }
            }
            if (!this._jsonType) {
                throw new Error('Found an unregistered geometry class!');
            }
            return this._jsonType;
        };

        return _class;
    }(Base);
});

var Handlerable = function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class.prototype.addHandler = function addHandler(name, handlerClass) {
            if (!handlerClass) {
                return this;
            }
            if (!this._handlers) {
                this._handlers = [];
            }

            if (this[name]) {
                this[name].enable();
                return this;
            }

            var handler = this[name] = new handlerClass(this);

            this._handlers.push(handler);

            if (this.options[name]) {
                handler.enable();
            }
            return this;
        };

        _class.prototype.removeHandler = function removeHandler(name) {
            if (!name) {
                return this;
            }
            var handler = this[name];
            if (handler) {
                var hit = this._handlers.indexOf(handler);
                if (hit >= 0) {
                    this._handlers.splice(hit, 1);
                }
                this[name].remove();
                delete this[name];
            }
            return this;
        };

        _class.prototype._clearHandlers = function _clearHandlers() {
            for (var i = 0, len = this._handlers.length; i < len; i++) {
                this._handlers[i].remove();
            }
            this._handlers = [];
        };

        return _class;
    }(Base);
};

var START_EVENTS = 'touchstart mousedown';
var MOVE_EVENTS = {
    mousedown: 'mousemove',
    touchstart: 'touchmove',
    pointerdown: 'touchmove',
    MSPointerDown: 'touchmove'
};
var END_EVENTS = {
    mousedown: 'mouseup',
    touchstart: 'touchend',
    pointerdown: 'touchend',
    MSPointerDown: 'touchend'
};

var DragHandler = function (_Handler) {
    inherits(DragHandler, _Handler);

    function DragHandler(dom) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, DragHandler);

        var _this = possibleConstructorReturn(this, _Handler.call(this, null));

        _this.dom = dom;
        _this.options = options;
        return _this;
    }

    DragHandler.prototype.enable = function enable() {
        if (!this.dom) {
            return this;
        }
        on(this.dom, START_EVENTS, this.onMouseDown, this);
        return this;
    };

    DragHandler.prototype.disable = function disable() {
        if (!this.dom) {
            return this;
        }
        this._offEvents();
        off(this.dom, START_EVENTS, this.onMouseDown);
        return this;
    };

    DragHandler.prototype.onMouseDown = function onMouseDown(event) {
        if (!this.options['rightclick'] && event.button === 2) {
            return;
        }
        if (this.options['cancelOn'] && this.options['cancelOn'](event) === true) {
            return;
        }
        var dom = this.dom;
        if (dom.setCapture) {
            dom.setCapture();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
        dom['ondragstart'] = function () {
            return false;
        };
        this.moved = false;
        var actual = event.touches ? event.touches[0] : event;
        this.startPos = new Point(actual.clientX, actual.clientY);
        on(document, MOVE_EVENTS[event.type], this.onMouseMove, this);
        on(document, END_EVENTS[event.type], this.onMouseUp, this);
        if (!this.options['ignoreMouseleave']) {
            on(this.dom, 'mouseleave', this.onMouseUp, this);
        }
        this.fire('mousedown', {
            'domEvent': event,
            'mousePos': new Point(actual.clientX, actual.clientY)
        });
    };

    DragHandler.prototype.onMouseMove = function onMouseMove(event) {
        if (event.touches && event.touches.length > 1) {
            return;
        }
        var actual = event.touches ? event.touches[0] : event;

        var newPos = new Point(actual.clientX, actual.clientY),
            offset = newPos.sub(this.startPos);
        if (!offset.x && !offset.y) {
            return;
        }
        if (!this.moved) {
            this.fire('dragstart', {
                'domEvent': event,
                'mousePos': this.startPos.copy()
            });
            this.moved = true;
        } else {
            this.fire('dragging', {
                'domEvent': event,
                'mousePos': new Point(actual.clientX, actual.clientY)
            });
        }
    };

    DragHandler.prototype.onMouseUp = function onMouseUp(event) {
        var actual = event.changedTouches ? event.changedTouches[0] : event;
        this._offEvents();
        var param = {
            'domEvent': event
        };
        if (isNumber(actual.clientX)) {
            param['mousePos'] = new Point(parseInt(actual.clientX, 0), parseInt(actual.clientY, 0));
        }
        if (this.moved) {
                this.fire('dragend', param);
            }

        this.fire('mouseup', param);
    };

    DragHandler.prototype._offEvents = function _offEvents() {
        var dom = this.dom;
        off(dom, 'mouseleave', this.onMouseUp, this);
        if (typeof document === 'undefined' || typeof window === 'undefined') {
            return;
        }
        for (var i in MOVE_EVENTS) {
            off(document, MOVE_EVENTS[i], this.onMouseMove, this);
            off(document, END_EVENTS[i], this.onMouseUp, this);
        }

        if (dom['releaseCapture']) {
            dom['releaseCapture']();
        } else if (window.captureEvents) {
            window.captureEvents(window['Event'].MOUSEMOVE | window['Event'].MOUSEUP);
        }
    };

    return DragHandler;
}(Handler$1);

var CRS = function () {
  function CRS(type, properties) {
    classCallCheck(this, CRS);

    this.type = type;
    this.properties = properties;
  }

  CRS.createProj4 = function createProj4(proj) {
    return new CRS('proj4', {
      'proj': proj
    });
  };

  CRS.fromProjectionCode = function fromProjectionCode(code) {
    if (!code) {
      return null;
    }
    code = code.toUpperCase().replace(':', '');
    return CRS[code] || null;
  };

  return CRS;
}();

CRS.WGS84 = CRS.createProj4('+proj=longlat +datum=WGS84 +no_defs');

CRS.EPSG4326 = CRS.WGS84;

CRS.EPSG3857 = CRS.createProj4('+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

CRS.IDENTITY = CRS.createProj4('+proj=identity +no_defs');

CRS.CGCS2000 = CRS.createProj4('+proj=longlat +datum=CGCS2000');

CRS.EPSG4490 = CRS.CGCS2000;

CRS.BD09LL = CRS.createProj4('+proj=longlat +datum=BD09');

CRS.GCJ02 = CRS.createProj4('+proj=longlat +datum=GCJ02');

var Transformation = function () {
    function Transformation(matrix) {
        classCallCheck(this, Transformation);

        this.matrix = matrix;
    }

    Transformation.prototype.transform = function transform(coordinates, scale) {
        return new Point(this.matrix[0] * (coordinates.x - this.matrix[2]) / scale, this.matrix[1] * (coordinates.y - this.matrix[3]) / scale);
    };

    Transformation.prototype.untransform = function untransform(point, scale) {
        return new Coordinate(point.x * scale / this.matrix[0] + this.matrix[2], point.y * scale / this.matrix[1] + this.matrix[3]);
    };

    return Transformation;
}();

var Common = {
    project: function project() {},
    unproject: function unproject() {},
    projectCoords: function projectCoords(coordinates) {
        var _this = this;

        if (!coordinates) {
            return [];
        }
        if (!Array.isArray(coordinates)) {
            return this.project(coordinates);
        }
        if (coordinates.length === 0) {
            return [];
        }
        if (!this.isSphere()) {
            return mapArrayRecursively(coordinates, this.project, this);
        }
        if (Array.isArray(coordinates[0])) {
            return coordinates.map(function (coords) {
                return _this.projectCoords(coords);
            });
        } else {
            var circum = this.getCircum();
            var extent = this.getSphereExtent(),
                sx = extent.sx,
                sy = extent.sy;
            var wrapX = void 0,
                wrapY = void 0;
            var pre = coordinates[0],
                current = void 0,
                dx = void 0,
                dy = void 0,
                p = void 0;
            var prj = [this.project(pre)];
            for (var i = 1, l = coordinates.length; i < l; i++) {
                current = coordinates[i];
                dx = current.x - pre.x;
                dy = current.y - pre.y;
                p = this.project(current);
                if (Math.abs(dx) > 180) {
                    if (wrapX === undefined) {
                        wrapX = current.x < pre.x;
                    }
                    if (wrapX) {
                        p._add(-circum.x * sign(dx) * sx, 0);
                        current._add(-360 * sign(dx), 0);
                    }
                }
                if (Math.abs(dy) > 90) {
                    if (wrapY === undefined) {
                        wrapY = current.y < pre.y;
                    }
                    if (wrapY) {
                        p._add(0, -circum.y * sign(dy) * sy);
                        current._add(0, -180 * sign(dy));
                    }
                }
                pre = current;
                prj.push(p);
            }
            return prj;
        }
    },
    unprojectCoords: function unprojectCoords(projCoords) {
        if (!projCoords) {
            return [];
        }
        if (!Array.isArray(projCoords)) {
            return this.unproject(projCoords);
        }
        return mapArrayRecursively(projCoords, this.unproject, this);
    },
    isSphere: function isSphere() {
        return !!this.sphere;
    },
    isOutSphere: function isOutSphere(pcoord) {
        if (!this.isSphere()) {
            return false;
        }
        var extent = this.getSphereExtent();
        return !extent.contains(pcoord);
    },
    wrapCoord: function wrapCoord(pcoord) {
        if (!this.isSphere()) {
            return pcoord;
        }
        var extent = this.getSphereExtent();
        var wrapped = new Coordinate(pcoord);
        if (!extent.contains(wrapped)) {
            wrapped.x = wrap(pcoord.x, extent.xmin, extent.xmax);
            wrapped.y = wrap(pcoord.y, extent.ymin, extent.ymax);
        }
        return wrapped;
    },
    getCircum: function getCircum() {
        if (!this.circum && this.isSphere()) {
            var extent = this.getSphereExtent();
            this.circum = {
                x: extent.getWidth(),
                y: extent.getHeight()
            };
        }
        return this.circum;
    },
    getSphereExtent: function getSphereExtent() {
        if (!this.extent && this.isSphere()) {
            var max = this.project(new Coordinate(180, 90)),
                min = this.project(new Coordinate(-180, -90));
            this.extent = new Extent(min, max, this);
            this.extent.sx = max.x > min.x ? 1 : -1;
            this.extent.sy = max.y > min.y ? 1 : -1;
        }
        return this.extent;
    }
};

var Common$1 = {
    measureLength: function measureLength(c1, c2) {
        if (!Array.isArray(c1)) {
            return this.measureLenBetween(c1, c2);
        }
        var len = 0;
        for (var i = 0, l = c1.length; i < l - 1; i++) {
            len += this.measureLenBetween(c1[i], c1[i + 1]);
        }
        return len;
    }
};

var Identity = extend({
    'measure': 'IDENTITY',

    measureLenBetween: function measureLenBetween(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        try {
            return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
        } catch (err) {
            return 0;
        }
    },

    measureArea: function measureArea(coordinates) {
        if (!Array.isArray(coordinates)) {
            return 0;
        }
        var area = 0;
        for (var i = 0, len = coordinates.length; i < len; i++) {
            var c1 = coordinates[i];
            var c2 = null;
            if (i === len - 1) {
                c2 = coordinates[0];
            } else {
                c2 = coordinates[i + 1];
            }
            area += c1.x * c2.y - c1.y * c2.x;
        }
        return Math.abs(area / 2);
    },

    locate: function locate(c, xDist, yDist) {
        if (!c) {
            return null;
        }
        if (!xDist) {
            xDist = 0;
        }
        if (!yDist) {
            yDist = 0;
        }
        if (!xDist && !yDist) {
            return c;
        }
        return new Coordinate(c.x + xDist, c.y + yDist);
    }
}, Common$1);

function rad(a) {
    return a * Math.PI / 180;
}

var Sphere = function () {
    function Sphere(radius) {
        classCallCheck(this, Sphere);

        this.radius = radius;
    }

    Sphere.prototype.measureLenBetween = function measureLenBetween(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        var b = rad(c1.y);
        var d = rad(c2.y),
            e = b - d,
            f = rad(c1.x) - rad(c2.x);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        b *= this.radius;
        return Math.round(b * 1E5) / 1E5;
    };

    Sphere.prototype.measureArea = function measureArea(coordinates) {
        var a = this.radius * Math.PI / 180;
        var b = 0,
            c = coordinates,
            d = c.length;
        if (d < 3) {
            return 0;
        }
        var i = void 0;
        for (i = 0; i < d - 1; i++) {
            var e = c[i],
                f = c[i + 1];
            b += e.x * a * Math.cos(e.y * Math.PI / 180) * f.y * a - f.x * a * Math.cos(f.y * Math.PI / 180) * e.y * a;
        }
        d = c[i];
        c = c[0];
        b += d.x * a * Math.cos(d.y * Math.PI / 180) * c.y * a - c.x * a * Math.cos(c.y * Math.PI / 180) * d.y * a;
        return 0.5 * Math.abs(b);
    };

    Sphere.prototype.locate = function locate(c, xDist, yDist) {
        if (!c) {
            return null;
        }
        if (!xDist) {
            xDist = 0;
        }
        if (!yDist) {
            yDist = 0;
        }
        if (!xDist && !yDist) {
            return c;
        }
        var x = void 0,
            y = void 0;
        var ry = rad(c.y);
        if (yDist !== 0) {
            var dy = Math.abs(yDist);
            var sy = Math.sin(dy / (2 * this.radius)) * 2;
            ry = ry + sy * (yDist > 0 ? 1 : -1);
            y = wrap(ry * 180 / Math.PI, -90, 90);
        } else {
            y = c.y;
        }
        if (xDist !== 0) {
            var dx = Math.abs(xDist);
            var rx = rad(c.x);
            var sx = 2 * Math.sqrt(Math.pow(Math.sin(dx / (2 * this.radius)), 2) / Math.pow(Math.cos(ry), 2));
            rx = rx + sx * (xDist > 0 ? 1 : -1);
            x = wrap(rx * 180 / Math.PI, -180, 180);
        } else {
            x = c.x;
        }
        return new Coordinate(x, y);
    };

    return Sphere;
}();

var WGS84Sphere = extend({
    'measure': 'EPSG:4326',
    sphere: new Sphere(6378137),
    measureLenBetween: function measureLenBetween() {
        return this.sphere.measureLenBetween.apply(this.sphere, arguments);
    },
    measureArea: function measureArea() {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },
    locate: function locate() {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
}, Common$1);

var BaiduSphere = extend({
    'measure': 'BAIDU',
    sphere: new Sphere(6370996.81),
    measureLenBetween: function measureLenBetween() {
        return this.sphere.measureLenBetween.apply(this.sphere, arguments);
    },
    measureArea: function measureArea() {
        return this.sphere.measureArea.apply(this.sphere, arguments);
    },
    locate: function locate() {
        return this.sphere.locate.apply(this.sphere, arguments);
    }
}, Common$1);

var DEFAULT$1 = WGS84Sphere;

var measurers = {};

function registerMeasurer(m) {
    measurers[m.measure] = m;
}

registerMeasurer(Identity);
registerMeasurer(WGS84Sphere);
registerMeasurer(BaiduSphere);

var Measurer = {
    getInstance: function getInstance(name) {
        if (!name) {
            return DEFAULT$1;
        }
        for (var p in measurers) {
            if (hasOwn(measurers, p)) {
                var mName = measurers[p]['measure'];
                if (!mName) {
                    continue;
                }
                if (name.toLowerCase() === mName.toLowerCase()) {
                    return measurers[p];
                }
            }
        }
        return null;
    }
};

var index$3 = Object.freeze({
	Identity: Identity,
	DEFAULT: DEFAULT$1,
	Measurer: Measurer,
	WGS84Sphere: WGS84Sphere,
	BaiduSphere: BaiduSphere
});

var EPSG3857 = extend({}, Common, {
    code: 'EPSG:3857',
    rad: Math.PI / 180,
    metersPerDegree: 6378137 * Math.PI / 180,
    maxLatitude: 85.0511287798,

    project: function project(lnglat) {
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree,
            max = this.maxLatitude;
        var lng = lnglat.x,
            lat = Math.max(Math.min(max, lnglat.y), -max);
        var c = void 0;
        if (lat === 0) {
            c = 0;
        } else {
            c = Math.log(Math.tan((90 + lat) * rad / 2)) / rad;
        }
        return new Coordinate(lng * metersPerDegree, c * metersPerDegree);
    },

    unproject: function unproject(pLnglat) {
        var x = pLnglat.x,
            y = pLnglat.y;
        var rad = this.rad,
            metersPerDegree = this.metersPerDegree;
        var c = void 0;
        if (y === 0) {
            c = 0;
        } else {
            c = y / metersPerDegree;
            c = (2 * Math.atan(Math.exp(c * rad)) - Math.PI / 2) / rad;
        }
        return new Coordinate(wrap(x / metersPerDegree, -180, 180), wrap(c, -this.maxLatitude, this.maxLatitude));
    }
}, WGS84Sphere);

var PROJ4326 = extend({}, Common, {
    code: 'EPSG:4326',
    project: function project(p) {
        return new Coordinate(p);
    },
    unproject: function unproject(p) {
        return new Coordinate(p);
    }
}, WGS84Sphere);

var Projection_EPSG4490 = extend({}, PROJ4326, {
  code: 'EPSG:4490'
});

var Projection_Baidu = extend({}, Common, {
    code: 'BAIDU',

    project: function project(p) {
        return this.convertLL2MC(p);
    },

    unproject: function unproject(p) {
        return this.convertMC2LL(p);
    }
}, BaiduSphere, {
    EARTHRADIUS: 6370996.81,
    MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
    LLBAND: [75, 60, 45, 30, 15, 0],
    MC2LL: [[1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2], [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86], [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37], [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06], [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4], [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]],
    LL2MC: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5], [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5], [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5], [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],

    convertMC2LL: function convertMC2LL(cB) {
        var cC = {
            x: Math.abs(cB.x),
            y: Math.abs(cB.y)
        };
        var cE = void 0;
        for (var cD = 0, len = this.MCBAND.length; cD < len; cD++) {
            if (cC.y >= this.MCBAND[cD]) {
                cE = this.MC2LL[cD];
                break;
            }
        }
        var T = this.convertor(cB, cE);
        var result = new Coordinate(T.x, T.y);
        return result;
    },
    convertLL2MC: function convertLL2MC(T) {
        var cD = void 0,
            cC = void 0,
            len = void 0;
        T.x = this.getLoop(T.x, -180, 180);
        T.y = this.getRange(T.y, -74, 74);
        var cB = new Coordinate(T.x, T.y);
        for (cC = 0, len = this.LLBAND.length; cC < len; cC++) {
            if (cB.y >= this.LLBAND[cC]) {
                cD = this.LL2MC[cC];
                break;
            }
        }
        if (!cD) {
            for (cC = this.LLBAND.length - 1; cC >= 0; cC--) {
                if (cB.y <= -this.LLBAND[cC]) {
                    cD = this.LL2MC[cC];
                    break;
                }
            }
        }
        var cE = this.convertor(T, cD);
        var result = new Coordinate(cE.x, cE.y);
        return result;
    },
    convertor: function convertor(cC, cD) {
        if (!cC || !cD) {
            return null;
        }
        var T = cD[0] + cD[1] * Math.abs(cC.x);
        var cB = Math.abs(cC.y) / cD[9];
        var cE = cD[2] + cD[3] * cB + cD[4] * cB * cB + cD[5] * cB * cB * cB + cD[6] * cB * cB * cB * cB + cD[7] * cB * cB * cB * cB * cB + cD[8] * cB * cB * cB * cB * cB * cB;
        T *= cC.x < 0 ? -1 : 1;
        cE *= cC.y < 0 ? -1 : 1;
        return new Coordinate(T, cE);
    },
    toRadians: function toRadians(T) {
        return Math.PI * T / 180;
    },
    toDegrees: function toDegrees(T) {
        return 180 * T / Math.PI;
    },
    getRange: function getRange(cC, cB, T) {
        if (cB != null) {
            cC = Math.max(cC, cB);
        }
        if (T != null) {
            cC = Math.min(cC, T);
        }
        return cC;
    },
    getLoop: function getLoop(cC, cB, T) {
        while (cC > T) {
            cC -= T - cB;
        }
        while (cC < cB) {
            cC += T - cB;
        }
        return cC;
    }
});

var Projection_IDENTITY = extend({}, Common, {
    code: 'IDENTITY',
    project: function project(p) {
        return p.copy();
    },
    unproject: function unproject(p) {
        return p.copy();
    }
}, Identity);

var DEFAULT = EPSG3857;

var projections = Object.freeze({
	EPSG3857: EPSG3857,
	DEFAULT: DEFAULT,
	EPSG4326: PROJ4326,
	EPSG4490: Projection_EPSG4490,
	BAIDU: Projection_Baidu,
	IDENTITY: Projection_IDENTITY,
	Common: Common
});

var Renderable = (function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class.registerRenderer = function registerRenderer(name, clazz) {
            var proto = this.prototype;
            var parentProto = Object.getPrototypeOf(proto);
            if (!proto._rendererClasses || proto._rendererClasses === parentProto._rendererClasses) {
                proto._rendererClasses = proto._rendererClasses ? Object.create(proto._rendererClasses) : {};
            }
            proto._rendererClasses[name.toLowerCase()] = clazz;
            return this;
        };

        _class.getRendererClass = function getRendererClass(name) {
            var proto = this.prototype;
            if (!proto._rendererClasses) {
                return null;
            }
            return proto._rendererClasses[name.toLowerCase()];
        };

        return _class;
    }(Base);
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var zousanMin = createCommonjsModule(function (module) {
  !function (t) {
    "use strict";
    function e(t) {
      if (t) {
        var e = this;t(function (t) {
          e.resolve(t);
        }, function (t) {
          e.reject(t);
        });
      }
    }function n(t, e) {
      if ("function" == typeof t.y) try {
        var n = t.y.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.resolve(e);
    }function o(t, e) {
      if ("function" == typeof t.n) try {
        var n = t.n.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.reject(e);
    }var r,
        i,
        c = "fulfilled",
        u = "rejected",
        s = "undefined",
        f = function () {
      function e() {
        for (; n.length - o;) {
          try {
            n[o]();
          } catch (e) {
            t.console && t.console.error(e);
          }n[o++] = i, o == r && (n.splice(0, r), o = 0);
        }
      }var n = [],
          o = 0,
          r = 1024,
          c = function () {
        if ((typeof MutationObserver === "undefined" ? "undefined" : _typeof(MutationObserver)) !== s) {
          var t = document.createElement("div"),
              n = new MutationObserver(e);return n.observe(t, { attributes: !0 }), function () {
            t.setAttribute("a", 0);
          };
        }return (typeof setImmediate === "undefined" ? "undefined" : _typeof(setImmediate)) !== s ? function () {
          setImmediate(e);
        } : function () {
          setTimeout(e, 0);
        };
      }();return function (t) {
        n.push(t), n.length - o == 1 && c();
      };
    }();e.prototype = { resolve: function resolve(t) {
        if (this.state === r) {
          if (t === this) return this.reject(new TypeError("Attempt to resolve promise with self"));var e = this;if (t && ("function" == typeof t || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)))) try {
            var o = !0,
                i = t.then;if ("function" == typeof i) return void i.call(t, function (t) {
              o && (o = !1, e.resolve(t));
            }, function (t) {
              o && (o = !1, e.reject(t));
            });
          } catch (u) {
            return void (o && this.reject(u));
          }this.state = c, this.v = t, e.c && f(function () {
            for (var o = 0, r = e.c.length; r > o; o++) {
              n(e.c[o], t);
            }
          });
        }
      }, reject: function reject(n) {
        if (this.state === r) {
          this.state = u, this.v = n;var i = this.c;i ? f(function () {
            for (var t = 0, e = i.length; e > t; t++) {
              o(i[t], n);
            }
          }) : !e.suppressUncaughtRejectionError && t.console && t.console.log("You upset Zousan. Please catch rejections: ", n, n ? n.stack : null);
        }
      }, then: function then(t, i) {
        var u = new e(),
            s = { y: t, n: i, p: u };if (this.state === r) this.c ? this.c.push(s) : this.c = [s];else {
          var l = this.state,
              a = this.v;f(function () {
            l === c ? n(s, a) : o(s, a);
          });
        }return u;
      }, "catch": function _catch(t) {
        return this.then(null, t);
      }, "finally": function _finally(t) {
        return this.then(t, t);
      }, timeout: function timeout(t, n) {
        n = n || "Timeout";var o = this;return new e(function (e, r) {
          setTimeout(function () {
            r(Error(n));
          }, t), o.then(function (t) {
            e(t);
          }, function (t) {
            r(t);
          });
        });
      } }, e.resolve = function (t) {
      var n = new e();return n.resolve(t), n;
    }, e.reject = function (t) {
      var n = new e();return n.reject(t), n;
    }, e.all = function (t) {
      function n(n, c) {
        n && "function" == typeof n.then || (n = e.resolve(n)), n.then(function (e) {
          o[c] = e, r++, r == t.length && i.resolve(o);
        }, function (t) {
          i.reject(t);
        });
      }for (var o = [], r = 0, i = new e(), c = 0; c < t.length; c++) {
        n(t[c], c);
      }return t.length || i.resolve(o), i;
    }, 'object' != s && module.exports && (module.exports = e), t.define && t.define.amd && t.define([], function () {
      return e;
    }), t.Zousan = e, e.soon = f;
  }("undefined" != typeof commonjsGlobal ? commonjsGlobal : commonjsGlobal);
});

var promise = void 0;

if (typeof Promise !== 'undefined') {
    promise = Promise;
} else {
    promise = zousanMin;
}

var Promise$1 = promise;

var CanvasRenderer = function (_Class) {
    inherits(CanvasRenderer, _Class);

    function CanvasRenderer(layer) {
        classCallCheck(this, CanvasRenderer);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.layer = layer;
        _this._painted = false;
        _this._drawTime = 0;
        _this.setToRedraw();
        return _this;
    }

    CanvasRenderer.prototype.render = function render() {
        var _this2 = this;

        this.prepareRender();
        if (!this.getMap() || !this.layer.isVisible()) {
            return;
        }
        if (!this.resources) {
            this.resources = new ResourceCache();
        }
        if (this.checkResources) {
            var resources = this.checkResources();
            if (resources.length > 0) {
                this._loadingResource = true;
                this.loadResources(resources).then(function () {
                    _this2._loadingResource = false;
                    if (_this2.layer) {
                        _this2.layer.fire('resourceload');
                        _this2.setToRedraw();
                    }
                });
            } else {
                this._tryToDraw(this);
            }
        } else {
            this._tryToDraw(this);
        }
    };

    CanvasRenderer.prototype.needToRedraw = function needToRedraw() {
        if (this._loadingResource) {
            return false;
        }
        if (this._toRedraw) {
            return true;
        }
        if (!this.drawOnInteracting) {
            return false;
        }
        var map = this.getMap();
        if (map.isInteracting()) {
            return !(!map.getPitch() && map.isMoving() && !map.isZooming() && !map.isRotating() && !this.layer.options['forceRenderOnMoving']);
        }
        return false;
    };

    CanvasRenderer.prototype.onSkipDrawOnInteracting = function onSkipDrawOnInteracting() {};

    CanvasRenderer.prototype.isRenderComplete = function isRenderComplete() {
        return !!this._renderComplete;
    };

    CanvasRenderer.prototype.mustRenderOnInteracting = function mustRenderOnInteracting() {
        return !this._painted || this.checkResources && this.checkResources().length > 0;
    };

    CanvasRenderer.prototype.setToRedraw = function setToRedraw() {
        this._toRedraw = true;
        return this;
    };

    CanvasRenderer.prototype.setCanvasUpdated = function setCanvasUpdated() {
        this._canvasUpdated = true;
        return this;
    };

    CanvasRenderer.prototype.isCanvasUpdated = function isCanvasUpdated() {
        return !!this._canvasUpdated;
    };

    CanvasRenderer.prototype.remove = function remove() {
        if (this.onRemove) {
            this.onRemove();
        }
        delete this._loadingResource;
        delete this._northWest;
        delete this.canvas;
        delete this.context;
        delete this._extent2D;
        delete this.resources;
        delete this.layer;
    };

    CanvasRenderer.prototype.getMap = function getMap() {
        if (!this.layer) {
            return null;
        }
        return this.layer.getMap();
    };

    CanvasRenderer.prototype.getCanvasImage = function getCanvasImage() {
        this._canvasUpdated = false;
        if (this._renderZoom !== this.getMap().getZoom() || !this.canvas || !this._extent2D) {
            return null;
        }
        if (this.isBlank()) {
            return null;
        }
        if (this.layer.isEmpty && this.layer.isEmpty()) {
            return null;
        }
        var map = this.getMap(),
            size = this._extent2D.getSize(),
            containerPoint = map._pointToContainerPoint(this._northWest);
        return {
            'image': this.canvas,
            'layer': this.layer,
            'point': containerPoint,
            'size': size
        };
    };

    CanvasRenderer.prototype.clear = function clear() {
        this.clearCanvas();
    };

    CanvasRenderer.prototype.isBlank = function isBlank() {
        if (!this._painted) {
            return true;
        }
        return false;
    };

    CanvasRenderer.prototype.show = function show() {
        this.setToRedraw();
    };

    CanvasRenderer.prototype.hide = function hide() {
        this.clear();
        this.setToRedraw();
    };

    CanvasRenderer.prototype.setZIndex = function setZIndex() {
        this.setToRedraw();
    };

    CanvasRenderer.prototype.hitDetect = function hitDetect(point) {
        if (!this.context || this.layer.isEmpty && this.layer.isEmpty() || this.isBlank() || this._errorThrown) {
            return false;
        }
        var map = this.getMap();
        var size = map.getSize();
        if (point.x < 0 || point.x > size['width'] || point.y < 0 || point.y > size['height']) {
            return false;
        }
        try {
            var imgData = this.context.getImageData(point.x, point.y, 1, 1).data;
            if (imgData[3] > 0) {
                return true;
            }
        } catch (error) {
            if (!this._errorThrown) {
                if (console) {
                    console.warn('hit detect failed with tainted canvas, some geometries have external resources in another domain:\n', error);
                }
                this._errorThrown = true;
            }

            return false;
        }
        return false;
    };

    CanvasRenderer.prototype.loadResources = function loadResources(resourceUrls) {
        if (!this.resources) {
            this.resources = new ResourceCache();
        }
        var resources = this.resources,
            promises = [];
        if (isArrayHasData(resourceUrls)) {
            var cache = {};
            for (var i = resourceUrls.length - 1; i >= 0; i--) {
                var url = resourceUrls[i];
                if (!url || !url.length || cache[url.join('-')]) {
                    continue;
                }
                cache[url.join('-')] = 1;
                if (!resources.isResourceLoaded(url, true)) {
                    promises.push(new Promise$1(this._promiseResource(url)));
                }
            }
        }
        return Promise$1.all(promises);
    };

    CanvasRenderer.prototype.prepareRender = function prepareRender() {
        delete this._renderComplete;
        var map = this.getMap();
        this._renderZoom = map.getZoom();
        this._extent2D = map._get2DExtent();
        this._northWest = map._containerPointToPoint(new Point(0, 0));
    };

    CanvasRenderer.prototype.createCanvas = function createCanvas() {
        if (this.canvas) {
            return;
        }
        var map = this.getMap();
        var size = map.getSize();
        var r = Browser$1.retina ? 2 : 1,
            w = r * size.width,
            h = r * size.height;
        if (this.layer._canvas) {
            var canvas = this.layer._canvas;
            canvas.width = w;
            canvas.height = h;
            if (canvas.style) {
                canvas.style.width = size.width + 'px';
                canvas.style.height = size.height + 'px';
            }
            this.canvas = this.layer._canvas;
        } else {
            this.canvas = Canvas.createCanvas(w, h, map.CanvasClass);
        }
        this.context = this.canvas.getContext('2d');
        if (this.layer.options['globalCompositeOperation']) {
            this.context.globalCompositeOperation = this.layer.options['globalCompositeOperation'];
        }
        if (Browser$1.retina) {
            var _r = 2;
            this.context.scale(_r, _r);
        }
        this.onCanvasCreate();

        this.layer.fire('canvascreate', {
            'context': this.context,
            'gl': this.gl
        });
    };

    CanvasRenderer.prototype.onCanvasCreate = function onCanvasCreate() {};

    CanvasRenderer.prototype.resetCanvasTransform = function resetCanvasTransform() {
        if (!this.context) {
            return;
        }
        var r = Browser$1.retina ? 2 : 1;
        this.context.setTransform(r, 0, 0, r, 0, 0);
    };

    CanvasRenderer.prototype.resizeCanvas = function resizeCanvas(canvasSize) {
        if (!this.canvas) {
            return;
        }
        var size = void 0;
        if (!canvasSize) {
            var map = this.getMap();
            size = map.getSize();
        } else {
            size = canvasSize;
        }
        var r = Browser$1.retina ? 2 : 1;
        if (this.canvas.width === r * size.width && this.canvas.height === r * size.height) {
            return;
        }

        this.canvas.height = r * size.height;
        this.canvas.width = r * size.width;
        if (Browser$1.retin && this.context) {
            this.context.scale(r, r);
        }
        if (this.layer._canvas && this.canvas.style) {
            this.canvas.style.width = size.width + 'px';
            this.canvas.style.height = size.height + 'px';
        }
    };

    CanvasRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.context) {
            return;
        }
        Canvas.clearRect(this.context, 0, 0, this.canvas.width, this.canvas.height);
    };

    CanvasRenderer.prototype.prepareCanvas = function prepareCanvas() {
        if (!this.canvas) {
            this.createCanvas();
        } else {
            this.clearCanvas();
        }
        delete this._maskExtent;
        var mask = this.layer.getMask();

        if (!mask) {
            this.layer.fire('renderstart', {
                'context': this.context,
                'gl': this.gl
            });
            return null;
        }
        var maskExtent2D = this._maskExtent = mask._getPainter().get2DExtent();
        if (!maskExtent2D.intersects(this._extent2D)) {
            this.layer.fire('renderstart', {
                'context': this.context,
                'gl': this.gl
            });
            return maskExtent2D;
        }
        this._shouldClip = true;

        this.layer.fire('renderstart', {
            'context': this.context,
            'gl': this.gl
        });
        return maskExtent2D;
    };

    CanvasRenderer.prototype.clipCanvas = function clipCanvas(context) {
        var mask = this.layer.getMask();
        if (!mask && !this._shouldClip) {
            return false;
        }
        var old = this._northWest;

        this._northWest = this.getMap()._containerPointToPoint(new Point(0, 0));
        context.save();
        mask._getPainter().paint(null, context);
        context.clip();
        this._northWest = old;
        if (this.isRenderComplete()) {
            this._shouldClip = false;
        }
        return true;
    };

    CanvasRenderer.prototype.getViewExtent = function getViewExtent() {
        return {
            'extent': this._extent2D,
            'maskExtent': this._maskExtent,
            'zoom': this._renderZoom,
            'northWest': this._northWest
        };
    };

    CanvasRenderer.prototype.completeRender = function completeRender() {
        if (this.getMap()) {
            this._renderComplete = true;

            this.layer.fire('renderend', {
                'context': this.context,
                'gl': this.gl
            });
            this.setCanvasUpdated();
        }
    };

    CanvasRenderer.prototype.getEvents = function getEvents() {
        return {
            '_zoomstart': this.onZoomStart,
            '_zooming': this.onZooming,
            '_zoomend': this.onZoomEnd,
            '_resize': this.onResize,
            '_movestart': this.onMoveStart,
            '_moving': this.onMoving,
            '_moveend': this.onMoveEnd,
            '_dragrotatestart': this.onDragRotateStart,
            '_dragrotating': this.onDragRotating,
            '_dragrotateend': this.onDragRotateEnd,
            '_spatialreferencechange': this.onSpatialReferenceChange
        };
    };

    CanvasRenderer.prototype.onZoomStart = function onZoomStart() {};

    CanvasRenderer.prototype.onZoomEnd = function onZoomEnd() {
        this.setToRedraw();
    };

    CanvasRenderer.prototype.onZooming = function onZooming() {};

    CanvasRenderer.prototype.onMoveStart = function onMoveStart() {};

    CanvasRenderer.prototype.onMoving = function onMoving() {};

    CanvasRenderer.prototype.onMoveEnd = function onMoveEnd() {
        this.setToRedraw();
    };

    CanvasRenderer.prototype.onResize = function onResize() {
        delete this._extent2D;
        this.resizeCanvas();
        this.setToRedraw();
    };

    CanvasRenderer.prototype.onDragRotateStart = function onDragRotateStart() {};

    CanvasRenderer.prototype.onDragRotating = function onDragRotating() {};

    CanvasRenderer.prototype.onDragRotateEnd = function onDragRotateEnd() {
        this.setToRedraw();
    };

    CanvasRenderer.prototype.onSpatialReferenceChange = function onSpatialReferenceChange() {};

    CanvasRenderer.prototype.getDrawTime = function getDrawTime() {
        return this._drawTime;
    };

    CanvasRenderer.prototype._tryToDraw = function _tryToDraw() {
        this._toRedraw = false;
        if (!this.canvas && this.layer.isEmpty && this.layer.isEmpty()) {
            this._renderComplete = true;

            return;
        }
        this._drawAndRecord();
    };

    CanvasRenderer.prototype._drawAndRecord = function _drawAndRecord() {
        if (!this.getMap()) {
            return;
        }
        var painted = this._painted;
        this._painted = true;
        var t = now();
        this.draw();
        t = now() - t;

        this._drawTime = painted ? t : t / 2;
        if (painted && this.layer.options['logDrawTime']) {
            console.log('drawTime:', this.layer.getId(), this._drawTime);
        }
    };

    CanvasRenderer.prototype._promiseResource = function _promiseResource(url) {
        var me = this,
            resources = this.resources,
            crossOrigin = this.layer.options['crossOrigin'];
        return function (resolve) {
            if (resources.isResourceLoaded(url, true)) {
                resolve(url);
                return;
            }
            var img = new Image();
            if (crossOrigin) {
                img['crossOrigin'] = crossOrigin;
            }
            if (isSVG(url[0]) && !IS_NODE) {
                if (url[1]) {
                    url[1] *= 2;
                }
                if (url[2]) {
                    url[2] *= 2;
                }
            }
            img.onload = function () {
                me._cacheResource(url, img);
                resolve(url);
            };
            img.onabort = function (err) {
                if (console) {
                    console.warn('image loading aborted: ' + url[0]);
                }
                if (err) {
                    if (console) {
                        console.warn(err);
                    }
                }
                resolve(url);
            };
            img.onerror = function (err) {
                if (err && typeof console !== 'undefined') {
                    console.warn(err);
                }
                resources.markErrorResource(url);
                resolve(url);
            };
            loadImage(img, url);
        };
    };

    CanvasRenderer.prototype._cacheResource = function _cacheResource(url, img) {
        if (!this.layer || !this.resources) {
            return;
        }
        var w = url[1],
            h = url[2];
        if (this.layer.options['cacheSvgOnCanvas'] && isSVG(url[0]) === 1 && (Browser$1.edge || Browser$1.ie)) {
            if (isNil(w)) {
                w = img.width || this.layer.options['defaultIconSize'][0];
            }
            if (isNil(h)) {
                h = img.height || this.layer.options['defaultIconSize'][1];
            }
            var canvas = Canvas.createCanvas(w, h);
            Canvas.image(canvas.getContext('2d'), img, 0, 0, w, h);
            img = canvas;
        }
        this.resources.addResource(url, img);
    };

    return CanvasRenderer;
}(Class);

var ResourceCache = function () {
    function ResourceCache() {
        classCallCheck(this, ResourceCache);

        this.resources = {};
        this._errors = {};
    }

    ResourceCache.prototype.addResource = function addResource(url, img) {
        this.resources[url[0]] = {
            image: img,
            width: +url[1],
            height: +url[2]
        };
    };

    ResourceCache.prototype.isResourceLoaded = function isResourceLoaded(url, checkSVG) {
        if (!url) {
            return false;
        }
        var imgUrl = this._getImgUrl(url);
        if (this._errors[imgUrl]) {
            return true;
        }
        var img = this.resources[imgUrl];
        if (!img) {
            return false;
        }
        if (checkSVG && isSVG(url[0]) && (+url[1] > img.width || +url[2] > img.height)) {
            return false;
        }
        return true;
    };

    ResourceCache.prototype.getImage = function getImage(url) {
        var imgUrl = this._getImgUrl(url);
        if (!this.isResourceLoaded(url) || this._errors[imgUrl]) {
            return null;
        }
        return this.resources[imgUrl].image;
    };

    ResourceCache.prototype.markErrorResource = function markErrorResource(url) {
        this._errors[this._getImgUrl(url)] = 1;
    };

    ResourceCache.prototype.merge = function merge(res) {
        if (!res) {
            return this;
        }
        for (var p in res.resources) {
            var img = res.resources[p];
            this.addResource([p, img.width, img.height], img.image);
        }
        return this;
    };

    ResourceCache.prototype._getImgUrl = function _getImgUrl(url) {
        if (!Array.isArray(url)) {
            return url;
        }
        return url[0];
    };

    return ResourceCache;
}();

var options$1 = {
    'minZoom': null,
    'maxZoom': null,
    'visible': true,
    'opacity': 1,

    'globalCompositeOperation': null,
    'renderer': 'canvas',
    'debugOutline': '#0f0'
};

var Layer = function (_JSONAble) {
    inherits(Layer, _JSONAble);

    function Layer(id, options) {
        classCallCheck(this, Layer);

        var canvas = void 0;
        if (options) {
            canvas = options.canvas;
            delete options.canvas;
        }

        var _this = possibleConstructorReturn(this, _JSONAble.call(this, options));

        if (canvas) {
            _this._canvas = canvas;
        }
        _this.setId(id);
        return _this;
    }

    Layer.prototype.load = function load() {
        if (!this.getMap()) {
            return this;
        }
        if (this.onLoad()) {
            this._initRenderer();
            var zIndex = this.getZIndex();
            if (!isNil(zIndex)) {
                this._renderer.setZIndex(zIndex);
                if (!this.isCanvasRender()) {
                    this._renderer.render();
                }
            }
        }
        return this;
    };

    Layer.prototype.getId = function getId() {
        return this._id;
    };

    Layer.prototype.setId = function setId(id) {
        var old = this._id;
        if (!isNil(id)) {
            id = id + '';
        }
        this._id = id;

        this.fire('idchange', {
            'old': old,
            'new': id
        });
        return this;
    };

    Layer.prototype.addTo = function addTo(map) {
        map.addLayer(this);
        return this;
    };

    Layer.prototype.setZIndex = function setZIndex(zIndex) {
        this._zIndex = zIndex;
        if (this.map) {
            this.map._sortLayersByZIndex();
        }
        if (this._renderer) {
            this._renderer.setZIndex(zIndex);
        }
        return this;
    };

    Layer.prototype.getZIndex = function getZIndex() {
        return this._zIndex;
    };

    Layer.prototype.getOpacity = function getOpacity() {
        return this.options['opacity'];
    };

    Layer.prototype.setOpacity = function setOpacity(op) {
        this.config('opacity', op);
        return this;
    };

    Layer.prototype.isCanvasRender = function isCanvasRender() {
        var renderer = this._getRenderer();
        return renderer && renderer instanceof CanvasRenderer;
    };

    Layer.prototype.getMap = function getMap() {
        if (this.map) {
            return this.map;
        }
        return null;
    };

    Layer.prototype.getProjection = function getProjection() {
        var map = this.getMap();
        return map ? map.getProjection() : null;
    };

    Layer.prototype.bringToFront = function bringToFront() {
        var layers = this._getLayerList();
        if (!layers.length) {
            return this;
        }
        var topLayer = layers[layers.length - 1];
        if (layers.length === 1 || topLayer === this) {
            return this;
        }
        var max = topLayer.getZIndex();
        this.setZIndex(max + 1);
        return this;
    };

    Layer.prototype.bringToBack = function bringToBack() {
        var layers = this._getLayerList();
        if (!layers.length) {
            return this;
        }
        var bottomLayer = layers[0];
        if (layers.length === 1 || bottomLayer === this) {
            return this;
        }
        var min = bottomLayer.getZIndex();
        this.setZIndex(min - 1);
        return this;
    };

    Layer.prototype.show = function show() {
        var _this2 = this;

        if (!this.options['visible']) {
            this.options['visible'] = true;
            var renderer = this.getRenderer();
            if (renderer) {
                renderer.show();
            }

            var map = this.getMap();
            if (renderer && map) {
                map.once('renderend', function () {
                    _this2.fire('show');
                });
            } else {
                this.fire('show');
            }
        }
        return this;
    };

    Layer.prototype.hide = function hide() {
        var _this3 = this;

        if (this.options['visible']) {
            this.options['visible'] = false;
            var renderer = this.getRenderer();
            if (renderer) {
                renderer.hide();
            }

            var map = this.getMap();
            if (renderer && map) {
                map.once('renderend', function () {
                    _this3.fire('hide');
                });
            } else {
                this.fire('hide');
            }
        }

        return this;
    };

    Layer.prototype.isVisible = function isVisible() {
        if (isNumber(this.options['opacity']) && this.options['opacity'] <= 0) {
            return false;
        }
        var map = this.getMap();
        if (map) {
            var zoom = map.getZoom();
            if (!isNil(this.options['maxZoom']) && this.options['maxZoom'] < zoom || !isNil(this.options['minZoom']) && this.options['minZoom'] > zoom) {
                return false;
            }
        }

        if (isNil(this.options['visible'])) {
            this.options['visible'] = true;
        }
        return this.options['visible'];
    };

    Layer.prototype.remove = function remove() {
        if (this.map) {
            this.map.removeLayer(this);
        }
        return this;
    };

    Layer.prototype.getMask = function getMask() {
        return this._mask;
    };

    Layer.prototype.setMask = function setMask(mask) {
        if (!(mask.type === 'Point' && mask._isVectorMarker() || mask.type === 'Polygon')) {
            throw new Error('Mask for a layer must be a marker with vector marker symbol, a Polygon or a MultiPolygon.');
        }

        if (mask.type === 'Point') {
            mask.updateSymbol({
                'markerLineColor': 'rgba(0, 0, 0, 0)',
                'markerFillOpacity': 0
            });
        } else {
            mask.setSymbol({
                'lineColor': 'rgba(0, 0, 0, 0)',
                'polygonOpacity': 0
            });
        }
        mask._bindLayer(this);
        this._mask = mask;
        if (!this.getMap() || this.getMap().isZooming()) {
            return this;
        }
        var renderer = this._getRenderer();
        if (renderer && renderer.setToRedraw) {
            this._getRenderer().setToRedraw();
        }
        return this;
    };

    Layer.prototype.removeMask = function removeMask() {
        delete this._mask;
        if (!this.getMap() || this.getMap().isZooming()) {
            return this;
        }
        var renderer = this._getRenderer();
        if (renderer && renderer.setToRedraw) {
            this._getRenderer().setToRedraw();
        }
        return this;
    };

    Layer.prototype.onLoad = function onLoad() {
        return true;
    };

    Layer.prototype.isLoaded = function isLoaded() {
        return !!this._loaded;
    };

    Layer.prototype.getRenderer = function getRenderer() {
        return this._getRenderer();
    };

    Layer.prototype.onConfig = function onConfig(conf) {
        if (isNumber(conf['opacity'])) {
            var renderer = this.getRenderer();
            if (renderer) {
                renderer.setToRedraw();
            }
        }
    };

    Layer.prototype._bindMap = function _bindMap(map, zIndex) {
        if (!map) {
            return;
        }
        this.map = map;
        this.setZIndex(zIndex);
        this._switchEvents('on', this);

        if (this.onAdd) {
            this.onAdd();
        }

        this.fire('add');
    };

    Layer.prototype._initRenderer = function _initRenderer() {
        var renderer = this.options['renderer'];
        if (!this.constructor.getRendererClass) {
            return;
        }
        var clazz = this.constructor.getRendererClass(renderer);
        if (!clazz) {
            throw new Error('Invalid renderer for Layer(' + this.getId() + '):' + renderer);
        }
        this._renderer = new clazz(this);
        this._renderer.layer = this;
        this._renderer.setZIndex(this.getZIndex());
        this._switchEvents('on', this._renderer);
        if (this._renderer.onAdd) {
            this._renderer.onAdd();
        }
        this.fire('renderercreate', {
            'renderer': this._renderer
        });
    };

    Layer.prototype._doRemove = function _doRemove() {
        this._loaded = false;
        if (this.onRemove) {
            this.onRemove();
        }
        this._switchEvents('off', this);
        if (this._renderer) {
            this._switchEvents('off', this._renderer);
            this._renderer.remove();
            delete this._renderer;
        }
        delete this._mask;
        delete this.map;
    };

    Layer.prototype._switchEvents = function _switchEvents(to, emitter) {
        if (emitter && emitter.getEvents) {
            this.getMap()[to](emitter.getEvents(), emitter);
        }
    };

    Layer.prototype._getRenderer = function _getRenderer() {
        return this._renderer;
    };

    Layer.prototype._getLayerList = function _getLayerList() {
        if (!this.map) {
            return [];
        }
        return this.map._layers;
    };

    Layer.prototype._getMask2DExtent = function _getMask2DExtent() {
        if (!this._mask || !this.getMap()) {
            return null;
        }
        var painter = this._mask._getPainter();
        if (!painter) {
            return null;
        }
        return painter.get2DExtent();
    };

    return Layer;
}(JSONAble(Eventable(Renderable(Class))));

Layer.mergeOptions(options$1);

var fire = Layer.prototype.fire;

Layer.prototype.fire = function (eventType, param) {
    if (eventType === 'layerload') {
        this._loaded = true;
    }
    if (this.map) {
        if (!param) {
            param = {};
        }
        param['type'] = eventType;
        param['target'] = this;
        this.map._onLayerEvent(param);
    }
    return fire.apply(this, arguments);
};

var DefaultSpatialRef = {
    'EPSG:3857': {
        'resolutions': function () {
            var resolutions = [];
            var d = 2 * 6378137 * Math.PI;
            for (var i = 0; i < 20; i++) {
                resolutions[i] = d / (256 * Math.pow(2, i));
            }
            return resolutions;
        }(),
        'fullExtent': {
            'top': 6378137 * Math.PI,
            'left': -6378137 * Math.PI,
            'bottom': -6378137 * Math.PI,
            'right': 6378137 * Math.PI
        }
    },
    'EPSG:4326': {
        'fullExtent': {
            'top': 90,
            'left': -180,
            'bottom': -90,
            'right': 180
        },
        'resolutions': function () {
            var resolutions = [];
            for (var i = 0; i < 20; i++) {
                resolutions[i] = 180 / (Math.pow(2, i) * 128);
            }
            return resolutions;
        }()
    },
    'BAIDU': {
        'resolutions': function () {
            var res = Math.pow(2, 18);
            var resolutions = [];
            for (var i = 0; i < 20; i++) {
                resolutions[i] = res;
                res *= 0.5;
            }
            resolutions[0] = null;
            resolutions[1] = null;
            resolutions[2] = null;
            return resolutions;
        }(),
        'fullExtent': {
            'top': 33554432,
            'left': -33554432,
            'bottom': -33554432,
            'right': 33554432
        }
    }
};

DefaultSpatialRef['EPSG:4490'] = DefaultSpatialRef['EPSG:4326'];

var SpatialReference = function () {
    function SpatialReference() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, SpatialReference);

        this.options = options;
        this._initSpatialRef();
    }

    SpatialReference.getProjectionInstance = function getProjectionInstance(prjName) {
        if (!prjName) {
            return null;
        }
        prjName = prjName.toLowerCase();
        for (var p in projections) {
            if (hasOwn(projections, p)) {
                var code = projections[p]['code'];
                if (code && code.toLowerCase() === prjName) {
                    return projections[p];
                }
            }
        }
        return null;
    };

    SpatialReference.prototype._initSpatialRef = function _initSpatialRef() {
        var projection = this.options['projection'];
        if (projection) {
            if (isString(projection)) {
                projection = SpatialReference.getProjectionInstance(projection);
            }
        } else {
            projection = DEFAULT;
        }
        if (!projection || isString(projection)) {
            throw new Error('must provide a valid projection in map\'s spatial reference.');
        }
        projection = extend({}, Common, projection);
        if (!projection.measureLength) {
            extend(projection, Measurer.DEFAULT);
        }
        this._projection = projection;
        var defaultSpatialRef = void 0,
            resolutions = this.options['resolutions'];
        if (!resolutions) {
            if (projection['code']) {
                defaultSpatialRef = DefaultSpatialRef[projection['code']];
                if (defaultSpatialRef) {
                    resolutions = defaultSpatialRef['resolutions'];
                }
            }
            if (!resolutions) {
                throw new Error('must provide valid resolutions in map\'s spatial reference.');
            }
        }
        this._resolutions = resolutions;
        var fullExtent = this.options['fullExtent'];
        if (!fullExtent) {
            if (projection['code']) {
                defaultSpatialRef = DefaultSpatialRef[projection['code']];
                if (defaultSpatialRef) {
                    fullExtent = defaultSpatialRef['fullExtent'];
                }
            }
            if (!fullExtent) {
                throw new Error('must provide a valid fullExtent in map\'s spatial reference.');
            }
        }
        if (!isNil(fullExtent['left'])) {
            this._fullExtent = new Extent(new Coordinate(fullExtent['left'], fullExtent['top']), new Coordinate(fullExtent['right'], fullExtent['bottom']));
        } else {
            this._fullExtent = new Extent(fullExtent);
            fullExtent['left'] = fullExtent['xmin'];
            fullExtent['right'] = fullExtent['xmax'];
            fullExtent['top'] = fullExtent['ymax'];
            fullExtent['bottom'] = fullExtent['ymin'];
        }

        if (isNil(fullExtent['top']) || isNil(fullExtent['bottom']) || isNil(fullExtent['left']) || isNil(fullExtent['right'])) {
            throw new Error('must provide valid top/bottom/left/right in fullExtent.');
        }

        extend(this._fullExtent, fullExtent);

        this._projection.fullExtent = fullExtent;

        var a = fullExtent['right'] >= fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] >= fullExtent['bottom'] ? -1 : 1;
        this._transformation = new Transformation([a, b, 0, 0]);
    };

    SpatialReference.prototype.getResolutions = function getResolutions() {
        return this._resolutions || [];
    };

    SpatialReference.prototype.getResolution = function getResolution(zoom) {
        var z = zoom | 0;
        if (z < 0) {
            z = 0;
        } else if (z > this._resolutions.length - 1) {
            z = this._resolutions.length - 1;
        }
        var res = this._resolutions[z];
        if (!isInteger(zoom) && z !== this._resolutions.length - 1) {
            var next = this._resolutions[z + 1];
            return res + (next - res) * (zoom - z);
        }
        return res;
    };

    SpatialReference.prototype.getProjection = function getProjection() {
        return this._projection;
    };

    SpatialReference.prototype.getFullExtent = function getFullExtent() {
        return this._fullExtent;
    };

    SpatialReference.prototype.getTransformation = function getTransformation() {
        return this._transformation;
    };

    SpatialReference.prototype.getMinZoom = function getMinZoom() {
        for (var i = 0; i < this._resolutions.length; i++) {
            if (!isNil(this._resolutions[i])) {
                return i;
            }
        }
        return 0;
    };

    SpatialReference.prototype.getMaxZoom = function getMaxZoom() {
        for (var i = this._resolutions.length - 1; i >= 0; i--) {
            if (!isNil(this._resolutions[i])) {
                return i;
            }
        }
        return this._resolutions.length - 1;
    };

    return SpatialReference;
}();

var options = {
    'maxVisualPitch': 60,
    'maxPitch': 80,

    'centerCross': false,

    'zoomInCenter': false,
    'zoomAnimation': function () {
        return !IS_NODE;
    }(),
    'zoomAnimationDuration': 330,

    'zoomBackground': false,

    'panAnimation': function () {
        return !IS_NODE;
    }(),

    'panAnimationDuration': 600,

    'zoomable': true,
    'enableInfoWindow': true,

    'hitDetect': function () {
        return !Browser$1.mobile;
    }(),

    'hitDetectLimit': 5,

    'fpsOnInteracting': 25,

    'layerCanvasLimitOnInteracting': -1,

    'maxZoom': null,
    'minZoom': null,
    'maxExtent': null,

    'checkSize': true,

    'renderer': 'canvas'
};

var Map = function (_Handlerable) {
    inherits(Map, _Handlerable);

    function Map(container, options) {
        classCallCheck(this, Map);

        if (!options) {
            throw new Error('Invalid options when creating map.');
        }
        if (!options['center']) {
            throw new Error('Invalid center when creating map.');
        }

        var opts = extend({}, options);
        var zoom = opts['zoom'];
        delete opts['zoom'];
        var center = new Coordinate(opts['center']);
        delete opts['center'];

        var baseLayer = opts['baseLayer'];
        delete opts['baseLayer'];
        var layers = opts['layers'];
        delete opts['layers'];

        var _this = possibleConstructorReturn(this, _Handlerable.call(this, opts));

        _this._loaded = false;
        _this._initContainer(container);

        _this._panels = {};

        _this._baseLayer = null;
        _this._layers = [];

        _this._zoomLevel = zoom;
        _this._center = center;

        _this.setSpatialReference(opts['spatialReference'] || opts['view']);

        _this._mapViewPoint = new Point(0, 0);

        _this._initRenderer();
        _this._updateMapSize(_this._getContainerDomSize());

        if (baseLayer) {
            _this.setBaseLayer(baseLayer);
        }
        if (layers) {
            _this.addLayer(layers);
        }

        _this._Load();
        return _this;
    }

    Map.addOnLoadHook = function addOnLoadHook(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        var onload = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };
        this.prototype._onLoadHooks = this.prototype._onLoadHooks || [];
        this.prototype._onLoadHooks.push(onload);
        return this;
    };

    Map.prototype.isLoaded = function isLoaded() {
        return !!this._loaded;
    };

    Map.prototype.getContainer = function getContainer() {
        return this._containerDOM;
    };

    Map.prototype.getSpatialReference = function getSpatialReference() {
        return this._spatialReference;
    };

    Map.prototype.setSpatialReference = function setSpatialReference(ref) {
        var oldRef = this.options['spatialReference'];
        if (oldRef && !ref) {
            return this;
        }
        ref = extend({}, ref);
        this._center = this.getCenter();
        this.options['spatialReference'] = ref;
        this._spatialReference = new SpatialReference(ref);
        if (this.options['spatialReference'] && isFunction(this.options['spatialReference']['projection'])) {
            var projection = this._spatialReference.getProjection();

            this.options['spatialReference']['projection'] = projection['code'];
        }
        this._resetMapStatus();

        this._fireEvent('spatialreferencechange', {
            'old': oldRef,
            'new': extend({}, this.options['spatialReference'])
        });
        return this;
    };

    Map.prototype.onConfig = function onConfig(conf) {
        var ref = conf['spatialReference'] || conf['view'];
        if (!isNil(ref)) {
            this.setSpatialReference(ref);
        }
        return this;
    };

    Map.prototype.getProjection = function getProjection() {
        if (!this._spatialReference) {
            return null;
        }
        return this._spatialReference.getProjection();
    };

    Map.prototype.getFullExtent = function getFullExtent() {
        if (!this._spatialReference) {
            return null;
        }
        return this._spatialReference.getFullExtent();
    };

    Map.prototype.setCursor = function setCursor(cursor) {
        delete this._cursor;
        this._trySetCursor(cursor);
        this._cursor = cursor;
        return this;
    };

    Map.prototype.resetCursor = function resetCursor() {
        return this.setCursor(null);
    };

    Map.prototype.getCenter = function getCenter() {
        if (!this._loaded || !this._prjCenter) {
            return this._center;
        }
        var projection = this.getProjection();
        return projection.unproject(this._prjCenter);
    };

    Map.prototype.setCenter = function setCenter(center) {
        if (!center) {
            return this;
        }
        center = new Coordinate(center);
        if (!this._verifyExtent(center)) {
            return this;
        }
        if (!this._loaded) {
            this._center = center;
            return this;
        }
        this.onMoveStart();
        var projection = this.getProjection();
        var _pcenter = projection.project(center);
        this._setPrjCenter(_pcenter);
        this.onMoveEnd(this._parseEventFromCoord(this.getCenter()));
        return this;
    };

    Map.prototype.getSize = function getSize() {
        if (isNil(this.width) || isNil(this.height)) {
            return this._getContainerDomSize();
        }
        return new Size(this.width, this.height);
    };

    Map.prototype.getContainerExtent = function getContainerExtent() {
        var visualHeight = this.height;
        var pitch = this.getPitch(),
            maxVisualPitch = this.options['maxVisualPitch'];
        if (maxVisualPitch && pitch > maxVisualPitch) {
            var visualDistance = this.height / 2 * Math.tan(maxVisualPitch * Math.PI / 180);
            visualHeight = this.height / 2 + visualDistance * Math.tan((90 - pitch) * Math.PI / 180);
        }
        return new PointExtent(0, this.height - visualHeight, this.width, this.height);
    };

    Map.prototype.getExtent = function getExtent() {
        return this._pointToExtent(this._get2DExtent());
    };

    Map.prototype.getProjExtent = function getProjExtent() {
        var extent2D = this._get2DExtent();
        return new Extent(this._pointToPrj(extent2D.getMin()), this._pointToPrj(extent2D.getMax()));
    };

    Map.prototype.getMaxExtent = function getMaxExtent() {
        if (!this.options['maxExtent']) {
            return null;
        }
        return new Extent(this.options['maxExtent'], this.getProjection());
    };

    Map.prototype.setMaxExtent = function setMaxExtent(extent) {
        if (extent) {
            var maxExt = new Extent(extent, this.getProjection());
            this.options['maxExtent'] = maxExt;
            var center = this.getCenter();
            if (!this._verifyExtent(center)) {
                this.panTo(maxExt.getCenter());
            }
        } else {
            delete this.options['maxExtent'];
        }
        return this;
    };

    Map.prototype.getZoom = function getZoom() {
        return this._zoomLevel;
    };

    Map.prototype.getZoomForScale = function getZoomForScale(scale, fromZoom, isFraction) {
        var zoom = this.getZoom();
        if (isNil(fromZoom)) {
            fromZoom = zoom;
        }
        if (scale === 1 && fromZoom === zoom) {
            return zoom;
        }
        var res = this._getResolution(fromZoom),
            targetRes = res / scale;
        var scaleZoom = this.getZoomFromRes(targetRes);
        if (isFraction) {
            return scaleZoom;
        } else {
            var resolutions = this._getResolutions();
            return resolutions[0] < resolutions[resolutions.length - 1] ? Math.ceil(scaleZoom) : Math.floor(scaleZoom);
        }
    };

    Map.prototype.getZoomFromRes = function getZoomFromRes(res) {
        var resolutions = this._getResolutions(),
            minRes = this._getResolution(this.getMinZoom()),
            maxRes = this._getResolution(this.getMaxZoom());
        if (minRes <= maxRes) {
            if (res <= minRes) {
                return this.getMinZoom();
            } else if (res >= maxRes) {
                return this.getMaxZoom();
            }
        } else if (res >= minRes) {
            return this.getMinZoom();
        } else if (res <= maxRes) {
            return this.getMaxZoom();
        }

        var l = resolutions.length;
        for (var i = 0; i < l - 1; i++) {
            if (!resolutions[i]) {
                continue;
            }
            var gap = resolutions[i + 1] - resolutions[i];
            var test = res - resolutions[i];
            if (sign(gap) === sign(test) && Math.abs(gap) >= Math.abs(test)) {
                return i + test / gap;
            }
        }
        return l - 1;
    };

    Map.prototype.setZoom = function setZoom(zoom) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { 'animation': true };

        if (isNaN(zoom) || isNil(zoom)) {
            return this;
        }
        if (this._loaded && this.options['zoomAnimation'] && options['animation']) {
            this._zoomAnimation(zoom);
        } else {
            this._zoom(zoom);
        }
        return this;
    };

    Map.prototype.getMaxZoom = function getMaxZoom() {
        if (!isNil(this.options['maxZoom'])) {
            return this.options['maxZoom'];
        }
        return this.getMaxNativeZoom();
    };

    Map.prototype.setMaxZoom = function setMaxZoom(maxZoom) {
        var viewMaxZoom = this._spatialReference.getMaxZoom();
        if (maxZoom > viewMaxZoom) {
            maxZoom = viewMaxZoom;
        }
        if (maxZoom < this._zoomLevel) {
            this.setZoom(maxZoom);
        }
        this.options['maxZoom'] = maxZoom;
        return this;
    };

    Map.prototype.getMinZoom = function getMinZoom() {
        if (!isNil(this.options['minZoom'])) {
            return this.options['minZoom'];
        }
        return 0;
    };

    Map.prototype.setMinZoom = function setMinZoom(minZoom) {
        var viewMinZoom = this._spatialReference.getMinZoom();
        if (minZoom < viewMinZoom) {
            minZoom = viewMinZoom;
        }
        this.options['minZoom'] = minZoom;
        return this;
    };

    Map.prototype.getMaxNativeZoom = function getMaxNativeZoom() {
        var ref = this.getSpatialReference();
        if (!ref) {
            return null;
        }
        return ref.getResolutions().length - 1;
    };

    Map.prototype.getGLZoom = function getGLZoom() {
        return this.getMaxNativeZoom() / 2;
    };

    Map.prototype.getGLScale = function getGLScale(zoom) {
        if (isNil(zoom)) {
            zoom = this.getZoom();
        }
        return this.getScale(zoom) / this.getScale(this.getGLZoom());
    };

    Map.prototype.zoomIn = function zoomIn() {
        return this.setZoom(this.getZoom() + 1);
    };

    Map.prototype.zoomOut = function zoomOut() {
        return this.setZoom(this.getZoom() - 1);
    };

    Map.prototype.isZooming = function isZooming() {
        return !!this._zooming;
    };

    Map.prototype.isInteracting = function isInteracting() {
        return this.isZooming() || this.isMoving() || this.isRotating();
    };

    Map.prototype.setCenterAndZoom = function setCenterAndZoom(center, zoom) {
        if (!isNil(zoom) && this._zoomLevel !== zoom) {
            this.setCenter(center);
            this.setZoom(zoom, { animation: false });
        } else {
            this.setCenter(center);
        }
        return this;
    };

    Map.prototype.getFitZoom = function getFitZoom(extent) {
        var _this2 = this;

        if (!extent || !(extent instanceof Extent)) {
            return this._zoomLevel;
        }

        if (extent['xmin'] === extent['xmax'] && extent['ymin'] === extent['ymax']) {
            return this.getMaxZoom();
        }
        var size = this.getSize();
        var containerExtent = extent.convertTo(function (p) {
            return _this2.coordToContainerPoint(p);
        });
        var w = containerExtent.getWidth(),
            h = containerExtent.getHeight();
        var scaleX = size['width'] / w,
            scaleY = size['height'] / h;
        var resolutions = this._getResolutions();
        var scale = resolutions[0] < resolutions[resolutions.length - 1] ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
        var zoom = this.getZoomForScale(scale);
        return zoom;
    };

    Map.prototype.getView = function getView() {
        return {
            'center': this.getCenter().toArray(),
            'zoom': this.getZoom(),
            'pitch': this.getPitch(),
            'bearing': this.getBearing()
        };
    };

    Map.prototype.setView = function setView(view) {
        if (!view) {
            return this;
        }
        if (view['center']) {
            this.setCenter(view['center']);
        }
        if (view['zoom']) {
            this.setZoom(view['zoom'], { 'animation': false });
        }
        if (view['pitch']) {
            this.setPitch(view['pitch']);
        }
        if (view['bearing']) {
            this.setBearing(view['bearing']);
        }
        return this;
    };

    Map.prototype.getResolution = function getResolution(zoom) {
        return this._getResolution(zoom);
    };

    Map.prototype.getScale = function getScale(zoom) {
        var z = isNil(zoom) ? this.getZoom() : zoom;
        var max = this._getResolution(this.getMaxNativeZoom()),
            res = this._getResolution(z);
        return res / max;
    };

    Map.prototype.fitExtent = function fitExtent(extent, zoomOffset) {
        if (!extent) {
            return this;
        }
        extent = new Extent(extent, this.getProjection());
        var zoom = this.getFitZoom(extent) + (zoomOffset || 0);
        var center = extent.getCenter();
        return this.setCenterAndZoom(center, zoom);
    };

    Map.prototype.getBaseLayer = function getBaseLayer() {
        return this._baseLayer;
    };

    Map.prototype.setBaseLayer = function setBaseLayer(baseLayer) {
        var isChange = false;
        if (this._baseLayer) {
            isChange = true;

            this._fireEvent('baselayerchangestart');
            this._baseLayer.remove();
        }
        if (!baseLayer) {
            delete this._baseLayer;

            this._fireEvent('baselayerchangeend');

            this._fireEvent('setbaselayer');
            return this;
        }

        this._baseLayer = baseLayer;
        baseLayer._bindMap(this, -1);

        function onbaseLayerload() {
            this._fireEvent('baselayerload');
            if (isChange) {
                isChange = false;
                this._fireEvent('baselayerchangeend');
            }
        }
        this._baseLayer.on('layerload', onbaseLayerload, this);
        if (this._loaded) {
            this._baseLayer.load();
        }
        this._fireEvent('setbaselayer');
        return this;
    };

    Map.prototype.removeBaseLayer = function removeBaseLayer() {
        if (this._baseLayer) {
            this._baseLayer.remove();
            delete this._baseLayer;

            this._fireEvent('baselayerremove');
        }
        return this;
    };

    Map.prototype.getLayers = function getLayers(filter) {
        return this._getLayers(function (layer) {
            if (layer === this._baseLayer || layer.getId().indexOf(INTERNAL_LAYER_PREFIX) >= 0) {
                return false;
            }
            if (filter) {
                return filter(layer);
            }
            return true;
        });
    };

    Map.prototype.getLayer = function getLayer(id) {
        if (!id) {
            return null;
        }
        var layer = this._layerCache ? this._layerCache[id] : null;
        if (layer) {
            return layer;
        }
        var baseLayer = this.getBaseLayer();
        if (baseLayer && baseLayer.getId() === id) {
            return baseLayer;
        }
        return null;
    };

    Map.prototype.addLayer = function addLayer(layers) {
        if (!layers) {
            return this;
        }
        if (!Array.isArray(layers)) {
            layers = Array.prototype.slice.call(arguments, 0);
            return this.addLayer(layers);
        }
        if (!this._layerCache) {
            this._layerCache = {};
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            var id = layer.getId();
            if (isNil(id)) {
                throw new Error('Invalid id for the layer: ' + id);
            }
            if (layer.getMap() === this) {
                continue;
            }
            if (this._layerCache[id]) {
                throw new Error('Duplicate layer id in the map: ' + id);
            }
            this._layerCache[id] = layer;
            layer._bindMap(this, this._layers.length);
            this._layers.push(layer);
            if (this._loaded) {
                layer.load();
            }
        }

        this._fireEvent('addlayer', {
            'layers': layers
        });
        return this;
    };

    Map.prototype.removeLayer = function removeLayer(layers) {
        if (!layers) {
            return this;
        }
        if (!Array.isArray(layers)) {
            return this.removeLayer([layers]);
        }
        var removed = [];
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            if (!(layer instanceof Layer)) {
                layer = this.getLayer(layer);
            }
            if (!layer) {
                continue;
            }
            var map = layer.getMap();
            if (!map || map !== this) {
                continue;
            }
            removed.push(layer);
            this._removeLayer(layer, this._layers);
            if (this._loaded) {
                layer._doRemove();
            }
            var id = layer.getId();
            if (this._layerCache) {
                delete this._layerCache[id];
            }
        }
        if (removed.length > 0) {
            this.once('frameend', function () {
                removed.forEach(function (layer) {
                    layer.fire('remove');
                });
            });
        }

        this._fireEvent('removelayer', {
            'layers': layers
        });
        return this;
    };

    Map.prototype.sortLayers = function sortLayers(layers) {
        if (!layers || !Array.isArray(layers)) {
            return this;
        }
        var layersToOrder = [];
        var minZ = Number.MAX_VALUE;
        for (var i = 0, l = layers.length; i < l; i++) {
            var layer = layers[i];
            if (isString(layers[i])) {
                layer = this.getLayer(layer);
            }
            if (!(layer instanceof Layer) || !layer.getMap() || layer.getMap() !== this) {
                throw new Error('It must be a layer added to this map to order.');
            }
            if (layer.getZIndex() < minZ) {
                minZ = layer.getZIndex();
            }
            layersToOrder.push(layer);
        }
        for (var _i = 0, _l = layersToOrder.length; _i < _l; _i++) {
            layersToOrder[_i].setZIndex(minZ + _i);
        }

        return this;
    };

    Map.prototype.toDataURL = function toDataURL(options) {
        if (!options) {
            options = {};
        }
        var mimeType = options['mimeType'];
        if (!mimeType) {
            mimeType = 'image/png';
        }
        var save = options['save'];
        var renderer = this._getRenderer();
        if (renderer && renderer.toDataURL) {
            var file = options['fileName'];
            if (!file) {
                file = 'export';
            }
            var dataURL = renderer.toDataURL(mimeType);
            if (save && dataURL) {
                var imgURL = dataURL;

                var dlLink = document.createElement('a');
                dlLink.download = file;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [mimeType, dlLink.download, dlLink.href].join(':');

                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }
            return dataURL;
        }
        return null;
    };

    Map.prototype.coordinateToPoint = function coordinateToPoint(coordinate, zoom) {
        var prjCoord = this.getProjection().project(coordinate);
        return this._prjToPoint(prjCoord, zoom);
    };

    Map.prototype.coordToPoint = function coordToPoint(coordinate, zoom) {
        return this.coordinateToPoint(coordinate, zoom);
    };

    Map.prototype.pointToCoordinate = function pointToCoordinate(point, zoom) {
        var prjCoord = this._pointToPrj(point, zoom);
        return this.getProjection().unproject(prjCoord);
    };

    Map.prototype.pointToCoord = function pointToCoord(point, zoom) {
        return this.pointToCoordinate(point, zoom);
    };

    Map.prototype.coordinateToViewPoint = function coordinateToViewPoint(coordinate) {
        return this._prjToViewPoint(this.getProjection().project(coordinate));
    };

    Map.prototype.coordToViewPoint = function coordToViewPoint(coordinate) {
        return this.coordinateToViewPoint(coordinate);
    };

    Map.prototype.viewPointToCoordinate = function viewPointToCoordinate(viewPoint) {
        return this.getProjection().unproject(this._viewPointToPrj(viewPoint));
    };

    Map.prototype.viewPointToCoord = function viewPointToCoord(viewPoint) {
        return this.viewPointToCoordinate(viewPoint);
    };

    Map.prototype.coordinateToContainerPoint = function coordinateToContainerPoint(coordinate, zoom) {
        var pCoordinate = this.getProjection().project(coordinate);
        return this._prjToContainerPoint(pCoordinate, zoom);
    };

    Map.prototype.coordToContainerPoint = function coordToContainerPoint(coordinate, zoom) {
        return this.coordinateToContainerPoint(coordinate, zoom);
    };

    Map.prototype.containerPointToCoordinate = function containerPointToCoordinate(containerPoint) {
        var pCoordinate = this._containerPointToPrj(containerPoint);
        return this.getProjection().unproject(pCoordinate);
    };

    Map.prototype.containerPointToCoord = function containerPointToCoord(containerPoint) {
        return this.containerPointToCoordinate(containerPoint);
    };

    Map.prototype.containerPointToViewPoint = function containerPointToViewPoint(containerPoint) {
        return containerPoint.sub(this.getViewPoint());
    };

    Map.prototype.viewPointToContainerPoint = function viewPointToContainerPoint(viewPoint) {
        return viewPoint.add(this.getViewPoint());
    };

    Map.prototype.containerToExtent = function containerToExtent(containerExtent) {
        var extent2D = new PointExtent(this._containerPointToPoint(containerExtent.getMin()), this._containerPointToPoint(containerExtent.getMax()));
        return this._pointToExtent(extent2D);
    };

    Map.prototype.checkSize = function checkSize() {
        var justStart = now() - this._initTime < 1500 && this.width === 0 || this.height === 0;

        var watched = this._getContainerDomSize(),
            oldHeight = this.height,
            oldWidth = this.width;
        if (watched['width'] === oldWidth && watched['height'] === oldHeight) {
            return this;
        }
        var center = this.getCenter();
        this._updateMapSize(watched);
        var resizeOffset = new Point((oldWidth - watched.width) / 2, (oldHeight - watched.height) / 2);
        this._offsetCenterByPixel(resizeOffset);

        this._mapViewCoord = this._getPrjCenter();
        var hided = watched['width'] === 0 || watched['height'] === 0 || oldWidth === 0 || oldHeight === 0;

        if (justStart || hided) {
            this._noEvent = true;
            this.setCenter(center);
            delete this._noEvent;
        }

        this._fireEvent('resize');

        return this;
    };

    Map.prototype.distanceToPixel = function distanceToPixel(xDist, yDist, zoom) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        var scale = this.getScale() / this.getScale(zoom);
        var center = this.getCenter(),
            target = projection.locate(center, xDist, yDist);
        var p0 = this.coordToContainerPoint(center),
            p1 = this.coordToContainerPoint(target);
        p1._sub(p0)._multi(scale)._abs();
        return new Size(p1.x, p1.y);
    };

    Map.prototype.pixelToDistance = function pixelToDistance(width, height) {
        var projection = this.getProjection();
        if (!projection) {
            return null;
        }
        var fullExt = this.getFullExtent();
        var d = fullExt['top'] > fullExt['bottom'] ? -1 : 1;
        var target = new Point(this.width / 2 + width, this.height / 2 + d * height);
        var coord = this.containerPointToCoord(target);
        return projection.measureLength(this.getCenter(), coord);
    };

    Map.prototype.locate = function locate(coordinate, dx, dy) {
        return this.getProjection().locate(new Coordinate(coordinate), dx, dy);
    };

    Map.prototype.locateByPoint = function locateByPoint(coordinate, px, py) {
        var point = this.coordToContainerPoint(coordinate);
        return this.containerPointToCoord(point._add(px, py));
    };

    Map.prototype.getMainPanel = function getMainPanel() {
        return this._getRenderer().getMainPanel();
    };

    Map.prototype.getPanels = function getPanels() {
        return this._panels;
    };

    Map.prototype.remove = function remove() {
        if (this.isRemoved()) {
            return this;
        }
        this._removeDomEvents();
        this._clearHandlers();
        this.removeBaseLayer();
        var layers = this.getLayers();
        for (var i = 0; i < layers.length; i++) {
            layers[i].remove();
        }
        if (this._getRenderer()) {
            this._getRenderer().remove();
        }
        this._clearAllListeners();
        if (this._containerDOM.innerHTML) {
            this._containerDOM.innerHTML = '';
        }
        delete this._panels;
        delete this._containerDOM;
        delete this.renderer;
        return this;
    };

    Map.prototype.isRemoved = function isRemoved() {
        return !this._containerDOM;
    };

    Map.prototype.isMoving = function isMoving() {
        return !!this._moving;
    };

    Map.prototype.onMoveStart = function onMoveStart(param) {
        this._originCenter = this.getCenter();
        this._moving = true;
        this._trySetCursor('move');

        this._fireEvent('movestart', this._parseEvent(param ? param['domEvent'] : null, 'movestart'));
    };

    Map.prototype.onMoving = function onMoving(param) {
        this._fireEvent('moving', this._parseEvent(param ? param['domEvent'] : null, 'moving'));
    };

    Map.prototype.onMoveEnd = function onMoveEnd(param) {
        this._moving = false;
        this._trySetCursor('default');

        this._fireEvent('moveend', param && param['domEvent'] ? this._parseEvent(param['domEvent'], 'moveend') : param);
        if (!this._verifyExtent(this.getCenter())) {
            var moveTo = this._originCenter;
            if (!this._verifyExtent(moveTo)) {
                moveTo = this.getMaxExtent().getCenter();
            }
            this.panTo(moveTo);
        }
    };

    Map.prototype.onDragRotateStart = function onDragRotateStart(param) {
        this._dragRotating = true;

        this._fireEvent('dragrotatestart', this._parseEvent(param ? param['domEvent'] : null, 'dragrotatestart'));
    };

    Map.prototype.onDragRotating = function onDragRotating(param) {
        this._fireEvent('dragrotating', this._parseEvent(param ? param['domEvent'] : null, 'dragrotating'));
    };

    Map.prototype.onDragRotateEnd = function onDragRotateEnd(param) {
        this._dragRotating = false;

        this._fireEvent('dragrotateend', this._parseEvent(param ? param['domEvent'] : null, 'dragrotateend'));
    };

    Map.prototype.isDragRotating = function isDragRotating() {
        return !!this._dragRotating;
    };

    Map.prototype.getRenderer = function getRenderer() {
        return this._getRenderer();
    };

    Map.prototype._initContainer = function _initContainer(container) {
        if (isString(container)) {
            this._containerDOM = document.getElementById(container);
            if (!this._containerDOM) {
                throw new Error('Invalid container when creating map: \'' + container + '\'');
            }
        } else {
            this._containerDOM = container;
            if (IS_NODE) {
                this.CanvasClass = this._containerDOM.constructor;
            }
        }

        if (this._containerDOM.childNodes && this._containerDOM.childNodes.length > 0) {
            if (this._containerDOM.childNodes[0].className === 'maptalks-wrapper') {
                throw new Error('Container is already loaded with another map instance, use map.remove() to clear it.');
            }
        }
    };

    Map.prototype._trySetCursor = function _trySetCursor(cursor) {
        if (!this._cursor && !this._priorityCursor) {
            if (!cursor) {
                cursor = 'default';
            }
            this._setCursorToPanel(cursor);
        }
        return this;
    };

    Map.prototype._setPriorityCursor = function _setPriorityCursor(cursor) {
        if (!cursor) {
            var hasCursor = false;
            if (this._priorityCursor) {
                hasCursor = true;
            }
            delete this._priorityCursor;
            if (hasCursor) {
                this.setCursor(this._cursor);
            }
        } else {
            this._priorityCursor = cursor;
            this._setCursorToPanel(cursor);
        }
        return this;
    };

    Map.prototype._setCursorToPanel = function _setCursorToPanel(cursor) {
        var panel = this.getMainPanel();
        if (panel && panel.style && panel.style.cursor !== cursor) {
            panel.style.cursor = cursor;
        }
    };

    Map.prototype._get2DExtent = function _get2DExtent(zoom) {
        var cExtent = this.getContainerExtent();
        var c1 = this._containerPointToPoint(new Point(cExtent.xmin, cExtent.ymin), zoom),
            c2 = this._containerPointToPoint(new Point(cExtent.xmax, cExtent.ymin), zoom),
            c3 = this._containerPointToPoint(new Point(this.width, this.height), zoom),
            c4 = this._containerPointToPoint(new Point(0, this.height), zoom);
        var xmin = Math.min(c1.x, c2.x, c3.x, c4.x),
            xmax = Math.max(c1.x, c2.x, c3.x, c4.x),
            ymin = Math.min(c1.y, c2.y, c3.y, c4.y),
            ymax = Math.max(c1.y, c2.y, c3.y, c4.y);
        return new PointExtent(xmin, ymin, xmax, ymax);
    };

    Map.prototype._pointToExtent = function _pointToExtent(extent2D) {
        var min2d = extent2D.getMin(),
            max2d = extent2D.getMax();
        var fullExtent = this.getFullExtent();

        var _ref = !fullExtent || fullExtent.left <= fullExtent.right ? [min2d.x, max2d.x] : [max2d.x, min2d.x],
            minx = _ref[0],
            maxx = _ref[1];

        var _ref2 = !fullExtent || fullExtent.top > fullExtent.bottom ? [max2d.y, min2d.y] : [min2d.y, max2d.y],
            miny = _ref2[0],
            maxy = _ref2[1];

        var min = new Coordinate(minx, miny),
            max = new Coordinate(maxx, maxy);
        return new Extent(this.pointToCoord(min), this.pointToCoord(max), this.getProjection());
    };

    Map.prototype._removeLayer = function _removeLayer(layer, layerList) {
        if (!layer || !layerList) {
            return;
        }
        var index = layerList.indexOf(layer);
        if (index > -1) {
            layerList.splice(index, 1);
            for (var j = 0, jlen = layerList.length; j < jlen; j++) {
                if (layerList[j].setZIndex) {
                    layerList[j].setZIndex(j);
                }
            }
        }
    };

    Map.prototype._sortLayersByZIndex = function _sortLayersByZIndex() {
        if (!this._layers) {
            return;
        }
        this._layers.sort(function (a, b) {
            return a.getZIndex() - b.getZIndex();
        });
    };

    Map.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (this._noEvent) {
            return;
        }

        this.fire('_' + eventName, param);
        this.fire(eventName, param);
    };

    Map.prototype._Load = function _Load() {
        this._resetMapStatus();
        if (this.options['pitch']) {
            this.setPitch(this.options['pitch']);
            delete this.options['pitch'];
        }
        if (this.options['bearing']) {
            this.setBearing(this.options['bearing']);
            delete this.options['bearing'];
        }
        this._loadAllLayers();
        this._getRenderer().onLoad();
        this._loaded = true;
        this._callOnLoadHooks();
        this._initTime = now();
    };

    Map.prototype._initRenderer = function _initRenderer() {
        var renderer = this.options['renderer'];
        var clazz = Map.getRendererClass(renderer);
        this._renderer = new clazz(this);
        this._renderer.load();
    };

    Map.prototype._getRenderer = function _getRenderer() {
        return this._renderer;
    };

    Map.prototype._loadAllLayers = function _loadAllLayers() {
        function loadLayer(layer) {
            if (layer) {
                layer.load();
            }
        }
        if (this._baseLayer) {
            this._baseLayer.load();
        }
        this._eachLayer(loadLayer, this.getLayers());
    };

    Map.prototype._getLayers = function _getLayers(filter) {
        var layers = this._baseLayer ? [this._baseLayer].concat(this._layers) : this._layers;
        var result = [];
        for (var i = 0; i < layers.length; i++) {
            if (!filter || filter.call(this, layers[i])) {
                result.push(layers[i]);
            }
        }
        return result;
    };

    Map.prototype._eachLayer = function _eachLayer(fn) {
        if (arguments.length < 2) {
            return;
        }
        var layerLists = Array.prototype.slice.call(arguments, 1);
        if (layerLists && !Array.isArray(layerLists)) {
            layerLists = [layerLists];
        }
        var layers = [];
        for (var i = 0, len = layerLists.length; i < len; i++) {
            layers = layers.concat(layerLists[i]);
        }
        for (var j = 0, jlen = layers.length; j < jlen; j++) {
            fn.call(fn, layers[j]);
        }
    };

    Map.prototype._onLayerEvent = function _onLayerEvent(param) {
        if (!param) {
            return;
        }
        if (param['type'] === 'idchange') {
            delete this._layerCache[param['old']];
            this._layerCache[param['new']] = param['target'];
        }
    };

    Map.prototype._resetMapStatus = function _resetMapStatus() {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        var viewMaxZoom = this._spatialReference.getMaxZoom(),
            viewMinZoom = this._spatialReference.getMinZoom();
        if (isNil(maxZoom) || maxZoom === -1 || maxZoom > viewMaxZoom) {
            this.setMaxZoom(viewMaxZoom);
        }
        if (isNil(minZoom) || minZoom === -1 || minZoom < viewMinZoom) {
            this.setMinZoom(viewMinZoom);
        }
        maxZoom = this.getMaxZoom();
        minZoom = this.getMinZoom();
        if (maxZoom < minZoom) {
            this.setMaxZoom(minZoom);
        }
        if (isNil(this._zoomLevel) || this._zoomLevel > maxZoom) {
            this._zoomLevel = maxZoom;
        }
        if (this._zoomLevel < minZoom) {
            this._zoomLevel = minZoom;
        }
        delete this._prjCenter;
        var projection = this.getProjection();
        this._prjCenter = projection.project(this._center);
        var renderer = this._getRenderer();
        if (renderer) {
            renderer.resetContainer();
        }
    };

    Map.prototype._getContainerDomSize = function _getContainerDomSize() {
        if (!this._containerDOM) {
            return null;
        }
        var containerDOM = this._containerDOM;
        var width = void 0,
            height = void 0;
        if (!isNil(containerDOM.width) && !isNil(containerDOM.height)) {
            width = containerDOM.width;
            height = containerDOM.height;
            if (Browser$1.retina && containerDOM['layer']) {
                width /= 2;
                height /= 2;
            }
        } else if (!isNil(containerDOM.clientWidth) && !isNil(containerDOM.clientHeight)) {
            width = parseInt(containerDOM.clientWidth, 0);
            height = parseInt(containerDOM.clientHeight, 0);
        } else {
            throw new Error('can not get size of container');
        }
        return new Size(width, height);
    };

    Map.prototype._updateMapSize = function _updateMapSize(mSize) {
        this.width = mSize['width'];
        this.height = mSize['height'];
        this._getRenderer().updateMapSize(mSize);
        this._calcMatrices();
        return this;
    };

    Map.prototype._getPrjCenter = function _getPrjCenter() {
        return this._prjCenter;
    };

    Map.prototype._setPrjCenter = function _setPrjCenter(pcenter) {
        this._prjCenter = pcenter;
        if (this.isInteracting() && !this.isMoving()) {
            this._mapViewCoord = pcenter;
        }
        this._calcMatrices();
    };

    Map.prototype._setPrjCoordAtContainerPoint = function _setPrjCoordAtContainerPoint(coordinate, point) {
        if (point.x === this.width / 2 && point.y === this.height / 2) {
            return this;
        }
        var t = this._containerPointToPoint(point)._sub(this._prjToPoint(this._getPrjCenter()));
        var pcenter = this._pointToPrj(this._prjToPoint(coordinate).sub(t));
        this._setPrjCenter(pcenter);
        return this;
    };

    Map.prototype._verifyExtent = function _verifyExtent(center) {
        if (!center) {
            return false;
        }
        var maxExt = this.getMaxExtent();
        if (!maxExt) {
            return true;
        }
        return maxExt.contains(center);
    };

    Map.prototype._offsetCenterByPixel = function _offsetCenterByPixel(pixel) {
        var pos = new Point(this.width / 2 - pixel.x, this.height / 2 - pixel.y);
        var pCenter = this._containerPointToPrj(pos);
        this._setPrjCenter(pCenter);
        return pCenter;
    };

    Map.prototype.offsetPlatform = function offsetPlatform(offset) {
        if (!offset) {
            return this._mapViewPoint;
        } else {
            this._getRenderer().offsetPlatform(offset);
            this._mapViewCoord = this._getPrjCenter();
            this._mapViewPoint = this._mapViewPoint.add(offset);
            return this;
        }
    };

    Map.prototype.getViewPoint = function getViewPoint() {
        var offset = this._getViewPointFrameOffset();
        var panelOffset = this.offsetPlatform();
        if (offset) {
            panelOffset = panelOffset.add(offset);
        }
        return panelOffset;
    };

    Map.prototype._getViewPointFrameOffset = function _getViewPointFrameOffset() {
        if (this.isZooming()) {
            return null;
        }
        var pcenter = this._getPrjCenter();
        if (this._mapViewCoord && !this._mapViewCoord.equals(pcenter)) {
            return this._prjToContainerPoint(this._mapViewCoord).sub(this._prjToContainerPoint(pcenter));
        }
        return null;
    };

    Map.prototype._resetMapViewPoint = function _resetMapViewPoint() {
        this._mapViewPoint = new Point(0, 0);

        this._mapViewCoord = this._getPrjCenter();
    };

    Map.prototype._getResolution = function _getResolution(zoom) {
        if (isNil(zoom)) {
            zoom = this.getZoom();
        }
        return this._spatialReference.getResolution(zoom);
    };

    Map.prototype._getResolutions = function _getResolutions() {
        return this._spatialReference.getResolutions();
    };

    Map.prototype._prjToPoint = function _prjToPoint(pCoord, zoom) {
        zoom = isNil(zoom) ? this.getZoom() : zoom;
        return this._spatialReference.getTransformation().transform(pCoord, this._getResolution(zoom));
    };

    Map.prototype._pointToPrj = function _pointToPrj(point, zoom) {
        zoom = isNil(zoom) ? this.getZoom() : zoom;
        return this._spatialReference.getTransformation().untransform(point, this._getResolution(zoom));
    };

    Map.prototype._pointToPoint = function _pointToPoint(point, zoom) {
        if (!isNil(zoom)) {
            return point.multi(this._getResolution(zoom) / this._getResolution());
        }
        return point.copy();
    };

    Map.prototype._pointToPointAtZoom = function _pointToPointAtZoom(point, zoom) {
        if (!isNil(zoom)) {
            return point.multi(this._getResolution() / this._getResolution(zoom));
        }
        return point.copy();
    };

    Map.prototype._containerPointToPrj = function _containerPointToPrj(containerPoint) {
        return this._pointToPrj(this._containerPointToPoint(containerPoint));
    };

    Map.prototype._viewPointToPrj = function _viewPointToPrj(viewPoint) {
        return this._containerPointToPrj(this.viewPointToContainerPoint(viewPoint));
    };

    Map.prototype._prjToContainerPoint = function _prjToContainerPoint(pCoordinate, zoom) {
        return this._pointToContainerPoint(this._prjToPoint(pCoordinate, zoom), zoom);
    };

    Map.prototype._prjToViewPoint = function _prjToViewPoint(pCoordinate) {
        var containerPoint = this._prjToContainerPoint(pCoordinate);
        return this._containerPointToViewPoint(containerPoint);
    };

    Map.prototype._containerPointToViewPoint = function _containerPointToViewPoint(containerPoint) {
        if (!containerPoint) {
            return null;
        }
        return containerPoint._sub(this.getViewPoint());
    };

    Map.prototype._viewPointToPoint = function _viewPointToPoint(viewPoint, zoom) {
        return this._containerPointToPoint(this.viewPointToContainerPoint(viewPoint), zoom);
    };

    Map.prototype._pointToViewPoint = function _pointToViewPoint(point, zoom) {
        return this._prjToViewPoint(this._pointToPrj(point, zoom));
    };

    Map.prototype._callOnLoadHooks = function _callOnLoadHooks() {
        var proto = Map.prototype;
        if (!proto._onLoadHooks) {
            return;
        }
        for (var i = 0, l = proto._onLoadHooks.length; i < l; i++) {
            proto._onLoadHooks[i].call(this);
        }
    };

    return Map;
}(Handlerable(Eventable(Renderable(Class))));

Map.mergeOptions(options);

var MapDoubleClickZoomHandler = function (_Handler) {
    inherits(MapDoubleClickZoomHandler, _Handler);

    function MapDoubleClickZoomHandler() {
        classCallCheck(this, MapDoubleClickZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapDoubleClickZoomHandler.prototype.addHooks = function addHooks() {
        if (!this.target) {
            return;
        }
        this.target.on('_dblclick', this._onDoubleClick, this);
    };

    MapDoubleClickZoomHandler.prototype.removeHooks = function removeHooks() {
        if (!this.target) {
            return;
        }
        this.target.off('_dblclick', this._onDoubleClick, this);
    };

    MapDoubleClickZoomHandler.prototype._onDoubleClick = function _onDoubleClick(param) {
        var map = this.target;
        if (map.options['doubleClickZoom']) {
            var oldZoom = map.getZoom(),
                zoom = param['domEvent']['shiftKey'] ? Math.ceil(oldZoom) - 1 : Math.floor(oldZoom) + 1;
            map._zoomAnimation(zoom, param['containerPoint']);
        }
    };

    return MapDoubleClickZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'doubleClickZoom': true
});

Map.addOnLoadHook('addHandler', 'doubleClickZoom', MapDoubleClickZoomHandler);

var MapDragHandler = function (_Handler) {
    inherits(MapDragHandler, _Handler);

    function MapDragHandler() {
        classCallCheck(this, MapDragHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapDragHandler.prototype.addHooks = function addHooks() {
        var map = this.target;
        if (!map) {
            return;
        }
        var dom = map._panels.mapWrapper || map._containerDOM;
        this._dragHandler = new DragHandler(dom, {
            'cancelOn': this._cancelOn.bind(this),
            'rightclick': true
        });
        this._dragHandler.on('mousedown', this._onMouseDown, this).on('dragstart', this._onDragStart, this).on('dragging', this._onDragging, this).on('dragend', this._onDragEnd, this).enable();
    };

    MapDragHandler.prototype.removeHooks = function removeHooks() {
        this._dragHandler.off('mousedown', this._onMouseDown, this).off('dragstart', this._onDragStart, this).off('dragging', this._onDragging, this).off('dragend', this._onDragEnd, this);
        this._dragHandler.remove();
        delete this._dragHandler;
    };

    MapDragHandler.prototype._cancelOn = function _cancelOn(domEvent) {
        if (this.target.isZooming()) {
            return true;
        }
        if (this._ignore(domEvent)) {
            return true;
        }
        return false;
    };

    MapDragHandler.prototype._ignore = function _ignore(param) {
        if (!param) {
            return false;
        }
        if (param.domEvent) {
            param = param.domEvent;
        }
        return this.target._ignoreEvent(param);
    };

    MapDragHandler.prototype._onMouseDown = function _onMouseDown(param) {
        delete this.startDragTime;
        delete this._mode;
        if (param.domEvent.button === 2 || param.domEvent.ctrlKey) {
            if (this.target.options['dragRotate'] || this.target.options['dragPitch']) {
                this._mode = 'rotatePitch';
            }
        } else if (this.target.options['dragPan']) {
            this._mode = 'move';
        }
        this.target._stopAnim();
        preventDefault(param['domEvent']);
    };

    MapDragHandler.prototype._onDragStart = function _onDragStart(param) {
        if (this._mode === 'move') {
            this._moveStart(param);
        } else if (this._mode === 'rotatePitch') {
            this._rotateStart(param);
        }
    };

    MapDragHandler.prototype._onDragging = function _onDragging(param) {
        var map = this.target;
        if (map._isEventOutMap(param['domEvent'])) {
            return;
        }
        if (this._mode === 'move') {
            this._moving(param);
        } else if (this._mode === 'rotatePitch') {
            this._rotating(param);
        }
    };

    MapDragHandler.prototype._onDragEnd = function _onDragEnd(param) {
        if (this._mode === 'move') {
            this._moveEnd(param);
        } else if (this._mode === 'rotatePitch') {
            this._rotateEnd(param);
        }
    };

    MapDragHandler.prototype._start = function _start(param) {
        this.startDragTime = now();
        this.preX = param['mousePos'].x;
        this.preY = param['mousePos'].y;
        this.startX = this.preX;
        this.startY = this.preY;
    };

    MapDragHandler.prototype._moveStart = function _moveStart(param) {
        this._start(param);
        var map = this.target;
        map.onMoveStart(param);
        var p = getEventContainerPoint(map._getActualEvent(param.domEvent), map.getContainer());
        this.startPrjCoord = map._containerPointToPrj(p);
    };

    MapDragHandler.prototype._moving = function _moving(param) {
        if (!this.startDragTime) {
            return;
        }
        var map = this.target;
        var p = getEventContainerPoint(map._getActualEvent(param.domEvent), map.getContainer());
        map._setPrjCoordAtContainerPoint(this.startPrjCoord, p);
        map.onMoving(param);
    };

    MapDragHandler.prototype._moveEnd = function _moveEnd(param) {
        if (!this.startDragTime) {
            return;
        }
        var map = this.target;
        var t = now() - this.startDragTime;
        var mx = param['mousePos'].x,
            my = param['mousePos'].y;
        var dx = mx - this.startX;
        var dy = my - this.startY;

        this._clear();

        if (map._verifyExtent(map.getCenter()) && t < 280 && Math.abs(dy) + Math.abs(dx) > 5) {
            t = 5 * t * (Math.abs(dx) + Math.abs(dy)) / 500;
            map.panBy(new Point(dx, dy), { 'duration': t });
        } else {
            map.onMoveEnd(param);
        }
    };

    MapDragHandler.prototype._rotateStart = function _rotateStart(param) {
        this._start(param);
        delete this._rotateMode;
        this.target.onDragRotateStart(param);
    };

    MapDragHandler.prototype._rotating = function _rotating(param) {
        var map = this.target;
        var mx = param['mousePos'].x,
            my = param['mousePos'].y;
        var prePitch = map.getPitch(),
            preBearing = map.getBearing();
        var dx = Math.abs(mx - this.preX),
            dy = Math.abs(my - this.preY);

        if (!this._rotateMode) {
            if (map.options['dragRotatePitch']) {
                this._rotateMode = 'rotate_pitch';
            } else if (dx > dy) {
                this._rotateMode = 'rotate';
            } else if (dx < dy) {
                this._rotateMode = 'pitch';
            } else {
                this._rotateMode = 'rotate';
            }
        }

        if (this._rotateMode === 'pitch' && prePitch === 0 && dy < 10) {
            return;
        }

        if (this._rotateMode.indexOf('rotate') >= 0 && map.options['dragRotate']) {
            map.setBearing(map.getBearing() - 0.6 * (this.preX - mx));
        }
        if (this._rotateMode.indexOf('pitch') >= 0 && map.options['dragPitch']) {
            map.setPitch(map.getPitch() + (this.preY - my) * 0.4);
        }
        this.preX = mx;
        this.preY = my;
        if (map.getBearing() !== preBearing || map.getPitch() !== prePitch) {
            map.onDragRotating(param);
        }
    };

    MapDragHandler.prototype._rotateEnd = function _rotateEnd(param) {
        this._clear();
        this.target.onDragRotateEnd(param);
    };

    MapDragHandler.prototype._clear = function _clear() {
        delete this.startPrjCoord;
        delete this.preX;
        delete this.preY;
        delete this.startX;
        delete this.startY;
    };

    return MapDragHandler;
}(Handler$1);

Map.mergeOptions({
    'draggable': true,
    'dragPan': true,
    'dragRotatePitch': false,
    'dragRotate': true,
    'dragPitch': true
});

Map.addOnLoadHook('addHandler', 'draggable', MapDragHandler);

function clipLine(points, bounds, round) {
    var parts = [];
    var k = 0,
        segment = void 0;
    for (var j = 0, l = points.length; j < l - 1; j++) {
        segment = clipSegment(points[j], points[j + 1], bounds, j, round);

        if (!segment) {
            continue;
        }

        parts[k] = parts[k] || [];
        parts[k].push({
            'point': segment[0],
            'index': j
        });

        if (segment[1] !== points[j + 1] || j === l - 2) {
            parts[k].push({
                'point': segment[1],
                'index': j + 1
            });
            k++;
        }
    }
    return parts;
}

var _lastCode = void 0;

function clipSegment(a, b, bounds, useLastCode, round) {
    var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
        codeB = _getBitCode(b, bounds),
        codeOut = void 0,
        p = void 0,
        newCode = void 0;

    _lastCode = codeB;

    while (true) {
        if (!(codeA | codeB)) {
            return [a, b];
        }

        if (codeA & codeB) {
            return false;
        }

        codeOut = codeA || codeB;
        p = _getEdgeIntersection(a, b, codeOut, bounds, round);
        newCode = _getBitCode(p, bounds);

        if (codeOut === codeA) {
            a = p;
            codeA = newCode;
        } else {
            b = p;
            codeB = newCode;
        }
    }
}

function clipPolygon(points, bounds, round) {
    var edges = [1, 4, 2, 8];
    var clippedPoints = void 0,
        i = void 0,
        j = void 0,
        k = void 0,
        a = void 0,
        b = void 0,
        len = void 0,
        edge = void 0,
        p = void 0;

    for (i = 0, len = points.length; i < len; i++) {
        points[i]._code = _getBitCode(points[i], bounds);
    }

    for (k = 0; k < 4; k++) {
        edge = edges[k];
        clippedPoints = [];

        for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
            a = points[i];
            b = points[j];

            if (!(a._code & edge)) {
                if (b._code & edge) {
                    p = _getEdgeIntersection(b, a, edge, bounds, round);
                    p._code = _getBitCode(p, bounds);
                    clippedPoints.push(p);
                }
                clippedPoints.push(a);
            } else if (!(b._code & edge)) {
                p = _getEdgeIntersection(b, a, edge, bounds, round);
                p._code = _getBitCode(p, bounds);
                clippedPoints.push(p);
            }
        }
        points = clippedPoints;
    }

    return points;
}

function distanceToSegment(p, p1, p2) {
    var x = p.x,
        y = p.y,
        x1 = p1.x,
        y1 = p1.y,
        x2 = p2.x,
        y2 = p2.y;

    var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
    if (cross <= 0) {
        return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    }
    var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (cross >= d2) {
        return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
    }
    var r = cross / d2;
    var px = x1 + (x2 - x1) * r;
    var py = y1 + (y2 - y1) * r;

    return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
}

function pointInsidePolygon(p, points) {
    var p1 = void 0,
        p2 = void 0;
    var len = points.length;
    var c = false;

    for (var i = 0, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];
        if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
            c = !c;
        }
    }

    return c;
}

function _getEdgeIntersection(a, b, code, bounds, round) {
    var dx = b.x - a.x,
        dy = b.y - a.y,
        min = bounds.getMin(),
        max = bounds.getMax();
    var x = void 0,
        y = void 0;

    if (code & 8) {
        x = a.x + dx * (max.y - a.y) / dy;
        y = max.y;
    } else if (code & 4) {
        x = a.x + dx * (min.y - a.y) / dy;
        y = min.y;
    } else if (code & 2) {
        x = max.x;
        y = a.y + dy * (max.x - a.x) / dx;
    } else if (code & 1) {
        x = min.x;
        y = a.y + dy * (min.x - a.x) / dx;
    }

    var p = new Point(x, y);
    if (round) {
        p._round();
    }
    return p;
}

function _getBitCode(p, bounds) {
    var code = 0;

    if (p.x < bounds.getMin().x) {
        code |= 1;
    } else if (p.x > bounds.getMax().x) {
        code |= 2;
    }

    if (p.y < bounds.getMin().y) {
        code |= 4;
    } else if (p.y > bounds.getMax().y) {
        code |= 8;
    }

    return code;
}

function withInEllipse(point, center, southeast, tolerance) {
    point = new Point(point);
    var a = Math.abs(southeast.x - center.x),
        b = Math.abs(southeast.y - center.y),
        c = Math.sqrt(Math.abs(a * a - b * b)),
        xfocus = a >= b;
    var f1 = void 0,
        f2 = void 0,
        d = void 0;
    if (xfocus) {
        f1 = new Point(center.x - c, center.y);
        f2 = new Point(center.x + c, center.y);
        d = a * 2;
    } else {
        f1 = new Point(center.x, center.y - c);
        f2 = new Point(center.x, center.y + c);
        d = b * 2;
    }

    return point.distanceTo(f1) + point.distanceTo(f2) <= d + 2 * tolerance;
}

var registerSymbolizers = [DrawAltitudeSymbolizer, StrokeAndFillSymbolizer, ImageMarkerSymbolizer, VectorPathMarkerSymbolizer, VectorMarkerSymbolizer, TextMarkerSymbolizer];

var Painter = function (_Class) {
    inherits(Painter, _Class);

    function Painter(geometry) {
        classCallCheck(this, Painter);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.geometry = geometry;
        _this.symbolizers = _this._createSymbolizers();
        _this._altAtMaxZ = _this._getGeometryAltitude();
        return _this;
    }

    Painter.prototype.getMap = function getMap() {
        return this.geometry.getMap();
    };

    Painter.prototype.getLayer = function getLayer() {
        return this.geometry.getLayer();
    };

    Painter.prototype._createSymbolizers = function _createSymbolizers() {
        var geoSymbol = this.getSymbol(),
            symbolizers = [],
            regSymbolizers = registerSymbolizers;
        var symbols = geoSymbol;
        if (!Array.isArray(geoSymbol)) {
            symbols = [geoSymbol];
        }
        for (var ii = symbols.length - 1; ii >= 0; ii--) {
            var symbol = symbols[ii];
            for (var i = regSymbolizers.length - 1; i >= 0; i--) {
                if (regSymbolizers[i].test(symbol, this.geometry)) {
                    var symbolizer = new regSymbolizers[i](symbol, this.geometry, this);
                    symbolizers.push(symbolizer);
                    if (symbolizer instanceof PointSymbolizer) {
                        this._hasPoint = true;
                    }
                }
            }
        }
        if (!symbolizers.length) {
            if (console) {
                var id = this.geometry.getId();
                console.warn('invalid symbol for geometry(' + (this.geometry ? this.geometry.getType() + (id ? ':' + id : '') : '') + ') to draw : ' + JSON.stringify(geoSymbol));
            }
        }
        this._debugSymbolizer = new DebugSymbolizer(geoSymbol, this.geometry, this);
        this._hasShadow = this.geometry.options['shadowBlur'] > 0;
        return symbolizers;
    };

    Painter.prototype.hasPoint = function hasPoint() {
        return !!this._hasPoint;
    };

    Painter.prototype.getRenderPoints = function getRenderPoints(placement) {
        if (!this._renderPoints) {
            this._renderPoints = {};
        }
        if (!placement) {
            placement = 'point';
        }
        if (!this._renderPoints[placement]) {
            this._renderPoints[placement] = this.geometry._getRenderPoints(placement);
        }
        return this._renderPoints[placement];
    };

    Painter.prototype.getPaintParams = function getPaintParams(dx, dy, ignoreAltitude) {
        var map = this.getMap(),
            res = map.getResolution(),
            pitched = map.getPitch() !== 0,
            rotated = map.getBearing() !== 0;
        var params = this._cachedParams;
        if (this._unsimpledParams && res <= this._unsimpledParams._res) {
            params = this._unsimpledParams;
        } else if (!params || params._res !== map.getResolution() || this._pitched !== pitched && this.geometry._redrawWhenPitch() || this._rotated !== rotated && this.geometry._redrawWhenRotate()) {
            params = this.geometry._getPaintParams();
            if (!params) {
                return null;
            }
            params._res = res;
            params._simplified = this.geometry._simplified;
            if (!params._simplified) {
                if (!this._unsimpledParams) {
                    this._unsimpledParams = params;
                }
                if (res > this._unsimpledParams._res) {
                    this._unsimpledParams._res = res;
                }
            }
            this._cachedParams = params;
        }
        if (!params) {
            return null;
        }
        this._pitched = pitched;
        this._rotated = rotated;
        var zoomScale = map.getGLScale(),
            tr = [],
            points = params[0];

        var cPoints = this._pointContainerPoints(points, dx, dy, ignoreAltitude);
        if (!cPoints) {
            return null;
        }
        tr.push(cPoints);
        for (var i = 1, l = params.length; i < l; i++) {
            if (isNumber(params[i]) || params[i] instanceof Size) {
                if (isNumber(params[i])) {
                    tr.push(params[i] / zoomScale);
                } else {
                    tr.push(params[i].multi(1 / zoomScale));
                }
            } else {
                tr.push(params[i]);
            }
        }
        return tr;
    };

    Painter.prototype._pointContainerPoints = function _pointContainerPoints(points, dx, dy, ignoreAltitude, noClip) {
        var cExtent = this.getContainerExtent();
        if (!cExtent) {
            return null;
        }
        var map = this.getMap(),
            glZoom = map.getGLZoom(),
            layerPoint = map._pointToContainerPoint(this.getLayer()._getRenderer()._northWest);
        var cPoints = void 0;
        function pointContainerPoint(point, alt) {
            var p = map._pointToContainerPoint(point, glZoom, alt)._sub(layerPoint);
            if (dx || dy) {
                p._add(dx || 0, dy || 0);
            }
            return p;
        }

        var altitude = this.getAltitude();

        if (Array.isArray(points)) {
            var clipped = void 0;
            if (!noClip) {
                clipped = this._clip(points, altitude);
            } else {
                clipped = {
                    points: points,
                    altitude: altitude
                };
            }
            var clipPoints = clipped.points;
            altitude = clipped.altitude;
            if (ignoreAltitude) {
                altitude = 0;
            }
            var alt = altitude;
            cPoints = clipPoints.map(function (c, idx) {
                if (Array.isArray(c)) {
                    return c.map(function (cc, cidx) {
                        if (Array.isArray(altitude)) {
                            if (altitude[idx]) {
                                alt = altitude[idx][cidx];
                            } else {
                                alt = 0;
                            }
                        }
                        return pointContainerPoint(cc, alt);
                    });
                } else {
                    if (Array.isArray(altitude)) {
                        alt = altitude[idx];
                    }
                    return pointContainerPoint(c, alt);
                }
            });
        } else if (points instanceof Point) {
            if (ignoreAltitude) {
                altitude = 0;
            }
            cPoints = map._pointToContainerPoint(points, glZoom, altitude)._sub(layerPoint);
            if (dx || dy) {
                cPoints._add(dx, dy);
            }
        }
        return cPoints;
    };

    Painter.prototype._clip = function _clip(points, altitude) {
        var map = this.getMap(),
            glZoom = map.getGLZoom();
        var lineWidth = this.getSymbol()['lineWidth'];
        if (!isNumber(lineWidth)) {
            lineWidth = 4;
        }
        var containerExtent = map.getContainerExtent();
        var extent2D = containerExtent.expand(lineWidth).convertTo(function (p) {
            return map._containerPointToPoint(p, glZoom);
        });
        if (map.getPitch() > 0 && altitude) {
            var c = map.cameraLookAt;
            var pos = map.cameraPosition;

            extent2D = extent2D.combine(new Point(pos)._add(sign(c.x - pos[0]), sign(c.y - pos[1])));
        }
        var e = this.get2DExtent();
        var clipPoints = points;
        if (e.within(extent2D)) {
            if (this.geometry.getJSONType() === 'LineString') {
                return this._clipLineByAlt(clipPoints, altitude);
            }
            return {
                points: clipPoints,
                altitude: altitude
            };
        }

        if (this.geometry.getShell && this.geometry.getHoles) {
            if (!Array.isArray(points[0])) {
                clipPoints = clipPolygon(points, extent2D);
            } else {
                clipPoints = [];
                for (var i = 0; i < points.length; i++) {
                    var part = clipPolygon(points[i], extent2D);
                    if (part.length) {
                        clipPoints.push(part);
                    }
                }
            }
        } else if (this.geometry.getJSONType() === 'LineString') {
            if (!Array.isArray(points[0])) {
                clipPoints = clipLine(points, extent2D);
            } else {
                clipPoints = [];
                for (var _i = 0; _i < points.length; _i++) {
                    pushIn(clipPoints, clipLine(points[_i], extent2D));
                }
            }

            var segs = this._interpolateSegAlt(clipPoints, points, altitude);
            return this._clipLineByAlt(segs.points, segs.altitude);
        }

        return {
            points: clipPoints,
            altitude: altitude
        };
    };

    Painter.prototype._clipLineByAlt = function _clipLineByAlt(clipSegs, altitude) {
        var frustumAlt = this.getMap().getFrustumAltitude();
        if (!Array.isArray(altitude) || this.maxAltitude <= frustumAlt) {
            return {
                points: clipSegs,
                altitude: altitude
            };
        }
        return clipByALt(clipSegs, altitude, frustumAlt);
    };

    Painter.prototype._interpolateSegAlt = function _interpolateSegAlt(clipSegs, orig, altitude) {
        if (!Array.isArray(altitude)) {
            var fn = function fn(cc) {
                return cc.point;
            };
            return {
                points: clipSegs.map(function (c) {
                    if (Array.isArray(c)) {
                        return c.map(fn);
                    }
                    return c.point;
                }),
                altitude: altitude
            };
        }
        var segsWithAlt = interpolateAlt(clipSegs, orig, altitude);
        altitude = [];
        var points = segsWithAlt.map(function (p) {
            if (Array.isArray(p)) {
                var alt = [];
                var cp = p.map(function (pp) {
                    alt.push(pp.altitude);
                    return pp.point;
                });
                altitude.push(alt);
                return cp;
            }
            altitude.push(p.altitude);
            return p.point;
        });
        return {
            points: points,
            altitude: altitude
        };
    };

    Painter.prototype.getSymbol = function getSymbol() {
        return this.geometry._getInternalSymbol();
    };

    Painter.prototype.paint = function paint(extent, context) {
        if (!this.symbolizers) {
            return;
        }
        var renderer = this.getLayer()._getRenderer();
        if (!renderer || !renderer.context) {
            return;
        }

        if (extent && !extent.intersects(this.get2DExtent(renderer.resources))) {
            return;
        }
        var map = this.getMap();
        var minAltitude = this.getMinAltitude();
        var frustumAlt = map.getFrustumAltitude();
        if (minAltitude && frustumAlt && frustumAlt < minAltitude) {
            return;
        }
        this._beforePaint();
        var ctx = context || renderer.context;
        var contexts = [ctx, renderer.resources];
        this._prepareShadow(ctx);
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            this.symbolizers[i].symbolize.apply(this.symbolizers[i], contexts);
        }
        this._afterPaint();
        this._painted = true;
        this._debugSymbolizer.symbolize.apply(this._debugSymbolizer, contexts);
    };

    Painter.prototype.getSprite = function getSprite(resources, canvasClass) {
        if (this.geometry.type !== 'Point') {
            return null;
        }
        this._genSprite = true;
        if (!this._sprite && this.symbolizers.length > 0) {
            var extent = new PointExtent();
            this.symbolizers.forEach(function (s) {
                var markerExtent = s.getMarkerExtent(resources);
                extent._combine(markerExtent);
            });
            var origin = extent.getMin().multi(-1);
            var clazz = canvasClass || (this.getMap() ? this.getMap().CanvasClass : null);
            var canvas = Canvas.createCanvas(extent.getWidth(), extent.getHeight(), clazz);
            var bak = void 0;
            if (this._renderPoints) {
                bak = this._renderPoints;
            }
            var contexts = [canvas.getContext('2d'), resources];
            this._prepareShadow(canvas.getContext('2d'));
            for (var i = this.symbolizers.length - 1; i >= 0; i--) {
                var dxdy = this.symbolizers[i].getDxDy();
                this._renderPoints = {
                    'point': [[origin.add(dxdy)]]
                };

                this.symbolizers[i].symbolize.apply(this.symbolizers[i], contexts);
            }
            if (bak) {
                this._renderPoints = bak;
            }
            this._sprite = {
                'canvas': canvas,
                'offset': extent.getCenter()
            };
        }
        this._genSprite = false;
        return this._sprite;
    };

    Painter.prototype.isSpriting = function isSpriting() {
        return this._genSprite;
    };

    Painter.prototype._prepareShadow = function _prepareShadow(ctx) {
        if (this._hasShadow) {
            ctx.shadowBlur = this.geometry.options['shadowBlur'];
            ctx.shadowColor = this.geometry.options['shadowColor'];
        } else if (ctx.shadowBlur) {
            ctx.shadowBlur = null;
            ctx.shadowColor = null;
        }
    };

    Painter.prototype._eachSymbolizer = function _eachSymbolizer(fn, context) {
        if (!this.symbolizers) {
            return;
        }
        if (!context) {
            context = this;
        }
        for (var i = this.symbolizers.length - 1; i >= 0; i--) {
            fn.apply(context, [this.symbolizers[i]]);
        }
    };

    Painter.prototype.get2DExtent = function get2DExtent(resources) {
        this._verifyProjection();
        var map = this.getMap();
        resources = resources || this.getLayer()._getRenderer().resources;
        var zoom = map.getZoom();
        if (!this._extent2D || this._extent2D._zoom !== zoom) {
            delete this._extent2D;
            delete this._markerExtent;
            if (this.symbolizers) {
                var extent = this._extent2D = new PointExtent();
                var markerExt = this._markerExtent = new PointExtent();
                for (var i = this.symbolizers.length - 1; i >= 0; i--) {
                    var symbolizer = this.symbolizers[i];
                    extent._combine(symbolizer.get2DExtent());
                    if (symbolizer.getMarkerExtent) {
                        markerExt._combine(symbolizer.getMarkerExtent(resources));
                    }
                }
                extent._zoom = zoom;
            }
        }
        return this._extent2D.add(this._markerExtent);
    };

    Painter.prototype.getContainerExtent = function getContainerExtent() {
        this._verifyProjection();
        var map = this.getMap();
        var zoom = map.getZoom();
        if (!this._extent2D || this._extent2D._zoom !== zoom) {
            this.get2DExtent();
        }
        var altitude = this.getMinAltitude();
        var frustumAlt = map.getFrustumAltitude();
        if (altitude && frustumAlt && frustumAlt < altitude) {
            return null;
        }
        var extent = this._extent2D.convertTo(function (c) {
            return map._pointToContainerPoint(c, zoom, altitude);
        });
        if (extent) {
            extent._add(this._markerExtent);
        }
        return extent;
    };

    Painter.prototype.setZIndex = function setZIndex(change) {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.setZIndex(change);
        });
    };

    Painter.prototype.show = function show() {
        if (!this._painted) {
            var layer = this.getLayer();
            if (!layer.isCanvasRender()) {
                this.paint();
            }
        } else {
            this.removeCache();
            this._eachSymbolizer(function (symbolizer) {
                symbolizer.show();
            });
        }
    };

    Painter.prototype.hide = function hide() {
        this._eachSymbolizer(function (symbolizer) {
            symbolizer.hide();
        });
    };

    Painter.prototype.repaint = function repaint() {
        this.removeCache();
    };

    Painter.prototype.refreshSymbol = function refreshSymbol() {
        this.removeCache();
        this._removeSymbolizers();
        this.symbolizers = this._createSymbolizers();
    };

    Painter.prototype.remove = function remove() {
        this.removeCache();
        this._removeSymbolizers();
    };

    Painter.prototype._removeSymbolizers = function _removeSymbolizers() {
        this._eachSymbolizer(function (symbolizer) {
            delete symbolizer.painter;
            symbolizer.remove();
        });
        delete this.symbolizers;
    };

    Painter.prototype.removeCache = function removeCache() {
        delete this._renderPoints;
        delete this._paintParams;
        delete this._sprite;
        delete this._extent2D;
        delete this._markerExtent;
        delete this._cachedParams;
        delete this._unsimpledParams;
    };

    Painter.prototype.getAltitude = function getAltitude() {
        var propAltitude = this._getAltitudeProperty();
        if (propAltitude !== this._propAlt) {
            this._altAtMaxZ = this._getGeometryAltitude();
        }
        if (!this._altAtMaxZ) {
            return 0;
        }
        return this._altAtMaxZ;
    };

    Painter.prototype.getMinAltitude = function getMinAltitude() {
        if (!this.minAltitude) {
            return 0;
        }
        return this.minAltitude;
    };

    Painter.prototype._getGeometryAltitude = function _getGeometryAltitude() {
        var _this2 = this;

        var map = this.getMap();
        if (!map) {
            return 0;
        }
        var altitude = this._getAltitudeProperty();
        this._propAlt = altitude;
        if (!altitude) {
            this.minAltitude = this.maxAltitude = 0;
            return 0;
        }
        var center = this.geometry.getCenter();
        if (Array.isArray(altitude)) {
            this.minAltitude = Number.MAX_VALUE;
            this.maxAltitude = Number.MIN_VALUE;
            return altitude.map(function (alt) {
                var a = _this2._meterToPoint(center, alt);
                if (a < _this2.minAltitude) {
                    _this2.minAltitude = a;
                }
                if (a > _this2.maxAltitude) {
                    _this2.maxAltitude = a;
                }
                return a;
            });
        } else {
            this.minAltitude = this.maxAltitude = this._meterToPoint(center, altitude);
            return this.minAltitude;
        }
    };

    Painter.prototype._meterToPoint = function _meterToPoint(center, altitude) {
        var map = this.getMap();
        var z = map.getGLZoom();
        var target = map.locate(center, altitude, 0);
        var p0 = map.coordToPoint(center, z),
            p1 = map.coordToPoint(target, z);
        return Math.abs(p1.x - p0.x) * sign(altitude);
    };

    Painter.prototype._getAltitudeProperty = function _getAltitudeProperty() {
        var geometry = this.geometry,
            layerOpts = geometry.getLayer().options,
            properties = geometry.getProperties();
        var altitude = layerOpts['enableAltitude'] ? properties ? properties[layerOpts['altitudeProperty']] : 0 : 0;
        return altitude;
    };

    Painter.prototype._verifyProjection = function _verifyProjection() {
        var projection = this.geometry._getProjection();
        if (this._projCode && this._projCode !== projection.code) {
            this.removeCache();
        }
        this._projCode = projection.code;
    };

    Painter.prototype._beforePaint = function _beforePaint() {
        var textcache = this.geometry[TextMarkerSymbolizer.CACHE_KEY];
        if (!textcache) {
            return;
        }
        for (var p in textcache) {
            if (hasOwn(textcache, p)) {
                textcache[p].active = false;
            }
        }
    };

    Painter.prototype._afterPaint = function _afterPaint() {
        var textcache = this.geometry[TextMarkerSymbolizer.CACHE_KEY];
        if (!textcache) {
            return;
        }
        for (var p in textcache) {
            if (hasOwn(textcache, p)) {
                if (!textcache[p].active) {
                    delete textcache[p];
                }
            }
        }
    };

    return Painter;
}(Class);

function interpolateAlt(points, orig, altitude) {
    if (!Array.isArray(altitude)) {
        return points;
    }
    var parts = [];
    for (var i = 0, l = points.length; i < l; i++) {
        if (Array.isArray(points[i])) {
            parts.push(interpolateAlt(points[i], orig, altitude));
        } else {
            var p = points[i];
            if (!p.point.equals(orig[p.index])) {
                var w0 = void 0,
                    w1 = void 0;
                if (p.index === 0) {
                    w0 = p.index;
                    w1 = p.index + 1;
                } else {
                    w0 = p.index - 1;
                    w1 = p.index;
                }

                var t0 = p.point.distanceTo(orig[w1]);
                var t = t0 / (t0 + orig[w0].distanceTo(p.point));
                var alt = interpolate(altitude[w0], altitude[w1], 1 - t);
                p.altitude = alt;
                parts.push(p);
            } else {
                p.altitude = altitude[p.index];
                parts.push(p);
            }
        }
    }
    return parts;
}

function interpolatePoint(p0, p1, t) {
    var x = interpolate(p0.x, p1.x, t),
        y = interpolate(p0.y, p1.y, t);
    return new Point(x, y);
}

function clipByALt(clipSegs, altitude, topAlt) {
    var points = [];
    var alt = [];
    var preAlt = void 0;

    for (var i = 0, l = clipSegs.length; i < l; i++) {
        if (Array.isArray(clipSegs[i])) {
            var r = clipByALt(clipSegs[i], altitude[i], topAlt);
            if (!r) {
                continue;
            }
            points.push(r.points);
            alt.push(r.altitude);
        } else if (i === 0) {
            preAlt = altitude[0];
            points.push(clipSegs[i]);
            alt.push(preAlt < topAlt ? preAlt : topAlt);
        } else {
            var a = altitude[i];
            if (a >= topAlt) {
                if (preAlt >= topAlt) {
                    points.push(clipSegs[i]);
                    alt.push(topAlt);
                } else {
                    var p = interpolatePoint(clipSegs[i - 1], clipSegs[i], (topAlt - preAlt) / (a - preAlt));
                    points.push(p);
                    alt.push(topAlt);
                    points.push(clipSegs[i]);
                    alt.push(topAlt);
                }
            } else if (preAlt < topAlt) {
                points.push(clipSegs[i]);
                alt.push(a);
            } else {
                var _p = interpolatePoint(clipSegs[i - 1], clipSegs[i], (preAlt - topAlt) / (preAlt - a));
                points.push(_p);
                alt.push(topAlt);
                points.push(clipSegs[i]);
                alt.push(a);
            }
            preAlt = a;
        }
    }
    return {
        points: points,
        altitude: alt
    };
}

var CollectionPainter = function (_Class) {
    inherits(CollectionPainter, _Class);

    function CollectionPainter(geometry) {
        classCallCheck(this, CollectionPainter);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.geometry = geometry;
        return _this;
    }

    CollectionPainter.prototype._eachPainter = function _eachPainter(fn) {
        var geometries = this.geometry.getGeometries();
        var painter = void 0;
        for (var i = 0, len = geometries.length; i < len; i++) {
            painter = geometries[i]._getPainter();
            if (!painter) {
                continue;
            }
            if (painter) {
                if (fn.call(this, painter) === false) {
                    break;
                }
            }
        }
    };

    CollectionPainter.prototype.paint = function paint(extent) {
        if (!this.geometry) {
            return;
        }
        this._eachPainter(function (painter) {
            painter.paint(extent);
        });
    };

    CollectionPainter.prototype.get2DExtent = function get2DExtent(resources) {
        var extent = new PointExtent();
        this._eachPainter(function (painter) {
            extent = extent.combine(painter.get2DExtent(resources));
        });
        return extent;
    };

    CollectionPainter.prototype.getContainerExtent = function getContainerExtent() {
        var extent = new PointExtent();
        this._eachPainter(function (painter) {
            extent = extent.combine(painter.getContainerExtent());
        });
        return extent;
    };

    CollectionPainter.prototype.remove = function remove() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.remove.apply(painter, args);
        });
    };

    CollectionPainter.prototype.setZIndex = function setZIndex() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.setZIndex.apply(painter, args);
        });
    };

    CollectionPainter.prototype.show = function show() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.show.apply(painter, args);
        });
    };

    CollectionPainter.prototype.hide = function hide() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.hide.apply(painter, args);
        });
    };

    CollectionPainter.prototype.repaint = function repaint() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.repaint.apply(painter, args);
        });
    };

    CollectionPainter.prototype.refreshSymbol = function refreshSymbol() {
        var args = arguments;
        this._eachPainter(function (painter) {
            painter.refreshSymbol.apply(painter, args);
        });
    };

    CollectionPainter.prototype.hasPoint = function hasPoint() {
        var result = false;
        this._eachPainter(function (painter) {
            if (painter.hasPoint()) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    };

    return CollectionPainter;
}(Class);

var options$2 = {
    'id': null,
    'visible': true,
    'editable': true,
    'cursor': null,
    'shadowBlur': 0,
    'shadowColor': 'black',
    'defaultProjection': 'EPSG:4326' };

var Geometry = function (_JSONAble) {
    inherits(Geometry, _JSONAble);

    function Geometry(options) {
        classCallCheck(this, Geometry);

        var opts = extend({}, options);
        var symbol = opts['symbol'];
        var properties = opts['properties'];
        var id = opts['id'];
        delete opts['symbol'];
        delete opts['id'];
        delete opts['properties'];

        var _this = possibleConstructorReturn(this, _JSONAble.call(this, opts));

        if (symbol) {
            _this.setSymbol(symbol);
        }
        if (properties) {
            _this.setProperties(properties);
        }
        if (!isNil(id)) {
            _this.setId(id);
        }
        return _this;
    }

    Geometry.prototype.getFirstCoordinate = function getFirstCoordinate() {
        if (this.type === 'GeometryCollection') {
            var geometries = this.getGeometries();
            if (!geometries.length) {
                return null;
            }
            return geometries[0].getFirstCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Array.isArray(coordinates)) {
            return coordinates;
        }
        do {
            coordinates = coordinates[0];
        } while (Array.isArray(coordinates) && coordinates.length > 0);
        return coordinates;
    };

    Geometry.prototype.getLastCoordinate = function getLastCoordinate() {
        if (this.type === 'GeometryCollection') {
            var geometries = this.getGeometries();
            if (!geometries.length) {
                return null;
            }
            return geometries[geometries.length - 1].getLastCoordinate();
        }
        var coordinates = this.getCoordinates();
        if (!Array.isArray(coordinates)) {
            return coordinates;
        }
        do {
            coordinates = coordinates[coordinates.length - 1];
        } while (Array.isArray(coordinates) && coordinates.length > 0);
        return coordinates;
    };

    Geometry.prototype.addTo = function addTo(layer, fitview) {
        layer.addGeometry(this, fitview);
        return this;
    };

    Geometry.prototype.getLayer = function getLayer() {
        if (!this._layer) {
            return null;
        }
        return this._layer;
    };

    Geometry.prototype.getMap = function getMap() {
        if (!this._layer) {
            return null;
        }
        return this._layer.getMap();
    };

    Geometry.prototype.getId = function getId() {
        return this._id;
    };

    Geometry.prototype.setId = function setId(id) {
        var oldId = this.getId();
        this._id = id;

        this._fireEvent('idchange', {
            'old': oldId,
            'new': id
        });

        return this;
    };

    Geometry.prototype.getProperties = function getProperties() {
        if (!this.properties) {
            if (this._getParent()) {
                return this._getParent().getProperties();
            }
            return null;
        }
        return this.properties;
    };

    Geometry.prototype.setProperties = function setProperties(properties) {
        var old = this.properties;
        this.properties = isObject(properties) ? extend({}, properties) : properties;

        this._fireEvent('propertieschange', {
            'old': old,
            'new': properties
        });

        return this;
    };

    Geometry.prototype.getType = function getType() {
        return this.type;
    };

    Geometry.prototype.getSymbol = function getSymbol() {
        var s = this._symbol;
        if (s) {
            if (!Array.isArray(s)) {
                return extend({}, s);
            } else {
                return extendSymbol(s);
            }
        }
        return null;
    };

    Geometry.prototype.setSymbol = function setSymbol(symbol) {
        this._symbol = this._prepareSymbol(symbol);
        this.onSymbolChanged();
        return this;
    };

    Geometry.prototype.updateSymbol = function updateSymbol(props) {
        if (!props) {
            return this;
        }
        var s = this._getSymbol();
        if (s) {
            s = extendSymbol(s, props);
        } else {
            s = extendSymbol(this._getInternalSymbol(), props);
        }
        return this.setSymbol(s);
    };

    Geometry.prototype.getCenter = function getCenter() {
        return this._computeCenter(this._getMeasurer());
    };

    Geometry.prototype.getExtent = function getExtent() {
        var prjExt = this._getPrjExtent();
        if (prjExt) {
            var p = this._getProjection();
            var min = p.unproject(new Coordinate(prjExt['xmin'], prjExt['ymin'])),
                max = p.unproject(new Coordinate(prjExt['xmax'], prjExt['ymax']));
            return new Extent(min, max, this._getProjection());
        } else {
            return this._computeExtent(this._getMeasurer());
        }
    };

    Geometry.prototype.getSize = function getSize() {
        var map = this.getMap();
        if (!map) {
            return null;
        }
        var pxExtent = this._getPainter().getContainerExtent();
        return pxExtent.getSize();
    };

    Geometry.prototype.containsPoint = function containsPoint(containerPoint, t) {
        if (!this.getMap()) {
            throw new Error('The geometry is required to be added on a map to perform "containsPoint".');
        }
        if (containerPoint instanceof Coordinate) {
            containerPoint = this.getMap().coordToContainerPoint(containerPoint);
        }
        return this._containsPoint(this.getMap()._containerPointToPoint(new Point(containerPoint)), t);
    };

    Geometry.prototype.show = function show() {
        this.options['visible'] = true;
        if (this.getMap()) {
            var painter = this._getPainter();
            if (painter) {
                painter.show();
            }

            this._fireEvent('show');
        }
        return this;
    };

    Geometry.prototype.hide = function hide() {
        this.options['visible'] = false;
        if (this.getMap()) {
            this.onHide();
            var painter = this._getPainter();
            if (painter) {
                painter.hide();
            }

            this._fireEvent('hide');
        }
        return this;
    };

    Geometry.prototype.isVisible = function isVisible() {
        if (!this.options['visible']) {
            return false;
        }
        var symbol = this._getInternalSymbol();
        if (!symbol) {
            return true;
        }
        if (Array.isArray(symbol)) {
            if (!symbol.length) {
                return true;
            }
            for (var i = 0, l = symbol.length; i < l; i++) {
                if (isNil(symbol[i]['opacity']) || symbol[i]['opacity'] > 0) {
                    return true;
                }
            }
            return false;
        } else {
            return isNil(symbol['opacity']) || isNumber(symbol['opacity']) && symbol['opacity'] > 0;
        }
    };

    Geometry.prototype.getZIndex = function getZIndex() {
        return this.options['zIndex'] || 0;
    };

    Geometry.prototype.setZIndex = function setZIndex(zIndex) {
        var old = this.options['zIndex'];
        this.options['zIndex'] = zIndex;

        this._fireEvent('zindexchange', {
            'old': old,
            'new': zIndex
        });

        return this;
    };

    Geometry.prototype.setZIndexSilently = function setZIndexSilently(zIndex) {
        this.options['zIndex'] = zIndex;
        return this;
    };

    Geometry.prototype.bringToFront = function bringToFront() {
        var layer = this.getLayer();
        if (!layer || !layer.getGeoMaxZIndex) {
            return this;
        }
        var topZ = layer.getGeoMaxZIndex();
        this.setZIndex(topZ + 1);
        return this;
    };

    Geometry.prototype.bringToBack = function bringToBack() {
        var layer = this.getLayer();
        if (!layer || !layer.getGeoMinZIndex) {
            return this;
        }
        var bottomZ = layer.getGeoMinZIndex();
        this.setZIndex(bottomZ - 1);
        return this;
    };

    Geometry.prototype.translate = function translate(x, y) {
        if (isNil(x)) {
            return this;
        }
        var offset = new Coordinate(x, y);
        if (offset.x === 0 && offset.y === 0) {
            return this;
        }
        var coordinates = this.getCoordinates();
        if (coordinates) {
            if (Array.isArray(coordinates)) {
                var translated = mapArrayRecursively(coordinates, function (coord) {
                    return coord.add(offset);
                });
                this.setCoordinates(translated);
            } else {
                this.setCoordinates(coordinates.add(offset));
            }
        }
        return this;
    };

    Geometry.prototype.flash = function flash$$1(interval, count, cb, context) {
        return flash.call(this, interval, count, cb, context);
    };

    Geometry.prototype.copy = function copy() {
        var json = this.toJSON();
        var ret = Geometry.fromJSON(json);

        ret.options['visible'] = true;
        return ret;
    };

    Geometry.prototype.remove = function remove() {
        var layer = this.getLayer();
        if (!layer) {
            return this;
        }

        this._fireEvent('removestart');

        this._unbind();

        this._fireEvent('removeend');

        this._fireEvent('remove');
        return this;
    };

    Geometry.prototype.toGeoJSONGeometry = function toGeoJSONGeometry() {
        var gJson = this._exportGeoJSONGeometry();
        return gJson;
    };

    Geometry.prototype.toGeoJSON = function toGeoJSON(opts) {
        if (!opts) {
            opts = {};
        }
        var feature = {
            'type': 'Feature',
            'geometry': null
        };
        if (isNil(opts['geometry']) || opts['geometry']) {
            var geoJSON = this._exportGeoJSONGeometry();
            feature['geometry'] = geoJSON;
        }
        var id = this.getId();
        if (!isNil(id)) {
            feature['id'] = id;
        }
        var properties = void 0;
        if (isNil(opts['properties']) || opts['properties']) {
            properties = this._exportProperties();
        }
        feature['properties'] = properties;
        return feature;
    };

    Geometry.prototype.toJSON = function toJSON(options) {
        if (!options) {
            options = {};
        }
        var json = this._toJSON(options);
        var other = this._exportGraphicOptions(options);
        extend(json, other);
        return json;
    };

    Geometry.prototype.getLength = function getLength() {
        return this._computeGeodesicLength(this._getMeasurer());
    };

    Geometry.prototype.getArea = function getArea() {
        return this._computeGeodesicArea(this._getMeasurer());
    };

    Geometry.prototype._getConnectPoints = function _getConnectPoints() {
        return [this.getCenter()];
    };

    Geometry.prototype._initOptions = function _initOptions(options) {
        var opts = extend({}, options);
        var symbol = opts['symbol'];
        var properties = opts['properties'];
        var id = opts['id'];
        delete opts['symbol'];
        delete opts['id'];
        delete opts['properties'];
        this.setOptions(opts);
        if (symbol) {
            this.setSymbol(symbol);
        }
        if (properties) {
            this.setProperties(properties);
        }
        if (!isNil(id)) {
            this.setId(id);
        }
    };

    Geometry.prototype._bindLayer = function _bindLayer(layer) {
        if (this.getLayer()) {
            throw new Error('Geometry cannot be added to two or more layers at the same time.');
        }
        this._layer = layer;
        this._clearCache();
        this._clearProjection();
    };

    Geometry.prototype._prepareSymbol = function _prepareSymbol(symbol) {
        if (Array.isArray(symbol)) {
            var cookedSymbols = [];
            for (var i = 0; i < symbol.length; i++) {
                cookedSymbols.push(convertResourceUrl(this._checkAndCopySymbol(symbol[i])));
            }
            return cookedSymbols;
        } else if (symbol) {
            symbol = this._checkAndCopySymbol(symbol);
            return convertResourceUrl(symbol);
        }
        return null;
    };

    Geometry.prototype._checkAndCopySymbol = function _checkAndCopySymbol(symbol) {
        var s = {};
        var numericalProperties = Symbolizer.numericalProperties;
        for (var i in symbol) {
            if (numericalProperties[i] && isString(symbol[i])) {
                s[i] = +symbol[i];
            } else {
                s[i] = symbol[i];
            }
        }
        return s;
    };

    Geometry.prototype._getSymbol = function _getSymbol() {
        return this._symbol;
    };

    Geometry.prototype._setExternSymbol = function _setExternSymbol(symbol) {
        this._externSymbol = this._prepareSymbol(symbol);
        this.onSymbolChanged();
        return this;
    };

    Geometry.prototype._getInternalSymbol = function _getInternalSymbol() {
        if (this._symbol) {
            return this._symbol;
        } else if (this._externSymbol) {
            return this._externSymbol;
        } else if (this.options['symbol']) {
            return this.options['symbol'];
        }
        return null;
    };

    Geometry.prototype._getPrjExtent = function _getPrjExtent() {
        var p = this._getProjection();
        this._verifyProjection();
        if (!this._extent && p) {
            this._extent = this._computePrjExtent(p);
        }
        return this._extent;
    };

    Geometry.prototype._unbind = function _unbind() {
        var layer = this.getLayer();
        if (!layer) {
            return;
        }

        if (this._animPlayer) {
            this._animPlayer.finish();
        }

        this._unbindMenu();

        this._unbindInfoWindow();

        if (this.isEditing()) {
            this.endEdit();
        }
        this._removePainter();
        if (this.onRemove) {
            this.onRemove();
        }
        if (layer.onRemoveGeometry) {
            layer.onRemoveGeometry(this);
        }
        delete this._layer;
        delete this._internalId;
        delete this._extent;
    };

    Geometry.prototype._getInternalId = function _getInternalId() {
        return this._internalId;
    };

    Geometry.prototype._setInternalId = function _setInternalId(id) {
        this._internalId = id;
    };

    Geometry.prototype._getMeasurer = function _getMeasurer() {
        if (this._getProjection()) {
            return this._getProjection();
        }
        return SpatialReference.getProjectionInstance(this.options['defaultProjection']);
    };

    Geometry.prototype._getProjection = function _getProjection() {
        var map = this.getMap();
        if (map) {
            return map.getProjection();
        }
        return null;
    };

    Geometry.prototype._verifyProjection = function _verifyProjection() {
        var projection = this._getProjection();
        if (this._projCode && (!projection || this._projCode !== projection.code)) {
            this._clearProjection();
        }
        this._projCode = projection ? projection.code : null;
    };

    Geometry.prototype._getExternalResources = function _getExternalResources() {
        var symbol = this._getInternalSymbol();
        return getExternalResources(symbol);
    };

    Geometry.prototype._getPainter = function _getPainter() {
        if (!this._painter && this.getMap()) {
            if (GEOMETRY_COLLECTION_TYPES.indexOf(this.type) !== -1) {
                this._painter = new CollectionPainter(this);
            } else {
                this._painter = new Painter(this);
            }
        }
        return this._painter;
    };

    Geometry.prototype._removePainter = function _removePainter() {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
    };

    Geometry.prototype._paint = function _paint(extent) {
        if (this._painter) {
            this._painter.paint(extent);
        }
    };

    Geometry.prototype._clearCache = function _clearCache() {
        delete this._extent;
    };

    Geometry.prototype._clearProjection = function _clearProjection() {
        delete this._extent;
    };

    Geometry.prototype._repaint = function _repaint() {
        if (this._painter) {
            this._painter.repaint();
        }
    };

    Geometry.prototype.onHide = function onHide() {
        this.closeMenu();
        this.closeInfoWindow();
    };

    Geometry.prototype.onShapeChanged = function onShapeChanged() {
        this._clearCache();
        this._repaint();

        this._fireEvent('shapechange');
    };

    Geometry.prototype.onPositionChanged = function onPositionChanged() {
        this._clearCache();
        this._repaint();

        this._fireEvent('positionchange');
    };

    Geometry.prototype.onSymbolChanged = function onSymbolChanged() {
        if (this._painter) {
            this._painter.refreshSymbol();
        }

        this._fireEvent('symbolchange');
    };

    Geometry.prototype.onConfig = function onConfig(conf) {
        var needRepaint = false;
        for (var p in conf) {
            if (conf.hasOwnProperty(p)) {
                var prefix = p.slice(0, 5);
                if (prefix === 'arrow' || prefix === 'shado') {
                    needRepaint = true;
                    break;
                }
            }
        }
        if (needRepaint) {
            this._repaint();
        }
    };

    Geometry.prototype._setParent = function _setParent(geometry) {
        if (geometry) {
            this._parent = geometry;
        }
    };

    Geometry.prototype._getParent = function _getParent() {
        return this._parent;
    };

    Geometry.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (this.getLayer() && this.getLayer()._onGeometryEvent) {
            if (!param) {
                param = {};
            }
            param['type'] = eventName;
            param['target'] = this;
            this.getLayer()._onGeometryEvent(param);
        }
        this.fire(eventName, param);
    };

    Geometry.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options)
        };
    };

    Geometry.prototype._exportGraphicOptions = function _exportGraphicOptions(options) {
        var json = {};
        if (isNil(options['options']) || options['options']) {
            json['options'] = this.config();
        }
        if (isNil(options['symbol']) || options['symbol']) {
            json['symbol'] = this.getSymbol();
        }
        if (isNil(options['infoWindow']) || options['infoWindow']) {
            if (this._infoWinOptions) {
                json['infoWindow'] = this._infoWinOptions;
            }
        }
        return json;
    };

    Geometry.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var points = this.getCoordinates();
        var coordinates = Coordinate.toNumberArrays(points);
        return {
            'type': this.getType(),
            'coordinates': coordinates
        };
    };

    Geometry.prototype._exportProperties = function _exportProperties() {
        var properties = null;
        var geoProperties = this.getProperties();
        if (!isNil(geoProperties)) {
            if (isObject(geoProperties)) {
                properties = extend({}, geoProperties);
            } else {
                properties = geoProperties;
            }
        }
        return properties;
    };

    return Geometry;
}(JSONAble(Eventable(Handlerable(Class))));

Geometry.mergeOptions(options$2);

var EVENTS = 'mousedown ' + 'mouseup ' + 'mousemove ' + 'click ' + 'dblclick ' + 'contextmenu ' + 'touchstart ' + 'touchmove ' + 'touchend';

var MapGeometryEventsHandler = function (_Handler) {
    inherits(MapGeometryEventsHandler, _Handler);

    function MapGeometryEventsHandler() {
        classCallCheck(this, MapGeometryEventsHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapGeometryEventsHandler.prototype.addHooks = function addHooks() {
        var map = this.target;
        var dom = map._panels.allLayers || map._containerDOM;
        on(dom, EVENTS, this._identifyGeometryEvents, this);
    };

    MapGeometryEventsHandler.prototype.removeHooks = function removeHooks() {
        var map = this.target;
        var dom = map._panels.allLayers || map._containerDOM;
        off(dom, EVENTS, this._identifyGeometryEvents, this);
    };

    MapGeometryEventsHandler.prototype._identifyGeometryEvents = function _identifyGeometryEvents(domEvent, type) {
        var map = this.target;
        if (map.isInteracting() || map._ignoreEvent(domEvent)) {
            return;
        }
        var layers = map._getLayers(function (layer) {
            if (layer.identify && layer.options['geometryEvents']) {
                return true;
            }
            return false;
        });
        if (!layers.length) {
            return;
        }
        var oneMoreEvent = null;
        var eventType = type || domEvent.type;

        if (eventType === 'mousedown' || eventType === 'touchstart' && domEvent.touches.length === 1) {
            this._mouseDownTime = now();
        } else if ((eventType === 'click' || eventType === 'touchend') && this._mouseDownTime) {
            var downTime = this._mouseDownTime;
            delete this._mouseDownTime;
            var time = now();
            if (time - downTime > 300) {
                if (eventType === 'click') {
                    return;
                }
            } else if (eventType === 'touchend') {
                oneMoreEvent = 'click';
            }
        }

        var actual = domEvent.touches && domEvent.touches.length > 0 ? domEvent.touches[0] : domEvent.changedTouches && domEvent.changedTouches.length > 0 ? domEvent.changedTouches[0] : domEvent;
        if (!actual) {
            return;
        }
        var containerPoint = getEventContainerPoint(actual, map._containerDOM),
            coordinate = map.containerPointToCoordinate(containerPoint);
        if (eventType === 'touchstart') {
            preventDefault(domEvent);
        }
        var geometryCursorStyle = null;
        var identifyOptions = {
            'includeInternals': true,

            'filter': function filter(geometry) {
                if (!(geometry instanceof Geometry)) {
                    return false;
                }
                var eventToFire = geometry._getEventTypeToFire(domEvent);
                if (eventType === 'mousemove') {
                    if (!geometryCursorStyle && geometry.options['cursor']) {
                        geometryCursorStyle = geometry.options['cursor'];
                    }
                    if (!geometry.listens('mousemove') && !geometry.listens('mouseover') && !geometry.listens('mouseenter')) {
                        return false;
                    }
                } else if (!geometry.listens(eventToFire) && !geometry.listens(oneMoreEvent)) {
                    return false;
                }

                return true;
            },
            'count': 1,
            'coordinate': coordinate,
            'onlyVisible': map.options['onlyVisibleGeometryEvents'],
            'layers': layers
        };
        var callback = fireGeometryEvent.bind(this);

        if (this._queryIdentifyTimeout) {
            cancelAnimFrame(this._queryIdentifyTimeout);
        }
        if (eventType === 'mousemove' || eventType === 'touchmove') {
            this._queryIdentifyTimeout = requestAnimFrame(function () {
                if (map.isInteracting()) {
                    return;
                }
                map.identify(identifyOptions, callback);
            });
        } else {
            map.identify(identifyOptions, callback);
        }

        function fireGeometryEvent(geometries) {
            var propagation = true;
            if (eventType === 'mousemove') {
                var geoMap = {};
                if (geometries.length > 0) {
                    for (var i = geometries.length - 1; i >= 0; i--) {
                        var geo = geometries[i];
                        if (!(geo instanceof Geometry)) {
                            continue;
                        }
                        var iid = geo._getInternalId();
                        geoMap[iid] = geo;
                        geo._onEvent(domEvent);
                        if (!this._prevOverGeos || !this._prevOverGeos.geomap[iid]) {
                            geo._onEvent(domEvent, 'mouseenter');
                        }
                        propagation = geo._onEvent(domEvent, 'mouseover');
                    }
                }

                map._setPriorityCursor(geometryCursorStyle);

                var oldTargets = this._prevOverGeos && this._prevOverGeos.geos;
                this._prevOverGeos = {
                    'geos': geometries,
                    'geomap': geoMap
                };
                if (oldTargets && oldTargets.length > 0) {
                    for (var _i = oldTargets.length - 1; _i >= 0; _i--) {
                        var oldTarget = oldTargets[_i];
                        if (!(oldTarget instanceof Geometry)) {
                            continue;
                        }
                        var oldTargetId = oldTargets[_i]._getInternalId();

                        if (!geoMap[oldTargetId]) {
                            propagation = oldTarget._onEvent(domEvent, 'mouseout');
                        }
                    }
                }
            } else {
                if (!geometries || !geometries.length) {
                    return;
                }
                for (var _i2 = geometries.length - 1; _i2 >= 0; _i2--) {
                    if (!(geometries[_i2] instanceof Geometry)) {
                        continue;
                    }
                    propagation = geometries[_i2]._onEvent(domEvent);
                    if (oneMoreEvent) {
                        geometries[_i2]._onEvent(domEvent, oneMoreEvent);
                    }
                    break;
                }
            }
            if (propagation === false) {
                stopPropagation(domEvent);
            }
        }
    };

    return MapGeometryEventsHandler;
}(Handler$1);

Map.mergeOptions({
    'geometryEvents': true,
    'onlyVisibleGeometryEvents': true
});

Map.addOnLoadHook('addHandler', 'geometryEvents', MapGeometryEventsHandler);

var MapScrollWheelZoomHandler = function (_Handler) {
    inherits(MapScrollWheelZoomHandler, _Handler);

    function MapScrollWheelZoomHandler() {
        classCallCheck(this, MapScrollWheelZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapScrollWheelZoomHandler.prototype.addHooks = function addHooks() {
        addDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll, this);
    };

    MapScrollWheelZoomHandler.prototype.removeHooks = function removeHooks() {
        removeDomEvent(this.target._containerDOM, 'mousewheel', this._onWheelScroll);
    };

    MapScrollWheelZoomHandler.prototype._onWheelScroll = function _onWheelScroll(evt) {
        var _this2 = this;

        var map = this.target;
        if (map._ignoreEvent(evt)) {
            return false;
        }
        preventDefault(evt);
        stopPropagation(evt);
        if (this._zooming) {
            this._requesting++;
            return false;
        }
        this._requesting = 0;
        var container = map._containerDOM;
        var levelValue = (evt.wheelDelta ? evt.wheelDelta : evt.detail) > 0 ? 1 : -1;
        if (evt.detail) {
            levelValue *= -1;
        }
        var zoom = map.getZoom();
        var nextZoom = zoom + levelValue;
        nextZoom = map._checkZoom(levelValue > 0 ? Math.ceil(nextZoom) : Math.floor(nextZoom));
        if (nextZoom === zoom) {
            return false;
        }
        this._zooming = true;
        var origin = map._checkZoomOrigin(getEventContainerPoint(evt, container));
        if (!map.isZooming()) {
            map.onZoomStart(null, origin);
            this._origin = origin;
            this._delta = levelValue;
            this._startZoom = map.getZoom();
        }
        var duration = 120;
        map.animateTo({
            'zoom': nextZoom - this._delta * 1 / 2,
            'around': this._origin
        }, {
            'easing': 'linear',
            'duration': duration,
            'wheelZoom': true
        }, function (frame) {
            if (frame.state.playState !== 'finished') {
                return;
            }
            if (_this2._requesting < 2 || Math.abs(nextZoom - _this2._startZoom) > 3 || nextZoom === map.getMaxZoom() || nextZoom === map.getMinZoom()) {

                map.animateTo({
                    'zoom': nextZoom,
                    'around': _this2._origin
                }, {
                    'duration': 1000 / 60 * 10
                }, function (frame) {
                    if (frame.state.playState === 'finished') {
                        setTimeout(function () {
                            delete _this2._zooming;
                            delete _this2._requesting;
                        }, 200);
                    }
                });
                delete _this2._startZoom;
                delete _this2._origin;
                delete _this2._delta;
                _this2._requesting = 0;
            } else if (!isNil(_this2._requesting)) {
                delete _this2._zooming;
                _this2._onWheelScroll(evt);
            }
        });
        return false;
    };

    return MapScrollWheelZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'scrollWheelZoom': true
});

Map.addOnLoadHook('addHandler', 'scrollWheelZoom', MapScrollWheelZoomHandler);

var MapTouchZoomHandler = function (_Handler) {
    inherits(MapTouchZoomHandler, _Handler);

    function MapTouchZoomHandler() {
        classCallCheck(this, MapTouchZoomHandler);
        return possibleConstructorReturn(this, _Handler.apply(this, arguments));
    }

    MapTouchZoomHandler.prototype.addHooks = function addHooks() {
        addDomEvent(this.target.getContainer(), 'touchstart', this._onTouchStart, this);
    };

    MapTouchZoomHandler.prototype.removeHooks = function removeHooks() {
        removeDomEvent(this.target.getContainer(), 'touchstart', this._onTouchStart);
    };

    MapTouchZoomHandler.prototype._onTouchStart = function _onTouchStart(event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || map.isZooming()) {
            return;
        }
        var container = map.getContainer();
        var p1 = getEventContainerPoint(event.touches[0], container),
            p2 = getEventContainerPoint(event.touches[1], container);

        this._startDist = p1.distanceTo(p2);
        this._startZoom = map.getZoom();

        var size = map.getSize();
        this._Origin = new Point(size['width'] / 2, size['height'] / 2);
        addDomEvent(document, 'touchmove', this._onTouchMove, this);
        addDomEvent(document, 'touchend', this._onTouchEnd, this);
        preventDefault(event);

        map.onZoomStart(null, this._Origin);

        map._fireEvent('touchzoomstart', { 'from': this._startZoom });
    };

    MapTouchZoomHandler.prototype._onTouchMove = function _onTouchMove(event) {
        var map = this.target;
        if (!event.touches || event.touches.length !== 2 || !map.isZooming()) {
            return;
        }
        var container = map.getContainer(),
            p1 = getEventContainerPoint(event.touches[0], container),
            p2 = getEventContainerPoint(event.touches[1], container),
            scale = p1.distanceTo(p2) / this._startDist;

        this._scale = scale;
        var res = map._getResolution(this._startZoom) / scale;
        var zoom = map.getZoomFromRes(res);
        map.onZooming(zoom, this._Origin);

        map._fireEvent('touchzooming');
    };

    MapTouchZoomHandler.prototype._onTouchEnd = function _onTouchEnd() {
        var map = this.target;
        if (!map._zooming) {
            map._zooming = false;
            return;
        }
        map._zooming = false;

        off(document, 'touchmove', this._onTouchMove, this);
        off(document, 'touchend', this._onTouchEnd, this);

        var scale = this._scale;
        var res = map._getResolution(this._startZoom) / scale;
        var zoom = map.getZoomFromRes(res);

        map.onZoomEnd(zoom, this._Origin);

        map._fireEvent('touchzoomend');
    };

    return MapTouchZoomHandler;
}(Handler$1);

Map.mergeOptions({
    'touchZoom': true
});

Map.addOnLoadHook('addHandler', 'touchZoom', MapTouchZoomHandler);

var CenterMixin = function (Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class.prototype.getCoordinates = function getCoordinates() {
            return this._coordinates;
        };

        _class.prototype.setCoordinates = function setCoordinates(coordinates) {
            var center = coordinates instanceof Coordinate ? coordinates : new Coordinate(coordinates);
            if (center.equals(this._coordinates)) {
                return this;
            }
            this._coordinates = center;
            if (!this.getMap()) {
                this.onPositionChanged();
                return this;
            }
            var projection = this._getProjection();
            this._setPrjCoordinates(projection.project(this._coordinates));
            return this;
        };

        _class.prototype._getCenter2DPoint = function _getCenter2DPoint(zoom) {
            var map = this.getMap();
            if (!map) {
                return null;
            }
            var z = isNil(zoom) ? map.getZoom() : map.getGLZoom();
            var pcenter = this._getPrjCoordinates();
            if (!pcenter) {
                return null;
            }

            return map._prjToPoint(pcenter, z);
        };

        _class.prototype._getPrjCoordinates = function _getPrjCoordinates() {
            var projection = this._getProjection();
            if (!projection) {
                return null;
            }
            this._verifyProjection();
            if (!this._pcenter) {
                if (this._coordinates) {
                    this._pcenter = projection.project(this._coordinates);
                }
            }
            return this._pcenter;
        };

        _class.prototype._setPrjCoordinates = function _setPrjCoordinates(pcenter) {
            this._pcenter = pcenter;
            this.onPositionChanged();
        };

        _class.prototype._updateCache = function _updateCache() {
            this._clearCache();
            var projection = this._getProjection();
            if (this._pcenter && projection) {
                this._coordinates = projection.unproject(this._pcenter);
            }
        };

        _class.prototype._clearProjection = function _clearProjection() {
            this._pcenter = null;
            _Base.prototype._clearProjection.call(this);
        };

        _class.prototype._computeCenter = function _computeCenter() {
            return this._coordinates ? this._coordinates.copy() : null;
        };

        return _class;
    }(Base);
};

var options$4 = {
    'symbol': {
        'markerType': 'path',
        'markerPath': [{
            'path': 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M3,9 a5,5 0,1,0,0,-0.9Z',
            'fill': '#DE3333'
        }],
        'markerPathWidth': 16,
        'markerPathHeight': 23,
        'markerWidth': 24,
        'markerHeight': 34
    }
};

var Marker = function (_CenterMixin) {
    inherits(Marker, _CenterMixin);

    function Marker(coordinates, opts) {
        classCallCheck(this, Marker);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, opts));

        _this.type = 'Point';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    Marker.prototype._isVectorMarker = function _isVectorMarker() {
        var symbol = this._getInternalSymbol();
        if (Array.isArray(symbol)) {
            return false;
        }
        return VectorMarkerSymbolizer.test(symbol);
    };

    Marker.prototype._canEdit = function _canEdit() {
        var symbol = this._getInternalSymbol();
        if (Array.isArray(symbol)) {
            return false;
        }
        return VectorMarkerSymbolizer.test(symbol) || VectorPathMarkerSymbolizer.test(symbol) || ImageMarkerSymbolizer.test(symbol);
    };

    Marker.prototype._containsPoint = function _containsPoint(point, t) {
        var extent = this._getPainter().getContainerExtent();
        if (t) {
            extent = extent.expand(t);
        }
        return extent.contains(this.getMap()._pointToContainerPoint(point));
    };

    Marker.prototype._computeExtent = function _computeExtent() {
        return computeExtent.call(this, 'getCenter');
    };

    Marker.prototype._computePrjExtent = function _computePrjExtent() {
        return computeExtent.call(this, '_getPrjCoordinates');
    };

    Marker.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        return 0;
    };

    Marker.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        return 0;
    };

    Marker.prototype._getSprite = function _getSprite(resources, canvasClass) {
        if (this._getPainter()) {
            return this._getPainter().getSprite(resources, canvasClass);
        }
        return new Painter(this).getSprite(resources, canvasClass);
    };

    return Marker;
}(CenterMixin(Geometry));

Marker.mergeOptions(options$4);

Marker.registerJSONType('Marker');

function computeExtent(fn) {
    var coordinates = this[fn]();
    if (!coordinates) {
        return null;
    }
    return new Extent(coordinates, coordinates, this._getProjection());
}

var Easing = {
    in: function _in(t) {
        return Math.pow(t, 2);
    },
    out: function out(t) {
        return 1 - Easing.in(1 - t);
    },
    inAndOut: function inAndOut(t) {
        return 3 * t * t - 2 * t * t * t;
    },
    linear: function linear(t) {
        return t;
    },
    upAndDown: function upAndDown(t) {
        if (t < 0.5) {
            return Easing.inAndOut(2 * t);
        } else {
            return 1 - Easing.inAndOut(2 * (t - 0.5));
        }
    }
};

var Frame = function Frame(state, styles) {
    classCallCheck(this, Frame);

    this.state = state;
    this.styles = styles;
};

var Player = function Player(animation, options, onFrame) {
    classCallCheck(this, Player);

    this._animation = animation;
    this._options = options;
    this._onFrame = onFrame;
    this.playState = 'idle';
    this.ready = true;
    this.finished = false;
};

var Animation = {
    speed: {
        'slow': 2000,
        'normal': 1000,
        'fast': 500
    },

    _resolveStyles: function _resolveStyles(styles) {
        if (!styles) {
            return null;
        }

        function resolveChild(child) {
            if (!Array.isArray(child)) {
                return Animation._resolveStyles(child);
            }
            var start = [],
                d = [],
                dest = [];
            for (var i = 0; i < child.length; i++) {
                var _styles = Animation._resolveStyles(child[i]);
                if (_styles) {
                    start.push(_styles[0]);
                    d.push(_styles[1]);
                    dest.push(_styles[2]);
                }
            }
            if (!start.length) {
                return null;
            } else {
                return [start, d, dest];
            }
        }

        function resolveVal(val) {
            var values = val;
            var clazz = void 0;

            if (!Array.isArray(val)) {
                if (isNumber(val)) {
                    values = [0, val];
                } else if (val instanceof Point || val instanceof Coordinate) {
                    clazz = val.constructor;
                    values = [new clazz(0, 0), val];
                } else {
                    values = [val, val];
                }
            }

            var v1 = values[0],
                v2 = values[1];
            if (isNumber(v1) && isNumber(v2)) {
                if (v1 === v2) {
                    return null;
                }
                return [v1, v2 - v1, v2];
            } else if (Array.isArray(v1) || v1 instanceof Coordinate || v1 instanceof Point) {
                if (Array.isArray(v1)) {
                    v1 = new Coordinate(v1);
                    v2 = new Coordinate(v2);
                } else {
                    clazz = v1.constructor;
                    v1 = new clazz(v1);
                    v2 = new clazz(v2);
                }
                if (v1.equals(v2)) {
                    return null;
                }
                return [v1, v2.sub(v1), v2];
            } else {
                return [v1, 0, v2];
            }
        }

        function isChild(val) {
            if (!Array.isArray(val) && val.constructor === Object) {
                return true;
            } else if (Array.isArray(val) && val[0].constructor === Object) {
                return true;
            }
            return false;
        }

        var d = {},
            start = {},
            dest = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var values = styles[p];

                if (!values) {
                    continue;
                } else if (Array.isArray(values)) {
                    if (isNil(values[0]) || isNil(values[1])) {
                        continue;
                    }
                }
                var childStyles = void 0;
                if (isChild(values)) {
                    childStyles = resolveChild(values);
                } else {
                    childStyles = resolveVal(values);
                }
                if (childStyles) {
                    start[p] = childStyles[0];
                    d[p] = childStyles[1];
                    dest[p] = childStyles[2];
                }
            }
        }
        return [start, d, dest];
    },
    framing: function framing(styles, options) {
        if (!options) {
            options = {};
        }
        var easing = options['easing'] ? Easing[options['easing']] : Easing.linear;
        if (!easing) {
            easing = Easing.linear;
        }
        var dStyles = void 0,
            startStyles = void 0,
            destStyles = void 0;
        styles = Animation._resolveStyles(styles);
        if (styles) {
            startStyles = styles[0];
            dStyles = styles[1];
            destStyles = styles[2];
        }
        var deltaStyles = function deltaStyles(delta, _startStyles, _dStyles) {
            if (!_startStyles || !_dStyles) {
                return null;
            }
            var result = {};
            for (var p in _dStyles) {
                if (_dStyles.hasOwnProperty(p)) {
                    if (_startStyles[p] === destStyles[p]) {
                        result[p] = _startStyles[p];
                        continue;
                    }
                    var s = _startStyles[p],
                        d = _dStyles[p];
                    if (isNumber(d)) {
                        result[p] = s + delta * d;
                    } else if (Array.isArray(d)) {
                        var children = [];
                        for (var i = 0; i < d.length; i++) {
                            children.push(deltaStyles(delta, s[i], d[i]));
                        }
                        result[p] = children;
                    } else {
                        var clazz = d.constructor;
                        if (clazz === Object) {
                            result[p] = deltaStyles(delta, s, d);
                        } else if (s instanceof Point || s instanceof Coordinate) {
                            result[p] = s.add(d.multi(delta));
                        }
                    }
                }
            }
            return result;
        };
        return function (elapsed, duration) {
            var state = void 0,
                d = void 0;
            if (elapsed < 0) {
                state = {
                    'playState': 'idle',
                    'delta': 0
                };
                d = startStyles;
            } else if (elapsed < duration) {
                var delta = easing(elapsed / duration);
                state = {
                    'playState': 'running',
                    'delta': delta
                };
                d = deltaStyles(delta, startStyles, dStyles);
            } else {
                state = {
                    'playState': 'finished',
                    'delta': 1
                };
                d = destStyles;
            }
            state['startStyles'] = startStyles;
            state['destStyles'] = destStyles;
            state['progress'] = elapsed;
            state['remainingMs'] = duration - elapsed;
            return new Frame(state, d);
        };
    },
    _requestAnimFrame: function _requestAnimFrame(fn) {
        if (!this._frameQueue) {
            this._frameQueue = [];
        }
        this._frameQueue.push(fn);
        this._a();
    },
    _a: function _a() {
        if (!this._animationFrameId) {
            this._animationFrameId = requestAnimFrame(Animation._frameFn);
        }
    },
    _run: function _run() {
        if (this._frameQueue.length) {
            var running = this._frameQueue;
            this._frameQueue = [];
            for (var i = 0, len = running.length; i < len; i++) {
                running[i]();
            }
            if (this._frameQueue.length) {
                this._animationFrameId = requestAnimFrame(Animation._frameFn);
            } else {
                delete this._animationFrameId;
            }
        }
    },
    animate: function animate(styles, options, step) {
        if (!options) {
            options = {};
        }
        var animation = Animation.framing(styles, options);
        return new Player(animation, options, step);
    }
};

Animation._frameFn = Animation._run.bind(Animation);

extend(Player.prototype, {
    _prepare: function _prepare() {
        var options = this._options;
        var duration = options['speed'] || options['duration'];
        if (isString(duration)) {
            duration = Animation.speed[duration];
            if (!duration) {
                duration = +duration;
            }
        }
        if (!duration) {
            duration = Animation.speed['normal'];
        }
        this.duration = duration;
        this._framer = options['framer'] || Animation._requestAnimFrame.bind(Animation);
    },
    play: function play() {
        if (this.playState !== 'idle' && this.playState !== 'paused') {
            return this;
        }
        if (this.playState === 'idle') {
            this.currentTime = 0;
            this._prepare();
        }
        var t = now();
        if (!this.startTime) {
            var options = this._options;
            this.startTime = options['startTime'] ? options['startTime'] : t;
        }
        this._playStartTime = Math.max(t, this.startTime);
        if (this.playState === 'paused') {
            this._playStartTime -= this.currentTime;
        }
        this.playState = 'running';
        this._run();
        return this;
    },
    pause: function pause() {
        this.playState = 'paused';

        return this;
    },
    cancel: function cancel() {
        this.playState = 'idle';
        this.finished = false;
        return this;
    },
    finish: function finish() {
        this.playState = 'finished';
        this.finished = true;
        return this;
    },
    reverse: function reverse() {},
    _run: function _run() {
        var _this = this;

        var onFrame = this._onFrame;
        var t = now();
        var elapsed = t - this._playStartTime;
        if (this._options['repeat'] && elapsed >= this.duration) {
            this._playStartTime = t;
            elapsed = 0;
        }
        if (this.playState === 'finished' || this.playState === 'paused' || this.playState === 'idle') {
            if (onFrame) {
                if (this.playState === 'finished') {
                    elapsed = this.duration;
                } else if (this.playState === 'idle') {
                    elapsed = 0;
                }
                var _frame = this._animation(elapsed, this.duration);
                _frame.state.playState = this.playState;
                onFrame(_frame);
            }
            return;
        }

        var frame = this._animation(elapsed, this.duration);
        this.playState = frame.state['playState'];

        if (this.playState === 'idle') {
            if (this.startTime > t) {
                setTimeout(this._run.bind(this), this.startTime - t);
            }
        } else if (this.playState === 'running') {
            this._framer(function () {
                if (_this.playState !== 'running') {
                    _this._run();
                    return;
                }
                _this.currentTime = elapsed;
                if (onFrame) {
                    onFrame(frame);
                }
                _this._run();
            });
        } else if (this.playState === 'finished') {
            this.finished = true;

            if (onFrame) {
                onFrame(frame);
            }
        }
    }
});



var Animation$1 = Object.freeze({
	Animation: Animation,
	Easing: Easing,
	Player: Player,
	Frame: Frame
});

var simplify = createCommonjsModule(function (module) {

    (function () {
        'use strict';

        function getSqDist(p1, p2) {

            var dx = p1.x - p2.x,
                dy = p1.y - p2.y;

            return dx * dx + dy * dy;
        }

        function getSqSegDist(p, p1, p2) {

            var x = p1.x,
                y = p1.y,
                dx = p2.x - x,
                dy = p2.y - y;

            if (dx !== 0 || dy !== 0) {

                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

                if (t > 1) {
                    x = p2.x;
                    y = p2.y;
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p.x - x;
            dy = p.y - y;

            return dx * dx + dy * dy;
        }

        function simplifyRadialDist(points, sqTolerance) {

            var prevPoint = points[0],
                newPoints = [prevPoint],
                point;

            for (var i = 1, len = points.length; i < len; i++) {
                point = points[i];

                if (getSqDist(point, prevPoint) > sqTolerance) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }

            if (prevPoint !== point) newPoints.push(point);

            return newPoints;
        }

        function simplifyDouglasPeucker(points, sqTolerance) {

            var len = points.length,
                MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
                markers = new MarkerArray(len),
                first = 0,
                last = len - 1,
                stack = [],
                newPoints = [],
                i,
                maxSqDist,
                sqDist,
                index;

            markers[first] = markers[last] = 1;

            while (last) {

                maxSqDist = 0;

                for (i = first + 1; i < last; i++) {
                    sqDist = getSqSegDist(points[i], points[first], points[last]);

                    if (sqDist > maxSqDist) {
                        index = i;
                        maxSqDist = sqDist;
                    }
                }

                if (maxSqDist > sqTolerance) {
                    markers[index] = 1;
                    stack.push(first, index, index, last);
                }

                last = stack.pop();
                first = stack.pop();
            }

            for (i = 0; i < len; i++) {
                if (markers[i]) newPoints.push(points[i]);
            }

            return newPoints;
        }

        function simplify(points, tolerance, highestQuality) {

            var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

            points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
            points = simplifyDouglasPeucker(points, sqTolerance);

            return points;
        }

        if (typeof undefined === 'function' && undefined.amd) undefined(function () {
            return simplify;
        });else module.exports = simplify;
    })();
});

var options$6 = {
    'symbol': {
        'lineColor': '#000',
        'lineWidth': 2,
        'lineOpacity': 1,

        'polygonFill': '#fff',
        'polygonOpacity': 1,
        'opacity': 1
    }
};

var Path = function (_Geometry) {
    inherits(Path, _Geometry);

    function Path() {
        classCallCheck(this, Path);
        return possibleConstructorReturn(this, _Geometry.apply(this, arguments));
    }

    Path.prototype.animateShow = function animateShow() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];

        if (this._showPlayer) {
            this._showPlayer.finish();
        }
        if (isFunction(options)) {
            options = {};
            cb = options;
        }
        var coordinates = this.getCoordinates();
        if (coordinates.length === 0) {
            return this;
        }
        this._animIdx = 0;
        this._animLenSoFar = 0;
        this.show();
        var isPolygon = !!this.getShell;
        var animCoords = isPolygon ? this.getShell().concat(this.getShell()[0]) : this.getCoordinates();
        var projection = this._getProjection();
        this._aniShowCenter = projection.unproject(this._getPrjExtent().getCenter());
        var duration = options['duration'] || 1000,
            length = this.getLength(),
            easing = options['easing'] || 'out';
        this.setCoordinates([]);
        var player = this._showPlayer = Animation.animate({
            't': duration
        }, {
            'duration': duration,
            'easing': easing
        }, function (frame) {
            if (!_this2.getMap()) {
                player.finish();
                if (cb) {
                    var _coordinates = _this2.getCoordinates();
                    cb(frame, _coordinates[_coordinates.length - 1]);
                }
                return;
            }
            var currentCoord = _this2._drawAnimShowFrame(frame.styles.t, duration, length, animCoords);
            if (frame.state.playState === 'finished') {
                delete _this2._showPlayer;
                delete _this2._aniShowCenter;
                delete _this2._animIdx;
                delete _this2._animLenSoFar;
                _this2.setCoordinates(coordinates);
            }
            if (cb) {
                cb(frame, currentCoord);
            }
        });
        player.play();
        return player;
    };

    Path.prototype._drawAnimShowFrame = function _drawAnimShowFrame(t, duration, length, coordinates) {
        if (t === 0) {
            return coordinates[0];
        }
        var map = this.getMap();
        var targetLength = t / duration * length;
        var segLen = 0;
        var i = void 0,
            l = void 0;
        for (i = this._animIdx, l = coordinates.length; i < l - 1; i++) {
            segLen = map.computeLength(coordinates[i], coordinates[i + 1]);
            if (this._animLenSoFar + segLen > targetLength) {
                break;
            }
            this._animLenSoFar += segLen;
        }
        this._animIdx = i;
        if (this._animIdx >= l - 1) {
            this.setCoordinates(coordinates);
            return coordinates[coordinates.length - 1];
        }
        var idx = this._animIdx;
        var p1 = coordinates[idx],
            p2 = coordinates[idx + 1],
            span = targetLength - this._animLenSoFar,
            r = span / segLen;
        var x = p1.x + (p2.x - p1.x) * r,
            y = p1.y + (p2.y - p1.y) * r,
            targetCoord = new Coordinate(x, y);
        var animCoords = coordinates.slice(0, this._animIdx + 1);
        animCoords.push(targetCoord);
        var isPolygon = !!this.getShell;
        if (isPolygon) {
            this.setCoordinates([this._aniShowCenter].concat(animCoords));
        } else {
            this.setCoordinates(animCoords);
        }
        return animCoords[animCoords.length - 1];
    };

    Path.prototype._getCenterInExtent = function _getCenterInExtent(extent, coordinates, clipFn) {
        var meExtent = this.getExtent();
        if (!extent.intersects(meExtent)) {
            return null;
        }
        var clipped = clipFn(coordinates, extent);
        if (clipped.length === 0) {
            return null;
        }
        var sumx = 0,
            sumy = 0,
            counter = 0;

        clipped.forEach(function (part) {
            if (Array.isArray(part)) {
                part.forEach(function (c) {
                    if (c.point) {
                        c = c.point;
                    }
                    sumx += c.x;
                    sumy += c.y;
                    counter++;
                });
            } else {
                if (part.point) {
                    part = part.point;
                }
                sumx += part.x;
                sumy += part.y;
                counter++;
            }
        });
        var c = new Coordinate(sumx, sumy)._multi(1 / counter);
        c.count = counter;
        return c;
    };

    Path.prototype._getPath2DPoints = function _getPath2DPoints(prjCoords, disableSimplify, zoom) {
        if (!isArrayHasData(prjCoords)) {
            return [];
        }
        var map = this.getMap(),
            layer = this.getLayer(),
            properties = this.getProperties(),
            hasAltitude = properties && layer.options['enableAltitude'] && !isNil(properties[layer.options['altitudeProperty']]),
            isSimplify = !disableSimplify && layer && layer.options['enableSimplify'] && !hasAltitude,
            tolerance = 2 * map._getResolution(),
            isMulti = Array.isArray(prjCoords[0]);
        delete this._simplified;
        if (isSimplify && !isMulti) {
            var count = prjCoords.length;
            prjCoords = simplify(prjCoords, tolerance, false);
            this._simplified = prjCoords.length < count;
        }
        if (isNil(zoom)) {
            zoom = map.getZoom();
        }
        return mapArrayRecursively(prjCoords, function (c) {
            return map._prjToPoint(c, zoom);
        });
    };

    Path.prototype._setPrjCoordinates = function _setPrjCoordinates(prjPoints) {
        this._prjCoords = prjPoints;
        this.onShapeChanged();
    };

    Path.prototype._getPrjCoordinates = function _getPrjCoordinates() {
        var projection = this._getProjection();
        if (!projection) {
            return null;
        }
        this._verifyProjection();
        if (!this._prjCoords) {
            this._prjCoords = this._projectCoords(this._coordinates);
        }
        return this._prjCoords;
    };

    Path.prototype._updateCache = function _updateCache() {
        this._clearCache();
        var projection = this._getProjection();
        if (!projection) {
            return;
        }
        if (this._prjCoords) {
            this._coordinates = this._unprojectCoords(this._getPrjCoordinates());
        }
    };

    Path.prototype._clearProjection = function _clearProjection() {
        this._prjCoords = null;
        _Geometry.prototype._clearProjection.call(this);
    };

    Path.prototype._projectCoords = function _projectCoords(points) {
        var projection = this._getProjection();
        if (projection) {
            return projection.projectCoords(points);
        }
        return [];
    };

    Path.prototype._unprojectCoords = function _unprojectCoords(prjPoints) {
        var projection = this._getProjection();
        if (projection) {
            return projection.unprojectCoords(prjPoints);
        }
        return [];
    };

    Path.prototype._computeCenter = function _computeCenter() {
        var ring = this._coordinates;
        if (!isArrayHasData(ring)) {
            return null;
        }
        var sumx = 0,
            sumy = 0,
            counter = 0;
        var size = ring.length;
        for (var i = 0; i < size; i++) {
            if (ring[i]) {
                if (isNumber(ring[i].x) && isNumber(ring[i].y)) {
                    sumx += ring[i].x;
                    sumy += ring[i].y;
                    counter++;
                }
            }
        }
        return new Coordinate(sumx / counter, sumy / counter);
    };

    Path.prototype._computeExtent = function _computeExtent() {
        var shell = this._coordinates;
        if (!isArrayHasData(shell)) {
            return null;
        }
        var rings = [shell];
        if (this.hasHoles && this.hasHoles()) {
            rings.push.apply(rings, this.getHoles());
        }
        return this._coords2Extent(rings, this._getProjection());
    };

    Path.prototype._computePrjExtent = function _computePrjExtent() {
        var coords = [this._getPrjCoordinates()];
        if (this.hasHoles && this.hasHoles()) {
            coords.push.apply(coords, this._getPrjHoles());
        }
        return this._coords2Extent(coords);
    };

    Path.prototype._get2DLength = function _get2DLength() {
        var vertexes = this._getPath2DPoints(this._getPrjCoordinates(), true);
        var len = 0;
        for (var i = 1, l = vertexes.length; i < l; i++) {
            len += vertexes[i].distanceTo(vertexes[i - 1]);
        }
        return len;
    };

    Path.prototype._hitTestTolerance = function _hitTestTolerance() {
        var symbol = this._getInternalSymbol();
        var w = void 0;
        if (Array.isArray(symbol)) {
            w = 0;
            for (var i = 0; i < symbol.length; i++) {
                if (isNumber(symbol[i]['lineWidth'])) {
                    if (symbol[i]['lineWidth'] > w) {
                        w = symbol[i]['lineWidth'];
                    }
                }
            }
        } else {
            w = symbol['lineWidth'];
        }
        return isNumber(w) ? w / 2 : 1.5;
    };

    Path.prototype._coords2Extent = function _coords2Extent(coords, proj) {
        var result = new Extent(proj);
        for (var i = 0, l = coords.length; i < l; i++) {
            for (var j = 0, ll = coords[i].length; j < ll; j++) {
                result._combine(coords[i][j]);
            }
        }
        return result;
    };

    return Path;
}(Geometry);

Path.mergeOptions(options$6);

var JSON_TYPE = 'Polygon';

var options$5 = {
    'clipToPaint': true
};

var Polygon = function (_Path) {
    inherits(Polygon, _Path);

    function Polygon(coordinates, opts) {
        classCallCheck(this, Polygon);

        var _this = possibleConstructorReturn(this, _Path.call(this, opts));

        _this.type = 'Polygon';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    Polygon.prototype.setCoordinates = function setCoordinates(coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._holes = null;
            this._projectRings();
            return this;
        }
        var rings = Coordinate.toCoordinates(coordinates);
        var len = rings.length;
        if (!Array.isArray(rings[0])) {
            this._coordinates = this._trimRing(rings);
        } else {
            this._coordinates = this._trimRing(rings[0]);
            if (len > 1) {
                var holes = [];
                for (var i = 1; i < len; i++) {
                    if (!rings[i]) {
                        continue;
                    }
                    holes.push(this._trimRing(rings[i]));
                }
                this._holes = holes;
            }
        }

        this._projectRings();
        return this;
    };

    Polygon.prototype.getCoordinates = function getCoordinates() {
        if (!this._coordinates) {
            return [];
        }
        var holes = this.getHoles();
        var rings = [this._copyAndCloseRing(this._coordinates)];
        for (var i = 0, l = holes.length; i < l; i++) {
            rings.push(this._copyAndCloseRing(holes[i]));
        }
        return rings;
    };

    Polygon.prototype.getCenterInExtent = function getCenterInExtent(extent) {
        return this._getCenterInExtent(extent, this.getShell(), clipPolygon);
    };

    Polygon.prototype.getShell = function getShell() {
        return this._coordinates || [];
    };

    Polygon.prototype.getHoles = function getHoles() {
        return this._holes || [];
    };

    Polygon.prototype.hasHoles = function hasHoles() {
        return this.getHoles().length > 0;
    };

    Polygon.prototype._projectRings = function _projectRings() {
        if (!this.getMap()) {
            this.onShapeChanged();
            return;
        }
        this._prjCoords = this._projectCoords(this._coordinates);
        this._prjHoles = this._projectCoords(this._holes);
        this.onShapeChanged();
    };

    Polygon.prototype._cleanRing = function _cleanRing(ring) {
        for (var i = ring.length - 1; i >= 0; i--) {
            if (!ring[i]) {
                ring.splice(i, 1);
            }
        }
    };

    Polygon.prototype._checkRing = function _checkRing(ring) {
        this._cleanRing(ring);
        if (!ring || !isArrayHasData(ring)) {
            return false;
        }
        var lastPoint = ring[ring.length - 1];
        var isClose = true;
        if (ring[0].x !== lastPoint.x || ring[0].y !== lastPoint.y) {
            isClose = false;
        }
        return isClose;
    };

    Polygon.prototype._trimRing = function _trimRing(ring) {
        var isClose = this._checkRing(ring);
        if (isArrayHasData(ring) && isClose) {
            ring.splice(ring.length - 1, 1);
        }
        return ring;
    };

    Polygon.prototype._copyAndCloseRing = function _copyAndCloseRing(ring) {
        ring = ring.slice(0);
        var isClose = this._checkRing(ring);
        if (isArrayHasData(ring) && !isClose) {
            ring.push(ring[0].copy());
            return ring;
        } else {
            return ring;
        }
    };

    Polygon.prototype._getPrjShell = function _getPrjShell() {
        if (this.getJSONType() === JSON_TYPE) {
            return this._getPrjCoordinates();
        }
        var projection = this._getProjection();
        if (!projection) {
            return null;
        }
        this._verifyProjection();
        if (!this._prjShell) {
            this._prjShell = this._projectCoords(this.getShell());
        }
        return this._prjShell;
    };

    Polygon.prototype._getPrjHoles = function _getPrjHoles() {
        var projection = this._getProjection();
        if (!projection) {
            return null;
        }
        this._verifyProjection();
        if (!this._prjHoles) {
            this._prjHoles = this._projectCoords(this.getHoles());
        }
        return this._prjHoles;
    };

    Polygon.prototype._computeGeodesicLength = function _computeGeodesicLength(measurer) {
        var rings = this.getCoordinates();
        if (!isArrayHasData(rings)) {
            return 0;
        }
        var result = 0;
        for (var i = 0, len = rings.length; i < len; i++) {
            result += measurer.measureLength(rings[i]);
        }
        return result;
    };

    Polygon.prototype._computeGeodesicArea = function _computeGeodesicArea(measurer) {
        var rings = this.getCoordinates();
        if (!isArrayHasData(rings)) {
            return 0;
        }
        var result = measurer.measureArea(rings[0]);

        for (var i = 1, len = rings.length; i < len; i++) {
            result -= measurer.measureArea(rings[i]);
        }
        return result;
    };

    Polygon.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pxExtent = this._getPainter().get2DExtent().expand(t);

        function isContains(points) {
            var c = pointInsidePolygon(point, points);
            if (c) {
                return c;
            }

            var i = void 0,
                j = void 0,
                p1 = void 0,
                p2 = void 0;
            var len = points.length;

            for (i = 0, j = len - 1; i < len; j = i++) {
                p1 = points[i];
                p2 = points[j];

                if (distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }

            return false;
        }

        if (!pxExtent.contains(point)) {
            return false;
        }

        var projection = this.getMap().getProjection();
        var shell = projection.projectCoords(this.getShell());

        var points = this._getPath2DPoints(shell),
            isSplitted = Array.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0; i < points.length; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }
    };

    Polygon.prototype._updateCache = function _updateCache() {
        _Path.prototype._updateCache.call(this);
        if (this._prjHoles) {
            this._holes = this._unprojectCoords(this._getPrjHoles());
        }
    };

    Polygon.prototype._clearCache = function _clearCache() {
        delete this._prjShell;
        return _Path.prototype._clearCache.call(this);
    };

    Polygon.prototype._clearProjection = function _clearProjection() {
        if (this._prjHoles) {
            this._prjHoles = null;
        }
        if (this._prjShell) {
            this._prjShell = null;
        }
        _Path.prototype._clearProjection.call(this);
    };

    return Polygon;
}(Path);

Polygon.registerJSONType(JSON_TYPE);

Polygon.mergeOptions(options$5);

var options$7 = {
    'arrowStyle': null,
    'arrowPlacement': 'vertex-last',
    'clipToPaint': true
};

var LineString = function (_Path) {
    inherits(LineString, _Path);

    function LineString(coordinates, options) {
        classCallCheck(this, LineString);

        var _this = possibleConstructorReturn(this, _Path.call(this, options));

        _this.type = 'LineString';
        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        return _this;
    }

    LineString.prototype.setCoordinates = function setCoordinates(coordinates) {
        if (!coordinates) {
            this._coordinates = null;
            this._setPrjCoordinates(null);
            return this;
        }
        this._coordinates = Coordinate.toCoordinates(coordinates);
        if (this.getMap()) {
            this._setPrjCoordinates(this._projectCoords(this._coordinates));
        } else {
            this.onShapeChanged();
        }
        return this;
    };

    LineString.prototype.getCoordinates = function getCoordinates() {
        return this._coordinates || [];
    };

    LineString.prototype.getCenterInExtent = function getCenterInExtent(extent) {
        return this._getCenterInExtent(extent, this.getCoordinates(), clipLine);
    };

    LineString.prototype._computeGeodesicLength = function _computeGeodesicLength(measurer) {
        return measurer.measureLength(this.getCoordinates());
    };

    LineString.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        return 0;
    };

    LineString.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance;

        function isContains(points) {
            var p1 = void 0,
                p2 = void 0;

            for (var i = 0, len = points.length; i < len - 1; i++) {
                p1 = points[i];
                p2 = points[i + 1];

                if (distanceToSegment(point, p1, p2) <= t) {
                    return true;
                }
            }
            return false;
        }

        if (t < 2) {
            t = 2;
        }

        var arrowStyle = this._getArrowStyle();
        var lineWidth = this._getInternalSymbol()['lineWidth'];
        if (!isNumber(lineWidth)) {
            lineWidth = 2;
        }
        var map = this.getMap(),
            extent = this._getPrjExtent(),
            nw = new Coordinate(extent.xmin, extent.ymax),
            se = new Coordinate(extent.xmax, extent.ymin),
            pxMin = map._prjToPoint(nw),
            pxMax = map._prjToPoint(se),
            pxExtent = new PointExtent(pxMin.x - t, pxMin.y - t, pxMax.x + t, pxMax.y + t);
        if (arrowStyle) {
            pxExtent._expand(Math.max(arrowStyle[0] * lineWidth, arrowStyle[1] * lineWidth));
        }
        if (!pxExtent.contains(point)) {
            return false;
        }

        var points = void 0;
        if (this._getArrowStyle()) {
            points = this._getPath2DPoints(this._getPrjCoordinates(), true);
            var arrows = this._getArrows(points, lineWidth, (tolerance ? tolerance : 2) + lineWidth / 2);
            for (var ii = arrows.length - 1; ii >= 0; ii--) {
                if (pointInsidePolygon(point, arrows[ii])) {
                    return true;
                }
            }
        }

        points = points || this._getPath2DPoints(this._getPrjCoordinates());
        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        if (isSplitted) {
            for (var i = 0, l = points.length; i < l; i++) {
                if (isContains(points[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return isContains(points);
        }
    };

    return LineString;
}(Path);

LineString.mergeOptions(options$7);

LineString.registerJSONType('LineString');

var options$8 = {
    'numberOfShellPoints': 60
};

var Circle = function (_CenterMixin) {
    inherits(Circle, _CenterMixin);

    Circle.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var circle = new Circle(json['coordinates'], json['radius'], json['options']);
        circle.setProperties(feature['properties']);
        return circle;
    };

    function Circle(coordinates, radius, opts) {
        classCallCheck(this, Circle);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this._radius = radius;
        return _this;
    }

    Circle.prototype.getRadius = function getRadius() {
        return this._radius;
    };

    Circle.prototype.setRadius = function setRadius(radius) {
        this._radius = radius;
        this.onShapeChanged();
        return this;
    };

    Circle.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'],
            radius = this.getRadius();
        var shell = [];
        var rad = void 0,
            dx = void 0,
            dy = void 0;
        for (var i = 0; i < numberOfPoints; i++) {
            rad = 360 * i / numberOfPoints * Math.PI / 180;
            dx = radius * Math.cos(rad);
            dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    };

    Circle.prototype.getHoles = function getHoles() {
        return [];
    };

    Circle.prototype.animateShow = function animateShow() {
        return this.show();
    };

    Circle.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var map = this.getMap();
        if (map.getPitch()) {
            return _CenterMixin.prototype._containsPoint.call(this, point, tolerance);
        }
        var center = this._getCenter2DPoint(),
            size = this.getSize(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            se = center.add(size.width / 2, size.height / 2);
        return withInEllipse(point, center, se, t);
    };

    Circle.prototype._computePrjExtent = function _computePrjExtent(projection) {
        var minmax = this._getMinMax(projection);
        if (!minmax) {
            return null;
        }
        var pcenter = this._getPrjCoordinates();
        var pminmax = minmax.map(function (c) {
            return projection.project(c);
        });
        var dx = Math.min(Math.abs(pminmax[0].x - pcenter.x), Math.abs(pminmax[1].x - pcenter.x)),
            dy = Math.min(Math.abs(pminmax[2].y - pcenter.y), Math.abs(pminmax[3].y - pcenter.y));
        return new Extent(pcenter.sub(dx, dy), pcenter.add(dx, dy));
    };

    Circle.prototype._computeExtent = function _computeExtent(measurer) {
        var minmax = this._getMinMax(measurer);
        if (!minmax) {
            return null;
        }
        return new Extent(minmax[0].x, minmax[2].y, minmax[1].x, minmax[3].y, this._getProjection());
    };

    Circle.prototype._getMinMax = function _getMinMax(measurer) {
        if (!measurer || !this._coordinates || isNil(this._radius)) {
            return null;
        }
        var radius = this._radius;
        var p1 = measurer.locate(this._coordinates, -radius, 0),
            p2 = measurer.locate(this._coordinates, radius, 0),
            p3 = measurer.locate(this._coordinates, 0, radius),
            p4 = measurer.locate(this._coordinates, 0, -radius);
        return [p1, p2, p3, p4];
    };

    Circle.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius;
    };

    Circle.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2);
    };

    Circle.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Circle.prototype._toJSON = function _toJSON(options) {
        var center = this.getCenter();
        var opts = extend({}, options);
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Circle',
            'coordinates': [center.x, center.y],
            'radius': this.getRadius()
        };
    };

    return Circle;
}(CenterMixin(Polygon));

Circle.mergeOptions(options$8);

Circle.registerJSONType('Circle');

var options$9 = {
    'numberOfShellPoints': 60
};

var Ellipse = function (_CenterMixin) {
    inherits(Ellipse, _CenterMixin);

    Ellipse.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var ellipse = new Ellipse(json['coordinates'], json['width'], json['height'], json['options']);
        ellipse.setProperties(feature['properties']);
        return ellipse;
    };

    function Ellipse(coordinates, width, height, opts) {
        classCallCheck(this, Ellipse);

        var _this = possibleConstructorReturn(this, _CenterMixin.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this.width = width;
        _this.height = height;
        return _this;
    }

    Ellipse.prototype.getWidth = function getWidth() {
        return this.width;
    };

    Ellipse.prototype.setWidth = function setWidth(width) {
        this.width = width;
        this.onShapeChanged();
        return this;
    };

    Ellipse.prototype.getHeight = function getHeight() {
        return this.height;
    };

    Ellipse.prototype.setHeight = function setHeight(height) {
        this.height = height;
        this.onShapeChanged();
        return this;
    };

    Ellipse.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'],
            width = this.getWidth(),
            height = this.getHeight();
        var shell = [];
        var s = Math.pow(width / 2, 2) * Math.pow(height / 2, 2),
            sx = Math.pow(width / 2, 2),
            sy = Math.pow(height / 2, 2);
        var deg = void 0,
            rad = void 0,
            dx = void 0,
            dy = void 0;
        for (var i = 0; i < numberOfPoints; i++) {
            deg = 360 * i / numberOfPoints;
            rad = deg * Math.PI / 180;
            dx = Math.sqrt(s / (sx * Math.pow(Math.tan(rad), 2) + sy));
            dy = Math.sqrt(s / (sy * Math.pow(1 / Math.tan(rad), 2) + sx));
            if (deg > 90 && deg < 270) {
                dx *= -1;
            }
            if (deg > 180 && deg < 360) {
                dy *= -1;
            }
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        return shell;
    };

    Ellipse.prototype.getHoles = function getHoles() {
        return [];
    };

    Ellipse.prototype.animateShow = function animateShow() {
        return this.show();
    };

    Ellipse.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var map = this.getMap();
        if (map.isTransforming()) {
            return _CenterMixin.prototype._containsPoint.call(this, point, tolerance);
        }
        var projection = map.getProjection();
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            pps = projection.projectCoords([this._coordinates, map.locate(this._coordinates, this.getWidth() / 2, this.getHeight() / 2)]),
            p0 = map._prjToPoint(pps[0]),
            p1 = map._prjToPoint(pps[1]);
        return withInEllipse(point, p0, p1, t);
    };

    Ellipse.prototype._computePrjExtent = function _computePrjExtent() {
        return Circle.prototype._computePrjExtent.apply(this, arguments);
    };

    Ellipse.prototype._computeExtent = function _computeExtent() {
        return Circle.prototype._computeExtent.apply(this, arguments);
    };

    Ellipse.prototype._getMinMax = function _getMinMax(measurer) {
        if (!measurer || !this._coordinates || isNil(this.width) || isNil(this.height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var p1 = measurer.locate(this._coordinates, -width / 2, 0),
            p2 = measurer.locate(this._coordinates, width / 2, 0),
            p3 = measurer.locate(this._coordinates, 0, -height / 2),
            p4 = measurer.locate(this._coordinates, 0, height / 2);
        return [p1, p2, p3, p4];
    };

    Ellipse.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this.width) || isNil(this.height)) {
            return 0;
        }

        var longer = this.width > this.height ? this.width : this.height;
        return 2 * Math.PI * longer / 2 - 4 * Math.abs(this.width - this.height);
    };

    Ellipse.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this.width) || isNil(this.height)) {
            return 0;
        }
        return Math.PI * this.width * this.height / 4;
    };

    Ellipse.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Ellipse.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Ellipse',
            'coordinates': [center.x, center.y],
            'width': this.getWidth(),
            'height': this.getHeight()
        };
    };

    return Ellipse;
}(CenterMixin(Polygon));

Ellipse.mergeOptions(options$9);

Ellipse.registerJSONType('Ellipse');

var Rectangle = function (_Polygon) {
    inherits(Rectangle, _Polygon);

    Rectangle.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var rect = new Rectangle(json['coordinates'], json['width'], json['height'], json['options']);
        rect.setProperties(feature['properties']);
        return rect;
    };

    function Rectangle(coordinates, width, height, opts) {
        classCallCheck(this, Rectangle);

        var _this = possibleConstructorReturn(this, _Polygon.call(this, null, opts));

        if (coordinates) {
            _this.setCoordinates(coordinates);
        }
        _this._width = width;
        _this._height = height;
        return _this;
    }

    Rectangle.prototype.getCoordinates = function getCoordinates() {
        return this._coordinates;
    };

    Rectangle.prototype.setCoordinates = function setCoordinates(nw) {
        this._coordinates = nw instanceof Coordinate ? nw : new Coordinate(nw);
        if (!this._coordinates || !this.getMap()) {
            this.onPositionChanged();
            return this;
        }
        var projection = this._getProjection();
        this._setPrjCoordinates(projection.project(this._coordinates));
        return this;
    };

    Rectangle.prototype.getWidth = function getWidth() {
        return this._width;
    };

    Rectangle.prototype.setWidth = function setWidth(width) {
        this._width = width;
        this.onShapeChanged();
        return this;
    };

    Rectangle.prototype.getHeight = function getHeight() {
        return this._height;
    };

    Rectangle.prototype.setHeight = function setHeight(height) {
        this._height = height;
        this.onShapeChanged();
        return this;
    };

    Rectangle.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer();
        var nw = this._coordinates;
        var map = this.getMap();
        var sx = 1,
            sy = -1;
        if (map) {
            var fExt = map.getFullExtent();
            if (fExt['left'] > fExt['right']) {
                sx = -1;
            }
            if (fExt['bottom'] > fExt['top']) {
                sy = 1;
            }
        }
        var points = [];
        points.push(nw);
        points.push(measurer.locate(nw, sx * this._width, 0));
        points.push(measurer.locate(nw, sx * this._width, sy * this._height));
        points.push(measurer.locate(nw, 0, sy * this._height));
        points.push(nw);
        return points;
    };

    Rectangle.prototype.getHoles = function getHoles() {
        return [];
    };

    Rectangle.prototype.animateShow = function animateShow() {
        return this.show();
    };

    Rectangle.prototype._getPrjCoordinates = function _getPrjCoordinates() {
        var projection = this._getProjection();
        if (!projection) {
            return null;
        }
        this._verifyProjection();
        if (!this._pnw) {
            if (this._coordinates) {
                this._pnw = projection.project(this._coordinates);
            }
        }
        return this._pnw;
    };

    Rectangle.prototype._setPrjCoordinates = function _setPrjCoordinates(pnw) {
        this._pnw = pnw;
        this.onPositionChanged();
    };

    Rectangle.prototype._getPrjShell = function _getPrjShell() {
        var shell = _Polygon.prototype._getPrjShell.call(this);
        var projection = this._getProjection();
        if (!projection.isSphere()) {
            return shell;
        }
        var sphereExtent = projection.getSphereExtent(),
            sx = sphereExtent.sx,
            sy = sphereExtent.sy;
        var circum = this._getProjection().getCircum();
        var nw = shell[0];
        for (var i = 1, l = shell.length; i < l; i++) {
            var p = shell[i];
            var dx = 0,
                dy = 0;
            if (sx * (nw.x - p.x) > 0) {
                dx = circum.x * sx;
            }
            if (sy * (nw.y - p.y) < 0) {
                dy = circum.y * sy;
            }
            shell[i]._add(dx, dy);
        }
        return shell;
    };

    Rectangle.prototype._updateCache = function _updateCache() {
        this._clearCache();
        var projection = this._getProjection();
        if (this._pnw && projection) {
            this._coordinates = projection.unproject(this._pnw);
        }
    };

    Rectangle.prototype._clearProjection = function _clearProjection() {
        this._pnw = null;
        _Polygon.prototype._clearProjection.call(this);
    };

    Rectangle.prototype._computeCenter = function _computeCenter(measurer) {
        return measurer.locate(this._coordinates, this._width / 2, -this._height / 2);
    };

    Rectangle.prototype._containsPoint = function _containsPoint(point, tolerance) {
        var map = this.getMap();
        if (map.isTransforming()) {
            return _Polygon.prototype._containsPoint.call(this, point, tolerance);
        }
        var t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            r = map._getResolution() * t;
        var extent = this._getPrjExtent().expand(r);
        var p = map._pointToPrj(point);
        return extent.contains(p);
    };

    Rectangle.prototype._computePrjExtent = function _computePrjExtent(projection) {
        var se = this._getSouthEast(projection);
        if (!se) {
            return null;
        }
        var prjs = projection.projectCoords([new Coordinate(this._coordinates.x, se.y), new Coordinate(se.x, this._coordinates.y)]);
        return new Extent(prjs[0], prjs[1]);
    };

    Rectangle.prototype._computeExtent = function _computeExtent(measurer) {
        var se = this._getSouthEast(measurer);
        if (!se) {
            return null;
        }
        return new Extent(this._coordinates, se, this._getProjection());
    };

    Rectangle.prototype._getSouthEast = function _getSouthEast(measurer) {
        if (!measurer || !this._coordinates || isNil(this._width) || isNil(this._height)) {
            return null;
        }
        var width = this.getWidth(),
            height = this.getHeight();
        var w = width,
            h = -height;
        if (measurer.fullExtent) {
            var fullExtent = measurer.fullExtent,
                sx = fullExtent.right > fullExtent.left ? 1 : -1,
                sy = fullExtent.top > fullExtent.bottom ? 1 : -1;
            w *= sx;
            h *= sy;
        }
        var se = measurer.locate(this._coordinates, w, h);
        return se;
    };

    Rectangle.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._width) || isNil(this._height)) {
            return 0;
        }
        return 2 * (this._width + this._height);
    };

    Rectangle.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._width) || isNil(this._height)) {
            return 0;
        }
        return this._width * this._height;
    };

    Rectangle.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var coordinates = Coordinate.toNumberArrays([this.getShell()]);
        return {
            'type': 'Polygon',
            'coordinates': coordinates
        };
    };

    Rectangle.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var nw = this.getCoordinates();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Rectangle',
            'coordinates': [nw.x, nw.y],
            'width': this.getWidth(),
            'height': this.getHeight()
        };
    };

    return Rectangle;
}(Polygon);

Rectangle.registerJSONType('Rectangle');

var Curve = function (_LineString) {
    inherits(Curve, _LineString);

    function Curve() {
        classCallCheck(this, Curve);
        return possibleConstructorReturn(this, _LineString.apply(this, arguments));
    }

    Curve.prototype._arc = function _arc(ctx, points, lineOpacity) {
        var degree = this.options['arcDegree'] * Math.PI / 180;
        for (var i = 1, l = points.length; i < l; i++) {
            Canvas._arcBetween(ctx, points[i - 1], points[i], degree);
            Canvas._stroke(ctx, lineOpacity);
        }
    };

    Curve.prototype._quadraticCurve = function _quadraticCurve(ctx, points) {
        if (points.length <= 2) {
            Canvas._path(ctx, points);
            return;
        }
        Canvas.quadraticCurve(ctx, points);
    };

    Curve.prototype._bezierCurve = function _bezierCurve(ctx, points) {
        if (points.length <= 3) {
            Canvas._path(ctx, points);
            return;
        }
        var i = void 0,
            l = void 0;
        for (i = 1, l = points.length; i + 2 < l; i += 3) {
            ctx.bezierCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, points[i + 2].x, points[i + 2].y);
        }
        if (i < l) {
            for (; i < l; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }
    };

    return Curve;
}(LineString);

var options$10 = {
    'arcDegree': 90
};

var ArcCurve = function (_Curve) {
    inherits(ArcCurve, _Curve);

    function ArcCurve() {
        classCallCheck(this, ArcCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    ArcCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'ArcCurve'
        };
    };

    ArcCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        this._arc(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
        this._paintArrow(ctx, points, lineOpacity);
    };

    ArcCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var arc = new ArcCurve(feature['geometry']['coordinates'], json['options']);
        arc.setProperties(feature['properties']);
        return arc;
    };

    return ArcCurve;
}(Curve);

ArcCurve.registerJSONType('ArcCurve');

ArcCurve.mergeOptions(options$10);

var CubicBezierCurve = function (_Curve) {
    inherits(CubicBezierCurve, _Curve);

    function CubicBezierCurve() {
        classCallCheck(this, CubicBezierCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    CubicBezierCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var curve = new CubicBezierCurve(feature['geometry']['coordinates'], json['options']);
        curve.setProperties(feature['properties']);
        return curve;
    };

    CubicBezierCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'CubicBezierCurve'
        };
    };

    CubicBezierCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        this._bezierCurve(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);
        this._paintArrow(ctx, points, lineOpacity);
    };

    return CubicBezierCurve;
}(Curve);

CubicBezierCurve.registerJSONType('CubicBezierCurve');

var QuadBezierCurve = function (_Curve) {
    inherits(QuadBezierCurve, _Curve);

    function QuadBezierCurve() {
        classCallCheck(this, QuadBezierCurve);
        return possibleConstructorReturn(this, _Curve.apply(this, arguments));
    }

    QuadBezierCurve.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var curve = new QuadBezierCurve(feature['geometry']['coordinates'], json['options']);
        curve.setProperties(feature['properties']);
        return curve;
    };

    QuadBezierCurve.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'QuadBezierCurve'
        };
    };

    QuadBezierCurve.prototype._paintOn = function _paintOn(ctx, points, lineOpacity) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        this._quadraticCurve(ctx, points, lineOpacity);
        Canvas._stroke(ctx, lineOpacity);

        this._paintArrow(ctx, points, lineOpacity);
    };

    QuadBezierCurve.prototype._getArrowPlacement = function _getArrowPlacement() {
        var placement = this.options['arrowPlacement'];

        if (placement === 'point') {
            placement = 'vertex-last';
        }
        return placement;
    };

    return QuadBezierCurve;
}(Curve);

QuadBezierCurve.registerJSONType('QuadBezierCurve');

var GeometryCollection = function (_Geometry) {
    inherits(GeometryCollection, _Geometry);

    function GeometryCollection(geometries, opts) {
        classCallCheck(this, GeometryCollection);

        var _this = possibleConstructorReturn(this, _Geometry.call(this, opts));

        _this.type = 'GeometryCollection';
        _this.setGeometries(geometries);
        return _this;
    }

    GeometryCollection.prototype.setGeometries = function setGeometries(_geometries) {
        var geometries = this._checkGeometries(_geometries || []);
        var symbol = this._getSymbol();
        var options = this.config();

        for (var i = geometries.length - 1; i >= 0; i--) {
            geometries[i]._initOptions(options);
            geometries[i]._setParent(this);
            geometries[i]._setEventParent(this);
            if (symbol) {
                geometries[i].setSymbol(symbol);
            }
        }
        this._geometries = geometries;
        if (this.getLayer()) {
            this._bindGeometriesToLayer();
            this.onShapeChanged();
        }
        return this;
    };

    GeometryCollection.prototype.getGeometries = function getGeometries() {
        return this._geometries || [];
    };

    GeometryCollection.prototype.forEach = function forEach(fn, context) {
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            if (!context) {
                fn(geometries[i], i);
            } else {
                fn.call(context, geometries[i], i);
            }
        }
        return this;
    };

    GeometryCollection.prototype.filter = function filter(fn, context) {
        if (!fn) {
            return new GeometryCollection();
        }
        var selected = [];
        var isFn = isFunction(fn);
        var filter = isFn ? fn : createFilter(fn);

        this.forEach(function (geometry) {
            var g = isFn ? geometry : getFilterFeature(geometry);
            if (context ? filter.call(context, g) : filter(g)) {
                selected.push(geometry);
            }
        }, this);

        return new GeometryCollection(selected);
    };

    GeometryCollection.prototype.translate = function translate(offset) {
        if (!offset) {
            return this;
        }
        if (this.isEmpty()) {
            return this;
        }
        var args = arguments;
        this.forEach(function (geometry) {
            if (geometry && geometry.translate) {
                geometry.translate.apply(geometry, args);
            }
        });
        return this;
    };

    GeometryCollection.prototype.isEmpty = function isEmpty() {
        return !isArrayHasData(this.getGeometries());
    };

    GeometryCollection.prototype.remove = function remove() {
        this.forEach(function (geometry) {
            geometry._unbind();
        });
        return Geometry.prototype.remove.apply(this, arguments);
    };

    GeometryCollection.prototype.show = function show() {
        this.options['visible'] = true;
        this.forEach(function (geometry) {
            geometry.show();
        });
        return this;
    };

    GeometryCollection.prototype.hide = function hide() {
        this.options['visible'] = false;
        this.forEach(function (geometry) {
            geometry.hide();
        });
        return this;
    };

    GeometryCollection.prototype.onConfig = function onConfig(config) {
        this.forEach(function (geometry) {
            geometry.config(config);
        });
    };

    GeometryCollection.prototype.getSymbol = function getSymbol() {
        var s = _Geometry.prototype.getSymbol.call(this);
        if (!s) {
            var symbols = [];
            var is = false;
            this.forEach(function (g) {
                var symbol = g.getSymbol();
                if (symbol && !is) {
                    is = true;
                }
                symbols.push(g.getSymbol());
            });
            if (is) {
                s = {
                    'children': symbols
                };
            }
        }
        return s;
    };

    GeometryCollection.prototype.setSymbol = function setSymbol(s) {
        if (s && s['children']) {
            this._symbol = null;
            this.forEach(function (g, i) {
                g.setSymbol(s['children'][i]);
            });
        } else {
            var symbol = this._prepareSymbol(s);
            this._symbol = symbol;
            this.forEach(function (g) {
                g.setSymbol(symbol);
            });
        }
        this.onSymbolChanged();
        return this;
    };

    GeometryCollection.prototype._setExternSymbol = function _setExternSymbol(symbol) {
        symbol = this._prepareSymbol(symbol);
        this._externSymbol = symbol;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(symbol);
        });
        this.onSymbolChanged();
        return this;
    };

    GeometryCollection.prototype._bindLayer = function _bindLayer() {
        _Geometry.prototype._bindLayer.apply(this, arguments);
        this._bindGeometriesToLayer();
    };

    GeometryCollection.prototype._bindGeometriesToLayer = function _bindGeometriesToLayer() {
        var layer = this.getLayer();
        this.forEach(function (geometry) {
            geometry._bindLayer(layer);
        });
    };

    GeometryCollection.prototype._checkGeometries = function _checkGeometries(geometries) {
        var invalidGeoError = 'The geometry added to collection is invalid.';
        if (geometries && !Array.isArray(geometries)) {
            if (geometries instanceof Geometry) {
                return [geometries];
            } else {
                throw new Error(invalidGeoError);
            }
        } else {
            for (var i = 0, l = geometries.length; i < l; i++) {
                if (!this._checkGeo(geometries[i])) {
                    throw new Error(invalidGeoError + ' Index: ' + i);
                }
            }
            return geometries;
        }
    };

    GeometryCollection.prototype._checkGeo = function _checkGeo(geo) {
        return geo instanceof Geometry;
    };

    GeometryCollection.prototype._updateCache = function _updateCache() {
        this._clearCache();
        if (this.isEmpty()) {
            return;
        }
        this.forEach(function (geometry) {
            if (geometry && geometry._updateCache) {
                geometry._updateCache();
            }
        });
    };

    GeometryCollection.prototype._removePainter = function _removePainter() {
        if (this._painter) {
            this._painter.remove();
        }
        delete this._painter;
        this.forEach(function (geometry) {
            geometry._removePainter();
        });
    };

    GeometryCollection.prototype._computeCenter = function _computeCenter(projection) {
        if (!projection || this.isEmpty()) {
            return null;
        }
        var sumX = 0,
            sumY = 0,
            counter = 0;
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            var center = geometries[i]._computeCenter(projection);
            if (center) {
                sumX += center.x;
                sumY += center.y;
                counter++;
            }
        }
        if (counter === 0) {
            return null;
        }
        return new Coordinate(sumX / counter, sumY / counter);
    };

    GeometryCollection.prototype._containsPoint = function _containsPoint(point, t) {
        if (this.isEmpty()) {
            return false;
        }
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (geometries[i]._containsPoint(point, t)) {
                return true;
            }
        }
        return false;
    };

    GeometryCollection.prototype._computeExtent = function _computeExtent(projection) {
        return computeExtent$1.call(this, projection, '_computeExtent');
    };

    GeometryCollection.prototype._computePrjExtent = function _computePrjExtent(projection) {
        return computeExtent$1.call(this, projection, '_computePrjExtent');
    };

    GeometryCollection.prototype._computeGeodesicLength = function _computeGeodesicLength(projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicLength(projection);
        }
        return result;
    };

    GeometryCollection.prototype._computeGeodesicArea = function _computeGeodesicArea(projection) {
        if (!projection || this.isEmpty()) {
            return 0;
        }
        var geometries = this.getGeometries();
        var result = 0;
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            result += geometries[i]._computeGeodesicArea(projection);
        }
        return result;
    };

    GeometryCollection.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var children = [];
        if (!this.isEmpty()) {
            var geometries = this.getGeometries();
            for (var i = 0, l = geometries.length; i < l; i++) {
                if (!geometries[i]) {
                    continue;
                }
                children.push(geometries[i]._exportGeoJSONGeometry());
            }
        }
        return {
            'type': 'GeometryCollection',
            'geometries': children
        };
    };

    GeometryCollection.prototype._clearProjection = function _clearProjection() {
        if (this.isEmpty()) {
            return;
        }
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            geometries[i]._clearProjection();
        }
    };

    GeometryCollection.prototype._getConnectPoints = function _getConnectPoints() {
        var extent = this.getExtent();
        var anchors = [new Coordinate(extent.xmin, extent.ymax), new Coordinate(extent.xmax, extent.ymin), new Coordinate(extent.xmin, extent.ymin), new Coordinate(extent.xmax, extent.ymax)];
        return anchors;
    };

    GeometryCollection.prototype._getExternalResources = function _getExternalResources() {
        if (this.isEmpty()) {
            return [];
        }
        var geometries = this.getGeometries(),
            resources = [];
        var cache = {};
        var symbol = void 0,
            res = void 0,
            key = void 0;
        for (var i = 0, l = geometries.length; i < l; i++) {
            if (!geometries[i]) {
                continue;
            }
            symbol = geometries[i]._getInternalSymbol();
            res = getExternalResources(symbol);
            for (var ii = 0, ll = res.length; ii < ll; ii++) {
                key = res[ii].join();
                if (!cache[key]) {
                    resources.push(res[ii]);
                    cache[key] = 1;
                }
            }
        }
        return resources;
    };

    GeometryCollection.prototype.startEdit = function startEdit(opts) {
        var _this2 = this;

        if (this.isEmpty()) {
            return this;
        }
        if (!opts) {
            opts = {};
        }
        if (opts['symbol']) {
            this._originalSymbol = this.getSymbol();
            this.setSymbol(opts['symbol']);
        }
        this._draggbleBeforeEdit = this.options['draggable'];
        this.config('draggable', false);
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            geometries[i].startEdit(opts);
        }
        this._editing = true;
        this.hide();
        setTimeout(function () {
            _this2.fire('editstart');
        }, 1);
        return this;
    };

    GeometryCollection.prototype.endEdit = function endEdit() {
        if (this.isEmpty()) {
            return this;
        }
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            geometries[i].endEdit();
        }
        if (this._originalSymbol) {
            this.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this._editing = false;
        this.show();
        this.config('draggable', this._draggbleBeforeEdit);
        this.fire('editend');
        return this;
    };

    GeometryCollection.prototype.isEditing = function isEditing() {
        if (!this._editing) {
            return false;
        }
        return true;
    };

    return GeometryCollection;
}(Geometry);

GeometryCollection.registerJSONType('GeometryCollection');

function computeExtent$1(projection, fn) {
    if (this.isEmpty()) {
        return null;
    }
    var geometries = this.getGeometries();
    var result = null;
    for (var i = 0, l = geometries.length; i < l; i++) {
        var geo = geometries[i];
        if (!geo) {
            continue;
        }
        var geoExtent = geo[fn](projection);
        if (geoExtent) {
            result = geoExtent.combine(result);
        }
    }
    return result;
}

var MultiGeometry = function (_GeometryCollection) {
    inherits(MultiGeometry, _GeometryCollection);

    function MultiGeometry(geoType, type, data, options) {
        classCallCheck(this, MultiGeometry);

        var _this = possibleConstructorReturn(this, _GeometryCollection.call(this, null, options));

        _this.GeometryType = geoType;
        _this.type = type;
        _this._initData(data);
        return _this;
    }

    MultiGeometry.prototype.getCoordinates = function getCoordinates() {
        var coordinates = [];
        var geometries = this.getGeometries();
        for (var i = 0, l = geometries.length; i < l; i++) {
            coordinates.push(geometries[i].getCoordinates());
        }
        return coordinates;
    };

    MultiGeometry.prototype.setCoordinates = function setCoordinates(coordinates) {
        coordinates = coordinates || [];
        var geometries = [];
        for (var i = 0, l = coordinates.length; i < l; i++) {
            var g = new this.GeometryType(coordinates[i], this.config());
            geometries.push(g);
        }
        this.setGeometries(geometries);
        return this;
    };

    MultiGeometry.prototype._initData = function _initData(data) {
        data = data || [];
        if (data.length) {
            if (data[0] instanceof this.GeometryType) {
                this.setGeometries(data);
            } else {
                this.setCoordinates(data);
            }
        }
    };

    MultiGeometry.prototype._checkGeo = function _checkGeo(geo) {
        return geo instanceof this.GeometryType;
    };

    MultiGeometry.prototype._exportGeoJSONGeometry = function _exportGeoJSONGeometry() {
        var points = this.getCoordinates();
        var coordinates = Coordinate.toNumberArrays(points);
        return {
            'type': this.getType(),
            'coordinates': coordinates
        };
    };

    return MultiGeometry;
}(GeometryCollection);

var MultiPoint = function (_MultiGeometry) {
  inherits(MultiPoint, _MultiGeometry);

  function MultiPoint(data, opts) {
    classCallCheck(this, MultiPoint);
    return possibleConstructorReturn(this, _MultiGeometry.call(this, Marker, 'MultiPoint', data, opts));
  }

  return MultiPoint;
}(MultiGeometry);

MultiPoint.registerJSONType('MultiPoint');

var MultiPath = function (_MultiGeometry) {
    inherits(MultiPath, _MultiGeometry);

    function MultiPath() {
        classCallCheck(this, MultiPath);
        return possibleConstructorReturn(this, _MultiGeometry.apply(this, arguments));
    }

    MultiPath.prototype.getCenterInExtent = function getCenterInExtent(extent) {
        var children = this.getGeometries();
        var sumx = 0,
            sumy = 0,
            counter = 0;

        children.forEach(function (l) {
            var c = l.getCenterInExtent(extent);
            if (c) {
                sumx += c.x * c.count;
                sumy += c.y * c.count;
                counter += c.count;
            }
        });
        if (counter === 0) {
            return null;
        }
        return new Coordinate(sumx, sumy)._multi(1 / counter);
    };

    return MultiPath;
}(MultiGeometry);

var MultiLineString = function (_MultiPath) {
  inherits(MultiLineString, _MultiPath);

  function MultiLineString(data, options) {
    classCallCheck(this, MultiLineString);
    return possibleConstructorReturn(this, _MultiPath.call(this, LineString, 'MultiLineString', data, options));
  }

  return MultiLineString;
}(MultiPath);

MultiLineString.registerJSONType('MultiLineString');

var MultiPolygon = function (_MultiPath) {
  inherits(MultiPolygon, _MultiPath);

  function MultiPolygon(data, opts) {
    classCallCheck(this, MultiPolygon);
    return possibleConstructorReturn(this, _MultiPath.call(this, Polygon, 'MultiPolygon', data, opts));
  }

  return MultiPolygon;
}(MultiPath);

MultiPolygon.registerJSONType('MultiPolygon');

var types$1 = {
    'Marker': Marker,
    'LineString': LineString,
    'Polygon': Polygon,
    'MultiPoint': MultiPoint,
    'MultiLineString': MultiLineString,
    'MultiPolygon': MultiPolygon
};

var GeoJSON = {
    toGeometry: function toGeometry(geoJSON) {
        if (isString(geoJSON)) {
            geoJSON = parseJSON(geoJSON);
        }
        if (Array.isArray(geoJSON)) {
            var resultGeos = [];
            for (var i = 0, len = geoJSON.length; i < len; i++) {
                var geo = GeoJSON._convert(geoJSON[i]);
                if (Array.isArray(geo)) {
                    pushIn(resultGeos, geo);
                } else {
                    resultGeos.push(geo);
                }
            }
            return resultGeos;
        } else {
            var resultGeo = GeoJSON._convert(geoJSON);
            return resultGeo;
        }
    },

    _convert: function _convert(json) {
        if (!json || isNil(json['type'])) {
            return null;
        }

        var type = json['type'];
        if (type === 'Feature') {
            var g = json['geometry'];
            var geometry = GeoJSON._convert(g);
            if (!geometry) {
                return null;
            }
            geometry.setId(json['id']);
            geometry.setProperties(json['properties']);
            return geometry;
        } else if (type === 'FeatureCollection') {
            var features = json['features'];
            if (!features) {
                return null;
            }
            var result = GeoJSON.toGeometry(features);
            return result;
        } else if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].indexOf(type) >= 0) {
            var clazz = type === 'Point' ? 'Marker' : type;
            return new types$1[clazz](json['coordinates']);
        } else if (type === 'GeometryCollection') {
            var geometries = json['geometries'];
            if (!isArrayHasData(geometries)) {
                return new GeometryCollection();
            }
            var mGeos = [];
            var size = geometries.length;
            for (var i = 0; i < size; i++) {
                mGeos.push(GeoJSON._convert(geometries[i]));
            }
            return new GeometryCollection(mGeos);
        }
        return null;
    }
};

var options$13 = {
    'numberOfShellPoints': 60
};

var Sector = function (_Circle) {
    inherits(Sector, _Circle);

    Sector.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var sector = new Sector(json['coordinates'], json['radius'], json['startAngle'], json['endAngle'], json['options']);
        sector.setProperties(feature['properties']);
        return sector;
    };

    function Sector(coordinates, radius, startAngle, endAngle, opts) {
        classCallCheck(this, Sector);

        var _this = possibleConstructorReturn(this, _Circle.call(this, coordinates, radius, opts));

        _this.startAngle = startAngle;
        _this.endAngle = endAngle;
        return _this;
    }

    Sector.prototype.getStartAngle = function getStartAngle() {
        return this.startAngle;
    };

    Sector.prototype.setStartAngle = function setStartAngle(startAngle) {
        this.startAngle = startAngle;
        this.onShapeChanged();
        return this;
    };

    Sector.prototype.getEndAngle = function getEndAngle() {
        return this.endAngle;
    };

    Sector.prototype.setEndAngle = function setEndAngle(endAngle) {
        this.endAngle = endAngle;
        this.onShapeChanged();
        return this;
    };

    Sector.prototype.getShell = function getShell() {
        var measurer = this._getMeasurer(),
            center = this.getCoordinates(),
            numberOfPoints = this.options['numberOfShellPoints'] - 2,
            radius = this.getRadius(),
            shell = [center.copy()],
            startAngle = this.getStartAngle(),
            angle = this.getEndAngle() - startAngle;
        var rad = void 0,
            dx = void 0,
            dy = void 0;
        for (var i = 0; i < numberOfPoints; i++) {
            rad = (angle * i / (numberOfPoints - 1) + startAngle) * Math.PI / 180;
            dx = radius * Math.cos(rad);
            dy = radius * Math.sin(rad);
            var vertex = measurer.locate(center, dx, dy);
            shell.push(vertex);
        }
        shell.push(center.copy());
        return shell;
    };

    Sector.prototype._containsPoint = function _containsPoint(point, tolerance) {
        if (this.getMap().isTransforming()) {
            return _Circle.prototype._containsPoint.call(this, point, tolerance);
        }
        var center = this._getCenter2DPoint(),
            t = isNil(tolerance) ? this._hitTestTolerance() : tolerance,
            size = this.getSize(),
            pc = center,
            pp = point,
            x = pp.x - pc.x,
            y = pc.y - pp.y,
            atan2 = Math.atan2(y, x),
            angle = atan2 < 0 ? (atan2 + 2 * Math.PI) * 360 / (2 * Math.PI) : atan2 * 360 / (2 * Math.PI);
        var sAngle = this.startAngle % 360,
            eAngle = this.endAngle % 360;
        var between = false;
        if (sAngle > eAngle) {
            between = !(angle > eAngle && angle < sAngle);
        } else {
            between = angle >= sAngle && angle <= eAngle;
        }
        return pp.distanceTo(pc) <= size.width / 2 + t && between;
    };

    Sector.prototype._computeGeodesicLength = function _computeGeodesicLength() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * 2 * this._radius * Math.abs(this.startAngle - this.endAngle) / 360 + 2 * this._radius;
    };

    Sector.prototype._computeGeodesicArea = function _computeGeodesicArea() {
        if (isNil(this._radius)) {
            return 0;
        }
        return Math.PI * Math.pow(this._radius, 2) * Math.abs(this.startAngle - this.endAngle) / 360;
    };

    Sector.prototype._toJSON = function _toJSON(options) {
        var opts = extend({}, options);
        var center = this.getCenter();
        opts.geometry = false;
        var feature = this.toGeoJSON(opts);
        feature['geometry'] = {
            'type': 'Polygon'
        };
        return {
            'feature': feature,
            'subType': 'Sector',
            'coordinates': [center.x, center.y],
            'radius': this.getRadius(),
            'startAngle': this.getStartAngle(),
            'endAngle': this.getEndAngle()
        };
    };

    return Sector;
}(Circle);

Sector.mergeOptions(options$13);

Sector.registerJSONType('Sector');

var defaultSymbol$1 = {
    'textFaceName': 'monospace',
    'textSize': 12,
    'textLineSpacing': 8,
    'textWrapCharacter': '\n',
    'textHorizontalAlignment': 'middle',
    'textVerticalAlignment': 'middle' };

var defaultBoxSymbol = {
    'markerType': 'square',
    'markerLineColor': '#000',
    'markerLineWidth': 2,
    'markerLineOpacity': 1,
    'markerFill': '#fff',
    'markerOpacity': 1
};

var TextMarker = function (_Marker) {
    inherits(TextMarker, _Marker);

    function TextMarker() {
        classCallCheck(this, TextMarker);
        return possibleConstructorReturn(this, _Marker.apply(this, arguments));
    }

    TextMarker.prototype.getContent = function getContent() {
        return this._content;
    };

    TextMarker.prototype.setContent = function setContent(content) {
        var old = this._content;
        this._content = escapeSpecialChars(content);
        this._refresh();

        this._fireEvent('contentchange', {
            'old': old,
            'new': content
        });
        return this;
    };

    TextMarker.prototype.onAdd = function onAdd() {
        this._refresh();
    };

    TextMarker.prototype.toJSON = function toJSON() {
        var json = _Marker.prototype.toJSON.call(this);
        delete json['symbol'];
        return json;
    };

    TextMarker.prototype.setSymbol = function setSymbol(symbol) {
        if (this._refreshing || !symbol) {
            return _Marker.prototype.setSymbol.call(this, symbol);
        }
        var s = this._parseSymbol(symbol);
        if (this.setTextStyle) {
            var style = this.getTextStyle() || {};
            style.symbol = s[0];
            this.setTextStyle(style);
        } else if (this.setTextSymbol) {
            this.setTextSymbol(s[0]);
        }
        if (this.setBoxStyle) {
            var _style = this.getBoxStyle() || {};
            _style.symbol = s[1];
            this.setBoxStyle(_style);
        } else if (this.setBoxSymbol) {
            this.setBoxSymbol(s[1]);
        }
        return this;
    };

    TextMarker.prototype._parseSymbol = function _parseSymbol(symbol) {
        var t = {};
        var b = {};
        for (var p in symbol) {
            if (hasOwn(symbol, p)) {
                if (p.indexOf('text') === 0) {
                    t[p] = symbol[p];
                } else {
                    b[p] = symbol[p];
                }
            }
        }
        return [t, b];
    };

    TextMarker.prototype._getTextSize = function _getTextSize(symbol) {
        return splitTextToRow(this._content, symbol)['size'];
    };

    TextMarker.prototype._getInternalSymbol = function _getInternalSymbol() {
        return this._symbol;
    };

    TextMarker.prototype._getDefaultTextSymbol = function _getDefaultTextSymbol() {
        return extend({}, defaultSymbol$1);
    };

    TextMarker.prototype._getDefaultBoxSymbol = function _getDefaultBoxSymbol() {
        return extend({}, defaultBoxSymbol);
    };

    TextMarker.prototype._getDefaultPadding = function _getDefaultPadding() {
        return [12, 8];
    };

    return TextMarker;
}(Marker);

var options$14 = {
    'textStyle': {
        'wrap': true,
        'padding': [12, 8],
        'verticalAlignment': 'middle',
        'horizontalAlignment': 'middle'
    },
    'boxSymbol': null
};

var TextBox = function (_TextMarker) {
    inherits(TextBox, _TextMarker);

    function TextBox(content, coordinates, width, height) {
        var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
        classCallCheck(this, TextBox);

        var _this = possibleConstructorReturn(this, _TextMarker.call(this, coordinates, options));

        _this._content = escapeSpecialChars(content);
        _this._width = isNil(width) ? 100 : width;
        _this._height = isNil(height) ? 40 : height;
        if (options.boxSymbol) {
            _this.setBoxSymbol(options.boxSymbol);
        }
        if (options.textStyle) {
            _this.setTextStyle(options.textStyle);
        }
        _this._refresh();
        return _this;
    }

    TextBox.prototype.getWidth = function getWidth() {
        return this._width;
    };

    TextBox.prototype.setWidth = function setWidth(width) {
        this._width = width;
        this._refresh();
        return this;
    };

    TextBox.prototype.getHeight = function getHeight() {
        return this._height;
    };

    TextBox.prototype.setHeight = function setHeight(height) {
        this._height = height;
        this._refresh();
        return this;
    };

    TextBox.prototype.getBoxSymbol = function getBoxSymbol() {
        return extend({}, this.options.boxSymbol);
    };

    TextBox.prototype.setBoxSymbol = function setBoxSymbol(symbol) {
        this.options.boxSymbol = symbol ? extend({}, symbol) : symbol;
        if (this.getSymbol()) {
            this._refresh();
        }
        return this;
    };

    TextBox.prototype.getTextStyle = function getTextStyle() {
        if (!this.options.textStyle) {
            return null;
        }
        return extend({}, this.options.textStyle);
    };

    TextBox.prototype.setTextStyle = function setTextStyle(style) {
        this.options.textStyle = style ? extend({}, style) : style;
        if (this.getSymbol()) {
            this._refresh();
        }
        return this;
    };

    TextBox.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var textBox = new TextBox(json['content'], feature['geometry']['coordinates'], json['width'], json['height'], json['options']);
        textBox.setProperties(feature['properties']);
        textBox.setId(feature['id']);
        if (json['symbol']) {
            textBox.setSymbol(json['symbol']);
        }
        return textBox;
    };

    TextBox.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'width': this.getWidth(),
            'height': this.getHeight(),
            'subType': 'TextBox',
            'content': this._content
        };
    };

    TextBox.prototype._refresh = function _refresh() {
        var textStyle = this.getTextStyle() || {},
            padding = textStyle['padding'] || [12, 8],
            maxWidth = this._width - 2 * padding[0],
            maxHeight = this._height - 2 * padding[1];
        var symbol = extend({}, textStyle.symbol || this._getDefaultTextSymbol(), this.options.boxSymbol || this._getDefaultBoxSymbol(), {
            'textName': this._content,
            'markerWidth': this._width,
            'markerHeight': this._height,
            'textHorizontalAlignment': 'middle',
            'textVerticalAlignment': 'middle',
            'textMaxWidth': maxWidth,
            'textMaxHeight': maxHeight
        });

        if (textStyle['wrap'] && !symbol['textWrapWidth']) {
            symbol['textWrapWidth'] = maxWidth;
        }

        var hAlign = textStyle['horizontalAlignment'];
        symbol['textDx'] = symbol['markerDx'] || 0;
        var offsetX = symbol['markerWidth'] / 2 - padding[0];
        if (hAlign === 'left') {
            symbol['textHorizontalAlignment'] = 'right';
            symbol['textDx'] = symbol['textDx'] - offsetX;
        } else if (hAlign === 'right') {
            symbol['textHorizontalAlignment'] = 'left';
            symbol['textDx'] = symbol['textDx'] + offsetX;
        }

        var vAlign = textStyle['verticalAlignment'];
        symbol['textDy'] = symbol['markerDy'] || 0;
        var offsetY = symbol['markerHeight'] / 2 - padding[1];
        if (vAlign === 'top') {
            symbol['textVerticalAlignment'] = 'bottom';
            symbol['textDy'] -= offsetY;
        } else if (vAlign === 'bottom') {
            symbol['textVerticalAlignment'] = 'top';
            symbol['textDy'] += offsetY;
        }
        this._refreshing = true;
        this.updateSymbol(symbol);
        delete this._refreshing;
    };

    return TextBox;
}(TextMarker);

TextBox.mergeOptions(options$14);

TextBox.registerJSONType('TextBox');

var options$15 = {
    'boxStyle': null,
    textSymbol: null
};

var Label = function (_TextMarker) {
    inherits(Label, _TextMarker);

    function Label(content, coordinates) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, Label);

        var _this = possibleConstructorReturn(this, _TextMarker.call(this, coordinates, options));

        if (options.textSymbol) {
            _this.setTextSymbol(options.textSymbol);
        }
        if (options.boxStyle) {
            _this.setBoxStyle(options.boxStyle);
        }
        _this._content = escapeSpecialChars(content);
        _this._refresh();
        return _this;
    }

    Label.prototype.getBoxStyle = function getBoxStyle() {
        if (!this.options.boxStyle) {
            return null;
        }
        return extend({}, this.options.boxStyle);
    };

    Label.prototype.setBoxStyle = function setBoxStyle(style) {
        this.options.boxStyle = style ? extend({}, style) : style;
        this._refresh();
        return this;
    };

    Label.prototype.getTextSymbol = function getTextSymbol() {
        return extend({}, this._getDefaultTextSymbol(), this.options.textSymbol);
    };

    Label.prototype.setTextSymbol = function setTextSymbol(symbol) {
        this.options.textSymbol = symbol ? extend({}, symbol) : symbol;
        this._refresh();
        return this;
    };

    Label.fromJSON = function fromJSON(json) {
        var feature = json['feature'];
        var label = new Label(json['content'], feature['geometry']['coordinates'], json['options']);
        label.setProperties(feature['properties']);
        label.setId(feature['id']);
        if (json['symbol']) {
            label.setSymbol(json['symbol']);
        }
        return label;
    };

    Label.prototype._canEdit = function _canEdit() {
        return false;
    };

    Label.prototype._toJSON = function _toJSON(options) {
        return {
            'feature': this.toGeoJSON(options),
            'subType': 'Label',
            'content': this._content
        };
    };

    Label.prototype._refresh = function _refresh() {
        var symbol = extend({}, this.getTextSymbol(), {
            'textName': this._content
        });

        var boxStyle = this.getBoxStyle();
        if (boxStyle) {
            extend(symbol, boxStyle.symbol);
            var sizes = this._getBoxSize(symbol),
                textSize = sizes[1],
                padding = boxStyle['padding'] || this._getDefaultPadding();
            var boxSize = sizes[0];

            symbol['markerWidth'] = boxSize['width'];
            symbol['markerHeight'] = boxSize['height'];

            var dx = symbol['textDx'] || 0,
                dy = symbol['textDy'] || 0,
                textAlignPoint = getAlignPoint(textSize, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment'])._add(dx, dy);

            var hAlign = boxStyle['horizontalAlignment'] || 'middle';
            symbol['markerDx'] = textAlignPoint.x;
            if (hAlign === 'left') {
                symbol['markerDx'] += symbol['markerWidth'] / 2 - padding[0];
            } else if (hAlign === 'right') {
                symbol['markerDx'] -= symbol['markerWidth'] / 2 - textSize['width'] - padding[0];
            } else {
                symbol['markerDx'] += textSize['width'] / 2;
            }

            var vAlign = boxStyle['verticalAlignment'] || 'middle';
            symbol['markerDy'] = textAlignPoint.y;
            if (vAlign === 'top') {
                symbol['markerDy'] += symbol['markerHeight'] / 2 - padding[1];
            } else if (vAlign === 'bottom') {
                symbol['markerDy'] -= symbol['markerHeight'] / 2 - textSize['height'] - padding[1];
            } else {
                symbol['markerDy'] += textSize['height'] / 2;
            }
        }
        this._refreshing = true;
        this.updateSymbol(symbol);
        delete this._refreshing;
    };

    Label.prototype._getBoxSize = function _getBoxSize(symbol) {
        if (!symbol['markerType']) {
            symbol['markerType'] = 'square';
        }
        var boxStyle = this.getBoxStyle();
        var size = this._getTextSize(symbol);
        var width = void 0,
            height = void 0;
        var padding = boxStyle['padding'] || this._getDefaultPadding();
        width = size['width'] + padding[0] * 2;
        height = size['height'] + padding[1] * 2;
        if (boxStyle['minWidth']) {
            if (!width || width < boxStyle['minWidth']) {
                width = boxStyle['minWidth'];
            }
        }
        if (boxStyle['minHeight']) {
            if (!height || height < boxStyle['minHeight']) {
                height = boxStyle['minHeight'];
            }
        }
        return [new Size(width, height), size];
    };

    return Label;
}(TextMarker);

Label.mergeOptions(options$15);

Label.registerJSONType('Label');

var Connectable = function Connectable(Base) {
    return function (_Base) {
        inherits(_class, _Base);

        function _class() {
            classCallCheck(this, _class);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        _class._hasConnectors = function _hasConnectors(geometry) {
            return !isNil(geometry.__connectors) && geometry.__connectors.length > 0;
        };

        _class._getConnectors = function _getConnectors(geometry) {
            return geometry.__connectors;
        };

        _class.prototype.getConnectSource = function getConnectSource() {
            return this._connSource;
        };

        _class.prototype.setConnectSource = function setConnectSource(src) {
            var target = this._connTarget;
            this.onRemove();
            this._connSource = src;
            this._connTarget = target;
            this.onAdd();
            return this;
        };

        _class.prototype.getConnectTarget = function getConnectTarget() {
            return this._connTarget;
        };

        _class.prototype.setConnectTarget = function setConnectTarget(target) {
            var src = this._connSource;
            this.onRemove();
            this._connSource = src;
            this._connTarget = target;
            this._updateCoordinates();
            this._registerEvents();
            return this;
        };

        _class.prototype._updateCoordinates = function _updateCoordinates() {
            var map = this.getMap();
            if (!map && this._connSource) {
                map = this._connSource.getMap();
            }
            if (!map && this._connTarget) {
                map = this._connTarget.getMap();
            }
            if (!map) {
                return;
            }
            if (!this._connSource || !this._connTarget) {
                return;
            }
            var srcPoints = this._connSource._getConnectPoints();
            var targetPoints = this._connTarget._getConnectPoints();
            var minDist = 0;
            var oldCoordinates = this.getCoordinates();
            var c1 = void 0,
                c2 = void 0;
            for (var i = 0, len = srcPoints.length; i < len; i++) {
                var p1 = srcPoints[i];
                for (var j = 0, length = targetPoints.length; j < length; j++) {
                    var p2 = targetPoints[j];
                    var dist = map.computeLength(p1, p2);
                    if (i === 0 && j === 0) {
                        c1 = p1;
                        c2 = p2;
                        minDist = dist;
                    } else if (dist < minDist) {
                        c1 = p1;
                        c2 = p2;
                    }
                }
            }
            if (!isArrayHasData(oldCoordinates) || !oldCoordinates[0].equals(c1) || !oldCoordinates[1].equals(c2)) {
                this.setCoordinates([c1, c2]);
            }
        };

        _class.prototype.onAdd = function onAdd() {
            this._registerEvents();
            this._updateCoordinates();
        };

        _class.prototype.onRemove = function onRemove() {
            if (this._connSource) {
                if (this._connSource.__connectors) {
                    removeFromArray(this, this._connSource.__connectors);
                }
                this._connSource.off('dragging positionchange', this._updateCoordinates, this).off('remove', this.onRemove, this);
                this._connSource.off('dragstart mousedown mouseover', this._showConnect, this);
                this._connSource.off('dragend mouseup mouseout', this.hide, this);
                this._connSource.off('show', this._showConnect, this).off('hide', this.hide, this);
                delete this._connSource;
            }
            if (this._connTarget) {
                removeFromArray(this, this._connTarget.__connectors);
                this._connTarget.off('dragging positionchange', this._updateCoordinates, this).off('remove', this.onRemove, this);
                this._connTarget.off('show', this._showConnect, this).off('hide', this.hide, this);
                delete this._connTarget;
            }

            if (!(this._connSource instanceof Geometry) || !(this._connTarget instanceof Geometry)) {
                var map = this.getMap();
                if (map) {
                    map.off('movestart moving moveend zoomstart zooming zoomend rotate pitch fovchange spatialreferencechange', this._updateCoordinates, this);
                }
            }
        };

        _class.prototype._showConnect = function _showConnect() {
            if (!this._connSource || !this._connTarget) {
                return;
            }
            if (this._connSource.isVisible() && this._connTarget.isVisible()) {
                this._updateCoordinates();
                this.show();
            }
        };

        _class.prototype._registerEvents = function _registerEvents() {
            if (!this._connSource || !this._connTarget) {
                return;
            }
            if (!this._connSource.__connectors) {
                this._connSource.__connectors = [];
            }
            if (!this._connTarget.__connectors) {
                this._connTarget.__connectors = [];
            }
            this._connSource.__connectors.push(this);
            this._connTarget.__connectors.push(this);
            this._connSource.on('dragging positionchange', this._updateCoordinates, this).on('remove', this.remove, this);
            this._connTarget.on('dragging positionchange', this._updateCoordinates, this).on('remove', this.remove, this);
            this._connSource.on('show', this._showConnect, this).on('hide', this.hide, this);
            this._connTarget.on('show', this._showConnect, this).on('hide', this.hide, this);
            var trigger = this.options['showOn'];
            this.hide();
            if (trigger === 'moving') {
                this._connSource.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
                this._connTarget.on('dragstart', this._showConnect, this).on('dragend', this.hide, this);
            } else if (trigger === 'click') {
                this._connSource.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
                this._connTarget.on('mousedown', this._showConnect, this).on('mouseup', this.hide, this);
            } else if (trigger === 'mouseover') {
                this._connSource.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
                this._connTarget.on('mouseover', this._showConnect, this).on('mouseout', this.hide, this);
            } else {
                this._showConnect();
            }

            if (!(this._connSource instanceof Geometry) || !(this._connTarget instanceof Geometry)) {
                var map = this.getMap();
                if (map) {
                    map.on('movestart moving moveend zoomstart zooming zoomend rotate pitch fovchange spatialreferencechange', this._updateCoordinates, this);
                }
            }
        };

        return _class;
    }(Base);
};

var options$16 = {
    showOn: 'always'
};

var ConnectorLine = function (_Connectable) {
    inherits(ConnectorLine, _Connectable);

    function ConnectorLine(src, target, options) {
        classCallCheck(this, ConnectorLine);

        var _this2 = possibleConstructorReturn(this, _Connectable.call(this, null, options));

        if (arguments.length === 1) {
            options = src;
            src = null;
            target = null;
        }
        _this2._connSource = src;
        _this2._connTarget = target;
        return _this2;
    }

    return ConnectorLine;
}(Connectable(LineString));

ConnectorLine.mergeOptions(options$16);

ConnectorLine.registerJSONType('ConnectorLine');

var ArcConnectorLine = function (_Connectable2) {
    inherits(ArcConnectorLine, _Connectable2);

    function ArcConnectorLine(src, target, options) {
        classCallCheck(this, ArcConnectorLine);

        var _this3 = possibleConstructorReturn(this, _Connectable2.call(this, null, options));

        if (arguments.length === 1) {
            options = src;
            src = null;
            target = null;
        }
        _this3._connSource = src;
        _this3._connTarget = target;
        return _this3;
    }

    return ArcConnectorLine;
}(Connectable(ArcCurve));

ArcConnectorLine.mergeOptions(options$16);

ArcConnectorLine.registerJSONType('ArcConnectorLine');

var options$12 = {
    'drawImmediate': false
};

var OverlayLayer = function (_Layer) {
    inherits(OverlayLayer, _Layer);

    function OverlayLayer(id, geometries, options) {
        classCallCheck(this, OverlayLayer);

        if (geometries && !(geometries instanceof Geometry) && !Array.isArray(geometries) && GEOJSON_TYPES.indexOf(geometries.type) < 0) {
            options = geometries;
            geometries = null;
        }

        var _this = possibleConstructorReturn(this, _Layer.call(this, id, options));

        _this._maxZIndex = 0;
        _this._minZIndex = 0;
        _this._initCache();
        if (geometries) {
            _this.addGeometry(geometries);
        }
        return _this;
    }

    OverlayLayer.prototype.getGeometryById = function getGeometryById(id) {
        if (isNil(id) || id === '') {
            return null;
        }
        if (!this._geoMap[id]) {
            return null;
        }
        return this._geoMap[id];
    };

    OverlayLayer.prototype.getGeometries = function getGeometries(filter, context) {
        if (!filter) {
            return this._geoList.slice(0);
        }
        var result = [];
        var geometry = void 0,
            filtered = void 0;
        for (var i = 0, l = this._geoList.length; i < l; i++) {
            geometry = this._geoList[i];
            if (context) {
                filtered = filter.call(context, geometry);
            } else {
                filtered = filter(geometry);
            }
            if (filtered) {
                result.push(geometry);
            }
        }
        return result;
    };

    OverlayLayer.prototype.getFirstGeometry = function getFirstGeometry() {
        if (!this._geoList.length) {
            return null;
        }
        return this._geoList[0];
    };

    OverlayLayer.prototype.getLastGeometry = function getLastGeometry() {
        var len = this._geoList.length;
        if (len === 0) {
            return null;
        }
        return this._geoList[len - 1];
    };

    OverlayLayer.prototype.getCount = function getCount() {
        return this._geoList.length;
    };

    OverlayLayer.prototype.getExtent = function getExtent() {
        if (this.getCount() === 0) {
            return null;
        }
        var extent = new Extent(this.getProjection());
        this.forEach(function (g) {
            extent._combine(g.getExtent());
        });
        return extent;
    };

    OverlayLayer.prototype.forEach = function forEach(fn, context) {
        var copyOnWrite = this._geoList.slice(0);
        for (var i = 0, l = copyOnWrite.length; i < l; i++) {
            if (!context) {
                fn(copyOnWrite[i], i);
            } else {
                fn.call(context, copyOnWrite[i], i);
            }
        }
        return this;
    };

    OverlayLayer.prototype.filter = function filter() {
        return GeometryCollection.prototype.filter.apply(this, arguments);
    };

    OverlayLayer.prototype.isEmpty = function isEmpty() {
        return !this._geoList.length;
    };

    OverlayLayer.prototype.addGeometry = function addGeometry(geometries, fitView) {
        if (!geometries) {
            return this;
        }
        if (geometries.type === 'FeatureCollection') {
            return this.addGeometry(GeoJSON.toGeometry(geometries), fitView);
        } else if (!Array.isArray(geometries)) {
            var count = arguments.length;
            var last = arguments[count - 1];
            geometries = Array.prototype.slice.call(arguments, 0, count - 1);
            fitView = last;
            if (isObject(last)) {
                geometries.push(last);
                fitView = false;
            }
            return this.addGeometry(geometries, fitView);
        } else if (geometries.length === 0) {
            return this;
        }
        this._initCache();
        var extent = void 0;
        if (fitView === true) {
            extent = new Extent();
        }
        this._toSort = this._maxZIndex > 0;
        for (var i = 0, l = geometries.length; i < l; i++) {
            var geo = geometries[i];
            if (!geo) {
                throw new Error('Invalid geometry to add to layer(' + this.getId() + ') at index:' + i);
            }
            if (!(geo instanceof Geometry)) {
                geo = Geometry.fromJSON(geo);
                if (Array.isArray(geo)) {
                    for (var ii = 0, ll = geo.length; ii < ll; ii++) {
                        this._add(geo[ii], extent, i);
                    }
                }
            }
            if (!Array.isArray(geo)) {
                this._add(geo, extent, i);
            }
        }
        var map = this.getMap();
        if (map) {
            this._getRenderer().onGeometryAdd(geometries);
            if (fitView === true && !isNil(extent.xmin)) {
                var z = map.getFitZoom(extent);
                map.setCenterAndZoom(extent.getCenter(), z);
            }
        }

        this.fire('addgeo', {
            'geometries': geometries
        });
        return this;
    };

    OverlayLayer.prototype.getGeoMinZIndex = function getGeoMinZIndex() {
        return this._minZIndex;
    };

    OverlayLayer.prototype.getGeoMaxZIndex = function getGeoMaxZIndex() {
        return this._maxZIndex;
    };

    OverlayLayer.prototype._add = function _add(geo, extent, i) {
        if (!this._toSort) {
            this._toSort = geo.getZIndex() !== 0;
        }
        this._updateZIndex(geo.getZIndex());
        var geoId = geo.getId();
        if (!isNil(geoId)) {
            if (!isNil(this._geoMap[geoId])) {
                throw new Error('Duplicate geometry id in layer(' + this.getId() + '):' + geoId + ', at index:' + i);
            }
            this._geoMap[geoId] = geo;
        }
        var internalId = UID();
        geo._setInternalId(internalId);
        this._geoList.push(geo);
        if (this.onAddGeometry) {
            this.onAddGeometry(geo);
        }
        geo._bindLayer(this);
        if (geo.onAdd) {
            geo.onAdd();
        }
        if (extent) {
            extent._combine(geo.getExtent());
        }

        geo._fireEvent('add', {
            'layer': this
        });
    };

    OverlayLayer.prototype.removeGeometry = function removeGeometry(geometries) {
        if (!Array.isArray(geometries)) {
            return this.removeGeometry([geometries]);
        }
        for (var i = geometries.length - 1; i >= 0; i--) {
            if (!(geometries[i] instanceof Geometry)) {
                geometries[i] = this.getGeometryById(geometries[i]);
            }
            if (!geometries[i] || this !== geometries[i].getLayer()) continue;
            geometries[i].remove();
        }

        this.fire('removegeo', {
            'geometries': geometries
        });
        return this;
    };

    OverlayLayer.prototype.clear = function clear() {
        this._clearing = true;
        this.forEach(function (geo) {
            geo.remove();
        });
        this._geoMap = {};
        var old = this._geoList;
        this._geoList = [];
        if (this._getRenderer()) {
            this._getRenderer().onGeometryRemove(old);
        }
        this._clearing = false;

        this.fire('clear');
        return this;
    };

    OverlayLayer.prototype.onRemoveGeometry = function onRemoveGeometry(geometry) {
        if (!geometry || this._clearing) {
            return;
        }

        if (this !== geometry.getLayer()) {
            return;
        }
        var internalId = geometry._getInternalId();
        if (isNil(internalId)) {
            return;
        }
        var geoId = geometry.getId();
        if (!isNil(geoId)) {
            delete this._geoMap[geoId];
        }
        var idx = this._findInList(geometry);
        if (idx >= 0) {
            this._geoList.splice(idx, 1);
        }
        if (this._getRenderer()) {
            this._getRenderer().onGeometryRemove([geometry]);
        }
    };

    OverlayLayer.prototype.hide = function hide() {
        for (var i = 0, l = this._geoList.length; i < l; i++) {
            this._geoList[i].onHide();
        }
        return Layer.prototype.hide.call(this);
    };

    OverlayLayer.prototype.identify = function identify(coordinate) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return this._hitGeos(this._geoList, coordinate, options);
    };

    OverlayLayer.prototype._hitGeos = function _hitGeos(geometries, coordinate) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var filter = options['filter'],
            tolerance = options['tolerance'],
            hits = [];
        var map = this.getMap();
        var point = map.coordToPoint(coordinate);
        var cp = map._pointToContainerPoint(point);
        for (var i = geometries.length - 1; i >= 0; i--) {
            var geo = geometries[i];
            if (!geo || !geo.isVisible() || !geo._getPainter()) {
                continue;
            }
            if (!(geo instanceof LineString) || !geo._getArrowStyle()) {
                var extent = geo._getPainter().getContainerExtent();
                if (tolerance) {
                    extent = extent.expand(tolerance);
                }
                if (!extent || !extent.contains(cp)) {
                    continue;
                }
            }
            if (geo._containsPoint(point, tolerance) && (!filter || filter(geo))) {
                hits.push(geo);
                if (options['count']) {
                    if (hits.length >= options['count']) {
                        break;
                    }
                }
            }
        }
        return hits;
    };

    OverlayLayer.prototype._initCache = function _initCache() {
        if (!this._geoList) {
            this._geoList = [];
            this._geoMap = {};
        }
    };

    OverlayLayer.prototype._updateZIndex = function _updateZIndex() {
        for (var _len = arguments.length, zIndex = Array(_len), _key = 0; _key < _len; _key++) {
            zIndex[_key] = arguments[_key];
        }

        this._maxZIndex = Math.max(this._maxZIndex, Math.max.apply(Math, zIndex));
        this._minZIndex = Math.min(this._minZIndex, Math.min.apply(Math, zIndex));
    };

    OverlayLayer.prototype._sortGeometries = function _sortGeometries() {
        var _this2 = this;

        if (!this._toSort) {
            return;
        }
        this._maxZIndex = 0;
        this._minZIndex = 0;
        this._geoList.sort(function (a, b) {
            _this2._updateZIndex(a.getZIndex(), b.getZIndex());
            return _this2._compare(a, b);
        });
        this._toSort = false;
    };

    OverlayLayer.prototype._compare = function _compare(a, b) {
        if (a.getZIndex() === b.getZIndex()) {
            return a._getInternalId() - b._getInternalId();
        }
        return a.getZIndex() - b.getZIndex();
    };

    OverlayLayer.prototype._findInList = function _findInList(geo) {
        var len = this._geoList.length;
        if (len === 0) {
            return -1;
        }
        var low = 0,
            high = len - 1,
            middle = void 0;
        while (low <= high) {
            middle = Math.floor((low + high) / 2);
            if (this._geoList[middle] === geo) {
                return middle;
            } else if (this._compare(this._geoList[middle], geo) > 0) {
                high = middle - 1;
            } else {
                low = middle + 1;
            }
        }
        return -1;
    };

    OverlayLayer.prototype._onGeometryEvent = function _onGeometryEvent(param) {
        if (!param || !param['target']) {
            return;
        }
        var type = param['type'];
        if (type === 'idchange') {
            this._onGeometryIdChange(param);
        } else if (type === 'zindexchange') {
            this._onGeometryZIndexChange(param);
        } else if (type === 'positionchange') {
            this._onGeometryPositionChange(param);
        } else if (type === 'shapechange') {
            this._onGeometryShapeChange(param);
        } else if (type === 'symbolchange') {
            this._onGeometrySymbolChange(param);
        } else if (type === 'show') {
            this._onGeometryShow(param);
        } else if (type === 'hide') {
            this._onGeometryHide(param);
        } else if (type === 'propertieschange') {
            this._onGeometryPropertiesChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryIdChange = function _onGeometryIdChange(param) {
        if (param['new'] === param['old']) {
            if (this._geoMap[param['old']] && this._geoMap[param['old']] === param['target']) {
                return;
            }
        }
        if (!isNil(param['new'])) {
            if (this._geoMap[param['new']]) {
                throw new Error('Duplicate geometry id in layer(' + this.getId() + '):' + param['new']);
            }
            this._geoMap[param['new']] = param['target'];
        }
        if (!isNil(param['old']) && param['new'] !== param['old']) {
            delete this._geoMap[param['old']];
        }
    };

    OverlayLayer.prototype._onGeometryZIndexChange = function _onGeometryZIndexChange(param) {
        if (param['old'] !== param['new']) {
            this._updateZIndex(param['new']);
            this._toSort = true;
            if (this._getRenderer()) {
                this._getRenderer().onGeometryZIndexChange(param);
            }
        }
    };

    OverlayLayer.prototype._onGeometryPositionChange = function _onGeometryPositionChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryPositionChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryShapeChange = function _onGeometryShapeChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryShapeChange(param);
        }
    };

    OverlayLayer.prototype._onGeometrySymbolChange = function _onGeometrySymbolChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometrySymbolChange(param);
        }
    };

    OverlayLayer.prototype._onGeometryShow = function _onGeometryShow(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryShow(param);
        }
    };

    OverlayLayer.prototype._onGeometryHide = function _onGeometryHide(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryHide(param);
        }
    };

    OverlayLayer.prototype._onGeometryPropertiesChange = function _onGeometryPropertiesChange(param) {
        if (this._getRenderer()) {
            this._getRenderer().onGeometryPropertiesChange(param);
        }
    };

    return OverlayLayer;
}(Layer);

OverlayLayer.mergeOptions(options$12);

var options$11 = {
    'debug': false,
    'enableSimplify': true,
    'geometryEvents': true,
    'defaultIconSize': [20, 20],
    'cacheVectorOnCanvas': true,
    'cacheSvgOnCanvas': Browser$1.gecko,
    'enableAltitude': false,
    'altitudeProperty': 'altitude',
    'drawAltitude': false
};

var VectorLayer = function (_OverlayLayer) {
    inherits(VectorLayer, _OverlayLayer);

    function VectorLayer(id, geometries, options) {
        classCallCheck(this, VectorLayer);

        var _this = possibleConstructorReturn(this, _OverlayLayer.call(this, id, geometries, options));

        var style = _this.options['style'];
        delete _this.options['style'];
        if (style) {
            _this.setStyle(style);
        }
        return _this;
    }

    VectorLayer.prototype.getStyle = function getStyle() {
        if (!this._style) {
            return null;
        }
        return this._style;
    };

    VectorLayer.prototype.setStyle = function setStyle(style) {
        this._style = style;
        this._cookedStyles = compileStyle(style);
        this.forEach(function (geometry) {
            this._styleGeometry(geometry);
        }, this);

        this.fire('setstyle', {
            'style': style
        });
        return this;
    };

    VectorLayer.prototype.removeStyle = function removeStyle() {
        if (!this._style) {
            return this;
        }
        delete this._style;
        delete this._cookedStyles;
        this.forEach(function (geometry) {
            geometry._setExternSymbol(null);
        }, this);

        this.fire('removestyle');
        return this;
    };

    VectorLayer.prototype.onAddGeometry = function onAddGeometry(geo) {
        var style = this.getStyle();
        if (style) {
            this._styleGeometry(geo);
        }
    };

    VectorLayer.prototype.onConfig = function onConfig(conf) {
        if (conf['enableAltitude'] || conf['drawAltitude'] || conf['altitudeProperty']) {
            var renderer = this.getRenderer();
            if (renderer && renderer.setToRedraw) {
                renderer.setToRedraw();
            }
        }
    };

    VectorLayer.prototype._styleGeometry = function _styleGeometry(geometry) {
        if (!this._cookedStyles) {
            return false;
        }
        var g = getFilterFeature(geometry);
        for (var i = 0, len = this._cookedStyles.length; i < len; i++) {
            if (this._cookedStyles[i]['filter'](g) === true) {
                geometry._setExternSymbol(this._cookedStyles[i]['symbol']);
                return true;
            }
        }
        return false;
    };

    VectorLayer.prototype.identify = function identify(coordinate) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var renderer = this.getRenderer();

        if (options['onlyVisible'] && renderer && renderer.identify) {
            return renderer.identify(coordinate, options);
        }
        return _OverlayLayer.prototype.identify.call(this, coordinate, options);
    };

    VectorLayer.prototype.toJSON = function toJSON(options) {
        if (!options) {
            options = {};
        }
        var profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
        if ((isNil(options['style']) || options['style']) && this.getStyle()) {
            profile['style'] = this.getStyle();
        }
        if (isNil(options['geometries']) || options['geometries']) {
            var clipExtent = void 0;
            if (options['clipExtent']) {
                var map = this.getMap();
                var projection = map ? map.getProjection() : null;
                clipExtent = new Extent(options['clipExtent'], projection);
            }
            var geoJSONs = [];
            var geometries = this.getGeometries();
            for (var i = 0, len = geometries.length; i < len; i++) {
                var geo = geometries[i];
                var geoExt = geo.getExtent();
                if (!geoExt || clipExtent && !clipExtent.intersects(geoExt)) {
                    continue;
                }
                var json = geo.toJSON(options['geometries']);
                geoJSONs.push(json);
            }
            profile['geometries'] = geoJSONs;
        }
        return profile;
    };

    VectorLayer.fromJSON = function fromJSON(json) {
        if (!json || json['type'] !== 'VectorLayer') {
            return null;
        }
        var layer = new VectorLayer(json['id'], json['options']);
        var geoJSONs = json['geometries'];
        var geometries = [];
        for (var i = 0; i < geoJSONs.length; i++) {
            var geo = Geometry.fromJSON(geoJSONs[i]);
            if (geo) {
                geometries.push(geo);
            }
        }
        layer.addGeometry(geometries);
        if (json['style']) {
            layer.setStyle(json['style']);
        }
        return layer;
    };

    return VectorLayer;
}(OverlayLayer);

VectorLayer.mergeOptions(options$11);

VectorLayer.registerJSONType('VectorLayer');

var key = '_map_tool';

var MapTool = function (_Eventable) {
    inherits(MapTool, _Eventable);

    function MapTool() {
        classCallCheck(this, MapTool);
        return possibleConstructorReturn(this, _Eventable.apply(this, arguments));
    }

    MapTool.prototype.addTo = function addTo(map) {
        if (!map) {
            return this;
        }
        this._map = map;

        if (map[key]) {
            map[key].disable();
        }
        if (this.onAdd) {
            this.onAdd();
        }
        this.enable();
        map[key] = this;

        this._fireEvent('add');
        return this;
    };

    MapTool.prototype.getMap = function getMap() {
        return this._map;
    };

    MapTool.prototype.enable = function enable() {
        var map = this._map;
        if (!map || this._enabled) {
            return this;
        }
        this._enabled = true;
        this._switchEvents('off');

        this._registerEvents();
        if (this.onEnable) {
            this.onEnable();
        }

        this._fireEvent('enable');
        return this;
    };

    MapTool.prototype.disable = function disable() {
        if (!this._enabled || !this._map) {
            return this;
        }
        this._enabled = false;
        this._switchEvents('off');
        if (this.onDisable) {
            this.onDisable();
        }

        this._fireEvent('disable');
        return this;
    };

    MapTool.prototype.isEnabled = function isEnabled() {
        if (!this._enabled) {
            return false;
        }
        return true;
    };

    MapTool.prototype.remove = function remove() {
        if (!this._map) {
            return this;
        }
        this.disable();
        if (this._map) {
            delete this._map[key];
            delete this._map;
        }

        this._fireEvent('remove');
        return this;
    };

    MapTool.prototype._registerEvents = function _registerEvents() {
        this._switchEvents('on');
    };

    MapTool.prototype._switchEvents = function _switchEvents(to) {
        var events = this.getEvents();
        if (events) {
            this._map[to](events, this);
        }
    };

    MapTool.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (!param) {
            param = {};
        }
        this.fire(eventName, param);
    };

    return MapTool;
}(Eventable(Class));

var options$3 = {
    'symbol': {
        'lineColor': '#000',
        'lineWidth': 2,
        'lineOpacity': 1,
        'polygonFill': '#fff',
        'polygonOpacity': 0.3
    },
    'doubleClickZoom': false,
    'mode': null,
    'once': false,
    'ignoreMouseleave': true
};

var registeredMode = {};

var DrawTool = function (_MapTool) {
    inherits(DrawTool, _MapTool);

    DrawTool.registerMode = function registerMode(name, modeAction) {
        registeredMode[name.toLowerCase()] = modeAction;
    };

    DrawTool.getRegisterMode = function getRegisterMode(name) {
        return registeredMode[name.toLowerCase()];
    };

    function DrawTool(options) {
        classCallCheck(this, DrawTool);

        var _this = possibleConstructorReturn(this, _MapTool.call(this, options));

        _this._checkMode();
        return _this;
    }

    DrawTool.prototype.getMode = function getMode() {
        if (this.options['mode']) {
            return this.options['mode'].toLowerCase();
        }
        return null;
    };

    DrawTool.prototype.setMode = function setMode(mode) {
        if (this._geometry) {
            this._geometry.remove();
            delete this._geometry;
        }
        this._clearStage();
        this._switchEvents('off');
        this.options['mode'] = mode;
        this._checkMode();
        if (this.isEnabled()) {
            this._switchEvents('on');
            this._restoreMapCfg();
            this._saveMapCfg();
        }
        return this;
    };

    DrawTool.prototype.getSymbol = function getSymbol() {
        var symbol = this.options['symbol'];
        if (symbol) {
            return extendSymbol(symbol);
        } else {
            return extendSymbol(this.options['symbol']);
        }
    };

    DrawTool.prototype.setSymbol = function setSymbol(symbol) {
        if (!symbol) {
            return this;
        }
        this.options['symbol'] = symbol;
        if (this._geometry) {
            this._geometry.setSymbol(symbol);
        }
        return this;
    };

    DrawTool.prototype.getCurrentGeometry = function getCurrentGeometry() {
        return this._geometry;
    };

    DrawTool.prototype.onAdd = function onAdd() {
        this._checkMode();
    };

    DrawTool.prototype.onEnable = function onEnable() {
        this._saveMapCfg();
        this._drawToolLayer = this._getDrawLayer();
        this._clearStage();
        this._loadResources();
        return this;
    };

    DrawTool.prototype.onDisable = function onDisable() {
        var map = this.getMap();
        this._restoreMapCfg();
        this.endDraw();
        if (this._map) {
            map.removeLayer(this._getDrawLayer());
        }
        return this;
    };

    DrawTool.prototype.undo = function undo() {
        var registerMode = this._getRegisterMode();
        var action = registerMode.action;
        if (action !== 'clickDblclick' || !this._historyPointer) {
            return this;
        }
        var coords = this._clickCoords.slice(0, --this._historyPointer);
        registerMode.update(coords, this._geometry);
        return this;
    };

    DrawTool.prototype.redo = function redo() {
        var registerMode = this._getRegisterMode();
        var action = registerMode.action;
        if (action !== 'clickDblclick' || isNil(this._historyPointer) || this._historyPointer === this._clickCoords.length) {
            return this;
        }
        var coords = this._clickCoords.slice(0, ++this._historyPointer);
        registerMode.update(coords, this._geometry);
        return this;
    };

    DrawTool.prototype._checkMode = function _checkMode() {
        this._getRegisterMode();
    };

    DrawTool.prototype._saveMapCfg = function _saveMapCfg() {
        var map = this.getMap();
        this._mapDoubleClickZoom = map.options['doubleClickZoom'];
        map.config({
            'doubleClickZoom': this.options['doubleClickZoom']
        });
        var action = this._getRegisterMode()['action'];
        if (action === 'drag') {
            var _map = this.getMap();
            this._mapDraggable = _map.options['draggable'];
            _map.config({
                'draggable': false
            });
        }
    };

    DrawTool.prototype._restoreMapCfg = function _restoreMapCfg() {
        var map = this.getMap();
        map.config({
            'doubleClickZoom': this._mapDoubleClickZoom
        });
        if (!isNil(this._mapDraggable)) {
            map.config('draggable', this._mapDraggable);
        }
        delete this._mapDraggable;
        delete this._mapDoubleClickZoom;
    };

    DrawTool.prototype._loadResources = function _loadResources() {
        var symbol = this.getSymbol();
        var resources = getExternalResources(symbol);
        if (resources.length > 0) {
            this._drawToolLayer._getRenderer().loadResources(resources);
        }
    };

    DrawTool.prototype._getProjection = function _getProjection() {
        return this._map.getProjection();
    };

    DrawTool.prototype._getRegisterMode = function _getRegisterMode() {
        var mode = this.getMode();
        var registerMode = DrawTool.getRegisterMode(mode);
        if (!registerMode) {
            throw new Error(mode + ' is not a valid mode of DrawTool.');
        }
        return registerMode;
    };

    DrawTool.prototype.getEvents = function getEvents() {
        var action = this._getRegisterMode()['action'];
        if (action === 'clickDblclick') {
            return {
                'click': this._clickForPath,
                'mousemove': this._mousemoveForPath,
                'dblclick': this._dblclickForPath
            };
        } else if (action === 'click') {
            return {
                'click': this._clickForPoint
            };
        } else if (action === 'drag') {
            return {
                'mousedown': this._mousedownToDraw
            };
        }
        return null;
    };

    DrawTool.prototype._addGeometryToStage = function _addGeometryToStage(geometry) {
        var drawLayer = this._getDrawLayer();
        drawLayer.addGeometry(geometry);
    };

    DrawTool.prototype._clickForPoint = function _clickForPoint(param) {
        var registerMode = this._getRegisterMode();
        this._geometry = registerMode['create'](param['coordinate'], param);
        if (this.options['symbol'] && this.options.hasOwnProperty('symbol')) {
            this._geometry.setSymbol(this.options['symbol']);
        }
        this.endDraw();
    };

    DrawTool.prototype._clickForPath = function _clickForPath(param) {
        var registerMode = this._getRegisterMode();
        var coordinate = param['coordinate'];
        var symbol = this.getSymbol();
        if (!this._geometry) {
            this._clickCoords = [coordinate];
            this._geometry = registerMode['create'](this._clickCoords, param);
            if (symbol) {
                this._geometry.setSymbol(symbol);
            }
            this._addGeometryToStage(this._geometry);

            this._fireEvent('drawstart', param);
        } else {
            if (!isNil(this._historyPointer)) {
                this._clickCoords = this._clickCoords.slice(0, this._historyPointer);
            }
            this._clickCoords.push(coordinate);
            this._historyPointer = this._clickCoords.length;
            registerMode['update'](this._clickCoords, this._geometry, param);

            this._fireEvent('drawvertex', param);
        }
    };

    DrawTool.prototype._mousemoveForPath = function _mousemoveForPath(param) {
        var map = this.getMap();
        if (!this._geometry || !map || map.isInteracting()) {
            return;
        }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) {
            return;
        }
        var coordinate = param['coordinate'];
        var registerMode = this._getRegisterMode();
        var path = this._clickCoords.slice(0, this._historyPointer);
        if (path && path.length > 0 && coordinate.equals(path[path.length - 1])) {
            return;
        }
        registerMode['update'](path.concat([coordinate]), this._geometry, param);

        this._fireEvent('mousemove', param);
    };

    DrawTool.prototype._dblclickForPath = function _dblclickForPath(param) {
        if (!this._geometry) {
            return;
        }
        var containerPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(containerPoint)) {
            return;
        }
        var registerMode = this._getRegisterMode();
        var coordinate = param['coordinate'];
        var path = this._clickCoords;
        path.push(coordinate);
        if (path.length < 2) {
            return;
        }

        var nIndexes = [];
        for (var i = 1, len = path.length; i < len; i++) {
            if (path[i].x === path[i - 1].x && path[i].y === path[i - 1].y) {
                nIndexes.push(i);
            }
        }
        for (var _i = nIndexes.length - 1; _i >= 0; _i--) {
            path.splice(nIndexes[_i], 1);
        }

        if (path.length < 2 || this._geometry && this._geometry instanceof Polygon && path.length < 3) {
            return;
        }
        registerMode['update'](path, this._geometry, param);
        this.endDraw(param);
    };

    DrawTool.prototype._mousedownToDraw = function _mousedownToDraw(param) {
        var map = this._map;
        var registerMode = this._getRegisterMode();
        var me = this,
            firstPoint = this._getMouseContainerPoint(param);
        if (!this._isValidContainerPoint(firstPoint)) {
            return false;
        }

        function genGeometry(evt) {
            var symbol = me.getSymbol();
            var geometry = me._geometry;
            if (!geometry) {
                geometry = registerMode['create'](evt.coordinate, evt);
                geometry.setSymbol(symbol);
                me._addGeometryToStage(geometry);
                me._geometry = geometry;
            } else {
                registerMode['update'](evt.coordinate, geometry, evt);
            }
        }

        function onMouseMove(evt) {
            if (!this._geometry) {
                return false;
            }
            var current = this._getMouseContainerPoint(evt);
            if (!this._isValidContainerPoint(current)) {
                return false;
            }
            genGeometry(evt);
            this._fireEvent('mousemove', param);
            return false;
        }
        var onMouseUp = function onMouseUp(evt) {
            map.off('mousemove', onMouseMove, this);
            map.off('mouseup', onMouseUp, this);
            if (!this.options['ignoreMouseleave']) {
                map.off('mouseleave', onMouseUp, this);
            }
            if (!this._geometry) {
                return false;
            }
            var current = this._getMouseContainerPoint(evt);
            if (this._isValidContainerPoint(current)) {
                genGeometry(evt);
            }
            this.endDraw(param);
            return false;
        };

        this._fireEvent('drawstart', param);
        genGeometry(param);
        map.on('mousemove', onMouseMove, this);
        map.on('mouseup', onMouseUp, this);
        if (!this.options['ignoreMouseleave']) {
            map.on('mouseleave', onMouseUp, this);
        }
        return false;
    };

    DrawTool.prototype.endDraw = function endDraw(param) {
        if (!this._geometry || this._ending) {
            return this;
        }
        this._ending = true;
        var geometry = this._geometry;
        this._clearStage();
        param = param || {};
        this._geometry = geometry;

        this._fireEvent('drawend', param);
        delete this._geometry;
        if (this.options['once']) {
            this.disable();
        }
        delete this._ending;
        return this;
    };

    DrawTool.prototype._clearStage = function _clearStage() {
        this._getDrawLayer().clear();
        delete this._geometry;
        delete this._clickCoords;
    };

    DrawTool.prototype._getMouseContainerPoint = function _getMouseContainerPoint(event) {
        var action = this._getRegisterMode()['action'];
        if (action === 'drag') {
            stopPropagation(event['domEvent']);
        }
        return event['containerPoint'];
    };

    DrawTool.prototype._isValidContainerPoint = function _isValidContainerPoint(containerPoint) {
        var mapSize = this._map.getSize();
        var w = mapSize['width'],
            h = mapSize['height'];
        if (containerPoint.x < 0 || containerPoint.y < 0) {
            return false;
        } else if (containerPoint.x > w || containerPoint.y > h) {
            return false;
        }
        return true;
    };

    DrawTool.prototype._getDrawLayer = function _getDrawLayer() {
        var drawLayerId = INTERNAL_LAYER_PREFIX + 'drawtool';
        var drawToolLayer = this._map.getLayer(drawLayerId);
        if (!drawToolLayer) {
            drawToolLayer = new VectorLayer(drawLayerId, {
                'enableSimplify': false
            });
            this._map.addLayer(drawToolLayer);
        }
        return drawToolLayer;
    };

    DrawTool.prototype._fireEvent = function _fireEvent(eventName, param) {
        if (!param) {
            param = {};
        }
        if (this._geometry) {
            param['geometry'] = this._getRegisterMode()['generate'](this._geometry).copy();
        }
        MapTool.prototype._fireEvent.call(this, eventName, param);
    };

    return DrawTool;
}(MapTool);

DrawTool.mergeOptions(options$3);

DrawTool.registerMode('circle', {
    'action': 'drag',
    'create': function create(coordinate) {
        return new Circle(coordinate, 0);
    },
    'update': function update(coordinate, geometry) {
        var map = geometry.getMap();
        var radius = map.computeLength(geometry.getCenter(), coordinate);
        geometry.setRadius(radius);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('ellipse', {
    'action': 'drag',
    'create': function create(coordinate) {
        return new Ellipse(coordinate, 0, 0);
    },
    'update': function update(coordinate, geometry) {
        var map = geometry.getMap();
        var center = geometry.getCenter();
        var rx = map.computeLength(center, new Coordinate({
            x: coordinate.x,
            y: center.y
        }));
        var ry = map.computeLength(center, new Coordinate({
            x: center.x,
            y: coordinate.y
        }));
        geometry.setWidth(rx * 2);
        geometry.setHeight(ry * 2);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('rectangle', {
    'action': 'drag',
    'create': function create(coordinate, param) {
        var rect = new Rectangle(coordinate, 0, 0);
        rect._firstClick = param['containerPoint'];
        rect._firstCoord = coordinate;
        return rect;
    },
    'update': function update(coordinate, geometry, param) {
        var map = geometry.getMap();
        var firstCoord = geometry._firstCoord,
            firstPoint = geometry._firstClick;

        var cnw = firstPoint,
            cc = param['containerPoint'];
        var x = Math.min(cnw.x, cc.x),
            y = Math.min(cnw.y, cc.y);
        var width = map.computeLength(firstCoord, new Coordinate(coordinate.x, firstCoord.y)),
            height = map.computeLength(firstCoord, new Coordinate(firstCoord.x, coordinate.y));
        geometry.setCoordinates(map.containerPointToCoordinate(new Point(x, y)));
        geometry.setWidth(width);
        geometry.setHeight(height);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('point', {
    'action': 'click',
    'create': function create(coordinate) {
        return new Marker(coordinate);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('polygon', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new LineString(path);
    },
    'update': function update(path, geometry) {
        var symbol = geometry.getSymbol();
        geometry.setCoordinates(path);

        var layer = geometry.getLayer();
        if (layer) {
            var polygon = layer.getGeometryById('polygon');
            if (!polygon && path.length >= 3) {
                polygon = new Polygon([path], {
                    'id': 'polygon'
                });
                if (symbol) {
                    var pSymbol = extendSymbol(symbol, {
                        'lineOpacity': 0
                    });
                    polygon.setSymbol(pSymbol);
                }
                polygon.addTo(layer);
            }
            if (polygon) {
                polygon.setCoordinates(path);
            }
        }
    },
    'generate': function generate(geometry) {
        return new Polygon(geometry.getCoordinates(), {
            'symbol': geometry.getSymbol()
        });
    }
});

DrawTool.registerMode('linestring', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new LineString(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('arccurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new ArcCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('quadbeziercurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new QuadBezierCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('cubicbeziercurve', {
    'action': 'clickDblclick',
    'create': function create(path) {
        return new CubicBezierCurve(path);
    },
    'update': function update(path, geometry) {
        geometry.setCoordinates(path);
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

DrawTool.registerMode('boxZoom', {
    'action': 'drag',
    'create': function create(coordinate) {
        var marker = new Marker(coordinate);
        marker._firstClick = coordinate;
        return marker;
    },
    'update': function update(coordinate, geometry, param) {
        var map = geometry.getMap();
        var p1 = map.coordToContainerPoint(geometry._firstClick),
            p2 = param['containerPoint'];
        var coord = map.containerPointToCoordinate(new Coordinate(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)));
        geometry.setCoordinates(coord).updateSymbol({
            markerWidth: Math.abs(p1.x - p2.x),
            markerHeight: Math.abs(p1.y - p2.y)
        });
    },
    'generate': function generate(geometry) {
        return geometry;
    }
});

var MapBoxZoomHander = function (_Handler) {
    inherits(MapBoxZoomHander, _Handler);

    function MapBoxZoomHander(target) {
        classCallCheck(this, MapBoxZoomHander);

        var _this = possibleConstructorReturn(this, _Handler.call(this, target));

        _this.drawTool = new DrawTool({
            'mode': 'boxZoom',
            'ignoreMouseleave': false
        });
        return _this;
    }

    MapBoxZoomHander.prototype.addHooks = function addHooks() {
        this.target.on('_mousedown', this._onMouseDown, this);
    };

    MapBoxZoomHander.prototype.removeHooks = function removeHooks() {
        this.target.off('_mousedown', this._onMouseDown, this);
        if (this.drawTool.isEnabled()) {
            this.drawTool.remove();
        }
    };

    MapBoxZoomHander.prototype._onMouseDown = function _onMouseDown(param) {
        if (!this.target.options['boxZoom']) {
            return;
        }
        if (param.domEvent.shiftKey) {
            this.drawTool.setSymbol(this.target.options['boxZoomSymbol']).on('drawend', this._boxZoom, this).addTo(this.target);
        }
    };

    MapBoxZoomHander.prototype._boxZoom = function _boxZoom(param) {
        var map = this.target;
        this.drawTool.remove();
        var geometry = param.geometry,
            center = geometry.getCenter(),
            symbol = geometry.getSymbol(),
            w = symbol.markerWidth,
            h = symbol.markerHeight;

        var extent = new Extent(center, map.locateByPoint(center, w, h), map.getProjection());
        var zoom = map.getFitZoom(extent);
        map.animateTo({
            center: extent.getCenter(),
            zoom: zoom
        });
    };

    return MapBoxZoomHander;
}(Handler$1);

Map.mergeOptions({
    'boxZoom': true,
    'boxZoomSymbol': {
        'markerType': 'rectangle',
        'markerLineWidth': 3,
        'markerLineColor': '#1bbc9b',
        'markerLineDasharray': [10, 5],
        'markerFillOpacity': 0.1,
        'markerFill': '#1bbc9b',
        'markerWidth': 1,
        'markerHeight': 1
    }
});

Map.addOnLoadHook('addHandler', 'boxZoom', MapBoxZoomHander);

function equalView(view1, view2) {
    for (var p in view1) {
        if (hasOwn(view1, p)) {
            if (p === 'center') {
                if (view1[p][0] !== view2[p][0] || view1[p][1] !== view2[p][1]) {
                    return false;
                }
            } else if (view1[p] !== view2[p]) {
                return false;
            }
        }
    }
    return true;
}

Map.include({
    animateTo: function animateTo(view) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var step = arguments[2];

        this._stopAnim();
        if (isFunction(options)) {
            step = options;
            options = {};
        }
        var projection = this.getProjection(),
            currView = this.getView(),
            props = {};
        var empty = true;
        for (var p in view) {
            if (hasOwn(view, p) && !isNil(currView[p])) {
                empty = false;
                if (p === 'center') {
                    var from = new Coordinate(currView[p]).toFixed(7),
                        to = new Coordinate(view[p]).toFixed(7);
                    if (!from.equals(to)) {
                        props['center'] = [from, to];
                    }
                } else if (currView[p] !== view[p] && p !== 'around') {
                    props[p] = [currView[p], view[p]];
                }
            }
        }
        if (empty) {
            return this;
        }
        var zoomOrigin = view['around'] || new Point(this.width / 2, this.height / 2);
        var preView = this.getView();
        var renderer = this._getRenderer(),
            framer = function framer(fn) {
            renderer.callInNextFrame(fn);
        };

        var player = this._animPlayer = Animation.animate(props, {
            'easing': options['easing'] || 'out',
            'duration': options['duration'] || this.options['zoomAnimationDuration'],
            'framer': framer
        }, function (frame) {
            if (_this.isRemoved()) {
                player.finish();
                return;
            }
            if (player.playState === 'running') {
                var _view = _this.getView();
                if (!equalView(_view, preView)) {
                    _this._stopAnim();
                    return;
                }
                if (frame.styles['center']) {
                    var center = frame.styles['center'];
                    _this._setPrjCenter(projection.project(center));
                    _this.onMoving(_this._parseEventFromCoord(_this.getCenter()));
                }
                if (!isNil(frame.styles['zoom'])) {
                    _this.onZooming(frame.styles['zoom'], zoomOrigin);
                }
                if (!isNil(frame.styles['pitch'])) {
                    _this.setPitch(frame.styles['pitch']);
                }
                if (!isNil(frame.styles['bearing'])) {
                    _this.setBearing(frame.styles['bearing']);
                }
                preView = _this.getView();
                _this._fireEvent('animating');
            } else if (player.playState === 'finished') {
                if (!player._interupted) {
                    if (props['center']) {
                        _this._setPrjCenter(projection.project(props['center'][1]));
                    }
                    if (!isNil(props['pitch'])) {
                        _this.setPitch(props['pitch'][1]);
                    }
                    if (!isNil(props['bearing'])) {
                        _this.setBearing(props['bearing'][1]);
                    }
                }
                _this._endAnim(props, zoomOrigin, options);
            }
            if (step) {
                step(frame);
            }
        });

        this._startAnim(props, zoomOrigin);

        return this;
    },
    isAnimating: function isAnimating() {
        return !!this._animPlayer;
    },
    isRotating: function isRotating() {
        return this.isDragRotating() || !!this._animRotating;
    },
    _endAnim: function _endAnim(props, zoomOrigin, options) {
        delete this._animRotating;
        var evtType = void 0;
        if (this._animPlayer) {
            evtType = this._animPlayer._interupted ? 'animateinterupted' : 'animateend';
            delete this._animPlayer;
        }
        if (props['center']) {
            this.onMoveEnd(this._parseEventFromCoord(props['center'][1]));
        }
        if (!isNil(props['zoom'])) {
            if (!options['wheelZoom']) {
                this.onZoomEnd(props['zoom'][1], zoomOrigin);
            } else {
                this.onZooming(props['zoom'][1], zoomOrigin);
            }
        }
        if (evtType) {
            this._fireEvent(evtType);
        }
    },
    _startAnim: function _startAnim(props, zoomOrigin) {
        if (!this._animPlayer) {
            return;
        }
        if (props['center']) {
            this.onMoveStart();
        }
        if (props['zoom'] && !this.isZooming()) {
            this.onZoomStart(props['zoom'][1], zoomOrigin);
        }
        if (props['pitch'] || props['bearing']) {
            this._animRotating = true;
        }
        this._fireEvent('animatestart');
        this._animPlayer.play();
    },
    _stopAnim: function _stopAnim() {
        if (this._animPlayer) {
            this._animPlayer._interupted = true;
            this._animPlayer.finish();
        }
    }
});

var events = 'mousedown ' + 'mouseup ' + 'mouseover ' + 'mouseout ' + 'mouseenter ' + 'mouseleave ' + 'mousemove ' + 'click ' + 'dblclick ' + 'contextmenu ' + 'keypress ' + 'touchstart ' + 'touchmove ' + 'touchend ';

Map.include({
    _registerDomEvents: function _registerDomEvents() {
        var dom = this._panels.mapWrapper || this._containerDOM;
        addDomEvent(dom, events, this._handleDOMEvent, this);
    },
    _removeDomEvents: function _removeDomEvents() {
        var dom = this._panels.mapWrapper || this._containerDOM;
        removeDomEvent(dom, events, this._handleDOMEvent, this);
    },
    _handleDOMEvent: function _handleDOMEvent(e) {
        var type = e.type;

        if (type === 'contextmenu') {
            preventDefault(e);
        }
        if (this._ignoreEvent(e)) {
            return;
        }
        var mimicClick = false;

        if (type === 'mousedown' || type === 'touchstart' && e.touches.length === 1) {
            this._mouseDownTime = now();
        } else if (type === 'click' || type === 'touchend' || type === 'contextmenu') {
            if (!this._mouseDownTime) {
                return;
            } else {
                var downTime = this._mouseDownTime;
                delete this._mouseDownTime;
                var time = now();
                if (time - downTime > 300) {
                    if (type === 'click' || type === 'contextmenu') {
                        return;
                    }
                } else if (type === 'touchend') {
                    mimicClick = true;
                }
            }
        }

        this._fireDOMEvent(this, e, type);
        if (mimicClick) {
            var mimicDblClick = false;
            this._fireDOMEvent(this, e, 'click');
            if (this._clickTime && now() - this._clickTime <= 300) {
                mimicDblClick = true;
                delete this._clickTime;
            } else {
                this._clickTime = now();
            }
            if (mimicDblClick) {
                this._fireDOMEvent(this, e, 'dblclick');
            }
        }
    },
    _ignoreEvent: function _ignoreEvent(domEvent) {
        if (!domEvent || !this._panels.control) {
            return false;
        }
        if (this._isEventOutMap(domEvent)) {
            return true;
        }
        var target = domEvent.srcElement || domEvent.target;
        if (target) {
            while (target && target !== this._containerDOM) {
                if (target.className && target.className.indexOf && (target.className.indexOf('maptalks-control') >= 0 || target.className.indexOf('maptalks-ui') >= 0)) {
                    return true;
                }
                target = target.parentNode;
            }
        }
        return false;
    },
    _isEventOutMap: function _isEventOutMap(domEvent) {
        if (this.getPitch() > this.options['maxVisualPitch']) {
            var actualEvent = this._getActualEvent(domEvent);
            var eventPos = getEventContainerPoint(actualEvent, this._containerDOM);
            if (!this.getContainerExtent().contains(eventPos)) {
                return true;
            }
        }
        return false;
    },
    _parseEvent: function _parseEvent(e, type) {
        if (!e) {
            return null;
        }
        var eventParam = {
            'domEvent': e
        };
        if (type !== 'keypress') {
            var actual = this._getActualEvent(e);
            if (actual) {
                var containerPoint = getEventContainerPoint(actual, this._containerDOM);
                eventParam = extend(eventParam, {
                    'coordinate': this.containerPointToCoord(containerPoint),
                    'containerPoint': containerPoint,
                    'viewPoint': this.containerPointToViewPoint(containerPoint),
                    'point2d': this._containerPointToPoint(containerPoint)
                });
            }
        }
        return eventParam;
    },
    _parseEventFromCoord: function _parseEventFromCoord(coord) {
        var containerPoint = this._prjToContainerPoint(coord),
            viewPoint = this.containerPointToViewPoint(containerPoint);
        var e = {
            'coordinate': coord,
            'containerPoint': containerPoint,
            'viewPoint': viewPoint,
            'point2d': this.coordToPoint(coord)
        };
        return e;
    },
    _getActualEvent: function _getActualEvent(e) {
        return e.touches && e.touches.length > 0 ? e.touches[0] : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e;
    },
    _fireDOMEvent: function _fireDOMEvent(target, e, type) {
        if (this.isRemoved()) {
            return;
        }
        var eventParam = this._parseEvent(e, type);
        this._fireEvent(type, eventParam);
    }
});

Map.addOnLoadHook('_registerDomEvents');

Map.include({
    isFullScreen: function isFullScreen() {
        return !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    },
    requestFullScreen: function requestFullScreen(dom) {
        this._fireEvent('fullscreenstart');
        this._requestFullScreen(dom || this._containerDOM);

        this._fireEvent('fullscreenend');
        return this;
    },
    cancelFullScreen: function cancelFullScreen() {
        this._cancelFullScreen();

        this._fireEvent('cancelfullscreen');
        return this;
    },
    _requestFullScreen: function _requestFullScreen(dom) {
        if (dom.requestFullScreen) {
            dom.requestFullScreen();
        } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if (dom.webkitRequestFullScreen) {
            dom.webkitRequestFullScreen();
        } else if (dom.msRequestFullScreen) {
            dom.msRequestFullScreen();
        } else {
            var features = 'fullscreen=1,status=no,resizable=yes,top=0,left=0,scrollbars=no,' + 'titlebar=no,menubar=no,location=no,toolbar=no,z-look=yes,' + 'width=' + (screen.availWidth - 8) + ',height=' + (screen.availHeight - 45);
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;

                window.close();
            }
        }
    },
    _cancelFullScreen: function _cancelFullScreen() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            var features = 'fullscreen=no,status=yes,resizable=yes,scrollbars=no,' + 'titlebar=no,menubar=yes,location=yes,toolbar=yes,z-look=yes';
            var newWin = window.open(location.href, '_blank', features);
            if (newWin !== null) {
                window.opener = null;

                window.close();
            }
        }
    }
});

Map.include({
    panTo: function panTo(coordinate) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var step = arguments[2];

        if (!coordinate) {
            return this;
        }
        if (isFunction(options)) {
            step = options;
            options = {};
        }
        coordinate = new Coordinate(coordinate);
        if (typeof options['animation'] === 'undefined' || options['animation']) {
            return this._panAnimation(coordinate, options['duration'], step);
        } else {
            this.setCenter(coordinate);
            return this;
        }
    },

    panBy: function panBy(offset) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var step = arguments[2];

        if (!offset) {
            return this;
        }
        if (isFunction(options)) {
            step = options;
            options = {};
        }
        offset = new Point(offset).multi(-1);
        this.onMoveStart();
        if (typeof options['animation'] === 'undefined' || options['animation']) {
            var target = this.locateByPoint(this.getCenter(), offset.x, offset.y);
            this._panAnimation(target, options['duration'], step);
        } else {
            this._offsetCenterByPixel(offset);
            this.onMoveEnd(this._parseEventFromCoord(this.getCenter()));
        }
        return this;
    },

    _panAnimation: function _panAnimation(target, t, cb) {
        if (!this.options['panAnimation']) {
            return this.setCenter(target);
        }
        return this.animateTo({
            'center': target
        }, {
            'duration': t || this.options['panAnimationDuration']
        }, cb);
    }
});

Geometry.fromJSON = function (json) {
    if (Array.isArray(json)) {
        var result = [];
        for (var i = 0, len = json.length; i < len; i++) {
            var c = Geometry.fromJSON(json[i]);
            if (Array.isArray(json)) {
                result = result.concat(c);
            } else {
                result.push(c);
            }
        }
        return result;
    }

    if (json && !json['feature']) {
        return GeoJSON.toGeometry(json);
    }
    var geometry = void 0;
    if (json['subType']) {
        geometry = Geometry.getJSONClass(json['subType']).fromJSON(json);
        if (!isNil(json['feature']['id'])) {
            geometry.setId(json['feature']['id']);
        }
    } else {
        geometry = GeoJSON.toGeometry(json['feature']);
        if (json['options']) {
            geometry.config(json['options']);
        }
    }
    if (json['symbol']) {
        geometry.setSymbol(json['symbol']);
    }
    if (json['infoWindow']) {
        geometry.setInfoWindow(json['infoWindow']);
    }
    return geometry;
};

Layer.fromJSON = function (layerJSON) {
    if (!layerJSON) {
        return null;
    }
    var layerType = layerJSON['type'];
    var clazz = Layer.getJSONClass(layerType);
    if (!clazz || !clazz.fromJSON) {
        throw new Error('unsupported layer type:' + layerType);
    }
    return clazz.fromJSON(layerJSON);
};

Map.include({
    'JSON_VERSION': '1.0',

    toJSON: function toJSON(options) {
        if (!options) {
            options = {};
        }
        var json = {
            'version': this['JSON_VERSION'],
            'extent': this.getExtent().toJSON()
        };
        json['options'] = this.config();
        json['options']['center'] = this.getCenter();
        json['options']['zoom'] = this.getZoom();

        var baseLayer = this.getBaseLayer();
        if ((isNil(options['baseLayer']) || options['baseLayer']) && baseLayer) {
            json['baseLayer'] = baseLayer.toJSON(options['baseLayer']);
        }
        var extraLayerOptions = {};
        if (options['clipExtent']) {
            if (options['clipExtent'] === true) {
                extraLayerOptions['clipExtent'] = this.getExtent();
            } else {
                extraLayerOptions['clipExtent'] = options['clipExtent'];
            }
        }
        var layersJSON = [];
        if (isNil(options['layers']) || options['layers'] && !Array.isArray(options['layers'])) {
            var layers = this.getLayers();
            for (var i = 0, len = layers.length; i < len; i++) {
                if (!layers[i].toJSON) {
                    continue;
                }
                var opts = extend({}, isObject(options['layers']) ? options['layers'] : {}, extraLayerOptions);
                layersJSON.push(layers[i].toJSON(opts));
            }
            json['layers'] = layersJSON;
        } else if (isArrayHasData(options['layers'])) {
            var _layers = options['layers'];
            for (var _i = 0; _i < _layers.length; _i++) {
                var exportOption = _layers[_i];
                var layer = this.getLayer(exportOption['id']);
                if (!layer.toJSON) {
                    continue;
                }
                var _opts = extend({}, exportOption['options'], extraLayerOptions);
                layersJSON.push(layer.toJSON(_opts));
            }
            json['layers'] = layersJSON;
        } else {
            json['layers'] = [];
        }
        return json;
    }
});

Map.fromJSON = function (container, profile, options) {
    if (!container || !profile) {
        return null;
    }
    if (!options) {
        options = {};
    }
    var map = new Map(container, profile['options']);
    if (isNil(options['baseLayer']) || options['baseLayer']) {
        var baseLayer = Layer.fromJSON(profile['baseLayer']);
        if (baseLayer) {
            map.setBaseLayer(baseLayer);
        }
    }
    if (isNil(options['layers']) || options['layers']) {
        var layers = [];
        var layerJSONs = profile['layers'];
        for (var i = 0; i < layerJSONs.length; i++) {
            var layer = Layer.fromJSON(layerJSONs[i]);
            layers.push(layer);
        }
        map.addLayer(layers);
    }

    return map;
};

Map.include({
    computeLength: function computeLength(coord1, coord2) {
        if (!this.getProjection()) {
            return null;
        }
        var p1 = new Coordinate(coord1),
            p2 = new Coordinate(coord2);
        if (p1.equals(p2)) {
            return 0;
        }
        return this.getProjection().measureLength(p1, p2);
    },

    computeGeometryLength: function computeGeometryLength(geometry) {
        return geometry._computeGeodesicLength(this.getProjection());
    },

    computeGeometryArea: function computeGeometryArea(geometry) {
        return geometry._computeGeodesicArea(this.getProjection());
    },

    identify: function identify(opts, callback) {
        if (!opts) {
            return this;
        }
        var reqLayers = opts['layers'];
        if (!isArrayHasData(reqLayers)) {
            return this;
        }
        var layers = [];
        for (var i = 0, len = reqLayers.length; i < len; i++) {
            if (isString(reqLayers[i])) {
                layers.push(this.getLayer(reqLayers[i]));
            } else {
                layers.push(reqLayers[i]);
            }
        }
        var coordinate = new Coordinate(opts['coordinate']);
        var options = extend({}, opts);
        var hits = [];
        for (var _i = layers.length - 1; _i >= 0; _i--) {
            if (opts['count'] && hits.length >= opts['count']) {
                break;
            }
            var layer = layers[_i];
            if (!layer || !layer.getMap() || !opts['includeInvisible'] && !layer.isVisible() || !opts['includeInternals'] && layer.getId().indexOf(INTERNAL_LAYER_PREFIX) >= 0) {
                continue;
            }
            var layerHits = layer.identify(coordinate, options);
            if (layerHits) {
                if (Array.isArray(layerHits)) {
                    pushIn(hits, layerHits);
                } else {
                    hits.push(layerHits);
                }
            }
        }
        callback.call(this, hits);
        return this;
    }

});

Map.include({
    _zoom: function _zoom(nextZoom, origin) {
        if (!this.options['zoomable'] || this.isZooming()) {
            return;
        }
        origin = this._checkZoomOrigin(origin);
        nextZoom = this._checkZoom(nextZoom);
        this.onZoomStart(nextZoom, origin);
        this._frameZoom = this.getZoom();
        this.onZoomEnd(nextZoom, origin);
    },
    _zoomAnimation: function _zoomAnimation(nextZoom, origin, startScale) {
        if (!this.options['zoomable'] || this.isZooming()) {
            return;
        }

        nextZoom = this._checkZoom(nextZoom);
        if (this.getZoom() === nextZoom) {
            return;
        }
        origin = this._checkZoomOrigin(origin);
        this._startZoomAnim(nextZoom, origin, startScale);
    },
    _checkZoomOrigin: function _checkZoomOrigin(origin) {
        if (!origin || this.options['zoomInCenter']) {
            origin = new Point(this.width / 2, this.height / 2);
        }
        return origin;
    },
    _startZoomAnim: function _startZoomAnim(nextZoom, origin, startScale) {
        if (isNil(startScale)) {
            startScale = 1;
        }
        var endScale = this._getResolution(this._startZoomVal) / this._getResolution(nextZoom);
        var duration = this.options['zoomAnimationDuration'] * Math.abs(endScale - startScale) / Math.abs(endScale - 1);
        this._frameZoom = this._startZoomVal;
        this.animateTo({
            'zoom': nextZoom,
            'around': origin
        }, {
            'duration': duration
        });
    },
    onZoomStart: function onZoomStart(nextZoom, origin) {
        this._zooming = true;
        this._startZoomVal = this.getZoom();
        this._startZoomCoord = this._containerPointToPrj(origin);

        this._fireEvent('zoomstart', { 'from': this._startZoomVal, 'to': nextZoom });
    },
    onZooming: function onZooming(nextZoom, origin, startScale) {
        var frameZoom = this._frameZoom;
        if (frameZoom === nextZoom) {
            return;
        }
        if (isNil(startScale)) {
            startScale = 1;
        }
        this._zoomTo(nextZoom, origin);
        var res = this.getResolution(nextZoom),
            fromRes = this.getResolution(this._startZoomVal),
            scale = fromRes / res / startScale,
            startPoint = this._prjToContainerPoint(this._startZoomCoord, this._startZoomVal);
        var offset = this.getViewPoint();
        if (!this.isRotating() && !startPoint.equals(origin) && scale !== 1) {
            var pitch = this.getPitch();

            var originOffset = startPoint._sub(origin)._multi(1 / (1 - scale));
            if (pitch) {
                originOffset.y /= Math.cos(pitch * Math.PI / 180);
            }
            origin = origin.add(originOffset);
        }
        var matrix = {
            'view': [scale, 0, 0, scale, (origin.x - offset.x) * (1 - scale), (origin.y - offset.y) * (1 - scale)]
        };
        if (Browser$1.retina) {
            origin = origin.multi(2);
        }
        matrix['container'] = [scale, 0, 0, scale, origin.x * (1 - scale), origin.y * (1 - scale)];

        this._fireEvent('zooming', { 'from': this._startZoomVal, 'to': nextZoom, 'origin': origin, 'matrix': matrix });
        this._frameZoom = nextZoom;
    },
    onZoomEnd: function onZoomEnd(nextZoom, origin) {
        var startZoomVal = this._startZoomVal;
        this._zoomTo(nextZoom, origin);
        this._zooming = false;
        this._getRenderer().onZoomEnd();

        this._fireEvent('zoomend', { 'from': startZoomVal, 'to': nextZoom });
        if (!this._verifyExtent(this.getCenter())) {
            this.panTo(this.getMaxExtent().getCenter());
        }
    },
    _zoomTo: function _zoomTo(nextZoom, origin) {
        this._zoomLevel = nextZoom;
        this._calcMatrices();
        if (origin) {
            this._setPrjCoordAtContainerPoint(this._startZoomCoord, origin);
        }
    },
    _checkZoom: function _checkZoom(nextZoom) {
        var maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        if (nextZoom < minZoom) {
            nextZoom = minZoom;
        }
        if (nextZoom > maxZoom) {
            nextZoom = maxZoom;
        }
        return nextZoom;
    }
});

function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
}

function translate(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2],
        a00,
        a01,
        a02,
        a03,
        a10,
        a11,
        a12,
        a13,
        a20,
        a21,
        a22,
        a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
        a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
        a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

        out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
        out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
        out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
}

function scale(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
}

function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) {
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
}

function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11],
        a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11],
        a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15],
        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
}

function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
}

function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
}

function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x * x + y * y + z * z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
}

function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}

function applyMatrix(out, v, e) {
    var x = v[0],
        y = v[1],
        z = v[2];


    var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

    out[0] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    out[1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    out[2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

    return out;
}



function matrixToQuaternion(out, te) {

    var m11 = te[0],
        m12 = te[4],
        m13 = te[8],
        m21 = te[1],
        m22 = te[5],
        m23 = te[9],
        m31 = te[2],
        m32 = te[6],
        m33 = te[10],
        trace = m11 + m22 + m33;
    var s = void 0;

    if (trace > 0) {

        s = 0.5 / Math.sqrt(trace + 1.0);

        out.w = 0.25 / s;
        out.x = (m32 - m23) * s;
        out.y = (m13 - m31) * s;
        out.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {

        s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

        out.w = (m32 - m23) / s;
        out.x = 0.25 * s;
        out.y = (m12 + m21) / s;
        out.z = (m13 + m31) / s;
    } else if (m22 > m33) {

        s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

        out.w = (m13 - m31) / s;
        out.x = (m12 + m21) / s;
        out.y = 0.25 * s;
        out.z = (m23 + m32) / s;
    } else {

        s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

        out.w = (m21 - m12) / s;
        out.x = (m13 + m31) / s;
        out.y = (m23 + m32) / s;
        out.z = 0.25 * s;
    }

    return this;
}

function quaternionToMatrix(out, q) {
    var te = out;

    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    var xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    var yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    var wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    te[0] = 1 - (yy + zz);
    te[4] = xy - wz;
    te[8] = xz + wy;

    te[1] = xy + wz;
    te[5] = 1 - (xx + zz);
    te[9] = yz - wx;

    te[2] = xz - wy;
    te[6] = yz + wx;
    te[10] = 1 - (xx + yy);

    te[3] = 0;
    te[7] = 0;
    te[11] = 0;

    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return te;
}

function setPosition(out, v) {
    var te = out;

    te[12] = v[0];
    te[13] = v[1];
    te[14] = v[2];

    return out;
}

function lookAt(te, eye, target, up) {
    var x = [0, 0, 0];
    var y = [0, 0, 0];
    var z = [0, 0, 0];
    subtract(z, eye, target);

    if (length(z) === 0) {

        z[2] = 1;
    }

    normalize(z, z);
    cross(x, up, z);

    if (length(z) === 0) {

        if (Math.abs(up[2]) === 1) {

            z[0] += 0.0001;
        } else {

            z[2] += 0.0001;
        }

        normalize(z, z);
        cross(x, up, z);
    }

    normalize(x, x);
    cross(y, z, x);

    te[0] = x[0];te[4] = y[0];te[8] = z[0];
    te[1] = x[1];te[5] = y[1];te[9] = z[1];
    te[2] = x[2];te[6] = y[2];te[10] = z[2];

    return te;
}

var RADIAN = Math.PI / 180;
var DEFAULT_FOV = 0.6435011087932844;

Map.include({
    getFov: function getFov() {
        if (!this._fov) {
            this._fov = DEFAULT_FOV;
        }
        return this._fov / RADIAN;
    },
    setFov: function setFov(fov) {
        if (this.isZooming()) {
            return this;
        }
        fov = Math.max(0.01, Math.min(60, fov));
        if (this._fov === fov) return this;
        var from = this.getFov();
        this._fov = fov * RADIAN;
        this._calcMatrices();
        this._renderLayers();

        this._fireEvent('fovchange', { 'from': from, 'to': this.getFov() });
        return this;
    },
    getBearing: function getBearing() {
        if (!this._angle) {
            return 0;
        }
        return -this._angle / RADIAN;
    },
    setBearing: function setBearing(bearing) {
        if (Browser$1.ie9) {
            throw new Error('map can\'t rotate in IE9.');
        }
        var b = -wrap(bearing, -180, 180) * RADIAN;
        if (this._angle === b) return this;
        var from = this.getBearing();

        this._fireEvent('rotatestart', { 'from': from, 'to': b });
        this._angle = b;
        this._calcMatrices();
        this._renderLayers();

        this._fireEvent('rotate', { 'from': from, 'to': b });

        this._fireEvent('rotateend', { 'from': from, 'to': b });
        return this;
    },
    getPitch: function getPitch() {
        if (!this._pitch) {
            return 0;
        }
        return this._pitch / Math.PI * 180;
    },
    setPitch: function setPitch(pitch) {
        if (Browser$1.ie9) {
            throw new Error('map can\'t tilt in IE9.');
        }
        var p = clamp(pitch, 0, this.options['maxPitch']) * RADIAN;
        if (this._pitch === p) return this;
        var from = this.getPitch();

        this._fireEvent('pitchstart', { 'from': from, 'to': p });
        this._pitch = p;
        this._calcMatrices();
        this._renderLayers();

        this._fireEvent('pitch', { 'from': from, 'to': p });

        this._fireEvent('pitchend', { 'from': from, 'to': p });
        return this;
    },
    isTransforming: function isTransforming() {
        return !!(this._pitch || this._angle);
    },
    getFrustumAltitude: function getFrustumAltitude() {
        var pitch = 90 - this.getPitch();
        var fov = this.getFov() / 2;
        var cameraAlt = this.cameraPosition ? this.cameraPosition[2] : 0;
        if (fov <= pitch) {
            return cameraAlt;
        }
        fov = Math.PI * fov / 180;
        var d1 = new Point(this.cameraPosition).distanceTo(this.cameraLookAt),
            d2 = cameraAlt * Math.tan(fov * 2);
        var d = Math.tan(fov) * (d1 + d2);
        return cameraAlt + d;
    },
    _pointToContainerPoint: function _pointToContainerPoint(point, zoom) {
        var altitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        point = this._pointToPoint(point, zoom);
        if (this.isTransforming() || altitude) {
            altitude *= this.getResolution(zoom) / this.getResolution();
            var scale$$1 = this._glScale;
            var t = [point.x * scale$$1, point.y * scale$$1, altitude * scale$$1];

            applyMatrix(t, t, this.projViewMatrix);

            var w2 = this.width / 2,
                h2 = this.height / 2;
            t[0] = t[0] * w2 + w2;
            t[1] = -(t[1] * h2) + h2;
            return new Point(t[0], t[1]);
        } else {
            var centerPoint = this._prjToPoint(this._getPrjCenter());
            return point._sub(centerPoint)._add(this.width / 2, this.height / 2);
        }
    },
    _containerPointToPoint: function _containerPointToPoint(p, zoom) {
        if (this.isTransforming()) {
            var w2 = this.width / 2,
                h2 = this.height / 2;
            var cp = [(p.x - w2) / w2, (h2 - p.y) / h2];

            var coord0 = [cp[0], cp[1], 0, 1];
            var coord1 = [cp[0], cp[1], 1, 1];

            applyMatrix(coord0, coord0, this.projViewMatrixInverse);
            applyMatrix(coord1, coord1, this.projViewMatrixInverse);
            var x0 = coord0[0];
            var x1 = coord1[0];
            var y0 = coord0[1];
            var y1 = coord1[1];
            var z0 = coord0[2];
            var z1 = coord1[2];

            var t = z0 === z1 ? 0 : (0 - z0) / (z1 - z0);

            var point = new Point(interpolate(x0, x1, t), interpolate(y0, y1, t))._multi(1 / this._glScale);
            return zoom === undefined || this.getZoom() === zoom ? point : this._pointToPointAtZoom(point, zoom);
        }
        var centerPoint = this._prjToPoint(this._getPrjCenter(), zoom),
            scale$$1 = zoom !== undefined ? this._getResolution() / this._getResolution(zoom) : 1;
        var x = scale$$1 * (p.x - this.width / 2),
            y = scale$$1 * (p.y - this.height / 2);
        return centerPoint._add(x, y);
    },

    _calcMatrices: function () {
        var m0 = Browser$1.ie9 ? null : createMat4(),
            m1 = Browser$1.ie9 ? null : createMat4();
        return function () {
            var size = this.getSize();
            if (size.width === 0 || size.height === 0 || Browser$1.ie9) {
                return;
            }
            this._glScale = this.getGLScale();

            var fov = this.getFov() * Math.PI / 180;
            var maxScale = this.getScale(this.getMinZoom()) / this.getScale(this.getMaxNativeZoom());
            var farZ = maxScale * size.height / 2 / this._getFovRatio() + 1;

            var projMatrix = this.projMatrix || createMat4();
            perspective(projMatrix, fov, size.width / size.height, 0.1, farZ);
            scale(projMatrix, projMatrix, [1, -1, 1]);
            this.projMatrix = projMatrix;

            var worldMatrix = this._getCameraWorldMatrix();

            this.viewMatrix = invert(m0, worldMatrix);

            this.projViewMatrix = multiply(this.projViewMatrix || createMat4(), projMatrix, this.viewMatrix);

            this.projViewMatrixInverse = multiply(this.projViewMatrixInverse || createMat4(), worldMatrix, invert(m1, projMatrix));
            this.domCssMatrix = this._calcDomMatrix();
        };
    }(),

    _calcDomMatrix: function () {
        var m = Browser$1.ie9 ? null : createMat4();
        return function () {
            var cameraToCenterDistance = 0.5 / Math.tan(this._fov / 2) * this.height;
            translate(m, this.projMatrix, [0, 0, -cameraToCenterDistance]);
            if (this._pitch) {
                rotateX(m, m, this._pitch);
            }
            if (this._angle) {
                rotateZ(m, m, this._angle);
            }
            var m1 = createMat4();
            scale(m1, m1, [this.width / 2, -this.height / 2, 1]);
            return multiply(this.domCssMatrix || createMat4(), m1, m);
        };
    }(),

    _getCameraWorldMatrix: function _getCameraWorldMatrix() {
        var targetZ = this.getGLZoom();

        var size = this.getSize(),
            scale$$1 = this.getGLScale();
        var center2D = this.cameraLookAt = this._prjToPoint(this._prjCenter, targetZ);

        var pitch = this.getPitch() * RADIAN;
        var bearing = -this.getBearing() * RADIAN;

        var ratio = this._getFovRatio();
        var z = scale$$1 * size.height / 2 / ratio;
        var cz = z * Math.cos(pitch);

        var dist = Math.sin(pitch) * z;

        var cx = center2D.x + dist * Math.sin(bearing);
        var cy = center2D.y + dist * Math.cos(bearing);
        this.cameraPosition = [cx, cy, cz];

        var d = dist || 1;
        var up = [Math.sin(bearing) * d, Math.cos(bearing) * d, 0];
        var m = this.cameraWorldMatrix || createMat4();
        lookAt(m, [cx, cy, cz], [center2D.x, center2D.y, 0], up);

        var q = {};
        matrixToQuaternion(q, m);
        quaternionToMatrix(m, q);
        setPosition(m, [cx, cy, cz]);

        return m;
    },
    _getFovRatio: function _getFovRatio() {
        var fov = this.getFov();
        return Math.tan(fov / 2 * RADIAN);
    },
    _renderLayers: function _renderLayers() {
        if (this.isInteracting()) {
            return;
        }
        var layers = this._getLayers();

        layers.forEach(function (layer) {
            if (!layer) {
                return;
            }
            var renderer = layer._getRenderer();
            if (renderer && renderer.setToRedraw) {
                renderer.setToRedraw();
            }
        });
    }
});

function createMat4() {
    var out = new Float64Array(16);
    out[0] = out[5] = out[10] = out[15] = 1;
    return out;
}

Map.include({
    _onViewChange: function _onViewChange(view) {
        if (!this._viewHistory) {
            this._viewHistory = [];
            this._viewHistoryPointer = 0;
        }

        for (var i = this._viewHistory.length - 1; i >= 0; i--) {
            if (equalMapView(view, this._viewHistory[i])) {
                this._viewHistoryPointer = i;
                return;
            }
        }
        var old = this._getCurrentView();
        if (this._viewHistoryPointer < this._viewHistory.length - 1) {
            this._viewHistory.splice(this._viewHistoryPointer + 1);
        }
        this._viewHistory.push(view);
        var count = this.options['viewHistoryCount'];
        if (count > 0 && this._viewHistory.length > count) {
            this._viewHistory.splice(0, this._viewHistory.length - count);
        }
        this._viewHistoryPointer = this._viewHistory.length - 1;

        this._fireViewChange(old, view);
    },
    zoomToPreviousView: function zoomToPreviousView() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!this.hasPreviousView()) {
            return null;
        }
        var view = this._viewHistory[--this._viewHistoryPointer];
        this._zoomToView(view, options);
        return view;
    },
    hasPreviousView: function hasPreviousView() {
        if (!this._viewHistory || this._viewHistoryPointer === 0) {
            return false;
        }
        return true;
    },
    zoomToNextView: function zoomToNextView() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!this.hasNextView()) {
            return null;
        }
        var view = this._viewHistory[++this._viewHistoryPointer];
        this._zoomToView(view, options);
        return view;
    },
    hasNextView: function hasNextView() {
        if (!this._viewHistory || this._viewHistoryPointer === this._viewHistory.length - 1) {
            return false;
        }
        return true;
    },
    _zoomToView: function _zoomToView(view, options) {
        var _this = this;

        var old = this.getView();
        if (options['animation']) {
            this.animateTo(view, {
                'duration': options['duration']
            }, function (frame) {
                if (frame.state.playState === 'finished') {
                    _this._fireViewChange(old, view);
                }
            });
        } else {
            this.setView(view);
            this._fireViewChange(old, view);
        }
    },
    getViewHistory: function getViewHistory() {
        return this._viewHistory;
    },
    _fireViewChange: function _fireViewChange(old, view) {
        this._fireEvent('viewchange', {
            'old': old,
            'new': view
        });
    },
    _getCurrentView: function _getCurrentView() {
        if (!this._viewHistory) {
            return null;
        }
        return this._viewHistory[this._viewHistoryPointer];
    }
});

Map.mergeOptions({
    'viewHistory': true,
    'viewHistoryCount': 10
});

var options$17 = {
    'mode': 'LineString',
    'language': 'zh-CN',
    'metric': true,
    'imperial': false,
    'symbol': {
        'lineColor': '#000',
        'lineWidth': 3,
        'lineOpacity': 1
    },
    'vertexSymbol': {
        'markerType': 'ellipse',
        'markerFill': '#fff',
        'markerLineColor': '#000',
        'markerLineWidth': 3,
        'markerWidth': 11,
        'markerHeight': 11
    },
    'labelOptions': {
        'textSymbol': {
            'textFaceName': 'monospace',
            'textLineSpacing': 1,
            'textHorizontalAlignment': 'right',
            'textDx': 15
        },
        'boxStyle': {
            'padding': [6, 2],
            'symbol': {
                'markerType': 'square',
                'markerFill': '#fff',
                'markerFillOpacity': 0.9,
                'markerLineColor': '#b4b3b3'
            }
        }
    },
    'clearButtonSymbol': [{
        'markerType': 'square',
        'markerFill': '#fff',
        'markerLineColor': '#b4b3b3',
        'markerLineWidth': 2,
        'markerWidth': 15,
        'markerHeight': 15,
        'markerDx': 20
    }, {
        'markerType': 'x',
        'markerWidth': 10,
        'markerHeight': 10,
        'markerDx': 20
    }]
};

var DistanceTool = function (_DrawTool) {
    inherits(DistanceTool, _DrawTool);

    function DistanceTool(options) {
        classCallCheck(this, DistanceTool);

        var _this = possibleConstructorReturn(this, _DrawTool.call(this, options));

        _this.on('enable', _this._afterEnable, _this).on('disable', _this._afterDisable, _this);
        _this._measureLayers = [];
        return _this;
    }

    DistanceTool.prototype.clear = function clear() {
        if (isArrayHasData(this._measureLayers)) {
            for (var i = 0; i < this._measureLayers.length; i++) {
                this._measureLayers[i].remove();
            }
        }
        delete this._lastMeasure;
        delete this._lastVertex;
        this._measureLayers = [];
        return this;
    };

    DistanceTool.prototype.getMeasureLayers = function getMeasureLayers() {
        return this._measureLayers;
    };

    DistanceTool.prototype.getLastMeasure = function getLastMeasure() {
        if (!this._lastMeasure) {
            return 0;
        }
        return this._lastMeasure;
    };

    DistanceTool.prototype._measure = function _measure(toMeasure) {
        var map = this.getMap();
        var length = void 0;
        if (toMeasure instanceof Geometry) {
            length = map.computeGeometryLength(toMeasure);
        } else if (Array.isArray(toMeasure)) {
            length = map.getProjection().measureLength(toMeasure);
        }
        this._lastMeasure = length;
        var units = void 0;
        if (this.options['language'] === 'zh-CN') {
            units = [' 米', ' 公里', ' 英尺', ' 英里'];
        } else {
            units = [' m', ' km', ' feet', ' mile'];
        }
        var content = '';
        if (this.options['metric']) {
            content += length < 1000 ? length.toFixed(0) + units[0] : (length / 1000).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            length *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            content += length < 5280 ? length.toFixed(0) + units[2] : (length / 5280).toFixed(2) + units[3];
        }
        return content;
    };

    DistanceTool.prototype._registerMeasureEvents = function _registerMeasureEvents() {
        this.on('drawstart', this._msOnDrawStart, this).on('drawvertex', this._msOnDrawVertex, this).on('mousemove', this._msOnMouseMove, this).on('drawend', this._msOnDrawEnd, this);
    };

    DistanceTool.prototype._afterEnable = function _afterEnable() {
        this._registerMeasureEvents();
    };

    DistanceTool.prototype._afterDisable = function _afterDisable() {
        this.off('drawstart', this._msOnDrawStart, this).off('drawvertex', this._msOnDrawVertex, this).off('mousemove', this._msOnMouseMove, this).off('drawend', this._msOnDrawEnd, this);
    };

    DistanceTool.prototype._msOnDrawStart = function _msOnDrawStart(param) {
        var map = this.getMap();
        var uid = UID();
        var layerId = 'distancetool_' + uid;
        var markerLayerId = 'distancetool_markers_' + uid;
        if (!map.getLayer(layerId)) {
            this._measureLineLayer = new VectorLayer(layerId).addTo(map);
            this._measureMarkerLayer = new VectorLayer(markerLayerId).addTo(map);
        } else {
            this._measureLineLayer = map.getLayer(layerId);
            this._measureMarkerLayer = map.getLayer(markerLayerId);
        }
        this._measureLayers.push(this._measureLineLayer);
        this._measureLayers.push(this._measureMarkerLayer);

        new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var content = this.options['language'] === 'zh-CN' ? '起点' : 'start';
        var startLabel = new Label(content, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(startLabel);
    };

    DistanceTool.prototype._msOnMouseMove = function _msOnMouseMove(param) {
        var ms = this._measure(this._msGetCoordsToMeasure(param));
        if (!this._tailMarker) {
            var symbol = extendSymbol(this.options['vertexSymbol']);
            symbol['markerWidth'] /= 2;
            symbol['markerHeight'] /= 2;
            this._tailMarker = new Marker(param['coordinate'], {
                'symbol': symbol
            }).addTo(this._measureMarkerLayer);
            this._tailLabel = new Label(ms, param['coordinate'], this.options['labelOptions']).addTo(this._measureMarkerLayer);
        }
        this._tailMarker.setCoordinates(param['coordinate']);
        this._tailLabel.setContent(ms);
        this._tailLabel.setCoordinates(param['coordinate']);
    };

    DistanceTool.prototype._msGetCoordsToMeasure = function _msGetCoordsToMeasure(param) {
        return param['geometry'].getCoordinates().concat([param['coordinate']]);
    };

    DistanceTool.prototype._msOnDrawVertex = function _msOnDrawVertex(param) {
        var geometry = param['geometry'];

        new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        var length = this._measure(geometry);
        var vertexLabel = new Label(length, param['coordinate'], this.options['labelOptions']);
        this._measureMarkerLayer.addGeometry(vertexLabel);
        this._lastVertex = vertexLabel;
    };

    DistanceTool.prototype._msOnDrawEnd = function _msOnDrawEnd(param) {
        this._clearTailMarker();
        var size = this._lastVertex.getSize();
        if (!size) {
            size = new Size(10, 10);
        }
        this._addClearMarker(this._lastVertex.getCoordinates(), size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getLength();
    };

    DistanceTool.prototype._addClearMarker = function _addClearMarker(coordinates, dx) {
        var symbol = this.options['clearButtonSymbol'];
        var dxSymbol = {
            'markerDx': (symbol['markerDx'] || 0) + dx,
            'textDx': (symbol['textDx'] || 0) + dx
        };
        if (Array.isArray(symbol)) {
            dxSymbol = symbol.map(function (s) {
                if (s) {
                    return {
                        'markerDx': (s['markerDx'] || 0) + dx,
                        'textDx': (s['textDx'] || 0) + dx
                    };
                }
                return null;
            });
        }
        symbol = extendSymbol(symbol, dxSymbol);
        var endMarker = new Marker(coordinates, {
            'symbol': symbol
        });
        var measureLineLayer = this._measureLineLayer,
            measureMarkerLayer = this._measureMarkerLayer;
        endMarker.on('click', function () {
            measureLineLayer.remove();
            measureMarkerLayer.remove();

            return false;
        }, this);
        endMarker.addTo(this._measureMarkerLayer);
    };

    DistanceTool.prototype._clearTailMarker = function _clearTailMarker() {
        if (this._tailMarker) {
            this._tailMarker.remove();
            delete this._tailMarker;
        }
        if (this._tailLabel) {
            this._tailLabel.remove();
            delete this._tailLabel;
        }
    };

    return DistanceTool;
}(DrawTool);

DistanceTool.mergeOptions(options$17);

var options$18 = {
    'mode': 'Polygon',
    'symbol': {
        'lineColor': '#000000',
        'lineWidth': 2,
        'lineOpacity': 1,
        'lineDasharray': '',
        'polygonFill': '#ffffff',
        'polygonOpacity': 0.5
    }
};

var AreaTool = function (_DistanceTool) {
    inherits(AreaTool, _DistanceTool);

    function AreaTool(options) {
        classCallCheck(this, AreaTool);

        var _this = possibleConstructorReturn(this, _DistanceTool.call(this, options));

        _this.on('enable', _this._afterEnable, _this).on('disable', _this._afterDisable, _this);
        _this._measureLayers = [];
        return _this;
    }

    AreaTool.prototype._measure = function _measure(toMeasure) {
        var map = this.getMap();
        var area = void 0;
        if (toMeasure instanceof Geometry) {
            area = map.computeGeometryArea(toMeasure);
        } else if (Array.isArray(toMeasure)) {
            area = map.getProjection().measureArea(toMeasure);
        }
        this._lastMeasure = area;
        var units = void 0;
        if (this.options['language'] === 'zh-CN') {
            units = [' 平方米', ' 平方公里', ' 平方英尺', ' 平方英里'];
        } else {
            units = [' sq.m', ' sq.km', ' sq.ft', ' sq.mi'];
        }
        var content = '';
        if (this.options['metric']) {
            content += area < 1E6 ? area.toFixed(0) + units[0] : (area / 1E6).toFixed(2) + units[1];
        }
        if (this.options['imperial']) {
            area *= 3.2808399;
            if (content.length > 0) {
                content += '\n';
            }
            var sqmi = 5280 * 5280;
            content += area < sqmi ? area.toFixed(0) + units[2] : (area / sqmi).toFixed(2) + units[3];
        }
        return content;
    };

    AreaTool.prototype._msGetCoordsToMeasure = function _msGetCoordsToMeasure(param) {
        return param['geometry'].getShell().concat([param['coordinate']]);
    };

    AreaTool.prototype._msOnDrawVertex = function _msOnDrawVertex(param) {
        var vertexMarker = new Marker(param['coordinate'], {
            'symbol': this.options['vertexSymbol']
        }).addTo(this._measureMarkerLayer);
        this._measure(param['geometry']);
        this._lastVertex = vertexMarker;
    };

    AreaTool.prototype._msOnDrawEnd = function _msOnDrawEnd(param) {
        this._clearTailMarker();

        var ms = this._measure(param['geometry']);
        var endLabel = new Label(ms, param['coordinate'], this.options['labelOptions']).addTo(this._measureMarkerLayer);
        var size = endLabel.getSize();
        if (!size) {
            size = new Size(10, 10);
        }
        this._addClearMarker(param['coordinate'], size['width']);
        var geo = param['geometry'].copy();
        geo.addTo(this._measureLineLayer);
        this._lastMeasure = geo.getArea();
    };

    return AreaTool;
}(DistanceTool);

AreaTool.mergeOptions(options$18);

function parse(arcConf) {
    var tileInfo = arcConf['tileInfo'],
        tileSize = [tileInfo['cols'], tileInfo['rows']],
        resolutions = [],
        lods = tileInfo['lods'];
    for (var i = 0, len = lods.length; i < len; i++) {
        resolutions.push(lods[i]['resolution']);
    }
    var fullExtent = arcConf['fullExtent'],
        origin = tileInfo['origin'],
        tileSystem = [1, -1, origin['x'], origin['y']];
    delete fullExtent['spatialReference'];
    return {
        'spatialReference': {
            'resolutions': resolutions,
            'fullExtent': fullExtent
        },
        'tileSystem': tileSystem,
        'tileSize': tileSize
    };
}

SpatialReference.loadArcgis = function (url, cb) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { 'jsonp': true };

    if (isString(url) && url.substring(0, 1) !== '{') {
        Ajax.getJSON(url, function (err, json) {
            if (err) {
                cb(err);
                return;
            }
            var spatialRef = parse(json);
            cb(null, spatialRef);
        }, options);
    } else {
        if (isString(url)) {
            url = parseJSON(url);
        }
        var spatialRef = parse(url);
        cb(null, spatialRef);
    }
    return this;
};

var options$19 = {
    'eventsToStop': 'mousedown dblclick',
    'dx': 0,
    'dy': 0,
    'autoPan': false,
    'autoPanDuration': 600,
    'single': true,
    'animation': 'scale',
    'animationOnHide': true,
    'animationDuration': 500
};

var UIComponent = function (_Eventable) {
    inherits(UIComponent, _Eventable);

    function UIComponent(options) {
        classCallCheck(this, UIComponent);
        return possibleConstructorReturn(this, _Eventable.call(this, options));
    }

    UIComponent.prototype.addTo = function addTo(owner) {
        this._owner = owner;

        this._switchEvents('on');
        if (this.onAdd) {
            this.onAdd();
        }

        this.fire('add');
        return this;
    };

    UIComponent.prototype.getMap = function getMap() {
        if (!this._owner) {
            return null;
        }

        if (this._owner.getBaseLayer) {
            return this._owner;
        }
        return this._owner.getMap();
    };

    UIComponent.prototype.show = function show(coordinate) {
        var map = this.getMap();
        if (!map) {
            return this;
        }
        coordinate = coordinate || this._coordinate || this._owner.getCenter();

        var visible = this.isVisible();

        this.fire('showstart');
        var container = this._getUIContainer();
        this._coordinate = coordinate;
        this._removePrevDOM();
        var dom = this.__uiDOM = this.buildOn(map);

        if (!dom) {
            this.fire('showend');
            return this;
        }

        this._measureSize(dom);

        if (this._singleton()) {
            map[this._uiDomKey()] = dom;
        }

        this._setPosition();

        dom.style[TRANSITION] = null;

        container.appendChild(dom);

        var anim = this._getAnimation();

        if (visible) {
            anim.ok = false;
        }

        if (anim.ok) {
            if (anim.fade) {
                dom.style.opacity = 0;
            }
            if (anim.scale) {
                if (this.getTransformOrigin) {
                    var origin = this.getTransformOrigin();
                    dom.style[TRANSFORMORIGIN] = origin.x + 'px ' + origin.y + 'px';
                }
                dom.style[TRANSFORM] = toCSSTranslate(this._pos) + ' scale(0)';
            }
        }

        dom.style.display = '';

        if (this.options['eventsToStop']) {
            on(dom, this.options['eventsToStop'], stopPropagation);
        }

        if (this.options['autoPan']) {
            this._autoPan();
        }

        var transition = anim.transition;
        if (anim.ok && transition) {
            dom.offsetHeight;

            if (transition) {
                dom.style[TRANSITION] = transition;
            }
            if (anim.fade) {
                dom.style.opacity = 1;
            }
            if (anim.scale) {
                dom.style[TRANSFORM] = toCSSTranslate(this._pos) + ' scale(1)';
            }
        }

        this.fire('showend');
        return this;
    };

    UIComponent.prototype.hide = function hide() {
        if (!this.getDOM() || !this.getMap()) {
            return this;
        }

        var anim = this._getAnimation(),
            dom = this.getDOM();
        if (!this.options['animationOnHide']) {
            anim.ok = false;
        }
        if (!anim.ok) {
            dom.style.display = 'none';
        } else {
            dom.offsetHeight;

            dom.style[TRANSITION] = anim.transition;
            setTimeout(function () {
                dom.style.display = 'none';
            }, this.options['animationDuration']);
        }
        if (anim.fade) {
            dom.style.opacity = 0;
        }
        if (anim.scale) {
            dom.style[TRANSFORM] = toCSSTranslate(this._pos) + ' scale(0)';
        }

        this.fire('hide');
        return this;
    };

    UIComponent.prototype.isVisible = function isVisible() {
        var dom = this.getDOM();
        return this.getMap() && dom && dom.parentNode && dom.style.display !== 'none';
    };

    UIComponent.prototype.remove = function remove() {
        if (!this._owner) {
            return this;
        }
        this.hide();
        this._switchEvents('off');
        if (this.onRemove) {
            this.onRemove();
        }
        if (!this._singleton() && this.__uiDOM) {
            this._removePrevDOM();
        }
        delete this._owner;

        this.fire('remove');
        return this;
    };

    UIComponent.prototype.getSize = function getSize() {
        if (this._size) {
            return this._size.copy();
        } else {
            return null;
        }
    };

    UIComponent.prototype.getOwner = function getOwner() {
        return this._owner;
    };

    UIComponent.prototype.getDOM = function getDOM() {
        return this.__uiDOM;
    };

    UIComponent.prototype.getPosition = function getPosition() {
        if (!this.getMap()) {
            return null;
        }
        var p = this._getViewPoint()._round();
        if (this.getOffset) {
            var o = this.getOffset()._round();
            if (o) {
                p._add(o);
            }
        }
        return p;
    };

    UIComponent.prototype._getAnimation = function _getAnimation() {
        var anim = {
            'fade': false,
            'scale': false
        };
        var animations = this.options['animation'] ? this.options['animation'].split(',') : [];
        for (var i = 0; i < animations.length; i++) {
            var trimed = trim(animations[i]);
            if (trimed === 'fade') {
                anim.fade = true;
            } else if (trimed === 'scale') {
                anim.scale = true;
            }
        }
        var transition = null;
        if (anim.fade) {
            transition = 'opacity ' + this.options['animationDuration'] + 'ms';
        }
        if (anim.scale) {
            transition = transition ? transition + ',' : '';
            transition += TRANSFORM + ' ' + this.options['animationDuration'] + 'ms';
        }
        anim.transition = transition;
        anim.ok = transition !== null;
        return anim;
    };

    UIComponent.prototype._getViewPoint = function _getViewPoint() {
        return this.getMap().coordToViewPoint(this._coordinate)._add(this.options['dx'], this.options['dy']);
    };

    UIComponent.prototype._autoPan = function _autoPan() {
        var map = this.getMap(),
            dom = this.getDOM();
        if (map.isMoving()) {
            return;
        }
        var point = this._pos;
        var mapSize = map.getSize(),
            mapWidth = mapSize['width'],
            mapHeight = mapSize['height'];

        var containerPoint = map.viewPointToContainerPoint(point);
        var clientWidth = parseInt(dom.clientWidth),
            clientHeight = parseInt(dom.clientHeight);
        var left = 0,
            top = 0;
        if (containerPoint.x < 0) {
            left = -(containerPoint.x - clientWidth / 2);
        } else if (containerPoint.x + clientWidth - 35 > mapWidth) {
            left = mapWidth - (containerPoint.x + clientWidth * 3 / 2);
        }
        if (containerPoint.y < 0) {
            top = -containerPoint.y + 50;
        } else if (containerPoint.y > mapHeight) {
            top = mapHeight - containerPoint.y - clientHeight - 30;
        }
        if (top !== 0 || left !== 0) {
            map.panBy(new Point(left, top), { 'duration': this.options['autoPanDuration'] });
        }
    };

    UIComponent.prototype._measureSize = function _measureSize(dom) {
        var container = this._getUIContainer();
        dom.style.position = 'absolute';
        dom.style.left = -99999 + 'px';
        dom.style.top = -99999 + 'px';
        dom.style.display = '';
        container.appendChild(dom);
        this._size = new Size(dom.clientWidth, dom.clientHeight);
        dom.style.display = 'none';
        dom.style.left = '0px';
        dom.style.top = '0px';
        return this._size;
    };

    UIComponent.prototype._removePrevDOM = function _removePrevDOM() {
        if (this.onDomRemove) {
            this.onDomRemove();
        }
        var eventsToStop = this.options['eventsToStop'];
        if (this._singleton()) {
            var map = this.getMap(),
                key = this._uiDomKey();
            if (map[key]) {
                if (eventsToStop) {
                    off(map[key], eventsToStop, stopPropagation);
                }
                removeDomNode(map[key]);
                delete map[key];
            }
            delete this.__uiDOM;
        } else if (this.__uiDOM) {
            if (eventsToStop) {
                off(this.__uiDOM, eventsToStop, stopPropagation);
            }
            removeDomNode(this.__uiDOM);
            delete this.__uiDOM;
        }
    };

    UIComponent.prototype._uiDomKey = function _uiDomKey() {
        return '__ui_' + this._getClassName();
    };

    UIComponent.prototype._singleton = function _singleton() {
        return this.options['single'];
    };

    UIComponent.prototype._getUIContainer = function _getUIContainer() {
        return this.getMap()._panels['ui'];
    };

    UIComponent.prototype._getClassName = function _getClassName() {
        return 'UIComponent';
    };

    UIComponent.prototype._switchEvents = function _switchEvents(to) {
        var events = this._getDefaultEvents();
        if (this.getEvents) {
            extend(events, this.getEvents());
        }
        if (events) {
            var map = this.getMap();
            if (map) {
                for (var p in events) {
                    if (events.hasOwnProperty(p)) {
                        map[to](p, events[p], this);
                    }
                }
            }
        }
        var ownerEvents = this._getOwnerEvents();
        if (this._owner) {
            for (var _p in ownerEvents) {
                if (ownerEvents.hasOwnProperty(_p)) {
                    this._owner[to](_p, ownerEvents[_p], this);
                }
            }
        }
    };

    UIComponent.prototype._getDefaultEvents = function _getDefaultEvents() {
        return {
            'zooming rotate pitch': this.onEvent,
            'zoomend': this.onZoomEnd,
            'moving': this.onMoving
        };
    };

    UIComponent.prototype._getOwnerEvents = function _getOwnerEvents() {
        var events = {};
        if (this._owner && this._owner instanceof Geometry) {
            events.positionchange = this.onGeometryPositionChange;
        }
        if (this.getOwnerEvents) {
            extend(events, this.getOwnerEvents());
        }
        return events;
    };

    UIComponent.prototype.onGeometryPositionChange = function onGeometryPositionChange(param) {
        if (this._owner && this.isVisible()) {
            this.show(param['target'].getCenter());
        }
    };

    UIComponent.prototype.onMoving = function onMoving() {
        if (this.isVisible() && this.getMap().isTransforming()) {
            this._updatePosition();
        }
    };

    UIComponent.prototype.onEvent = function onEvent() {
        if (this.isVisible()) {
            this._updatePosition();
        }
    };

    UIComponent.prototype.onZoomEnd = function onZoomEnd() {
        if (this.isVisible()) {
            this._setPosition();
        }
    };

    UIComponent.prototype._updatePosition = function _updatePosition() {
        var renderer = this.getMap()._getRenderer();
        renderer.callInNextFrame(this._setPosition.bind(this));
    };

    UIComponent.prototype._setPosition = function _setPosition() {
        var dom = this.getDOM(),
            p = this.getPosition();
        this._pos = p;
        dom.style[TRANSITION] = null;
        dom.style[TRANSFORM] = toCSSTranslate(p) + ' scale(1)';
    };

    return UIComponent;
}(Eventable(Class));

UIComponent.mergeOptions(options$19);

function toCSSTranslate(p) {
    if (!p) {
        return '';
    }
    if (Browser$1.any3d) {
        return 'translate3d(' + p.x + 'px,' + p.y + 'px, 0px)';
    } else {
        return 'translate(' + p.x + 'px,' + p.y + 'px)';
    }
}

var options$20 = {
    'draggable': false,
    'single': false,
    'content': null
};

var domEvents = 'mousedown ' + 'mouseup ' + 'mouseenter ' + 'mouseover ' + 'mouseout ' + 'mousemove ' + 'click ' + 'dblclick ' + 'contextmenu ' + 'keypress ' + 'touchstart ' + 'touchmove ' + 'touchend';

var UIMarker = function (_Handlerable) {
    inherits(UIMarker, _Handlerable);

    function UIMarker(coordinate, options) {
        classCallCheck(this, UIMarker);

        var _this = possibleConstructorReturn(this, _Handlerable.call(this, options));

        _this._markerCoord = new Coordinate(coordinate);
        return _this;
    }

    UIMarker.prototype._getClassName = function _getClassName() {
        return 'UIMarker';
    };

    UIMarker.prototype.setCoordinates = function setCoordinates(coordinates) {
        this._markerCoord = coordinates;

        this.fire('positionchange');
        if (this.isVisible()) {
            this.show();
        }
        return this;
    };

    UIMarker.prototype.getCoordinates = function getCoordinates() {
        return this._markerCoord;
    };

    UIMarker.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;

        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.show();
        }
        return this;
    };

    UIMarker.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    UIMarker.prototype.onAdd = function onAdd() {
        this.show();
    };

    UIMarker.prototype.show = function show() {
        return _Handlerable.prototype.show.call(this, this._markerCoord);
    };

    UIMarker.prototype.flash = function flash$$1(interval, count, cb, context) {
        return flash.call(this, interval, count, cb, context);
    };

    UIMarker.prototype.buildOn = function buildOn() {
        var dom = void 0;
        if (isString(this.options['content'])) {
            dom = createEl('div');
            dom.innerHTML = this.options['content'];
        } else {
            dom = this.options['content'];
        }
        this._registerDOMEvents(dom);
        return dom;
    };

    UIMarker.prototype.getOffset = function getOffset() {
        var size = this.getSize();
        return new Point(-size['width'] / 2, -size['height'] / 2);
    };

    UIMarker.prototype.getTransformOrigin = function getTransformOrigin() {
        var size = this.getSize();
        return new Point(size['width'] / 2, size['height'] / 2);
    };

    UIMarker.prototype.onDomRemove = function onDomRemove() {
        var dom = this.getDOM();
        this._removeDOMEvents(dom);
    };

    UIMarker.prototype.isDragging = function isDragging() {
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    };

    UIMarker.prototype._registerDOMEvents = function _registerDOMEvents(dom) {
        on(dom, domEvents, this._onDomEvents, this);
    };

    UIMarker.prototype._onDomEvents = function _onDomEvents(e) {
        var event = this.getMap()._parseEvent(e, e.type);
        this.fire(e.type, event);
    };

    UIMarker.prototype._removeDOMEvents = function _removeDOMEvents(dom) {
        off(dom, domEvents, this._onDomEvents, this);
    };

    UIMarker.prototype._getConnectPoints = function _getConnectPoints() {
        var map = this.getMap();
        var containerPoint = map.coordToContainerPoint(this.getCoordinates());
        var size = this.getSize(),
            width = size.width,
            height = size.height;
        var anchors = [map.containerPointToCoordinate(containerPoint.add(-width / 2, 0)), map.containerPointToCoordinate(containerPoint.add(width / 2, 0)), map.containerPointToCoordinate(containerPoint.add(0, height / 2)), map.containerPointToCoordinate(containerPoint.add(0, -height / 2))];
        return anchors;
    };

    return UIMarker;
}(Handlerable(UIComponent));

UIMarker.mergeOptions(options$20);

var EVENTS$1 = Browser$1.touch ? 'touchstart mousedown' : 'mousedown';

var UIMarkerDragHandler = function (_Handler) {
    inherits(UIMarkerDragHandler, _Handler);

    function UIMarkerDragHandler(target) {
        classCallCheck(this, UIMarkerDragHandler);
        return possibleConstructorReturn(this, _Handler.call(this, target));
    }

    UIMarkerDragHandler.prototype.addHooks = function addHooks() {
        this.target.on(EVENTS$1, this._startDrag, this);
    };

    UIMarkerDragHandler.prototype.removeHooks = function removeHooks() {
        this.target.off(EVENTS$1, this._startDrag, this);
    };

    UIMarkerDragHandler.prototype._startDrag = function _startDrag(param) {
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastCoord = param['coordinate'];
        this._lastPoint = param['containerPoint'];

        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);

        this.target.fire('dragstart', param);
    };

    UIMarkerDragHandler.prototype._prepareDragHandler = function _prepareDragHandler() {
        this._dragHandler = new DragHandler(this.target.getDOM(), {
            'cancelOn': this._cancelOn.bind(this),
            'ignoreMouseleave': true
        });
        this._dragHandler.on('mousedown', this._onMouseDown, this);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    };

    UIMarkerDragHandler.prototype._cancelOn = function _cancelOn(domEvent) {
        var target = domEvent.srcElement || domEvent.target,
            tagName = target.tagName.toLowerCase();
        if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'option' || tagName === 'textarea') {
            return true;
        }
        return false;
    };

    UIMarkerDragHandler.prototype._onMouseDown = function _onMouseDown(param) {
        stopPropagation(param['domEvent']);
    };

    UIMarkerDragHandler.prototype._dragging = function _dragging(param) {
        var target = this.target,
            map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']),
            domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        if (!this._isDragging) {
            this._isDragging = true;
            return;
        }

        var coord = eventParam['coordinate'],
            point = eventParam['containerPoint'];
        if (!this._lastCoord) {
            this._lastCoord = coord;
        }
        if (!this._lastPoint) {
            this._lastPoint = point;
        }
        var coordOffset = coord.sub(this._lastCoord),
            pointOffset = point.sub(this._lastPoint);
        this._lastCoord = coord;
        this._lastPoint = point;
        this.target.setCoordinates(this.target.getCoordinates().add(coordOffset));
        eventParam['coordOffset'] = coordOffset;
        eventParam['pointOffset'] = pointOffset;

        target.fire('dragging', eventParam);
    };

    UIMarkerDragHandler.prototype._endDrag = function _endDrag(param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        delete this._lastCoord;
        delete this._lastPoint;
        this._isDragging = false;
        if (!map) {
            return;
        }
        var eventParam = map._parseEvent(param['domEvent']);

        target.fire('dragend', eventParam);
    };

    UIMarkerDragHandler.prototype.isDragging = function isDragging() {
        if (!this._isDragging) {
            return false;
        }
        return true;
    };

    return UIMarkerDragHandler;
}(Handler$1);

UIMarker.addInitHook('addHandler', 'draggable', UIMarkerDragHandler);

var options$21 = {
    'autoPan': true,
    'autoCloseOn': null,
    'autoOpenOn': 'click',
    'width': 300,
    'minHeight': 120,
    'custom': false,
    'title': null,
    'content': null
};

var InfoWindow = function (_UIComponent) {
    inherits(InfoWindow, _UIComponent);

    function InfoWindow() {
        classCallCheck(this, InfoWindow);
        return possibleConstructorReturn(this, _UIComponent.apply(this, arguments));
    }

    InfoWindow.prototype._getClassName = function _getClassName() {
        return 'InfoWindow';
    };

    InfoWindow.prototype.addTo = function addTo(owner) {
        if (owner instanceof Geometry) {
            if (owner.getInfoWindow() && owner.getInfoWindow() !== this) {
                owner.removeInfoWindow();
            }
            owner._infoWindow = this;
        }
        return _UIComponent.prototype.addTo.call(this, owner);
    };

    InfoWindow.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;

        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    };

    InfoWindow.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    InfoWindow.prototype.setTitle = function setTitle(title) {
        var old = title;
        this.options['title'] = title;

        this.fire('contentchange', {
            'old': old,
            'new': title
        });
        if (this.isVisible()) {
            this.show(this._coordinate);
        }
        return this;
    };

    InfoWindow.prototype.getTitle = function getTitle() {
        return this.options['title'];
    };

    InfoWindow.prototype.buildOn = function buildOn() {
        if (this.options['custom']) {
            if (isString(this.options['content'])) {
                var _dom = createEl('div');
                _dom.innerHTML = this.options['content'];
                return _dom;
            } else {
                return this.options['content'];
            }
        }
        var dom = createEl('div');
        dom.className = 'maptalks-msgBox';
        dom.style.width = this._getWindowWidth() + 'px';
        var content = '<em class="maptalks-ico"></em>';
        if (this.options['title']) {
            content += '<h2>' + this.options['title'] + '</h2>';
        }
        var onClose = '"this.parentNode.style.display=\'none\';return false;"';
        content += '<a href="javascript:void(0);" onclick=' + onClose + ' ontouchend=' + onClose + ' class="maptalks-close"></a><div class="maptalks-msgContent">' + this.options['content'] + '</div>';
        dom.innerHTML = content;
        return dom;
    };

    InfoWindow.prototype.getTransformOrigin = function getTransformOrigin() {
        var size = this.getSize();
        var o = new Point(size['width'] / 2, size['height']);
        if (!this.options['custom']) {
            o._add(4, 12);
        }
        return o;
    };

    InfoWindow.prototype.getOffset = function getOffset() {
        var size = this.getSize();
        var o = new Point(-size['width'] / 2, -size['height']);
        if (!this.options['custom']) {
            o._sub(4, 12);
        }
        if (this.getOwner() instanceof Marker) {
            var markerSize = this.getOwner().getSize();
            if (markerSize) {
                o._add(0, -markerSize['height']);
            }
        }
        return o;
    };

    InfoWindow.prototype.show = function show(coordinate) {
        if (!this.getMap()) {
            return this;
        }
        if (!this.getMap().options['enableInfoWindow']) {
            return this;
        }
        return _UIComponent.prototype.show.call(this, coordinate);
    };

    InfoWindow.prototype.getEvents = function getEvents() {
        if (!this.options['autoCloseOn']) {
            return null;
        }
        var events = {};
        events[this.options['autoCloseOn']] = this.hide;
        return events;
    };

    InfoWindow.prototype.getOwnerEvents = function getOwnerEvents() {
        var owner = this.getOwner();
        if (!this.options['autoOpenOn'] || !owner) {
            return null;
        }
        var events = {};
        events[this.options['autoOpenOn']] = this._onAutoOpen;
        return events;
    };

    InfoWindow.prototype._onAutoOpen = function _onAutoOpen(e) {
        var owner = this.getOwner();
        if (owner instanceof Marker) {
            this.show(owner.getCoordinates());
        } else {
            this.show(e.coordinate);
        }
    };

    InfoWindow.prototype._getWindowWidth = function _getWindowWidth() {
        var defaultWidth = 300;
        var width = this.options['width'];
        if (!width) {
            width = defaultWidth;
        }
        return width;
    };

    return InfoWindow;
}(UIComponent);

InfoWindow.mergeOptions(options$21);

var options$22 = {
    'width': 0,
    'height': 0,
    'animation': 'fade',
    'cssName': 'maptalks-tooltip'
};

var ToolTip = function (_UIComponent) {
    inherits(ToolTip, _UIComponent);

    ToolTip.prototype._getClassName = function _getClassName() {
        return 'ToolTip';
    };

    function ToolTip(content) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, ToolTip);

        var _this = possibleConstructorReturn(this, _UIComponent.call(this, options));

        _this._content = content;
        return _this;
    }

    ToolTip.prototype.addTo = function addTo(owner) {
        if (owner instanceof Geometry) {
            owner.on('mouseover', this.onMouseOver, this);
            owner.on('mouseout', this.onMouseOut, this);
            return _UIComponent.prototype.addTo.call(this, owner);
        } else {
            throw new Error('Invalid geometry the tooltip is added to.');
        }
    };

    ToolTip.prototype.setStyle = function setStyle$$1(cssName) {
        this.options.cssName = cssName;
        return this;
    };

    ToolTip.prototype.getStyle = function getStyle() {
        return this.options.cssName;
    };

    ToolTip.prototype.getContent = function getContent() {
        return this._content;
    };

    ToolTip.prototype.buildOn = function buildOn() {
        var dom = createEl('div');
        if (options$22.height) {
            dom.style.height = options$22.height + 'px';
        }
        if (options$22.width) {
            dom.style.width = options$22.width + 'px';
        }
        var cssName = this.options.cssName;
        if (!cssName && options$22.height) {
            dom.style.lineHeight = options$22.height + 'px';
        }
        dom.innerHTML = '<div class="' + cssName + '">' + this._content + '</div>';
        return dom;
    };

    ToolTip.prototype.onMouseOver = function onMouseOver(e) {
        if (!this.isVisible()) {
            var map = this.getMap();
            this.show(map.locateByPoint(e.coordinate, -5, 25));
        }
    };

    ToolTip.prototype.onMouseOut = function onMouseOut() {
        if (this.isVisible()) {
            this._removePrevDOM();
        }
    };

    ToolTip.prototype.onRemove = function onRemove() {
        if (this._owner) {
            this._owner.off('mouseover', this.onMouseOver, this);
            this._owner.off('mouseout', this.onMouseOut, this);
        }
    };

    return ToolTip;
}(UIComponent);

ToolTip.mergeOptions(options$22);

var defaultOptions = {
    'animation': null,
    'animationDelay': 10,
    'animationOnHide': false,
    'eventsToStop': 'mousewheel mousedown dblclick click',
    'autoPan': false,
    'width': 160,
    'maxHeight': 0,
    'custom': false,
    'items': []
};

var Menu = function (_UIComponent) {
    inherits(Menu, _UIComponent);

    function Menu(options) {
        classCallCheck(this, Menu);
        return possibleConstructorReturn(this, _UIComponent.call(this, options));
    }

    Menu.prototype._getClassName = function _getClassName() {
        return 'Menu';
    };

    Menu.prototype.addTo = function addTo(owner) {
        if (owner._menu && owner._menu !== this) {
            owner.removeMenu();
        }
        owner._menu = this;
        return UIComponent.prototype.addTo.apply(this, arguments);
    };

    Menu.prototype.setItems = function setItems(items) {
        this.options['items'] = items;
        return this;
    };

    Menu.prototype.getItems = function getItems() {
        return this.options['items'] || [];
    };

    Menu.prototype.buildOn = function buildOn() {
        if (this.options['custom']) {
            if (isString(this.options['items'])) {
                var container = createEl('div');
                container.innerHTML = this.options['items'];
                return container;
            } else {
                return this.options['items'];
            }
        } else {
            var dom = createEl('div');
            addClass(dom, 'maptalks-menu');
            dom.style.width = this._getMenuWidth() + 'px';

            var menuItems = this._createMenuItemDom();

            dom.appendChild(menuItems);
            on(dom, 'contextmenu', preventDefault);
            return dom;
        }
    };

    Menu.prototype.getOffset = function getOffset() {
        if (!this.getMap()) {
            return null;
        }
        var mapSize = this.getMap().getSize(),
            p = this.getMap().viewPointToContainerPoint(this._getViewPoint()),
            size = this.getSize();
        var dx = 0,
            dy = 0;
        if (p.x + size['width'] > mapSize['width']) {
            dx = -size['width'];
        }
        if (p.y + size['height'] > mapSize['height']) {
            dy = -size['height'];
        }
        return new Point(dx, dy);
    };

    Menu.prototype.getTransformOrigin = function getTransformOrigin() {
        return this.getOffset()._multi(-1);
    };

    Menu.prototype.getEvents = function getEvents() {
        return {
            '_zoomstart _zoomend _movestart _dblclick _click': this._removePrevDOM
        };
    };

    Menu.prototype._createMenuItemDom = function _createMenuItemDom() {
        var me = this;
        var map = this.getMap();
        var ul = createEl('ul');
        addClass(ul, 'maptalks-menu-items');
        var items = this.getItems();

        function onMenuClick(index) {
            return function (e) {
                var param = map._parseEvent(e, 'click');
                param['target'] = me;
                param['owner'] = me._owner;
                param['index'] = index;
                var result = this._callback(param);
                if (result === false) {
                    return;
                }
                me.hide();
            };
        }
        var item = void 0,
            itemDOM = void 0;
        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (item === '-' || item === '_') {
                itemDOM = createEl('li');
                addClass(itemDOM, 'maptalks-menu-splitter');
            } else {
                itemDOM = createEl('li');
                var itemTitle = item['item'];
                if (isFunction(itemTitle)) {
                    itemTitle = itemTitle({
                        'owner': this._owner,
                        'index': i
                    });
                }
                itemDOM.innerHTML = itemTitle;
                itemDOM._callback = item['click'];
                on(itemDOM, 'click', onMenuClick(i));
            }
            ul.appendChild(itemDOM);
        }
        var maxHeight = this.options['maxHeight'] || 0;
        if (maxHeight > 0) {
            setStyle(ul, 'max-height: ' + maxHeight + 'px; overflow-y: auto;');
        }
        return ul;
    };

    Menu.prototype._getMenuWidth = function _getMenuWidth() {
        var defaultWidth = 160;
        var width = this.options['width'] || defaultWidth;
        return width;
    };

    return Menu;
}(UIComponent);

Menu.mergeOptions(defaultOptions);

var Menuable = {
    setMenu: function setMenu(options) {
        this._menuOptions = options;

        if (this._menu) {
            this._menu.setOptions(options);
        } else {
            this.on('contextmenu', this._defaultOpenMenu, this);
        }
        return this;
    },
    openMenu: function openMenu(coordinate) {
        var map = this instanceof Map ? this : this.getMap();
        if (!coordinate) {
            coordinate = this.getCenter();
        }
        if (!this._menu) {
            if (this._menuOptions && map) {
                this._bindMenu(this._menuOptions);
                this._menu.show(coordinate);
            }
        } else {
            this._menu.show(coordinate);
        }
        return this;
    },
    setMenuItems: function setMenuItems(items) {
        if (!this._menuOptions) {
            this._menuOptions = {};
        }
        if (Array.isArray(items)) {
            this._menuOptions['custom'] = false;
        }
        this._menuOptions['items'] = items;
        this.setMenu(this._menuOptions);
        return this;
    },
    getMenuItems: function getMenuItems() {
        if (this._menu) {
            return this._menu.getItems();
        } else if (this._menuOptions) {
            return this._menuOptions['items'] || [];
        }
        return [];
    },
    closeMenu: function closeMenu() {
        if (this._menu) {
            this._menu.hide();
        }
        return this;
    },
    removeMenu: function removeMenu() {
        this.off('contextmenu', this._defaultOpenMenu, this);
        this._unbindMenu();
        delete this._menuOptions;
        return this;
    },
    _bindMenu: function _bindMenu(options) {
        this._menu = new Menu(options);
        this._menu.addTo(this);

        return this;
    },
    _unbindMenu: function _unbindMenu() {
        if (this._menu) {
            this.closeMenu();
            this._menu.remove();
            delete this._menu;
        }
        return this;
    },
    _defaultOpenMenu: function _defaultOpenMenu(param) {
        if (this.listens('contextmenu') > 1) {
            return true;
        } else {
            this.openMenu(param['coordinate']);
            return false;
        }
    }
};

Map.include(Menuable);
Geometry.include(Menuable);



var index$4 = Object.freeze({
	UIComponent: UIComponent,
	UIMarker: UIMarker,
	InfoWindow: InfoWindow,
	ToolTip: ToolTip,
	Menuable: Menuable,
	Menu: Menu
});

var Control = function (_Eventable) {
    inherits(Control, _Eventable);

    function Control(options) {
        classCallCheck(this, Control);

        if (options && options['position'] && !isString(options['position'])) {
            options['position'] = extend({}, options['position']);
        }
        return possibleConstructorReturn(this, _Eventable.call(this, options));
    }

    Control.prototype.addTo = function addTo(map) {
        this.remove();
        if (!map.options['control']) {
            return this;
        }
        this._map = map;
        var controlContainer = map._panels.control;
        this.__ctrlContainer = createEl('div');
        setStyle(this.__ctrlContainer, 'position:absolute');

        this.update();
        controlContainer.appendChild(this.__ctrlContainer);
        if (this.onAdd) {
            this.onAdd();
        }

        this.fire('add', {
            'dom': controlContainer
        });
        return this;
    };

    Control.prototype.update = function update() {
        this.__ctrlContainer.innerHTML = '';
        this._controlDom = this.buildOn(this.getMap());
        if (this._controlDom) {
            this._updatePosition();
            this.__ctrlContainer.appendChild(this._controlDom);
        }
        return this;
    };

    Control.prototype.getMap = function getMap() {
        return this._map;
    };

    Control.prototype.getPosition = function getPosition() {
        return extend({}, this._parse(this.options['position']));
    };

    Control.prototype.setPosition = function setPosition(position) {
        if (isString(position)) {
            this.options['position'] = position;
        } else {
            this.options['position'] = extend({}, position);
        }
        this._updatePosition();
        return this;
    };

    Control.prototype.getContainerPoint = function getContainerPoint() {
        var position = this.getPosition();

        var size = this.getMap().getSize();
        var x = void 0,
            y = void 0;
        if (!isNil(position['left'])) {
            x = parseInt(position['left']);
        } else if (!isNil(position['right'])) {
            x = size['width'] - parseInt(position['right']);
        }
        if (!isNil(position['top'])) {
            y = parseInt(position['top']);
        } else if (!isNil(position['bottom'])) {
            y = size['height'] - parseInt(position['bottom']);
        }
        return new Point(x, y);
    };

    Control.prototype.getContainer = function getContainer() {
        return this.__ctrlContainer;
    };

    Control.prototype.getDOM = function getDOM() {
        return this._controlDom;
    };

    Control.prototype.show = function show() {
        this.__ctrlContainer.style.display = '';
        return this;
    };

    Control.prototype.hide = function hide() {
        this.__ctrlContainer.style.display = 'none';
        return this;
    };

    Control.prototype.isVisible = function isVisible() {
        return this.__ctrlContainer && this.__ctrlContainer.style.display === '';
    };

    Control.prototype.remove = function remove() {
        if (!this._map) {
            return this;
        }
        removeDomNode(this.__ctrlContainer);
        if (this.onRemove) {
            this.onRemove();
        }
        delete this._map;
        delete this.__ctrlContainer;
        delete this._controlDom;

        this.fire('remove');
        return this;
    };

    Control.prototype._parse = function _parse(position) {
        var p = position;
        if (isString(position)) {
            p = Control['positions'][p];
        }
        return p;
    };

    Control.prototype._updatePosition = function _updatePosition() {
        var position = this.getPosition();
        if (!position) {
            position = {
                'top': 20,
                'left': 20
            };
        }
        for (var p in position) {
            if (position.hasOwnProperty(p)) {
                position[p] = parseInt(position[p]);
                this.__ctrlContainer.style[p] = position[p] + 'px';
            }
        }

        this.fire('positionchange', {
            'position': extend({}, position)
        });
    };

    return Control;
}(Eventable(Class));

Control.positions = {
    'top-left': {
        'top': 20,
        'left': 20
    },
    'top-right': {
        'top': 20,
        'right': 20
    },
    'bottom-left': {
        'bottom': 20,
        'left': 20
    },
    'bottom-right': {
        'bottom': 20,
        'right': 20
    }
};

Map.mergeOptions({
    'control': true
});

Map.include({
    addControl: function addControl(control) {
        if (this._containerDOM.getContext) {
            return this;
        }
        control.addTo(this);
        return this;
    },

    removeControl: function removeControl(control) {
        if (!control || control.getMap() !== this) {
            return this;
        }
        control.remove();
        return this;
    }

});

var options$23 = {
    'position': { 'bottom': 0, 'left': 0 },
    'content': 'Powered By <a href="http://www.maptalks.org" target="_blank">maptalks</a>'
};

var Attribution = function (_Control) {
    inherits(Attribution, _Control);

    function Attribution() {
        classCallCheck(this, Attribution);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Attribution.prototype.buildOn = function buildOn() {
        this._attributionContainer = createEl('div');
        this._update();
        return this._attributionContainer;
    };

    Attribution.prototype.setContent = function setContent(content) {
        this.options['content'] = content;
        this._update();
        return this;
    };

    Attribution.prototype._update = function _update() {
        if (!this.getMap()) {
            return;
        }
        var content = this.options['content'];
        if (isString(content) && content.charAt(0) !== '<') {
            this._attributionContainer.className = 'maptalks-attribution';
            content = '<span style="padding:0px 4px">' + content + '</span>';
        }
        this._attributionContainer.innerHTML = content;
    };

    return Attribution;
}(Control);

Attribution.mergeOptions(options$23);

Map.mergeOptions({
    'attribution': false
});

Map.addOnLoadHook(function () {
    var a = this.options['attribution'] || this.options['attributionControl'];
    if (a) {
        this.attributionControl = new Attribution(a);
        this.addControl(this.attributionControl);
    }
});

var options$24 = {
    'position': 'top-right',
    'baseTitle': 'Base Layers',
    'overlayTitle': 'Layers',
    'excludeLayers': [],
    'containerClass': 'maptalks-layer-switcher'
};

var LayerSwitcher = function (_Control) {
    inherits(LayerSwitcher, _Control);

    function LayerSwitcher() {
        classCallCheck(this, LayerSwitcher);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    LayerSwitcher.prototype.buildOn = function buildOn() {
        var container = this.container = createEl('div', this.options['containerClass']),
            panel = this.panel = createEl('div', 'panel'),
            button = this.button = createEl('button');
        container.appendChild(button);
        container.appendChild(panel);
        return container;
    };

    LayerSwitcher.prototype.onAdd = function onAdd() {
        on(this.button, 'mouseover', this._show, this);
        on(this.panel, 'mouseleave', this._hide, this);
    };

    LayerSwitcher.prototype.onRemove = function onRemove() {
        if (this.panel) {
            off(this.button, 'mouseover', this._show, this);
            off(this.panel, 'mouseleave', this._hide, this);
            removeDomNode(this.panel);
            removeDomNode(this.button);
            delete this.panel;
            delete this.button;
            delete this.container;
        }
    };

    LayerSwitcher.prototype._show = function _show() {
        if (!hasClass(this.container, 'shown')) {
            addClass(this.container, 'shown');
            this._createPanel();
        }
    };

    LayerSwitcher.prototype._hide = function _hide(e) {
        if (e.relatedTarget || e.toElement) {
            setClass(this.container, this.options['containerClass']);
        }
    };

    LayerSwitcher.prototype._createPanel = function _createPanel() {
        this.panel.innerHTML = '';
        var ul = createEl('ul');
        this.panel.appendChild(ul);
        this._renderLayers(this.getMap(), ul);
    };

    LayerSwitcher.prototype._renderLayers = function _renderLayers(map, elm) {
        var base = map.getBaseLayer(),
            layers = map.getLayers(),
            len = layers.length;
        if (base) {
            var baseLayers = base.layers || [base],
                li = createEl('li', 'group'),
                ul = createEl('ul'),
                label = createEl('label');
            label.innerHTML = this.options['baseTitle'];
            li.appendChild(label);
            for (var i = 0, _len = baseLayers.length; i < _len; i++) {
                var layer = baseLayers[i];
                if (this._isExcluded(layer)) {
                    ul.appendChild(this._renderLayer(baseLayers[i], true));
                    li.appendChild(ul);
                    elm.appendChild(li);
                }
            }
        }

        if (len) {
            var _li = createEl('li', 'group'),
                _ul = createEl('ul'),
                _label = createEl('label');
            _label.innerHTML = this.options['overlayTitle'];
            _li.appendChild(_label);
            for (var _i = 0; _i < len; _i++) {
                var _layer = layers[_i];
                if (this._isExcluded(_layer)) {
                    _ul.appendChild(this._renderLayer(_layer));
                }
            }
            _li.appendChild(_ul);
            elm.appendChild(_li);
        }
    };

    LayerSwitcher.prototype._isExcluded = function _isExcluded(layer) {
        var id = layer.getId(),
            excludeLayers = this.options['excludeLayers'];
        return !(excludeLayers.length && excludeLayers.indexOf(id) >= 0);
    };

    LayerSwitcher.prototype._renderLayer = function _renderLayer(layer, isBase) {
        var li = createEl('li', 'layer'),
            label = createEl('label'),
            input = createEl('input'),
            map = this.getMap();
        var visible = layer.options['visible'];
        layer.options['visible'] = true;
        var enabled = layer.isVisible();
        layer.options['visible'] = visible;
        li.className = 'layer';
        if (isBase) {
            input.type = 'radio';
            input.name = 'base';
        } else {
            input.type = 'checkbox';
        }

        input.checked = visible && enabled;
        if (!enabled) {
            input.setAttribute('disabled', 'disabled');
        }

        input.onchange = function (e) {
            if (e.target.type === 'radio') {
                var baseLayers = map.getBaseLayer().layers;
                for (var i = 0, len = baseLayers.length; i < len; i++) {
                    var baseLayer = baseLayers[i];
                    baseLayer[baseLayer === layer ? 'show' : 'hide']();
                }
                map._fireEvent('setbaselayer');
            } else {
                layer[e.target.checked ? 'show' : 'hide']();
            }
        };
        li.appendChild(input);
        label.innerHTML = layer.getId();
        li.appendChild(label);
        return li;
    };

    return LayerSwitcher;
}(Control);

LayerSwitcher.mergeOptions(options$24);

Map.mergeOptions({
    'layerSwitcherControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['layerSwitcherControl']) {
        this.layerSwitcherControl = new LayerSwitcher(this.options['layerSwitcherControl']);
        this.addControl(this.layerSwitcherControl);
    }
});

var options$25 = {
    'level': 4,
    'position': {
        'right': 1,
        'bottom': 1
    },
    'size': [300, 200],
    'maximize': true,
    'symbol': {
        'lineWidth': 3,
        'lineColor': '#1bbc9b',
        'polygonFill': '#1bbc9b',
        'polygonOpacity': 0.4
    },
    'containerClass': 'maptalks-overview',
    'buttonClass': 'maptalks-overview-button'
};

var Overview = function (_Control) {
    inherits(Overview, _Control);

    function Overview() {
        classCallCheck(this, Overview);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Overview.prototype.buildOn = function buildOn() {
        var size = this.options['size'];
        if (!this.options['maximize']) {
            size = [0, 0];
        }
        var container = createEl('div');

        var mapContainer = this.mapContainer = createEl('div');
        mapContainer.style.width = size[0] + 'px';
        mapContainer.style.height = size[1] + 'px';
        mapContainer.className = this.options['containerClass'];
        var button = this.button = createEl('div');
        button.className = this.options['buttonClass'];
        container.appendChild(mapContainer);
        container.appendChild(button);
        return container;
    };

    Overview.prototype.onAdd = function onAdd() {
        if (this.options['maximize']) {
            this._createOverview();
        }
        this.getMap().on('resize moving dragrotating viewchange', this._update, this).on('setbaselayer', this._updateBaseLayer, this).on('spatialreferencechange', this._updateSpatialReference, this);
        on(this.button, 'click', this._onButtonClick, this);
        this._updateButtonText();
    };

    Overview.prototype.onRemove = function onRemove() {
        this.getMap().off('resize moving dragrotating viewchange', this._update, this).off('setbaselayer', this._updateBaseLayer, this).off('spatialreferencechange', this._updateSpatialReference, this);
        if (this._overview) {
            this._overview.remove();
            delete this._overview;
            delete this._perspective;
        }
        off(this.button, 'click', this._onButtonClick, this);
    };

    Overview.prototype.maxmize = function maxmize() {
        var size = this.options['size'];
        var dom = this.mapContainer;
        dom.style.width = size[0] + 'px';
        dom.style.height = size[1] + 'px';
        this._createOverview();
    };

    Overview.prototype.minimize = function minimize() {
        if (this._overview) {
            this._overview.remove();
        }
        delete this._overview;
        delete this._perspective;
        var dom = this.mapContainer;
        dom.style.width = 0 + 'px';
        dom.style.height = 0 + 'px';
    };

    Overview.prototype._onButtonClick = function _onButtonClick() {
        if (!this._overview) {
            this.maxmize();
        } else {
            this.minimize();
        }
        this._updateButtonText();
    };

    Overview.prototype._updateButtonText = function _updateButtonText() {
        if (this._overview) {
            this.button.innerHTML = '-';
        } else {
            this.button.innerHTML = '+';
        }
    };

    Overview.prototype._createOverview = function _createOverview() {
        var map = this.getMap(),
            dom = this.mapContainer;
        var options = map.config();
        extend(options, {
            'center': map.getCenter(),
            'zoom': this._getOverviewZoom(),
            'zoomAnimationDuration': 150,
            'pitch': 0,
            'bearing': 0,
            'scrollWheelZoom': false,
            'checkSize': false,
            'doubleClickZoom': false,
            'touchZoom': false,
            'control': false,
            'draggable': false,
            'maxExtent': null
        });
        this._overview = new Map(dom, options);
        this._updateBaseLayer();
        this._perspective = new Polygon(this._getPerspectiveCoords(), {
            'draggable': true,
            'cursor': 'move',
            'symbol': this.options['symbol']
        }).on('dragstart', this._onDragStart, this).on('dragend', this._onDragEnd, this);
        new VectorLayer('perspective_layer', this._perspective).addTo(this._overview);
        this.fire('load');
    };

    Overview.prototype._getOverviewZoom = function _getOverviewZoom() {
        var map = this.getMap(),
            zoom = map.getZoom(),
            minZoom = map.getMinZoom(),
            level = this.options['level'];
        if (level > 0) {
            for (var i = level; i > 0; i--) {
                if (zoom - i >= minZoom) {
                    return zoom - i;
                }
            }
        } else {
            for (var _i = level; _i < 0; _i++) {
                if (zoom - _i >= minZoom) {
                    return zoom - _i;
                }
            }
        }

        return zoom;
    };

    Overview.prototype._onDragStart = function _onDragStart() {
        this._origDraggable = this.getMap().options['draggable'];
        this.getMap().config('draggable', false);
    };

    Overview.prototype._onDragEnd = function _onDragEnd() {
        var center = this._perspective.getCenter();
        this._overview.setCenter(center);
        this.getMap().panTo(center);
        this.getMap().config('draggable', this._origDraggable);
    };

    Overview.prototype._getPerspectiveCoords = function _getPerspectiveCoords() {
        var map = this.getMap();
        return map.getContainerExtent().toArray().map(function (c) {
            return map.containerPointToCoordinate(c);
        });
    };

    Overview.prototype._update = function _update() {
        if (!this._overview) {
            return;
        }
        var coords = this._getPerspectiveCoords();
        this._perspective.setCoordinates(coords);
        this._overview.setCenterAndZoom(this.getMap().getCenter(), this._getOverviewZoom());
    };

    Overview.prototype._updateSpatialReference = function _updateSpatialReference() {
        if (!this._overview) {
            return;
        }
        var map = this.getMap();
        var spatialRef = map.options['spatialReference'];
        this._overview.setSpatialReference(spatialRef);
    };

    Overview.prototype._updateBaseLayer = function _updateBaseLayer() {
        if (!this._overview) {
            return;
        }
        var map = this.getMap();
        if (map.getBaseLayer()) {
            var json = map.getBaseLayer().toJSON();
            delete json.options.canvas;
            json.options.renderer = 'canvas';
            var layer = Layer.fromJSON(json);
            this._overview.setBaseLayer(layer);
        } else {
            this._overview.setBaseLayer(null);
        }
    };

    return Overview;
}(Control);

Overview.mergeOptions(options$25);

Map.mergeOptions({
    'overviewControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['overviewControl']) {
        this.overviewControl = new Overview(this.options['overviewControl']);
        this.addControl(this.overviewControl);
    }
});

var options$26 = {
    'position': 'top-right',
    'draggable': true,
    'custom': false,
    'content': '',
    'closeButton': true
};

var Panel = function (_Control) {
    inherits(Panel, _Control);

    function Panel() {
        classCallCheck(this, Panel);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Panel.prototype.buildOn = function buildOn() {
        var dom = void 0;
        if (this.options['custom']) {
            if (isString(this.options['content'])) {
                dom = createEl('div');
                dom.innerHTML = this.options['content'];
            } else {
                dom = this.options['content'];
            }
        } else {
            dom = createEl('div', 'maptalks-panel');
            if (this.options['closeButton']) {
                var closeButton = createEl('a', 'maptalks-close');
                closeButton.href = 'javascript:;';
                closeButton.onclick = function () {
                    dom.style.display = 'none';
                };
                dom.appendChild(closeButton);
            }

            var panelContent = createEl('div', 'maptalks-panel-content');
            panelContent.innerHTML = this.options['content'];
            dom.appendChild(panelContent);
        }

        this.draggable = new DragHandler(dom, {
            'cancelOn': this._cancelOn.bind(this),
            'ignoreMouseleave': true
        });

        this.draggable.on('dragstart', this._onDragStart, this).on('dragging', this._onDragging, this).on('dragend', this._onDragEnd, this);

        if (this.options['draggable']) {
            this.draggable.enable();
        }

        return dom;
    };

    Panel.prototype.update = function update() {
        if (this.draggable) {
            this.draggable.disable();
            delete this.draggable;
        }
        return Control.prototype.update.call(this);
    };

    Panel.prototype.setContent = function setContent(content) {
        var old = this.options['content'];
        this.options['content'] = content;

        this.fire('contentchange', {
            'old': old,
            'new': content
        });
        if (this.isVisible()) {
            this.update();
        }
        return this;
    };

    Panel.prototype.getContent = function getContent() {
        return this.options['content'];
    };

    Panel.prototype._cancelOn = function _cancelOn(domEvent) {
        var target = domEvent.srcElement || domEvent.target,
            tagName = target.tagName.toLowerCase();
        if (tagName === 'button' || tagName === 'input' || tagName === 'select' || tagName === 'option' || tagName === 'textarea') {
            return true;
        }
        return false;
    };

    Panel.prototype._onDragStart = function _onDragStart(param) {
        this._startPos = param['mousePos'];
        this._startPosition = extend({}, this.getPosition());

        this.fire('dragstart', param);
    };

    Panel.prototype._onDragging = function _onDragging(param) {
        var pos = param['mousePos'];
        var offset = pos.sub(this._startPos);

        var startPosition = this._startPosition;
        var position = this.getPosition();
        if (!isNil(position['top'])) {
            position['top'] = parseInt(startPosition['top']) + offset.y;
        }
        if (!isNil(position['bottom'])) {
            position['bottom'] = parseInt(startPosition['bottom']) - offset.y;
        }
        if (!isNil(position['left'])) {
            position['left'] = parseInt(startPosition['left']) + offset.x;
        }
        if (!isNil(position['right'])) {
            position['right'] = parseInt(startPosition['right']) - offset.x;
        }
        this.setPosition(position);

        this.fire('dragging', param);
    };

    Panel.prototype._onDragEnd = function _onDragEnd(param) {
        delete this._startPos;
        delete this._startPosition;

        this.fire('dragend', param);
    };

    Panel.prototype._getConnectPoints = function _getConnectPoints() {
        var map = this.getMap();
        var containerPoint = this.getContainerPoint();
        var dom = this.getDOM(),
            width = parseInt(dom.clientWidth),
            height = parseInt(dom.clientHeight);
        var anchors = [map.containerPointToCoordinate(containerPoint.add(width / 2, 0)), map.containerPointToCoordinate(containerPoint.add(width, height / 2)), map.containerPointToCoordinate(containerPoint.add(width / 2, height)), map.containerPointToCoordinate(containerPoint.add(0, height / 2))];
        return anchors;
    };

    return Panel;
}(Control);

Panel.mergeOptions(options$26);

var options$27 = {
    'position': 'bottom-left',
    'maxWidth': 100,
    'metric': true,
    'imperial': false
};

var Scale = function (_Control) {
    inherits(Scale, _Control);

    function Scale() {
        classCallCheck(this, Scale);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Scale.prototype.buildOn = function buildOn(map) {
        this._map = map;
        this._scaleContainer = createEl('div');
        this._addScales();
        map.on('zoomend', this._update, this);
        if (this._map._loaded) {
            this._update();
        }
        return this._scaleContainer;
    };

    Scale.prototype.onRemove = function onRemove() {
        this.getMap().off('zoomend', this._update, this);
    };

    Scale.prototype._addScales = function _addScales() {
        var css = 'border: 2px solid #000000;border-top: none;line-height: 1.1;padding: 2px 5px 1px;' + 'color: #000000;font-size: 11px;text-align:center;white-space: nowrap;overflow: hidden' + ';-moz-box-sizing: content-box;box-sizing: content-box;background: #fff; background: rgba(255, 255, 255, 0);';
        if (this.options['metric']) {
            this._mScale = createElOn('div', css, this._scaleContainer);
        }
        if (this.options['imperial']) {
            this._iScale = createElOn('div', css, this._scaleContainer);
        }
    };

    Scale.prototype._update = function _update() {
        var map = this._map;
        var maxMeters = map.pixelToDistance(this.options['maxWidth'], 0);
        this._updateScales(maxMeters);
    };

    Scale.prototype._updateScales = function _updateScales(maxMeters) {
        if (this.options['metric'] && maxMeters) {
            this._updateMetric(maxMeters);
        }
        if (this.options['imperial'] && maxMeters) {
            this._updateImperial(maxMeters);
        }
    };

    Scale.prototype._updateMetric = function _updateMetric(maxMeters) {
        var meters = this._getRoundNum(maxMeters),
            label = meters < 1000 ? meters + ' m' : meters / 1000 + ' km';

        this._updateScale(this._mScale, label, meters / maxMeters);
    };

    Scale.prototype._updateImperial = function _updateImperial(maxMeters) {
        var maxFeet = maxMeters * 3.2808399;
        var maxMiles = void 0,
            miles = void 0,
            feet = void 0;

        if (maxFeet > 5280) {
            maxMiles = maxFeet / 5280;
            miles = this._getRoundNum(maxMiles);
            this._updateScale(this._iScale, miles + ' mile', miles / maxMiles);
        } else {
            feet = this._getRoundNum(maxFeet);
            this._updateScale(this._iScale, feet + ' feet', feet / maxFeet);
        }
    };

    Scale.prototype._updateScale = function _updateScale(scale, text, ratio) {
        scale['style']['width'] = Math.round(this.options['maxWidth'] * ratio) + 'px';
        scale['innerHTML'] = text;
    };

    Scale.prototype._getRoundNum = function _getRoundNum(num) {
        var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
        var d = num / pow10;

        d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

        return pow10 * d;
    };

    return Scale;
}(Control);

Scale.mergeOptions(options$27);

Map.mergeOptions({
    'scaleControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['scaleControl']) {
        this.scaleControl = new Scale(this.options['scaleControl']);
        this.addControl(this.scaleControl);
    }
});

var options$28 = {
    'height': 28,
    'vertical': false,
    'position': 'top-right',
    'reverseMenu': false,
    'items': {}
};

var Toolbar = function (_Control) {
    inherits(Toolbar, _Control);

    function Toolbar() {
        classCallCheck(this, Toolbar);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Toolbar.prototype.buildOn = function buildOn(map) {
        this._map = map;
        var dom = createEl('div');
        var ul = createEl('ul', 'maptalks-toolbar-hx');
        dom.appendChild(ul);

        if (this.options['vertical']) {
            addClass(dom, 'maptalks-toolbar-vertical');
        } else {
            addClass(dom, 'maptalks-toolbar-horizonal');
        }
        var me = this;

        function onButtonClick(fn, index, childIndex, targetDom) {
            var item = me._getItems()[index];
            return function (e) {
                stopPropagation(e);
                return fn({
                    'target': item,
                    'index': index,
                    'childIndex': childIndex,
                    'dom': targetDom
                });
            };
        }

        var items = this.options['items'];
        if (isArrayHasData(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var li = createEl('li');
                if (this.options['height'] !== 28) {
                    li.style.lineHeight = this.options['height'] + 'px';
                }
                li.style.height = this.options['height'] + 'px';
                li.style.cursor = 'pointer';
                if (isHTML(item['item'])) {
                    li.style.textAlign = 'center';
                    var itemSize = measureDom('div', item['item']);

                    li.innerHTML = '<div style="margin-top:' + (this.options['height'] - itemSize['height']) / 2 + 'px;">' + item['item'] + '</div>';
                } else {
                    li.innerHTML = item['item'];
                }
                if (item['click']) {
                    on(li, 'click', onButtonClick(item['click'], i, null, li));
                }
                if (isArrayHasData(item['children'])) {
                    var dropMenu = this._createDropMenu(i);
                    li.appendChild(dropMenu);
                    li._menu = dropMenu;
                    on(li, 'mouseover', function () {
                        this._menu.style.display = '';
                    });
                    on(li, 'mouseout', function () {
                        this._menu.style.display = 'none';
                    });
                }
                ul.appendChild(li);
            }
        }
        return dom;
    };

    Toolbar.prototype._createDropMenu = function _createDropMenu(index) {
        var me = this;

        function onButtonClick(fn, index, childIndex) {
            var item = me._getItems()[index]['children'][childIndex];
            return function (e) {
                stopPropagation(e);
                return fn({
                    'target': item,
                    'index': index,
                    'childIndex': childIndex
                });
            };
        }
        var menuDom = createEl('div', 'maptalks-dropMenu'),
            items = this._getItems(),
            len = items.length,
            menuUL = createEl('ul'),
            children = items[index]['children'];
        if (index === len - 1 && children) {
            menuDom.style.cssText = 'right: 0px;';
            menuUL.style.cssText = 'right: 0px;position: absolute;';
            if (this.options['reverseMenu']) {
                menuUL.style.bottom = 0;
            }
        }
        menuDom.appendChild(createEl('em', 'maptalks-ico'));

        var liWidth = 0;
        for (var i = 0, l = children.length; i < l; i++) {
            var size = stringLength(children[i]['item'], '12px');
            if (size.width > liWidth) {
                liWidth = size.width;
            }
        }
        for (var _i = 0, _l = children.length; _i < _l; _i++) {
            var child = children[_i];
            var li = createEl('li');
            li.innerHTML = '<a href="javascript:;">' + child['item'] + '</a>';
            li.style.cursor = 'pointer';
            li.style.width = liWidth + 24 + 'px';
            on(li.childNodes[0], 'click', onButtonClick(child['click'], index, _i));
            menuUL.appendChild(li);
        }
        if (this.options['vertical']) {
            var width = liWidth < 95 ? 95 : liWidth;
            if (this.options['reverseMenu']) {
                menuDom.style.right = -(width + 10 * 2) + 'px';
            } else {
                menuDom.style.left = -(width + 10 * 2) + 'px';
            }
        } else if (this.options['reverseMenu']) {
            menuDom.style.bottom = '28px';
        } else {
            menuDom.style.top = '28px';
        }
        menuDom.appendChild(menuUL);
        menuDom.style.display = 'none';
        return menuDom;
    };

    Toolbar.prototype._getItems = function _getItems() {
        return this.options['items'] || [];
    };

    return Toolbar;
}(Control);

Toolbar.mergeOptions(options$28);

var options$29 = {
    'position': 'top-left',
    'slider': true,
    'zoomLevel': true,
    'seamless': false
};

var UNIT = 10;

var Zoom = function (_Control) {
    inherits(Zoom, _Control);

    function Zoom() {
        classCallCheck(this, Zoom);
        return possibleConstructorReturn(this, _Control.apply(this, arguments));
    }

    Zoom.prototype.buildOn = function buildOn(map) {
        var options = this.options;

        var dom = createEl('div', 'maptalks-zoom');

        if (options['zoomLevel']) {
            var levelDOM = createEl('span', 'maptalks-zoom-zoomlevel');
            dom.appendChild(levelDOM);
            this._levelDOM = levelDOM;
        }

        var zoomDOM = createEl('div', 'maptalks-zoom-slider');

        var zoomInButton = createEl('a', 'maptalks-zoom-zoomin');
        zoomInButton.href = 'javascript:;';
        zoomInButton.innerHTML = '+';
        zoomDOM.appendChild(zoomInButton);
        this._zoomInButton = zoomInButton;

        if (options['slider']) {
            var box = createEl('div', 'maptalks-zoom-slider-box');
            var ruler = createEl('div', 'maptalks-zoom-slider-ruler');
            var reading = createEl('span', 'maptalks-zoom-slider-reading');
            var dot = createEl('span', 'maptalks-zoom-slider-dot');
            ruler.appendChild(reading);
            box.appendChild(ruler);
            box.appendChild(dot);
            zoomDOM.appendChild(box);
            this._sliderBox = box;
            this._sliderRuler = ruler;
            this._sliderReading = reading;
            this._sliderDot = dot;
        }

        var zoomOutButton = createEl('a', 'maptalks-zoom-zoomout');
        zoomOutButton.href = 'javascript:;';
        zoomOutButton.innerHTML = '-';
        zoomDOM.appendChild(zoomOutButton);
        this._zoomOutButton = zoomOutButton;

        dom.appendChild(zoomDOM);

        map.on('_zoomend _zoomstart _spatialreferencechange', this._update, this);

        this._update();
        this._registerDomEvents();

        return dom;
    };

    Zoom.prototype.onRemove = function onRemove() {
        this.getMap().off('_zoomend _zoomstart _spatialreferencechange', this._update, this);
        if (this._zoomInButton) {
            off(this._zoomInButton, 'click', this._onZoomInClick, this);
        }
        if (this._zoomOutButton) {
            off(this._zoomOutButton, 'click', this._onZoomOutClick, this);
        }
        if (this._sliderRuler) {
            off(this._sliderRuler, 'click', this._onClickRuler, this);
            this.dotDragger.disable();
            delete this.dotDragger;
        }
    };

    Zoom.prototype._update = function _update() {
        var map = this.getMap();
        if (this._sliderBox) {
            var totalRange = (map.getMaxZoom() - map.getMinZoom()) * UNIT;
            this._sliderBox.style.height = totalRange + 16 + 'px';
            this._sliderRuler.style.height = totalRange + 8 + 'px';
            this._sliderRuler.style.cursor = 'pointer';
            var zoomRange = (map.getMaxZoom() - map.getZoom()) * UNIT;

            this._sliderReading.style.height = (map.getZoom() - map.getMinZoom() + 1) * UNIT + 'px';
            this._sliderDot.style.top = zoomRange + 'px';
        }
        this._updateText();
    };

    Zoom.prototype._updateText = function _updateText() {
        if (this._levelDOM) {
            var map = this.getMap();
            var zoom = map.getZoom();
            if (!isInteger(zoom)) {
                zoom = zoom.toFixed(1);
            }
            this._levelDOM.innerHTML = zoom;
        }
    };

    Zoom.prototype._registerDomEvents = function _registerDomEvents() {
        if (this._zoomInButton) {
            on(this._zoomInButton, 'click', this._onZoomInClick, this);
        }
        if (this._zoomOutButton) {
            on(this._zoomOutButton, 'click', this._onZoomOutClick, this);
        }
        if (this._sliderRuler) {
            on(this._sliderRuler, 'click', this._onClickRuler, this);
            this.dotDragger = new DragHandler(this._sliderDot, {
                'ignoreMouseleave': true
            });
            this.dotDragger.on('dragstart', this._onDotDragstart, this).on('dragging dragend', this._onDotDrag, this).enable();
        }
    };

    Zoom.prototype._onZoomInClick = function _onZoomInClick(e) {
        preventDefault(e);
        this.getMap().zoomIn();
    };

    Zoom.prototype._onZoomOutClick = function _onZoomOutClick(e) {
        preventDefault(e);
        this.getMap().zoomOut();
    };

    Zoom.prototype._onClickRuler = function _onClickRuler(e) {
        preventDefault(e);
        var map = this.getMap(),
            point = getEventContainerPoint(e, this._sliderRuler),
            h = point.y;
        var maxZoom = map.getMaxZoom(),
            zoom = Math.floor(maxZoom - h / UNIT);
        map.setZoom(zoom);
    };

    Zoom.prototype._onDotDragstart = function _onDotDragstart(e) {
        preventDefault(e.domEvent);
        var map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2);
        map.onZoomStart(map.getZoom(), origin);
    };

    Zoom.prototype._onDotDrag = function _onDotDrag(e) {
        preventDefault(e.domEvent);
        var map = this.getMap(),
            origin = map.getSize().toPoint()._multi(1 / 2),
            point = getEventContainerPoint(e.domEvent, this._sliderRuler),
            maxZoom = map.getMaxZoom(),
            minZoom = map.getMinZoom();
        var top = point.y,
            z = maxZoom - top / UNIT;

        if (maxZoom < z) {
            z = maxZoom;
            top = 0;
        } else if (minZoom > z) {
            z = minZoom;
            top = (maxZoom - minZoom) * UNIT;
        }

        if (e.type === 'dragging') {
            map.onZooming(z, origin, 1);
        } else if (e.type === 'dragend') {
            if (this.options['seamless']) {
                map.onZoomEnd(z, origin);
            } else {
                map.onZoomEnd(Math.round(z), origin);
            }
        }
        this._sliderDot.style.top = top + 'px';

        this._sliderReading.style.height = (map.getZoom() - minZoom + 1) * UNIT + 'px';
        this._updateText();
    };

    return Zoom;
}(Control);

Zoom.mergeOptions(options$29);

Map.mergeOptions({
    'zoomControl': false
});

Map.addOnLoadHook(function () {
    if (this.options['zoomControl']) {
        this.zoomControl = new Zoom(this.options['zoomControl']);
        this.addControl(this.zoomControl);
    }
});



var index$5 = Object.freeze({
	Control: Control,
	Attribution: Attribution,
	LayerSwitcher: LayerSwitcher,
	Overview: Overview,
	Panel: Panel,
	Scale: Scale,
	Toolbar: Toolbar,
	Zoom: Zoom
});

var TileSystem = function () {
    function TileSystem(sx, sy, ox, oy) {
        classCallCheck(this, TileSystem);

        if (Array.isArray(sx)) {
            this.scale = {
                x: sx[0],
                y: sx[1]
            };
            this.origin = {
                x: sx[2],
                y: sx[3]
            };
        } else {
            this.scale = {
                x: sx,
                y: sy
            };
            this.origin = {
                x: ox,
                y: oy
            };
        }
    }

    TileSystem.getDefault = function getDefault(projection) {
        if (projection['code'].toLowerCase() === 'baidu') {
            return 'baidu';
        } else if (projection['code'].toLowerCase() === 'EPSG:4326'.toLowerCase()) {
            return 'tms-global-geodetic';
        } else if (projection['code'].toLowerCase() === 'identity') {
            return [1, -1, 0, 0];
        } else {
            return 'web-mercator';
        }
    };

    return TileSystem;
}();

extend(TileSystem, {
    'web-mercator': new TileSystem([1, -1, -20037508.34, 20037508.34]),

    'tms-global-mercator': new TileSystem([1, 1, -20037508.34, -20037508.34]),

    'tms-global-geodetic': new TileSystem([1, 1, -180, -90]),

    'baidu': new TileSystem([1, 1, 0, 0])
});

var TileConfig = function () {
    function TileConfig(tileSystem, fullExtent, tileSize) {
        classCallCheck(this, TileConfig);

        this.tileSize = tileSize;
        this.fullExtent = fullExtent;
        this.prepareTileInfo(tileSystem, fullExtent);
    }

    TileConfig.prototype.prepareTileInfo = function prepareTileInfo(tileSystem, fullExtent) {
        if (isString(tileSystem)) {
            tileSystem = TileSystem[tileSystem.toLowerCase()];
        } else if (Array.isArray(tileSystem)) {
            tileSystem = new TileSystem(tileSystem);
        }

        if (!tileSystem) {
            throw new Error('Invalid TileSystem');
        }
        this.tileSystem = tileSystem;

        var a = fullExtent['right'] > fullExtent['left'] ? 1 : -1,
            b = fullExtent['top'] > fullExtent['bottom'] ? -1 : 1,
            c = tileSystem['origin']['x'],
            d = tileSystem['origin']['y'];
        this.transformation = new Transformation([a, b, c, d]);
    };

    TileConfig.prototype.getTileIndex = function getTileIndex(point, res) {
        var tileSystem = this.tileSystem,
            tileSize = this['tileSize'],
            delta = 1E-7;
        var tileX = Math.floor(delta + point.x / (tileSize['width'] * res));
        var tileY = -Math.floor(delta + point.y / (tileSize['height'] * res));

        return {
            'x': tileSystem['scale']['x'] * tileX,
            'y': tileSystem['scale']['y'] * tileY
        };
    };

    TileConfig.prototype.getCenterTile = function getCenterTile(pCoord, res) {
        var tileSystem = this.tileSystem,
            tileSize = this['tileSize'];
        var point = this.transformation.transform(pCoord, 1);
        var tileIndex = this.getTileIndex(point, res);

        var tileLeft = tileIndex['x'] * tileSize['width'];
        var tileTop = tileIndex['y'] * tileSize['height'];

        var offsetLeft = point.x / res - tileSystem['scale']['x'] * tileLeft;
        var offsetTop = point.y / res + tileSystem['scale']['y'] * tileTop;

        if (tileSystem['scale']['x'] < 0) {
            tileIndex['x'] -= 1;
        }

        if (tileSystem['scale']['y'] > 0) {
            tileIndex['y'] -= 1;
        }

        tileIndex = this.getNeighorTileIndex(tileIndex['x'], tileIndex['y'], 0, 0, true);

        return {
            'x': tileIndex['x'],
            'y': tileIndex['y'],
            'offset': new Point(offsetLeft, offsetTop)
        };
    };

    TileConfig.prototype.getNeighorTileIndex = function getNeighorTileIndex(tileX, tileY, offsetX, offsetY, res, isRepeatWorld) {
        var tileSystem = this.tileSystem;
        var x = tileX + tileSystem['scale']['x'] * offsetX;
        var y = tileY - tileSystem['scale']['y'] * offsetY;
        var idx = x;
        var idy = y;
        if (isRepeatWorld) {
            var ext = this._getTileFullIndex(res);
            if (x < ext['xmin']) {
                x = ext['xmax'] - (ext['xmin'] - x) % (ext['xmax'] - ext['xmin']);
                if (x === ext['xmax']) {
                    x = ext['xmin'];
                }
            } else if (x >= ext['xmax']) {
                x = ext['xmin'] + (x - ext['xmin']) % (ext['xmax'] - ext['xmin']);
            }

            if (y >= ext['ymax']) {
                y = ext['ymin'] + (y - ext['ymin']) % (ext['ymax'] - ext['ymin']);
            } else if (y < ext['ymin']) {
                y = ext['ymax'] - (ext['ymin'] - y) % (ext['ymax'] - ext['ymin']);
                if (y === ext['ymax']) {
                    y = ext['ymin'];
                }
            }
        }
        return {
            'x': x,
            'y': y,

            'idx': idx,
            'idy': idy
        };
    };

    TileConfig.prototype._getTileFullIndex = function _getTileFullIndex(res) {
        var ext = this.fullExtent;
        var transformation = this.transformation;
        var nwIndex = this.getTileIndex(transformation.transform(new Coordinate(ext['left'], ext['top']), 1), res);
        var seIndex = this.getTileIndex(transformation.transform(new Coordinate(ext['right'], ext['bottom']), 1), res);
        return new Extent(nwIndex, seIndex);
    };

    TileConfig.prototype.getTileProjectedSw = function getTileProjectedSw(tileX, tileY, res) {
        var tileSystem = this.tileSystem;
        var tileSize = this['tileSize'];
        var y = tileSystem['origin']['y'] + tileSystem['scale']['y'] * (tileY + (tileSystem['scale']['y'] === 1 ? 0 : 1)) * (res * tileSize['height']);
        var x = tileSystem['scale']['x'] * (tileX + (tileSystem['scale']['x'] === 1 ? 0 : 1)) * res * tileSize['width'] + tileSystem['origin']['x'];
        return [x, y];
    };

    TileConfig.prototype.getTilePrjExtent = function getTilePrjExtent(tileX, tileY, res) {
        var tileSize = this['tileSize'],
            sw = new Coordinate(this.getTileProjectedSw(tileX, tileY, res));
        var sx = this.transformation.matrix[0],
            sy = this.transformation.matrix[1];
        var x = sw.x + sx * (res * tileSize['width']),
            y = sw.y - sy * (res * tileSize['height']);
        return new Extent(sw, new Coordinate(x, y));
    };

    return TileConfig;
}();

var options$30 = {
    'urlTemplate': null,
    'subdomains': null,

    'repeatWorld': true,

    'durationToAnimate': 2000,

    'updateIntervalOnAnimating': 400,

    'cssFilter': null,

    'crossOrigin': null,

    'tileSize': [256, 256],

    'tileSystem': null,

    'fadeAnimation': !IS_NODE,

    'debug': false,

    'cacheTiles': true,

    'renderer': function () {
        return Browser$1.webgl ? 'gl' : 'canvas';
    }()
};

var urlPattern = /\{ *([\w_]+) *\}/g;

var TileLayer = function (_Layer) {
    inherits(TileLayer, _Layer);

    function TileLayer() {
        classCallCheck(this, TileLayer);
        return possibleConstructorReturn(this, _Layer.apply(this, arguments));
    }

    TileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'TileLayer') {
            return null;
        }
        return new TileLayer(layerJSON['id'], layerJSON['options']);
    };

    TileLayer.prototype.getTileSize = function getTileSize() {
        return new Size(this.options['tileSize']);
    };

    TileLayer.prototype.getTiles = function getTiles(z) {
        return this._getTiles(z);
    };

    TileLayer.prototype.clear = function clear() {
        if (this._renderer) {
            this._renderer.clear();
        }

        this.fire('clear');
        return this;
    };

    TileLayer.prototype.toJSON = function toJSON() {
        var profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'options': this.config()
        };
        return profile;
    };

    TileLayer.prototype._getTileZoom = function _getTileZoom() {
        var map = this.getMap();
        var zoom = map.getZoom();
        if (!isInteger(zoom)) {
            if (map.isZooming()) {
                zoom = zoom > map._frameZoom ? Math.floor(zoom) : Math.ceil(zoom);
            } else {
                zoom = Math.round(zoom);
            }
        }
        return zoom;
    };

    TileLayer.prototype._getTiles = function _getTiles(z) {
        var map = this.getMap();
        if (!map) {
            return null;
        }
        if (!this.isVisible()) {
            return null;
        }

        var tileConfig = this._getTileConfig();
        if (!tileConfig) {
            return null;
        }

        var tileSize = this.getTileSize(),
            width = tileSize['width'],
            height = tileSize['height'];
        var zoom = isNil(z) ? this._getTileZoom() : z;

        var res = map.getResolution(zoom),
            extent2d = map._get2DExtent(zoom),
            containerCenter = new Point(map.width / 2, map.height / 2),
            center2d = map._containerPointToPoint(containerCenter, zoom);
        var emptyGrid = {
            'zoom': zoom,
            'anchor': null,
            'extent': null,
            'tiles': []
        };
        if (extent2d.getWidth() === 0 || extent2d.getHeight() === 0) {
            return emptyGrid;
        }

        var containerExtent = map.getContainerExtent();
        var maskExtent = this._getMask2DExtent();
        if (maskExtent) {
            var intersection = maskExtent.intersection(map._get2DExtent());
            if (!intersection) {
                return emptyGrid;
            }
            containerExtent = intersection.convertTo(function (c) {
                return map._pointToContainerPoint(c);
            });
        }

        var centerTile = tileConfig.getCenterTile(map._getPrjCenter(), res),
            offset = centerTile['offset'],
            center2D = map._prjToPoint(map._getPrjCenter(), zoom)._sub(offset.x, offset.y),
            mapVP = map.getViewPoint();

        var scale = map.getResolution() / res,
            centerVP = containerCenter.sub(scale !== 1 ? mapVP.multi(scale) : mapVP)._sub(offset.x, offset.y)._round();

        var keepBuffer = 1;

        var top = Math.ceil(Math.abs(center2d.y - extent2d.ymin - offset.y) / height) + keepBuffer,
            left = Math.ceil(Math.abs(center2d.x - extent2d.xmin - offset.x) / width) + keepBuffer,
            bottom = Math.ceil(Math.abs(extent2d.ymax - center2d.y + offset.y) / height) + keepBuffer,
            right = Math.ceil(Math.abs(extent2d.xmax - center2d.x + offset.x) / width) + keepBuffer;
        var layerId = this.getId();
        var tiles = [];
        for (var i = -left; i < right; i++) {
            for (var j = -top; j < bottom; j++) {
                var p = new Point(center2D.x + width * i, center2D.y + height * j),
                    vp = new Point(centerVP.x + width * i, centerVP.y + height * j),
                    idx = tileConfig.getNeighorTileIndex(centerTile['x'], centerTile['y'], i, j, res, this.options['repeatWorld']),
                    url = this.getTileUrl(idx['x'], idx['y'], zoom),
                    id = [layerId, idx['idy'], idx['idx'], zoom].join('__'),
                    tileExtent = new PointExtent(p, p.add(width, height)),
                    tileInfo = {
                    'url': url,
                    'point': p,
                    'viewPoint': vp,
                    'id': id,
                    'z': zoom,
                    'x': idx['x'],
                    'y': idx['y'],
                    'extent2d': tileExtent
                };
                if (this._isTileInExtent(tileInfo, containerExtent)) {
                    tiles.push(tileInfo);
                }
            }
        }

        tiles.sort(function (a, b) {
            return b.point.distanceTo(center2D) - a.point.distanceTo(center2D);
        });

        var tileSystem = tileConfig.tileSystem;
        var anchor = centerVP.sub(centerTile.x * width * tileSystem.scale.x, -centerTile.y * height * tileSystem.scale.y);
        anchor.zoom = zoom;
        return {
            'zoom': zoom,
            'anchor': anchor,
            'extent': new PointExtent(center2D - left * width, center2D - top * height, center2D + right * width, center2D + bottom * height),
            'tiles': tiles
        };
    };

    TileLayer.prototype._initTileConfig = function _initTileConfig() {
        var map = this.getMap(),
            tileSize = this.getTileSize();
        this._defaultTileConfig = new TileConfig(TileSystem.getDefault(map.getProjection()), map.getFullExtent(), tileSize);
        if (this.options['tileSystem']) {
            this._tileConfig = new TileConfig(this.options['tileSystem'], map.getFullExtent(), tileSize);
        }

        if (map && map.getBaseLayer() && map.getBaseLayer() !== this && map.getBaseLayer()._getTileConfig) {
            var base = map.getBaseLayer()._getTileConfig();
            this._tileConfig = new TileConfig(base.tileSystem, base.fullExtent, tileSize);
        }
    };

    TileLayer.prototype._getTileConfig = function _getTileConfig() {
        if (!this._defaultTileConfig) {
            this._initTileConfig();
        }
        return this._tileConfig || this._defaultTileConfig;
    };

    TileLayer.prototype.getTileUrl = function getTileUrl(x, y, z) {
        var urlTemplate = this.options['urlTemplate'];
        var domain = '';
        if (this.options['subdomains']) {
            var subdomains = this.options['subdomains'];
            if (isArrayHasData(subdomains)) {
                var length = subdomains.length;
                var s = (x + y) % length;
                if (s < 0) {
                    s = 0;
                }
                domain = subdomains[s];
            }
        }
        if (isFunction(urlTemplate)) {
            return urlTemplate(x, y, z, domain);
        }
        var data = {
            'x': x,
            'y': y,
            'z': z,
            's': domain
        };
        return urlTemplate.replace(urlPattern, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        });
    };

    TileLayer.prototype._bindMap = function _bindMap(map) {
        var baseLayer = map.getBaseLayer();
        if (baseLayer === this) {
            if (!baseLayer.options.hasOwnProperty('forceRenderOnMoving')) {
                this.config({
                    'forceRenderOnMoving': true
                });
            }
        }
        return _Layer.prototype._bindMap.apply(this, arguments);
    };

    TileLayer.prototype._isTileInExtent = function _isTileInExtent(tileInfo, extent) {
        var map = this.getMap();
        if (!map) {
            return false;
        }
        var tileZoom = tileInfo.z;
        var tileExtent = tileInfo.extent2d.convertTo(function (c) {
            return map._pointToContainerPoint(c, tileZoom);
        });
        if (tileExtent.getWidth() < 5 || tileExtent.getHeight() < 5) {
            return false;
        }

        return extent.intersects(tileExtent);
    };

    TileLayer.prototype.getEvents = function getEvents() {
        return {
            'spatialreferencechange': this._onSpatialReferenceChange
        };
    };

    TileLayer.prototype._onSpatialReferenceChange = function _onSpatialReferenceChange() {
        delete this._tileConfig;
        delete this._defaultTileConfig;
    };

    return TileLayer;
}(Layer);

TileLayer.registerJSONType('TileLayer');

TileLayer.mergeOptions(options$30);

var GroupTileLayer = function (_TileLayer) {
    inherits(GroupTileLayer, _TileLayer);

    GroupTileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'GroupTileLayer') {
            return null;
        }
        var layers = layerJSON['layers'].map(function (json) {
            return Layer.fromJSON(json);
        });
        return new GroupTileLayer(layerJSON['id'], layers, layerJSON['options']);
    };

    function GroupTileLayer(id, layers, options) {
        classCallCheck(this, GroupTileLayer);

        var _this = possibleConstructorReturn(this, _TileLayer.call(this, id, options));

        _this.layers = layers || [];
        return _this;
    }

    GroupTileLayer.prototype.getLayers = function getLayers() {
        return this.layers;
    };

    GroupTileLayer.prototype.toJSON = function toJSON() {
        var profile = {
            'type': this.getJSONType(),
            'id': this.getId(),
            'layers': this.layers.map(function (layer) {
                return layer.toJSON();
            }),
            'options': this.config()
        };
        return profile;
    };

    GroupTileLayer.prototype.getTiles = function getTiles(z) {
        var layers = this.layers;
        var tiles = [];
        var grid = void 0;
        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i];
            if (!layer.options['visible']) {
                continue;
            }
            var childGrid = layer.getTiles(z);
            if (!childGrid || childGrid.tiles.length === 0) {
                continue;
            }
            pushIn(tiles, childGrid.tiles);
            grid = childGrid;
        }
        if (!grid) {
            return null;
        }
        grid.tiles = tiles;
        return grid;
    };

    GroupTileLayer.prototype.onAdd = function onAdd() {
        var _this2 = this;

        var map = this.getMap();
        this.layers.forEach(function (layer) {
            layer._bindMap(map);
            layer.on('show hide', _this2._onLayerShowHide, _this2);
        });
    };

    GroupTileLayer.prototype.onRemove = function onRemove() {
        var _this3 = this;

        this.layers.forEach(function (layer) {
            layer._doRemove();
            layer.off('show hide', _this3._onLayerShowHide, _this3);
        });
    };

    GroupTileLayer.prototype._onLayerShowHide = function _onLayerShowHide() {
        var renderer = this.getRenderer();
        if (renderer) {
            renderer.setToRedraw();
        }
    };

    GroupTileLayer.prototype.isVisible = function isVisible() {
        if (!_TileLayer.prototype.isVisible.call(this)) {
            return false;
        }
        var children = this.layers;
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i].isVisible()) {
                return true;
            }
        }
        return false;
    };

    return GroupTileLayer;
}(TileLayer);

GroupTileLayer.registerJSONType('GroupTileLayer');

var options$31 = {
    crs: null,
    uppercase: false,
    detectRetina: false
};

var defaultWmsParams = {
    service: 'WMS',
    request: 'GetMap',
    layers: '',
    styles: '',
    format: 'image/jpeg',
    transparent: false,
    version: '1.1.1'
};

var WMSTileLayer = function (_TileLayer) {
    inherits(WMSTileLayer, _TileLayer);

    function WMSTileLayer(id, options) {
        classCallCheck(this, WMSTileLayer);

        var _this = possibleConstructorReturn(this, _TileLayer.call(this, id));

        var wmsParams = extend({}, defaultWmsParams);
        for (var p in options) {
            if (!(p in _this.options)) {
                wmsParams[p] = options[p];
            }
        }
        _this.setOptions(options);
        var r = options.detectRetina && Browser$1.retina ? 2 : 1,
            tileSize = _this.getTileSize();
        wmsParams.width = tileSize.width * r;
        wmsParams.height = tileSize.height * r;
        _this.wmsParams = wmsParams;
        _this._wmsVersion = parseFloat(wmsParams.version);
        return _this;
    }

    WMSTileLayer.prototype.onAdd = function onAdd() {
        var crs = this.options.crs || this.getMap().getProjection().code;
        var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
        this.wmsParams[projectionKey] = crs;
    };

    WMSTileLayer.prototype.getTileUrl = function getTileUrl(x, y, z) {
        var map = this.getMap(),
            res = map._getResolution(z),
            tileConfig = this._getTileConfig(),
            tileExtent = tileConfig.getTilePrjExtent(x, y, res);
        var max = tileExtent.getMax(),
            min = tileExtent.getMin();

        var bbox = (this._wmsVersion >= 1.3 && this.wmsParams.crs === 'EPSG:4326' ? [min.y, min.x, max.y, max.x] : [min.x, min.y, max.x, max.y]).join(',');

        var url = _TileLayer.prototype.getTileUrl.call(this, x, y, z);

        return url + getParamString(this.wmsParams, url, this.options.uppercase) + (this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
    };

    WMSTileLayer.prototype.toJSON = function toJSON() {
        return {
            'type': 'WMSTileLayer',
            'id': this.getId(),
            'options': this.config()
        };
    };

    WMSTileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'WMSTileLayer') {
            return null;
        }
        return new WMSTileLayer(layerJSON['id'], layerJSON['options']);
    };

    return WMSTileLayer;
}(TileLayer);

WMSTileLayer.registerJSONType('WMSTileLayer');

WMSTileLayer.mergeOptions(options$31);

function getParamString(obj, existingUrl, uppercase) {
    var params = [];
    for (var i in obj) {
        params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
    }
    return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
}

var CanvasTileLayer = function (_TileLayer) {
    inherits(CanvasTileLayer, _TileLayer);

    function CanvasTileLayer(id, options) {
        classCallCheck(this, CanvasTileLayer);

        var _this = possibleConstructorReturn(this, _TileLayer.call(this, id, options));

        if (!_this.options.hasOwnProperty('forceRenderOnMoving')) {
            _this.options['forceRenderOnMoving'] = false;
        }
        return _this;
    }

    CanvasTileLayer.prototype.drawTile = function drawTile() {};

    CanvasTileLayer.prototype.toJSON = function toJSON() {
        return {
            'type': 'CanvasTileLayer',
            'id': this.getId(),
            'options': this.config()
        };
    };

    CanvasTileLayer.fromJSON = function fromJSON(layerJSON) {
        if (!layerJSON || layerJSON['type'] !== 'CanvasTileLayer') {
            return null;
        }
        return new CanvasTileLayer(layerJSON['id'], layerJSON['options']);
    };

    return CanvasTileLayer;
}(TileLayer);

CanvasTileLayer.registerJSONType('CanvasTileLayer');

var CanvasLayerRenderer = function (_CanvasRenderer) {
    inherits(CanvasLayerRenderer, _CanvasRenderer);

    function CanvasLayerRenderer() {
        classCallCheck(this, CanvasLayerRenderer);
        return possibleConstructorReturn(this, _CanvasRenderer.apply(this, arguments));
    }

    CanvasLayerRenderer.prototype.getPrepareParams = function getPrepareParams() {
        return [];
    };

    CanvasLayerRenderer.prototype.getDrawParams = function getDrawParams() {
        return [];
    };

    CanvasLayerRenderer.prototype.onCanvasCreate = function onCanvasCreate() {
        if (this.canvas && this.layer.options['doubleBuffer']) {
            this.buffer = Canvas.createCanvas(this.canvas.width, this.canvas.height, this.getMap().CanvasClass);
        }
    };

    CanvasLayerRenderer.prototype.needToRedraw = function needToRedraw() {
        if (this.layer.options['animation']) {
            return true;
        }
        var map = this.getMap();
        if (map.isInteracting() && !this.layer.drawOnInteracting) {
            return false;
        }
        return _CanvasRenderer.prototype.needToRedraw.call(this);
    };

    CanvasLayerRenderer.prototype.draw = function draw() {
        this.prepareCanvas();
        this.prepareDrawContext();
        this._drawLayer();
    };

    CanvasLayerRenderer.prototype.drawOnInteracting = function drawOnInteracting() {
        this._drawLayerOnInteracting();
    };

    CanvasLayerRenderer.prototype.getCanvasImage = function getCanvasImage() {
        var canvasImg = _CanvasRenderer.prototype.getCanvasImage.call(this);
        if (canvasImg && canvasImg.image && this.layer.options['doubleBuffer']) {
            var canvas = canvasImg.image;
            if (this.buffer.width !== canvas.width || this.buffer.height !== canvas.height) {
                this.buffer.width = canvas.width;
                this.buffer.height = canvas.height;
            }
            var bufferContext = this.buffer.getContext('2d');
            var prevent = this.layer.doubleBuffer(bufferContext, this.context);
            if (prevent === undefined || prevent) {
                Canvas.image(bufferContext, canvas, 0, 0);
                canvasImg.image = this.buffer;
            }
        }
        return canvasImg;
    };

    CanvasLayerRenderer.prototype.remove = function remove() {
        delete this._drawContext;
        return _CanvasRenderer.prototype.remove.call(this);
    };

    CanvasLayerRenderer.prototype.onZoomStart = function onZoomStart(param) {
        this.layer.onZoomStart(param);
        _CanvasRenderer.prototype.onZoomStart.call(this, param);
    };

    CanvasLayerRenderer.prototype.onZooming = function onZooming(param) {
        this.layer.onZooming(param);
        _CanvasRenderer.prototype.onZooming.call(this, param);
    };

    CanvasLayerRenderer.prototype.onZoomEnd = function onZoomEnd(param) {
        this.layer.onZoomEnd(param);
        _CanvasRenderer.prototype.onZoomEnd.call(this, param);
    };

    CanvasLayerRenderer.prototype.onMoveStart = function onMoveStart(param) {
        this.layer.onMoveStart(param);
        _CanvasRenderer.prototype.onMoveStart.call(this, param);
    };

    CanvasLayerRenderer.prototype.onMoving = function onMoving(param) {
        this.layer.onMoving(param);
        _CanvasRenderer.prototype.onMoving.call(this, param);
    };

    CanvasLayerRenderer.prototype.onMoveEnd = function onMoveEnd(param) {
        this.layer.onMoveEnd(param);
        _CanvasRenderer.prototype.onMoveEnd.call(this, param);
    };

    CanvasLayerRenderer.prototype.onResize = function onResize(param) {
        this.layer.onResize(param);
        _CanvasRenderer.prototype.onResize.call(this, param);
    };

    CanvasLayerRenderer.prototype.prepareDrawContext = function prepareDrawContext() {
        if (!this._predrawed) {
            var params = ensureParams(this.getPrepareParams());
            this._drawContext = this.layer.prepareToDraw.apply(this.layer, [this.context].concat(params));
            if (!this._drawContext) {
                this._drawContext = [];
            }
            if (!Array.isArray(this._drawContext)) {
                this._drawContext = [this._drawContext];
            }
            this._predrawed = true;
        }
    };

    CanvasLayerRenderer.prototype._prepareDrawParams = function _prepareDrawParams() {
        if (!this.getMap()) {
            return null;
        }
        var view = this.getViewExtent();
        if (view['maskExtent'] && !view['extent'].intersects(view['maskExtent'])) {
            this.completeRender();
            return null;
        }
        var args = [this.context, view];
        var params = ensureParams(this.getDrawParams());
        args.push.apply(args, params);
        args.push.apply(args, this._drawContext);
        return args;
    };

    CanvasLayerRenderer.prototype._drawLayer = function _drawLayer() {
        var args = this._prepareDrawParams();
        if (!args) {
            return;
        }
        this.layer.draw.apply(this.layer, args);
        this.completeRender();
    };

    CanvasLayerRenderer.prototype._drawLayerOnInteracting = function _drawLayerOnInteracting() {
        if (!this.layer.drawOnInteracting) {
            return;
        }
        var args = this._prepareDrawParams();
        if (!args) {
            return;
        }
        this.layer.drawOnInteracting.apply(this.layer, args);
        this.completeRender();
    };

    return CanvasLayerRenderer;
}(CanvasRenderer);

function ensureParams(params) {
    if (!params) {
        params = [];
    }
    if (!Array.isArray(params)) {
        params = [params];
    }
    return params;
}

var options$32 = {
    'doubleBuffer': false,
    'animation': false
};

var CanvasLayer = function (_Layer) {
    inherits(CanvasLayer, _Layer);

    function CanvasLayer() {
        classCallCheck(this, CanvasLayer);
        return possibleConstructorReturn(this, _Layer.apply(this, arguments));
    }

    CanvasLayer.prototype.isCanvasRender = function isCanvasRender() {
        return true;
    };

    CanvasLayer.prototype.prepareToDraw = function prepareToDraw() {};

    CanvasLayer.prototype.draw = function draw() {};

    CanvasLayer.prototype.redraw = function redraw() {
        if (this._getRenderer()) {
            this._getRenderer().setToRedraw();
        }
        return this;
    };

    CanvasLayer.prototype.play = function play() {
        this.config('animation', true);
        return this;
    };

    CanvasLayer.prototype.pause = function pause() {
        this.config('animation', false);
        return this;
    };

    CanvasLayer.prototype.isPlaying = function isPlaying() {
        return this.options['animation'];
    };

    CanvasLayer.prototype.clearCanvas = function clearCanvas() {
        if (this._getRenderer()) {
            this._getRenderer().clearCanvas();
        }
        return this;
    };

    CanvasLayer.prototype.requestMapToRender = function requestMapToRender() {
        if (this._getRenderer()) {
            this._getRenderer().requestMapToRender();
        }
        return this;
    };

    CanvasLayer.prototype.completeRender = function completeRender() {
        if (this._getRenderer()) {
            this._getRenderer().completeRender();
        }
        return this;
    };

    CanvasLayer.prototype.onCanvasCreate = function onCanvasCreate() {
        return this;
    };

    CanvasLayer.prototype.onZoomStart = function onZoomStart() {};

    CanvasLayer.prototype.onZooming = function onZooming() {};

    CanvasLayer.prototype.onZoomEnd = function onZoomEnd() {};

    CanvasLayer.prototype.onMoveStart = function onMoveStart() {};

    CanvasLayer.prototype.onMoving = function onMoving() {};

    CanvasLayer.prototype.onMoveEnd = function onMoveEnd() {};

    CanvasLayer.prototype.onResize = function onResize() {};

    CanvasLayer.prototype.doubleBuffer = function doubleBuffer(bufferContext) {
        bufferContext.clearRect(0, 0, bufferContext.canvas.width, bufferContext.canvas.height);
        return this;
    };

    return CanvasLayer;
}(Layer);

CanvasLayer.mergeOptions(options$32);

CanvasLayer.registerRenderer('canvas', CanvasLayerRenderer);

var options$33 = {
    'animation': true
};

var ParticleLayer = function (_CanvasLayer) {
    inherits(ParticleLayer, _CanvasLayer);

    function ParticleLayer() {
        classCallCheck(this, ParticleLayer);
        return possibleConstructorReturn(this, _CanvasLayer.apply(this, arguments));
    }

    ParticleLayer.prototype.getParticles = function getParticles() {};

    ParticleLayer.prototype.draw = function draw(context, view) {
        var points = this.getParticles(now());
        if (!points || points.length === 0) {
            var renderer = this._getRenderer();
            if (renderer) {
                this._getRenderer()._shouldClear = true;
            }
            return;
        }
        var map = this.getMap();
        var extent = view.extent;
        if (view.maskExtent) {
            extent = view.extent.intersection(view.maskExtent);
        }
        extent = extent.convertTo(function (c) {
            return map._pointToContainerPoint(c);
        });
        var e = 2 * Math.PI;
        for (var i = 0, l = points.length; i < l; i++) {
            var pos = points[i].point;
            if (extent.contains(pos)) {
                var color = points[i].color || this.options['lineColor'] || '#fff',
                    r = points[i].r;
                if (context.fillStyle !== color) {
                    context.fillStyle = color;
                }
                if (r <= 2) {
                    context.fillRect(pos.x - r / 2, pos.y - r / 2, r, r);
                } else {
                    context.beginPath();
                    context.arc(pos.x, pos.y, r / 2, 0, e);
                    context.fill();
                }
            }
        }
        this._fillCanvas(context);
    };

    ParticleLayer.prototype._fillCanvas = function _fillCanvas(context) {
        var g = context.globalCompositeOperation;
        context.globalCompositeOperation = 'destination-out';
        var trail = this.options['trail'] || 30;
        context.fillStyle = 'rgba(0, 0, 0, ' + 1 / trail + ')';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = g;
    };

    return ParticleLayer;
}(CanvasLayer);

ParticleLayer.mergeOptions(options$33);

ParticleLayer.registerRenderer('canvas', function (_CanvasLayerRenderer) {
    inherits(_class, _CanvasLayerRenderer);

    function _class() {
        classCallCheck(this, _class);
        return possibleConstructorReturn(this, _CanvasLayerRenderer.apply(this, arguments));
    }

    _class.prototype.draw = function draw() {
        if (!this.canvas || !this.layer.options['animation'] || this._shouldClear) {
            this.prepareCanvas();
            this._shouldClear = false;
        }
        this.prepareDrawContext();
        this._drawLayer();
    };

    _class.prototype.drawOnInteracting = function drawOnInteracting() {
        this.draw();
        this._shouldClear = false;
    };

    _class.prototype.onSkipDrawOnInteracting = function onSkipDrawOnInteracting() {
        this._shouldClear = true;
    };

    return _class;
}(CanvasLayerRenderer));

var EDIT_STAGE_LAYER_PREFIX = INTERNAL_LAYER_PREFIX + '_edit_stage_';

function createHandleSymbol(markerType, opacity) {
    return {
        'markerType': markerType,
        'markerFill': '#fff',
        'markerLineColor': '#000',
        'markerLineWidth': 2,
        'markerWidth': 10,
        'markerHeight': 10,
        'opacity': opacity
    };
}

var options$34 = {
    'fixAspectRatio': false,

    'symbol': null,
    'removeVertexOn': 'contextmenu',

    'centerHandleSymbol': createHandleSymbol('ellipse', 1),
    'vertexHandleSymbol': createHandleSymbol('square', 1),
    'newVertexHandleSymbol': createHandleSymbol('square', 0.4)
};

var GeometryEditor = function (_Eventable) {
    inherits(GeometryEditor, _Eventable);

    function GeometryEditor(geometry, opts) {
        classCallCheck(this, GeometryEditor);

        var _this = possibleConstructorReturn(this, _Eventable.call(this, opts));

        _this._geometry = geometry;
        if (!_this._geometry) {
            return possibleConstructorReturn(_this);
        }
        return _this;
    }

    GeometryEditor.prototype.getMap = function getMap() {
        return this._geometry.getMap();
    };

    GeometryEditor.prototype.prepare = function prepare() {
        var map = this.getMap();
        if (!map) {
            return;
        }

        if (this.options['symbol']) {
            this._originalSymbol = this._geometry.getSymbol();
            this._geometry.setSymbol(this.options['symbol']);
        }

        this._prepareEditStageLayer();
    };

    GeometryEditor.prototype._prepareEditStageLayer = function _prepareEditStageLayer() {
        var map = this.getMap();
        var uid = UID();
        var stageId = EDIT_STAGE_LAYER_PREFIX + uid,
            shadowId = EDIT_STAGE_LAYER_PREFIX + uid + '_shadow';
        this._editStageLayer = map.getLayer(stageId);
        this._shadowLayer = map.getLayer(shadowId);
        if (!this._editStageLayer) {
            this._editStageLayer = new VectorLayer(stageId);
            map.addLayer(this._editStageLayer);
        }
        if (!this._shadowLayer) {
            this._shadowLayer = new VectorLayer(shadowId);
            map.addLayer(this._shadowLayer);
        }
    };

    GeometryEditor.prototype.start = function start() {
        var _this2 = this;

        if (!this._geometry || !this._geometry.getMap() || this._geometry.editing) {
            return;
        }
        var map = this.getMap();
        this.editing = true;
        var geometry = this._geometry;
        this._geometryDraggble = geometry.options['draggable'];
        geometry.config('draggable', false);
        this.prepare();

        var shadow = geometry.copy();
        shadow.setSymbol(geometry._getInternalSymbol());

        shadow.copyEventListeners(geometry);
        if (geometry._getParent()) {
            shadow.copyEventListeners(geometry._getParent());
        }

        shadow.setId(null).config({
            'draggable': false
        });

        this._shadow = shadow;

        this._switchGeometryEvents('on');

        geometry.hide();
        if (geometry instanceof Marker || geometry instanceof Circle || geometry instanceof Rectangle || geometry instanceof Ellipse) {
            this._createOrRefreshOutline();
        }
        this._shadowLayer.bringToFront().addGeometry(shadow);
        this._editStageLayer.bringToFront();
        this._addListener([map, 'zoomstart', function () {
            _this2._editStageLayer.hide();
        }]);
        this._addListener([map, 'zoomend', function () {
            _this2._editStageLayer.show();
        }]);
        if (!(geometry instanceof Marker)) {
            this._createCenterHandle();
        } else {
            shadow.config('draggable', true);
            shadow.on('dragend', this._onMarkerDragEnd, this);
        }
        if (geometry instanceof Marker) {
            this.createMarkerEditor();
        } else if (geometry instanceof Circle) {
            this.createCircleEditor();
        } else if (geometry instanceof Rectangle) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Ellipse) {
            this.createEllipseOrRectEditor();
        } else if (geometry instanceof Sector) {} else if (geometry instanceof Polygon || geometry instanceof LineString) {
            this.createPolygonEditor();
        }
    };

    GeometryEditor.prototype.stop = function stop() {
        delete this._history;
        delete this._historyPointer;
        delete this._editOutline;
        this._switchGeometryEvents('off');
        var map = this.getMap();
        if (!map) {
            return;
        }
        delete this._shadow;
        this._geometry.config('draggable', this._geometryDraggble);
        delete this._geometryDraggble;
        this._geometry.show();

        this._editStageLayer.remove();
        this._shadowLayer.remove();
        this._clearAllListeners();
        this._refreshHooks = [];
        if (this.options['symbol']) {
            this._geometry.setSymbol(this._originalSymbol);
            delete this._originalSymbol;
        }
        this.editing = false;
    };

    GeometryEditor.prototype.isEditing = function isEditing() {
        if (isNil(this.editing)) {
            return false;
        }
        return this.editing;
    };

    GeometryEditor.prototype._getGeometryEvents = function _getGeometryEvents() {
        return {
            'symbolchange': this._onGeoSymbolChange,
            'positionchange shapechange': this._exeAndReset
        };
    };

    GeometryEditor.prototype._switchGeometryEvents = function _switchGeometryEvents(oper) {
        if (this._geometry) {
            var events = this._getGeometryEvents();
            for (var p in events) {
                this._geometry[oper](p, events[p], this);
            }
        }
    };

    GeometryEditor.prototype._onGeoSymbolChange = function _onGeoSymbolChange(param) {
        if (this._shadow) {
            this._shadow.setSymbol(param.target._getInternalSymbol());
        }
    };

    GeometryEditor.prototype._onMarkerDragEnd = function _onMarkerDragEnd() {
        this._update('setCoordinates', this._shadow.getCoordinates().toArray());
        this._refresh();
    };

    GeometryEditor.prototype._createOrRefreshOutline = function _createOrRefreshOutline() {
        var geometry = this._geometry;
        var outline = this._editOutline;
        var pixelExtent = geometry._getPainter().get2DExtent(),
            size = pixelExtent.getSize();
        if (!outline) {
            outline = new Marker(geometry.getCenter(), {
                'symbol': {
                    'markerType': 'square',
                    'markerWidth': size.width,
                    'markerHeight': size.height,
                    'markerLineWidth': 1,
                    'markerLineColor': '6b707b',
                    'markerFillOpacity': 0
                }
            });
            this._editStageLayer.addGeometry(outline);
            this._editOutline = outline;
            this._addRefreshHook(this._createOrRefreshOutline);
            this._addListener([this.getMap(), 'zoomend', this._createOrRefreshOutline.bind(this)]);
        } else {
            outline.setCoordinates(geometry.getCenter());
            var symbol = outline.getSymbol();
            symbol.markerWidth = size.width;
            symbol.markerHeight = size.height;
            outline.setSymbol(symbol);
        }

        return outline;
    };

    GeometryEditor.prototype._createCenterHandle = function _createCenterHandle() {
        var _this3 = this;

        var center = this._shadow.getCenter();
        var symbol = this.options['centerHandleSymbol'];
        var shadow = void 0;
        var handle = this.createHandle(center, {
            'symbol': symbol,
            'cursor': 'move',
            onDown: function onDown() {
                shadow = _this3._shadow.copy();
                var symbol = lowerSymbolOpacity(shadow._getInternalSymbol(), 0.5);
                shadow.setSymbol(symbol).addTo(_this3._editStageLayer);
            },
            onMove: function onMove(v, param) {
                var offset = param['coordOffset'];
                shadow.translate(offset);
            },
            onUp: function onUp() {
                _this3._update('setCoordinates', Coordinate.toNumberArrays(shadow.getCoordinates()));
                shadow.remove();
                _this3._refresh();
            }
        });
        this._addRefreshHook(function () {
            var center = _this3._shadow.getCenter();
            handle.setCoordinates(center);
        });
    };

    GeometryEditor.prototype._createHandleInstance = function _createHandleInstance(coordinate, opts) {
        var symbol = opts['symbol'];
        var handle = new Marker(coordinate, {
            'draggable': true,
            'dragShadow': false,
            'dragOnAxis': opts['axis'],
            'cursor': opts['cursor'],
            'symbol': symbol
        });
        return handle;
    };

    GeometryEditor.prototype.createHandle = function createHandle(coordinate, opts) {
        if (!opts) {
            opts = {};
        }
        var map = this.getMap();
        var handle = this._createHandleInstance(coordinate, opts);
        var me = this;

        function onHandleDragstart(param) {
            if (opts.onDown) {
                opts.onDown.call(me, param['viewPoint'], param);
            }
            return false;
        }

        function onHandleDragging(param) {
            me._hideContext();
            var viewPoint = map._prjToViewPoint(handle._getPrjCoordinates());
            if (opts.onMove) {
                opts.onMove.call(me, viewPoint, param);
            }
            return false;
        }

        function onHandleDragEnd(ev) {
            if (opts.onUp) {
                opts.onUp.call(me, ev);
            }
            return false;
        }
        handle.on('dragstart', onHandleDragstart, this);
        handle.on('dragging', onHandleDragging, this);
        handle.on('dragend', onHandleDragEnd, this);

        if (opts.onRefresh) {
            handle['maptalks--editor-refresh-fn'] = opts.onRefresh;
        }
        this._editStageLayer.addGeometry(handle);
        return handle;
    };

    GeometryEditor.prototype._createResizeHandles = function _createResizeHandles(blackList, onHandleMove, onHandleUp) {
        var _this4 = this;

        var cursors = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'];

        var axis = [null, 'y', null, 'x', 'x', null, 'y', null];
        var geometry = this._geometry;

        function getResizeAnchors(ext) {
            return [ext.getMin(), new Point((ext['xmax'] + ext['xmin']) / 2, ext['ymin']), new Point(ext['xmax'], ext['ymin']), new Point(ext['xmin'], (ext['ymax'] + ext['ymin']) / 2), new Point(ext['xmax'], (ext['ymax'] + ext['ymin']) / 2), new Point(ext['xmin'], ext['ymax']), new Point((ext['xmax'] + ext['xmin']) / 2, ext['ymax']), ext.getMax()];
        }
        if (!blackList) {
            blackList = [];
        }
        var me = this;
        var resizeHandles = [],
            anchorIndexes = {},
            map = this.getMap(),
            handleSymbol = this.options['vertexHandleSymbol'];
        var fnLocateHandles = function fnLocateHandles() {
            var pExt = geometry._getPainter().get2DExtent(),
                anchors = getResizeAnchors(pExt);

            var _loop = function _loop(i) {
                if (Array.isArray(blackList)) {
                    var isBlack = blackList.some(function (ele) {
                        return ele === i;
                    });
                    if (isBlack) {
                        return 'continue';
                    }
                }
                var anchor = anchors[i],
                    coordinate = map.pointToCoordinate(anchor);
                if (resizeHandles.length < anchors.length - blackList.length) {
                    var handle = _this4.createHandle(coordinate, {
                        'symbol': handleSymbol,
                        'cursor': cursors[i],
                        'axis': axis[i],
                        onMove: function (_index) {
                            return function (handleViewPoint) {
                                me._updating = true;
                                onHandleMove(handleViewPoint, _index);
                                geometry.fire('resizing');
                            };
                        }(i),
                        onUp: function onUp() {
                            me._updating = false;
                            onHandleUp();
                            _this4._refresh();
                        }
                    });
                    handle.setId(i);
                    anchorIndexes[i] = resizeHandles.length;
                    resizeHandles.push(handle);
                } else {
                    resizeHandles[anchorIndexes[i]].setCoordinates(coordinate);
                }
            };

            for (var i = 0; i < anchors.length; i++) {
                var _ret = _loop(i);

                if (_ret === 'continue') continue;
            }
        };

        fnLocateHandles();

        this._addRefreshHook(fnLocateHandles);
        return resizeHandles;
    };

    GeometryEditor.prototype.createMarkerEditor = function createMarkerEditor() {
        var _this5 = this;

        var geometryToEdit = this._geometry,
            shadow = this._shadow,
            map = this.getMap();
        if (!shadow._canEdit()) {
            if (console) {
                console.warn('A marker can\'t be resized with symbol:', shadow.getSymbol());
            }
            return;
        }

        if (!this._history) {
            this._recordHistory(getUpdates());
        }


        var symbol = shadow._getInternalSymbol();
        var dxdy = new Point(0, 0);
        if (isNumber(symbol['markerDx'])) {
            dxdy.x = symbol['markerDx'];
        }
        if (isNumber(symbol['markerDy'])) {
            dxdy.y = symbol['markerDy'];
        }

        var blackList = null;

        if (VectorMarkerSymbolizer.test(symbol)) {
            if (symbol['markerType'] === 'pin' || symbol['markerType'] === 'pie' || symbol['markerType'] === 'bar') {
                blackList = [5, 6, 7];
            }
        } else if (ImageMarkerSymbolizer.test(symbol) || VectorPathMarkerSymbolizer.test(symbol)) {
            blackList = [5, 6, 7];
        }

        var resizeAbilities = [2, 1, 2, 0, 0, 2, 1, 2];

        var aspectRatio = void 0;
        if (this.options['fixAspectRatio']) {
            var size = shadow.getSize();
            aspectRatio = size.width / size.height;
        }

        var resizeHandles = this._createResizeHandles(null, function (handleViewPoint, i) {
            if (blackList && blackList.indexOf(i) >= 0) {
                var newCoordinates = map.viewPointToCoordinate(handleViewPoint.sub(dxdy));
                var coordinates = shadow.getCoordinates();
                newCoordinates.x = coordinates.x;
                shadow.setCoordinates(newCoordinates);
                _this5._updateCoordFromShadow(true);

                var mirrorHandle = resizeHandles[resizeHandles.length - 1 - i];
                var mirrorViewPoint = map.coordToViewPoint(mirrorHandle.getCoordinates());
                handleViewPoint = mirrorViewPoint;
            }

            var viewCenter = map._pointToViewPoint(shadow._getCenter2DPoint()).add(dxdy),
                symbol = shadow._getInternalSymbol();
            var wh = handleViewPoint.sub(viewCenter);
            if (blackList && handleViewPoint.y > viewCenter.y) {
                wh.y = 0;
            }

            var r = blackList ? 1 : 2;
            var width = Math.abs(wh.x) * 2,
                height = Math.abs(wh.y) * r;
            if (aspectRatio) {
                width = Math.max(width, height * aspectRatio);
                height = width / aspectRatio;
            }
            var ability = resizeAbilities[i];
            if (!(shadow instanceof TextBox)) {
                if (aspectRatio || ability === 0 || ability === 2) {
                    symbol['markerWidth'] = width;
                }
                if (aspectRatio || ability === 1 || ability === 2) {
                    symbol['markerHeight'] = height;
                }
                shadow.setSymbol(symbol);
                geometryToEdit.setSymbol(symbol);
            } else {
                if (aspectRatio || ability === 0 || ability === 2) {
                    shadow.setWidth(width);
                    geometryToEdit.setWidth(width);
                }
                if (aspectRatio || ability === 1 || ability === 2) {
                    shadow.setHeight(height);
                    geometryToEdit.setHeight(height);
                }
            }
        }, function () {
            _this5._update(getUpdates());
        });

        function getUpdates() {
            var updates = [['setCoordinates', shadow.getCoordinates().toArray()]];
            if (shadow instanceof TextBox) {
                updates.push(['setWidth', shadow.getWidth()]);
                updates.push(['setHeight', shadow.getHeight()]);
            } else {
                updates.push(['setSymbol', shadow.getSymbol()]);
            }
            return updates;
        }

        function onZoomEnd() {
            this._refresh();
        }

        this._addListener([map, 'zoomend', onZoomEnd]);
    };

    GeometryEditor.prototype.createCircleEditor = function createCircleEditor() {
        var _this6 = this;

        var circle = this._geometry,
            shadow = this._shadow;
        var map = this.getMap();

        if (!this._history) {
            this._recordHistory([['setCoordinates', shadow.getCoordinates().toArray()], ['setRadius', shadow.getRadius()]]);
        }

        this._createResizeHandles(null, function (handleViewPoint) {
            var viewCenter = map._pointToViewPoint(shadow._getCenter2DPoint());
            var wh = handleViewPoint.sub(viewCenter);
            var w = Math.abs(wh.x),
                h = Math.abs(wh.y);
            var r = void 0;
            if (w > h) {
                r = map.pixelToDistance(w, 0);
            } else {
                r = map.pixelToDistance(0, h);
            }
            shadow.setRadius(r);
            circle.setRadius(r);
        }, function () {
            _this6._update('setRadius', shadow.getRadius());
        });
    };

    GeometryEditor.prototype.createEllipseOrRectEditor = function createEllipseOrRectEditor() {
        var _this7 = this;

        var resizeAbilities = [2, 1, 2, 0, 0, 2, 1, 2];
        var geometryToEdit = this._geometry,
            shadow = this._shadow;

        if (!this._history) {
            this._recordHistory(getUpdates());
        }

        var map = this.getMap();
        var isRect = this._geometry instanceof Rectangle;
        var aspectRatio = void 0;
        if (this.options['fixAspectRatio']) {
            aspectRatio = geometryToEdit.getWidth() / geometryToEdit.getHeight();
        }
        var resizeHandles = this._createResizeHandles(null, function (mouseViewPoint, i) {
            var r = isRect ? 1 : 2;
            var pointSub = void 0,
                w = void 0,
                h = void 0;
            var targetPoint = mouseViewPoint;
            var ability = resizeAbilities[i];
            if (isRect) {
                var mirror = resizeHandles[7 - i];
                var mirrorViewPoint = map.coordToViewPoint(mirror.getCoordinates());
                pointSub = targetPoint.sub(mirrorViewPoint);
                var absSub = pointSub.abs();
                w = map.pixelToDistance(absSub.x, 0);
                h = map.pixelToDistance(0, absSub.y);
                var size = geometryToEdit.getSize();
                if (ability === 0) {
                    if (aspectRatio) {
                        absSub.y = absSub.x / aspectRatio;
                        size.height = Math.abs(absSub.y);
                        h = w / aspectRatio;
                    }
                    targetPoint.y = mirrorViewPoint.y - size.height / 2;
                } else if (ability === 1) {
                    if (aspectRatio) {
                        absSub.x = absSub.y * aspectRatio;
                        size.width = Math.abs(absSub.x);
                        w = h * aspectRatio;
                    }
                    targetPoint.x = mirrorViewPoint.x - size.width / 2;
                } else if (aspectRatio) {
                    if (w > h * aspectRatio) {
                        h = w / aspectRatio;
                        targetPoint.y = mirrorViewPoint.y + absSub.x * sign(pointSub.y) / aspectRatio;
                    } else {
                        w = h * aspectRatio;
                        targetPoint.x = mirrorViewPoint.x + absSub.y * sign(pointSub.x) * aspectRatio;
                    }
                }

                var newCoordinates = map.viewPointToCoordinate(new Point(Math.min(targetPoint.x, mirrorViewPoint.x), Math.min(targetPoint.y, mirrorViewPoint.y)));
                shadow.setCoordinates(newCoordinates);
                _this7._updateCoordFromShadow(true);
            } else {
                var viewCenter = map.coordToViewPoint(geometryToEdit.getCenter());
                pointSub = viewCenter.sub(targetPoint)._abs();
                w = map.pixelToDistance(pointSub.x, 0);
                h = map.pixelToDistance(0, pointSub.y);
                if (aspectRatio) {
                    w = Math.max(w, h * aspectRatio);
                    h = w / aspectRatio;
                }
            }

            if (aspectRatio || ability === 0 || ability === 2) {
                shadow.setWidth(w * r);
                geometryToEdit.setWidth(w * r);
            }
            if (aspectRatio || ability === 1 || ability === 2) {
                shadow.setHeight(h * r);
                geometryToEdit.setHeight(h * r);
            }
        }, function () {
            _this7._update(getUpdates());
        });

        function getUpdates() {
            return [['setCoordinates', shadow.getCoordinates().toArray()], ['setWidth', shadow.getWidth()], ['setHeight', shadow.getHeight()]];
        }
    };

    GeometryEditor.prototype.createPolygonEditor = function createPolygonEditor() {

        var map = this.getMap(),
            shadow = this._shadow,
            me = this,
            projection = map.getProjection();
        if (!this._history) {
            this._recordHistory('setCoordinates', Coordinate.toNumberArrays(shadow.getCoordinates()));
        }

        var verticeLimit = shadow instanceof Polygon ? 3 : 2;
        var propertyOfVertexRefreshFn = 'maptalks--editor-refresh-fn',
            propertyOfVertexIndex = 'maptalks--editor-vertex-index';
        var vertexHandles = [],
            newVertexHandles = [];

        function getVertexCoordinates() {
            if (shadow instanceof Polygon) {
                var coordinates = shadow.getCoordinates()[0];
                return coordinates.slice(0, coordinates.length - 1);
            } else {
                return shadow.getCoordinates();
            }
        }

        function getVertexPrjCoordinates() {
            return shadow._getPrjCoordinates();
        }

        function onVertexAddOrRemove() {
            for (var i = vertexHandles.length - 1; i >= 0; i--) {
                vertexHandles[i][propertyOfVertexIndex] = i;
            }
            for (var _i = newVertexHandles.length - 1; _i >= 0; _i--) {
                newVertexHandles[_i][propertyOfVertexIndex] = _i;
            }
        }

        function removeVertex(param) {
            var handle = param['target'],
                index = handle[propertyOfVertexIndex];
            var prjCoordinates = getVertexPrjCoordinates();
            if (prjCoordinates.length <= verticeLimit) {
                return;
            }
            prjCoordinates.splice(index, 1);
            shadow._setPrjCoordinates(prjCoordinates);
            shadow._updateCache();

            vertexHandles.splice(index, 1)[0].remove();

            if (index < newVertexHandles.length) {
                newVertexHandles.splice(index, 1)[0].remove();
            }
            var nextIndex = void 0;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }
            newVertexHandles.splice(nextIndex, 1)[0].remove();

            newVertexHandles.splice(nextIndex, 0, createNewVertexHandle.call(me, nextIndex));
            onVertexAddOrRemove();
            me._refresh();
        }

        function moveVertexHandle(handleViewPoint, index) {
            var vertice = getVertexPrjCoordinates();
            var nVertex = map._viewPointToPrj(handleViewPoint);
            var pVertex = vertice[index];
            pVertex.x = nVertex.x;
            pVertex.y = nVertex.y;
            shadow._updateCache();
            shadow.onShapeChanged();
            me._updateCoordFromShadow(true);
            var nextIndex = void 0;
            if (index === 0) {
                nextIndex = newVertexHandles.length - 1;
            } else {
                nextIndex = index - 1;
            }

            if (newVertexHandles[index]) {
                newVertexHandles[index][propertyOfVertexRefreshFn]();
            }
            if (newVertexHandles[nextIndex]) {
                newVertexHandles[nextIndex][propertyOfVertexRefreshFn]();
            }
        }

        function createVertexHandle(index) {
            var vertex = getVertexCoordinates()[index];
            var handle = me.createHandle(vertex, {
                'symbol': me.options['vertexHandleSymbol'],
                'cursor': 'pointer',
                'axis': null,
                onMove: function onMove(handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex]);
                },
                onRefresh: function onRefresh() {
                    vertex = getVertexCoordinates()[handle[propertyOfVertexIndex]];
                    handle.setCoordinates(vertex);
                },
                onUp: function onUp() {
                    me._refresh();
                    me._updateCoordFromShadow();
                }
            });
            handle[propertyOfVertexIndex] = index;
            handle.on(me.options['removeVertexOn'], removeVertex);
            return handle;
        }

        function createNewVertexHandle(index) {
            var vertexCoordinates = getVertexCoordinates();
            var nextVertex = void 0;
            if (index + 1 >= vertexCoordinates.length) {
                nextVertex = vertexCoordinates[0];
            } else {
                nextVertex = vertexCoordinates[index + 1];
            }
            var vertex = vertexCoordinates[index].add(nextVertex).multi(1 / 2);
            var handle = me.createHandle(vertex, {
                'symbol': me.options['newVertexHandleSymbol'],
                'cursor': 'pointer',
                'axis': null,
                onDown: function onDown(param, e) {
                    if (e && e.domEvent && e.domEvent.button === 2) {
                        return;
                    }
                    var prjCoordinates = getVertexPrjCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];

                    var pVertex = projection.project(handle.getCoordinates());

                    prjCoordinates.splice(vertexIndex + 1, 0, pVertex);
                    shadow._setPrjCoordinates(prjCoordinates);
                    shadow._updateCache();

                    var symbol = handle.getSymbol();
                    delete symbol['opacity'];
                    handle.setSymbol(symbol);

                    newVertexHandles.splice(vertexIndex, 0, createNewVertexHandle.call(me, vertexIndex), createNewVertexHandle.call(me, vertexIndex + 1));
                },
                onMove: function onMove(handleViewPoint) {
                    moveVertexHandle(handleViewPoint, handle[propertyOfVertexIndex] + 1);
                },
                onUp: function onUp(e) {
                    if (e && e.domEvent && e.domEvent.button === 2) {
                        return;
                    }
                    var vertexIndex = handle[propertyOfVertexIndex];

                    removeFromArray(handle, newVertexHandles);
                    handle.remove();

                    vertexHandles.splice(vertexIndex + 1, 0, createVertexHandle.call(me, vertexIndex + 1));
                    onVertexAddOrRemove();
                    me._updateCoordFromShadow();
                    me._refresh();
                },
                onRefresh: function onRefresh() {
                    vertexCoordinates = getVertexCoordinates();
                    var vertexIndex = handle[propertyOfVertexIndex];
                    var nextIndex = void 0;
                    if (vertexIndex === vertexCoordinates.length - 1) {
                        nextIndex = 0;
                    } else {
                        nextIndex = vertexIndex + 1;
                    }
                    var refreshVertex = vertexCoordinates[vertexIndex].add(vertexCoordinates[nextIndex]).multi(1 / 2);
                    handle.setCoordinates(refreshVertex);
                }
            });
            handle[propertyOfVertexIndex] = index;
            return handle;
        }
        var vertexCoordinates = getVertexCoordinates();
        for (var i = 0, len = vertexCoordinates.length; i < len; i++) {
            vertexHandles.push(createVertexHandle.call(this, i));
            if (i < len - 1) {
                newVertexHandles.push(createNewVertexHandle.call(this, i));
            }
        }
        if (shadow instanceof Polygon) {
            newVertexHandles.push(createNewVertexHandle.call(this, vertexCoordinates.length - 1));
        }
        this._addRefreshHook(function () {
            for (var _i2 = newVertexHandles.length - 1; _i2 >= 0; _i2--) {
                newVertexHandles[_i2][propertyOfVertexRefreshFn]();
            }
            for (var _i3 = vertexHandles.length - 1; _i3 >= 0; _i3--) {
                vertexHandles[_i3][propertyOfVertexRefreshFn]();
            }
        });
    };

    GeometryEditor.prototype._refresh = function _refresh() {
        if (this._refreshHooks) {
            for (var i = this._refreshHooks.length - 1; i >= 0; i--) {
                this._refreshHooks[i].call(this);
            }
        }
    };

    GeometryEditor.prototype._hideContext = function _hideContext() {
        if (this._geometry) {
            this._geometry.closeMenu();
            this._geometry.closeInfoWindow();
        }
    };

    GeometryEditor.prototype._addListener = function _addListener(listener) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push(listener);
        listener[0].on(listener[1], listener[2], this);
    };

    GeometryEditor.prototype._clearAllListeners = function _clearAllListeners() {
        if (this._eventListeners && this._eventListeners.length > 0) {
            for (var i = this._eventListeners.length - 1; i >= 0; i--) {
                var listener = this._eventListeners[i];
                listener[0].off(listener[1], listener[2], this);
            }
            this._eventListeners = [];
        }
    };

    GeometryEditor.prototype._addRefreshHook = function _addRefreshHook(fn) {
        if (!fn) {
            return;
        }
        if (!this._refreshHooks) {
            this._refreshHooks = [];
        }
        this._refreshHooks.push(fn);
    };

    GeometryEditor.prototype._update = function _update(method) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        this._exeHistory([method, args]);
        this._recordHistory.apply(this, [method].concat(args));
    };

    GeometryEditor.prototype._updateCoordFromShadow = function _updateCoordFromShadow(ignoreRecord) {
        if (!this._shadow) {
            return;
        }

        var coords = this._shadow.getCoordinates();
        var geo = this._geometry;
        var updating = this._updating;
        this._updating = true;
        geo.setCoordinates(coords);
        if (!ignoreRecord) {
            this._recordHistory('setCoordinates', Coordinate.toNumberArrays(geo.getCoordinates()));
        }
        this._updating = updating;
    };

    GeometryEditor.prototype._recordHistory = function _recordHistory(method) {
        if (!this._history) {
            this._history = [];
            this._historyPointer = 0;
        }

        if (this._historyPointer < this._history.length - 1) {
            this._history.splice(this._historyPointer + 1);
        }

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        this._history.push([method, args]);
        this._historyPointer = this._history.length - 1;

        this._geometry.fire('editrecord');
    };

    GeometryEditor.prototype.undo = function undo() {
        if (!this._history || this._historyPointer === 0) {
            return this;
        }
        var record = this._history[--this._historyPointer];
        this._exeAndReset(record);
        return this;
    };

    GeometryEditor.prototype.redo = function redo() {
        if (!this._history || this._historyPointer === this._history.length - 1) {
            return null;
        }
        var record = this._history[++this._historyPointer];
        this._exeAndReset(record);
        return this;
    };

    GeometryEditor.prototype._exeAndReset = function _exeAndReset(record) {
        if (this._updating) {
            return;
        }
        this._exeHistory(record);
        var history = this._history,
            pointer = this._historyPointer;
        this.stop();
        this._history = history;
        this._historyPointer = pointer;
        this.start();
    };

    GeometryEditor.prototype._exeHistory = function _exeHistory(record) {
        var _this8 = this;

        if (!Array.isArray(record)) {
            return;
        }
        var updating = this._updating;
        this._updating = true;
        var geo = this._geometry;
        if (Array.isArray(record[0])) {
            record[0].forEach(function (o) {
                var m = o[0],
                    args = o.slice(1);
                _this8._shadow[m].apply(_this8._shadow, args);
                geo[m].apply(geo, args);
            });
        } else {
            this._shadow[record[0]].apply(this._shadow, record[1]);
            geo[record[0]].apply(geo, record[1]);
        }
        this._updating = updating;
    };

    return GeometryEditor;
}(Eventable(Class));

GeometryEditor.mergeOptions(options$34);

var TextEditable = {
    startEditText: function startEditText() {
        if (!this.getMap()) {
            return this;
        }
        this.hide();
        this.endEditText();
        this._prepareEditor();

        this._fireEvent('edittextstart');
        return this;
    },
    endEditText: function endEditText() {
        if (this._textEditor) {
            var html = this._textEditor.innerHTML;
            html = html.replace(/<p>/ig, '').replace(/<\/p>/ig, '<br/>');
            this._textEditor.innerHTML = html;

            var content = this._textEditor.innerText.replace(/[\r\n]+$/gi, '');
            this.setContent(content);
            off(this._textEditor, 'mousedown dblclick', stopPropagation);
            this.getMap().off('mousedown', this.endEditText, this);
            this._editUIMarker.remove();
            delete this._editUIMarker;
            this._textEditor.onkeyup = null;
            delete this._textEditor;
            this.show();

            this._fireEvent('edittextend');
        }
        return this;
    },
    isEditingText: function isEditingText() {
        if (this._textEditor) {
            return true;
        }
        return false;
    },
    getTextEditor: function getTextEditor() {
        return this._editUIMarker;
    },
    _prepareEditor: function _prepareEditor() {
        var map = this.getMap();
        var editContainer = this._createEditor();
        this._textEditor = editContainer;
        map.on('mousedown', this.endEditText, this);
        var offset = this._getEditorOffset();
        this._editUIMarker = new UIMarker(this.getCoordinates(), {
            'animation': null,
            'content': editContainer,
            'dx': offset.dx,
            'dy': offset.dy
        }).addTo(map);
        this._setCursorToLast(this._textEditor);
    },
    _getEditorOffset: function _getEditorOffset() {
        var symbol = this._getInternalSymbol() || {};
        var dx = 0,
            dy = 0;
        var textAlign = symbol['textHorizontalAlignment'];
        if (textAlign === 'middle' || isNil(textAlign)) {
            dx = (symbol['textDx'] || 0) - 2;
            dy = (symbol['textDy'] || 0) - 2;
        } else {
            dx = (symbol['markerDx'] || 0) - 2;
            dy = (symbol['markerDy'] || 0) - 2;
        }
        return {
            'dx': dx,
            'dy': dy
        };
    },
    _createEditor: function _createEditor() {
        var content = this.getContent();
        var labelSize = this.getSize(),
            symbol = this._getInternalSymbol() || {},
            width = labelSize.width,
            textColor = symbol['textFill'] || '#000000',
            textSize = symbol['textSize'] || 12,
            height = labelSize.height,
            lineColor = symbol['markerLineColor'] || '#000',
            fill = symbol['markerFill'] || '#3398CC',
            spacing = symbol['textLineSpacing'] || 0;
        var editor = createEl('div');
        editor.contentEditable = true;
        editor.style.cssText = 'background:' + fill + '; border:1px solid ' + lineColor + ';\n            color:' + textColor + ';font-size:' + textSize + 'px;width:' + (width - 2) + 'px;height:' + (height - 2) + 'px;margin: auto;\n            line-height:' + (textSize + spacing) + 'px;outline: 0; padding:0; margin:0;word-wrap: break-word;\n            overflow: hidden;-webkit-user-modify: read-write-plaintext-only;';

        editor.innerText = content;
        on(editor, 'mousedown dblclick', stopPropagation);
        editor.onkeyup = function (event) {
            var h = editor.style.height || 0;
            if (event.keyCode === 13) {
                editor.style.height = parseInt(h) + textSize / 2 + 'px';
            }
        };
        return editor;
    },
    _setCursorToLast: function _setCursorToLast(obj) {
        var range = void 0;
        if (window.getSelection) {
            obj.focus();
            range = window.getSelection();
            range.selectAllChildren(obj);
            range.collapseToEnd();
        } else if (document.selection) {
            range = document.selection.createRange();
            range.moveToElementText(obj);
            range.collapse(false);
            range.select();
        }
    }
};

TextMarker.include(TextEditable);

Geometry.include({
    animate: function animate(styles, options, step) {
        var _this = this;

        if (this._animPlayer) {
            this._animPlayer.finish();
        }
        if (isFunction(options)) {
            step = options;
        }
        if (!options) {
            options = {};
        }
        var map = this.getMap(),
            projection = this._getProjection(),
            symbol = this.getSymbol() || {},
            stylesToAnimate = this._prepareAnimationStyles(styles);
        var preTranslate = void 0;

        var isFocusing = options['focus'];
        delete this._animationStarted;

        if (map) {
            var renderer = map._getRenderer();
            var framer = function framer(fn) {
                renderer.callInNextFrame(fn);
            };
            options['framer'] = framer;
        }

        var player = Animation.animate(stylesToAnimate, options, function (frame) {
            if (map && map.isRemoved()) {
                player.finish();
                return;
            }
            if (map && !_this._animationStarted && isFocusing) {
                map.onMoveStart();
            }
            var styles = frame.styles;
            for (var p in styles) {
                if (p !== 'symbol' && p !== 'translate' && styles.hasOwnProperty(p)) {
                    var fnName = 'set' + p[0].toUpperCase() + p.slice(1);
                    _this[fnName](styles[p]);
                }
            }
            var translate = styles['translate'];
            if (translate) {
                var toTranslate = translate;
                if (preTranslate) {
                    toTranslate = translate.sub(preTranslate);
                }
                preTranslate = translate;
                _this.translate(toTranslate);
            }
            var dSymbol = styles['symbol'];
            if (dSymbol) {
                _this.setSymbol(extendSymbol(symbol, dSymbol));
            }
            if (map && isFocusing) {
                var pcenter = projection.project(_this.getCenter());
                map._setPrjCenter(pcenter);
                var e = map._parseEventFromCoord(projection.unproject(pcenter));
                if (player.playState !== 'running') {
                    map.onMoveEnd(e);
                } else {
                    map.onMoving(e);
                }
            }
            _this._fireAnimateEvent(player.playState);
            if (step) {
                step(frame);
            }
        });
        this._animPlayer = player;
        return this._animPlayer.play();
    },

    _prepareAnimationStyles: function _prepareAnimationStyles(styles) {
        var symbol = this._getInternalSymbol();
        var stylesToAnimate = {};
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                var v = styles[p];
                if (p !== 'translate' && p !== 'symbol') {
                    var fnName = 'get' + p[0].toUpperCase() + p.substring(1);
                    var current = this[fnName]();
                    stylesToAnimate[p] = [current, v];
                } else if (p === 'symbol') {
                    var symbolToAnimate = void 0;
                    if (Array.isArray(styles['symbol'])) {
                        if (!Array.isArray(symbol)) {
                            throw new Error('geometry\'symbol isn\'t a composite symbol, while the symbol in styles is.');
                        }
                        symbolToAnimate = [];
                        var symbolInStyles = styles['symbol'];
                        for (var i = 0; i < symbolInStyles.length; i++) {
                            if (!symbolInStyles[i]) {
                                symbolToAnimate.push(null);
                                continue;
                            }
                            var a = {};
                            for (var sp in symbolInStyles[i]) {
                                if (symbolInStyles[i].hasOwnProperty(sp)) {
                                    a[sp] = [symbol[i][sp], symbolInStyles[i][sp]];
                                }
                            }
                            symbolToAnimate.push(a);
                        }
                    } else {
                        if (Array.isArray(symbol)) {
                            throw new Error('geometry\'symbol is a composite symbol, while the symbol in styles isn\'t.');
                        }
                        symbolToAnimate = {};
                        for (var _sp in v) {
                            if (v.hasOwnProperty(_sp)) {
                                symbolToAnimate[_sp] = [symbol[_sp], v[_sp]];
                            }
                        }
                    }
                    stylesToAnimate['symbol'] = symbolToAnimate;
                } else if (p === 'translate') {
                    stylesToAnimate['translate'] = new Coordinate(v);
                }
            }
        }
        return stylesToAnimate;
    },

    _fireAnimateEvent: function _fireAnimateEvent(playState) {
        if (playState === 'finished') {
            delete this._animationStarted;
            this._fireEvent('animateend');
        } else if (playState === 'running') {
            if (this._animationStarted) {
                this._fireEvent('animating');
            } else {
                this._fireEvent('animatestart');
                this._animationStarted = true;
            }
        }
    }
});

var DRAG_STAGE_LAYER_ID = INTERNAL_LAYER_PREFIX + '_drag_stage';

var EVENTS$2 = Browser$1.touch ? 'touchstart mousedown' : 'mousedown';

var GeometryDragHandler = function (_Handler) {
    inherits(GeometryDragHandler, _Handler);

    function GeometryDragHandler(target) {
        classCallCheck(this, GeometryDragHandler);
        return possibleConstructorReturn(this, _Handler.call(this, target));
    }

    GeometryDragHandler.prototype.addHooks = function addHooks() {
        this.target.on(EVENTS$2, this._startDrag, this);
    };

    GeometryDragHandler.prototype.removeHooks = function removeHooks() {
        this.target.off(EVENTS$2, this._startDrag, this);
        delete this.container;
    };

    GeometryDragHandler.prototype._startDrag = function _startDrag(param) {
        var map = this.target.getMap();
        if (!map) {
            return;
        }
        var parent = this.target._getParent();
        if (parent) {
            return;
        }
        if (this.isDragging()) {
            return;
        }
        var domEvent = param['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }
        this.target.on('click', this._endDrag, this);
        this._lastCoord = param['coordinate'];
        this._lastPoint = param['containerPoint'];
        this._prepareDragHandler();
        this._dragHandler.onMouseDown(param['domEvent']);

        this.container = map._panels.mapWrapper || map._containerDOM;
        on(this.container, 'mouseleave', this._endDrag, this);

        this._moved = false;

        this.target._fireEvent('dragstart', param);
        return;
    };

    GeometryDragHandler.prototype._prepareDragHandler = function _prepareDragHandler() {
        this._dragHandler = new DragHandler(document);
        this._dragHandler.on('dragging', this._dragging, this);
        this._dragHandler.on('mouseup', this._endDrag, this);
        this._dragHandler.enable();
    };

    GeometryDragHandler.prototype._prepareShadow = function _prepareShadow() {
        var target = this.target;
        this._prepareDragStageLayer();
        if (this._shadow) {
            this._shadow.remove();
        }

        this._shadow = target.copy();
        this._shadow.setSymbol(target._getInternalSymbol());
        var shadow = this._shadow;
        if (target.options['dragShadow']) {
            var symbol = lowerSymbolOpacity(shadow._getInternalSymbol(), 0.5);
            shadow.setSymbol(symbol);
        }
        shadow.setId(null);
        this._prepareShadowConnectors();
    };

    GeometryDragHandler.prototype._prepareShadowConnectors = function _prepareShadowConnectors() {
        var target = this.target;
        var shadow = this._shadow;
        var resources = this._dragStageLayer._getRenderer().resources;

        var shadowConnectors = [];
        if (ConnectorLine._hasConnectors(target)) {
            var connectors = ConnectorLine._getConnectors(target);

            for (var i = 0, l = connectors.length; i < l; i++) {
                var targetConn = connectors[i];
                var connOptions = targetConn.config(),
                    connSymbol = targetConn._getInternalSymbol();
                connOptions['symbol'] = lowerSymbolOpacity(connSymbol, 0.5);
                var conn = void 0;
                if (targetConn.getConnectSource() === target) {
                    conn = new targetConn.constructor(shadow, targetConn.getConnectTarget(), connOptions);
                } else {
                    conn = new targetConn.constructor(targetConn.getConnectSource(), shadow, connOptions);
                }
                shadowConnectors.push(conn);
                if (targetConn.getLayer() && targetConn.getLayer()._getRenderer()) {
                    resources.merge(targetConn.getLayer()._getRenderer().resources);
                }
            }
        }
        this._shadowConnectors = shadowConnectors;
        shadowConnectors.push(shadow);
        this._dragStageLayer.bringToFront().addGeometry(shadowConnectors);
    };

    GeometryDragHandler.prototype._onTargetUpdated = function _onTargetUpdated() {
        if (this._shadow) {
            this._shadow.setSymbol(this.target._getSymbol());
        }
    };

    GeometryDragHandler.prototype._prepareDragStageLayer = function _prepareDragStageLayer() {
        var map = this.target.getMap(),
            layer = this.target.getLayer();
        this._dragStageLayer = map.getLayer(DRAG_STAGE_LAYER_ID);
        if (!this._dragStageLayer) {
            this._dragStageLayer = new VectorLayer(DRAG_STAGE_LAYER_ID);
            map.addLayer(this._dragStageLayer);
        }

        var resources = new ResourceCache();
        resources.merge(layer._getRenderer().resources);
        this._dragStageLayer._getRenderer().resources = resources;
    };

    GeometryDragHandler.prototype._dragging = function _dragging(param) {
        var target = this.target;
        var map = target.getMap(),
            eventParam = map._parseEvent(param['domEvent']);

        var domEvent = eventParam['domEvent'];
        if (domEvent.touches && domEvent.touches.length > 1) {
            return;
        }

        if (!this._moved) {
            this._moved = true;
            target.on('symbolchange', this._onTargetUpdated, this);
            this._isDragging = true;
            this._prepareShadow();
            if (!target.options['dragShadow']) {
                target.hide();
            }
            this._shadow._fireEvent('dragstart', eventParam);
            return;
        }
        if (!this._shadow) {
            return;
        }
        var axis = this._shadow.options['dragOnAxis'],
            coord = eventParam['coordinate'],
            point = eventParam['containerPoint'];
        if (!this._lastCoord) {
            this._lastCoord = coord;
        }
        if (!this._lastPoint) {
            this._lastPoint = point;
        }
        var coordOffset = coord.sub(this._lastCoord),
            pointOffset = point.sub(this._lastPoint);
        if (axis === 'x') {
            coordOffset.y = 0;
            pointOffset.y = 0;
        } else if (axis === 'y') {
            coordOffset.x = 0;
            pointOffset.x = 0;
        }
        this._lastCoord = coord;
        this._lastPoint = point;
        this._shadow.translate(coordOffset);
        if (!target.options['dragShadow']) {
            target.translate(coordOffset);
        }
        eventParam['coordOffset'] = coordOffset;
        eventParam['pointOffset'] = pointOffset;
        this._shadow._fireEvent('dragging', eventParam);

        target._fireEvent('dragging', eventParam);
    };

    GeometryDragHandler.prototype._endDrag = function _endDrag(param) {
        var target = this.target,
            map = target.getMap();
        if (this._dragHandler) {
            target.off('click', this._endDrag, this);
            this._dragHandler.disable();
            delete this._dragHandler;
        }
        off(this.container, 'mouseleave', this._endDrag, this);
        if (!map) {
            return;
        }

        var eventParam = map._parseEvent(param['domEvent']);
        target.off('symbolchange', this._onTargetUpdated, this);

        this._updateTargetAndRemoveShadow(eventParam);

        delete this._lastCoord;
        delete this._lastPoint;

        this._isDragging = false;

        target._fireEvent('dragend', eventParam);
    };

    GeometryDragHandler.prototype.isDragging = function isDragging() {
        if (!this._isDragging) {
            return false;
        }
        return true;
    };

    GeometryDragHandler.prototype._updateTargetAndRemoveShadow = function _updateTargetAndRemoveShadow(eventParam) {
        var target = this.target,
            map = target.getMap();
        if (!target.options['dragShadow']) {
            target.show();
        }
        var shadow = this._shadow;
        if (shadow) {
            if (target.options['dragShadow']) {
                target.setCoordinates(shadow.getCoordinates());
            }
            shadow._fireEvent('dragend', eventParam);
            shadow.remove();
            delete this._shadow;
        }
        if (this._shadowConnectors) {
            map.getLayer(DRAG_STAGE_LAYER_ID).removeGeometry(this._shadowConnectors);
            delete this._shadowConnectors;
        }
        if (this._dragStageLayer) {
            this._dragStageLayer.remove();
        }
    };

    return GeometryDragHandler;
}(Handler$1);

Geometry.mergeOptions({
    'draggable': false,
    'dragShadow': true,
    'dragOnAxis': null
});

Geometry.addInitHook('addHandler', 'draggable', GeometryDragHandler);

Geometry.include({
    isDragging: function isDragging() {
        if (this._getParent()) {
            return this._getParent().isDragging();
        }
        if (this['draggable']) {
            return this['draggable'].isDragging();
        }
        return false;
    }
});

Geometry.include({
    startEdit: function startEdit(opts) {
        if (!this.getMap() || !this.options['editable']) {
            return this;
        }
        this.endEdit();
        this._editor = new GeometryEditor(this, opts);
        this._editor.start();

        this.fire('editstart');
        return this;
    },
    endEdit: function endEdit() {
        if (this._editor) {
            this._editor.stop();
            delete this._editor;

            this.fire('editend');
        }
        return this;
    },
    redoEdit: function redoEdit() {
        if (!this.isEditing()) {
            return this;
        }
        this._editor.redo();

        this.fire('redoedit');
        return this;
    },
    undoEdit: function undoEdit() {
        if (!this.isEditing()) {
            return this;
        }
        this._editor.undo();

        this.fire('undoedit');
        return this;
    },
    isEditing: function isEditing() {
        if (this._editor) {
            return this._editor.isEditing();
        }
        return false;
    }
});

Geometry.include({
    _onEvent: function _onEvent(event, type) {
        if (!this.getMap()) {
            return;
        }
        var eventType = type || this._getEventTypeToFire(event);
        if (eventType === 'contextmenu' && this.listens('contextmenu')) {
            stopPropagation(event);
            preventDefault(event);
        }
        var params = this._getEventParams(event);
        this._fireEvent(eventType, params);
    },

    _getEventTypeToFire: function _getEventTypeToFire(domEvent) {
        return domEvent.type;
    },

    _getEventParams: function _getEventParams(e) {
        var map = this.getMap();
        var eventParam = {
            'domEvent': e
        };
        var actual = e.touches ? e.touches[0] : e;
        if (actual) {
            var containerPoint = getEventContainerPoint(actual, map._containerDOM);
            eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
            eventParam['containerPoint'] = containerPoint;
            eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
            eventParam['pont2d'] = map._containerPointToPoint(containerPoint);
        }
        return eventParam;
    }
});

Geometry.include({
    setInfoWindow: function setInfoWindow(options) {
        this.removeInfoWindow();
        if (options instanceof InfoWindow) {
            this._infoWindow = options;
            this._infoWinOptions = extend({}, this._infoWindow.options);
            this._infoWindow.addTo(this);
            return this;
        }
        this._infoWinOptions = extend({}, options);
        if (this._infoWindow) {
            this._infoWindow.setOptions(options);
        } else if (this.getMap()) {
            this._bindInfoWindow(this._infoWinOptions);
        }

        return this;
    },
    getInfoWindow: function getInfoWindow() {
        if (!this._infoWindow) {
            return null;
        }
        return this._infoWindow;
    },
    openInfoWindow: function openInfoWindow(coordinate) {
        if (!this.getMap()) {
            return this;
        }
        if (!coordinate) {
            coordinate = this.getCenter();
        }
        if (!this._infoWindow) {
            if (this._infoWinOptions && this.getMap()) {
                this._bindInfoWindow(this._infoWinOptions);
                this._infoWindow.show(coordinate);
            }
        } else {
            this._infoWindow.show(coordinate);
        }
        return this;
    },
    closeInfoWindow: function closeInfoWindow() {
        if (this._infoWindow) {
            this._infoWindow.hide();
        }
        return this;
    },
    removeInfoWindow: function removeInfoWindow() {
        this._unbindInfoWindow();
        delete this._infoWinOptions;
        delete this._infoWindow;
        return this;
    },
    _bindInfoWindow: function _bindInfoWindow(options) {
        this._infoWindow = new InfoWindow(options);
        this._infoWindow.addTo(this);

        return this;
    },
    _unbindInfoWindow: function _unbindInfoWindow() {
        if (this._infoWindow) {
            this.closeInfoWindow();
            this._infoWindow.remove();
            delete this._infoWindow;
        }
        return this;
    }
});

var shaders = {
    'vertexShader': '\n        attribute vec3 a_position;\n\n        attribute vec2 a_texCoord;\n\n        uniform mat4 u_matrix;\n\n        varying vec2 v_texCoord;\n\n        void main() {\n            gl_Position = u_matrix * vec4(a_position, 1.0);\n\n            v_texCoord = a_texCoord;\n        }\n    ',

    'fragmentShader': '\n        precision mediump float;\n\n        uniform sampler2D u_image;\n\n        uniform float u_opacity;\n\n        varying vec2 v_texCoord;\n\n        void main() {\n\n            gl_FragColor = texture2D(u_image, v_texCoord) * u_opacity;\n\n        }\n    '
};

var ImageGLRenderable = function ImageGLRenderable(Base) {
    var renderable = function (_Base) {
        inherits(renderable, _Base);

        function renderable() {
            classCallCheck(this, renderable);
            return possibleConstructorReturn(this, _Base.apply(this, arguments));
        }

        renderable.prototype.drawGLImage = function drawGLImage(image, x, y, w, h, opacity) {
            var gl = this.gl;
            this.loadTexture(image);

            gl.uniformMatrix4fv(this.program['u_matrix'], false, this.getProjViewMatrix());
            gl.uniform1f(this.program['u_opacity'], opacity);
            var x1 = x;
            var x2 = x + w;
            var y1 = y;
            var y2 = y + h;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            this.enableVertexAttrib(['a_position', 3]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, 0.0, x2, y1, 0.0, x1, y2, 0.0, x1, y2, 0.0, x2, y1, 0.0, x2, y2, 0.0]), gl.DYNAMIC_DRAW);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        renderable.prototype.drawTinImage = function drawTinImage(image, vertices, texCoords, indices, opacity) {
            var gl = this.gl;
            this.loadTexture(image);
            gl.uniformMatrix4fv(this.program['u_matrix'], false, this.getProjViewMatrix());
            gl.uniform1f(this.program['u_opacity'], opacity);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            this.enableVertexAttrib(['a_position', 3]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
            this.enableVertexAttrib(['a_texCoord', 2]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.DYNAMIC_DRAW);

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);

            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        };

        renderable.prototype.getProjViewMatrix = function getProjViewMatrix() {
            return this.copy16(this.getMap().projViewMatrix);
        };

        renderable.prototype.prepareGLCanvas = function prepareGLCanvas() {
            var map = this.getMap();
            this.glCanvas = Canvas.createCanvas(this.canvas.width, this.canvas.height, map.glCanvasClass);
            var gl = this.gl = this._createGLContext(this.glCanvas, this.layer.options['glOptions']);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.STENCIL_TEST);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            this.program = this.createProgram(shaders['vertexShader'], this.layer.options['fragmentShader'] || shaders['fragmentShader'], ['u_matrix', 'u_image', 'u_opacity']);
            this.useProgram(this.program);

            this.texBuffer = this.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
            this.enableVertexAttrib(['a_texCoord', 2]);
            gl.bufferData(gl.ARRAY_BUFFER, this.copy12([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);

            this.enableSampler('u_image');

            gl.activeTexture(gl['TEXTURE0']);

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            this.posBuffer = this.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            this.enableVertexAttrib(['a_position', 3]);

            this.indicesBuffer = this.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        };

        renderable.prototype.resizeGLCanvas = function resizeGLCanvas() {
            if (!this.glCanvas) {
                return;
            }
            if (this.glCanvas.width !== this.canvas.width || this.glCanvas.height !== this.canvas.height) {
                this.glCanvas.width = this.canvas.width;
                this.glCanvas.height = this.canvas.height;
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
        };

        renderable.prototype.clearGLCanvas = function clearGLCanvas() {
            if (this.gl) {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            }
        };

        renderable.prototype._createTexture = function _createTexture(image) {
            var gl = this.gl;
            var texture = this.getTexture() || gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            return texture;
        };

        renderable.prototype.getTexture = function getTexture() {
            if (!this._textures) {
                this._textures = [];
            }
            var textures = this._textures;
            return textures && textures.length > 0 ? textures.pop() : null;
        };

        renderable.prototype.saveTexture = function saveTexture(texture) {
            this._textures.push(texture);
        };

        renderable.prototype.loadTexture = function loadTexture(image) {
            var gl = this.gl;
            var texture = image.texture;
            if (!texture) {
                texture = this._createTexture(image);
                image.texture = texture;
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return texture;
        };

        renderable.prototype.removeGLCanvas = function removeGLCanvas() {
            var gl = this.gl;
            if (!gl) {
                return;
            }
            if (this._buffers) {
                this._buffers.forEach(function (b) {
                    gl.deleteBuffer(b);
                });
                delete this._buffers;
            }
            if (this._textures) {
                this._textures.forEach(function (t) {
                    return gl.deleteTexture(t);
                });
                delete this._textures;
            }
            delete this.posBuffer;
            var program = gl.program;
            gl.deleteProgram(program);
            gl.deleteShader(program.fragmentShader);
            gl.deleteShader(program.vertexShader);
            delete this.gl;
            delete this.glCanvas;
        };

        renderable.prototype.createBuffer = function createBuffer() {
            var gl = this.gl;

            var buffer = gl.createBuffer();
            if (!buffer) {
                throw new Error('Failed to create the buffer object');
            }
            if (!this._buffers) {
                this._buffers = [];
            }
            this._buffers.push(buffer);
            return buffer;
        };

        renderable.prototype.enableVertexAttrib = function enableVertexAttrib(attributes) {
            var gl = this.gl;
            if (Array.isArray(attributes[0])) {
                var verticesTexCoords = new Float32Array([0.0, 0.0, 0.0]);
                var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
                var STRIDE = 0;
                for (var i = 0; i < attributes.length; i++) {
                    STRIDE += attributes[i][1] || 0;
                }
                var offset = 0;
                for (var _i = 0; _i < attributes.length; _i++) {
                    var attr = gl.getAttribLocation(gl.program, attributes[_i][0]);
                    if (attr < 0) {
                        throw new Error('Failed to get the storage location of ' + attributes[_i][0]);
                    }
                    gl.vertexAttribPointer(attr, attributes[_i][1], gl[attributes[_i][2] || 'FLOAT'], false, FSIZE * STRIDE, FSIZE * offset);
                    offset += attributes[_i][1] || 0;
                    gl.enableVertexAttribArray(attr);
                }
            } else {
                var _attr = gl.getAttribLocation(gl.program, attributes[0]);
                gl.vertexAttribPointer(_attr, attributes[1], gl[attributes[2] || 'FLOAT'], false, 0, 0);
                gl.enableVertexAttribArray(_attr);
            }
        };

        renderable.prototype.createProgram = function createProgram(vshader, fshader, uniforms) {
            var gl = this.gl;

            var vertexShader = this._compileShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader = this._compileShader(gl, gl.FRAGMENT_SHADER, fshader);
            if (!vertexShader || !fragmentShader) {
                return null;
            }

            var program = gl.createProgram();
            if (!program) {
                return null;
            }

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);
            gl.vertexShader = vertexShader;
            gl.fragmentShader = fragmentShader;

            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                throw new Error('Failed to link program: ' + error);
            }

            this._initUniforms(program, uniforms);

            return program;
        };

        renderable.prototype.useProgram = function useProgram(program) {
            var gl = this.gl;
            gl.useProgram(program);
            gl.program = program;
            return this;
        };

        renderable.prototype.enableSampler = function enableSampler(sampler, texIdx) {
            var gl = this.gl;
            var uSampler = this._getUniform(gl.program, sampler);
            if (!texIdx) {
                texIdx = 0;
            }

            gl.uniform1i(uSampler, texIdx);
            return uSampler;
        };

        renderable.prototype._createGLContext = function _createGLContext(canvas, options) {
            var attributes = {
                'alpha': true,
                'preserveDrawingBuffer': true,
                'antialias': false
            };
            var names = ['webgl', 'experimental-webgl'];
            var context = null;

            for (var i = 0; i < names.length; ++i) {
                try {
                    context = canvas.getContext(names[i], options || attributes);
                } catch (e) {}
                if (context) {
                    break;
                }
            }
            return context;
        };

        renderable.prototype._compileShader = function _compileShader(gl, type, source) {
            var shader = gl.createShader(type);
            if (shader == null) {
                throw new Error('unable to create shader');
            }

            gl.shaderSource(shader, source);

            gl.compileShader(shader);

            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var error = gl.getShaderInfoLog(shader);

                gl.deleteShader(shader);
                throw new Error('Failed to compile shader: ' + error);
            }

            return shader;
        };

        renderable.prototype._initUniforms = function _initUniforms(program, uniforms) {
            for (var i = 0; i < uniforms.length; i++) {
                var name = uniforms[i];
                var uniform = uniforms[i];
                var b = name.indexOf('[');
                if (b >= 0) {
                    name = name.substring(0, b);
                    if (!IS_NODE) {
                        uniform = uniform.substring(0, b);
                    }
                }
                program[name] = this._getUniform(program, uniform);
            }
        };

        renderable.prototype._getUniform = function _getUniform(program, uniformName) {
            var gl = this.gl;
            var uniform = gl.getUniformLocation(program, uniformName);
            if (!uniform) {
                throw new Error('Failed to get the storage location of ' + uniformName);
            }
            return uniform;
        };

        return renderable;
    }(Base);

    extend(renderable.prototype, {
        copy12: function () {
            var m = Browser$1.ie9 ? null : new Float32Array(12);
            return function (arr) {
                return copy(m, arr);
            };
        }(),

        copy16: function () {
            var m = Browser$1.ie9 ? null : new Float32Array(16);
            return function (arr) {
                return copy(m, arr);
            };
        }()
    });

    return renderable;
};

var TileLayerCanvasRenderer = function (_CanvasRenderer) {
    inherits(TileLayerCanvasRenderer, _CanvasRenderer);

    function TileLayerCanvasRenderer(layer) {
        classCallCheck(this, TileLayerCanvasRenderer);

        var _this = possibleConstructorReturn(this, _CanvasRenderer.call(this, layer));

        _this._tileRended = {};
        _this._tileLoading = {};
        return _this;
    }

    TileLayerCanvasRenderer.prototype.prepareRender = function prepareRender() {
        _CanvasRenderer.prototype.prepareRender.call(this);
        var tileZoom = this.layer._getTileZoom();
        var map = this.getMap();
        if (this._shouldSaveBack() && map.isZooming() && (map.isMoving() || map.isRotating()) && this._tileZoom !== tileZoom) {
            this._saveBackground();
            this._backZoom = this._tileZoom;
            this._backRefreshed = true;
        }
    };

    TileLayerCanvasRenderer.prototype.draw = function draw() {
        var map = this.getMap();
        if (!this.isDrawable()) {
            return;
        }
        var mask2DExtent = this.prepareCanvas();
        if (mask2DExtent) {
            if (!mask2DExtent.intersects(this._extent2D)) {
                this.completeRender();
                return;
            }
        }
        var layer = this.layer;
        var tileGrid = layer.getTiles();
        if (!tileGrid) {
            this.completeRender();
            return;
        }
        var tiles = tileGrid['tiles'];

        this._tileZoom = tileGrid.zoom;

        this.resetCanvasTransform();
        this._drawBackground();
        var loadingCount = this._markTiles(),
            tileLimit = this._getTileLimitOnInteracting();

        this._tileCountToLoad = 0;
        var loading = false;

        var tileQueue = {};
        for (var i = tiles.length - 1; i >= 0; i--) {
            var tile = tiles[i],
                tileId = tiles[i]['id'];

            var cached = this._getCachedTile(tileId);
            if (this._isLoadingTile(tileId)) {
                loading = true;
                continue;
            }
            if (cached) {
                if (!loading && this.getTileOpacity(cached.image) < 1) {
                    loading = true;
                }
                this.drawTile(cached.info, cached.image);
            } else {
                loading = true;
                var hitLimit = tileLimit && this._tileCountToLoad + loadingCount[0] > tileLimit;
                if (!hitLimit) {
                    this._tileCountToLoad++;
                    tileQueue[tileId + '@' + tile['point'].toArray().join()] = tile;
                }
            }
        }
        if (this._tileCountToLoad === 0) {
            if (!loading) {
                if (this.background && !map.options['zoomBackground'] && !map.isAnimating()) {
                    this.setToRedraw();
                    delete this.background;
                    delete this._backZoom;
                }
                this.completeRender();
            }
        } else {
            this.loadTileQueue(tileQueue);
        }
        this._retireTiles();
    };

    TileLayerCanvasRenderer.prototype.drawOnInteracting = function drawOnInteracting() {
        var map = this.getMap();
        if (map.isZooming() && !map.isMoving() && !map.isRotating()) {
            this._drawBackground();
            this.completeRender();
        } else {
            this.draw();
        }
    };

    TileLayerCanvasRenderer.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        if (map.getPitch()) {
            return _CanvasRenderer.prototype.needToRedraw.call(this);
        }
        if (map.isRotating()) {
            return true;
        }
        if (map.isZooming()) {
            return !!this.layer.options['forceRenderOnZooming'];
        }
        if (map.isMoving()) {
            return !!this.layer.options['forceRenderOnMoving'];
        }
        return _CanvasRenderer.prototype.needToRedraw.call(this);
    };

    TileLayerCanvasRenderer.prototype.hitDetect = function hitDetect() {
        return false;
    };

    TileLayerCanvasRenderer.prototype._getTileLimitOnInteracting = function _getTileLimitOnInteracting() {
        if (this.getMap().isInteracting()) {
            return 1;
        }
        return 10;
    };

    TileLayerCanvasRenderer.prototype.isDrawable = function isDrawable() {
        if (this.getMap().getPitch()) {
            if (console) {
                console.warn('TileLayer with canvas renderer can\'t be pitched, use gl renderer (\'renderer\' : \'gl\') instead.');
            }
            this.clear();
            return false;
        }
        return true;
    };

    TileLayerCanvasRenderer.prototype._isLoadingTile = function _isLoadingTile(tileId) {
        return !!this._tileLoading[tileId];
    };

    TileLayerCanvasRenderer.prototype.clipCanvas = function clipCanvas(context) {
        var mask = this.layer.getMask();
        if (!mask) {
            return this._clipByPitch(context);
        }
        return _CanvasRenderer.prototype.clipCanvas.call(this, context);
    };

    TileLayerCanvasRenderer.prototype._clipByPitch = function _clipByPitch(ctx) {
        var map = this.getMap();
        if (map.getPitch() <= map.options['maxVisualPitch']) {
            return false;
        }
        var clipExtent = map.getContainerExtent();
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.beginPath();
        ctx.rect(0, Math.ceil(clipExtent.ymin), Math.ceil(clipExtent.getWidth()), Math.ceil(clipExtent.getHeight()));
        ctx.stroke();
        ctx.clip();
        return true;
    };

    TileLayerCanvasRenderer.prototype.loadTileQueue = function loadTileQueue(tileQueue) {
        for (var p in tileQueue) {
            if (tileQueue.hasOwnProperty(p)) {
                var tile = tileQueue[p];
                var tileImage = this.loadTile(tile);
                if (!tileImage.loadTime) {
                    tileImage.current = true;
                    this._tileLoading[tile['id']] = tileImage;
                }
            }
        }
    };

    TileLayerCanvasRenderer.prototype.loadTile = function loadTile(tile) {
        var tileSize = this.layer.getTileSize();
        var tileImage = new Image();

        tileImage.width = tileSize['width'];
        tileImage.height = tileSize['height'];

        tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
        tileImage.onerror = this.onTileError.bind(this, tileImage, tile);

        var crossOrigin = this.layer.options['crossOrigin'];
        if (crossOrigin) {
            tileImage.crossOrigin = crossOrigin;
        }
        this.loadTileImage(tileImage, tile['url']);
        return tileImage;
    };

    TileLayerCanvasRenderer.prototype.loadTileImage = function loadTileImage(tileImage, url) {
        return loadImage(tileImage, [url]);
    };

    TileLayerCanvasRenderer.prototype.onTileLoad = function onTileLoad(tileImage, tileInfo) {
        if (!this.layer) {
            return;
        }
        var id = tileInfo['id'];
        if (!this._tileRended) {
            return;
        }
        tileImage.loadTime = now();
        delete this._tileLoading[id];
        this._addTileToCache(tileInfo, tileImage);
        this.setToRedraw();
    };

    TileLayerCanvasRenderer.prototype.onTileError = function onTileError(tileImage, tileInfo) {
        if (!this.layer) {
            return;
        }
        tileImage.onload = falseFn;
        tileImage.onerror = falseFn;
        tileImage.src = emptyImageUrl;
        tileImage.loadTime = 0;
        delete this._tileLoading[tileInfo['id']];
        this._addTileToCache(tileInfo, tileImage);
        this.setToRedraw();
    };

    TileLayerCanvasRenderer.prototype.drawTile = function drawTile(tileInfo, tileImage) {
        if (!tileImage || !this.getMap()) {
            return;
        }
        var point = tileInfo.point,
            tileZoom = tileInfo.z,
            tileId = tileInfo.id;
        var map = this.getMap(),
            tileSize = this.layer.getTileSize(),
            zoom = map.getZoom(),
            ctx = this.context,
            cp = map._pointToContainerPoint(point, tileZoom),
            bearing = map.getBearing(),
            transformed = bearing || zoom !== tileZoom;
        var opacity = this.getTileOpacity(tileImage);
        var alpha = ctx.globalAlpha;
        if (opacity < 1) {
            ctx.globalAlpha = opacity;
            this.setToRedraw();
        }
        if (!transformed) {
            cp._round();
        }
        var x = cp.x,
            y = cp.y;
        var w = tileSize['width'],
            h = tileSize['height'];
        if (transformed) {
            w++;
            h++;
            ctx.save();
            ctx.translate(x, y);
            if (bearing) {
                ctx.rotate(-bearing * Math.PI / 180);
            }
            if (zoom !== this._tileZoom) {
                var scale = map._getResolution(this._tileZoom) / map._getResolution();
                ctx.scale(scale, scale);
            }
            x = y = 0;
        }
        Canvas.image(ctx, tileImage, x, y, w, h);
        if (this.layer.options['debug']) {
            var p = new Point(x, y),
                color = this.layer.options['debugOutline'],
                xyz = tileId.split('__');
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.strokeWidth = 10;
            ctx.font = '15px monospace';
            Canvas.rectangle(ctx, p, tileSize, 1, 0);
            Canvas.fillText(ctx, 'x:' + xyz[1] + ', y:' + xyz[0] + ', z:' + xyz[2], p.add(10, 20), color);
            Canvas.drawCross(ctx, p.add(w / 2, h / 2), 2, color);
            ctx.restore();
        }
        if (transformed) {
            ctx.restore();
        }
        if (ctx.globalAlpha !== alpha) {
            ctx.globalAlpha = alpha;
        }
        this.setCanvasUpdated();
    };

    TileLayerCanvasRenderer.prototype._getCachedTile = function _getCachedTile(tileId) {
        var cached = this._tileRended[tileId];
        if (this._tileRended[tileId]) {
            this._tileRended[tileId].current = true;
        }
        if (this._tileLoading && this._tileLoading[tileId]) {
            this._tileLoading[tileId].current = true;
        }
        return cached;
    };

    TileLayerCanvasRenderer.prototype._addTileToCache = function _addTileToCache(tileInfo, tileImage) {
        this._tileRended[tileInfo.id] = {
            image: tileImage,
            current: true,
            info: tileInfo
        };
    };

    TileLayerCanvasRenderer.prototype.getTileOpacity = function getTileOpacity(tileImage) {
        if (!this.layer.options['fadeAnimation']) {
            return 1;
        }
        return Math.min(1, (now() - tileImage.loadTime) / (1000 / 60 * 10));
    };

    TileLayerCanvasRenderer.prototype.onRemove = function onRemove() {
        delete this._tileRended;
        delete this._tileZoom;
        delete this._tileLoading;
        delete this._backCanvas;
    };

    TileLayerCanvasRenderer.prototype._markTiles = function _markTiles() {
        var a = 0,
            b = 0;
        if (this._tileLoading) {
            for (var p in this._tileLoading) {
                this._tileLoading[p].current = false;
                a++;
            }
        }
        if (this._tileRended) {
            for (var _p in this._tileRended) {
                this._tileRended[_p].current = false;
                b++;
            }
        }
        return [a, b];
    };

    TileLayerCanvasRenderer.prototype._retireTiles = function _retireTiles() {
        for (var i in this._tileLoading) {
            var tile = this._tileLoading[i];
            if (!tile.current) {
                tile.onload = falseFn;
                tile.onerror = falseFn;
                tile.src = emptyImageUrl;
                this.deleteTile(tile);
                delete this._tileLoading[i];
            }
        }
        for (var _i in this._tileRended) {
            var _tile = this._tileRended[_i];
            if (!_tile.current) {
                this.deleteTile(_tile.image);
                delete this._tileRended[_i];
            }
        }
    };

    TileLayerCanvasRenderer.prototype.deleteTile = function deleteTile(tile) {
        if (!tile) {
            return;
        }
        delete tile.onload;
        delete tile.onerror;
    };

    TileLayerCanvasRenderer.prototype._drawBackground = function _drawBackground() {
        var ctx = this.context;
        var back = this.background;
        if (back && back.nw && ctx) {
            var map = this.getMap();
            var scale = map._getResolution(back.zoom) / map._getResolution();
            var cp = map._pointToContainerPoint(back.nw, back.zoom);
            var bearing = map.getBearing() - back.bearing;
            if (Browser$1.retina) {
                scale *= 1 / 2;
            }
            ctx.save();
            ctx.translate(cp.x, cp.y);
            if (bearing) {
                ctx.rotate(-bearing * Math.PI / 180);
            }
            ctx.scale(scale, scale);
            ctx.drawImage(back.canvas, 0, 0);
            ctx.restore();
        }
    };

    TileLayerCanvasRenderer.prototype._saveBackground = function _saveBackground() {
        var map = this.getMap();
        if (!this._backCanvas) {
            this._backCanvas = Canvas.createCanvas(1, 1);
        }
        this.background = {
            canvas: Canvas.copy(this.canvas, this._backCanvas),
            zoom: map.getZoom(),
            nw: this._northWest,
            bearing: map.getBearing()
        };
    };

    TileLayerCanvasRenderer.prototype._shouldSaveBack = function _shouldSaveBack() {
        var map = this.getMap();
        return !IS_NODE && this.canvas && map && this.layer === map.getBaseLayer();
    };

    TileLayerCanvasRenderer.prototype.onZoomStart = function onZoomStart(e) {
        if (this._shouldSaveBack() || this.layer.options['forceRenderOnZooming']) {
            this._backZoom = this._tileZoom;
            this._saveBackground();
        }
        _CanvasRenderer.prototype.onZoomStart.call(this, e);
    };

    TileLayerCanvasRenderer.prototype.onZoomEnd = function onZoomEnd(e) {
        if (this._shouldSaveBack() && this._backRefreshed) {
            this._northWest = this.getMap()._containerPointToPoint(new Point(0, 0));
            this._saveBackground();
            this._backZoom = this._tileZoom;
            delete this._backRefreshed;
        }
        this._markTiles();
        this._retireTiles();
        _CanvasRenderer.prototype.onZoomEnd.call(this, e);
    };

    return TileLayerCanvasRenderer;
}(CanvasRenderer);

TileLayer.registerRenderer('canvas', TileLayerCanvasRenderer);

function falseFn() {
    return false;
}

var TileLayerGLRenderer$1 = function (_ImageGLRenderable) {
    inherits(TileLayerGLRenderer, _ImageGLRenderable);

    function TileLayerGLRenderer() {
        classCallCheck(this, TileLayerGLRenderer);
        return possibleConstructorReturn(this, _ImageGLRenderable.apply(this, arguments));
    }

    TileLayerGLRenderer.prototype.isDrawable = function isDrawable() {
        return true;
    };

    TileLayerGLRenderer.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        if (this._gl() && !map.getPitch() && map.isZooming() && !map.isMoving() && !map.isRotating()) {
            return true;
        }
        return _ImageGLRenderable.prototype.needToRedraw.call(this);
    };

    TileLayerGLRenderer.prototype.drawTile = function drawTile(tileInfo, tileImage) {
        if (!this._gl()) {
            _ImageGLRenderable.prototype.drawTile.call(this, tileInfo, tileImage);
            return;
        }
        if (tileImage.src === emptyImageUrl) {
            return;
        }
        var map = this.getMap();
        if (!tileInfo || !map) {
            return;
        }
        var point = tileInfo.point,
            tileZoom = tileInfo.z;
        var scale = map.getGLScale(tileZoom),
            pp = point.multi(scale),
            tileSize = this.layer.getTileSize();
        var opacity = this.getTileOpacity(tileImage);
        var x = pp.x,
            y = pp.y,
            w = tileSize['width'] * scale,
            h = tileSize['height'] * scale;

        this.drawGLImage(tileImage, x, y, w, h, opacity);

        if (opacity < 1) {
            this.setToRedraw();
        } else {
            this.setCanvasUpdated();
        }
    };

    TileLayerGLRenderer.prototype.loadTileImage = function loadTileImage(tileImage, url) {
        return Ajax.getImage(tileImage, url);
    };

    TileLayerGLRenderer.prototype.onCanvasCreate = function onCanvasCreate() {
        this.prepareGLCanvas();
    };

    TileLayerGLRenderer.prototype.resizeCanvas = function resizeCanvas(canvasSize) {
        if (!this.canvas) {
            return;
        }
        _ImageGLRenderable.prototype.resizeCanvas.call(this, canvasSize);
        this.resizeGLCanvas();
    };

    TileLayerGLRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
        _ImageGLRenderable.prototype.clearCanvas.call(this);
        this.clearGLCanvas();
    };

    TileLayerGLRenderer.prototype.getCanvasImage = function getCanvasImage() {
        if (!this._gl()) {
            return _ImageGLRenderable.prototype.getCanvasImage.call(this);
        }
        var img = _ImageGLRenderable.prototype.getCanvasImage.call(this);
        img.image = this.glCanvas;
        return img;
    };

    TileLayerGLRenderer.prototype._gl = function _gl() {
        return this.getMap() && !!this.getMap().getPitch() || this.layer && !!this.layer.options['fragmentShader'];
    };

    TileLayerGLRenderer.prototype._drawBackground = function _drawBackground() {
        if (this.background) {
            if (!this._gl()) {
                _ImageGLRenderable.prototype._drawBackground.call(this);
            } else if (!this.background.nw) {
                var map = this.getMap();
                var extent = map.getContainerExtent();
                for (var p in this.background) {
                    if (p === 'canvas') {
                        continue;
                    }
                    var parentTile = this.background[p];

                    if (this.layer._isTileInExtent(parentTile.info, extent)) {
                        this.drawTile(parentTile.info, parentTile.image);
                    }
                }
                if (!map.isZooming()) {
                    var backCanvas = this.background.canvas;
                    if (!backCanvas) {
                        backCanvas = Canvas.copy(this.glCanvas);
                        this.background.canvas = backCanvas;
                    } else {
                        backCanvas.width = this.glCanvas.width;
                        backCanvas.height = this.glCanvas.height;
                        backCanvas.getContext('2d').drawImage(this.glCanvas, 0, 0);
                        var ctx = this.context;
                        if (Browser$1.retina) {
                            ctx.save();
                            ctx.scale(1 / 2, 1 / 2);
                        }
                        ctx.drawImage(backCanvas, 0, 0);
                        if (Browser$1.retina) {
                            ctx.restore();
                        }
                    }
                }
            }
        }
    };

    TileLayerGLRenderer.prototype._saveBackground = function _saveBackground() {
        if (!this._gl()) {
            _ImageGLRenderable.prototype._saveBackground.call(this);
            return;
        }
        this.background = {};
        var cache = this._tileRended;
        for (var p in cache) {
            var tile = cache[p];
            if (hasOwn(cache, p) && tile && tile.image.current) {
                tile.image.loadTime = 0;
                this.background[p] = tile;
            }
        }
    };

    TileLayerGLRenderer.prototype.deleteTile = function deleteTile(tile) {
        _ImageGLRenderable.prototype.deleteTile.call(this, tile);
        if (tile && !tile.current && tile.texture) {
            this.saveTexture(tile.texture);
            delete tile.texture;
        }
    };

    TileLayerGLRenderer.prototype.onRemove = function onRemove() {
        this.removeGLCanvas();
    };

    return TileLayerGLRenderer;
}(ImageGLRenderable(TileLayerCanvasRenderer));

TileLayer.registerRenderer('gl', TileLayerGLRenderer$1);

function _loadTile(tile) {
    var tileSize = this.layer.getTileSize(),
        canvasClass = this.canvas.constructor,
        map = this.getMap();
    var r = Browser$1.retina ? 2 : 1;
    var tileCanvas = Canvas.createCanvas(tileSize['width'] * r, tileSize['height'] * r, canvasClass);
    tileCanvas['layer'] = this.layer;
    var me = this;
    var extent = new Extent(map.pointToCoordinate(tile['point']), map.pointToCoordinate(tile['point'].add(tileSize.toPoint())), map.getProjection());
    this.layer.drawTile(tileCanvas, {
        'url': tile['url'],
        'point': tile['point'],
        'center': map.pointToCoordinate(tile['point'].add(tileSize['width'] / 2, tileSize['height'] / 2)),
        'extent': extent,
        'z': tile['z'],
        'x': tile['x'],
        'y': tile['y']
    }, function (error) {
        if (error) {
            me.onTileError(tileCanvas, tile);
            return;
        }
        me.onTileLoad(tileCanvas, tile);
    });
    return tileCanvas;
}

var CanvasRenderer$2 = function (_TileLayerCanvasRende) {
    inherits(CanvasRenderer, _TileLayerCanvasRende);

    function CanvasRenderer() {
        classCallCheck(this, CanvasRenderer);
        return possibleConstructorReturn(this, _TileLayerCanvasRende.apply(this, arguments));
    }

    CanvasRenderer.prototype.loadTile = function loadTile() {
        return _loadTile.apply(this, arguments);
    };

    return CanvasRenderer;
}(TileLayerCanvasRenderer);

var GLRenderer = function (_TileLayerGLRenderer) {
    inherits(GLRenderer, _TileLayerGLRenderer);

    function GLRenderer() {
        classCallCheck(this, GLRenderer);
        return possibleConstructorReturn(this, _TileLayerGLRenderer.apply(this, arguments));
    }

    GLRenderer.prototype.loadTile = function loadTile() {
        return _loadTile.apply(this, arguments);
    };

    return GLRenderer;
}(TileLayerCanvasRenderer);

CanvasTileLayer.registerRenderer('canvas', CanvasRenderer$2);
CanvasTileLayer.registerRenderer('gl', GLRenderer);

var OverlayLayerRenderer = function (_CanvasRenderer) {
    inherits(OverlayLayerRenderer, _CanvasRenderer);

    function OverlayLayerRenderer() {
        classCallCheck(this, OverlayLayerRenderer);
        return possibleConstructorReturn(this, _CanvasRenderer.apply(this, arguments));
    }

    OverlayLayerRenderer.prototype.checkResources = function checkResources() {
        var geometries = this._geosToCheck;
        if (!this._resourceChecked && !geometries) {
            geometries = this.layer._geoList;
        }
        if (!isArrayHasData(geometries)) {
            return [];
        }
        var resources = [];
        var cache = {};

        for (var i = geometries.length - 1; i >= 0; i--) {
            var geo = geometries[i];
            var res = geo._getExternalResources();
            if (!res.length) {
                continue;
            }
            if (!this.resources) {
                resources.push.apply(resources, res);
            } else {
                for (var _i = 0; _i < res.length; _i++) {
                    var url = res[_i][0];
                    if (!this.resources.isResourceLoaded(res[_i]) && !cache[url]) {
                        resources.push(res[_i]);
                        cache[url] = 1;
                    }
                }
            }
        }
        this._resourceChecked = true;
        delete this._geosToCheck;
        return resources;
    };

    OverlayLayerRenderer.prototype.render = function render() {
        this.layer._sortGeometries();
        return _CanvasRenderer.prototype.render.apply(this, arguments);
    };

    OverlayLayerRenderer.prototype._addGeoToCheckRes = function _addGeoToCheckRes(res) {
        if (!res) {
            return;
        }
        if (!Array.isArray(res)) {
            res = [res];
        }
        if (!this._geosToCheck) {
            this._geosToCheck = [];
        }
        pushIn(this._geosToCheck, res);
    };

    OverlayLayerRenderer.prototype.onGeometryAdd = function onGeometryAdd(geometries) {
        this._addGeoToCheckRes(geometries);
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryRemove = function onGeometryRemove() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometrySymbolChange = function onGeometrySymbolChange(e) {
        this._addGeoToCheckRes(e.target);
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryShapeChange = function onGeometryShapeChange() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryPositionChange = function onGeometryPositionChange() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryZIndexChange = function onGeometryZIndexChange() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryShow = function onGeometryShow() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryHide = function onGeometryHide() {
        redraw(this);
    };

    OverlayLayerRenderer.prototype.onGeometryPropertiesChange = function onGeometryPropertiesChange() {
        redraw(this);
    };

    return OverlayLayerRenderer;
}(CanvasRenderer);

function redraw(renderer) {
    if (renderer.layer.options['drawImmediate']) {
        renderer.render();
    }
    renderer.setToRedraw();
}

var VectorLayerRenderer = function (_OverlayLayerCanvasRe) {
    inherits(VectorLayerRenderer, _OverlayLayerCanvasRe);

    function VectorLayerRenderer() {
        classCallCheck(this, VectorLayerRenderer);
        return possibleConstructorReturn(this, _OverlayLayerCanvasRe.apply(this, arguments));
    }

    VectorLayerRenderer.prototype.checkResources = function checkResources() {
        var _this2 = this;

        var resources = _OverlayLayerCanvasRe.prototype.checkResources.apply(this, arguments);
        var style = this.layer.getStyle();
        if (style) {
            if (!Array.isArray(style)) {
                style = [style];
            }
            style.forEach(function (s) {
                var res = getExternalResources(s['symbol'], true);
                for (var i = 0, l = res.length; i < l; i++) {
                    if (!_this2.resources.isResourceLoaded(res[i])) {
                        resources.push(res[i]);
                    }
                }
            });
        }
        return resources;
    };

    VectorLayerRenderer.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        if (map.isInteracting() && this.layer.options['enableAltitude']) {
            return true;
        }

        if (map.isZooming() && !map.getPitch() && !this._hasPoint && this.layer.constructor === VectorLayer) {
            return false;
        }
        return _OverlayLayerCanvasRe.prototype.needToRedraw.call(this);
    };

    VectorLayerRenderer.prototype.draw = function draw() {
        if (!this.getMap()) {
            return;
        }
        if (!this.layer.isVisible() || this.layer.isEmpty()) {
            this.clearCanvas();
            this.completeRender();
            return;
        }

        this.prepareCanvas();

        this.drawGeos();

        this.completeRender();
    };

    VectorLayerRenderer.prototype.isBlank = function isBlank() {
        if (!this.context) {
            return false;
        }
        return !this.context.canvas._drawn;
    };

    VectorLayerRenderer.prototype.drawOnInteracting = function drawOnInteracting() {
        if (!this._geosToDraw) {
            return;
        }
        this._getDisplayExtent();
        for (var i = 0, l = this._geosToDraw.length; i < l; i++) {
            if (!this._geosToDraw[i].isVisible()) {
                continue;
            }
            this._geosToDraw[i]._paint(this._displayExtent);
        }
    };

    VectorLayerRenderer.prototype.show = function show() {
        this.layer.forEach(function (geo) {
            geo._repaint();
        });
        _OverlayLayerCanvasRe.prototype.show.apply(this, arguments);
    };

    VectorLayerRenderer.prototype.forEachGeo = function forEachGeo(fn, context) {
        this.layer.forEach(fn, context);
    };

    VectorLayerRenderer.prototype.drawGeos = function drawGeos() {
        this._getDisplayExtent();
        this.prepareToDraw();

        this.forEachGeo(this.checkGeo, this);
        for (var i = 0, len = this._geosToDraw.length; i < len; i++) {
            this._geosToDraw[i]._paint();
        }
    };

    VectorLayerRenderer.prototype.prepareToDraw = function prepareToDraw() {
        this._hasPoint = false;
        this._geosToDraw = [];
    };

    VectorLayerRenderer.prototype.checkGeo = function checkGeo(geo) {
        if (!geo || !geo.isVisible() || !geo.getMap() || !geo.getLayer() || !geo.getLayer().isCanvasRender()) {
            return;
        }

        var painter = geo._getPainter(),
            extent2D = painter.get2DExtent(this.resources);
        if (!extent2D || !extent2D.intersects(this._displayExtent)) {
            return;
        }
        if (painter.hasPoint()) {
            this._hasPoint = true;
        }
        this._geosToDraw.push(geo);
    };

    VectorLayerRenderer.prototype.onZoomEnd = function onZoomEnd() {
        delete this._extent2D;
        _OverlayLayerCanvasRe.prototype.onZoomEnd.apply(this, arguments);
    };

    VectorLayerRenderer.prototype.onRemove = function onRemove() {
        this.forEachGeo(function (g) {
            g.onHide();
        });
        delete this._geosToDraw;
    };

    VectorLayerRenderer.prototype.onGeometryPropertiesChange = function onGeometryPropertiesChange(param) {
        if (param) {
            this.layer._styleGeometry(param['target']);
        }
        _OverlayLayerCanvasRe.prototype.onGeometryPropertiesChange.call(this, param);
    };

    VectorLayerRenderer.prototype._getDisplayExtent = function _getDisplayExtent() {
        var extent2D = this._extent2D;
        if (this._maskExtent) {
            if (!this._maskExtent.intersects(extent2D)) {
                this.completeRender();
                return;
            }
            extent2D = extent2D.intersection(this._maskExtent);
        }
        this._displayExtent = extent2D;
    };

    VectorLayerRenderer.prototype.identify = function identify(coordinate) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var geometries = this._geosToDraw;
        if (!geometries) {
            return [];
        }
        return this.layer._hitGeos(geometries, coordinate, options);
    };

    return VectorLayerRenderer;
}(OverlayLayerRenderer);

VectorLayer.registerRenderer('canvas', VectorLayerRenderer);

var MapRenderer = function (_Class) {
    inherits(MapRenderer, _Class);

    function MapRenderer(map) {
        classCallCheck(this, MapRenderer);

        var _this = possibleConstructorReturn(this, _Class.call(this));

        _this.map = map;
        _this._handlerQueue = {};
        return _this;
    }

    MapRenderer.prototype.callInNextFrame = function callInNextFrame(fn) {
        this._handlerQueue.push(fn);
    };

    MapRenderer.prototype.executeFrameCallbacks = function executeFrameCallbacks() {
        var running = this._handlerQueue;
        this._handlerQueue = [];
        for (var i = 0, l = running.length; i < l; i++) {
            running[i]();
        }
    };

    MapRenderer.prototype.offsetPlatform = function offsetPlatform(offset) {
        if (!this.map._panels.front) {
            return this;
        }
        if (offset.x === 0 && offset.y === 0) {
            return this;
        }
        var pos = this.map.offsetPlatform().add(offset)._round();
        var panels = this.map._panels;
        offsetDom(panels.back, pos);
        offsetDom(panels.front, pos);
        return this;
    };

    MapRenderer.prototype.resetContainer = function resetContainer() {
        if (!this.map) {
            return;
        }
        this.map._resetMapViewPoint();
        if (this.map._panels.front) {
            var pos = new Point(0, 0);
            offsetDom(this.map._panels.back, pos);
            offsetDom(this.map._panels.front, pos);
        }
    };

    MapRenderer.prototype.onZoomEnd = function onZoomEnd() {
        this.resetContainer();
    };

    MapRenderer.prototype.onLoad = function onLoad() {
        this._frameLoop();
    };

    return MapRenderer;
}(Class);

var MapCanvasRenderer = function (_MapRenderer) {
    inherits(MapCanvasRenderer, _MapRenderer);

    function MapCanvasRenderer(map) {
        classCallCheck(this, MapCanvasRenderer);

        var _this = possibleConstructorReturn(this, _MapRenderer.call(this, map));

        _this._containerIsCanvas = !!map._containerDOM.getContext;
        _this._registerEvents();
        _this._loopTime = 0;
        return _this;
    }

    MapCanvasRenderer.prototype.load = function load() {
        this.initContainer();
    };

    MapCanvasRenderer.prototype.renderFrame = function renderFrame() {
        if (!this.map) {
            return false;
        }
        var map = this.map;
        map._fireEvent('framestart');
        this.updateMapDOM();
        var layers = this._getAllLayerToRender();
        this.drawLayers(layers);
        this.drawLayerCanvas(layers);

        map._fireEvent('frameend');
        this._recordView();

        this._mapview = this._getMapView();
        delete this._spatialRefChanged;
        this._fireLayerLoadEvents();
        this.executeFrameCallbacks();
        this._needRedraw = false;
        return true;
    };

    MapCanvasRenderer.prototype.updateMapDOM = function updateMapDOM() {
        var map = this.map;

        if (map.isZooming()) {
            return;
        }
        var offset = map._getViewPointFrameOffset();
        if (offset) {
            map.offsetPlatform(offset);
        }
    };

    MapCanvasRenderer.prototype.drawLayers = function drawLayers(layers) {
        var map = this.map,
            isInteracting = map.isInteracting(),
            canvasIds = [],
            updatedIds = [],
            fps = map.options['fpsOnInteracting'] || 0,
            timeLimit = fps === 0 ? 0 : 1000 / fps,
            layerLimit = this.map.options['layerCanvasLimitOnInteracting'],
            l = layers.length;
        var baseLayer = map.getBaseLayer();
        var t = 0;
        for (var i = l - 1; i >= 0; i--) {
            var layer = layers[i];
            if (!layer.isVisible()) {
                continue;
            }
            var isCanvas = layer.isCanvasRender();
            if (isCanvas) {
                canvasIds.push(layer.getId());
            }
            var renderer = layer._getRenderer();
            if (!renderer) {
                continue;
            }

            var needsRedraw = this._checkLayerRedraw(layer);
            if (isCanvas && renderer.isCanvasUpdated()) {
                if (!needsRedraw) {
                    updatedIds.push(layer.getId());
                }
                this.setToRedraw();
            }
            delete renderer.__shouldZoomTransform;
            if (!needsRedraw) {
                if (isCanvas && isInteracting) {
                    if (map.isZooming() && !map.getPitch()) {
                        renderer.prepareRender();
                        renderer.__shouldZoomTransform = true;
                    } else if (map.getPitch() || map.isRotating()) {
                        renderer.clearCanvas();
                    }
                }
                continue;
            }

            if (isInteracting && isCanvas) {
                if (layerLimit > 0 && l - 1 - i > layerLimit && layer !== baseLayer) {
                    layer._getRenderer().clearCanvas();
                    continue;
                }
                t += this._drawCanvasLayerOnInteracting(layer, t, timeLimit);
            } else if (isInteracting && renderer.drawOnInteracting) {
                if (renderer.prepareRender) {
                    renderer.prepareRender();
                }
                renderer.drawOnInteracting(this._eventParam);
            } else {
                renderer.render();
            }

            if (isCanvas) {
                updatedIds.push(layer.getId());
                this.setToRedraw();
            }
        }

        var preCanvasIds = this._canvasIds || [];
        var preUpdatedIds = this._updatedIds || [];
        this._canvasIds = canvasIds;
        this._updatedIds = updatedIds;
        if (!this._needToRedraw()) {
            var sep = '---';
            if (preCanvasIds.join(sep) !== canvasIds.join(sep) || preUpdatedIds.join(sep) !== updatedIds.join(sep)) {
                this.setToRedraw();
            }
        }
    };

    MapCanvasRenderer.prototype._checkLayerRedraw = function _checkLayerRedraw(layer) {
        if (this.isSpatialReferenceChanged()) {
            return true;
        }
        var map = this.map;
        var renderer = layer._getRenderer();
        if (layer.isCanvasRender()) {
            return renderer.needToRedraw();
        } else {
            if (renderer.needToRedraw && renderer.needToRedraw()) {
                return true;
            }

            return map.isInteracting() || this.isViewChanged();
        }
    };

    MapCanvasRenderer.prototype._drawCanvasLayerOnInteracting = function _drawCanvasLayerOnInteracting(layer, t, timeLimit) {
        var map = this.map,
            renderer = layer._getRenderer(),
            drawTime = renderer.getDrawTime(),
            inTime = timeLimit === 0 || timeLimit > 0 && t + drawTime <= timeLimit;
        if (renderer.mustRenderOnInteracting && renderer.mustRenderOnInteracting()) {
            renderer.render();
        } else if (renderer.drawOnInteracting && (layer === map.getBaseLayer() || inTime || map.isZooming() && layer.options['forceRenderOnZooming'] || map.isMoving() && layer.options['forceRenderOnMoving'] || map.isRotating() && layer.options['forceRenderOnRotating'])) {
            renderer.prepareRender();
            renderer.prepareCanvas();
            renderer.drawOnInteracting(this._eventParam);
            return drawTime;
        } else if (map.isZooming() && !map.getPitch()) {
            renderer.prepareRender();
            renderer.__shouldZoomTransform = true;
        } else if (map.getPitch() || map.isRotating()) {
            renderer.clearCanvas();
        }
        if (renderer.drawOnInteracting && !inTime) {
            renderer.onSkipDrawOnInteracting(this._eventParam);
        }
        return 0;
    };

    MapCanvasRenderer.prototype._fireLayerLoadEvents = function _fireLayerLoadEvents() {
        if (this._updatedIds && this._updatedIds.length > 0) {
            var map = this.map;

            this._updatedIds.reverse().forEach(function (id) {
                var layer = map.getLayer(id);
                if (!layer) {
                    return;
                }
                var renderer = layer._getRenderer();
                if (!renderer || !renderer.isRenderComplete()) {
                    return;
                }

                layer.fire('layerload');
            });
        }
    };

    MapCanvasRenderer.prototype._needToRedraw = function _needToRedraw() {
        return this._needRedraw;
    };

    MapCanvasRenderer.prototype.setToRedraw = function setToRedraw() {
        this._needRedraw = true;
    };

    MapCanvasRenderer.prototype.drawLayerCanvas = function drawLayerCanvas(layers) {
        var map = this.map;
        if (!map) {
            return;
        }
        if (!this._needToRedraw() && !this.isViewChanged()) {
            return;
        }
        if (!this.canvas) {
            this.createCanvas();
        }

        map._fireEvent('renderstart', {
            'context': this.context
        });

        if (!this._updateCanvasSize()) {
            this.clearCanvas();
        }

        var interacting = map.isInteracting(),
            limit = map.options['layerCanvasLimitOnInteracting'];
        var len = layers.length;

        var images = [];
        for (var i = 0; i < len; i++) {
            if (!layers[i].isVisible() || !layers[i].isCanvasRender()) {
                continue;
            }
            var renderer = layers[i]._getRenderer();
            if (!renderer) {
                continue;
            }
            var layerImage = this._getLayerImage(layers[i]);
            if (layerImage && layerImage['image']) {
                images.push([layers[i], layerImage]);
            }
        }

        len = images.length;
        var start = interacting && limit >= 0 && len > limit ? len - limit : 0;
        for (var _i = start; _i < len; _i++) {
            this._drawLayerCanvasImage.apply(this, images[_i]);
        }

        this._drawCenterCross();

        map._fireEvent('renderend', {
            'context': this.context
        });
    };

    MapCanvasRenderer.prototype.updateMapSize = function updateMapSize(size) {
        if (!size || this._containerIsCanvas) {
            return;
        }
        var width = size['width'] + 'px',
            height = size['height'] + 'px';
        var panels = this.map._panels;
        panels.mapWrapper.style.width = width;
        panels.mapWrapper.style.height = height;
        this._updateCanvasSize();
    };

    MapCanvasRenderer.prototype.getMainPanel = function getMainPanel() {
        if (!this.map) {
            return null;
        }
        if (this._containerIsCanvas) {
            return this.map._containerDOM;
        }
        if (this.map._panels) {
            return this.map._panels.mapWrapper;
        }
        return null;
    };

    MapCanvasRenderer.prototype.toDataURL = function toDataURL(mimeType) {
        if (!this.canvas) {
            return null;
        }
        return this.canvas.toDataURL(mimeType);
    };

    MapCanvasRenderer.prototype.remove = function remove() {
        if (this._resizeInterval) {
            clearInterval(this._resizeInterval);
        }
        delete this.context;
        delete this.canvas;
        delete this.map;
        delete this._spatialRefChanged;
        this._cancelFrameLoop();
    };

    MapCanvasRenderer.prototype.hitDetect = function hitDetect(point) {
        var map = this.map;
        if (!map || !map.options['hitDetect'] || map.isInteracting()) {
            return;
        }
        var layers = map._getLayers();
        var cursor = 'default';
        var limit = map.options['hitDetectLimit'] || 0;
        var counter = 0;
        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i];
            if (layer.isEmpty && layer.isEmpty()) {
                continue;
            }
            var renderer = layer._getRenderer();
            if (!renderer || !renderer.hitDetect) {
                continue;
            }
            if (renderer.isBlank && renderer.isBlank()) {
                continue;
            }
            if (layer.options['cursor'] !== 'default' && renderer.hitDetect(point)) {
                cursor = layer.options['cursor'] || 'pointer';
                break;
            }
            counter++;
            if (limit > 0 && counter > limit) {
                break;
            }
        }

        map._trySetCursor(cursor);
    };

    MapCanvasRenderer.prototype._getLayerImage = function _getLayerImage(layer) {
        var renderer = layer._getRenderer();
        if (renderer.getCanvasImage) {
            return renderer.getCanvasImage();
        }
        return null;
    };

    MapCanvasRenderer.prototype.initContainer = function initContainer() {
        var panels = this.map._panels;

        function createContainer(name, className, cssText, enableSelect) {
            var c = createEl('div', className);
            if (cssText) {
                c.style.cssText = cssText;
            }
            panels[name] = c;
            if (!enableSelect) {
                preventSelection(c);
            }
            return c;
        }
        var containerDOM = this.map._containerDOM;

        if (this._containerIsCanvas) {
            return;
        }

        containerDOM.innerHTML = '';

        var POSITION0 = 'position:absolute;top:0px;left:0px;';

        var mapWrapper = createContainer('mapWrapper', 'maptalks-wrapper', 'position:absolute;overflow:hidden;', true),
            mapAllLayers = createContainer('allLayers', 'maptalks-all-layers', POSITION0 + 'padding:0px;margin:0px;z-index:0', true),
            backStatic = createContainer('backStatic', 'maptalks-back-static', POSITION0 + 'z-index:0;', true),
            back = createContainer('back', 'maptalks-back', POSITION0 + 'z-index:1;'),
            backLayer = createContainer('backLayer', 'maptalks-back-layer', POSITION0),
            canvasContainer = createContainer('canvasContainer', 'maptalks-canvas-layer', POSITION0 + 'border:none;z-index:2;'),
            frontStatic = createContainer('frontStatic', 'maptalks-front-static', POSITION0 + 'z-index:3;', true),
            front = createContainer('front', 'maptalks-front', POSITION0 + 'z-index:4;', true),
            frontLayer = createContainer('frontLayer', 'maptalks-front-layer', POSITION0 + 'z-index:0;'),
            ui = createContainer('ui', 'maptalks-ui', POSITION0 + 'border:none;z-index:1;', true),
            control = createContainer('control', 'maptalks-control', 'z-index:1', true);

        containerDOM.appendChild(mapWrapper);

        mapAllLayers.appendChild(backStatic);
        back.appendChild(backLayer);
        mapAllLayers.appendChild(back);
        mapAllLayers.appendChild(canvasContainer);
        front.appendChild(frontLayer);
        mapAllLayers.appendChild(frontStatic);
        mapAllLayers.appendChild(front);
        front.appendChild(ui);

        mapWrapper.appendChild(mapAllLayers);
        mapWrapper.appendChild(control);

        this.createCanvas();

        this.resetContainer();
        var mapSize = this.map._getContainerDomSize();
        this.updateMapSize(mapSize);
    };

    MapCanvasRenderer.prototype.isViewChanged = function isViewChanged() {
        var previous = this._mapview;
        var view = this._getMapView();
        if (!previous || !equalMapView(previous, view)) {
            return true;
        }
        return false;
    };

    MapCanvasRenderer.prototype._recordView = function _recordView() {
        var map = this.map;
        if (!map._onViewChange || map.isInteracting() || map.isAnimating()) {
            return;
        }
        if (!equalMapView(map.getView(), map._getCurrentView())) {
            map._onViewChange(map.getView());
        }
    };

    MapCanvasRenderer.prototype.isSpatialReferenceChanged = function isSpatialReferenceChanged() {
        return this._spatialRefChanged;
    };

    MapCanvasRenderer.prototype._getMapView = function _getMapView() {
        var map = this.map;
        var center = map._getPrjCenter();
        return {
            x: center.x,
            y: center.y,
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
            width: map.width,
            height: map.height
        };
    };

    MapCanvasRenderer.prototype._frameLoop = function _frameLoop() {
        var _this2 = this;

        if (!this.map) {
            this._cancelFrameLoop();
            return;
        }
        this.renderFrame();

        this._animationFrame = requestAnimFrame(function () {
            _this2._frameLoop();
        });
    };

    MapCanvasRenderer.prototype._cancelFrameLoop = function _cancelFrameLoop() {
        if (this._animationFrame) {
            cancelAnimFrame(this._animationFrame);
        }
    };

    MapCanvasRenderer.prototype._drawLayerCanvasImage = function _drawLayerCanvasImage(layer, layerImage) {
        var ctx = this.context;
        var point = layerImage['point'].round();
        if (Browser$1.retina) {
            point._multi(2);
        }
        var canvasImage = layerImage['image'];
        if (point.x + canvasImage.width <= 0 || point.y + canvasImage.height <= 0) {
            return;
        }

        var op = layer.options['opacity'];
        if (!isNumber(op)) {
            op = 1;
        }
        if (op <= 0) {
            return;
        }
        var imgOp = layerImage['opacity'];
        if (!isNumber(imgOp)) {
            imgOp = 1;
        }
        if (imgOp <= 0) {
            return;
        }
        var alpha = ctx.globalAlpha;

        if (op < 1) {
            ctx.globalAlpha *= op;
        }
        if (imgOp < 1) {
            ctx.globalAlpha *= imgOp;
        }
        if (layer.options['cssFilter']) {
            ctx.filter = layer.options['cssFilter'];
        }
        var matrix = this._zoomMatrix;
        var shouldTransform = !!layer._getRenderer().__shouldZoomTransform;
        var renderer = layer.getRenderer();
        var clipped = renderer.clipCanvas(this.context);
        if (matrix && shouldTransform) {
            ctx.save();
            ctx.setTransform.apply(ctx, matrix);
        }

        ctx.drawImage(canvasImage, point.x, point.y);
        if (matrix && shouldTransform) {
            ctx.restore();
        }
        if (clipped) {
            ctx.restore();
        }
        if (ctx.filter !== 'none') {
            ctx.filter = 'none';
        }
        ctx.globalAlpha = alpha;
    };

    MapCanvasRenderer.prototype._drawCenterCross = function _drawCenterCross() {
        var cross = this.map.options['centerCross'];
        if (cross) {
            var ctx = this.context;
            var p = new Point(this.canvas.width / 2, this.canvas.height / 2);
            if (isFunction(cross)) {
                cross(ctx, p);
            } else {
                Canvas.drawCross(this.context, p, 2, '#f00');
            }
        }
    };

    MapCanvasRenderer.prototype._getAllLayerToRender = function _getAllLayerToRender() {
        return this.map._getLayers();
    };

    MapCanvasRenderer.prototype.clearCanvas = function clearCanvas() {
        if (!this.canvas) {
            return;
        }
        Canvas.clearRect(this.context, 0, 0, this.canvas.width, this.canvas.height);
    };

    MapCanvasRenderer.prototype._updateCanvasSize = function _updateCanvasSize() {
        if (!this.canvas || this._containerIsCanvas) {
            return false;
        }
        var map = this.map,
            mapSize = map.getSize(),
            canvas = this.canvas,
            r = Browser$1.retina ? 2 : 1;
        if (mapSize['width'] * r === canvas.width && mapSize['height'] * r === canvas.height) {
            return false;
        }


        canvas.height = r * mapSize['height'];
        canvas.width = r * mapSize['width'];
        if (canvas.style) {
            canvas.style.width = mapSize['width'] + 'px';
            canvas.style.height = mapSize['height'] + 'px';
        }

        return true;
    };

    MapCanvasRenderer.prototype.createCanvas = function createCanvas() {
        if (this._containerIsCanvas) {
            this.canvas = this.map._containerDOM;
        } else {
            this.canvas = createEl('canvas');
            this._updateCanvasSize();
            this.map._panels.canvasContainer.appendChild(this.canvas);
        }
        this.context = this.canvas.getContext('2d');
    };

    MapCanvasRenderer.prototype._checkSize = function _checkSize() {
        if (!this.map || this.map.isInteracting()) {
            return;
        }

        computeDomPosition(this.map._containerDOM);
        this.map.checkSize();
    };

    MapCanvasRenderer.prototype._setCheckSizeInterval = function _setCheckSizeInterval(interval) {
        var _this3 = this;

        clearInterval(this._resizeInterval);
        this._checkSizeInterval = interval;
        this._resizeInterval = setInterval(function () {
            if (!_this3.map || _this3.map.isRemoved()) {
                clearInterval(_this3._resizeInterval);
            } else {
                _this3._checkSize();
            }
        }, this._checkSizeInterval);
    };

    MapCanvasRenderer.prototype._registerEvents = function _registerEvents() {
        var _this4 = this;

        var map = this.map;

        if (map.options['checkSize'] && !IS_NODE && typeof window !== 'undefined') {
            this._setCheckSizeInterval(1000);
        }
        if (!Browser$1.mobile) {
            map.on('_mousemove', this._onMapMouseMove, this);
        }

        map.on('_dragrotatestart _dragrotating _dragrotateend _movestart _moving _moveend _zoomstart', function (param) {
            _this4._eventParam = param;
        });

        map.on('_zooming', function (param) {
            if (!map.getPitch()) {
                _this4._zoomMatrix = param['matrix']['container'];
            }
            _this4._eventParam = param;
        });

        map.on('_zoomend', function (param) {
            _this4._eventParam = param;
            delete _this4._zoomMatrix;
        });

        map.on('_spatialreferencechange', function () {
            _this4._spatialRefChanged = true;
        });
    };

    MapCanvasRenderer.prototype._onMapMouseMove = function _onMapMouseMove(param) {
        var _this5 = this;

        var map = this.map;
        if (map.isInteracting() || !map.options['hitDetect']) {
            return;
        }
        if (this._hitDetectFrame) {
            cancelAnimFrame(this._hitDetectFrame);
        }
        this._hitDetectFrame = requestAnimFrame(function () {
            _this5.hitDetect(param['containerPoint']);
        });
    };

    MapCanvasRenderer.prototype._getCanvasLayers = function _getCanvasLayers() {
        return this.map._getLayers(function (layer) {
            return layer.isCanvasRender();
        });
    };

    return MapCanvasRenderer;
}(MapRenderer);

Map.registerRenderer('canvas', MapCanvasRenderer);



var index$6 = Object.freeze({
	ResourceCache: ResourceCache,
	CanvasRenderer: CanvasRenderer,
	ImageGLRenderable: ImageGLRenderable,
	MapRenderer: MapRenderer,
	MapCanvasRenderer: MapCanvasRenderer,
	Renderable: Renderable,
	TileLayerCanvasRenderer: TileLayerCanvasRenderer,
	TileLayerGLRenderer: TileLayerGLRenderer$1,
	CanvasTileLayerCanvasRenderer: CanvasRenderer$2,
	CanvasTileLayerGLRenderer: GLRenderer,
	OverlayLayerCanvasRenderer: OverlayLayerRenderer,
	VectorLayerCanvasRenderer: VectorLayerRenderer,
	CanvasLayerRenderer: CanvasLayerRenderer
});

var CenterPointRenderer = {
    _getRenderPoints: function _getRenderPoints() {
        return [[this._getCenter2DPoint(this.getMap().getGLZoom())], null];
    }
};

Marker.include(CenterPointRenderer);

Ellipse.include(CenterPointRenderer);

Circle.include(CenterPointRenderer);

Sector.include(CenterPointRenderer);

Rectangle.include({
    _getRenderPoints: function _getRenderPoints(placement) {
        var map = this.getMap();
        if (placement === 'vertex') {
            var shell = this._trimRing(this.getShell());
            var points = [];
            for (var i = 0, len = shell.length; i < len; i++) {
                points.push(map.coordToPoint(shell[i], map.getGLZoom()));
            }
            return [points, null];
        } else {
            var c = map.coordToPoint(this.getCenter(), map.getGLZoom());
            return [[c], null];
        }
    }
});

var PolyRenderer = {
    _getRenderPoints: function _getRenderPoints(placement) {
        var map = this.getMap();
        var maxZoom = map.getGLZoom();
        var points = void 0,
            rotations = null;
        if (placement === 'vertex') {
            points = this._getPath2DPoints(this._getPrjCoordinates(), false, maxZoom);
            if (points && points.length > 0 && Array.isArray(points[0])) {
                points = points[0].concat(points[1]);
            }
        } else if (placement === 'line') {
            points = [];
            rotations = [];
            var vertice = this._getPath2DPoints(this._getPrjCoordinates(), false, maxZoom),
                isSplitted = vertice.length > 0 && Array.isArray(vertice[0]);
            if (isSplitted) {
                var ring = void 0;
                for (var i = 1, l = vertice.length; i < l; i++) {
                    ring = vertice[i];
                    if (this instanceof Polygon && ring.length > 0 && !ring[0].equals(ring[ring.length - 1])) {
                        ring.push(ring[0]);
                    }
                    for (var ii = 1, ll = ring.length; ii < ll; ii++) {
                        points.push(ring[ii].add(ring[ii - 1])._multi(0.5));
                        rotations.push([ring[ii - 1], ring[ii]]);
                    }
                }
            } else {
                if (this instanceof Polygon && vertice.length > 0 && !vertice[0].equals(vertice[vertice.length - 1])) {
                    vertice.push(vertice[0]);
                }
                for (var _i = 1, _l = vertice.length; _i < _l; _i++) {
                    points.push(vertice[_i].add(vertice[_i - 1])._multi(0.5));
                    rotations.push([vertice[_i - 1], vertice[_i]]);
                }
            }
        } else if (placement === 'vertex-first') {
            var first = this._getPrjCoordinates()[0];
            points = [map._prjToPoint(first, maxZoom)];
        } else if (placement === 'vertex-last') {
            var last = this._getPrjCoordinates()[this._getPrjCoordinates().length - 1];
            points = [map._prjToPoint(last, maxZoom)];
        } else {
            var pcenter = this._getProjection().project(this.getCenter());
            points = [map._prjToPoint(pcenter, maxZoom)];
        }
        return [points, rotations];
    }
};

LineString.include(PolyRenderer);

Polygon.include(PolyRenderer);

Geometry.include({
    _redrawWhenPitch: function _redrawWhenPitch() {
        return false;
    },

    _redrawWhenRotate: function _redrawWhenRotate() {
        return false;
    }
});

var el = {
    _redrawWhenPitch: function _redrawWhenPitch() {
        return true;
    },

    _redrawWhenRotate: function _redrawWhenRotate() {
        return this instanceof Ellipse || this instanceof Sector;
    },

    _paintAsPolygon: function _paintAsPolygon() {
        var map = this.getMap();
        var altitude = this._getPainter().getAltitude();

        return altitude > 0 || map.getPitch() || this instanceof Ellipse && map.getBearing();
    },

    _getPaintParams: function _getPaintParams() {
        var map = this.getMap();
        if (this._paintAsPolygon()) {
            return Polygon.prototype._getPaintParams.call(this, true);
        }
        var pcenter = this._getPrjCoordinates();
        var pt = map._prjToPoint(pcenter, map.getGLZoom());
        var size = this._getRenderSize();
        return [pt, size['width'], size['height']];
    },


    _paintOn: function _paintOn() {
        if (this._paintAsPolygon()) {
            return Canvas.polygon.apply(Canvas, arguments);
        } else {
            return Canvas.ellipse.apply(Canvas, arguments);
        }
    },

    _getRenderSize: function _getRenderSize() {
        var map = this.getMap(),
            z = map.getGLZoom();
        var prjExtent = this._getPrjExtent();
        var pmin = map._prjToPoint(prjExtent.getMin(), z),
            pmax = map._prjToPoint(prjExtent.getMax(), z);
        return new Size(Math.abs(pmax.x - pmin.x) / 2, Math.abs(pmax.y - pmin.y) / 2);
    }
};

Ellipse.include(el);

Circle.include(el);

Rectangle.include({
    _getPaintParams: function _getPaintParams() {
        var map = this.getMap();
        var pointZoom = map.getGLZoom();
        var shell = this._getPrjShell();
        var points = this._getPath2DPoints(shell, false, pointZoom);
        return [points];
    },


    _paintOn: Canvas.polygon
});

Sector.include(el, {
    _redrawWhenPitch: function _redrawWhenPitch() {
        return true;
    },

    _getPaintParams: function _getPaintParams() {
        if (this._paintAsPolygon()) {
            return Polygon.prototype._getPaintParams.call(this, true);
        }
        var map = this.getMap();
        var pt = map._prjToPoint(this._getPrjCoordinates(), map.getGLZoom());
        var size = this._getRenderSize();
        return [pt, size['width'], [this.getStartAngle(), this.getEndAngle()]];
    },


    _paintOn: function _paintOn() {
        if (this._paintAsPolygon()) {
            return Canvas.polygon.apply(Canvas, arguments);
        } else {
            var r = this.getMap().getBearing();
            var args = arguments;
            if (r) {
                args[3] = args[3].slice(0);
                args[3][0] += r;
                args[3][1] += r;
            }
            return Canvas.sector.apply(Canvas, args);
        }
    }

});


LineString.include({
    arrowStyles: {
        'classic': [3, 4]
    },

    _getArrowPoints: function _getArrowPoints(prePoint, point, lineWidth, arrowStyle, tolerance) {
        if (!tolerance) {
            tolerance = 0;
        }
        var width = lineWidth * arrowStyle[0],
            height = lineWidth * arrowStyle[1] + tolerance,
            hw = width / 2 + tolerance;

        var normal = point.sub(prePoint)._unit();
        var p1 = point.sub(normal.multi(height));
        normal._perp();
        var p0 = p1.add(normal.multi(hw));
        normal._multi(-1);
        var p2 = p1.add(normal.multi(hw));
        return [p0, point, p2, p0];
    },
    _getPaintParams: function _getPaintParams() {
        var prjVertexes = this._getPrjCoordinates();
        var points = this._getPath2DPoints(prjVertexes, false, this.getMap().getGLZoom());
        return [points];
    },
    _paintOn: function _paintOn(ctx, points, lineOpacity, fillOpacity, dasharray) {
        Canvas.path(ctx, points, lineOpacity, null, dasharray);
        this._paintArrow(ctx, points, lineOpacity);
    },
    _getArrowPlacement: function _getArrowPlacement() {
        return this.options['arrowPlacement'];
    },
    _getArrowStyle: function _getArrowStyle() {
        var arrowStyle = this.options['arrowStyle'];
        if (arrowStyle) {
            return Array.isArray(arrowStyle) ? arrowStyle : this.arrowStyles[arrowStyle];
        }
        return null;
    },
    _getArrows: function _getArrows(points, lineWidth, tolerance) {
        var arrowStyle = this._getArrowStyle();
        if (!arrowStyle || points.length < 2) {
            return [];
        }
        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        var segments = isSplitted ? points : [points];
        var placement = this._getArrowPlacement();
        var arrows = [];
        var map = this.getMap(),
            first = map.coordToContainerPoint(this.getFirstCoordinate()),
            last = map.coordToContainerPoint(this.getLastCoordinate());
        for (var i = segments.length - 1; i >= 0; i--) {
            if (placement === 'vertex-first' || placement === 'vertex-firstlast' && segments[i][0].closeTo(first, 0.01)) {
                arrows.push(this._getArrowPoints(segments[i][1], segments[i][0], lineWidth, arrowStyle, tolerance));
            }
            if (placement === 'vertex-last' || placement === 'vertex-firstlast' && segments[i][segments[i].length - 1].closeTo(last, 0.01)) {
                arrows.push(this._getArrowPoints(segments[i][segments[i].length - 2], segments[i][segments[i].length - 1], lineWidth, arrowStyle, tolerance));
            } else if (placement === 'point') {
                for (var ii = 0, ll = segments[i].length - 1; ii < ll; ii++) {
                    arrows.push(this._getArrowPoints(segments[i][ii], segments[i][ii + 1], lineWidth, arrowStyle, tolerance));
                }
            }
        }
        return arrows;
    },
    _paintArrow: function _paintArrow(ctx, points, lineOpacity) {
        var lineWidth = this._getInternalSymbol()['lineWidth'];
        if (!isNumber(lineWidth) || lineWidth < 3) {
            lineWidth = 3;
        }
        var arrows = this._getArrows(points, lineWidth);
        if (!arrows.length) {
            return;
        }
        if (ctx.setLineDash) {
            ctx.setLineDash([]);
        }
        for (var i = arrows.length - 1; i >= 0; i--) {
            ctx.fillStyle = ctx.strokeStyle;
            Canvas.polygon(ctx, arrows[i], lineOpacity, lineOpacity);
        }
    }
});

Polygon.include({
    _getPaintParams: function _getPaintParams(disableSimplify) {
        var maxZoom = this.getMap().getGLZoom();
        var prjVertexes = this._getPrjShell();
        var points = this._getPath2DPoints(prjVertexes, disableSimplify, maxZoom);

        var isSplitted = points.length > 0 && Array.isArray(points[0]);
        if (isSplitted) {
            points = [[points[0]], [points[1]]];
        }
        var prjHoles = this._getPrjHoles();
        var holePoints = [];
        if (prjHoles && prjHoles.length > 0) {
            for (var i = 0; i < prjHoles.length; i++) {
                var hole = this._getPath2DPoints(prjHoles[i], disableSimplify, maxZoom);
                if (Array.isArray(hole) && isSplitted) {
                    if (Array.isArray(hole[0])) {
                        points[0].push(hole[0]);
                        points[1].push(hole[1]);
                    } else {
                        points[0].push(hole);
                    }
                } else {
                    holePoints.push(hole);
                }
            }
        }
        if (!isSplitted) {
            points = [points];
            pushIn(points, holePoints);
        }
        return [points];
    },

    _paintOn: Canvas.polygon
});

exports.Util = index;
exports.DomUtil = dom;
exports.StringUtil = strings;
exports.MapboxUtil = index$1;
exports.ui = index$4;
exports.control = index$5;
exports.renderer = index$6;
exports.symbolizer = index$2;
exports.animation = Animation$1;
exports.Browser = Browser$1;
exports.Ajax = Ajax;
exports.Canvas = Canvas;
exports.Class = Class;
exports.Eventable = Eventable;
exports.JSONAble = JSONAble;
exports.Handlerable = Handlerable;
exports.Handler = Handler$1;
exports.DragHandler = DragHandler;
exports.MapTool = MapTool;
exports.DrawTool = DrawTool;
exports.AreaTool = AreaTool;
exports.DistanceTool = DistanceTool;
exports.SpatialReference = SpatialReference;
exports.INTERNAL_LAYER_PREFIX = INTERNAL_LAYER_PREFIX;
exports.GEOMETRY_COLLECTION_TYPES = GEOMETRY_COLLECTION_TYPES;
exports.GEOJSON_TYPES = GEOJSON_TYPES;
exports.projection = projections;
exports.measurer = index$3;
exports.Coordinate = Coordinate;
exports.CRS = CRS;
exports.Extent = Extent;
exports.Point = Point;
exports.PointExtent = PointExtent;
exports.Size = Size;
exports.Transformation = Transformation;
exports.Map = Map;
exports.Layer = Layer;
exports.TileLayer = TileLayer;
exports.GroupTileLayer = GroupTileLayer;
exports.WMSTileLayer = WMSTileLayer;
exports.CanvasTileLayer = CanvasTileLayer;
exports.OverlayLayer = OverlayLayer;
exports.VectorLayer = VectorLayer;
exports.CanvasLayer = CanvasLayer;
exports.ParticleLayer = ParticleLayer;
exports.TileSystem = TileSystem;
exports.TileConfig = TileConfig;
exports.ArcCurve = ArcCurve;
exports.Circle = Circle;
exports.ConnectorLine = ConnectorLine;
exports.ArcConnectorLine = ArcConnectorLine;
exports.CubicBezierCurve = CubicBezierCurve;
exports.Curve = Curve;
exports.Ellipse = Ellipse;
exports.GeoJSON = GeoJSON;
exports.Geometry = Geometry;
exports.GeometryCollection = GeometryCollection;
exports.Label = Label;
exports.LineString = LineString;
exports.Marker = Marker;
exports.MultiLineString = MultiLineString;
exports.MultiPoint = MultiPoint;
exports.MultiPolygon = MultiPolygon;
exports.Polygon = Polygon;
exports.QuadBezierCurve = QuadBezierCurve;
exports.Rectangle = Rectangle;
exports.Sector = Sector;
exports.TextBox = TextBox;
exports.TextMarker = TextMarker;

Object.defineProperty(exports, '__esModule', { value: true });

typeof console !== 'undefined' && console.log('maptalks v0.36.2');

})));
