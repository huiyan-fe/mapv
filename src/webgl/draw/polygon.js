import earcut from './earcut';

function draw(gl, data, options) {

    if (!data) {
        return;
    }

    var vs, fs, vs_s, fs_s;

    vs = gl.createShader(gl.VERTEX_SHADER);
    fs = gl.createShader(gl.FRAGMENT_SHADER);

    vs_s = [
        'attribute vec4 a_Position;',
        'void main() {',
        'gl_Position = a_Position;',
        'gl_PointSize = 30.0;',
        '}'
    ].join('');

    fs_s = [
        'precision mediump float;',
        'uniform vec4 u_FragColor;',
        'void main() {',
        'gl_FragColor = u_FragColor;',
        '}'
    ].join('');

    var program = gl.createProgram();
    gl.shaderSource(vs, vs_s);
    gl.compileShader(vs);
    gl.shaderSource(fs, fs_s);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

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
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = options.fillStyle || 'red';
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor,
        colored[0] / 255,
        colored[1] / 255,
        colored[2] / 255,
        colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    for (var i = 0, len = data.length; i < len; i++) {
        var tmp = earcut.flatten(data[i].geometry._coordinates);
        var vertices = tmp.vertices;
        for (var j = 0; j < vertices.length; j += 2) {
            vertices[j] = (vertices[j] - halfCanvasWidth) / halfCanvasWidth;
            vertices[j + 1] = (halfCanvasHeight - vertices[j + 1]) / halfCanvasHeight;
        }
        var triangles = earcut(vertices, tmp.holes, tmp.dimensions);

        vertices = new Float32Array(vertices);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT,0);
    }

};

export default {
    draw: draw
}
