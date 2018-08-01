/**
  * 根据弧线的坐标节点数组
  */
function getCurvePoints (points, options) {
  options = options || {};
  var curvePoints = [];
  for (var i = 0; i < points.length - 1; i++) {
    var p = getCurveByTwoPoints(points[i], points[i + 1], options.count);
    if (p && p.length > 0) {
      curvePoints = curvePoints.concat(p);
    }
  }
  return curvePoints;
}

/**
 * 根据两点获取曲线坐标点数组
 * @param Point 起点
 * @param Point 终点
 */
function getCurveByTwoPoints (obj1, obj2, count) {
  console.info(obj1, obj2)
  if (!obj1 || !obj2) {
    return null;
  }

  var B1 = function (x) {
    return 1 - 2 * x + x * x;
  };
  var B2 = function (x) {
    return 2 * x - 2 * x * x;
  };
  var B3 = function (x) {
    return x * x;
  };

  var curveCoordinates = [];

  var count = count || 40; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
  var isFuture = false;
  var t, h, h2, lat3, lng3, j, t2;
  var LnArray = [];
  var i = 0;
  var inc = 0;

  if (typeof (obj2) == "undefined") {
    if (typeof (curveCoordinates) != "undefined") {
      curveCoordinates = [];
    }
    return;
  }

  var lat1 = parseFloat(obj1.lat);
  var lat2 = parseFloat(obj2.lat);
  var lng1 = parseFloat(obj1.lng);
  var lng2 = parseFloat(obj2.lng);

  // 计算曲线角度的方法
  if (lng2 > lng1) {
    if (parseFloat(lng2 - lng1) > 180) {
      if (lng1 < 0) {
        lng1 = parseFloat(180 + 180 + lng1);
        lng2 = parseFloat(180 + 180 + lng2);
      }
    }
  }
  // 此时纠正了 lng1 lng2
  j = 0;
  t2 = 0;
  // 纬度相同
  if (lat2 == lat1) {
    t = 0;
    h = lng1 - lng2;
    // 经度相同
  } else if (lng2 == lng1) {
    t = Math.PI / 2;
    h = lat1 - lat2;
  } else {
    t = Math.atan((lat2 - lat1) / (lng2 - lng1));
    h = (lat2 - lat1) / Math.sin(t);
  }
  if (t2 == 0) {
    t2 = (t + (Math.PI / 5));
  }
  h2 = h / 2;
  lng3 = h2 * Math.cos(t2) + lng1;
  lat3 = h2 * Math.sin(t2) + lat1;

  for (i = 0; i < count + 1; i++) {
    var x = lng1 * B1(inc) + lng3 * B2(inc) + lng2 * B3(inc);
    var y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc);
    var lng1_src = obj1.lng;
    var lng2_src = obj2.lng;

    curveCoordinates.push([
      (lng1_src < 0 && lng2_src > 0) ? x - 360 : x, y
    ]);
    inc = inc + (1 / count);
  }
  return curveCoordinates;
}

function Point (lng, lat) {
  this.lng = lng;
  this.lat = lat;
}

var curve = {
  getPoints: getCurvePoints
}

export default curve;
