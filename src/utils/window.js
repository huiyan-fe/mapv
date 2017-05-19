var global = typeof window === 'undefined' ? {} : window;

var devicePixelRatio = global.devicePixelRatio || 1;

export {devicePixelRatio};
export {global as window};
export default global;
