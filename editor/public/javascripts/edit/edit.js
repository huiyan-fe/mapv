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

requirejs(['uploadDate', 'editActions', 'sort', 'login', 'gitOp'], function (upCallback, edit, sort, login, git) {
	app = new edit();
	// init sort action
	sort.init(app);
	login.reg(app);
	//
	var pointData,options;
	upCallback(function(data){
		pointData = data;
		app.shwoEdit()
	})
	app.done(function(options){
		var name = (+new Date()).toString(36)+ (Math.random()*10e7|0).toString(36);
		var layerInfo = {
			name: name,
			mapv: mapv,
			data: pointData,
			drawType: options.type,
			drawOptions: options.option
		}
		var layer = new Mapv.Layer(layerInfo);
		$('.E-layers').append('<div class="E-layers-block E-layers-layer" name="'+name+'">'+options.type.substring(0,2).toUpperCase()+'</div>');
		app.addLayer(layer);

		// update and save info
		var project = 'default';
		var config = login.config();
		console.info('config is :',config)
		config[project].layers[name] = {};
		config[project].layers[name].options = options;
		config[project].layers[name].data = 'data/'+name;
		// upload Date
		console.log('start update layer for ',name);
		var pointStr = JSON.stringify(pointData);
		var data = {
		  "message": "add layer data for layer " + name,
		  "content": git.utf8_to_b64(pointStr)
		};

		// var config = JSON.stringify(config);
		git.createFiles({
			token: login.user.session,
			user: login.user.username,
			path: config[project].layers[name].data,
			data: data,
			success:function(data){
				console.log('new layer' , name , ' done',data.content.sha);
				console.log('update config');
				config[project].layers[name].sha = data.content.sha;
				// config = JSON.stringify(config);
				updateConfig(JSON.stringify(config));
			}
		});

		function updateConfig(conf){
			console.warn(conf)
			var data = {
	          "message": "update config",
	          "content": git.utf8_to_b64(conf)
	        };
	        git.updateFiles({
	            token: login.user.session,
	            user: login.user.username,
	            path: 'mapv_config.json',
	            data: data,
	            success:function(){
	                console.log('config updated');
	            }
	        })
		}

		// update config
		// console.log('layer data',JSON.stringify(pointData));

	})
});

// edity map style
requirejs(['mapstyle'],function(mapstyle){
	mapstyle.setMap(map)
});

// login
requirejs(['login'],function(login){

})
