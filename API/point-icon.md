#Point-icon

Point-text 可以实现在页面中打上你所需要的icon。


### 参数示例：

```javascript
var options = {
  draw: 'icon'
}

```


### 完整示例

#### 示例数据如下：

``` javascript
var data = [
    {
        "geometry": {
            "type": "Point",
            "coordinates": [
                114.58723224634012,
                26.33796194184357
            ]
        },
        icon: img
    },
    {
        "geometry": {
            "type": "Point",
            "coordinates": [
                112.30757008560829,
                21.363773336499943
            ]
        },
        icon: img // img 为new Image实例
    }
]
```

####  以百度地图图层为示例：

```javascript
// 百度地图API功能
// 创建Map实例
var map = new BMap.Map("map", {
  enableMapClick: false
}); 
// 初始化地图,设置中心点坐标和地图级别
map.centerAndZoom(new BMap.Point(106.962497, 38.208726), 5); 

var img = new Image();
img.src = 'images/flag.png';
// 设置icon时，请确认img已经load完毕，否则可能造成初次渲染时，由于img未加载完毕导致的没法渲染。
img.onload = function() {
  for(var i in data){
    // 设置icon，icon必须为Image的实例
    data[i].icon = img
  }
  // 设置dataSet
  var dataSet = new mapv.DataSet(data);
  var options = {
    draw: 'icon'
  }
  // 实例化mapvLayer
  var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
}
```