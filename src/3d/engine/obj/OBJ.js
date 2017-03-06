import {
    colorTransform
} from '../tools/utility';

class OBJ {
    constructor(GL, obj) {
        this.GL = GL;
        this.gl = GL.gl;
        this.obj = obj = obj || {}
        this.operate = [];
        this.opearteID = 0;
        this.opearteBuild = {};
        this.color = colorTransform(obj.color || '#FFF');
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

    updateOpearte() {
        var mvMatrix = this.GL.camera.mvMatrix;
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
        }
    }
}

export default OBJ;