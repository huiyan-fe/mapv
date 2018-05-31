/**
 * @author kyle / http://nikai.us/
 */

import DataSet from "./DataSet";

export default {
    getDataSet: function (geoJson) {

        var data = [];
        var features = geoJson.features;
        if (features) {
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var geometry = feature.geometry;
                var properties = feature.properties;
                var item = {};
                for (var key in properties) {
                    item[key] = properties[key];
                }
                item.geometry = geometry;
                data.push(item);
            }
        }
        return new DataSet(data);

    }
}
