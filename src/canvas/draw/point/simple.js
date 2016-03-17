export default {
    draw: function(context, data) {
        
        data.forEach(function(item) {

            context.beginPath();
            context.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            context.fill();

        });


    }
}
