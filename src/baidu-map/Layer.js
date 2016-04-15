/**
 * @author kyle / http://nikai.us/
 */

import CanvasLayer from "./CanvasLayer";
import clear from "../canvas/clear";
import drawHeatmap from "../canvas/draw/heatmap";
import drawSimple from "../canvas/draw/simple";
import drawGrid from "../canvas/draw/grid";
import drawHoneycomb from "../canvas/draw/honeycomb";
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
                    pointCount++;
                }

                if (data[i].geometry.type === 'Polygon' || data[i].geometry.type === 'MultiPolygon') {

                    var coordinates = data[i].geometry.coordinates;

                    if (data[i].geometry.type === 'Polygon') {

                        var newCoordinates = getPolygon(coordinates);
                        data[i].geometry.coordinates = newCoordinates;

                    } else if (data[i].geometry.type === 'MultiPolygon') {
                        var newCoordinates = [];
                        for (var c = 0; c < coordinates.length; c++) {
                            var polygon = coordinates[c];
                            var polygon = getPolygon(polygon);
                            newCoordinates.push(polygon);
                        }

                        data[i].geometry.coordinates = newCoordinates;
                    }

                    polygonCount++;
                }

                if (data[i].geometry.type === 'LineString') {
                    var coordinates = data[i].geometry.coordinates;
                    var newCoordinates = [];
                    for (var j = 0; j < coordinates.length; j++) {
                        var pixel = map.pointToPixel(new BMap.Point(coordinates[j][0], coordinates[j][1]));
                        newCoordinates.push([~~pixel.x, ~~pixel.y]);
                    }
                    data[i].geometry.coordinates = newCoordinates;
                    lineCount++;
                }

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
        }

        var maxCount = Math.max(Math.max(pointCount, lineCount), polygonCount);

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

function getPolygon(coordinates) {
    var newCoordinates = [];
    for (var c = 0; c < coordinates.length; c++) {
        var coordinate = coordinates[c];
        var newcoordinate = [];
        for (var j = 0; j < coordinate.length; j++) {
            var pixel = map.pointToPixel(new BMap.Point(coordinate[j][0], coordinate[j][1]));
            newcoordinate.push([~~pixel.x, ~~pixel.y]);
        }
        newCoordinates.push(newcoordinate);
    }
    return newCoordinates;
}

export default Layer;

