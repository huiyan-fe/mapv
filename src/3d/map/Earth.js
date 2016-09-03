var flights = [
[43.061306,74.477556,40.608989,72.793269]
];

var index = 100;
while (index--) {
    flights.push([19.670399 + Math.random() * 35, 78.895343 + Math.random() * 50, 19.670399 + Math.random() * 35, 78.895343 + Math.random() * 50]);
}

var positions, sizes;
var start_flight_idx = 0;
var end_flight_idx = flights.length;
var flight_path_splines = [];
var flight_distance = [];
var flight_path_lines;
var flight_track_opacity = 0.32;
var flight_point_cloud_geom;
var flight_point_start_time = [];
var flight_point_end_time = [];
var flight_point_speed_changed = false;
var flight_point_speed_scaling = 5.0;
var flight_point_speed_min_scaling = 1.0;
var flight_point_speed_max_scaling = 25.0;


function Earth (container) {

    this.container = container;
    this.init();

    var that = this;

    function animate(time) {
        requestAnimationFrame(animate);
        that.render();
    }

    requestAnimationFrame(animate);
}

Earth.prototype.init = function () {
    var WIDTH = this.container.offsetWidth;
    var HEIGHT = this.container.offsetHeight;
    var camera = this.camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 0.01, 9000 );
    camera.position.z = 1.0;

    var scene = this.scene = new THREE.Scene();

    var renderer = this.renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    // renderer.setClearColor('rgb(1, 11, 21)', 1);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );

    this.container.appendChild( renderer.domElement );


    // LIGHT
    /*
    var light = new THREE.PointLight('rgb(50, 50, 250)');
    light.position.set(0, 0, 35);
    scene.add(light);
    */

    scene.add(new THREE.AmbientLight(0x777777));

    var light1 = new THREE.DirectionalLight(0xffffff, 0.2);
    light1.position.set(5, 3, 5);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 0.2);
    light2.position.set(5, 3, -5);
    scene.add(light2);

    var earth_img, elevation_img, water_img;
    var radius = 0.5;
    var segments = 64;
    earth_img = THREE.ImageUtils.loadTexture('images/earth_airports.png', THREE.UVMapping, function() {
        elevation_img = THREE.ImageUtils.loadTexture('images/elevation.jpg', THREE.UVMapping, function() {
            water_img = THREE.ImageUtils.loadTexture('images/water.png', THREE.UVMapping, function() {
                var earth = new THREE.Mesh(
                    new THREE.SphereGeometry(radius, segments, segments),
                    new THREE.MeshPhongMaterial({
                            map: earth_img,
                            bumpMap: elevation_img,
                            bumpScale: 0.01,
                            specularMap: water_img,
                            specular: new THREE.Color('grey')
                        })
                    );
                earth.rotation.y = 170 * (Math.PI / 180);
                earth.rotation.x = 30 * (Math.PI / 180);
                scene.add(earth);

                generateControlPoints(radius);

                flight_path_lines = flightPathLines();
                earth.add(flight_path_lines);

                earth.add(flightPointCloud());

            });
        });
    });

}

Earth.prototype.render = function () {
    update_flights();

    this.renderer.render( this.scene, this.camera );
}

Earth.prototype.setDataSet = function (dataSet) {
    console.log(dataSet.get());

}

function generateControlPoints(radius) {
    for (var f = start_flight_idx; f < end_flight_idx; ++f) {

        var start_lat = flights[f][0];
        var start_lng = flights[f][1];
        var end_lat = flights[f][2];
        var end_lng = flights[f][3];

        var max_height = Math.random() * 0.04;

        var points = [];
        var spline_control_points = 8;
        for (var i = 0; i < spline_control_points + 1; i++) {
            var arc_angle = i * 180.0 / spline_control_points;
            var arc_radius = radius + (Math.sin(arc_angle * Math.PI / 180.0)) * max_height;
            var latlng = latlngInterPoint(start_lat, start_lng, end_lat, end_lng, i / spline_control_points);

            var pos = xyzFromLatLng(latlng.lat, latlng.lng, arc_radius);

            points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }

        var spline = new THREE.SplineCurve3(points);

        flight_path_splines.push(spline);
        
        var arc_length = spline.getLength();        
        flight_distance.push(arc_length);

        setFlightTimes(f);

    }
}

function latlngInterPoint(lat1, lng1, lat2, lng2, offset) {
    lat1 = lat1 * Math.PI / 180.0;
    lng1 = lng1 * Math.PI / 180.0;
    lat2 = lat2 * Math.PI / 180.0;
    lng2 = lng2 * Math.PI / 180.0;

    var d = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng1 - lng2) / 2), 2)));
    var A = Math.sin((1 - offset) * d) / Math.sin(d);
    var B = Math.sin(offset * d) / Math.sin(d);
    var x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    var y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    var z = A * Math.sin(lat1) + B * Math.sin(lat2);
    var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
    var lng = Math.atan2(y, x) * 180 / Math.PI;

    return {
        lat: lat,
        lng: lng
    };
}

