/**
 * 根据2点获取角度
 * @param Array [123, 23] 点1
 * @param Array [123, 23] 点2
 * @return angle 角度,不是弧度
 */
function getAngle(start, end) {
    var diff_x = end[0] - start[0];
    var diff_y = end[1] - start[1];
    var deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    if(end[0] < start[0]){
        deg = deg + 180;
    }
    return deg;
}

export {getAngle};
