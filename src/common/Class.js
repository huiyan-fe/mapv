/**
 * base Class
 *
 */

function Class () {
    this.__listeners = {}; // 存储自定义事件对象
}

util.inherits(Class, MVCObject);

/**
 * 注册对象的事件监听器
 * @grammar obj.addEventListener(type, handler[, key])
 * @param 	{string}   type         自定义事件的名称
 * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
 * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
 */
Class.prototype.addEventListener = function (type, handler) {
    typeof this.__listeners[type] != "object" && (this.__listeners[type] = []);
    this.__listeners[type].push(handler);

    return this;
}


/**
 * 移除对象的事件监听器。
 * @grammar obj.removeEventListener(type, handler)
 * @param {string}   type     事件类型
 * @param {Function} handler  要移除的事件监听函数
 * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 */
Class.prototype.removeEventListener = function (type, handler) {
    var fns = this.__listeners[type];

    if (!fns) {
        return false;
    }

    for (var i = fns.length; i >= 0; i--) {
        if (fns[i] === handler) {
            fns.splice(i, 1);
        }
    }

    return this;
};

/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行
 * @grammar obj.dispatchEvent(event, options)
 * @param {String} 事件名称
 * @param {Object} options 扩展参数
 */
Class.prototype.dispatchEvent = function (type, options) {
    var event = util.extend({}, options);

    var fns = this.__listeners[type];

    if (!fns) {
        return false;
    }

    for (var i = fns.length - 1; i >= 0; i--) {
        fns[i].call(this, event);
    }

    return this;
    
}

Class.prototype.dispose = function () {
}

