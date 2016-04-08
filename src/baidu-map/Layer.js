/**
 * @author kyle / http://nikai.us/
 */

import CanvasLayer from "./CanvasLayer";
import canvasClear from "../canvas/clear";
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
        canvasClear(context);

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
        } else if (options.draw == 'grid') {
            var bounds = map.getBounds();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            var pixel = projection.lngLatToPoint(new BMap.Point(sw.lng, ne.lat));
            options.gridWidth = options.gridWidth || 50;
            options.offset = {
                x: pixel.x / zoomUnit % options.gridWidth,
                y: options.gridWidth - pixel.y / zoomUnit % options.gridWidth
            };
            drawGrid.draw(context, new DataSet(data), options);
        } else if (options.draw == 'honeycomb') {
            drawHoneycomb.draw(context, new DataSet(data), options);
        } else {
            drawSimple.draw(context, new DataSet(data), options);
        }

    };

}

export default Layer;
