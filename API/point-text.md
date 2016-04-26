#Point-text

Point-text 可以实现在页面中打上你所需要的文字。


### 参数示例：

```javascript
var options = {
  draw: 'text',
  fillStyle: 'white',
  textAlign: 'center',
  textBaseline: 'middle'
}

```

### 参数说明：

#### fillStyle

设置文本的颜色

如 `'#F00'`, `'red'`, `'rgba(1,1,1,0.5)'`

#### textAlign

设置文本的对齐方式

可选参数：`start`, `end`, `left`, `right`, `center`

#### textBaseline

设置文本垂直对齐方式

可选参数：`top`, `hanging`, `middle`, `alpahbetic`, `ideographic`, `bottom`

#### font

设置文本的字体和大小

如：`10px sans-serif`

-----


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
        "text": "￥9.29"
    },
    {
        "geometry": {
            "type": "Point",
            "coordinates": [
                112.30757008560829,
                21.363773336499943
            ]
        },
        "text": "￥1.60"
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

// 设置dataSet
var dataSet = new mapv.DataSet(data);
// 配置文字图层,参考上文描述
var options = {
  draw: 'text'
}
// 实例化mapvLayer
var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
```