var express = require('express');
var router = express.Router();
var querystring = require('querystring');
/* GET home page. */
router.get('/', function(req, res, next) {
    var code = req.query.code;

    post({
        options:{
            hostname: 'github.com',
            port: 443,
            path: '/login/oauth/access_token',
            method: 'POST',
        },
        data:querystring.stringify({
            'client_id' : 'a0425960782d7a4a4f12',
            'client_secret':'f28e4f0a0f202f58eb34d759bae1b539a051f5dc',
            'code':code
        }),
        callback:function(data){
            if(data.indexOf('access_token')){
                res.redirect(301, '?tips=loginError');
            }else{
                var info = {};
                var datas = data.split('&');
                for(var i in datas){
                    var d = datas[i].split('=');
                    info[d[0]]=d[1]
                }
                res.cookie('mapv_session',info.access_token,{expires: new Date(Date.now() + 1000*3600*24*30)});
                res.redirect(301, '?tips=loginSuccess');
            }
        }
    });
});

function post(obj){
    var https = require('https');

    var options = obj.options;

    var postReq = https.request(options, function(postRes) {
        console.log("statusCode: ", postRes.statusCode);
        console.log("headers: ", postRes.headers);
        var data= '';
        postRes.on('data', function(d) {
          data += d;
        });
        postRes.on('end', function(d) {
          console.log(data)
          obj.callback && obj.callback(data)
        });
    });

    if(obj.data){
        var postData = obj.data;
        postReq.write(postData);
    }
    postReq.end();

    postReq.on('error', function(e) {
        console.error('err',e);
        obj.err&&obj.err(e);
    });
}

module.exports = router;
