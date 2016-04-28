/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

import pathSimple from "../path/simple";

export default {
    draw: function (context, dataSet, options) {
        var data = dataSet.get();
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // set from options
        // for (var key in options) {
        //     context[key] = options[key];
        // }
        // console.log(options)
        for (var i = 0, len = data.length; i < len; i++) {
            context.drawImage(data[i].icon, data[i].geometry.coordinates[0], data[i].geometry.coordinates[1])
        };
    }
}
