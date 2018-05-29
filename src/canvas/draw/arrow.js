/**
 * 绘制沿线箭头
 * @author kyle / http://nikai.us/
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";
import {getAngle} from "../../utils/index.js";
import {devicePixelRatio} from "../../utils/window.js";

var imageCache = {};

var object = {
    draw: function (context, dataSet, options) {
        var imageCacheKey = 'http://huiyan.baidu.com/github/tools/gis-drawing/static/images/direction.png';
        if (options.arrow && options.arrow.url) {
            imageCacheKey = options.arrow.url;
        }

        if (!imageCache[imageCacheKey]) {
            imageCache[imageCacheKey] = null;
        }

        var directionImage = imageCache[imageCacheKey];
        
        if (!directionImage) {
            var args = Array.prototype.slice.call(arguments);
            var image = new Image();
            image.onload = () => {
                imageCache[imageCacheKey] = image;
                object.draw.apply(null, args);
            }
            image.src = imageCacheKey;
            return;
        }
        
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // console.log('xxxx',options)
        context.save();

        for (var key in options) {
            context[key] = options[key];
        }


        var points = [];
        var preCoordinate = null;
        for (var i = 0, len = data.length; i < len; i++) {

            var item = data[i];

            context.save();

            if (item.fillStyle || item._fillStyle) {
                context.fillStyle = item.fillStyle || item._fillStyle;
            }

            if (item.strokeStyle || item._strokeStyle) {
                context.strokeStyle = item.strokeStyle || item._strokeStyle;
            }

            var type = item.geometry.type;

            context.beginPath();
            if (type === 'LineString') {
                var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                var interval = options.arrow.interval !== undefined ? options.arrow.interval : 1;
                for (var j = 0; j < coordinates.length; j += interval) {
                    if (coordinates[j] && coordinates[j + 1]) {
                        var coordinate = coordinates[j];

                        if (preCoordinate && getDistance(coordinate, preCoordinate) < 30) {
                            continue;
                        }

                        context.save();
                        var angle = getAngle(coordinates[j], coordinates[j + 1]);
                        context.translate(coordinate[0], coordinate[1]);
                        context.rotate((angle) * Math.PI / 180);
                        context.drawImage(directionImage, -directionImage.width / 2 / 2, -directionImage.height / 2 / 2, directionImage.width / 2, directionImage.height / 2);
                        context.restore();

                        points.push(coordinate);
                        preCoordinate = coordinate;
                    }
                }
            }

            context.restore();

        };

        context.restore();

    }
}

function getDistance(coordinateA, coordinateB) {
    return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2));
}

export default object;
