/**
 * @author Mofei Zhu <hello@zhuwenlong.com>
 */

var MapEvent_id = 0;

var MapEvent_events = {
    mousemove: {},
    click: {},
};

function MapEvent(map){
    map.addEventListener('mousemove',function(e){
        for(var i in MapEvent_events.mousemove) {
            MapEvent_events.mousemove[i](e);
        }
    })

    map.addEventListener('click',function(e){
        for(var i in MapEvent_events.click) {
            MapEvent_events.click[i](e);
        }
    })
}

MapEvent.prototype.addEvent = function (type, callback) {
    MapEvent_events[type][MapEvent_id++] = callback;
}

MapEvent.prototype.removeEvent = function (id) {
    delete MapEvent_events[type][id]
}
