/**
 * @file 示例代码
 */
/* globals Drawer mercatorProjection BMap util Mapv*/
// 创建Map实例
var map = new BMap.Map('map', {
	enableMapClick: false
		//vectorMapLevel: 3
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
	upCallback(function(data){
		app.shwoEdit()
		console.log('&&&',data);
	})
});
