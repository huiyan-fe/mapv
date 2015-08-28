/**
 * @file 普通的绘制方式
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function SimpleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(SimpleDrawer, Drawer);

SimpleDrawer.prototype.drawMap = function () {
    if (this.getLayer().getContext() === 'webgl') {
        this.drawWebglMap();
        return;
    }

    this.beginDrawMap();

    var data = this.getLayer().getData();

    var ctx = this.getCtx();

    var drawOptions = this.getDrawOptions();
    console.log('????',drawOptions)

    ctx.beginPath();

    if (drawOptions.globalCompositeOperation) {
        ctx.globalCompositeOperation = drawOptions.globalCompositeOperation;
    }

    var radius = this.getRadius();

    var dataType = this.getLayer().getDataType();

    if (dataType === 'polyline' || dataType === 'polygon') { // 画线或面

        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            ctx.beginPath();
            ctx.moveTo(geo[0][0], geo[0][1]);
            for (var j = 1; j < geo.length; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
            }

            if (dataType === 'polygon') {
                ctx.closePath();
                ctx.fill();
            }

        }


    } else { // 画点

        if (drawOptions.strokeStyle || drawOptions.globalCompositeOperation) {
            // 圆描边或设置颜色叠加方式需要一个个元素进行绘制
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(item.px, item.py);
                ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
            }

        } else {
            //普通填充可一起绘制路径，最后再统一填充，性能上会好点
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.moveTo(item.px, item.py);
                ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
            }

            ctx.fill();
        }

    }

    this.endDrawMap();
}

/**
 * 绘制动画
 */
SimpleDrawer.prototype.drawAnimation = function () {
    var data = this.getLayer().getData();
    var dataType = this.getLayer().getDataType();
    var animationOptions = this.getLayer().getAnimationOptions();
    var ctx = this.getLayer().getAnimationCtx();

    if (dataType === 'polyline') {
        for (var i = 0, len = data.length; i < len; i++) {
            var index = data[i].index;
            var pgeo = data[i].pgeo;

            /* 设定渐变区域 */
            var x = pgeo[index][0];
            var y = pgeo[index][1];
            var grad  = ctx.createRadialGradient(x, y, 0, x, y, animationOptions.size);
            grad.addColorStop(0,'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.4,'rgba(255, 255, 255, 0.9)');
            grad.addColorStop(1,'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.arc(x, y, animationOptions.size, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            data[i].index++;
            if (data[i].index >= data[i].pgeo.length) {
                data[i].index = 0;
            }
        }
    }
}

// 使用webgl来绘点，支持更大数据量的点
SimpleDrawer.prototype.drawWebglMap = function () {

    var data = this.getLayer().getData();

    if (!data) {
        return;
    }

    var gl = this.getCtx();

    var vs, fs, vs_s, fs_s;

    vs = gl.createShader(gl.VERTEX_SHADER);
    fs = gl.createShader(gl.FRAGMENT_SHADER);

    vs_s = [
        'attribute vec4 a_Position;',
        'attribute float a_PointSize;',
        'void main() {',
            'gl_Position = a_Position;',
            'gl_PointSize = a_PointSize;',
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
        var item = data[i];

        var x = (item.px - halfCanvasWidth) / halfCanvasWidth;
        var y = (halfCanvasHeight - item.py) / halfCanvasHeight;

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
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, this.getRadius());
    console.log(this.getRadius());

    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = this.getDrawOptions().fillStyle;
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor,
    colored[0] / 255,
    colored[1] / 255,
    colored[2] / 255,
    colored[3] / 255);
    gl.drawArrays(gl.POINTS, 0 , n);
}
