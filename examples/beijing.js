/**
 * @file ***
 */

/* globals Drawer mercatorProjection BMap util Mapv*/

// 创建Map实例
var map = new BMap.Map('map', {
    vectorMapLevel: 3
});

var mercatorProjection = map.getMapType().getProjection();

// var point = new BMap.Point();
// this.options.map.centerAndZoom(point, 15);
map.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 启用滚轮放大缩小

// TODO : below just for test
var isShangai = false;
if (isShangai) {
    map.centerAndZoom(new BMap.Point(121.5, 31.2), 12); // 初始化地图,设置中心点坐标和地图级别
    // map
    var pois = [
        [121.70513904277, 31.199602856478],
        [121.45914104327, 31.279773854259],
        [121.49265098286, 31.256612872513],
        [121.33141295908, 31.245922855378],
        [121.43313096655, 31.235859878798],
        [121.48195396085, 31.225193891703],
        [121.5142749931, 31.273830868841],
        [121.49906299776, 31.194265864116],
        [121.45565696535, 31.229639899077],
        [121.48209400668, 31.244280848136],
        [121.38873302519, 31.238584849344],
        [121.35640696243, 31.161976877939],
        [121.51990404491, 31.306741847111],
        [121.34628898815, 31.09459883687],
        [121.41818900185, 31.238380838237],
        [121.50296200299, 31.387869856986],
        [121.49486602459, 31.412066871977],
        [121.50967000956, 31.241181841748],
        [121.34553602847, 31.168699826217],
        [121.46199199546, 31.060630887432],
        [121.37770201319, 31.182268858199],
        [121.49796697521, 31.398614888974],
        [121.4645069814, 31.221941854656],
        [121.50589901286, 31.242599833231],
        [121.5980096429, 31.318118786364],
        [121.48348296665, 31.276561908335],
        [121.42196996974, 31.193926842742],
        [121.22880796474, 31.294203910814],
        [121.54425998187, 31.270789865221],
        [121.34961999481, 31.266896856479],
        [121.42145595933, 31.275729835146],
        [121.60791597641, 31.210490888382],
        [121.44897402151, 31.23030185686],
        [121.44452399567, 31.19256889153],
        [121.48790200095, 31.411281927898],
        [121.35417404443, 31.269707885729],
        [121.50123159709, 31.169484804401],
        [121.54818198372, 31.224372864146],
        [121.51240885323, 31.27019586605],
        [121.59738603922, 31.318548902724],
        [121.59869496018, 31.266827870262],
        [121.40241349947, 31.229259628266],
        [121.61836299999, 31.299332866971],
        [121.41415498129, 31.053084871739],
        [121.56413795568, 31.209583870981],
        [121.49759498689, 31.166701895011],
        [121.38163003369, 31.277949889297],
        [121.40502604138, 31.078155827462],
        [121.66036803513, 31.272051850144],
        [121.31002798794, 31.30173586893],
        [121.38070397054, 31.186459875584],
        [121.49015899354, 31.261683855186],
        [121.49746302582, 31.286065874162],
        [121.46667602989, 31.219641875804],
        [121.48512596743, 31.230213853413],
        [121.43621799343, 31.208636848036],
        [121.41382700995, 31.212884902666],
        [121.38958902051, 31.251431866905],
        [121.38599499, 31.240005890531],
        [121.31390202028, 31.215409878238],
        [121.40324003037, 31.062267836207],
        [121.28771102483, 31.208910879549],
        [121.32786096926, 31.245510851194],
        [121.45238848075, 31.330101454353],
        [121.45296195899, 31.299815909892],
        [121.27445796432, 31.332466881387],
        [121.41260495514, 31.244589894101],
        [121.5241910283, 31.233890860253],
        [121.46505297149, 31.274477853489],
        [121.44436697187, 31.268443862865],
        [121.46779801347, 31.224117869354],
        [121.4803789618, 31.241679850896],
        [121.51310504, 31.270164846504],
        [121.23461901326, 31.158382337472],
        [121.34740198868, 31.170756884597],
        [121.32825703216, 31.3031078942],
        [121.54382502234, 31.276145872667],
        [121.46458504415, 31.192091858615],
        [121.66341706369, 31.242023253364],
        [121.59821697181, 31.196985867739],
        [121.52857996936, 31.322129889519],
        [121.23775697406, 31.247397889569],
        [121.42306105161, 31.088493648605],
        [121.41135702912, 31.217312887936],
        [121.48253300858, 31.238707888745],
        [121.47830414556, 31.24889952781],
        [121.40652800819, 31.136792884858],
        [121.48080700437, 31.241926847629],
        [121.44376304107, 31.201726881111],
        [121.34811497376, 31.171325869948],
        [121.39467998733, 31.113007867006],
        [121.47359702469, 31.264184903587],
        [121.59058595634, 31.206556838544],
        [121.42048102836, 31.275913857906],
        [121.56850596622, 31.214844866532],
        [121.44326897304, 31.245905875099],
        [121.32439898965, 31.317553855551],
        [121.59399601388, 31.277340890017],
        [121.51981996352, 31.146475853549],
        [121.38356615156, 31.220923543309],
        [121.54608003866, 31.271700841803],
        [121.50727898978, 31.386022882593],
        [121.49718562907, 31.193194042693],
        [121.3844839503, 31.113848806519],
        [121.4437634004, 31.201727189989],
        [121.39181295546, 31.252168841798],
        [121.50751704074, 31.281159858636],
        [121.52157399486, 31.232008875772],
        [121.4193850058, 31.102550835999],
        [121.486441985, 31.237781847322],
        [121.4103105032, 31.217239309937],
        [121.37603700393, 31.214345865246],
        [121.46273399582, 31.235418883381],
        [121.48302402237, 31.242689831856],
        [121.42066095895, 31.277515882235],
        [121.54815503456, 31.22432584881],
        [121.70528600555, 31.189678855012],
        [121.48634999852, 31.232032883277],
        [121.42561798842, 31.144395855438],
        [121.41860096476, 31.17618682304],
        [121.39263104229, 31.320908915957],
        [121.42273999722, 31.224815841639],
        [121.44689902561, 31.203670862753],
        [121.44606198453, 31.199865871812],
        [121.52237896642, 31.307079842583],
        [121.44301295597, 31.140857821144],
        [121.42992500401, 31.243996886171],
        [121.47777198938, 31.239007844849],
        [121.48120297744, 31.289562860507],
        [121.4463568084, 31.25532690907],
        [121.51217098193, 31.101004877037],
        [121.52477798112, 31.235404834482],
        [121.52527600169, 31.216258856347],
        [121.50172198207, 31.20241783897]
    ];
    // var point=new BMap.Point(121.5,31.2);
    // map.centerAndZoom(point, 15);
    for (var i = 0; i < pois.length; i++) {
        var point = new BMap.Point(pois[i][0], pois[i][1]);
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
    }
}




var mapv;

map.getContainer().style.background = '#081734';
/*
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
*/

// map.setMapStyle({
//     styleJson: [{
//         featureType: 'all',
//         elementType: 'geometry',
//         stylers: {
//             hue: '#007fff',
//             saturation: 89
//         }
//     }, {
//         featureType: 'water',
//         elementType: 'all',
//         stylers: {
//             color: '#ffffff'
//         }
//     }]
// });

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
        editable: [{
            name: 'fillStyle',
            type: 'color'
                // type: 'text'
        }, 'globalCompositeOperation', {
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

$.ajax({
    url: 'http://huiyan.baidu.com/huiyan/api/heatmap/?file=beijing_16_2015060316&callback=?',
    dataType: 'JSON',
    success: function (rs) {
        rs = JSON.parse(rs);
        var data = [];
        for (var i = 1; i < rs.length; i++) {
            var tmp = rs[i];
            data.push({
                lng: tmp[0],
                lat: tmp[1],
                count: tmp[2]
            });
        }
        var options = {
            map: map,
            data: data,
            drawType: 'density',
            drawOptions: drawOptions
        };
        mapv = new Mapv(options);
    }
});
