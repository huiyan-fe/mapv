/**
 * @file control and cache the layers
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function(){
    // the layers object
    function layer(){
        this.layers = window.layers={};
    }

    /**
     * add layer
     * @param  {Object} layer the layer info
     */
    layer.prototype.addLayer = function(layer){
        var self = this;
        self.layers[layer.getName()] = layer;
    }

    // TODO: remove layer form
    layer.prototype.removeLayer = function(layerName){
        var self = this;
    }

    /**
     * get the layer by name
     * @param  {String} layerName the layer's name
     * @return {Object}           the layer
     */
    layer.prototype.getLayer = function(layerName){
        var self = this;
        return self.layers[layerName];
    }

    return layer;
})
