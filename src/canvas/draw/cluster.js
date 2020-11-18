/**
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

const imageMap = {};
let stacks = {};
export default {
    draw: function (context, dataSet, options) {
        context.save();
        const data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let coordinates = item.geometry._coordinates || item.geometry.coordinates;
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

                    let text = item.properties.point_count;
                    let textWidth = context.measureText(text).width;
                    context.fillText(text, coordinates[0] + 0.5 - textWidth / 2, coordinates[1] + 0.5 + 3);
                }
            } else {
                this.drawIcon(item, options, context);
            }
        }
        context.restore();
    },
    drawIcon(item, options, context) {
        let [x, y] = item.geometry._coordinates || item.geometry.coordinates;
        let iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
        const drawPoint = () => {
            context.beginPath();
            context.arc(x, y, options.size || 5, 0, Math.PI * 2);
            context.fillStyle = options.fillStyle || 'red';
            context.fill();
        };
        if (!iconOptions.url) {
            drawPoint();
            return;
        }
        let iconWidth = iconOptions.width;
        let iconHeight = iconOptions.height;
        let iconOffset = iconOptions.offset || {x: 0, y: 0};
        x = x - ~~iconWidth / 2 + iconOffset.x;
        y = y - ~~iconHeight / 2 + iconOffset.y;
        let url = window.encodeURIComponent(iconOptions.url);
        let img = imageMap[url];
        if (img) {
            if (img === 'error') {
                drawPoint();
            } else if (iconWidth && iconHeight) {
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
                        stacks[src] && stacks[src].forEach(fun => fun(img));
                        stacks[src] = null;
                        imageMap[src] = img;
                    },
                    function (src) {
                        stacks[src] && stacks[src].forEach(fun => fun('error', src));
                        stacks[src] = null;
                        imageMap[src] = 'error';
                        drawPoint();
                    }
                );
            }
            stacks[url].push(
                ((x, y, iconWidth, iconHeight) =>
                    function (img) {
                        if (img === 'error') {
                            drawPoint();
                        } else if (iconWidth && iconHeight) {
                            context.drawImage(img, x, y, iconWidth, iconHeight);
                        } else {
                            context.drawImage(img, x, y);
                        }
                    })(x, y, iconWidth, iconHeight)
            );
        }
    }
};

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
