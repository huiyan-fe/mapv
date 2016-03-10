(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.mapv = global.mapv || {})));
}(this, function (exports) { 'use strict';

    var version = "1.0.0";

    var _3d = '3d';

    function point() {

        function Point() {
        }

        Point.prototype.draw = function(context, data, options) {

            
            context.save();

            for (var key in options) {
                context[key] = options[key];
            }

            data.forEach(function(item) {
                context.fillRect(item.x, item.y, item.size, item.size);
            });

            context.restore();

            return this;

        };

        var point = new Point();

        return point;

    }

    exports.version = version;
    exports.X = _3d;
    exports.canvasPoint = point;

}));