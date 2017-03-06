import {initShaders, getColorData} from './util';
import earcut from './earcut';

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

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    var program = initShaders(gl, vs_s, fs_s)

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var colored = getColorData(options.fillStyle || 'red')

    gl.uniform4f(uFragColor,
        colored[0] / 255,
        colored[1] / 255,
        colored[2] / 255,
        colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    var verticesArr = [];
    var trianglesArr = [];

    var maxSize = 65536;
    var indexOffset = 0;

    for (var i = 0, len = data.length; i < len; i++) {

        var flatten = earcut.flatten(data[i].geometry._coordinates || data[i].geometry.coordinates);
        var vertices = flatten.vertices;
        indexOffset = verticesArr.length / 2;
        for (var j = 0; j < vertices.length; j += 2) {
            vertices[j] = (vertices[j] - halfCanvasWidth) / halfCanvasWidth;
            vertices[j + 1] = (halfCanvasHeight - vertices[j + 1]) / halfCanvasHeight;
        }

        if ((verticesArr.length + vertices.length) / 2 > maxSize) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);
            verticesArr.length = 0;
            trianglesArr.length = 0;
            indexOffset = 0;
        }

        for (var j = 0; j < vertices.length; j++) {
            verticesArr.push(vertices[j]);
        }

        var triangles = earcut(vertices, flatten.holes, flatten.dimensions);
        for (var j = 0; j < triangles.length; j++) {
            trianglesArr.push(triangles[j] + indexOffset);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

};

export default {
    draw: draw
}
