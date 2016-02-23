/**
 * @file 普通的绘制方式
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function TrafficDrawer() {
    Drawer.apply(this, arguments);

    this.init();
}

util.inherits(TrafficDrawer, Drawer);

TrafficDrawer.prototype.init = function() {
    var self = this;

    // console.log(road)
    this.roads = [];

    // 12964452.6,4825152.43;12966219.7,4825295.53;
    this.roads = [{
            start: {
                x: 12965318.12,
                y: 4825216.47
            },
            end: {
                x: 12964456.16,
                y: 4825151.56
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12964456.16,
                y: 4825131.47
            },
            end: {
                x: 12965318.12,
                y: 4825197.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12966199,
                y: 4825292
            },
            end: {
                x: 12965342.16,
                y: 4825218.49
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965342.2,
                y: 4825202.55
            },
            end: {
                x: 12966206.16,
                y: 4825266.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965318.2,
                y: 4825196.55
            },
            end: {
                x: 12965308.16,
                y: 4824642.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965331.2,
                y: 4824648.55
            },
            end: {
                x: 12965340.16,
                y: 4825202.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965341.2,
                y: 4825219.55
            },
            end: {
                x: 12965351.16,
                y: 4825769.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965323.2,
                y: 4825769.55
            },
            end: {
                x: 12965319.16,
                y: 4825217.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965355.2,
                y: 4825769.55
            },
            end: {
                x: 12966360.16,
                y: 4825764.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12966358.2,
                y: 4825796.55
            },
            end: {
                x: 12965353.16,
                y: 4825802.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12965320.2,
                y: 4825798.55
            },
            end: {
                x: 12964270.16,
                y: 4825809.53
            },
            speed: Math.random() * 5000 + 1500
        }, {
            start: {
                x: 12964265.2,
                y: 4825789.55
            },
            end: {
                x: 12965324.16,
                y: 4825767.53
            },
            speed: Math.random() * 5000 + 1500
        }]
        //12964265.13,4825789.47;12965324.13,4825767.5
        //12965320.12,4825798.43;12964270.14,4825809.42
        //12966358.19,4825796.56;12965353.18,4825802.48
        // 12965355.19,4825769.52;12966360.19,4825764.46
        // for (var i in road) {
        //     for (var j = 1; j < road[i].length; j++) {


    //         this.roads.push({
    //             start: {
    //                 x: road[i][j - 1][0],
    //                 y: road[i][j - 1][1]
    //             },
    //             end: {
    //                 x: road[i][j][0],
    //                 y: road[i][j][1]
    //             },
    //             speed: Math.random() * 2000 + 1000
    //         })
    //     }
    // }

    var canvas = window.canvas = this.getCtx().canvas;
    var width = canvas.width;
    var height = canvas.height;
    var content = canvas.parentElement;

    var scene = this.scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(canvas.width, canvas.height);


    camera.position.z = 150;

    function render() {
        moveRoad();
        // console.log(self.roads)

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function moveRoad() {
        for (var i in self.roads) {
            var road = self.roads[i];
            road.particles = road.particles || [];
            for (var j in road.particles) {
                road.particles[j].position.x = road.particles[j].position.x + road._speed.x;
                road.particles[j].position.y = road.particles[j].position.y + road._speed.y;
                var xOver = false;
                var yOver = false;
                if (road._speed.x >= 0) {
                    if (road.particles[j].position.x >= road._end.x) {
                        xOver = true;
                    }
                } else {
                    if (road.particles[j].position.x <= road._end.x) {
                        xOver = true;
                    }
                }
                if (road._speed.y >= 0) {
                    if (road.particles[j].position.y >= road._end.y) {
                        yOver = true;
                    }
                } else {
                    if (road.particles[j].position.y <= road._end.y) {
                        yOver = true;
                    }
                }
                if (xOver && yOver) {
                    road.particles[j].position.x = road._start.x;
                    road.particles[j].position.y = road._start.y;
                }
            }
        }
    }
    render();
    // setTimeout(function(){
    //     moveRoad();
    // },1000)


}


TrafficDrawer.prototype.drawMap = function(time) {
    var dataType = this.getLayer().getDataType();
    var data = this.getLayer().getData();
    var ctx = this.getCtx();
    var drawOptions = this.getDrawOptions();
    var map = this._map;
    var mercatorProjection = map.getMapType().getProjection();
    var mcCenter = mercatorProjection.lngLatToPoint(map.getCenter());
    var zoom = map.getZoom();
    var zoomUnit = Math.pow(2, 18 - zoom);
    // console.log(mcCenter, zoomUnit)
    this.endDrawMap();

    for (var i in this.roads) {
        var road = this.roads[i];
        if (road.particles.length < 1) {

        } else {
            for (var j in road.particles) {
                this.scene.remove(road.particles[j])
            }
            road.particles = [];
        }

        var start = road._start = {
            x: (road.start.x - mcCenter.x) / zoomUnit,
            y: (road.start.y - mcCenter.y) / zoomUnit,
        };
        var end = road._end = {
            x: (road.end.x - mcCenter.x) / zoomUnit,
            y: (road.end.y - mcCenter.y) / zoomUnit,
        };
        //  =

        var d = road.distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2), 2);
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        road._speed = {
                x: (end.x - start.x) / (road.speed / 16),
                y: (end.y - start.y) / (road.speed / 16),
            }
            //
            // var material = new THREE.LineBasicMaterial({
            //     color: 0x000000,
            //     linewidth: 100,
            //     // transparent: true,
            //     opacity: 0.4,
            // });
            //
            // var geometry = new THREE.Geometry();
            // geometry.vertices.push(
            //     new THREE.Vector3( start.x, start.y, -10 ),
            //     new THREE.Vector3( end.x, end.y, -10 ),
            // );
            // var line = new THREE.Line( geometry, material );
            // this.scene.add( line );
            //
        var material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(generateSprite()),
            transparent: true,
            opacity: 1.0,
            blending: THREE.NoBlending
        });

        for (var i = 0; i < 10; i++) {
            var particle = new THREE.Sprite(material);
            particle.position.set(start.x + i * dx / 10, start.y + i * dy / 10, 0);
            particle.scale.x = particle.scale.y = 30
                // particle.scale.x = Math.abs(dx) / 10 < 10 ? 10 : Math.abs(dx) / 10;
                // particle.scale.y = Math.abs(dy) / 10 < 10 ? 10 : Math.abs(dy) / 10;
            this.scene.add(particle);
            road.particles.push(particle)
        }

    }

    // console.log(this.roads)



};

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,0,0.8)');
    gradient.addColorStop(0.4, 'rgba(64,64,0,0.4)');
    gradient.addColorStop(0.6, 'rgba(64,64,0,0.2)');
    gradient.addColorStop(1.0, 'rgba(0,0,0,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;

}
