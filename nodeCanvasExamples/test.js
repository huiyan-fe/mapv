var mapv = require('../build/mapv.js');var canvas = require('canvas');

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(300, 300)
  , ctx = canvas.getContext('2d');

var gradient = ctx.createLinearGradient(0, 0, 256, 1);
gradient.addColorStop(1, "rgba(255, 0, 0, 1)");

//ctx.fillStyle = 'blue';
//ctx.fillRect(0, 0, 300, 300);

var options = {
    max: 30
};

var data = [
    {
        geometry: {
            type: 'Point',
            coordinates: [123, 23]
        },
        count: 30 * Math.random()
    }
];

var randomCount = 300;

while (randomCount--) {
    data.push({
        geometry: {
            type: 'Point',
            coordinates: [300 * Math.random(), 300 * Math.random()]
        },
        count: 30 * Math.random()
    });
}

mapv.canvasDrawHeatmap.draw(ctx, new mapv.DataSet(data), options);

var fs = require('fs')
  , out = fs.createWriteStream(__dirname + '/test.png')
  , stream = canvas.pngStream();

stream.on('data', function(chunk){
    out.write(chunk);
});

stream.on('end', function(){
    console.log('saved png');
});
