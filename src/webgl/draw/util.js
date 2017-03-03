export function createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

export function initShaders(gl, vs_source, fs_source) {

    var vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
     
    var glProgram = gl.createProgram();
     
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
 
    gl.useProgram(glProgram);

    return glProgram;
}

export function getColorData(color) {
    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = color;
    tmpCtx.fillRect(0, 0, 1, 1);
    return tmpCtx.getImageData(0, 0, 1, 1).data;
}
