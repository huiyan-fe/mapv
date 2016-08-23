/*
* Js模块文件的入口
* by hyi
*/
(function($) {

    var btnl = $('.btn-l');
    var btnSrc = $('.btn-src');
    var btnRef = $('.btn-refresh');
    var left = $('.left');
    var right = $('.right');
    var effect = $('.effect');
    var lines = $('.lines');
    var isSrc = false, isHide = false, hasChange = false;
    var editor = null;

    function changeSize() {
        $('.container').css('min-height',$(window).height()+'px');
        $('.code').css('height',$(window).height() + 'px');
        $('.allexamples').css({'min-height': $(window).height() + 'px'});
        $('.all-inner').css('width',$(window).width() - 300 + 'px');
        $('.right').css('width',$(window).width() - 300 + 'px');
    };

    function initEditor() {
        if(!editor) {
            editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                lineWrapping:true, //是否显示scroll
                lineNumbers: true, //是否显示number
                styleActiveLine: true,
                matchBrackets: true,
                mode: 'htmlmixed',
                viewportMargin: Infinity
            });
        }else {
            editor.setValue($('#code').val());
        }

    };

    function hasChanged() {
       editor.on('change', function () {
           hasChange = true;
       })
    };

    function changeInnerSize() {
       if (isHide) {
            $('.all-inner').css('width', $(window).width() - 300 + 'px');
            isHide = false;
        } else {
            $('.all-inner').css('width', $(window).width()  + 'px')
            isHide = true;
        }
    };

    function runCode() {
        var iframeContent=$("#code").val();
        if(editor){
            iframeContent=editor.getValue();
        }
        var nr=iframeContent.indexOf("<body>");
        var iframeHead=iframeContent.slice(0,nr);
        var iframeFooter=iframeContent.slice(nr,iframeContent.length);
        var iFrame=document.getElementById("iframes").contentWindow;
        iFrame.document.open();
        iFrame.document.write(iframeHead);
        iFrame.document.write(iframeFooter);
        iFrame.document.close();
    };

    btnl.click(function() {
        $(this).toggleClass('btn-l-r');
        left.toggleClass("l-trf-r");
        right.toggleClass("r-trf-l");
        lines.toggleClass("lines-arrow");
        if(isHide) {
            setTimeout(function() {
                $('.right').width($(window).width()-300);
            },500)
        }else {
            $('.right').width($(window).width());
        }
        changeInnerSize();

    });

    btnSrc.click(function() {
        effect.toggleClass('effect-l');
        isSrc ? $(this).text('源码')&&(isSrc=false) : $(this).text('运行')&&(isSrc=true);
        isSrc ? $('.oprbtns').addClass('refresh_show') : $('.oprbtns').removeClass('refresh_show');
        hasChanged();
        if(hasChange) {
           runCode()
           hasChange  = false;
        }
    });

    btnRef.click(function() {
        $('#code').val(localStorage.content);
        initEditor();
        runCode();
    });

    if($('.effect').length) {
        var curLink = '.' + $("#iframes").attr('src').slice(10).split('.')[0];
        $(curLink).css('color','#337ab7');  //左侧连接current效果
        $('.container').css('overflow','hidden');   //overflow小bug
        var url = $("#iframes").attr('src');
        url && $.get(url,function(data) {
            localStorage.content = data;
            $('#code').val(data);
            initEditor();
        });
    }else {
        $('.index') && $('.index').css('color','#337ab7');  //左侧连接current效果
    }

    changeSize();
    $(window).resize(function () {
        changeSize();
    });

    var examples = $('.allexamples .item p');
    examples.click(function (e) {
        var url = $(this).prev().attr('alt') + '.html';
        location.href = url;
    });

    $('.allexamples .item').hover(function(event){
        $(this).find("p").stop(true,true);
        $(this).find("p").css("display","block").animate({opacity:0.7},200);
    },function(){
        $(this).find("p").stop(true,true);
        $(this).find("p").animate({opacity:0},200).css("display","none");
    })

})(jQuery)

