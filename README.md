# mapv - 方便的地图打点工具

TIPS:

mapv 是一款基于百度地图的海量点打点工具，用户可以通过直接打点，热力图等方式展示数据。

## 示例

访问[示例地址](http://huiyan-fe.github.io/mapv/examples/)

### 示例代码

#### 创建mapv对象
```js
var mapv = new Mapv({
    map: map
});
```

#### 创建点数据图层
```js
var layer = new Mapv.Layer({
    zIndex: 3,
    mapv: mapv,
    dataType: 'point', 
    data: [
        {
            lng: 116.46507,
            lat: 39.929101,
            count: 1
        },
        {
            lng: 116.43507,
            lat: 39.909101,
            count: 2
        }
    ],
    drawType: 'simple',
    drawOptions: {
        fillStyle: "rgba(255, 255, 50, 1)",
        lineWidth: 5,
        radius: 5
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

#### bubble类型
![bubble类型](/doc/asset/img/bubble.png)

#### choropleth 类型
![bubble类型](/doc/asset/img/choropleth.png)

#### cluster 类型
![bubble类型](/doc/asset/img/cluster.png)

#### density 类型
![bubble类型](/doc/asset/img/density.png)

#### heatmap 类型
![bubble类型](/doc/asset/img/heatmap.png)
