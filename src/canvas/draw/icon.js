/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

export default {
    draw: function (context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        // set from options
        // for (var key in options) {
        //     context[key] = options[key];
        // }
        // console.log(data)
        for (var i = 0, len = data.length; i < len; i++) {

            if (data[i].geometry) {
                var deg = data[i].deg || options.deg;
                var icon = data[i].icon || options.icon;
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0];
                var y = coordinates[1];
                if (deg) {
                    context.save();
                    context.translate(x, y);
                    context.rotate(deg * Math.PI / 180);
                    context.translate(-x, -y);
                }
                var width = options._width || options.width|| icon.width;
                var height = options._height || options.height || icon.height;
                x = x - width / 2 + offset.x;
                y = y - height / 2 + offset.y;
                if (options.sx && options.sy && options.swidth && options.sheight && options.width && options.height) {
                    context.drawImage(icon, options.sx, options.sy, options.swidth, options.sheight, x, y, width, height);
                } else if (options.width && options.height) {
                    context.drawImage(icon, x, y, width, height);
                } else {
                    context.drawImage(icon, x, y);
                }

                if (deg) {
                    context.restore();
                }
            }

        };
    }
}
