function Event() {
    this._subscribers = {};  // event subscribers
}

/**
 * Subscribe to an event, add an event listener
 * @param {String} event        Event name. Available events: 'put', 'update',
 *                              'remove'
 * @param {function} callback   Callback method. Called with three parameters:
 *                                  {String} event
 *                                  {Object | null} params
 *                                  {String | Number} senderId
 */
Event.prototype.on = function(event, callback) {
  var subscribers = this._subscribers[event];
  if (!subscribers) {
    subscribers = [];
    this._subscribers[event] = subscribers;
  }

  subscribers.push({
    callback: callback
  });
};

/**
 * Unsubscribe from an event, remove an event listener
 * @param {String} event
 * @param {function} callback
 */
Event.prototype.off = function(event, callback) {
  var subscribers = this._subscribers[event];
  if (subscribers) {
    //this._subscribers[event] = subscribers.filter(listener => listener.callback != callback);
    for (var i = 0; i < subscribers.length; i++) {
        if (subscribers[i].callback == callback) {
            subscribers.splice(i, 1);
            i--;
        }
    }
  }
};

/**
 * Trigger an event
 * @param {String} event
 * @param {Object | null} params
 * @param {String} [senderId]       Optional id of the sender.
 * @private
 */
Event.prototype._trigger = function (event, params, senderId) {
  if (event == '*') {
    throw new Error('Cannot trigger event *');
  }

  var subscribers = [];
  if (event in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers[event]);
  }
  if ('*' in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers['*']);
  }

  for (var i = 0, len = subscribers.length; i < len; i++) {
    var subscriber = subscribers[i];
    if (subscriber.callback) {
      subscriber.callback(event, params, senderId || null);
    }
  }
};

export default Event;
