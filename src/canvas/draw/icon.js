/**
 * @author wanghyper
 * This file is to draw icon
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (var i = 0, len = data.length; i < len; i++) {
            const item = data[i];
            if (item.geometry) {
                var icon = item.icon || options.icon;
                if (typeof icon === 'string') {
                    let url = window.encodeURIComponent(icon);
                    let img = imageMap[url];
                    if (img) {
                        drawItem(img, options, context, item);
                    } else {
                        if (!stacks[url]) {
                            stacks[url] = [];
                            getImage(
                                url,
                                function (img, src) {
                                    stacks[src] && stacks[src].forEach(fun => fun(img));
                                    stacks[src] = null;
                                    imageMap[src] = img;
                                },
                                function (src) {
                                    stacks[src] && stacks[src].forEach(fun => fun('error'));
                                    stacks[src] = null;
                                    imageMap[src] = 'error';
                                }
                            );
                        }
                        stacks[url].push(function (img) {
                            drawItem(img, options, context, item);
                        });
                    }
                } else {
                    drawItem(icon, options, context, item);
                }
            }
        }
    }
};
function drawItem(img, options, context, item) {
    context.save();
    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
    var x = coordinates[0];
    var y = coordinates[1];
    var offset = options.offset || {x: 0, y: 0};
    var width = item.width || options._width || options.width;
    var height = item.height || options._height || options.height;
    x = x - ~~width / 2 + offset.x;
    y = y - ~~height / 2 + offset.y;
    if (typeof img === 'string') {
        context.beginPath();
        context.arc(x, y, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'red';
        context.fill();
        return;
    }
    var deg = item.deg || options.deg;
    if (deg) {
        context.translate(x, y);
        context.rotate((deg * Math.PI) / 180);
        context.translate(-x, -y);
    }

    if (options.sx && options.sy && options.swidth && options.sheight && options.width && options.height) {
        context.drawImage(img, options.sx, options.sy, options.swidth, options.sheight, x, y, width, height);
    } else if (width && height) {
        context.drawImage(img, x, y, width, height);
    } else {
        context.drawImage(img, x, y);
    }
    context.restore();
}

function getImage(url, callback, fallback) {
    let img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}
