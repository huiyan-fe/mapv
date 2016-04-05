/**
 * @author kyle / http://nikai.us/
 */

import canvasClear from "../canvas/clear";
import drawPointSimple from "../canvas/draw/point/simple";
import drawPolylineSimple from "../canvas/draw/polyline/simple";
import drawPolygonSimple from "../canvas/draw/polygon/simple";
import drawPointHeatmap from "../canvas/draw/point/heatmap";
import DataSet from "../data/DataSet";
import Intensity from "../utils/data-range/Intensity";
import Category from "../utils/data-range/Category";
import Choropleth from "../utils/data-range/Choropleth";

function Layer(map, dataSet, options) {
    var intensity = new Intensity({
        maxSize: options.maxSize,
        gradient: options.gradient,
        max: options.max
    });

    var category = new Category(options.splitList);

    var choropleth = new Choropleth(options.splitList);

    var canvasLayer = new mapv.baiduMapCanvasLayer({
        map: map,
        update: update
    });

    function update() {
        var context = this.canvas.getContext("2d");
        canvasClear(context);

        for (var key in options) {
            context[key] = options[key];
        }

        var data = dataSet.get();
    
        var pointCount = 0;
        var lineCount = 0;
        var polygonCount = 0;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (data[i].geometry) {
                if (data[i].geometry.type === 'Point') {
                    var coordinates = data[i].geometry.coordinates;
                    var pixel = map.pointToPixel(new BMap.Point(coordinates[0], coordinates[1]));
                    data[i].geometry.coordinates = [pixel.x, pixel.y];
                    if (options.draw == 'bubble') {
                        data[i].size = intensity.getSize(item.count);
                    } else if (options.draw == 'intensity') {
                        data[i].fillStyle = intensity.getColor(item.count);
                    } else if (options.draw == 'category') {
                        data[i].fillStyle = category.get(item.count);
                    } else if (options.draw == 'choropleth') {
                        data[i].fillStyle = choropleth.get(item.count);
                    }
                    pointCount++;
                }

                if (data[i].geometry.type === 'Polygon' || data[i].geometry.type === 'LineString') {
                    var coordinates = data[i].geometry.coordinates;
                    var newCoordinates = [];
                    for (var j = 0; j < coordinates.length; j++) {
                        var pixel = map.pointToPixel(new BMap.Point(coordinates[j][0], coordinates[j][1]));
                        newCoordinates.push([~~pixel.x, ~~pixel.y]);
                    }
                    data[i].geometry.coordinates = newCoordinates;
                    if (data[i].geometry.type === 'Polygon') {
                        polygonCount++;
                    } else {
                        lineCount++;
                    }
                }
            }
        }

        var maxCount = Math.max(Math.max(pointCount, lineCount), polygonCount);

        if (options.draw == 'heatmap') {
            drawPointHeatmap.draw(context, new DataSet(data), options);
        } else {
            if (maxCount === pointCount) {
                drawPointSimple.draw(context, new DataSet(data), options);
            } else if (maxCount === lineCount) {
                drawPolylineSimple.draw(context, new DataSet(data), options);
            } else {
                drawPolygonSimple.draw(context, new DataSet(data), options);
            }
        }

        

    };

}

export default Layer;
