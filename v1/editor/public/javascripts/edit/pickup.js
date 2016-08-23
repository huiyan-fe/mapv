/**
 * @file this file is to control the pickup actions
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

define(['editActions'],function(edit){

    var points = {};
    var markers = [];
    function pickupEnt(e){
        var map = mapv.getMap();
        if(e.overlay){
            map.removeOverlay(e.overlay);
            var point = e.overlay.point;
            var mac = map.getMapType().getProjection().lngLatToPoint(point);
            var name = mac.x + '_' + mac.y;
            points[name].count --;
            if(points[name].count<=0){
                delete points[name];
            }
        }else{
            var lng = e.point.lng;
            var lat = e.point.lat;
            var point = new BMap.Point(lng, lat);
            var mac = map.getMapType().getProjection().lngLatToPoint(point);
            var name = mac.x + '_' + mac.y;
            points[name] = points[name] || {}
            points[name].x = mac.x;
            points[name].y = mac.y;
            points[name].count = points[name].count || 0;
            points[name].count ++;
            var marker = new BMap.Marker(point);
            markers.push(marker);
            map.addOverlay(marker);
        }
    };

    function pickup(obj){
        this.callback = obj.callback;
    }

    pickup.prototype.init = function(){
        var self = this;
        $('.login-box,.E-layers').hide();
        mapv.getMap().addEventListener('click', pickupEnt);
        // add cancel and add btn
        var btn = self.btn = document.createElement('div');
        var btnOk = document.createElement('div');
        btnOk.setAttribute('class','E-pickerBtn-ok E-button E-button-active');
        btnOk.textContent = '确定';
        var btnCancel = document.createElement('div');
        btnCancel.setAttribute('class','E-pickerBtn-cancel E-button');
        btnCancel.textContent = '取消';
        btn.appendChild(btnOk);
        btn.appendChild(btnCancel);
        document.body.appendChild(self.btn);

        btnOk.addEventListener('click', function(){
            var data = self.getData();
            self.callback && self.callback(data);
            self.close();
        });
        btnCancel.addEventListener('click', function(){
            self.close();
        })
    };

    pickup.prototype.close = function(){
        var self = this;
        $('.login-box,.E-layers').show();
        document.body.removeChild(self.btn);
        var map = mapv.getMap();
        for(var i in markers){
            map.removeOverlay(markers[i]);
        }
        markers=[];
    }

    pickup.prototype.getData = function(){
        var ret = [];
        for(var i in points){
            ret.push(points[i]);
        }
        return ret;
    }

    return pickup;

})
