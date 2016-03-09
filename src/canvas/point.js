
export default function() {

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
