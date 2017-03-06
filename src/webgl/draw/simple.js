/**
 * @author kyle / http://nikai.us/
 */
import DataSet from "../../data/DataSet";
import line from "./line";
import point from "./point";
import polygon from "./polygon";

export default {
    draw: function(gl, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        if (data.length > 0) {
            if (data[0].geometry.type == "LineString") {
                line.draw(gl, data, options);
            } else if (data[0].geometry.type == "Polygon" || data[0].geometry.type == "MultiPolygon") {
                polygon.draw(gl, data, options);
            } else {
                point.draw(gl, data, options);
            }
        }
    }
}
