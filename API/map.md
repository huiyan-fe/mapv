# 创建地图

mapv部分效果展示需要依赖于地图，我们可以通过以下方式创建地图：

### 1. 原生方式

以百度地图为例(具体的方法请参阅百度地图的js api手册)

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

### 2. 通过Mapv的helper创建地图

mapv封装了简单的创建地图的方法 `mapv.Map('domId','maptype','optiosn')`


```javascript
var baiduMap = new mapv.Map('mapabc', 'baidu');
```

