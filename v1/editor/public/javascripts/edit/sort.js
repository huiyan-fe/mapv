/**
 * @file this file is a View event , user can rank the layers buy drag .
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function(){
    var app;
    var tar = {
        dom : null,
        y: 0,
        pageY : 0,
        list : {},
        points : [],
        isChange: false
    };

    // init the tar object
    function tarinit(){
        tar = {
            dom : null,
            y: 0,
            pageY : 0,
            list : {},
            points : [],
            isChange: false
        };
    }

    // listen for the mousedown event
    $('body').on('mousedown','.E-layers-layer',function(e){
        tar.dom = $(this);
        tar.pageY = e.pageY;
        tar.y = $(this).position().top;
        tar.points = [];
        $('.E-layers-layer').each(function(index,dom){
            var name = $(dom).attr('name');
            var top = $(dom).position().top;
            tar.list[name] = {'top':top,dom:$(dom)};
            tar.points.push(top);
            $(dom).css({
                'top' : top,
                'z-index' : 10
            });
        }).css({
            'position' : 'absolute'
        });
        console.log(tar)
        tar.points.sort(function(a,b){
            return a-b;
        });
        $(this).css({
            'z-index' : 100
        });
        e.preventDefault();
    });

    // listen for the mousmove event
    $('body').on('mousemove',function(e){
        if(tar.dom){
            var top = tar.y + (e.pageY - tar.pageY)
            tar.dom.css({
                top: top
            })
            moveCheck(top);
            e.preventDefault();
        }
    });

    // listen for the mouseup envet
    $('body').on('mouseup',function(e){
        if(tar.dom){
            tar.dom = null;
            e.preventDefault();
            moveBack();
            if(tar.isChange){
                //
                var doms = [];
                for(var i in tar.list){
                    doms.push(tar.list[i]);
                }
                doms.sort(function(a,b){
                    return a.top - b.top;
                })
                for(var i=0,len=doms.length;i<len;i++){
                    var name  = doms[i].dom.attr('name');
                    app.getLayer(name).setZIndex(i);
                    doms[i].dom.attr('style','');
                    $('.E-layers').append(doms[i].dom)
                }

            }
            //
            tarinit();
            $('.E-layers-layer').removeAttr('style');
            return false;
        }
    });

    // when you drag a event , doing this test
    // if the pos is max than the max data or is min than the min data call the changePos funstion
    function moveCheck(pos){
        var y = tar.y;
        var list = tar.list;
        var points = tar.points;
        var min, max;
        var index = points.indexOf(y);
        if(index < 1){
            min = 0;
        }
        if(index >= points.length - 1){
            max = document.body.clientHeight;
        }
        min = min || points[index-1] ||  0;
        max = max || points[index+1] ||  document.body.clientHeight;
        // console.log(min,max)
        if(pos > max){
            changePos(max)
            var depth = max - tar.y;
            tar.y = max;
            tar.pageY += 60;
            moveBack();
            tar.isChange = true;
        }

        if(pos < min){
            changePos(min)
            var depth = max - tar.y;
            tar.y = min;
            tar.pageY -= 60
            moveBack();
            tar.isChange = true;
        }
    }

    // change the pos of two object
    function changePos(val){
        var moveObjName = tar.dom[0].getAttribute('name');
        var moveObj = tar.list[moveObjName];
        var moveObjPosTop = moveObj.top;
        var newObj;
        for(var i in tar.list){
            if(tar.list[i].top == val){
                newObj = tar.list[i]
                break;
            }
        }
        var newObjPosTop = newObj.top;
        moveObj.top = newObjPosTop;
        newObj.top = moveObjPosTop;
    }

    // when you release an object it will cann this function
    function moveBack(){
        for(var i in tar.list){
            if(tar.dom && tar.dom.attr('name') && tar.list[i].dom.attr('name')){
                if(tar.dom.attr('name') === tar.list[i].dom.attr('name')){
                    continue;
                }
            }

            tar.list[i].dom.animate({
                top:tar.list[i].top
            },200);
        }
    }

    // init
    function init(obj){
        app = obj;
    }
    return {init:init};
})
