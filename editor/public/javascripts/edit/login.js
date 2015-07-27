define(function(){
    var login = document.createElement('div');
    login.setAttribute('class','login-box');
    document.body.appendChild(login);

    var loginBtn = document.createElement('a');
    loginBtn.textContent = '登陆Github';
    loginBtn.setAttribute('href','https://github.com/login/oauth/authorize?client_id=a0425960782d7a4a4f12');
    login.appendChild(loginBtn);

    //
    var search = location.search;
    search = search.substr(1);
    search = search.split('&');
    var query = {}
    for(var i =0,len = search.length;i<len;i++){
        var kv = search[i].split('=');
        query[kv[0]]=kv[1];
    }
    //
    var user={};

    if(query.access_token){
        $.ajax({
            url:'https://api.github.com/user?access_token='+query.access_token,
            success: function(data){
                var username = data.login;
                user.username = username;
                $('.login-box').html('<img src="'+ data.avatar_url +'"> '+username );
                getGits();
            }
        })
    }

    function getGits(){
        $.ajax({
            url:'https://api.github.com/users/'+user.username+'/gists',
            success: function(data){
                console.log(data)
            }
        })
    }
});
