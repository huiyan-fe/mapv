/**
 * @file 示例代码
 */
/* globals Drawer mercatorProjection BMap util Mapv*/
// 创建Map实例
var map = new BMap.Map('map', {
	enableMapClick: false
});
var mercatorProjection = map.getMapType().getProjection();
map.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 启用滚轮放大缩小
var mapv;
var data = null;
var options = {
	map: map
};
mapv = new Mapv(options);

/*****/
requirejs.config({
	baseUrl: '../src/edit',
});

requirejs(['uploadDate', 'editActions'], function (upCallback, edit) {
	var app = new edit();
	var pointData,options;
	upCallback(function(data){
		pointData = data;
		app.shwoEdit()
	})
	app.done(function(options){
		console.log(pointData,options.option);
		var layer = new Mapv.Layer({
			mapv: mapv,
			data: pointData,
			drawType: options.type,
			drawOptions: options.option
		});

		$('.E-layers').append('<div class="E-layers-block">'+options.type.substring(0,2).toUpperCase()+'</div>');

		app.closeBox();
	})
});

// edity map style
requirejs(['mapstyle'],function(mapstyle){
	mapstyle.setMap(map)
})
