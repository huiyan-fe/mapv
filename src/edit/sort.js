define(function(){

    setTimeout(function(){
        $('.E-layers').append('<div class="E-layers-block E-layers-layer" name="icbqkadde9236hb">SI</div><div class="E-layers-block E-layers-layer" name="icbqkadfdde96hb">S5I</div><div class="E-layers-block E-layers-layer" name="icbqkaddef96hb">S3I</div>')
    },1000);

    var app;

    var tar = {
        dom : null,
        y: 0,
        pageY : 0,
        list : {},
        points : []
    };

    function tarinit(){
        tar = {
            dom : null,
            y: 0,
            pageY : 0,
            list : {},
            points : []
        };
    }

    $('body').on('mousedown','.E-layers-layer',function(e){
        tar.dom = $(this);
        // console.log(this.name)
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
        tar.points.sort(function(a,b){
            return a-b;
        });
        $(this).css({
            'z-index' : 100
        });
        e.preventDefault();
    });

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

    $('body').on('mouseup',function(e){
        if(tar.dom){
            tar.dom = null;
            e.preventDefault();
            moveBack();
            console.log(tar)
            tarinit();

            //

            //
            return false;
        }
        console.log(app)
    });

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
        }

        if(pos < min){
            changePos(min)
            var depth = max - tar.y;
            tar.y = min;
            tar.pageY -= 60
            moveBack();
        }
    }

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

    function moveBack(){
        // console.log(tar.dom[0].getAttribute('name'),)
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

    function init(app){
        app = app;
    }
    return {init:init};
})
