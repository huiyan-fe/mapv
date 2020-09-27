/**
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        context.save();
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            context.beginPath();
            if (item.properties && item.properties.cluster) {
                context.arc(coordinates[0], coordinates[1], item.size, 0, Math.PI * 2);
                context.fillStyle = item.fillStyle;
                context.fill();

                if (options.label && options.label.show !== false) {
                    context.fillStyle = options.label.fillStyle || 'white';

                    if (options.label.font) {
                        context.font = options.label.font;
                    }

                    if (options.label.shadowColor) {
                        context.shadowColor = options.label.shadowColor;
                    }

                    if (options.label.shadowBlur) {
                        context.shadowBlur = options.label.shadowBlur;
                    }

                    var text = item.properties.point_count;
                    var textWidth = context.measureText(text).width;
                    context.fillText(text, coordinates[0] + 0.5 - textWidth / 2, coordinates[1] + 0.5 + 3);
                }
            } else {
                var x = coordinates[0];
                var y = coordinates[1];
                var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
                if (iconOptions.url) {
                    var iconWidth = iconOptions.width;
                    var iconHeight = iconOptions.height;
                    var iconOffset = iconOptions.offset || {
                        x: 0,
                        y: 0
                    };
                    x = x - iconWidth / 2 + iconOffset.x;
                    y = y - iconHeight / 2 + iconOffset.y;
                    var url = window.encodeURIComponent(iconOptions.url);
                    var img = imageMap[url];
                    if (img) {
                        if (iconWidth && iconHeight) {
                            context.drawImage(img, x, y, iconWidth, iconHeight);
                        } else {
                            context.drawImage(img, x, y);
                        }
                    } else {
                        if (!stacks[url]) {
                            stacks[url] = [];
                            getImage(
                                url,
                                function (img, src) {
                                    stacks[src] && stacks[src].forEach(fun => fun(img, src));
                                    stacks[src] = null;
                                    imageMap[src] = img;
                                },
                                function (src) {
                                    stacks[src] = null;
                                    context.arc(x, y, options.size || 5, 0, Math.PI * 2);
                                    context.fillStyle = options.fillStyle || 'red';
                                    context.fill();
                                }
                            );
                        }
                        stacks[url].push(
                            ((x, y, iconWidth, iconHeight) =>
                                function (img) {
                                    if (iconWidth && iconHeight) {
                                        context.drawImage(img, x, y, iconWidth, iconHeight);
                                    } else {
                                        context.drawImage(img, x, y);
                                    }
                                })(x, y, iconWidth, iconHeight)
                        );
                    }
                } else {
                    context.arc(x, y, options.size || 5, 0, Math.PI * 2);
                    context.fillStyle = options.fillStyle || 'red';
                    context.fill();
                }
            }
        }
        context.restore();
    }
};
function getImage(url, callback, fallback) {
    var img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}
