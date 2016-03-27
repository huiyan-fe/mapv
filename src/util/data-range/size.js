/**
 * @author kyle / http://nikai.us/
 */

export default {
    /**
     * @param Number value 
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    getSizeByPercent: function (value, maxValue, maxSize, options) {
        var size = 0;

        if (value > maxValue) {
            value = maxValue;
        }

        size = value / maxValue * maxSize;

        return size;
    }
}
