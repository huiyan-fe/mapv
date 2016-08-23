/**
 * @file this file is to the the map's style
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function () {
    var map;
    // add some control data to the DOM
    var dom = document.createElement('div');
    dom.setAttribute('class', 'E-mapstyle');
    document.body.appendChild(dom);

    var day = document.createElement('div');
    day.setAttribute('class','E-maystyle-btn E-maystyle-day');
    dom.appendChild(day)

    var night = document.createElement('div');
    night.setAttribute('class','E-maystyle-btn E-maystyle-night E-maystyle-active');
    dom.appendChild(night)

    $('.E-mapstyle').on('click','.E-maystyle-btn',function(){
        $('.E-maystyle-btn').removeClass('E-maystyle-active');
        $(this).addClass('E-maystyle-active');
        if($(this).index('.E-maystyle-btn') == 1){
            trunToNight(map);
        }else{
            trunToDay(map);
        }
        return false;
    });

    return {
        setMap:function(m){
            map = m;
            trunToNight(map);
        }
    }
});

function trunToDay(map){
    console.log('style')
    map.setMapStyle({styleJson:[]});
}

function trunToNight(map){
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
}
