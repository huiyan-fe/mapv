/**
 * @author kyle / http://nikai.us/
 */

export default {
    draw: function (context, data, options) {

        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        context.restore();

    }
}
