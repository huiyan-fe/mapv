import Obj from './OBJ.js';

class Plane extends Obj {
    constructor(GL, obj) {
        super(GL, obj);

        this.width = obj.width || 10.0;
        this.height = obj.height || 10.0;

        var color = this.color;

        this.verticesColors = new Float32Array([-this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2], -this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2]]);

        this.indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
        ]);
    }


    render() {
        var gl = this.gl;
        var mvMatrix = this.GL.camera.mvMatrix;

        // 顶点/颜色缓冲区操作
        var vertexColorBuffer = this.gl.ubuffer || gl.createBuffer();
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

        // 顶点索引缓冲区
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // set mv
        this.updateOpearte();
        //
        gl.uniformMatrix4fv(this.gl.uMVMatrix, false, this.opearteBuild.result);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }

}

export default Plane;