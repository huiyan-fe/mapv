class X {
    constructor(dom, opt) {
        this.dom = dom;
        this.init();
    }

    init() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
        var renderer = new THREE.WebGLRenderer();

        // add controls
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;
        renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
        this.dom.appendChild(renderer.domElement);

        var geometry = new THREE.PlaneGeometry(10000, 10000, 10000 / 255, 10000 / 255);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        var cube = window.cube = new THREE.Mesh(geometry, material);
        cube.rotateX(-Math.PI / 2);
        scene.add(cube);
        camera.position.y = 500;
        camera.position.z = 1000;
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        //
        var geometry = new THREE.BoxGeometry(10, 100, 10);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.y = 100/2;
        scene.add(cube);

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            controls.update();
        }
        render();
    }
}

export default X;
