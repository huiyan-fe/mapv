/**
 * @file the main action of edit
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

define(['config', 'layersControl', 'databank', 'tools', 'pickup'], function(config, layersControl, databank, tools, pickup) {
    // edit
    function edit() {
        this.init();
        this.actions();
    }
    // inherit layersControl
    edit.prototype = new layersControl();
    edit.prototype.contructor = edit;
    // init (create the doms)
    edit.prototype.init = function() {
        var layers = this.domAdd = document.createElement('div');
        layers.setAttribute('class', 'E-layers');
        document.body.appendChild(layers);
        var add = this.domAdd = document.createElement('div');
        add.setAttribute('class', 'E-add E-layers-block');
        add.textContent = '+';
        layers.appendChild(add);
    };
    // close the upload or edit box
    edit.prototype.closeBox = function(){
        this.funBox.setAttribute('style','');
        this.funBox.style.display = 'none';
    }
    // show the boxs
    edit.prototype.showBox = (function() {
        var boxDom;
        function addDom() {
            // append dom
            var funBox =  document.createElement('div');
            funBox.setAttribute('class', 'E-funBox');
            funBox.innerHTML = '<div class="E-funBox-title"></div><div class="E-funBox-close">[关闭]</div><div class="E-funBox-content"></div>';
            document.body.appendChild(funBox);
            return funBox;
        }
        return function(title,css) {
            var self = this;
            if (!boxDom) {
                self.funBox = boxDom = addDom();
            }
            var titleDom = boxDom.querySelector('.E-funBox-title');
            titleDom.innerHTML = title;
            boxDom.style.display = 'block';
            var content = boxDom.querySelector('.E-funBox-content');
            content.innerHTML = '';
            if(css){
                if(css.top){
                    boxDom.style.top = css.top
                }
                if(css.right){
                    boxDom.style.right = css.right
                }
            }
            return content;
        }
    })();
    // show Upload box
    edit.prototype.showUpload = function() {
        // shwobox
        var box = this.showBox('上传文件 (1/2)');
        // add upload content
        var html=[
            '<div class="E-upload">',
                '拖拽 或 选择 文件',
                '<input type="file" class="E-upload-fild">',
            '</div>',
            '<div class="E-upload-line">- 或 -</div>',
            '<div class="E-makePoint E-button">手动选择坐标</div>'
        ].join('');
        box.innerHTML = html;
    };
    // show edit box
    edit.prototype.shwoEdit = function(layerName) {
        var self = this;
        var layer = self.getLayer(layerName);
        var layerOpt = layer?layer.getDrawOptions():{};

        var title;
        if(layerName){
            title = '修改图层 ' + layerName;
        }else{
            title = '设置图层 (2/2)';
        }
        // shwobox
        var box = this.showBox(title);
        // edit
        var edit = this.domedit = document.createElement('div');
        edit.setAttribute('class', 'E-eidt');
        edit.innerHTML = ['<div>',
            '<div class="E-editTitle">图层类型</div>',
            '<div class="E-editBlock E-typesArea"></div>',
            '<div class="E-editArea"></div>',
            '<div class="E-editBlock">',
            '<button class="E-button E-button-addLayer E-button-active">确定</button>',
            '<button class="E-button E-button-removeLayer">删除</button>',
            '</div>', '</div>'
        ].join('');
        box.appendChild(edit);
        // show types
        var layers = config.drawOptions;

        var layHtml = [];
        for (var i in layers) {
            layHtml.push('<a href="#" class="E-type E-type-' + i + '" data-type="' + i + '">' + i + '</a>')
        }
        edit.querySelector('.E-typesArea').innerHTML = layHtml.join('');

        // if layer
        if(layerName){
            $(edit).find('.E-button-addLayer').attr('type','editing').attr('name',layerName);
            $(edit).find('.E-button-removeLayer').attr('type','editing').attr('name',layerName);
        };

        if(layer && layer.getDrawType()){
            edit.querySelector('.E-type-' + layer.getDrawType()).click();
        }else{
            edit.querySelector('.E-type').click();
        }
    };
    // bind actions while the edit is done
    edit.prototype.done = function(fn){
        this.done = fn;
    }

    edit.prototype.setData = function(data){
        this.data = data;
    }

    edit.prototype.getData = function(){
        return this.data || {};
    }
    // bind the events
    edit.prototype.actions = function() {
        var self = this;
        this.domAdd.addEventListener('click', function() {
            self.showUpload()
        }, false);
        // change graph type
        $('body').on('click', '.E-type', function() {

            var isEditing = $('.E-button-addLayer').attr('type') === 'editing'; //E-button-addLayer
            var opt = null;
            var typ = null;
            if(isEditing){
                var layerName = $('.E-button-addLayer').attr('name');
                opt = self.getLayer(layerName).getDrawOptions();
                typ = self.getLayer(layerName).getDrawType();
            }


            $('.E-type').removeClass('E-type-active');
            $(this).addClass('E-type-active');
            var type = $(this).attr('data-type');
            var typeConfig = config.drawOptions[type];
            //prepare for the setings
            var configHtml = [];
            if (typeConfig.editable) {
                for (var i = 0, len = typeConfig.editable.length; i < len; i++) {
                    var key = typeConfig.editable[i];

                    if ((typeof(key) === 'string' || typeof(key) === 'json') && typeConfig[key]) {
                        var editVal = typ === type ? opt ? opt[key] : null : null;

                        var tempHtml = '<div class="E-editBlock">';
                        tempHtml += '<div class="E-editTitle">' + key + '</div>';
                        tempHtml += '<div class="E-editBlock"><input type="text" class="E-input" name="' + key + '" value="' + (editVal || typeConfig[key]) + '"></div>';
                        tempHtml += '</div>';
                        configHtml.push(tempHtml);
                    } else {
                        if (key.type === 'check') {
                            continue;
                            var tempHtml = '<div class="E-editBlock">';
                            tempHtml += '<div class="E-editTitle">' + key.name + '</div>';
                            tempHtml += '<div class="E-editBlock"><label class="E-label"><input name="' + key.name + '" type="checkbox"> ' + key.name + '</label></div>';
                            tempHtml += '</div>'
                            configHtml.push(tempHtml);
                        } else if (key.type === 'option') {
                            var editVal = typ === type ? opt ? opt[key.name] : null : null;
                            var tempHtml = '<div class="E-editBlock">';
                            tempHtml += '<div class="E-editTitle">' + key.name + '</div>';
                            tempHtml += '<div class="E-editBlock">';
                            for (var j = 0, jLen = key.value.length; j < jLen; j++) {
                                var isActive = editVal ? key.value[j]===editVal?'E-button-active':'' : j === 0?'E-button-active':'';
                                tempHtml += '<button class="E-button '+ isActive +'" name="' + key.name + '" >' + key.value[j] + '</button>';
                            }
                            tempHtml += '</div></div>'
                            configHtml.push(tempHtml);
                        } else {
                            console.log('@@@', key);
                        }
                    }
                }
            }
            self.domedit.querySelector('.E-editArea').innerHTML = configHtml.join('');
            // change setings
            return false;
        });
        // layer change
        $('body').on('click', '.E-editBlock .E-button', function() {
            var parent = $(this).parents('.E-editBlock');
            parent.find('.E-button').removeClass('E-button-active');
            $(this).addClass('E-button-active');
        });
        // label event
        $('body').on('click', '.E-editBlock input[type=checkbox]', function() {
            var parent = $(this).parents('label');
            if ($(this)[0].checked) {
                parent.addClass('E-label-active')
            } else {
                parent.removeClass('E-label-active')
            }
        });
        // remove a layer
        $('body').on('click', '.E-button-removeLayer', function() {
            var name  = $(this).attr('name');
            if(name){
                $('.E-layers-layer[name="'+name+'"]').remove();
                var project = tools.getSearch().project || 'default';
                var opt = databank.get('config');
                delete opt[project].layers[name];
                databank.uploadConfig(opt);
                self.getLayer(name).setMapv(null);
                self.closeBox();
            }else{
                self.closeBox();
            }
        });

        // add or edit layer
        $('body').on('click', '.E-button-addLayer', function() {
            var config = {};
            config.type = $('.E-type-active').attr('data-type');
            config.option = {
                // enable: $('input[name="isEnable"]')[0].checked
            };
            $('.E-editArea input').each(function(index, dom) {
                config.option[dom.name] = $(dom).val();
            });
            // buttom
            $('.E-button-active').each(function(index,dom){
                config.option[dom.name] = $(dom).html();
            });

            var isEditing = $(this).attr('type') === 'editing';
            if(isEditing){
                var name  = $(this).attr('name');
                self.getLayer(name).setDrawType(config.type);
                self.getLayer(name).setDrawOptions(config.option);
                //set the icon
                $('.E-layers-layer[name="'+name+'"]').html(config.type.substring(0,2).toUpperCase());
                var project = tools.getSearch().project || 'default';
                var opt = databank.get('config');
                var layerOpt = opt[project].layers[name].options;
                layerOpt.option = config.option;
                layerOpt.type = config.type;
                databank.uploadConfig(opt);
            }else{
                console.log('layer Config',config)
                self.done && self.done(config)
            }
            self.closeBox();
            return false;
        });
        //layer edit
        $('body').on('click','.E-layers-layer',function(){
            if($(this).hasClass('icon-downloading')){
                self.closeBox();
                return false;
            }
            var name = $(this).attr('name');
            self.shwoEdit(name);
            return false;
        })
        // close the layer
        $('body').on('click','.E-funBox-close',function(){
            self.closeBox();
        });

        // upload input
        $('body').on('mousemove','.E-upload',function(e){
            // console.log()
            if(e.target === this){
                $('.E-upload-fild').css({
                    top : e.offsetY - 10,
                    left : e.offsetX - 10
                })
            }
        });

        // self point
        $('body').on('click','.E-makePoint',function(){
            self.closeBox();
            var pick = new pickup({
                callback:function(data){
                    if(data.length > 0){
                        self.setData(data);
                        self.shwoEdit();
                    }
                }
            });
            pick.init();
        })
    };

    return new edit();
})
