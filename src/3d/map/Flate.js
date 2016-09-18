
import Intensity from "../../utils/data-range/Intensity";



function Flate (container) {
    
    this.container = container;
    this.init();

    var that = this;

    this.group = new THREE.Group();

    this.center = [105, 33];

    function animate(time) {
        requestAnimationFrame(animate);

        //that.controls.update();

        that.render();
    }

    requestAnimationFrame(animate);
}

Flate.prototype.init = function () {
    this.intensity = new Intensity({
        gradient: {
            0: '#006bab',
            1: '#002841',
        },
        max: 100
    });

    var WIDTH = this.container.offsetWidth;
    var HEIGHT = this.container.offsetHeight;
    var camera = this.camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 0.01, 9000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 85;
    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

    var scene = this.scene = new THREE.Scene();

    var renderer = this.renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    /*
    var controls = this.controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    */


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
    //scene.add(floor);

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
    //scene.add(line);

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

    //this.line.geometry = geometry;

    this.renderer.render( this.scene, this.camera );
}

Flate.prototype.setDataSet = function (dataSet) {
    // create a canvas element
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;
    context.fillStyle = "rgba(255,255,50,0.75)";
    //context.shadowColor = "rgba(255,255,255,0.95)";
    //context.shadowBlur = 0;
    context.arc(25, 25, 10, 0, Math.PI * 2);
    context.fill();
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;
      
    var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
    material.transparent = true;


    var rs = dataSet.get();
    var features = rs;
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (feature.geometry.type == 'Polygon') {
            var coords = this.getCoordinates(feature.geometry.coordinates[0]);
            this.addShape(coords);
        } else if (feature.geometry.type == 'MultiPolygon') {
            for (var j = 0; j < feature.geometry.coordinates.length; j++) {
                var coords = this.getCoordinates(feature.geometry.coordinates[j][0]);
                this.addShape(coords);
            }
        } else if (feature.geometry.type == 'Point') {

            var size = canvas.width / 15 + (Math.random() * 4);
            var mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(size, size),
                material
              );
            mesh.position.set(feature.geometry.coordinates[0] - this.center[0], feature.geometry.coordinates[1] - this.center[1], 1);
            this.scene.add( mesh );
        }

        var cityname = feature.name;
        var center = feature.cp;


    }
    this.scene.add(this.group);

}


Flate.prototype.getCoordinates = function (coordinates) {
    var coords = [];
    for (var j = 0; j < coordinates.length; j++) {
        coords.push(new THREE.Vector2(coordinates[j][0] - this.center[0], coordinates[j][1] - this.center[1]));
    }
    return coords;
}

Flate.prototype.addShape = function (coords) {
    var shape = new THREE.Shape(coords);
    var geometry = new THREE.ShapeGeometry( shape );

    var color = 'rgb(' + ~~(Math.random() * 256) + ', ' + ~~(Math.random() * 256) + ', ' + ~~(Math.random() * 256) + ')';
    color = this.intensity.getColor(Math.random() * 100);
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide} ) );
    mesh.position.set( 0, 0, 0 );
    this.group.add(mesh);

    var points = shape.createPointsGeometry();
    var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: 'rgb(0, 137, 191)', linewidth: 1 } ) );
    line.position.set( 0, 0, 0.1);
    this.group.add( line );
}

export default Flate;
