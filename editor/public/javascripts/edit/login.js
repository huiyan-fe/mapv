/**
 * @file this file is to deal with the user login and the login init
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(['cookie','gitOp'],function(cookie,git){
    var app;
    // user info , try to init from the cookie
    var user = {
        username : cookie.getItem('mapv_username'),
        session :  cookie.getItem('mapv_session'),
        avatar_url : cookie.getItem('mapv_avatar_url')
    };
    var config = {
        'default':{
            layers:{}
        }
    }

    // if the seesion is valuable try to init
    if(user.session){
        // if the username and user avatar is cached show it
        // otherwist got this information from the api
        // and also if the session is not valuable , just show the login btn
        if(user.avatar_url && user.username){
            $('.login-box').prepend('<div style="float:left; margin-right:10px;"><img src="'+ user.avatar_url +'"> '+user.username +'</div>');
            checkRep();
        }else{
            $.ajax({
                url:'https://api.github.com/user?access_token=' + user.session,
                success: function(data){
                    if(data.login){
                        cookie.setItem('mapv_username',data.login,Infinity);
                        cookie.setItem('mapv_avatar_url',data.avatar_url,Infinity);
                    }else{
                        cookie.removeItem('mapv_session');
                        cookie.removeItem('mapv_username');
                        cookie.removeItem('mapv_avatar_url');
                        $('.login-box').html('<a href="https://github.com/login/oauth/authorize?client_id=a0425960782d7a4a4f12&scope=public_repo">登陆Github</a>')
                    }
                    var username = data.login;
                    user.username = username;
                    $('.login-box').prepend('<div style="float:left; margin-right:10px;"><img src="'+ data.avatar_url +'"> '+user.username +'</div>');
                    checkRep();
                }
            })
        }
    }

    /**
     * check the respos or just make a new one
     */
    function checkRep(){
        $.ajax({
            dataType:'jsonp',
            url:'https://api.github.com/repos/'+user.username+'/mapv_datas',
            success: function(data){
                if(data.meta.status===404){
                    console.log('repos is not found , try create a new one');
                    git.createRepos({
                        token:user.session,
                        data:{
                          "name": "mapv_datas",
                          "description": "the mapv applicaitons data please do not delete",
                          "homepage": "https://github.com",
                          "private": false,
                          "has_issues": true,
                          "has_wiki": true,
                          "has_downloads": true
                      },
                      success:function(){
                          getConfig();
                      }
                    })
                }else{
                    console.log('repos is found');
                    getConfig();
                }
            }
        })
    }

    /**
     * check the config or make a new one
     */
    function getConfig(){
        //
        $.ajax({
            dataType:'jsonp',
            url:'https://api.github.com/repos/'+user.username+'/mapv_datas/contents/mapv_config.json?access_token=' + user.session,
            success: function(data){
                if(data.meta.status === 404){
                    console.log('config is not found , try create a new one');
                    var data = {
                      "message": "add config",
                      "content": git.utf8_to_b64(JSON.stringify(config))
                    };
                    git.createFiles({
                        token: user.session,
                        user: user.username,
                        path: 'mapv_config.json',
                        data: data,
                        success:function(){
                            getLayers(config)
                        }
                    })
                }else{
                    console.log('config is found,read config' );
                    config = JSON.parse(git.b64_to_utf8(data.data.content));
                    getLayers(config);
                }
            }
        })
    }

    /**
     * get hte layers
     * @param  {Object} obj the object of layers
     */
    function getLayers(obj){
        console.log('getLayers',obj)
        var type = 'default';
        if(obj[type]){
            var layers = obj[type];
            console.log('get layers: ', layers);
            for(var i in layers){
                getLayerData(layers[i]);
            }
        }
    }

    /**
     * get the loayer info
     * @param  {Object} data the layers info
     */
    function getLayerData(data){
        for(var i in data){
            (function(options){
                git.getData({
                    user : user.username,
                    token: user.session,
                    sha : data[i].sha,
                    success : function(pointData){
                        showLayer(JSON.parse(pointData),options)
                    }
                })
            })(data[i].options);
        }
    }

    /**
     * shwo layer
     * @param  {Object} pointData the data of one layer
     * @param  {Object} options   the options of this layer
     */
    function showLayer(pointData,options){
        console.info(data,options)
        //
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
    }

    // just get the app
    function regApp(regApp){
        app = regApp;
    }

    return {
        user : user,
        config : function(){
            return config;
        },
        reg : regApp
    };

});
