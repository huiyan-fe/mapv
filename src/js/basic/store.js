/**
 * Store
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

class Store {

    constructor() {
        this.emits = {};
        this.maxId = 0;
    }

    /**
     * listen for a channle
     * @param  {String} channle
     * @param  {Function} fn
     * @returns the listener's id
     */
    on(channel, fn) {
        if (arguments.length == 1) {
            fn = channel;
            channel = 'default';
        }
        this.emits[channel] = this.emits[channel] || {};
        var id = ++this.maxId;
        this.emits[channel][id] = fn;
        return id;
    }

    /**
     * remove the listener  
     * @param  {Number} id the linstner's id
     */
    unbind(id) {
        for (var channel in this.emits) {
            var typeFn = this.emits[channel];
            for (var _id in typeFn) {
                if (_id == id) {
                    delete this.emits[channel][id];
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * emit data to a special channel
     * @param  {String} channel
     * @param  {Object} data
     */
    emit(channel, data) {
        // console.log(channel)
        for (var i in this.emits[channel]) {
            this.emits[channel][i](data);
        }
    }
}

export default Store;