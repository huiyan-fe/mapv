/**
 * Data
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

// function 

class data {
    constructor() {
        this.datas = {
            'point': function() {
                var _data = [];
                var randomCount = 300;
                while (randomCount--) {
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
                    _data.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                        },
                        count: 30 * Math.random()
                    });
                }
                return _data;
            },
            'line': function() {
                var randomCount = 800;
                var _data = [];
                while (randomCount--) {
                    var cityCenter1 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
                    var cityCenter2 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
                    _data.push({
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [cityCenter1.lng - 1 + Math.random() * 1, cityCenter1.lat - 1 + Math.random() * 1],
                                [cityCenter2.lng - 1 + Math.random() * 1, cityCenter2.lat - 1 + Math.random() * 1]
                            ]
                        },
                        count: 30 * Math.random()
                    });
                }
                return _data;
            }
        }
    }

    getList() {
        var map = [];
        for (var i in this.datas) {
            map.push(i);
        }
        return map;
    }

    get(name) {
        var _data = [];
        var type = null;
        if (name == 'point' || name == 'line') {
            _data = this.datas[name]();
            type = name;
        } else {
            _data = this.datas[name].data;
            type = this.datas[name].type;
        }

        return {
            data: _data,
            type: type
        };
    };

    set(name, data) {
        this.datas[name] = data
    }
}

export default new data();