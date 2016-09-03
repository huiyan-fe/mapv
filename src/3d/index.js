class X {
    constructor(dom, opt) {
        this.dom = dom;
        this.opt = opt;
        this.init();
    }

    init() {
        var zoom = 1;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10e7);
        var renderer = new THREE.WebGLRenderer();

        // add controls
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
        renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        this.dom.appendChild(renderer.domElement);

        var geometry = new THREE.PlaneGeometry(80 * zoom, 50 * zoom, 10, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x585858,
            wireframe: true
        });
        var cube = window.cube = new THREE.Mesh(geometry, material);
        cube.rotateX(-Math.PI / 2);
        scene.add(cube);
        camera.position.y = 50 * zoom;
        camera.position.z = 50 * zoom;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            controls.update();
        }
        render();

        var sizeZoom = this.opt.grid.size * zoom;

        var gradeData = {};
        var min = Infinity;
        var max = -Infinity;
        for (var i in data) {
            var x = parseInt(data[i].lng * zoom / sizeZoom) * sizeZoom;
            var y = parseInt(data[i].lat * zoom / sizeZoom) * sizeZoom;
            gradeData[x + '_' + y] = gradeData[x + '_' + y] || 0;
            gradeData[x + '_' + y]++;
            max = Math.max(max, gradeData[x + '_' + y]);
            min = Math.min(min, gradeData[x + '_' + y]);
        }

        // color~
        var color = getColor();

        var lines = new THREE.Object3D();
        for (var i in gradeData) {
            var colorPersent = max == min ? 0 : (gradeData[i] - min) / (max - min);
            var colorInedx = parseInt(colorPersent * (color.length / 4)) - 1;
            colorInedx = colorInedx < 0 ? 0 : colorInedx;
            var r = color[colorInedx * 4].toString(16);
            r = r.length < 2 ? '0' + r : r;
            var g = color[colorInedx * 4 + 1].toString(16);
            g = g.length < 2 ? '0' + g : g;
            var b = color[colorInedx * 4 + 2].toString(16);
            b = b.length < 2 ? '0' + b : b;

            var height = gradeData[i] * 1.5 ;
            var geometry = new THREE.BoxGeometry(sizeZoom * 0.9, height, sizeZoom * 0.9);
            var material = new THREE.MeshBasicMaterial({
                color: '#' + r + g + b
            });
            var cube = new THREE.Mesh(geometry, material);
            var pos = i.split('_');
            cube.position.x = (pos[0] - this.opt.center.lng * zoom);
            cube.position.y = height / 2;
            cube.position.z = (this.opt.center.lat * zoom - pos[1]);
            lines.add(cube);
        }
        scene.add(lines);
    }
}


function getColor() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(1, "#F00");
    gradient.addColorStop(0.6, "#FFFC00");
    gradient.addColorStop(0.3, "#00FF1D");
    gradient.addColorStop(0, "#000BFF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    var data = ctx.getImageData(0, 0, 256, 1);
    return data.data;
}

export default X;
