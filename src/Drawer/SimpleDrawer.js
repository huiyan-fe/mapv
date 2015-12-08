/**
 * @file 普通的绘制方式
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function SimpleDrawer() {
    Drawer.apply(this, arguments);
}

util.inherits(SimpleDrawer, Drawer);

SimpleDrawer.prototype.drawMap = function(time) {
    var dataType = this.getLayer().getDataType();
    if (this.getLayer().getContext() === 'webgl') {
        if (dataType === 'polyline') { // 画线
            this.drawWebglPolyline();
        } else {
            this.drawWebglPoint();
        }
        return;
    }

    this.beginDrawMap();

    var data = this.getLayer().getData();
    var ctx = this.getCtx();
    var drawOptions = this.getDrawOptions();

    ctx.beginPath();

    var radius = this.getRadius();


    if (dataType === 'polyline' || dataType === 'polygon') { // 画线或面


        var label = drawOptions.label;
        var zoom = this.getMap().getZoom();
        var zoomUnit =  Math.pow(2, 18 - zoom);

        var arrowWidth = (10 + this.getDrawOptions().lineWidth) / zoomUnit;

        if (label) {
            if (label.font) {
                ctx.font = label.font;
            }
            var labelKey = label.key || 'count';
        }

        var animationOptions = this.getLayer().getAnimationOptions() || {};
        for (var i = 0, len = data.length; i < len; i++) {
            var geo = data[i].pgeo;
            var startIndex = 0, //开始的索引
                endIndex = geo.length - 1; //结束的索引

            if (time) { // 按时间动画展示
                var scope = animationOptions.scope || 60 * 60 * 3;
                for (var j = 0; j < geo.length; j++) {
                    if (parseFloat(geo[j][2]) < time - scope) {
                        startIndex = j;
                    }
                    endIndex = j;
                    if (parseFloat(geo[j][2]) > time) {
                        break;
                    }
                }
            }

            if (startIndex >= endIndex) {
                continue;
            }

            ctx.beginPath();
            ctx.lineWidth = this.getDrawOptions().lineWidth || 1;
            ctx.moveTo(geo[startIndex][0], geo[startIndex][1]);
            for (var j = startIndex + 1; j <= endIndex; j++) {
                ctx.lineTo(geo[j][0], geo[j][1]);
            }

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
                ctx.closePath();
            }


            ctx.beginPath();
            ctx.moveTo(geo[startIndex][0], geo[startIndex][1]);
            var skip = parseInt(zoomUnit);
            skip = Math.max(skip,1)
            ctx.lineWidth = 1;
            for (var j = startIndex + 1; j <= endIndex; j+=skip) {
                if (drawOptions.arrow) {
                    ctx.save();
                    var vLine = [geo[j][0] - geo[j - 1][0], geo[j - 1][1] - geo[j][1]];
                    var vLineDot = vLine[1];
                    var vLineLen = Math.sqrt(vLine[0] * vLine[0] + vLine[1] * vLine[1], 2);
                    var val = vLineDot / vLineLen;
            // //
                    var rad = Math.acos(val);
                    if (vLine[0] < 0) {
                        rad = -rad;
                    }
                    if (rad) {
                        arrowWidth = Math.max(arrowWidth, 5);
                        var center = [(geo[j][0] - geo[j - 1][0]) / 2, (geo[j][1] - geo[j - 1][1]) / 2];

                        ctx.translate(geo[j][0], geo[j][1]);
                        ctx.rotate(rad);
                        ctx.moveTo(arrowWidth, arrowWidth);
                        ctx.lineTo(0, 0);
                        ctx.moveTo(-arrowWidth, arrowWidth);
                        ctx.lineTo(0, 0);
                        ctx.translate(-geo[j][0], -geo[j][1]);
                        ctx.moveTo(geo[j][0], geo[j][1]);
                    }
                    ctx.restore();
                }
            }

            if (drawOptions.strokeStyle || dataType === 'polyline') {
                ctx.stroke();
            }

            if (dataType === 'polygon') {
                ctx.closePath();
                ctx.fill();
            }

            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                ctx.save();
                if (label.fillStyle) {
                    ctx.fillStyle = label.fillStyle;
                }
                var center = util.getGeoCenter(geo);
                ctx.fillText(data[i][labelKey], center[0], center[1]);
                ctx.restore();
            }
            // break;
        }


    } else { // 画点

        var icon = drawOptions.icon;

        if (drawOptions.strokeStyle || drawOptions.globalCompositeOperation) {
            // 圆描边或设置颜色叠加方式需要一个个元素进行绘制
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.beginPath();
                ctx.moveTo(item.px, item.py);
                if (icon && icon.show && icon.url) {
                    this.drawIcon(ctx, item, icon);
                } else {
                    ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
                    ctx.fill();
                }
                if (drawOptions.strokeStyle) {
                    ctx.stroke();
                }
            }

        } else {
            //普通填充可一起绘制路径，最后再统一填充，性能上会好点
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.px < 0 || item.px > ctx.canvas.width || item.py < 0 || item > ctx.canvas.height) {
                    continue;
                }
                ctx.moveTo(item.px, item.py);
                if (icon && icon.show && icon.url) {
                    this.drawIcon(ctx, item, icon);
                } else {
                    if (radius < 2) {
                        ctx.fillRect(item.px, item.py, radius * 2, radius * 2);
                    } else {
                        ctx.arc(item.px, item.py, radius, 0, 2 * Math.PI, false);
                    }
                }
            }

            ctx.fill();
        }

    }

    this.endDrawMap();
};

// 绘制icon
SimpleDrawer.prototype.drawIcon = function(ctx, item, icon) {
    var image = new Image();
    var sx = icon.sx || 0;
    var sy = icon.sy || 0;
    var px = icon.px || 0;
    var py = icon.py || 0;
    var swidth = icon.swidth || 0;
    var sheight = icon.sheight || 0;
    var width = icon.width || 0;
    var height = icon.height || 0;
    (function(item, sx, sy, swidth, sheight, width, height) {
        image.onload = function() {
            var pixelRatio = util.getPixelRatio(ctx);
            ctx.save();
            ctx.scale(pixelRatio, pixelRatio);
            ctx.drawImage(image, sx, sy, swidth, sheight, item.px - width / 2 - px, item.py - height / 2 - py, width, height);
            ctx.restore();
        }
    })(item, sx, sy, swidth, sheight, width, height);
    image.src = icon.url;
};

/**
 * 绘制动画
 */
