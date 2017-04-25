import Obj from './OBJ.js';
import {
    colorTransform
} from '../tools/utility'

class Path extends Obj {
    constructor(GL, obj) {
        super(GL, obj);

        let width = this.width = obj.size.width || 10.0;
        let height = this.height = obj.size.height || 10.0;

        var paths = obj.path;

        let posX = obj.pos[0];
        let posY = obj.pos[1];
        let length = obj.size.length;
        var color = this.color = colorTransform(obj.color);
        this.verticesColors = new Float32Array([
            posX - width / 2, posY - height / 2, 0, color[0], color[1], color[2],
            posX + width / 2, posY - height / 2, 0, color[0], color[1], color[2],
            posX + width / 2, posY + height / 2, 0, color[0], color[1], color[2],
            posX - width / 2, posY + height / 2, 0, color[0], color[1], color[2],
            posX - width / 2, posY - height / 2, length, color[0], color[1], color[2],
            posX + width / 2, posY - height / 2, length, color[0], color[1], color[2],
            posX + width / 2, posY + height / 2, length, color[0], color[1], color[2],
            posX - width / 2, posY + height / 2, length, color[0], color[1], color[2],
        ]);
        this.indices = new Uint8Array([
            3, 0, 2, 1, 5, 6, 4, 7, 0, 3, 2, 7, 6, 4, 5, 0, 1
        ]);



        // this.verticesColors = new Float32Array([-this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2], -this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2]]);

        // this.indices = new Uint8Array([
        //     0, 1, 2, 0, 2, 3,
        // ]);
    }

    render() {
        var gl = this.gl;
        var mvMatrix = this.GL.camera.mvMatrix;

        // 顶点/颜色缓冲区操作
        var vertexColorBuffer = this.gl.ubuffer;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // 顶点索引缓冲区
        var indexBuffer = this.gl.ibuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // set mv
        this.updateOpearte();
        //
        gl.uniformMatrix4fv(this.gl.uMVMatrix, false, this.opearteBuild.result);
        gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }

}

export default Path;