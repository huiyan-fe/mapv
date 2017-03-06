import {
    colorTransform
} from '../tools/utility'

class Plane {

    constructor(GL, obj) {
        this.GL = GL;
        this.gl = GL.gl;
        this.obj = obj = obj || {}
        this.width = obj.width || 10.0;
        this.height = obj.height || 10.0;
        this.operate = [];
        this.opearteID = 0;
        this.opearteBuild = {};
        var color = this.color = colorTransform(obj.color);

        this.verticesColors = new Float32Array([-this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, +this.height / 2, 0.0, color[0], color[1], color[2], +this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2], -this.width / 2, -this.height / 2, 0.0, color[0], color[1], color[2], ]);

        this.indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
        ]);
    }

    translate(x, y, z) {
        var id = this.opearteID = this.opearteID;
        this.operate.push({
            id: id++,
            name: 'translate',
            value: [x || 0, y || 0, z || 0]
        })
        return this;
    }

    // useage
    // rotate(30,'x')
    // rotate(30,'y')
    // rotate(30,'z')
    // rotate(30,[1,1,0])
    rotate(rad, axis) {
        var _axis = null;
        if (axis instanceof Array && axis.length == 3) {
            _axis = axis;
        } else {
            switch (axis) {
                case 'x':
                    _axis = [1, 0, 0]
                    break;
                case 'y':
                    _axis = [0, 1, 0]
                    break;
                case 'z':
                    _axis = [0, 0, 1]
                    break;
            }
        }

        if (_axis) {
            var id = this.opearteID = this.opearteID;
            this.operate.push({
                id: id++,
                name: 'rotate',
                value: [rad, _axis]
            })
        }
        return this;
    }

    scale(x, y, z) {
        var id = this.opearteID = this.opearteID;
        this.operate.push({
            id: id++,
            name: 'scale',
            value: [x || 1, y || 1, z || 1]
        })
        return this;
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

        // set mv
        if (this.opearteBuild.ID === this.opearteID && this.opearteBuild.start === mvMatrix.toString()) {
            mvMatrix = this.opearteBuild.result
        } else {
            var start = mvMatrix.toString();
            for (var i in this.operate) {
                var type = this.operate[i].name;
                var value = this.operate[i].value;
                switch (type) {
                    case 'translate':
                        var mvNMatrix = mat4.create();
                        mat4.translate(mvNMatrix, mvMatrix, value)
                        mvMatrix = mvNMatrix;
                        break;
                    case 'rotate':
                        // console.log(mvMatrix)
                        var mvNMatrix = mat4.create();
                        mat4.rotate(mvNMatrix, mvMatrix, value[0], value[1])
                        mvMatrix = mvNMatrix;
                        break;
                    case 'scale':
                        var mvNMatrix = mat4.create();
                        mat4.scale(mvNMatrix, mvMatrix, value)
                        mvMatrix = mvNMatrix;
                        break;
                }
            }
            this.opearteBuild = {
                ID: this.opearteID,
                result: mvMatrix,
                start: start,
            }
            // console.log(mvNMatrix)
        }

        gl.uniformMatrix4fv(this.gl.uMVMatrix, false, mvMatrix);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);
    }

}

export default Plane;