var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var login = false;
    if(req.cookies.mapv_session){
        login = true;
    }
    console.log(login)
    res.render('index', { title: '地图可视化',login:login });
});

module.exports = router;
