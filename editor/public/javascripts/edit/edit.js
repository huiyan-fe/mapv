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

var app;

/*****/
requirejs.config({
	baseUrl: '/javascripts/edit',
});

requirejs(['uploadDate', 'editActions','sort'], function (upCallback, edit,sort) {
	app = new edit();
	// init sort action
	sort.init(app);
	//
	var pointData,options;
	upCallback(function(data){
		pointData = data;
		app.shwoEdit()
	})
	app.done(function(options){
		console.log(pointData,options.option);
		var name = (+new Date()).toString(36)+ (Math.random()*10e7|0).toString(36);
		var layer = new Mapv.Layer({
			name: name,
			mapv: mapv,
			data: pointData,
			drawType: options.type,
			drawOptions: options.option
		});
		$('.E-layers').append('<div class="E-layers-block E-layers-layer" name="'+name+'">'+options.type.substring(0,2).toUpperCase()+'</div>');
		app.addLayer(layer);
	})
});

// edity map style
requirejs(['mapstyle'],function(mapstyle){
	mapstyle.setMap(map)
});

// login
requirejs(['login'],function(login){

})
