import Obj from './OBJ.js';

class Plane extends Obj {
    constructor(GL, obj) {
        super(GL, obj);

        this.width = obj.width || 10.0;
        this.height = obj.height || 10.0;

        var color = this.color;
        var paths = obj.path;
        this.verticesColors = [];
        paths.forEach((point) => {
            this.verticesColors = this.verticesColors.concat(point.concat(color));
        });
        this.verticesColors = new Float32Array(this.verticesColors);
    }

    render() {
        var gl = this.gl;
        var mvMatrix = this.GL.camera.mvMatrix;

        // 顶点/颜色缓冲区操作
        var vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticesColors, gl.STATIC_DRAW);
        //
        var FSIZE = this.verticesColors.BYTES_PER_ELEMENT;
        //
        gl.vertexAttribPointer(gl.aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0);
        gl.enableVertexAttribArray(gl.aPosition);
        //
        gl.vertexAttribPointer(gl.aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
        gl.enableVertexAttribArray(gl.aColor);

        // set mv
        this.updateOpearte();
        //

        gl.uniformMatrix4fv(this.gl.uMVMatrix, false, mvMatrix);
        gl.drawArrays(gl.LINE_STRIP, 0, this.verticesColors.length / 6);
    }

}

export default Plane;