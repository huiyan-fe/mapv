var mapv = require('../build/mapv.js');
var canvas = require('canvas');
var fs = require("fs");
var width = 1300;
var height = 800;
var center = [121.489723, 31.248408];
var zoom = 8;
//var center = [118.489723, 31.248408];

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(width, height)
  , ctx = canvas.getContext('2d');

var options = {
    lineWidth: 3.6,
    shadowBlur: 3,
    globalCompositeOperation: 'lighter',
    shadowColor: "rgba(50, 50, 255, 0.5)",
    strokeStyle: "rgba(50, 50, 255, 0.8)"
};

var scale = Math.pow(2, zoom);

center[0] *= scale;
center[1] *= scale;


ctx.fillStyle = '#000832';
ctx.fillRect(0, 0, canvas.width, canvas.height);

var csvstr = fs.readFileSync('shanghai_navi.csv', "utf-8");
var dataSet = mapv.csv.getDataSet(csvstr);

var data = dataSet.get({
    transferCoordinate: function (coordinate) {
        coordinate[0] *= scale;
        coordinate[1] *= scale;

        var x = coordinate[0];
        var y = coordinate[1];
        x = x - center[0] + (width / 2);
        y = (height / 2) - (y - center[1]);
        return [x, y];
    }
});

console.log('draw');
console.time('draw');

mapv.canvasDrawSimple.draw(ctx, data, options);

console.timeEnd('draw');

var fs = require('fs')
  , out = fs.createWriteStream(__dirname + '/line.png')
  , stream = canvas.pngStream();

stream.on('data', function(chunk){
    out.write(chunk);
});

stream.on('end', function(){
    console.log('saved png');
});
