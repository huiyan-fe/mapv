/*
* @file 示例代码
*/

bmap.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5); // 初始化地图,设置中心点坐标和地图级别

// 第一步创建mapv示例
var mapv = new Mapv({
    drawTypeControl: true,
    map: bmap  // 百度地图的map实例
});

var data = []; // 取城市的点来做示例展示的点数据

data = data.concat(getCityCenter(cityData.municipalities));
data = data.concat(getCityCenter(cityData.provinces));
data = data.concat(getCityCenter(cityData.other));

for (var i = 0; i < cityData.provinces.length; i++) {
    var citys = cityData.provinces[i].cities;
    data = data.concat(getCityCenter(citys));
}

function getCityCenter(citys) {
    var data = [];
    for (var i = 0; i < citys.length; i++) {
        var city = citys[i];
        var center = city.g.split('|')[0];
        center = center.split(',');
        data.push({
            lng: center[0],
            lat: center[1],
            count: Math.random() * 10
        });
    }
    return data;
};

var layer = new Mapv.Layer({
    mapv: mapv, // 对应的mapv实例
    zIndex: 1, // 图层层级
    dataType: 'point', // 数据类型，点类型
    data: data, // 数据
    drawType: 'simple', // 展示形式
    drawOptions: { // 绘制参数
        fillStyle: 'rgba(200, 200, 50, 1)', // 填充颜色
        //strokeStyle: 'rgba(0, 0, 255, 1)', // 描边颜色
        //lineWidth: 4, // 描边宽度
        shadowColor: 'rgba(255, 255, 255, 1)', // 投影颜色
        shadowBlur: 35,  // 投影模糊级数
        globalCompositeOperation: 'lighter', // 颜色叠加方式
        size: 4 // 半径
    }
});