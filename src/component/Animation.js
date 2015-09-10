/**
 * @file Animation.js
 */
function Animation(opts) {
    var defaultOptions = {
        duration: 1000,  // 动画时长, 单位毫秒
        fps: 30,         // 每秒帧数
        delay: 0,        // 延迟执行时间，单位毫秒,如果delay为infinite则表示手动执行
        transition: Transitions.linear,
        onStop: function () {} // 调用stop停止时的回调函数
    };
    // 需要后续执行动画
    this._anis = [];

    if (opts) {
        for (var i in opts) {
            defaultOptions[i] = opts[i];
        }
    }
    this._opts = defaultOptions;

    if (isNumber(defaultOptions.delay)) {
        var me = this;
        setTimeout(function() {
            me.start();
        }, defaultOptions.delay);
    } 
    else if (defaultOptions.delay != Animation.INFINITE) {
        this.start();
    }
}
/**
 * 常量，表示动画无限循环
 */
Animation.INFINITE = "INFINITE";
/**
 * 启动动画方法
 */
Animation.prototype.start = function() {
    this._beginTime = getCurrentTime();
    this._endTime = this._beginTime + this._opts.duration;
    this._launch();
}
Animation.prototype.add = function(ani) {
    this._anis.push(ani);
}
Animation.prototype._launch = function() {
    var me = this;
    var now = getCurrentTime();

    if (now >= me._endTime) {        
        if (me._opts.render) me._opts.render(me._opts.transition(1));
        // finish()接口，时间线结束时对应的操作
        if (me._opts.finish) me._opts.finish();
        // 开始后续动画
        if (me._anis.length > 0) {
            var newAni = me._anis[0];
            newAni._anis = [].concat(me._anis.slice(1));
            newAni.start();
        }
        return;
    }

    me.schedule = me._opts.transition((now - me._beginTime) / me._opts.duration);
    // render()接口，用来实现每个脉冲所要实现的效果
    if (me._opts.render) me._opts.render(me.schedule);
    // 执行下一个动作
    if (!me.terminative) {
        me._timer = setTimeout(function () {
            me._launch()
        }, 1000 / me._opts.fps);
    }
};


/**
 * 停止当前动画
 * @type {Boolean 是否停止到动画的终止时刻}
 */
Animation.prototype.stop = function(gotoEnd) {
    this.terminative = true;
    for (var i = 0; i < this._anis.length; i ++) {
        this._anis[i].stop();
        this._anis[i] = null;
    }
    this._anis.length = 0;
    if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
    }
    this._opts.onStop(this.schedule);
    if (gotoEnd) {
        this._endTime = this._beginTime;
        this._launch();
    }
};


/**
 * 取消动画
 */
Animation.prototype.cancel = function() {
    if (this._timer) clearTimeout(this._timer);
    this._endTime = this._beginTime;
    this.schedule = 0;
};
/**
 * 设置动画结束后的回调函数
 * @param Function
 */
Animation.prototype.setFinishCallback = function(callback) {
    if (this._anis.length > 0) {
        this._anis[this._anis.length - 1]._opts.finish = callback;
    }
    else {
        this._opts.finish = callback;
    }
}
/**
 * 变换效果函数库
 */
var Transitions = {
    linear: function(t) {
        return t;
    },
    reverse: function(t) {
        return 1 - t;
    },
    easeInQuad: function(t) {
        return t * t;
    },
    easeInCubic: function(t) {
        return Math.pow(t, 3);
    },
    easeOutQuad: function(t) {
        return -(t * (t - 2));
    },
    easeOutCubic: function(t) {
        return Math.pow((t - 1), 3) + 1;
    },
    easeInOutQuad: function(t) {
        if (t < 0.5) {
            return t * t * 2;
        } else {
            return -2 * (t - 2) * t - 1;
        }
        return;
    },
    easeInOutCubic: function(t) {
        if (t < 0.5) {
            return Math.pow(t, 3) * 4;
        } else {
            return Math.pow(t - 1, 3) * 4 + 1;
        }
    },
    easeInOutSine: function(t) {
        return (1 - Math.cos(Math.PI * t)) / 2;
    }
};
Transitions['ease-in'] = Transitions.easeInQuad;
Transitions['ease-out'] = Transitions.easeOutQuad;

/**
 * 获取当前时间
 * @returns {String} 当前时间
 */
function getCurrentTime() {
    return (new Date).getTime();
}

/**
 * 是否是数字
 * @param {Mix}
 * @returns {Boolean}
 */
function isNumber(number) {
  return typeof number == "number";
}
