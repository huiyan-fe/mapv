> [API Reference](https://github.com/huiyan-fe/mapv/blob/v2/API.md) ▸ baiduMapLayer

# mapv.baiduMapLayer

## 创建地图

mapv部分效果展示需要依赖于地图，我们可以通过以下方式创建地图：

以百度地图为例(具体的方法请参阅百度地图的js [api手册](http://lbsyun.baidu.com/index.php?title=jspopular))

```javascript
// 创建Map实例
var map = new BMap.Map("map", {
  enableMapClick: false
});    
       
// 初始化地图,设置中心点坐标和地图级别
map.centerAndZoom(new BMap.Point(106.962497, 38.208726), 4);  

// 设置地图样式
map.setMapStyle({
  style: 'midnight'
});
```

添加百度地图可视化叠加图层

```javascript
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.6)',
        shadowColor: 'rgba(55, 50, 250, 0.5)',
        shadowBlur: 10,
        size: 5,
        draw: 'simple'
    }

    var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
```

## options

### options通用的属性:
```js
{
    zIndex: 1, // 层级
    size: 5, // 大小值
    mixBlendMode: 'normal', // 不同图层之间的叠加模式，参考[https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)
    fillStyle: 'rgba(200, 200, 50, 1)', // 填充颜色
    strokeStyle: 'rgba(0, 0, 255, 1)', // 描边颜色
    lineWidth: 4, // 描边宽度
    globalAlpha: 1, // 透明度
    globalCompositeOperation: 'lighter', // 颜色叠加方式
    coordType: 'bd09ll', // 可选百度墨卡托坐标类型bd09mc和百度经纬度坐标类型bd09ll(默认)
    shadowColor: 'rgba(255, 255, 255, 1)', // 投影颜色
    shadowBlur: 35,  // 投影模糊级数
    updateCallback: function (time) { // 重绘回调函数，如果是时间动画、返回当前帧的时间
    },
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    context: '2d', // 可选2d和webgl，webgl目前只支持画simple模式的点和线
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    methods: { // 一些事件回调函数
        click: function (item) { // 点击事件，返回对应点击元素的对象值
            console.log(item);
        },
        mousemove: function(item) { // 鼠标移动事件，对应鼠标经过的元素对象值
            console.log(item);
        }
    },
    animation: {
        type: 'time', // 按时间展示动画
        stepsRange: { // 动画时间范围,time字段中值
            start: 0,
            end: 100
        },
        trails: 10, // 时间动画的拖尾大小
        duration: 5, // 单个动画的时间，单位秒
    }
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
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-simple.html)
dataSet中也可直接配置每个数据项的样式
```js
{
    draw: 'simple',
    geometry: {
        type: 'Point',
        coordinates: [123, 23]
    },
    size: 10, // 点数据时候使用
    fillStyle: 'red', // 点数据时候使用
    strokeStyle: 'red' // 线数据时候使用
}
```
### heatmap:
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-heatmap.html)
```js
var options = {
    draw: 'heatmap',
    size: 13, // 每个热力点半径大小
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
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-grid.html)
```js
{
    draw: 'grid',
    size: 40,
    label: { // 网格中显示累加的值总和
        show: true,
        fillStyle: 'white',
        shadowColor: 'yellow',
        font: '20px Arial',
        shadowBlur: 10,
    },
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

### honeycomb:
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-honeycomb.html)
```js
{
    draw: 'honeycomb',
    size: 40,
    label: { // 网格中显示累加的值总和
        show: true,
        fillStyle: 'white',
        shadowColor: 'yellow',
        font: '20px Arial',
        shadowBlur: 10,
    },
    gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
}
```

### bubble对应的options:
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-bubble.html)
```js
{
    draw: 'bubble',
    max: 100, // 数值最大值范围
    maxSize: 10, // 显示的圆最大半径大小
}
```
dataSet中加count字段，代表权重，根据上面配置用以计算它实际展示的大小

### intensity对应的options:
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-intensity.html)
```js
{
    draw: 'intensity',
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
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-category.html)
```js
{
    draw: 'category',
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
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-choropleth.html)
```js
{
    draw: 'choropleth',
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
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-icon.html)
```js
{
    draw: 'icon',
    rotate: '90', // 图片旋转角度
    width: 10, // 规定图像的宽度
    height: 10, // 规定图像的高度
    size: 10, // 添加点击事件时候可以用来设置点击范围
    sx: 10, // 开始剪切的 x 坐标位置
    sy: 10, // 开始剪切的 y 坐标位置
    swidth: 10, // 被剪切图像的宽度
    sheight: 10, // 被剪切图像的高度
}
```
dataSet中添加字段
```js
{
    icon: Image, // 加载好的Image对象
    rotate: '90', // 图片旋转角度
}
```

### text对应的options:
[示例地址](http://mapv.baidu.com/examples/#baidu-map-point-text.html)
```js
{
    draw: 'text',
    fillStyle: 'white',
    textAlign: 'center',
    textBaseline: 'middle',
    offset: { // 文本便宜值
        x: 0,
        y: 0
    }
}
```
dataSet中添加字段
```js
{
    text: '文本内容' 
}
```

## animation:
[点动画1](http://mapv.baidu.com/examples/#baidu-map-point-time.html)
[点动画2](http://mapv.baidu.com/examples/#baidu-map-point-time1.html)
[线动画](http://mapv.baidu.com/examples/#baidu-map-polyline-time.html)
```js
{
    draw: 'simple',
    animation: {
        type: 'time', // 按时间展示动画
        stepsRange: { // 动画时间范围,time字段中值
            start: 0,
            end: 100
        },
        trails: 10, // 时间动画的拖尾大小
        duration: 5, // 单个动画的时间，单位秒
    }
}
```



## 方法
### mapvLayer.update({
    options: {} // 修改配置
}); 
### mapvLayer.setOptions({
    size: 1
}); // 重新设置配置
### mapvLayer.show(); // 显示图层
### mapvLayer.hide(); // 隐藏图层
### mapvLayer.destroy(); // 销毁当前图层
