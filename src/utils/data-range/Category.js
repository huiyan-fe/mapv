/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} splitList:
 *   { 
 *       other: 1,
 *       1: 2,
 *       2: 3,
 *       3: 4,
 *       4: 5,
 *       5: 6,
 *       6: 7
 *   }
 */
function Category(splitList) {
    this.splitList = splitList || {
        other: 1
    };
}

Category.prototype.get = function (count) {

    var splitList = this.splitList;
    
    var value = splitList['other'];

    for (var i in splitList) {
        if (count == i) {
            value = splitList[i];
            break;
        }
    }

    return value;
}

/**
 * 根据DataSet自动生成对应的splitList
 */
Category.prototype.generateByDataSet = function (dataSet, color) {
    var colors = color || ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var data = dataSet.get();
    this.splitList = {};
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (this.splitList[data[i].count] === undefined) {
            this.splitList[data[i].count] = colors[count];
            count++;
        }
        if (count >= colors.length - 1) {
            break;
        }
    }

    this.splitList['other'] = colors[colors.length - 1];
}


Category.prototype.getLegend = function (options) {
    var splitList = this.splitList;
    var container = document.createElement('div');
    container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
    var html = '';
    for (var key in splitList) {
        html += '<div style="line-height: 19px;" value="' + key + '"><span style="vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:' + splitList[key] + ';"></span><span style="margin-left: 3px;">' + key + '<span></div>' 
    }
    container.innerHTML = html;
    return container;
}

export default Category;
