/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

import pathSimple from "../path/simple";
import drawSimple from "./simple";
import clear from "../clear";
import DataSet from "../../data/DataSet";

export default {
    draw: function (context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();

        context.fillStyle = options.fillStyle || 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        options.multiPolygonDraw = function() {
            context.save();
            context.clip();
            clear(context);
            context.restore();
        }

        for (var i = 0, len = data.length; i < len; i++) {

            context.beginPath();

            pathSimple.drawDataSet(context, [data[i]], options);
            context.save();
            context.clip();
            clear(context);
            context.restore();
        };

        context.restore();

    }
}
