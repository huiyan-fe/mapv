/**
 * @file 示例代码
 */

/* globals Drawer mercatorProjection BMap util Mapv*/

// 创建Map实例
var map = new BMap.Map('map', {
    enableMapClick: false
    //vectorMapLevel: 3
});

var mercatorProjection = map.getMapType().getProjection();

map.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 启用滚轮放大缩小

var mapv;

map.getContainer().style.background = '#081734';
map.setMapStyle({
    styleJson: [{
        featureType: 'water',
        elementType: 'all',
        stylers: {
            color: '#044161'
        }
    }, {
        featureType: 'land',
        elementType: 'all',
        stylers: {
            color: '#091934'
        }
    }, {
        featureType: 'boundary',
        elementType: 'geometry',
        stylers: {
            color: '#064f85'
        }
    }, {
        featureType: 'railway',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'highway',
        elementType: 'geometry',
        stylers: {
            color: '#004981'
        }
    }, {
        featureType: 'highway',
        elementType: 'geometry.fill',
        stylers: {
            color: '#005b96',
            lightness: 1
        }
    }, {
        featureType: 'highway',
        elementType: 'labels',
        stylers: {
            visibility: 'on'
        }
    }, {
        featureType: 'arterial',
        elementType: 'geometry',
        stylers: {
            color: '#004981',
            lightness: -39
        }
    }, {
        featureType: 'arterial',
        elementType: 'geometry.fill',
        stylers: {
            color: '#00508b'
        }
    }, {
        featureType: 'poi',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'green',
        elementType: 'all',
        stylers: {
            color: '#056197',
            visibility: 'off'
        }
    }, {
        featureType: 'subway',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'manmade',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'local',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'arterial',
        elementType: 'labels',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'boundary',
        elementType: 'geometry.fill',
        stylers: {
            color: '#029fd4'
        }
    }, {
        featureType: 'building',
        elementType: 'all',
        stylers: {
            color: '#1a5787'
        }
    }, {
        featureType: 'label',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: {
            color: '#ffffff'
        }
    }, {
        featureType: 'poi',
        elementType: 'labels.text.stroke',
        stylers: {
            color: '#1e1c1c'
        }
    }]
});

var data = null;
var drawOptions = {
    simple: {
        radius: 1.5,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['radius', 'fillStyle']
    },
    bubble: {
        splitList: [{
            start: 1,
            end: 2,
            radius: 1
        }, {
            start: 2,
            end: 3,
            radius: 2
        }, {
            start: 3,
            end: 4,
            radius: 3
        }, {
            start: 4,
            end: 5,
            radius: 4
        }, {
            start: 5,
            radius: 6
        }],
        globalCompositeOperation: 'lighter',
        fillStyle: 'rgba(50, 50, 255, 0.8)',
        editable: ['strokeStyle', 'fillStyle', 'globalCompositeOperation', {
            name: 'splitList',
            type: 'json'
        }]
    },
    choropleth: {
        radius: 2,
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
        editable: ['radius', {
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
        radius: 500,
        maxOpacity: 0.8,
        max: 100,
        blur: true,
        type: 'arc',
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        gradient: {
            '0.4': 'blue',
            '0.6': 'cyan',
            '0.7': 'lime',
            '0.8': 'yellow',
            '1.0': 'red'
        },
        editable: ['radius', 'max', 'maxOpacity', {
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
        radius: 2,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['radius']
    },
    intensity: {
        radius: 2,
        max: 10,
        fillStyle: 'rgba(55, 55, 255, 0.8)',
        editable: ['radius', 'max']
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
    map: map
};
mapv = new Mapv(options);

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
                simple: {
                    lineWidth: 8,
                    strokeStyle: "rgba(255, 255, 0, 1)",
                    fillStyle: "rgba(255, 0, 0, 0.8)"
                }
            }
        });

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
                simple: {
                    lineWidth: 2,
                    strokeStyle: "rgba(0, 0, 255, 1)"
                }
            }
        });


        var layer = new Mapv.Layer({
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
                simple: {
                    fillStyle: "rgba(255, 255, 50, 1)",
                    lineWidth: 5,
                    radius: 20
                }
            }
        });

        var layer = new Mapv.Layer({
            zIndex: 1,
            geometryType: 'point',
            data: data,
            drawType: 'heatmap',
            drawOptions: drawOptions
        });
        //layer.setMapv(mapv);

    }
});


$.ajax({
    url: 'data/drive.json',
    dataType: 'JSON',
    success: function (rs) {
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

        var layer = new Mapv.Layer({
            zIndex: 2,
            mapv: mapv,
            dataType: 'polyline',
            data: data,
            drawType: 'simple',
            zIndex: 2,
            coordType: 'bd09mc',
            drawOptions: {
                simple: {
                    globalCompositeOperation: 'lighter',
                    lineWidth: 0.2,
                    strokeStyle: "rgba(50, 50, 255, 1)"
                },
                heatmap: {
                    radius: 500,
                    maxOpacity: 0.8,
                    max: 100,
                    blur: true,
                    type: 'arc',
                    lineWidth: 1,
                    fillStyle: 'rgba(55, 55, 255, 0.8)',
                    gradient: {
                        '0': 'yellow',
                        '1.0': 'red'
                    },
                }
            }
        });

        var layer = new Mapv.Layer({
            zIndex: 3,
            mapv: mapv,
            dataType: 'polyline',
            data: data.slice(0, 10),
            drawType: 'simple',
            zIndex: 2,
            animation: true,
            coordType: 'bd09mc',
            drawOptions: {
                simple: {
                    shadowBlur: 40,
                    shadowColor: "yellow",
                    globalCompositeOperation: 'lighter',
                    lineWidth: 10,
                    strokeStyle: "rgba(250, 255, 0, 0.5)"
                }
            }
        });

    }
});
