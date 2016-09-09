/**
 * Abstract handler for animator steps
 */
var AnimatorStepsRange = function(start, end) {
  if (start < 0) throw new Error('start must be a positive number');
  if (start >= end) throw new Error('start must be smaller than end');

  this.start = start;
  this.end = end;
};

AnimatorStepsRange.prototype = {

  diff: function() {
    return this.end - this.start;
  },

  isLast: function(step) {
    // round step into an integer, to be able to compare number as expected (also converts bad input to 0)
    return (step | 0) === this.end;
  }
};

function clamp(a, b) {
    return function(t) {
      return Math.max(Math.min(t, b), a);
    };
}

function invLinear(a, b) {
    var c = clamp(0, 1.0);
    return function(t) {
      return c((t - a)/(b - a));
    };
}

function linear(a, b) {
    var c = clamp(a, b);
    function _linear(t) {
      return c(a*(1.0 - t) + t*b);
    }

    _linear.invert = function() {
      return invLinear(a, b);
    };

    return _linear;
}


var global = window;

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
   *    animationDuration in seconds
   *    animationDelay in seconds
   */
function Animator(callback, options) {
    if(!options.steps) {
      throw new Error("steps option missing")
    }
    this.options = options;
    this.running = false;
    this._tick = this._tick.bind(this);
    this._t0 = +new Date();
    this.callback = callback;
    this._time = 0.0;
    this.itemsReady = false;

    this.options.animationDelay = 0;
    this.options.maxDelta = 0.2;
    this.options.loop = options.loop === undefined ? true : options.loop;

    this.steps(options.steps);
    if (options.stepsRange && options.stepsRange.start !== undefined && options.stepsRange.end !== undefined) {
        this.stepsRange(options.stepsRange.start, options.stepsRange.end);
    }
}

Animator.prototype = {

    start: function() {
        this.running = true;
        requestAnimationFrame(this._tick);
        this.options.onStart && this.options.onStart();
        if (this.stepsRange().diff() === 1) {
          this.running = false;
        }
    },

    isRunning: function() {
        return this.running;
    },

    stop: function() {
        this.pause();
        this.time(this.stepsRange().start);
        this.options.onStop && this.options.onStop();
    },

    // real animation time
    time: function(_) {
        if (!arguments.length) return this._time;
        this._time = _;
        var t = this.range(this.domain(this._time));
        this.callback(t);
    },

    toggle: function() {
        if (this.running) {
            this.pause()
        } else {
            this.start()
        }
    },

    rescale: function() {
        this.domainInv = linear(this.options.animationDelay, this.options.animationDelay + this.options.animationDuration);
        this.domain = this.domainInv.invert();
        this.range = linear(0, this._defaultStepsRange.end);
        this.rangeInv = this.range.invert();
        this.time(this._time);
        this.running? this.start(): this.pause();
        return this;
    },

    duration: function(_) {
        if (!arguments.length)  return this.options.animationDuration;
        this.options.animationDuration = _;
        if (this.time() > _) {
            this.time(0);
        }
        this.rescale();
        return this;
    },

    steps: function(_) {
        this.options.steps = _;
        this._defaultStepsRange = new AnimatorStepsRange(0, _);
        return this.rescale();
    },

    // Returns or sets a (custom) steps range
    // Setting a steps range must be within the full range
    stepsRange: function(start, end) {
        if (arguments.length === 2) {
            if (start < this._defaultStepsRange.start) throw new Error('start must be within default steps range');
            if (end > this._defaultStepsRange.end) throw new Error('end must be within default steps range');

            this._customStepsRange = new AnimatorStepsRange(start, end);
            this.options.onStepsRange && this.options.onStepsRange();

            // Change current step if it's outside the new custom range
            var step = this.step() | 0; // round to an integer
            if (step < start || step > end) {
              this.step(start);
            }
        }
        return this._customStepsRange || this._defaultStepsRange;
    },

    removeCustomStepsRange: function() {
        this._customStepsRange = undefined;
        this.options.onStepsRange && this.options.onStepsRange();
    },

    step: function(s) {
        if(arguments.length === 0) return this.range(this.domain(this._time));
        this._time = this.domainInv(this.rangeInv(s));
    },

    pause: function() {
        this.running = false;
        cancelAnimationFrame(this._tick);
        this.options.onPause && this.options.onPause();
    },

    _tick: function() {
        var t1 = +new Date();
        var delta = (t1 - this._t0)*0.001;
        // if delta is really big means the tab lost the focus
        // at some point, so limit delta change
        delta = Math.min(this.options.maxDelta, delta);
        this._t0 = t1;
        this._time += delta;

        var stepsRange = this.stepsRange();
        if (stepsRange.isLast(this.step())) {
            if(!this.options.loop){
                // set time to max time
                this.time(this.options.animationDuration);
                this.pause();
            } else {
                this.step(stepsRange.start);
            }
        }
        if(this.running) {
            this.time(this._time);
            requestAnimationFrame(this._tick);
        }
    }

};

export default Animator;
