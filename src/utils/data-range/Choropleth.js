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
    this.splitList = splitList;
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;
    
    var value = false;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined
        || splitList[i].start !== undefined
        && count >= splitList[i].start)
        && (splitList[i].end === undefined
        || splitList[i].end !== undefined && count < splitList[i].end)) {
            value = splitList[i].value;
            break;
        }
    }

    return value;

}

export default Choropleth;
