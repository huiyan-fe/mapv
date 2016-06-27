/**
 * Action
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

class Action {

    constructor() {
        this.stores = {
            default: []
        };
    }

    /**
     * obj.actionGroup
     * obj.store
     */
    regest(obj) {
        var _channel = obj.actionGroup || 'default';
        this.stores[_channel] = this.stores[_channel] || [];
        this.stores[_channel].push(obj.store);
    }

    /**
     * obj.actionGroup
     * obj.channel
     * obj.data
     */
    emit(obj) {
        var _stores = []
        var _channel = obj.actionGroup || 'default';
        if (_channel !== 'all') {
            _stores = _stores.concat(this.stores[_channel]);
        } else {
            for (var i in this.stores) {
                _stores = _stores.concat(this.stores[i]);
            }
        };

        for (var i in _stores) {
            // console.log(_stores);
            _stores[i].emit(_channel, obj.data);
        }

    }


}

export default Action;