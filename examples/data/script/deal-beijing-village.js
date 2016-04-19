var fs = require("fs");
var data = fs.readFileSync("beijing_village","utf-8");
data = JSON.parse(data);

var result = [];

for (var i = 0; i < data.length; i++) {
    result.push({
        geometry: {
            type: 'Polygon',
            coordinates: data[i].geo
        }
    });
}


var data = fs.writeFileSync("result", JSON.stringify(result));
