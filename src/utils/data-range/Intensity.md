# utilDataRangeIntensity
值域组件，可以按照强度获取对应渐变色中的颜色或半径大小值

## 类
实例化值域组件
```javascript
var intensity = new mapv.utilDataRangeIntensity({
    maxSize: 100, // 定义最大的半径大小值
    gradient: { // 渐变色设置
        0.25: "rgb(0,0,255)",
        0.55: "rgb(0,255,0)",
        0.85: "yellow",
        1.0: "rgb(255,0,0)"
    },
    max: 100 // 最大权重值
});
```

## 方法

### getSize
根据权重值获取对应的大小
```javascript
    var size = intensity.getSize(count);
```
### getColor
根据权重值获取对应的颜色
```javascript
    var size = intensity.getColor(count);
```
### setMax
修改最大权重值
```javascript
    intensity.setMax(100);
```
### setMaxSize
修改最大半径值
```javascript
    intensity.setMaxSize(100);
```
