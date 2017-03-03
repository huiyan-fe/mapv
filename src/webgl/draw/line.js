import {initShaders, getColorData} from './util';

var vs_s = [
    'attribute vec4 a_Position;',
    'void main() {',
    'gl_Position = a_Position;',
    'gl_PointSize = 30.0;',
    '}'
].join('');

var fs_s = [
    'precision mediump float;',
    'uniform vec4 u_FragColor;',
    'void main() {',
    'gl_FragColor = u_FragColor;',
    '}'
].join('');

function draw(gl, data, options) {

    if (!data) {
        return;
    }

    var program = initShaders(gl, vs_s, fs_s)

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var colored = getColorData(options.strokeStyle || 'red')

    gl.uniform4f(uFragColor,
        colored[0] / 255,
        colored[1] / 255,
        colored[2] / 255,
        colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    for (var i = 0, len = data.length; i < len; i++) {
        var _geometry = data[i].geometry._coordinates;

        var verticesData = [];

        for (var j = 0; j < _geometry.length; j++) {
            var item = _geometry[j];

            var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
            var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;
            verticesData.push(x, y);
        }
        var vertices = new Float32Array(verticesData);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, _geometry.length);
    }

};

export default {
    draw: draw
}
