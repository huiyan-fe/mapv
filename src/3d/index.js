class X {
    constructor(dom, opt) {
        this.dom = dom;
        this.opt = opt;
        this.init();
    }

    init() {
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

        var geometry = new THREE.PlaneGeometry(80, 50, 10 , 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x585858,
            wireframe: true
        });
        var cube = window.cube = new THREE.Mesh(geometry, material);
        cube.rotateX(-Math.PI / 2);
        scene.add(cube);
        camera.position.y = 50;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            controls.update();
        }
        render();

        var sizeZoom = 1 / this.opt.grid.size;
        var geoZoom = 1;

        var gradeData = {};
        var min = 999999;
        var max = 0;
        for (var i in data) {
            var x = parseInt(data[i].lng * sizeZoom);
            var y = parseInt(data[i].lat * sizeZoom);
            gradeData[x + '_' + y] = gradeData[x + '_' + y] || 0;
            gradeData[x + '_' + y]++;
            max = Math.max(max, gradeData[x + '_' + y]);
            min = Math.min(min, gradeData[x + '_' + y]);
        }

        // color
        var color = getColor();

        var lines = new THREE.Object3D();
        for (var i in gradeData) {
            var colorPersent = (gradeData[i] - min) / (max - min);
            var colorInedx = parseInt(colorPersent * (color.length / 4)) - 1;
            colorInedx = colorInedx < 0 ? 0 : colorInedx;
            var r = color[colorInedx * 4].toString(16);
            r = r.length < 2 ? '0' + r : r;
            var g = color[colorInedx * 4 + 1].toString(16);
            g = g.length < 2 ? '0' + g : g;
            var b = color[colorInedx * 4 + 2].toString(16);
            b = b.length < 2 ? '0' + b : b;

            var height = geoZoom * gradeData[i];
            var geometry = new THREE.BoxGeometry(geoZoom * 0.8, height, geoZoom * 0.8);
            var material = new THREE.MeshBasicMaterial({
                color: '#' + r + g + b
            });
            var cube = new THREE.Mesh(geometry, material);
            var pos = i.split('_');
            cube.position.x = (pos[0] / sizeZoom - this.opt.center.lng) * geoZoom;
            cube.position.y = height / 2;
            cube.position.z = (this.opt.center.lat - pos[1] / sizeZoom) * geoZoom;
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
