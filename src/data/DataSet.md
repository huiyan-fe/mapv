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

## dataSet的方法
### dataSet.get
通过此方法可以获取当前数据集的数据
    
    var data = dataSet.get();
    
同时可通过filter参数方法获取过滤后的数据

    var data = dataSet.get({
        filter: function(item){
            if (item.count > 10 && item.count < 50) {
                return true;
            } else {
                return false;
            }
        }
    });

### dataSet.set
通过此方法可以修改数据集的内容

    dataSet.set([
        {
            geometry: {
                type: 'Point',
                coordinates: [123, 23]
            },
            fillStyle: 'red',
            size: 30
        }
    ]);
