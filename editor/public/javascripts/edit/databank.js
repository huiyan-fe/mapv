define(function(){
    var data = {};
    return {
        set:function(name,obj){
            data[name] = obj;
        },
        get:function(name){
            data[name] = data[name] || {};
            return data[name] ;
        }
    }
})
