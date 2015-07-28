/**
 * @file this file is control share
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

define(['editActions','login'],function(edit,login){
    //
    $('body').on('click','.user-block-layers',function(){
        var box = edit.showBox('管理项目',{top:'70px',right:'80px'});
        var config = login.config();
        var html = '<table>';
        html += '<tr><th>Name</th><th>Layers Count</th><th>Operation</th></tr>'
        for(i in config){
            html += '<tr>';
            html += '<td>'+i+'</td>'
            var count=0;
            for(var j in config[i].layers){
                count ++;
            }
            html += '<td>'+count+'</td>'
            html += '<td><button class="E-button E-button-addLayer E-button-active">Switch</button></td>'
            html += '</tr>';
        }
        html += '</table>';
        box.innerHTML = '<div style="padding: 10px;">'+html+'</div>';
    })

    $('body').on('click','.user-block-share',function(){
        console.log(login.config())
        edit.showBox('分享项目',{top:'70px',right:'80px'})
    })
})
