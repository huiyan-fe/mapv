# mapv.baiduMapLayer
百度地图可视化叠加图层

    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.6)',
        shadowColor: 'rgba(55, 50, 250, 0.5)',
        shadowBlur: 10,
        size: 5,
        draw: 'simple'
    }

    var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

## options

### options通用的属性:
```js
{
    size: 5 // 大小值
    unit: 'px' // 可选px或者m
    fillStyle: 'rgba(200, 200, 50, 1)', // 填充颜色
    strokeStyle: 'rgba(0, 0, 255, 1)', // 描边颜色
    lineWidth: 4, // 描边宽度
    globalAlpha: 1, // 透明度
    globalCompositeOperation: 'lighter', // 颜色叠加方式
    shadowColor: 'rgba(255, 255, 255, 1)', // 投影颜色
    shadowBlur: 35,  // 投影模糊级数
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10
}
```

### options.draw 
* simple 最直接的方式绘制点线面
* time 按时间字段来动画展示数据
* heatmap 热力图展示
* grid 网格状展示
* honeycomb 蜂窝状展示
* bubble 用不同大小的圆来展示
* intensity 根据不同的值对应按渐变色中颜色进行展示
* category 按不同的值进行分类，并使用对应的颜色展示
* choropleth 按不同的值区间进行分类，并使用对应的颜色展示
* text 展示文本
* icon 展示icon

### simple:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-simple.html)
dataSet中也可直接配置每个数据项的样式
```js
{
    geometry: {
        type: 'Point',
        coordinates: [123, 23]
    },
    size: 10, // 点数据时候使用
    fillStyle: 'red', // 点数据时候使用
    strokeStyle: 'red' // 线数据时候使用
}
```

### time:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-time.html)
```js
{
    draw: 'time',
    steps: 100, // 时间动画的帧数
    trails: 10, // 时间动画的拖尾大小
    duration: 5, // 单个动画的时间，单位秒
}
```

### heatmap:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-heatmap.html)
```js
var options = {
    draw: 'heatmap',
    radius: 13, // 每个热力点半径大小
    gradient: { // 热力图渐变色
        0.25: "rgb(0,0,255)",
        0.55: "rgb(0,255,0)",
        0.85: "yellow",
        1.0: "rgb(255,0,0)"
    },
    max: 100, // 最大权重值
}

dataSet中加count字段，代表权重，根据上面配置用以计算它的热度
```

### grid:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-grid.html)
```js
{
    draw: 'grid',
    gridWidth: 40,
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

### honeycomb:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-honeycomb.html)
```js
{
    draw: 'honeycomb',
    gridWidth: 40,
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

### bubble对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-bubble.html)
```js
{
    max: 100 // 数值最大值范围
    maxSize: 10, // 显示的圆最大半径大小
}
```
dataSet中加count字段，代表权重，根据上面配置用以计算它实际展示的大小

### intensity对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-intensity.html)
```js
{
    gradient: { // 显示的颜色渐变范围$
        '0': 'blue',$
        '0.6': 'cyan',$
        '0.7': 'lime',$
        '0.8': 'yellow',$
        '1.0': 'red'$
    }$
}
```

### category对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-category.html)
```js
{
    splitList: { // 按对应的值按相应颜色展示
        other: 'rgba(255, 255, 0, 0.8)',
        1: 'rgba(253, 98, 104, 0.8)',
        2: 'rgba(255, 146, 149, 0.8)',
        3: 'rgba(255, 241, 193, 0.8)',
        4: 'rgba(110, 176, 253, 0.8)',
        5: 'rgba(52, 139, 251, 0.8)',
        6: 'rgba(17, 102, 252)'
    }
}
```

### choropleth对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-choropleth.html)
```js
{
    // 按数值区间来展示不同颜色的点
    splitList: [
        {
            start: 0,
            end: 2,
            color: randomColor()
        },{
            start: 2,
            end: 4,
            color: randomColor()
        },{
            start: 4,
            end: 6,
            color: randomColor()
        },{
            start: 6,
            end: 8,
            color: randomColor()
        },{
            start: 8,
            color: randomColor()
        }
    ]
}
```

### icon对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-icon.html)
```js
{
    icon: Image // 加载好的Image对象
}
```

### text对应的options:
[示例地址](http://huiyan-fe.github.io/mapv/v2/examples/#baidu-map-point-text.html)
```js
{
    text: '文本内容' 
}
```

## 方法
### mapvLayer.show(); // 显示图层
### mapvLayer.hide(); // 删除图层