SimpleDrawer.prototype.drawAnimation = function() {
    var layer = this.getLayer();
    var data = layer.getData();
    var dataType = layer.getDataType();
    var animationOptions = layer.getAnimationOptions();
    var animation = layer.getAnimation();
    var ctx = layer.getAnimationCtx();

    if (dataType === 'polyline') {
        if (animation === 'time') {} else {
            var step = animationOptions.step || 1;
            var size = animationOptions.size || 1;
            for (var i = 0, len = data.length; i < len; i += step) {
                var index = data[i].index;
                var pgeo = data[i].pgeo;

                var pixelRatio = util.getPixelRatio(ctx);
                ctx.save();
                ctx.scale(pixelRatio, pixelRatio);

                /* 设定渐变区域 */
                var x = pgeo[index][0];
                var y = pgeo[index][1];
                var grad = ctx.createRadialGradient(x, y, 0, x, y, size);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.9)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = animationOptions.fillStyle || grad;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                data[i].index++;
                if (data[i].index >= data[i].pgeo.length) {
                    data[i].index = 0;
                }

                ctx.restore();
            }
        }
    }
};

// 使用webgl来绘点，支持更大数据量的点
SimpleDrawer.prototype.drawWebglPoint = function() {

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

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, this.getRadius());

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
    gl.drawArrays(gl.POINTS, 0, n);
};

// 使用webgl来绘线，支持更大数据量的线
SimpleDrawer.prototype.drawWebglPolyline = function() {
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
    tmpCtx.fillStyle = this.getDrawOptions().strokeStyle || 'red';
    tmpCtx.fillRect(0, 0, 1, 1);
    var colored = tmpCtx.getImageData(0, 0, 1, 1).data;

    gl.uniform4f(uFragColor,
        colored[0] / 255,
        colored[1] / 255,
        colored[2] / 255,
        colored[3] / 255);

    gl.lineWidth(this.getDrawOptions().lineWidth || 1);

    for (var i = 0, len = data.length; i < len; i++) {
        var geo = data[i].pgeo;

        var verticesData = [];

        for (var j = 0; j < geo.length; j++) {
            var item = geo[j];

            var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
            var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;
            verticesData.push(x, y);
        }
        var vertices = new Float32Array(verticesData);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, geo.length);
    }
};
