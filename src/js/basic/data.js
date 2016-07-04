/**
 * Data
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

function data(type) {

    var data = [];
    var options = {};

    if (type == 'point') {
        var randomCount = 300;
        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

        // 构造数据
        while (randomCount--) {
            var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
                },
                count: 30 * Math.random()
            });
        }

        options = {
            fillStyle: 'rgba(151, 192, 247, 0.6)',
            shadowColor: 'rgba(151, 192, 247, 0.5)',
            shadowBlur: 10,
            size: 5,
            draw: 'simple'
        }
    }

    if (type == 'line') {
        var randomCount = 500;

        var data = [];

        var citys = ["北京", "天津", "上海", "重庆", "石家庄", "太原", "呼和浩特", "哈尔滨", "长春", "沈阳", "济南", "南京", "合肥", "杭州", "南昌", "福州", "郑州", "武汉", "长沙", "广州", "南宁", "西安", "银川", "兰州", "西宁", "乌鲁木齐", "成都", "贵阳", "昆明", "拉萨", "海口"];

        // 构造数据
        while (randomCount--) {
            var cityCenter1 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            var cityCenter2 = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length)]);
            data.push({
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

        options = {
            strokeStyle: 'rgba(255, 250, 50, 0.3)',
            shadowColor: 'rgba(255, 250, 50, 1)',
            shadowBlur: 20,
            lineWidth: 0.7,
            draw: 'simple'
        }
    }

    return {
        data: data,
        options: options
    };
}

export default data;