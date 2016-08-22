# DataSet
DasetSet是mapv中统一规范的数据对象，用来保存json数据对象。可以增删改查数据，并且可以订阅数据修改事件。

## 示例

    var data = [
        {
            geometry: {
                type: 'Point',
                coordinates: [ctx.canvas.width * Math.random(), ctx.canvas.height * Math.random()]
            },
            fillStyle: 'red',
            size: 30
        },
        {
            geometry: {
                type: 'Point',
                coordinates: [ctx.canvas.width * Math.random(), ctx.canvas.height * Math.random()]
            },
            fillStyle: 'rgba(255, 255, 50, 0.5)',
            size: 90
        }
    ];

    var dataSet = new mapv.DataSet(data);

