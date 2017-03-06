import Con from './sys';

var Camera = function (gl) {

    this.gl = gl;
    this.radius = 400;

    this.lon = 90;
    this.lat = 45;

    this.transX = 100 * Con.longitudeLatitudeScale;
    this.transY = 30 * Con.longitudeLatitudeScale;

    var canvas = gl.canvas;

    gl.viewport(0, 0, canvas.width, canvas.height);
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 1, 100000.0);
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
    this.mvMatrix = mat4.translate(mat4.create(), mvMatrix, [-this.transX, -this.transY, 0])
}

Camera.prototype.drag = function () {
    var self = this;
    var canvas = this.gl.canvas;

    var startX = 0;
    var startY = 0;
    var which = 1;
    var startLon = 0;
    var startTransX = 0;
    var startTransY = 0;
    var startLat = 0;
    var canDrag = false;



    canvas.addEventListener('mousewheel', function (e) {
        self.radius -= event.deltaY;
        self.radius = Math.max(10, self.radius);
        self.radius = Math.min(100000, self.radius);
        self.computerXYZ();
        self.render();
    });

    canvas.addEventListener('mousedown', function (e) {
        startX = e.offsetX;
        startY = e.offsetY;
        startLon = self.lon;
        startLat = self.lat;
        which = e.which;
        startTransX = self.transX;
        startTransY = self.transY;
        canDrag = true;
        window.event.returnValue = false;
        return false;
    });

    canvas.addEventListener('contextmenu', () => {
        window.event.returnValue = false;
        return false;
    })

    window.addEventListener('mousemove', function (e) {
        if (canDrag) {
            var dX = e.offsetX - startX;
            var dY = e.offsetY - startY;
            if (e.which === 1) {
                var dLon = dX / 1;
                var dLat = dY / 1;
                self.lon = (startLon + dLon) % 360;
                self.lat = startLat + dLat;
                self.lat = Math.min(90, self.lat);
                self.lat = Math.max(-90, self.lat);
                self.lat = Math.max(10, self.lat);
                // console.log(self.lat, self.lon)

            } else {
                self.transX = (startTransX - dX * Con.longitudeLatitudeScale / 10);
                self.transY = (startTransY + dY * Con.longitudeLatitudeScale / 10);
            }
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