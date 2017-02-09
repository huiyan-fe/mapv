const VSHADER_SOURCE =
   'attribute vec4 aPosition;\n' +
   'attribute vec4 aColor;\n' +
   'uniform mat4 uMVMatrix;\n' +
   'uniform mat4 uPMatrix;\n' +
   'varying vec4 vColor;\n' +
   'void main() {\n' +
   '  gl_Position = uPMatrix * uMVMatrix * aPosition;\n' +
   '  vColor = aColor;\n' +
   '}\n';

const FSHADER_SOURCE =
   '#ifdef GL_ES\n' +
   'precision mediump float;\n' +
   '#endif\n' +
   'varying vec4 vColor;\n' +
   'void main() {\n' +
   '  gl_FragColor = vColor;\n' +
   '}\n';

export {VSHADER_SOURCE, FSHADER_SOURCE}
