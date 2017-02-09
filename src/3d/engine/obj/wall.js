import {
    colorTransform
} from '../tools/utility'

class Wall {
    constructor(GL, obj) {
        console.log(obj.path)
        this.GL = GL;
        this.gl = GL.gl;
        this.obj = obj = obj || {}
        this.width = obj.thickness || 0.20;
        this.height = obj.height || 3.0;

        this.operate = [];
        this.opearteID = 0;
        this.opearteBuild = {};
        var color = this.color = colorTransform(obj.color);

        this.verticesColors = new Float32Array([-this.width / 2, +this.height / 2, 0.10, color[0], color[1], color[2], +this.width / 2, +this.height / 2, 0.10, color[0], color[1], color[2], +this.width / 2, -this.height / 2, 0.10, color[0], color[1], color[2], -this.width / 2, -this.height / 2, 0.10, color[0], color[1], color[2], ]);


        this.indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
        ]);

        for (var i = 0; i < obj.path.length; i += 2) {
            if (i === 0) {

            }
            console.log(i)
        }
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

        // 顶点索引缓冲区
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.uniformMatrix4fv(this.gl.uMVMatrix, false, mvMatrix);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }
}


export default Wall;