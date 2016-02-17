# Mapv - 地图可视化工具库

官网地址:[http://mapv.baidu.com/](http://mapv.baidu.com/)

<img src='http://huiyan-fe.github.io/mapv/doc/asset/img/logo.png' width='130' align='left'/>
Mapv 是一款基于百度地图的大数据可视化开源库，可以用来展示大量的点、线、面的数据，每种数据也有不同的展示类型，如直接打点、热力图、网格、聚合等方式展示数据。

更多文档信息请查看[wiki](https://github.com/huiyan-fe/mapv/wiki)

## 示例

访问更多[示例地址](https://github.com/huiyan-fe/mapv/wiki/%E7%A4%BA%E4%BE%8B)

[![point_simple](http://huiyan-fe.github.io/mapv/doc/asset/gallery/point_simple.jpg)](http://huiyan-fe.github.io/mapv/examples/point_simple.html)
[![point_bubble](http://huiyan-fe.github.io/mapv/doc/asset/gallery/point_bubble.jpg)](http://huiyan-fe.github.io/mapv/examples/point_bubble.html)
[![point_heatmap](http://huiyan-fe.github.io/mapv/doc/asset/gallery/point_heatmap.jpg)](http://huiyan-fe.github.io/mapv/examples/point_heatmap.html)
[![polygon_intensity](http://huiyan-fe.github.io/mapv/doc/asset/gallery/polygon_intensity.jpg)](http://huiyan-fe.github.io/mapv/examples/polygon_intensity.html)
[![polyline_simple](http://huiyan-fe.github.io/mapv/doc/asset/gallery/polyline_simple.jpg)](http://huiyan-fe.github.io/mapv/examples/polyline_simple.html)
[![polyline_simple_animation](http://huiyan-fe.github.io/mapv/doc/asset/gallery/polyline_simple_animation.jpg)](http://huiyan-fe.github.io/mapv/examples/polyline_simple_animation.html)

### 示例代码

#### 创建mapv对象
```js
// 第一步创建mapv示例
var mapv = new Mapv({
    map: map  // 百度地图的map实例
});
```

#### 创建点数据图层
```js

// 创建一个图层
var layer = new Mapv.Layer({
    zIndex: 3, // 图层的层级
    mapv: mapv, // 对应的mapv
    dataType: 'point', // 数据类型，point:点数据类型,polyline:线数据类型,polygon:面数据类型
    //数据，格式如下
    data: [
        {
            lng: 116.46507, // 经度
            lat: 39.929101, // 纬度
            count: 1 // 当前点的权重值
        },
        {
            lng: 116.43507,
            lat: 39.909101,
            count: 2
        }
    ],
    drawType: 'simple', // 渲染数据方式, simple:普通的打点, [更多查看类参考](https://github.com/huiyan-fe/mapv/wiki/%E7%B1%BB%E5%8F%82%E8%80%83)
    // 渲染数据参数
    drawOptions: {
        fillStyle: "rgba(255, 255, 50, 1)",  // 填充颜色
        strokeStyle: "rgba(50, 50, 255, 0.8)", // 描边颜色，不传就不描边
        lineWidth: 5, // 描边宽度
        radius: 5, // 半径大小
        unit: 'px' // 半径对应的单位，px:默认值，屏幕像素单位,m:米,对应地图上的大约距离,18级别时候1像素大约代表1米
    }
});
```
#### 创建线数据图层
```js
var layer = new Mapv.Layer({
    mapv: mapv,
    dataType: 'polyline',
    data: [
        {
            geo: [
                [116.39507, 39.879101],
                [116.49507, 39.889101],
                [116.46507, 39.929101],
                [116.43507, 39.909101]
            ],
            count: 10
        }
    ],
    drawType: 'simple',
    zIndex: 5,
    animation: true,
    drawOptions: {
        lineWidth: 2,
        strokeStyle: "rgba(0, 0, 255, 1)"
    },
    animationOptions: {
        radius: 10
    }
});
```
#### 创建面数据图层
```js
var layer = new Mapv.Layer({
    zIndex: 3,
    mapv: mapv,
    dataType: 'polygon',
    data: [
        {
            geo: [
                [116.39507, 39.879101],
                [116.49507, 39.889101],
                [116.46507, 39.929101],
                [116.43507, 39.909101]
            ],
            count: 10
        }
    ],
    drawType: 'simple',
    drawOptions: {
        lineWidth: 8,
        strokeStyle: "rgba(255, 255, 0, 1)",
        fillStyle: "rgba(255, 0, 0, 0.8)"
    }
});
```

### 编辑器

mavp 提供了可视化编辑器，通过编辑器，你可以方便的编辑，分享你的数据

* [编辑器地址](http://huiyan.baidu.com/mapv/);
* [编辑器使用wiki](https://github.com/huiyan-fe/mapv/wiki/%E7%BC%96%E8%BE%91%E5%99%A8)
* [编辑器分享demo](http://huiyan.baidu.com/mapv/?user=zmofei&project=icq0dfuu_8kcd89);

### 谁在使用

[![百度慧眼](/doc/asset/img/user/huiyan.png)](http://huiyan.baidu.com)

[![百度交通云](/doc/asset/img/user/jiaotong.png)](http://jiaotong.baidu.com/)
