/**
 * @author kyle / http://nikai.us/
 */

/**
 * Choropleth
 * @param {Object} splitList:
 *       [
 *           {
 *               start: 0,
 *               end: 2,
 *               value: randomColor()
 *           },{
 *               start: 2,
 *               end: 4,
 *               value: randomColor()
 *           },{
 *               start: 4,
 *               value: randomColor()
 *           }
 *       ];
 *
 */
function Choropleth(splitList) {
    this.splitList = splitList || [{
        start: 0,
        value: 'red'
    }];
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;

    var value = false;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined ||
                splitList[i].start !== undefined &&
                count >= splitList[i].start) &&
            (splitList[i].end === undefined ||
                splitList[i].end !== undefined && count < splitList[i].end)) {
            value = splitList[i].value;
            break;
        }
    }

    return value;

}

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByDataSet = function (dataSet) {

    var min = dataSet.getMin('count');
    var max = dataSet.getMax('count');

    this.generateByMinMax(min, max);

}

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByMinMax = function (min, max) {
    var colors = ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var splitNum = Number((max - min) / 7);
    // console.log(splitNum)
    max = Number(max);
    var index = Number(min);
    this.splitList = [];
    var count = 0;

    while (index < max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            value: colors[count]
        });
        count++;
        index += splitNum;
        // console.log(index, max)
    }
    // console.log('splitNum')
}

Choropleth.prototype.getLegend = function (options) {
    var splitList = this.splitList;
}

export default Choropleth;