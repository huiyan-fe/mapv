var express = require('express');
var router = express.Router();
var querystring = require('querystring');
/* GET home page. */
router.get('/', function(req, res, next) {
    var code = req.query.code;
    // console.log(req);
    // res.json(req);

    var https = require('https');

    var options = {
      hostname: 'github.com',
      port: 443,
      path: '/login/oauth/access_token',
      method: 'POST',
    //   headers:{
    //       'Accept':'application/json'
    //   }
    };

    var postReq = https.request(options, function(postRes) {
      console.log("statusCode: ", postRes.statusCode);
      console.log("headers: ", postRes.headers);
      var data= '';
      postRes.on('data', function(d) {
          console.log(d)
          data += d;
      });
      postRes.on('end', function(d) {
          res.redirect(301, 'http://127.0.0.1:8081/examples/edit.html?'+data);
        //   var data  = JSON.parse(data.toString())
          console.log('data',data)
      });
    });
    var postData = querystring.stringify({
        'client_id' : 'a0425960782d7a4a4f12',
        'client_secret':'f28e4f0a0f202f58eb34d759bae1b539a051f5dc',
        'code':code
    });
    postReq.write(postData);
    postReq.end();

    postReq.on('error', function(e) {
      console.error('err',e);
    });

    // res.write('处理中请稍后');
});

module.exports = router;
