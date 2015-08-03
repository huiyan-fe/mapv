/**
 * @file the main function of the edit
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

// new map and some init
var map = new BMap.Map('map', {
	enableMapClick: false
});

var mercatorProjection = map.getMapType().getProjection();
map.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12);
map.enableScrollWheelZoom();
var mapv;
var data = null;
var options = {
	map: map
};
mapv = new Mapv(options);
//

var app;

// load config
requirejs.config({
	baseUrl: '/javascripts/edit',
});

// main
requirejs(['uploadDate', 'editActions', 'sort', 'login', 'gitOp','tools'], function (upCallback, edit, sort, login, git,tools) {
	// new app
	app = edit;
	// init sort action and login
	sort.init(app);
	login.reg(app);
	// listen to the uplodaData's callback;
	var pointData,options;
	upCallback(function(data){
		pointData = data;
		app.shwoEdit()
	});
	// console.log(tools.getSearch().user)
	// the edit done event
	app.done(function(options){
		// create a new layer
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
		if(!login.getUser().session || (tools.getSearch().user!==login.getUser().username)){
			return false;
		}

		var project = tools.getSearch().project || 'default';

		// upload Date
		console.info('start update layer for ',name);
		$('.E-layers-layer[name="'+name+'"]').addClass('icon-uploading');
		var pointStr = JSON.stringify(pointData);
		var data = {
			'message': 'add layer data for layer ' + name,
			'content': git.utf8_to_b64(pointStr)
		};
		var dataPath = 'data/'+name;
		// upload files
		git.createFiles({
			token: login.getUser().session,
			user: login.getUser().username,
			path: dataPath,
			data: data,
			success:function(data){
				var config = login.config();
				options.layerName = name;
				config[project] = config[project] || {};
				config[project].layers[name] = {};
				config[project].layers[name].options = options;
				config[project].layers[name].data = 'data/'+name;
				config[project].layers[name].sha = data.content.sha;
				console.info('update config',config);
				updateConfig(JSON.stringify(config));
			}
		});

		// upload config
		function updateConfig(conf){
			console.warn(conf)
			var data = {
				'message': 'update config',
				'content': git.utf8_to_b64(conf)
			};
			git.updateFiles({
				token: login.getUser().session,
				user: login.getUser().username,
				path: 'mapv_config.json',
				data: data,
				success:function(){
					console.log('config updated');
					var config = login.config();
					config[project] = config[project] || {};
					config[project].layers[name] = JSON.parse(conf)[project].layers[name];
					login.setConfig(config);
					$('.E-layers-layer[name="'+name+'"]').removeClass('icon-uploading');
				}
			})
		}
	});

});

// edity map style
requirejs(['mapstyle'],function(mapstyle){
	mapstyle.setMap(map)
});

// // project manage
requirejs(['projectControl'],function(){
});