function xyzFromLatLng(lat, lng, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (360 - lng) * Math.PI / 180;

    return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
    };
}

function flightPathLines() {

    var num_control_points = 32;

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        vertexColors: THREE.VertexColors,
        transparent: true,
        opacity: flight_track_opacity,
        depthTest: true,
        depthWrite: false,
        linewidth: 1.0001
    });
    var line_positions = new Float32Array(flights.length * 3 * 2 * num_control_points);
    var colors = new Float32Array(flights.length * 3 * 2 * num_control_points);

    for (var i = start_flight_idx; i < end_flight_idx; ++i) {

        for (var j = 0; j < num_control_points - 1; ++j) {

            var start_pos = flight_path_splines[i].getPoint(j / (num_control_points - 1));
            var end_pos = flight_path_splines[i].getPoint((j + 1) / (num_control_points - 1));

            line_positions[(i * num_control_points + j) * 6 + 0] = start_pos.x;
            line_positions[(i * num_control_points + j) * 6 + 1] = start_pos.y;
            line_positions[(i * num_control_points + j) * 6 + 2] = start_pos.z;
            line_positions[(i * num_control_points + j) * 6 + 3] = end_pos.x;
            line_positions[(i * num_control_points + j) * 6 + 4] = end_pos.y;
            line_positions[(i * num_control_points + j) * 6 + 5] = end_pos.z;

            colors[(i * num_control_points + j) * 6 + 0] = 1.0;
            colors[(i * num_control_points + j) * 6 + 1] = 0.4;
            colors[(i * num_control_points + j) * 6 + 2] = 1.0;
            colors[(i * num_control_points + j) * 6 + 3] = 1.0;
            colors[(i * num_control_points + j) * 6 + 4] = 0.4;
            colors[(i * num_control_points + j) * 6 + 5] = 1.0;
        }
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(line_positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    return new THREE.Line(geometry, material, THREE.LinePieces);
}

function flightPointCloud() {
    flight_point_cloud_geom = new THREE.BufferGeometry();

    var num_points = flights.length;

    positions = new Float32Array(num_points * 3);
    var colors = new Float32Array(num_points * 3);
    var sizes = new Float32Array(num_points);

    for (var i = 0; i < num_points; i++) {
        positions[3 * i + 0] = 0;
        positions[3 * i + 1] = 0;
        positions[3 * i + 2] = 0;

        colors[3 * i + 0] = Math.random();
        colors[3 * i + 1] = Math.random();
        colors[3 * i + 2] = Math.random();

        sizes[i] = 0.1;
    }

    flight_point_cloud_geom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    flight_point_cloud_geom.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    flight_point_cloud_geom.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    flight_point_cloud_geom.computeBoundingBox();

    var attributes = {
        size: {
            type: 'f',
            value: null
        },
        customColor: {
            type: 'c',
            value: null
        }
    };

    var uniforms = {
        color: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        texture: {
            type: "t",
            value: THREE.ImageUtils.loadTexture("images/point.png")
        }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        //attributes: attributes,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true
    });

    return new THREE.Points(flight_point_cloud_geom, shaderMaterial);
}

function update_flights() {
    if (!flight_point_cloud_geom) {
        return;
    }
    flight_point_cloud_geom.attributes.position.needsUpdate = true;

    for (var i = start_flight_idx; i < end_flight_idx; ++i) {

        if ( Date.now() > flight_point_start_time[i] ) {
            var ease_val = easeOutQuadratic(Date.now() - flight_point_start_time[i], 0, 1, flight_point_end_time[i] - flight_point_start_time[i]);

            if (ease_val < 0 || flight_point_speed_changed) {
                ease_val = 0;
                setFlightTimes(i);
            }

            var pos = flight_path_splines[i].getPoint(ease_val);
            positions[3 * i + 0] = pos.x;
            positions[3 * i + 1] = pos.y;
            positions[3 * i + 2] = pos.z;
        }
    }
}

function setFlightTimes(index) {
    var scaling_factor = (flight_point_speed_scaling - flight_point_speed_min_scaling) /
                            (flight_point_speed_max_scaling - flight_point_speed_min_scaling);
    var duration = (1-scaling_factor) * flight_distance[index] * 80000;
   
    var start_time = Date.now() + Math.random() * 5000
    flight_point_start_time[index] = start_time;
    flight_point_end_time[index] = start_time + duration;
}

function easeOutQuadratic(t, b, c, d) {
    if ((t /= d / 2) < 1)
        return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

export default Earth;
