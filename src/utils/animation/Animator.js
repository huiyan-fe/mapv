/**
 * Abstract handler for animator steps
 */

var global = typeof window === 'undefined' ? {} : window;

import TWEEN from './Tween';

var requestAnimationFrame = global.requestAnimationFrame
    || global.mozRequestAnimationFrame
    || global.webkitRequestAnimationFrame
    || global.msRequestAnimationFrame
    || function(callback) { return global.setTimeout(callback, 1000 / 60); };

var cancelAnimationFrame = global.cancelAnimationFrame
    || global.mozCancelAnimationFrame
    || global.webkitCancelAnimationFrame
    || global.msCancelAnimationFrame
    || function(id) { clearTimeout(id); };

  /**
   * options:
   *    duration in seconds
   *    delay in seconds
   */
function Animator(callback, options) {

    this.running = false;
    this.callback = callback;

    this.setOptions(options);

    this._tick = this._tick.bind(this);

}

Animator.prototype = {

    setOptions: function(options) {
        this.options = options;
        options.stepsRange = options.stepsRange || {
            start: 0,
            end: 100
        };

        this.duration = options.duration || 10; // 单位秒

        this.stepsRange = options.stepsRange;
        this._add = (this.stepsRange.end - this.stepsRange.start) / (this.duration * 60);
        this._time = this.stepsRange.start;
    },

    start: function() {
        

        this.running = true;
        requestAnimationFrame(this._tick);
        this.options.onStart && this.options.onStart();
    },

    _tick: function () {
        this._time += this._add;
        if (this._time > this.stepsRange.end) {
            this._time = this.stepsRange.start;
        }
        this.callback && this.callback(this._time);
        if (this.running) {
            requestAnimationFrame(this._tick);
        }
    },

    isRunning: function() {
        return this.running;
    },

    stop: function() {
        this.pause();
        this._time = this.stepsRange.start;
        this.options.onStop && this.options.onStop();
    },

    toggle: function() {
        if (this.running) {
            this.pause()
        } else {
            this.start()
        }
    },

    pause: function() {
        this.running = false;
        cancelAnimationFrame(this._tick);
        this.options.onPause && this.options.onPause();
    }

};

export default Animator;
