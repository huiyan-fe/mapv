function Flate (container) {
    this.container = container;
    this.init();

    var that = this;

    function animate(time) {
        requestAnimationFrame(animate);
        that.render();
    }

    requestAnimationFrame(animate);
}

Flate.prototype.init = function () {
    var WIDTH = this.container.offsetWidth;
    var HEIGHT = this.container.offsetHeight;
    var camera = this.camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 0.01, 9000 );
    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 155;
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

    var scene = this.scene = new THREE.Scene();

    var renderer = this.renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    // renderer.setClearColor('rgb(1, 11, 21)', 1);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );

    this.container.appendChild( renderer.domElement );


    var floorTexture =  THREE.ImageUtils.loadTexture('images/china.png');
    var floorMaterial = new THREE.MeshBasicMaterial( { 
        map: floorTexture, 
        transparent: true,
        side: THREE.DoubleSide 
    } );
    var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);

    // LIGHT
    var light = new THREE.PointLight('rgb(50, 50, 250)');
    light.position.set(0, 0, 35);
    scene.add(light);

    var SUBDIVISIONS = 20;
    var geometry = new THREE.Geometry();
    var curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = new THREE.Vector3(0, 0, 0);
    curve.v1 = new THREE.Vector3(20, 20, 0);
    curve.v2 = new THREE.Vector3(40, 40, 0);
    for (var j = 0; j < SUBDIVISIONS; j++) {
       geometry.vertices.push( curve.getPoint(j / SUBDIVISIONS) )
    }

    var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 95 } );
    var line = this.line = new THREE.Line(geometry, material);
    console.log(line);
    scene.add(line);

    this.current = 0;

}

Flate.prototype.render = function () {

    var SUBDIVISIONS = 50;
    var geometry = new THREE.Geometry();
    var curve = new THREE.QuadraticBezierCurve3();
    curve.v0 = new THREE.Vector3(0, 0, 0);
    curve.v1 = new THREE.Vector3(25, 25, 50);
    curve.v2 = new THREE.Vector3(50, 50, 0);
    this.current += 0.01;
    if (this.current > 1) {
        this.current = 0;
    }

    for (var j = 0; j < SUBDIVISIONS; j++) {
        var percent = j / SUBDIVISIONS;
        if (percent < this.current) {
            geometry.vertices.push( curve.getPoint(percent) )
        }
    }

    this.line.geometry = geometry;

    this.renderer.render( this.scene, this.camera );
}

Flate.prototype.setDataSet = function (dataSet) {
    console.log(dataSet.get());
}

Flate.prototype.setDataSet = function (dataSet) {
    console.log(dataSet.get());
}

export default Flate;
