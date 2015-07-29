/**
 * @file  控制值域的类
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 */

function DataRange(layer) {
    this.set('layer', layer);
    this.bindTo('data', layer)
    this.bindTo('drawOptions', layer)
    Class.call(this);
}

util.inherits(DataRange, Class);

util.extend(DataRange.prototype, {
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

    drawOptions_changed: function () {

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

        if (this.get("layer").getDrawType() === 'bubble') {
            this.get("layer").getDataRangeControl().drawSizeSplit(this.splitList, this.get('drawOptions'));
        } else if (this.get("layer").getDrawType() === 'category') {
            this.get("layer").getDataRangeControl().drawCategorySplit(this.categorySplitList, this.get('drawOptions'));
        } else {
            this.get("layer").getDataRangeControl().hide();
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
                radius: radius,
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
    }


}); // end extend
