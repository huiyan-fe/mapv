/**
 * @author kyle / http://nikai.us/
 */

import drawPointSimple from "./draw/point/simple";
import drawPointBubble from "./draw/point/bubble";
import drawPointGrid from "./draw/point/grid";
import drawPointHeatmap from "./draw/point/heatmap";

export default {
    draw: function (context, data, options) {

        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        switch (options.draw) {
            case 'heatmap':
                drawPointHeatmap.draw(context, data, options);
                break;
            case 'grid':
                drawPointGrid.draw(context, data, options);
                break;
            case 'bubble':
                drawPointBubble.draw(context, data, options);
                break;
            case 'simple':
                drawPointSimple.draw(context, data, options);
                break;
                
        }

        context.restore();

    }
}
