/**
 * @file this is dozens of method which get the info from the git api
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function(){
    var git={
        /**
         * create response
         * @param   {Object}    obj
         * @param   {Sting}     obj.token       the user's token
         * @param   {Object}    obj.data        the data info
         *                                  	see https://developer.github.com/v3/repos/#create
         * @param   {function}  obj.callback    the callback
         */
        createRepos:function(obj){
            $.ajax({
                'url':'https://api.github.com/user/repos?access_token=' + obj.token,
                'data':JSON.stringify(obj.data),
                'method':'POST',
                'success':function(data){
                    obj.success && obj.success(data);
                }
            })
        },
        /**
         * create files
         * @param   {Object}    obj
         * @param   {Sting}     obj.user        the user's username
         * @param   {Sting}     obj.path        the files's path
         * @param   {Sting}     obj.token       the user's token
         * @param   {Object}    obj.data        the data info
         *                                  	see https://developer.github.com/v3/repos/contents/#create-a-file
         * @param   {function}  obj.callback    the callback
         */
        createFiles:function(obj){
            $.ajax({
                'url':'https://api.github.com/repos/' + obj.user + '/mapv_datas/contents/' + obj.path + '?access_token=' + obj.token,
                'data':JSON.stringify(obj.data),
                'method':'PUT',
                'success':function(data){
                    console.log('createFiles',data);
                    obj.success && obj.success(data);
                }
            });
        },
        /**
         * updateFiles files
         * @param   {Object}    obj
         * @param   {Sting}     obj.user        the user's username
         * @param   {Sting}     obj.path        the files's path
         * @param   {Sting}     obj.token       the user's token
         * @param   {Object}    obj.data        the data info
         *                                  	see https://developer.github.com/v3/repos/contents/#update-a-file
         * @param   {function}  obj.callback    the callback
         */
        updateFiles:function(obj){
            // get sha the use the sha to update the file
            $.ajax({
                dataType:'jsonp',
                url:'https://api.github.com/repos/'+obj.user+'/mapv_datas/contents/'+obj.path+'?access_token='+obj.token,
                success: function(data){
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
        /**
         * getFiles files
         * @param   {Object}    obj
         * @param   {Sting}     obj.user        the user's username
         * @param   {Sting}     obj.path        the files's path
         * @param   {function}  obj.callback    the callback
         */
        getFiles:function(obj){
            var url = 'https://api.github.com/repos/' + obj.user + '/mapv_datas/contents/' + obj.path;
            url += obj.token?('?access_token='+obj.token):'';
            $.ajax({
                dataType:'jsonp',
                url:url,
                success:function(data){
                    obj.success && obj.success(data);
                }
            });
        },
        /**
         * get files data
         * @param   {Object}    obj
         * @param   {Sting}     obj.user        the user's username
         * @param   {Sting}     obj.sha        the files's sha
         * @param   {function}  obj.callback    the callback
         */
        getData:function(obj){
            var self = this;
            var url = 'https://api.github.com/repos/' + obj.user + '/mapv_datas/git/blobs/' + obj.sha;
            url += obj.token?('?access_token='+obj.token):'';
            $.ajax({
                dataType:'jsonp',
                url:url,
                success:function(data){
                    obj.success && obj.success(self.b64_to_utf8(data.data.content));
                }
            });
        },
        upload:function(){},
        download:function(){},
        delete:function(){},
        /**
         * encode to base 64
         * @param  {String} str
         * @return {String}
         */
        utf8_to_b64:function(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        },
        /**
         * decode from base 64
         * @param  {String} str
         * @return {String}
         */
        b64_to_utf8:function(str) {
            return decodeURIComponent(escape(window.atob( str )));
        }
    }
    return git;
})
