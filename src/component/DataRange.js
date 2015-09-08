/**
 * @file  控制值域的类
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function DataRange(layer) {
    Class.call(this);

    this.initOptions({
        min: 0,
        max: 0,
    });

    this.set('layer', layer);
    this.bindTo('data', layer)
    this.bindTo('drawOptions', layer)
    this.bindTo('drawType', layer)

    var me = this;
}

util.inherits(DataRange, Class);

util.extend(DataRange.prototype, {
    defaultGradient: {
        '0.4': 'blue',
        '0.6': 'cyan',
        '0.7': 'lime',
        '0.8': 'yellow',
        '1.0': 'red'
    },
    colors: [
        'rgba(17, 102, 252, 0.8)',
        'rgba(52, 139, 251, 0.8)',
        'rgba(110, 176, 253, 0.8)',
        'rgba(255, 241, 193, 0.8)',
        'rgba(255, 146, 149, 0.8)',
        'rgba(253, 98, 104, 0.8)',
        'rgba(255, 0, 0, 0.8)',
        'rgba(255, 51, 61, 0.8)'
    ],

    // 根据count值获取对应的大小，在bubble绘制中用到
    getSize: function (count) {
        var size = 1;
        var splitList = this.splitList;

        for (var i = 0; i < splitList.length; i++) {
            if ((splitList[i].start === undefined
            || splitList[i].start !== undefined
            && count >= splitList[i].start)
            && (splitList[i].end === undefined
            || splitList[i].end !== undefined && count < splitList[i].end)) {
                size = splitList[i].size;
                break;
            }
        }

        return size;
    },

    // 根据count值获取对应的颜色，在choropleth中使用
    getColorByRange: function (count) {
        var color = 'rgba(50, 50, 255, 1)';
        var splitList = this.splitList;

        for (var i = 0; i < splitList.length; i++) {
            if ((splitList[i].start === undefined
            || splitList[i].start !== undefined
            && count >= splitList[i].start)
            && (splitList[i].end === undefined
            || splitList[i].end !== undefined && count < splitList[i].end)) {
                color = splitList[i].color;
                break;
            }
        }

        return color;
    },

    data_changed: function () {
        var data = this.get('data');
        if (data && data.length > 0) {
            this._min = data[0].count;
            this._max = data[0].count;
            for (var i = 0; i < data.length; i++) {
                this._max = Math.max(this._max, data[i].count);
                this._min = Math.min(this._min, data[i].count);
            }
        }
    },

    drawType_changed: function () {
        this.update();
    },

    drawOptions_changed: function () {
        this.update();
    },

    update: function () {

        var drawOptions = this.get("drawOptions");
        if (drawOptions && drawOptions.splitList) {
            this.splitList = drawOptions.splitList;

        } else {
            this.generalSplitList();
        }

        if (this.get("layer").getDrawType() === 'category') {
            if (drawOptions && drawOptions.splitList) {
                this.categorySplitList = drawOptions.splitList;
            } else {
                this.generalCategorySplitList();
            }
        }

        if (this.get("layer").getDrawType() === 'heatmap' || this.get("layer").getDrawType() === 'density' || this.get("layer").getDrawType() === 'intensity') {
            this.generalGradient(drawOptions.gradient || this.defaultGradient);
        }

        this.draw();
    },

    draw: function () {

        if (this.get("layer").getDataRangeControl()) {
            this.get("layer").dataRangeControl.show();
        }

        if (this.get("layer").getDrawType() === 'bubble') {
            this.get("layer").dataRangeControl.drawSizeSplit(this.splitList, this.get('drawOptions'));
        } else if (this.get("layer").getDrawType() === 'category') {
            this.get("layer").dataRangeControl.drawCategorySplit(this.categorySplitList, this.get('drawOptions'));
        } else if (this.get("layer").getDrawType() === 'choropleth') {
            this.get("layer").dataRangeControl.drawChoroplethSplit(this.splitList, this.get('drawOptions'));
        } else {
            this.get("layer").dataRangeControl.hide();
        }

    },

    generalSplitList: function () {
        var splitNum = Math.ceil((this._max - this._min) / 7);
        var index = this._min;
        this.splitList = [];
        var radius = 1;
        while (index < this._max) {
            this.splitList.push({
                start: index,
                end: index + splitNum,
                size: radius,
                color: this.colors[radius - 1]
            });
            index += splitNum;
            radius++;
        }
    },

    generalCategorySplitList: function () {
        var colors = ['rgba(255, 255, 0, 0.8)',
            'rgba(253, 98, 104, 0.8)',
            'rgba(255, 146, 149, 0.8)',
            'rgba(255, 241, 193, 0.8)',
            'rgba(110, 176, 253, 0.8)',
            'rgba(52, 139, 251, 0.8)',
            'rgba(17, 102, 252, 0.8)'];
        var data = this.get("data");
        this.categorySplitList = {};
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            if (this.categorySplitList[data[i].count] === undefined) {
                this.categorySplitList[data[i].count] = colors[count];
                count++;
            }
            if (count >= colors.length - 1) {
                break;
            }
        }

        this.categorySplitList['other'] = colors[colors.length - 1];
    },

    getCategoryColor: function (count) {
        var splitList = this.categorySplitList;

        var color = splitList['other'];

        for (var i in splitList) {
            if (count == i) {
                color = splitList[i];
                break;
            }
        }

        return color;
    },

    generalGradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;
    },

    getGradient: function () {
        return this._grad;
    },

    getColorByGradient: function (count) {
        var max = this.get("max") || 10;

        var index = count / max;
        if (index > 1) {
            index = 1;
        }
        index *= 255;
        index = parseInt(index, 10);
        index *= 4;

        var color = 'rgba(' + this._grad[index] + ', ' + this._grad[index + 1] + ', ' + this._grad[index + 2] + ',' + this._grad[index + 3] +')';
        return color;
    }

}); // end extend
