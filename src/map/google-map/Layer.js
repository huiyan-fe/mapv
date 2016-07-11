/**
 * @author kyle / http://nikai.us/
 */

import clear from "../../canvas/clear";
import drawHeatmap from "../../canvas/draw/heatmap";
import drawSimple from "../../canvas/draw/simple";
import drawHoneycomb from "../../canvas/draw/honeycomb";
import drawGrid from "../../canvas/draw/grid";
import DataSet from "../../data/DataSet";
import CanvasLayer from "./CanvasLayer";
import Intensity from "../../utils/data-range/Intensity";
import Category from "../../utils/data-range/Category";
import Choropleth from "../../utils/data-range/Choropleth";
import Animator from "../../utils/animation/Animator";

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

    function update() {

        var context = canvasLayer.canvas.getContext('2d');

        clear(context);

        for (var key in options) {
            context[key] = options[key];
        }

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

        var data = dataSet.get({
            transferCoordinate: function(coordinate) {
                var latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
                var worldPoint = mapProjection.fromLatLngToPoint(latLng);
                var pixel = {
                    x: (worldPoint.x - offset.x) * scale,
                    y: (worldPoint.y - offset.y) * scale,
                }
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

            var latLng = new google.maps.LatLng(minx, maxy);
            var worldPoint = mapProjection.fromLatLngToPoint(latLng);

            options.offset = {
                x: (worldPoint.x - offset.x) * scale,
                y: (worldPoint.y - offset.y) * scale
            };
            if (options.draw == 'grid') {
                drawGrid.draw(context, new DataSet(data), options);
            } else {
                drawHoneycomb.draw(context, new DataSet(data), options);
            }
        } else {
            console.log('hehe')
            drawSimple.draw(context, new DataSet(data), options);
        }

    }

}

export default Layer;