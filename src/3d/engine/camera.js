var Camera = function (gl) {

    this.gl = gl;
    this.radius = 30;

    this.lon = 90;
    this.lat = 45;

    var canvas = gl.canvas;

    gl.viewport(0, 0, canvas.width, canvas.height);
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 1, 1000.0);
    gl.uniformMatrix4fv(gl.uPMatrix, false, pMatrix);

    this.computerXYZ();
    this.render();
    this.init();
}

Camera.prototype.init = function () {
    this.drag();
}

Camera.prototype.render = function () {
    var mvMatrix = mat4.create();
    mat4.lookAt(mvMatrix, [this.x, this.y, this.z], [0, 0, 0], [0, 0, 1]);
    this.mvMatrix = mvMatrix;
}

Camera.prototype.drag = function () {
    var self = this;
    var canvas = this.gl.canvas;

    var startX = 0;
    var startY = 0;
    var startLon = 0;
    var startLat = 0;
    var canDrag = false;

    canvas.addEventListener('mousedown', function (e) {
        startX = e.offsetX;
        startY = e.offsetY;
        startLon = self.lon;
        startLat = self.lat;
        canDrag = true;
    });

    window.addEventListener('mousemove', function (e) {
        if (canDrag) {
            var dX = e.offsetX - startX;
            var dY = e.offsetY - startY;
            var dLon = dX / 1;
            var dLat = dY / 1;
            self.lon = (startLon + dLon) % 360;
            self.lat = startLat + dLat;
            self.lat = self.lat > 90 ? 90 : self.lat;
            self.lat = self.lat < -90 ? -90 : self.lat;
            self.computerXYZ();
            self.render();
        }
    });

    window.addEventListener('mouseup', function (e) {
        startX = 0;
        startY = 0;
        canDrag = false;
    });
}

Camera.prototype.computerXYZ = function () {
    var self = this;
    self.z = self.radius * Math.sin(self.lat * Math.PI / 180);
    var smallRadius = self.radius * Math.cos(self.lat * Math.PI / 180);
    self.x = smallRadius * Math.cos(self.lon * Math.PI / 180);
    self.y = -smallRadius * Math.sin(self.lon * Math.PI / 180);
}

export default Camera;