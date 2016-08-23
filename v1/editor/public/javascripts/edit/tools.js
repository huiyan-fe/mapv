/**
 * @file some tools
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function(){
    var tools = {
        /**
         * get search from the href
         * @return {Object} the query object
         */
        getSearch:function(){
            var search = location.search.substr(1);
            search = search.split('&');
            var query = {};
            for(var i in search){
                var temp = search[i].split('=');
                query[temp[0]]=temp[1]
            }
            return query;
        }
    };

    return tools;

})
