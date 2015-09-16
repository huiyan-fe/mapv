/**
 * @file this file is control share
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

define(['editActions','databank','tools','gitOp'],function(edit,databank,tools,git){
    function getProject(){
        var query = tools.getSearch();
        if(query.project && databank.get('config')[query.project]){
            return query.project;
        }else{
            return 'default';
        }
    }
    // menage project
    $('body').on('click','.user-block-layers',function(){
        var box = edit.showBox('管理项目',{top:'70px',right:'80px'});
        var config = databank.get('config');
        console.log(config)
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
            html += '<td><button class="E-button E-button-changeproject E-button-active" name="'+i+'">Switch</button></td>'
            html += '</tr>';
        }
        html += '</table>';
        box.innerHTML = '<div style="padding: 10px;">'+html+'</div>';
    });

    // share project
    $('body').on('click','.user-block-share',function(){
        var box = edit.showBox('分享项目',{top:'70px',right:'80px'});
        if( getProject() == 'default'){
            var html = [
                '<div class="E-editBlock">',
                    '<div class="E-editBlock">您现在在默认项目上编辑，分享后将自动为该项目命名，并生产分享链接，你可以通过该链接将项目分享给其他人。</div>',
                    '<div class="E-editBlock">',
                        '<button class="E-button E-button-active E-button-share" >确定分享</button>',
                    '</div>',
                '</div>'
            ].join('');
            box.innerHTML = '<div style="padding: 10px;">'+html+'</div>';
        }else{
            showLink();
        }
    });

    $('body').on('click','.E-button-share',function(){
        var projectID=(+new Date()).toString(36)+'_'+(Math.random()*10e8|0).toString(36);
        history.pushState(null, null, '?user=' + databank.get('user').username + '&project=' + projectID);
        // change config.default to new projectID;
        var conf = databank.get('config');
        conf[projectID] = conf.default;
        delete conf.default;

        // update conf
        console.info('config updating');
        var data = {
            'message': 'update config',
            'content': git.utf8_to_b64(JSON.stringify(conf))
        };
        git.updateFiles({
            token: databank.get('user').session,
            user: databank.get('user').username,
            path: 'mapv_config.json',
            data: data,
            success:function(){
                console.info('config updated');
                showLink();
            }
        })
        return false;
    });

    function showLink(){
        var url = location.protocol+'//'+location.host;
        url += '?user=' + databank.get('user').username + '&project=' + getProject();
        var box = edit.showBox('分享项目',{top:'70px',right:'80px'});
        var html = [
            '<div class="E-editBlock">',
                '<div class="E-editTitle">分享地址</div>',
                '<div class="E-editBlock"><input type="text" class="E-input" name="radius" value="' + url + '"></div>',
            '</div>'
        ].join('');
        box.innerHTML = '<div style="padding: 10px;">' + html + '</div>';
    }

    var baseUrl = location.href.replace(/\?.*$/, '');
    // change project
    $('body').on('click','.E-button-changeproject',function(){
        var projectName = $(this).attr('name');
        var username = databank.get('user').username;
        var url =  baseUrl  + '?user=' + username + '&project=' + projectName;
        location.href=url;
    });

    // change project
    $('body').on('click','.user-block-home',function(){
        var url =  baseUrl;
        location.href=url;
    });
    //
    return {
        init:function(){
            if(databank.get('user').session){
                if(tools.getSearch.user && tools.getSearch.user !== databank.get('user').username ){
                    $('.login-box').append('<div title="个人主页" class="user-block user-block-home">Home</div>');
                }else{
                    $('.login-box').append('<div title="项目管理" class="user-block user-block-layers"></div>');
                    $('.login-box').append('<div title="分享项目" class="user-block user-block-share"></div>');
                }
            }
        }
    }
})
