var fs = require("fs");
var data = fs.readFileSync("poi_yiheyuan_meishi.json","utf-8");
data = JSON.parse(data);

data = data.result.data;

var result = [];

for (var i = 0; i < data.length; i++) {
    result.push({
        geometry: {
            type: 'Point',
            coordinates: data[i].location
        }
    });
}


var data = fs.writeFileSync("poi-yiheyuan-meishi.json", JSON.stringify(result));
