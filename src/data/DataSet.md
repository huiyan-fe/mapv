# DataSet
DasetSet是mapv中统一规范的数据对象，用来保存json数据对象。可以增删改查数据，并且可以订阅数据修改事件。

## 简单示例

    var data = [
        {
            city: '北京',
            count: 30
        },
        {
            city: '南京',
            count: 30
        }
    ];

    var dataSet = new mapv.DataSet(data);

## 地理信息数据
mapv中主要都是展示地理信息数据用的，需要在数据中加个geometry字段，geometry字段的内容统一使用[Geojson](http://geojson.org/)的规范

## 地理信息数据示例

    var data = [
        // 点数据
        {
            geometry: {
                type: 'Point',
                coordinates: [123, 23]
            },
            fillStyle: 'red',
            size: 30
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [121, 33]
            },
            fillStyle: 'rgba(255, 255, 50, 0.5)',
            size: 90
        },
        // 线数据
        {
            geometry: {
                type: 'LineString',
                coordinates: [
                    [123, 23], 
                    [124, 24]
                ]
            },
            count: 30
        },
        // 面数据
        {
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [123, 23], 
                        [123, 23], 
                        [123, 23]
                    ]
                ]
            },
            count: 30 * Math.random()
        }
    ];

    var dataSet = new mapv.DataSet(data);
