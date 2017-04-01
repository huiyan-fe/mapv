var global = typeof window === 'undefined' ? {} : window;

var devicePixelRatio = global.devicePixelRatio;

export {devicePixelRatio};
export {global as window};
export default global;
