/**
 * @author kyle / http://nikai.us/
 */

import Event from "../utils/Event";
import cityCenter from "../utils/cityCenter";

/**
 * DataSet
 *
 * A data set can:
 * - add/remove/update data
 * - gives triggers upon changes in the data
 * - can  import/export data in various data formats
 * @param {Array} [data]    Optional array with initial data
 * the field geometry is like geojson, it can be:
 * {
 *     "type": "Point",
 *     "coordinates": [125.6, 10.1]
 * }
 * {
 *     "type": "LineString",
 *     "coordinates": [
 *         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
 *     ]
 * }
 * {
 *     "type": "Polygon",
 *     "coordinates": [
 *         [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
 *           [100.0, 1.0], [100.0, 0.0] ]
 *     ]
 * }
 * @param {Object} [options]   Available options:
 * 
 */
function DataSet(data, options) {
    Event.bind(this)();

    this._options = options || {};
    this._data = []; // map with data indexed by id

    // add initial data when provided
    if (data) {
        this.add(data);
    }

}

DataSet.prototype = Event.prototype;

/**
 * Add data.
 */
DataSet.prototype.add = function (data, senderId) {
    if (Array.isArray(data)) {
        // Array
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].time && data[i].time.length == 14 && data[i].time.substr(0, 2) == '20') {
                var time = data[i].time;
                data[i].time = new Date(time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)).getTime();
            }
            this._data.push(data[i]);
        }
    } else if (data instanceof Object) {
        // Single item
        this._data.push(data);
    } else {
        throw new Error('Unknown dataType');
    }

    this._dataCache = JSON.parse(JSON.stringify(this._data));
};

DataSet.prototype.reset = function () {
    this._data = JSON.parse(JSON.stringify(this._dataCache));
}

/**
 * get data.
 */
DataSet.prototype.get = function (args) {
    args = args || {};

    //console.time('copy data time')
    var start = new Date();
    // TODO: 不修改原始数据，在数据上挂载新的名称，每次修改数据直接修改新名称下的数据，可以省去deepCopy
    // var data = deepCopy(this._data);
    var data = this._data;

    var start = new Date();

    if (args.filter) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            if (args.filter(data[i])) {
                newData.push(data[i]);
            }
        }
        data = newData;
    }

    if (args.transferCoordinate) {
        data = this.transferCoordinate(data, args.transferCoordinate, args.fromColumn, args.toColumn);
    }

    // console.timeEnd('transferCoordinate time')

    return data;

};

/**
 * set data.
 */
DataSet.prototype.set = function (data) {
    this._set(data);
    this._trigger('change');
}

/**
 * set data.
 */
DataSet.prototype._set = function (data) {
    this.clear();
    this.add(data);
}

/**
 * clear data.
 */
DataSet.prototype.clear = function (args) {
    this._data = []; // map with data indexed by id
}

/**
 * remove data.
 */
DataSet.prototype.remove = function (args) {};

/**
 * update data.
 */
DataSet.prototype.update = function (cbk, condition) {

    var data = this._data;

    var item = null;
    for (var i = 0; i < data.length; i++) {
        if (condition) {
            var flag = true;
            for (var key in condition) {
                if (data[i][key] != condition[key]) {
                    flag = false;
                }
            }
            if (flag) {
                cbk && cbk(data[i]);
            }
        } else {
            cbk && cbk(data[i]);
        }
    }

    this._dataCache = JSON.parse(JSON.stringify(this._data));

    this._trigger('change');
};

/**
 * transfer coordinate.
 */
DataSet.prototype.transferCoordinate = function (data, transferFn, fromColumn, toColumnName) {

    toColumnName = toColumnName || '_coordinates';
    fromColumn = fromColumn || 'coordinates';

    for (var i = 0; i < data.length; i++) {

        var geometry = data[i].geometry;
        var coordinates = geometry[fromColumn];
        switch (geometry.type) {
            case 'Point':
                geometry[toColumnName] = transferFn(coordinates);
                break;
            case 'LineString':
                var newCoordinates = [];
                for (var j = 0; j < coordinates.length; j++) {
                    newCoordinates.push(transferFn(coordinates[j]));
                }
                geometry[toColumnName] = newCoordinates;
                break;
            case 'MultiLineString':
            case 'Polygon':
                var newCoordinates = getPolygon(coordinates);
                geometry[toColumnName] = newCoordinates;
                break;
            case 'MultiPolygon':
                var newCoordinates = [];
                for (var c = 0; c < coordinates.length; c++) {
                    var polygon = coordinates[c];
                    var polygon = getPolygon(polygon);
                    newCoordinates.push(polygon);
                }

                geometry[toColumnName] = newCoordinates;
                break;
        }

    }

    function getPolygon(coordinates) {
        var newCoordinates = [];
        for (var c = 0; c < coordinates.length; c++) {
            var coordinate = coordinates[c];
            var newcoordinate = [];
            for (var j = 0; j < coordinate.length; j++) {
                newcoordinate.push(transferFn(coordinate[j]));
            }
            newCoordinates.push(newcoordinate);
        }
        return newCoordinates;
    }

    return data;
};

DataSet.prototype.initGeometry = function (transferFn) {

    if (transferFn) {

        this._data.forEach(function (item) {
            item.geometry = transferFn(item);
        });

    } else {

        this._data.forEach(function (item) {
            if (!item.geometry) {
                if (item.lng && item.lat) {
                    item.geometry = {
                        type: 'Point',
                        coordinates: [item.lng, item.lat]
                    }
                } else if (item.city) {
                    var center = cityCenter.getCenterByCityName(item.city);
                    if (center) {
                        item.geometry = {
                            type: 'Point',
                            coordinates: [center.lng, center.lat]
                        }
                    }
                }
            }
        });
    }

}

/**
 * 获取当前列的最大值
 */
DataSet.prototype.getMax = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var max = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value > max) {
            max = value;
        }
    }

    return max;
}

/**
 * 获取当前列的总和
 */
DataSet.prototype.getSum = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var sum = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i][columnName]) {
            sum += parseFloat(data[i][columnName]);
        }
    }

    return sum;
}

/**
 * 获取当前列的最小值
 */
DataSet.prototype.getMin = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var min = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value < min) {
            min = value;
        }
    }

    return min;
}

/**
 * 获取去重的数据
 */
DataSet.prototype.getUnique = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var maps = {};

    for (var i = 1; i < data.length; i++) {
        maps[data[i][columnName]] = true;
    }

    var data = [];
    for (var key in maps) {
        data.push(key);
    }

    return data;
}

function deepCopy(obj) {
    var newObj;
    if (typeof obj == 'object') {
        newObj = obj instanceof Array ? [] : {};
        for (var i in obj) {
            newObj[i] = obj[i] instanceof HTMLElement ? obj[i] : deepCopy(obj[i]);
        }
    } else {
        newObj = obj
    }
    return newObj;
}

export default DataSet;
