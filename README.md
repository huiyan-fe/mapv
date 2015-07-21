# mapv - 方便的地图打点工具

TIPS:

mapv 是一款基于百度地图的海量点打点工具，用户可以通过直接打点，热力图等方式展示数据。

## 示例

<<<<<<< HEAD
访问[示例地址](http://huiyan-fe.github.io/mapv/examples/)

#### 画点示例代码

```js
var mapv = new Mapv({
    map: map
});

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
        simple: {
            fillStyle: "rgba(255, 255, 50, 1)",
            lineWidth: 5,
            radius: 20
        }
    }
});
```
#### 画线示例代码

=======
>>>>>>> 272f53538359c1104b2cfc4d398585d9fa5c007b
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
