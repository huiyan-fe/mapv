/**
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 * legend控件
 */

function DataRangeControl(){

    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
}

DataRangeControl.prototype = new BMap.Control();

util.extend(DataRangeControl.prototype, {

    initialize: function(map){
        var canvas = this.canvas = document.createElement('canvas');
        canvas.style.background = '#fff';
        canvas.style.boxShadow = 'rgba(0,0,0,0.2) 0 0 4px 2px';
        canvas.style.border = '1px solid #999999';
        canvas.style.borderRadius = '4px';
        // 添加DOM元素到地图中
        map.getContainer().appendChild(canvas);
        // 将DOM元素返回
        return canvas;
    },

    getContainer: function(){
        return this.canvas;
    },

    drawSizeSplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 100;
        canvas.height = 190;
        canvas.style.width = '100px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');

        var height = 10;

        var maxSize = 0;
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i].size > maxSize) {
                maxSize = splitList[i].size;
            }
        }

        for (var i = 0; i < splitList.length; i++) {
            height += splitList[i].size;
            ctx.beginPath();
            ctx.arc(maxSize + 5, height, splitList[i].size, 0, Math.PI * 2, false);
            var startText = splitList[i].start || '~';
            var endText = splitList[i].end || '~';
            var text =  startText + ' - ' + endText;
            ctx.closePath();
            ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';
            ctx.fill();
            ctx.fillStyle = 'rgba(30, 30, 30, 1)';
            ctx.fillText(text, maxSize * 2 + 10, height + 6);
            var addHeight = splitList[i].size + 5;
            if (addHeight < 15) {
                addHeight = 15;
            }
            height += addHeight;
        }
    },

    drawCategorySplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 80;
        canvas.height = 190;
        canvas.style.width = '80px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');
        var i = 0;
        for (var key in splitList) {
            ctx.fillStyle = splitList[key];
            ctx.beginPath();
            ctx.arc(15, i * 25 + 15, 5, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillText(key, 25, i * 25 + 20);
            i++;
        }
    },

    drawChoroplethSplit: function (splitList, drawOptions) {
        var canvas = this.canvas;
        canvas.width = 100;
        canvas.height = 190;
        canvas.style.width = '100px';
        canvas.style.height = '190px';
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = drawOptions.fillStyle || 'rgba(50, 50, 200, 0.8)';

        for (var i = 0; i < splitList.length; i++) {
            ctx.beginPath();
            ctx.arc(15, i * 25 + 15, 5, 0, Math.PI * 2, false);
            var text = (splitList[i].start || '~') + ' - ' + (splitList[i].end || '~');
            ctx.closePath();
            ctx.fillStyle = splitList[i].color;
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillText(text, 25, i * 25 + 20);
        };
    },

    hide: function () {
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    },

    show: function () {
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }

});
