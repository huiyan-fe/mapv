/**
 * @author kyle / http://nikai.us/
 */

import drawPointSimple from "./draw/point/simple";
import drawPointGrid from "./draw/point/grid";
import drawPointHeatmap from "./draw/point/heatmap";

export default {
    draw: function (context, data, options) {

        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        if (options.draw == 'heatmap') {
            drawPointHeatmap.draw(context, data, options);
        } else if (options.draw == 'grid') {
            drawPointGrid.draw(context, data, options);
        } else {
            drawPointSimple.draw(context, data, options);
        }

        context.restore();

    }
}
