function hex_corner(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

function draw(context, x, y, size) {

    for (var j = 0; j < 6; j++) {

        var result = hex_corner({
            x: x,
            y: y
        }, size, j);

        context.lineTo(result[0], result[1]);
    }

}

export {draw};
