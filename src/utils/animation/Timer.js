/**
 * Timer
 * @author kyle / http://nikai.us/
 */

class Timer {

    constructor(callback, options) {
        this._call = callback;
        this._runing = false;
        this.start();
    }

    start() {
        this._runing = true;
        requestAnimationFrame(this._launch.bind(this));
    }

    stop() {
        this._runing = false;
    }

    _launch(timestamp) {
        if (this._runing) {
            this._call && this._call(timestamp);
            requestAnimationFrame(this._launch.bind(this));
        }
    }

}

export default Timer;
