import {initShaders, getColorData} from './util';

var vs_s = [
    'attribute vec4 a_Position;',
    'attribute float a_PointSize;',
    'void main() {',
    'gl_Position = a_Position;',
    'gl_PointSize = a_PointSize;',
    '}'
].join('');

var fs_s = [
    'precision mediump float;',
    'uniform vec4 u_FragColor;',
    'void main() {',
    'gl_FragColor = u_FragColor;',
    '}'
].join('');

function draw (gl, data, options) {

    if (!data) {
        return;
    }

    var program = initShaders(gl, vs_s, fs_s)

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    var verticesData = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        var item = data[i].geometry._coordinates;

        var x = (item[0]- halfCanvasWidth) / halfCanvasWidth;
        var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;

        if (x < -1 || x > 1 || y < -1 || y > 1) {
            continue;
        }
        verticesData.push(x, y);
        count++;
    }

    var vertices = new Float32Array(verticesData);
    var n = count; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, options._size);

    var colored = getColorData(options.fillStyle || 'red')

    gl.uniform4f(uFragColor,
        colored[0] / 255,
        colored[1] / 255,
        colored[2] / 255,
        colored[3] / 255);
    gl.drawArrays(gl.POINTS, 0, n);
};

export default {
    draw: draw
}
