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
                var icon = data[i].icon || options.icon;
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0] - icon.width / 2 + offset.x;
                var y = coordinates[1] - icon.height / 2 + offset.y;
                if (data[i].deg) {
                    context.save();
                    context.translate(x, y);
                    context.rotate(data[i].deg * Math.PI / 180);
                    context.translate(-x, -y);
                }
                context.drawImage(icon, x, y);
                if (data[i].deg) {
                    context.restore();
                }
            }

        };
    }
}
