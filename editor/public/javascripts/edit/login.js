/**
 * @file this file is to deal with the user login and the login init
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(['cookie','gitOp','tools','projectControl','databank'],function(cookie,git,tools,project,databank){
    var app;
    var owner;

    // user info , try to init from the cookie
    var user = databank.get('user') ;
    var config = databank.get('config');

    user.username = cookie.getItem('mapv_username');
    user.session =  cookie.getItem('mapv_session');
    user.avatar_url = cookie.getItem('mapv_avatar_url');
    config.default = {
        layers:{}
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
    }else{
        var search = tools.getSearch();
        if(search.user && search.project){
            owner = search.user;
            checkRep();
        }
    }

    /**
     * check the respos or just make a new one
     */
    function checkRep(){
        owner = tools.getSearch().user || user.username;
        $.ajax({
            dataType:'jsonp',
            url:'https://api.github.com/repos/' + owner + '/mapv_datas',
            success: function(data){
                if(data.meta.status===404){
                    console.log('repos is not found , try create a new one');
                    if(tools.getSearch().user && tools.getSearch().user !== user.username){
                        alert('项目不存在');
                        return false;
                    }
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
        git.getFiles({
            user : owner,
            token : user.session,
            path : 'mapv_config.json',
            success : function(data){
                if(data.meta.status === 404){
                    console.log('config is not found , try create a new one');
                    var data = {
                        'message': 'add config',
                        'content': git.utf8_to_b64(JSON.stringify(config))
                    };
                    git.createFiles({
                        token: user.session,
                        user: owner,
                        path: 'mapv_config.json',
                        data: data,
                        success:function(){
                            getLayers(config)
                        }
                    })
                }else{
                    $.extend(config, JSON.parse(git.b64_to_utf8(data.data.content)));
                    console.log('config is found',config);
                    getLayers(config);
                }
            }
        });
    }

    /**
     * get hte layers
     * @param  {Object} obj the object of layers
     */
    function getLayers(obj){
        var type = tools.getSearch().project || 'default';
        obj[type] = obj[type] || {};
        project.init();
        console.log(type)
        if(obj[type]){
            var layers = obj[type];
            console.log(layers)
            for(var i in layers){
                getLayerData(i,layers[i]);
            }
        }
    }

    /**
     * get the loayer info
     * @param  {Object} data the layers info
     */
    function getLayerData(layerName,data){
        console.log(data)
        for(var i in data){
            (function(layerName,options){
                git.getData({
                    user : owner,
                    token: user.session,
                    sha : data[i].sha,
                    success : function(pointData){
                        showLayer(layerName,JSON.parse(pointData),options)
                    }
                })
            })(i,data[i].options);
            $('.E-layers').append('<div class="E-layers-block E-layers-layer icon-downloading" name="'+i+'">...</div>');
        }
    }

    /**
     * shwo layer
     * @param  {Sgring} layerName the name of the layer
     * @param  {Object} pointData the data of one layer
     * @param  {Object} options   the options of this layer
     */
    function showLayer(layerName,pointData,options){
        console.info('showLayer', layerName,pointData,options)
        //
        var name = layerName;
		var layerInfo = {
			name: name,
			mapv: mapv,
			data: pointData,
			drawType: options.type,
			drawOptions: options.option
		}
		var layer = new Mapv.Layer(layerInfo);
        $('.E-layers-layer[name="'+layerName+'"]').html(options.type.substring(0,2).toUpperCase()).removeClass('icon-downloading');
		app.addLayer(layer);
    }

    // just get the app
    function regApp(regApp){
        app = regApp;
    }

    return {
        getUser : function(){
            return user
        },
        config : function(){
            return config;
        },
        setConfig:function(con){
            config = con;
        },
        reg : regApp
    };

});
