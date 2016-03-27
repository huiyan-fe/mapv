/**
 * @author kyle / http://nikai.us/
 */

import drawPolygonSimple from "./draw/polygon/simple";

export default {
    draw: function (context, data, options) {

        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        drawPolygonSimple.draw(context, data, options);

        context.restore();

    }
}
