var fs = require("fs");
var filename = "shanghai_navi";
var data = fs.readFileSync(filename, "utf-8");

data = data.split("\n");

var lineData = ['geometry'];
var pointData = ['geometry,time'];

for (var i = 0; i < data.length - 1; i++) {
    var item = JSON.parse(data[i]);
    var coordinates = [];
    for (var j = 0; j < item.length; j++) {
        coordinates.push([item[j][0], item[j][1]]);
        var pointGeometry = JSON.stringify({
            type: 'Point',
            coordinates: [item[j][0], item[j][1]]
        });
        pointData.push('"' + pointGeometry.replace(/"/g, '""') + '",' + item[j][2]);
    }
    var geometry = JSON.stringify({
        type: 'LineString',
        coordinates: coordinates
    });
    lineData.push('"' + geometry.replace(/"/g, '""') + '"');
}

var data = fs.writeFileSync(filename + ".csv", lineData.join("\n"));
//var data = fs.writeFileSync("suzhouguchengqu_point.csv", pointData.join("\n"));
