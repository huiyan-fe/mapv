/**
 * @author Mofei<http://www.zhuwenlong.com>
 */

class MapHelper {
    constructor(id, type, opt) {
        if (!id || !type) {
            console.warn('id 和 type 为必填项');
            return false;
        }


        if (type == 'baidu') {
            if (!BMap) {
                console.warn('请先引入百度地图JS API');
                return false;
            }
        } else {
            console.warn('暂不支持你的地图类型');
        }
        this.type = type;
        var center = (opt && opt.center) ? opt.center : [106.962497, 38.208726];
        var zoom = (opt && opt.zoom) ? opt.zoom : 5;
        var map = this.map = new BMap.Map(id, {
            enableMapClick: false
        });
        map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);
        map.enableScrollWheelZoom(true);

        map.setMapStyle({
            style: 'light'
        });
    }

    addLayer(datas, options) {
        if (this.type == 'baidu') {
            return new mapv.baiduMapLayer(this.map, dataSet, options);
        }
    }

    getMap() {
        return this.map;
    }
}

// function MapHelper(dom, type, opt) {
//     var map = new BMap.Map(dom, {
//         enableMapClick: false
//     });
//     map.centerAndZoom(new BMap.Point(106.962497, 38.208726), 5);
//     map.enableScrollWheelZoom(true);

//     map.setMapStyle({
//         style: 'light'
//     });
// }

export default MapHelper;