define(['gitOp'],function(git){
    var data = {};
    var con = {
        state: 'done',
        objs: null
    };
    return {
        set:function(name,obj){
            data[name] = obj;
        },
        get:function(name){
            data[name] = data[name] || {};
            return data[name] ;
        },
        uploadConfig:function(config){
            var self = this ;
            con.objs = config || con.objs || null;
            if(!con.objs){
                $('.user-block-layers-statue').remove();
                return false;
            }
            if(con.state !== 'done' ){
                return false;
            }
            con.state = 'inprogress';
            conf = JSON.stringify(con.objs);
            con.objs = null;

            $('.user-block-layers').append('<div class="user-block-layers-statue icon-uploading" style="position:absolute; width:20px; height:20px; right:0; bottom:0;"></div>');
			var data = {
				'message': 'update config',
				'content': git.utf8_to_b64(conf)
			};
			git.updateFiles({
				token: self.get('user').session,
				user: self.get('user').username,
				path: 'mapv_config.json',
				data: data,
				success:function(){
					console.log('config updated');
                    con.state = 'done';
                    self.uploadConfig();
				}
			})
        }
    }
})
