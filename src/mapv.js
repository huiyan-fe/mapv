/**
 * @author mofei / http://zhuwenlong.com/
 */

'use strict';

// the version ruler [version.subversion.update]
var version = '2.0.1';

//
var MAPV = function(dom, options) {
    // make sure use as CLASS
    if (!(this instanceof MAPV)) {
        throw Error('MAPV muse use as a CLASS, try to new it');
    }
    this.version = version;
}

//
global.MAPV = MAPV;
