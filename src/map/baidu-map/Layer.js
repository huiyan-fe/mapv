/**
 * @author kyle / http://nikai.us/
 */

import CanvasLayer from "./CanvasLayer";
import clear from "../../canvas/clear";
import drawHeatmap from "../../canvas/draw/heatmap";
import drawSimple from "../../canvas/draw/simple";
import drawGrid from "../../canvas/draw/grid";
import drawHoneycomb from "../../canvas/draw/honeycomb";
import DataSet from "../../data/DataSet";
import Intensity from "../../utils/data-range/Intensity";
import Category from "../../utils/data-range/Category";
import Choropleth from "../../utils/data-range/Choropleth";

function Layer(map, dataSet, options) {
    var intensity = new Intensity({
        maxSize: options.maxSize,
        gradient: options.gradient,
        max: options.max
    });

    var category = new Category(options.splitList);

    var choropleth = new Choropleth(options.splitList);

    var canvasLayer = new CanvasLayer({
        map: map,
        update: update
    });

    function update() {
        var context = this.canvas.getContext("2d");
        clear(context);

        for (var key in options) {
            context[key] = options[key];
        }

        var zoomUnit = Math.pow(2, 18 - map.getZoom());
        var projection = map.getMapType().getProjection();

        var data = dataSet.get({
            transferCoordinate: function (coordinate) {
                var pixel = map.pointToPixel(new BMap.Point(coordinate[0], coordinate[1]));
                return [pixel.x, pixel.y];
            }
        });

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (options.draw == 'bubble') {
                data[i].size = intensity.getSize(item.count);
            } else if (options.draw == 'intensity') {
                if (data[i].geometry.type === 'LineString') {
                    data[i].strokeStyle = intensity.getColor(item.count);
                } else {
                    data[i].fillStyle = intensity.getColor(item.count);
                }
            } else if (options.draw == 'category') {
                data[i].fillStyle = category.get(item.count);
            } else if (options.draw == 'choropleth') {
                data[i].fillStyle = choropleth.get(item.count);
            }
        }

        if (options.draw == 'heatmap') {
            drawHeatmap.draw(context, new DataSet(data), options);
        } else if (options.draw == 'grid' || options.draw == 'honeycomb') {
            var data1 = dataSet.get();
            var minx = data1[0].geometry.coordinates[0];
            var maxy = data1[0].geometry.coordinates[1];
            for (var i = 1; i < data1.length; i++) {
                if (data1[i].geometry.coordinates[0] < minx) {
                    minx = data1[i].geometry.coordinates[0];
                }
                if (data1[i].geometry.coordinates[1] > maxy) {
                    maxy = data1[i].geometry.coordinates[1];
                }
            }
            var nwPixel = map.pointToPixel(new BMap.Point(minx, maxy));
            options.offset = {
                x: nwPixel.x,
                y: nwPixel.y 
            };
            if (options.draw == 'grid') {
                drawGrid.draw(context, new DataSet(data), options);
            } else {
                drawHoneycomb.draw(context, new DataSet(data), options);
            }
        } else {
            drawSimple.draw(context, new DataSet(data), options);
        }

    };

}

Layer.prototype.calcuteDataSet = function (dataSet) {
}

export default Layer;

