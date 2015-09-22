/*
* Js模块文件的入口
* by hyi
*/
(function($) {

    var btnl = $('.btn-l');
    var btnr = $('.btn-r');
    var left = $('.left');
    var right = $('.right');
    var effect = $('.effect');
    var btnRun = $('.btn-run');
    var lines = $('.lines');
    var isSrc = false;
    var hasChange = false;

    function changeSize() {
        $('.container').css('min-height',$(window).height()+'px');
        $('.code').css('height',$(window).height()+'px');
        $('.allexamples').css({
            'min-height': $(window).height() + 'px',
        });

    }
    changeSize();

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineWrapping:true, //是否显示scroll
        lineNumbers: true, //是否显示number
        styleActiveLine: true,
        matchBrackets: true,
        mode: 'text/javascript',
        viewportMargin: Infinity
    });

    function clear() {
        bmap.clearOverlays();
    }

    function hasChanged() {
       editor.on('change', function () {
           hasChange = true;
       })
    }

    btnl.click(function() {
        $(this).toggleClass('btn-l-r');
        left.toggleClass("l-trf-r");
        right.toggleClass("r-trf-l");
        lines.toggleClass("lines-arrow");
    })

    btnr.click(function() {
        effect.toggleClass('effect-l');
        isSrc ? $(this).text('源码')&&(isSrc=false) : $(this).text('运行')&&(isSrc=true);
        hasChanged();
        if(hasChange) {
           runCode()
           hasChange  = false;
        }
    })

    var num = $('.nav ul li ul a');
    num.click(function (e) {
        $('.examples').css('color','#000');
        num.css('color','#000');
        $(this).css('color','#337ab7');
        btnr.text('源码');
        isSrc = false;
        btnr.show();
        $('.allexamples').hide();
        clear();
        effect.removeClass('effect-l');
        var basUrl = 'js/ajax/';
        var url = basUrl + $(this).attr('class') + '.js';
        e.preventDefault();
        $.getScript(url,function(data,textStatus,jqxhr) {
            editor.setValue(data);
        })
    });

    var examples = $('.allexamples .item p');
    examples.click(function (e) {
        btnr.text('源码');
        isSrc = false;
        btnr.show();
        $('.allexamples').hide();
        clear();
        effect.removeClass('effect-l');
        var basUrl = 'js/ajax/';
        var url = basUrl + $(this).prev().attr('alt') + '.js';
        console.log(url);
        e.preventDefault();
        $.getScript(url,function(data,textStatus,jqxhr) {
            editor.setValue(data);
        })
    });

    $('.allexamples .item').hover(function(event){
        $(this).find("p").stop(true,true);
        $(this).find("p").css("display","block").animate({opacity:0.7},200);
    },function(){
        $(this).find("p").stop(true,true);
        $(this).find("p").animate({opacity:0},200).css("display","none");
    })
    function runCode() {
        clear()
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.innerHTML = editor.getValue();
        document.body.appendChild(newScript);
    }

})(jQuery)

