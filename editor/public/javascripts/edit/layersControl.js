define(function(){
    function layer(){
        this.layers={};
    }

    // layer control
    layer.prototype.addLayer = function(layer){
        var self = this;
        self.layers[layer.getName()] = layer;
    }

    layer.prototype.removeLayer = function(layerName){

    }

    layer.prototype.getLayer = function(layerName){
        var self = this;
        return self.layers[layerName];
    }

    return layer;
})
