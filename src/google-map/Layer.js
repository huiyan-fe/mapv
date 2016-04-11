/**
 * @author kyle / http://nikai.us/
 */

import clear from "../canvas/clear";
import drawHeatmap from "../canvas/draw/heatmap";
import drawSimple from "../canvas/draw/simple";
import drawHoneycomb from "../canvas/draw/honeycomb";
import DataSet from "../data/DataSet";
import CanvasLayer from "./CanvasLayer";
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

    var resolutionScale = window.devicePixelRatio || 1;

    // initialize the canvasLayer
    var canvasLayerOptions = {
        map: map,
        animate: false,
        updateHandler: update,
        resolutionScale: resolutionScale
    };

    var canvasLayer = new CanvasLayer(canvasLayerOptions);
    var context = canvasLayer.canvas.getContext('2d');

    function update() {
        clear(context);

        for (var key in options) {
            context[key] = options[key];
        }

        var data = dataSet.get();
    
        var pointCount = 0;
        var lineCount = 0;
        var polygonCount = 0;

        /* We need to scale and translate the map for current view.
         * see https://developers.google.com/maps/documentation/javascript/maptypes#MapCoordinates
         */
        var mapProjection = map.getProjection();

        // scale is just 2^zoom
        // If canvasLayer is scaled (with resolutionScale), we need to scale by
        // the same amount to account for the larger canvas.
        var scale = Math.pow(2, map.zoom) * resolutionScale;

        var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (data[i].geometry) {

                if (data[i].geometry.type === 'Point') {
                    var coordinates = data[i].geometry.coordinates;

                    var latLng = new google.maps.LatLng(coordinates[1], coordinates[0]);
                    var worldPoint = mapProjection.fromLatLngToPoint(latLng);

                    var pixel = {
                        x: (worldPoint.x - offset.x) * scale,
                        y: (worldPoint.y - offset.y) * scale,
                    }

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
        } else if (options.draw == 'honeycomb') {
            drawHoneycomb.draw(context, new DataSet(data), options);
        } else {
            drawSimple.draw(context, new DataSet(data), options);
        }

    };

}

export default Layer;
