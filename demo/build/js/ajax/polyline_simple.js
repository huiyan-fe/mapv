/**
 * @file 示例代码
 */

bmap.centerAndZoom(new BMap.Point(116.404, 40.055), 11); // 初始化地图,设置中心点坐标和地图级别

// 第一步创建mapv示例
var mapv = new Mapv({
    drawTypeControl: true,
    map: bmap  // 百度地图的map实例
});

var layer = new Mapv.Layer({
    zIndex: 1,
    mapv: mapv,
    dataType: 'polyline',
    coordType: 'bd09mc',
    data: driveData,
    drawType: 'simple',
    drawOptions: {
        lineWidth: 5,
        strokeStyle: "rgba(255, 50, 50, 0.3)"
    }
});