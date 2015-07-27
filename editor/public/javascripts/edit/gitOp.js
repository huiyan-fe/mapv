define(function(){
    var git={
        createRepos:function(obj){
            $.ajax({
                'url':'https://api.github.com/user/repos?access_token='+obj.token,
                'data':JSON.stringify(obj.data),
                'method':'POST',
                'success':function(data){
                    obj.success && obj.success(data);
                }
            })
        },
        createFiles:function(obj){
            $.ajax({
                'url':'https://api.github.com/repos/'+obj.user+'/mapv_datas/contents/'+obj.path+'?access_token='+obj.token,
                'data':JSON.stringify(obj.data),
                'method':'PUT',
                'success':function(data){
                    console.log('createFiles',data);
                    obj.success && obj.success(data);
                }
            });
        },
        updateFiles:function(obj){
            // get sha
            $.ajax({
                dataType:'jsonp',
                url:'https://api.github.com/repos/'+obj.user+'/mapv_datas/contents/'+obj.path,
                success: function(data){
                    console.log('get sha',data);
                    obj.data.sha = data.data.sha;
                    update();
                }
            });
            function update(){
                $.ajax({
                    'url':'https://api.github.com/repos/'+obj.user+'/mapv_datas/contents/'+obj.path+'?access_token='+obj.token,
                    'data':JSON.stringify(obj.data),
                    'method':'PUT',
                    'success':function(data){
                        obj.success && obj.success(data);
                    }
                });
            }
        },
        getFiles:function(obj){
            $.ajax({
                dataType:'jsonp',
                url:'https://api.github.com/repos/'+obj.user+'/mapv_datas/contents/'+obj.path,
                success:function(data){
                    obj.success && obj.success(data);
                }
            });
        },
        getData:function(obj){
            var self = this;
            $.ajax({
                dataType:'jsonp',
                url:'https://api.github.com/repos/'+obj.user+'/mapv_datas/git/blobs/'+obj.sha+'?access_token='+obj.token,
                success:function(data){
                    obj.success && obj.success(self.b64_to_utf8(data.data.content));
                }
            });
        },
        upload:function(){},
        download:function(){},
        delete:function(){},
        utf8_to_b64:function(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        },
        b64_to_utf8:function(str) {
            return decodeURIComponent(escape(window.atob( str )));
        }
    }
    return git;
})
