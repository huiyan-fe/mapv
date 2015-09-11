// 创建Map实例
var bmap = new BMap.Map('map', {
    enableMapClick: false,
    minZoom: 4
    //vectorMapLevel: 3
});

bmap.enableScrollWheelZoom(); // 启用滚轮放大缩小

bmap.getContainer().style.background = '#081734';
bmap.setMapStyle({
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

