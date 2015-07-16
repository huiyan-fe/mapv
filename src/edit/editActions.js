define(['config'], function(config) {
    function edit() {
        this.init();
        this.actions();
    }
    edit.prototype.init = function() {
        var add = this.domAdd = document.createElement('div');
        add.setAttribute('class', 'E-add');
        add.textContent = '+';
        document.body.appendChild(add);
    };
    edit.prototype.showBox = (function() {
            var boxDom;

            function addDom() {
                // append dom
                var funBox = document.createElement('div');
                funBox.setAttribute('class', 'E-funBox');
                funBox.innerHTML =
                    '<div class="E-funBox-title"></div><div class="E-funBox-content"></div>';
                document.body.appendChild(funBox);
                return funBox;
            }
            return function(title) {
                if (!boxDom) {
                    boxDom = addDom();
                }
                // console.log()
                var titleDom = boxDom.querySelector(
                    '.E-funBox-title');
                titleDom.innerHTML = title;
                boxDom.style.display = 'block';
                var content = boxDom.querySelector(
                    '.E-funBox-content');
                content.innerHTML = '';
                return content;
            }
        })()
        // showUpload
    edit.prototype.showUpload = function() {
        // shwobox
        var box = this.showBox('上传文件 (1/2)');
        // add upload content
        var upload = this.domUpload = document.createElement('div');
        upload.setAttribute('class', 'E-upload');
        upload.textContent = '拖拽文件上传数据';
        box.appendChild(upload);
    };
    // showedit
    edit.prototype.shwoEdit = function() {
        // shwobox
        var box = this.showBox('设置图层 (2/2)');
        // edit
        var edit = this.domedit = document.createElement('div');
        edit.setAttribute('class', 'E-eidt');
        edit.innerHTML = ['<div>',
            '<div class="E-editTitle">图层类型</div>',
            '<div class="E-editBlock E-typesArea"></div>',
            '<div class="E-editArea"></div>',
            '<div class="E-editTitle">是否启用</div>',
            '<div class="E-editBlock">',
            '<label class="E-label E-label-active"><input type="checkbox" checked="checked" name="isEnable"> 是否启用</label>',
            '</div>', '<div class="E-editBlock">',
            '<button class="E-button E-button-addLayer E-button-active">确定</button>',
            '</div>', '</div>'
        ].join('');
        box.appendChild(edit);
        // show types
        var layers = config.drawOptions;
        var layHtml = [];
        for (var i in layers) {
            layHtml.push('<a href="#" class="E-type E-type-' + i +
                '" data-type="' + i + '">' + i + '</a>')
        }
        edit.querySelector('.E-typesArea').innerHTML = layHtml.join(
            '');
        edit.querySelector('.E-type').click();
    };
    // bind actions
    edit.prototype.actions = function() {
        var self = this;
        this.domAdd.addEventListener('click', function() {
            // self.showUpload()
            self.shwoEdit()
        }, false);
        // change graph type
        $('body').on('click', '.E-type', function() {
            $('.E-type').removeClass('E-type-active');
            $(this).addClass('E-type-active');
            var type = $(this).attr('data-type');
            var typeConfig = config.drawOptions[type];
            //prepare for the setings
            console.log(typeConfig)
            var configHtml = [];
            if (typeConfig.editable) {
                for (var i = 0, len = typeConfig.editable.length; i <
                    len; i++) {
                    var key = typeConfig.editable[i];
                    console.log('----', key, typeConfig.editable)
                    if ((typeof(key) === 'string' || typeof(
                            key) === 'json') && typeConfig[
                            key]) {
                        var tempHtml =
                            '<div class="E-editBlock">';
                        tempHtml +=
                            '<div class="E-editTitle">' +
                            key + '</div>';
                        tempHtml +=
                            '<div class="E-editBlock"><input type="text" class="E-input" name="' +
                            key + '" value="' + typeConfig[
                                key] + '"></div>';
                        tempHtml += '</div>';
                        configHtml.push(tempHtml);
                    } else {
                        if (key.type === 'check') {
                            var tempHtml =
                                '<div class="E-editBlock">';
                            tempHtml +=
                                '<div class="E-editTitle">' +
                                key.name + '</div>';
                            tempHtml +=
                                '<div class="E-editBlock"><label class="E-label"><input name="' +
                                key + '" type="checkbox"> ' +
                                key.name + '</label></div>';
                            tempHtml += '</div>'
                            configHtml.push(tempHtml);
                        } else if (key.type === 'option') {
                            var tempHtml =
                                '<div class="E-editBlock">';
                            tempHtml +=
                                '<div class="E-editTitle">' +
                                key.name + '</div>';
                            tempHtml +=
                                '<div class="E-editBlock">';
                            for (var i = 0, len = key.value.length; i < len; i++) {
                                if (i === 0) {
                                    tempHtml += '<button class="E-button E-button-active">' + key.value[i] + '</button>';
                                } else {
                                    tempHtml += '<button class="E-button">' + key.value[i] + '</button>';
                                }
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
        // add layer
        $('body').on('click', '.E-button-addLayer', function() {
            var config = {};
            config.type = $('.E-type-active').attr(
                'data-type');
            config.option = {
                enable: $('input[name="isEnable"]')[0].checked
            };
            $('.E-editArea input').each(function(index, dom) {
                config.option[dom.name] = $(dom).val();
            });
            console.log(config);
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
    };
    return edit;
})
