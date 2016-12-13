var fs = require("fs");
var data = fs.readFileSync("../beijing-village.json","utf-8");
data = JSON.parse(data);

var result = ['geometry,count'];

for (var i = 0; i < data.length; i++) {
    if (data[i].geometry.coordinates[0][0][1] > 39.494603) {
        result.push('"' + JSON.stringify(data[i].geometry).replace(/"/g, '""') + '",' + ~~(Math.random() * 100));
    }
}


var data = fs.writeFileSync("beijing-village.csv", result.join("\n"));
