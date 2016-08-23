/**
 * @file 示例代码
 */

bmap.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12); // 初始化地图,设置中心点坐标和地图级别

var data = null;
var drawOptions = {
    simple: {
        size: 1.5,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['size', 'fillStyle']
    },
    bubble: {
        splitList: [{
            start: 1,
            end: 2,
            size: 1
        }, {
            start: 2,
            end: 3,
            size: 2
        }, {
            start: 3,
            end: 4,
            size: 3
        }, {
            start: 4,
            end: 5,
            size: 4
        }, {
            start: 5,
            size: 6
        }],
        globalCompositeOperation: 'lighter',
        fillStyle: 'rgba(50, 50, 255, 0.8)',
        editable: ['strokeStyle', 'fillStyle', 'globalCompositeOperation', {
            name: 'splitList',
            type: 'json'
        }]
    },
    choropleth: {
        size: 2,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        splitList: [{
            start: 1,
            end: 2,
            color: 'rgba(17, 102, 252, 0.8)'
        }, {
            start: 2,
            end: 3,
            color: 'rgba(52, 139, 251, 0.8)'
        }, {
            start: 3,
            end: 4,
            color: 'rgba(110, 176, 253, 0.8)'
        }, {
            start: 4,
            end: 5,
            color: 'rgba(255, 241, 193, 0.8)'
        }, {
            start: 5,
            color: 'rgba(255, 146, 149, 0.8)'
        }],
        editable: ['size', {
            name: 'splitList',
            type: 'json'
        }]
    },
    density: {
        gridWidth: '30',
        gridUnit: 'px',
        gridType: 'honeycomb',
        showNum: true,
        editable: ['gridWidth', {
            name: 'gridUnit',
            type: 'option',
            value: ['px', 'm']
        }, {
            name: 'gridType',
            type: 'option',
            value: ['honeycomb', 'brick']
        }, {
            name: 'showNum',
            type: 'check'
        }]
    },
    heatmap: {
        size: 500,
        minPxSize: 2.5,
        maxOpacity: 0.8,
        max: 100,
        //shadowBlur: 0,
        type: 'arc',
        unit: 'm',
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        gradient: {
            '0.4': 'blue',
            '0.6': 'cyan',
            '0.7': 'lime',
            '0.8': 'yellow',
            '1.0': 'red'
        },
        editable: ['size', 'max', 'maxOpacity', {
            name: 'gradient',
            type: 'json'
        }, {
            name: 'blur',
            type: 'check'
        }, {
            name: 'type',
            type: 'option',
            value: ['rect', 'arc']
        }]
    },
    category: {
        size: 2,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['size']
    },
    intensity: {
        size: 2,
        max: 10,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['size', 'max']
    },
    cluster: {
        // gridWidth: '30',
        // gridUnit: 'px',
        // showNum: true,
        // editable: ['gridWidth', {
        //     name: 'gridUnit',
        //     type: 'option',
        //     value: ['px', 'm']
        // }, {
        //     name: 'showNum',
        //     type: 'check'
        // }]
    }
};


var options = {
    drawTypeControl: true,
    map: bmap
};

var mapv = new Mapv(options);

/*
var polygonLayer = new Mapv.Layer({
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

var polylineLayer = new Mapv.Layer({
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
        size: 10
    }
});

var pointLayer = new Mapv.Layer({
    zIndex: 3,
    mapv: mapv,
    dataType: 'point',
    data: [
        {
            lng: 116.39507,
            lat: 39.879101
        },
        {
            lng: 116.49507,
            lat: 39.889101
        },
        {
            lng: 116.46507,
            lat: 39.929101
        },
        {
            lng: 116.43507,
            lat: 39.909101
        }
    ],
    drawType: 'simple',
    drawOptions: {
        fillStyle: "rgba(255, 255, 50, 1)",
        lineWidth: 5,
        size: 20
    }
});
*/

$.ajax({
    url: 'data/beijing.json',
    dataType: 'JSON',
    success: function (rs) {
        var data = [];
        for (var i = 1; i < rs.length; i++) {
            var tmp = rs[i];
            data.push({
                lng: tmp[0],
                lat: tmp[1],
                count: tmp[2]
            });
        }

        var layer = new Mapv.Layer({
            zIndex: 1,
            geometryType: 'point',
            data: data,
            drawType: 'heatmap',
            drawOptions: drawOptions['heatmap']
        });
        layer.setMapv(mapv);
        
        mapv.setOptions({
            drawTypeControlOptions: {
                layer: layer,
                drawOptions: drawOptions,
            }
        });
    }
});

$.ajax({
    url: 'data/drive.json',
    dataType: 'JSON',
    success: function (rs) {
        return;
        console.log(1, rs);
        var data = [];

        for (var i = 0; i < rs.length; i++) {
            data.push({
                geo: rs[i][0],
                count: rs[i][1]
            });
        }

        data = data.sort(function(a, b){
            return a.count - b.count;
        });

        console.log(JSON.stringify(data.slice(0, 100)));

        var layer = new Mapv.Layer({
            mapv: mapv,
            dataType: 'polyline',
            data: data.slice(0, 10),
            zIndex: 3,
            animation: true,
            animationOptions: {
                size: 15
            },
            coordType: 'bd09mc',
            drawType: 'simple',
            drawOptions: {
                shadowBlur: 40,
                shadowColor: "yellow",
                globalCompositeOperation: 'lighter',
                lineWidth: 10,
                strokeStyle: "rgba(250, 255, 0, 0.5)"
            }
        });

        var layer = new Mapv.Layer({
            zIndex: 2,
            mapv: mapv,
            dataType: 'polyline',
            data: data,
            coordType: 'bd09mc',
            animation: true,
            animationOptions: {
                size: 2
            },
            drawType: 'simple',
            drawOptions: {
                globalCompositeOperation: 'lighter',
                lineWidth: 0.2,
                strokeStyle: "rgba(50, 50, 255, 1)"
            }
        });

    }
});
