/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

import pathSimple from "../path/simple";
import DataSet from "../../data/DataSet";

export default {
    draw: function (context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();

        // set from options
        for (var key in options) {
            context[key] = options[key];
        }

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        var rects = [];
            
        var size = options._size || options.size;
        if (size) {
            context.font = "bold " + size + "px Arial";
        } else {
            size = 12;
        }

        var textKey = options.textKey || 'text';

        if (!options.textAlign) {
            context.textAlign = 'center';
        }

        if (!options.textBaseline) {
            context.textBaseline = 'middle';
        }

        if (options.avoid) { // 标注避让
            for (var i = 0, len = data.length; i < len; i++) {
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0] + offset.x;
                var y = coordinates[1] + offset.y;
                var text = data[i][textKey];
                var textWidth = context.measureText(text).width;

                // 根据文本宽度和高度调整x，y位置，使得绘制文本时候坐标点在文本中心点，这个计算出的是左上角坐标
                var px = x - textWidth / 2; 
                var py = y - size / 2;

                var rect = {
                    sw: {
                        x: px,
                        y: py + size
                    },
                    ne: {
                        x: px + textWidth,
                        y: py 
                    }
                }

                if (!hasOverlay(rects, rect)) {
                    rects.push(rect);
                    px = px + textWidth / 2;
                    py = py + size / 2;
                    context.fillText(text, px, py);
                }

            };
        } else {
            for (var i = 0, len = data.length; i < len; i++) {
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0] + offset.x;
                var y = coordinates[1] + offset.y;
                var text = data[i][textKey];
                context.fillText(text, x, y);
            };
        }

        context.restore();
    }

}

/*
 *  当前文字区域和已有的文字区域是否有重叠部分
 */
function hasOverlay(rects, overlay) {
    for (var i = 0; i < rects.length; i++) {
        if (isRectOverlay(rects[i], overlay)) {
            return true;
        }
    }
    return false;
}

//判断2个矩形是否有重叠部分
function isRectOverlay(rect1, rect2) {
    //minx、miny 2个矩形右下角最小的x和y
    //maxx、maxy 2个矩形左上角最大的x和y
    var minx = Math.min(rect1.ne.x, rect2.ne.x);
    var miny = Math.min(rect1.sw.y, rect2.sw.y);
    var maxx = Math.max(rect1.sw.x, rect2.sw.x);
    var maxy = Math.max(rect1.ne.y, rect2.ne.y);
    if (minx > maxx && miny > maxy) {
        return true;
    }
    return false;
}
