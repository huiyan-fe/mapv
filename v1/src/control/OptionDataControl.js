/**
 * @file this object is to deal with the optional datas
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
/* globals util */

function OptionalData(superObj) {
    // set params
    var options = superObj.options || {};
    this.drawType = options.drawType;
    this.super = superObj;
    // init options
    this.options = options.drawOptions || {};
    // init css
    this.initCSS();
    // append dom to body
    this.initDom();
    // bind event
    this.bindEvent();
}

OptionalData.prototype.initCSS = function () {
    util.addCssByStyle([
        '.controlBox { position:absolute; left:0px; top:0px; background:rgba(0,0,0,0.5); padding:10px; }',
        '.controlBox input {border-radius:6px; border:none; padding:10px;}',
        '.controlBox button ',
        '{ padding:8px 10px; border:none; width:40%; margin-left: 10px; border-radius:6px; cursor:pointer; }',
        '.controlBoxBlock { color:#fff; padding: 10px; }',
        '.controlBoxTitle { display:inline-block; width:100px; text-align:right; padding-right:10px; }'
    ].join('\n'));
};

/**
 * append the content to body
 * @return {DOM} return the appneded dom
 */
OptionalData.prototype.initDom = function () {
    var box = this.box = document.createElement('div');
    box.className = 'controlBox';
    var contentBox = this.contentBox = document.createElement('div');
    var btnBox = document.createElement('div');
    btnBox.style.textAlign = 'center';
    var updateBtn = this.updateBtn = document.createElement('button');
    var resetBtn = this.resetBtn = document.createElement('button');
    updateBtn.textContent = 'update';
    resetBtn.textContent = 'reset';
    box.appendChild(contentBox);
    btnBox.appendChild(updateBtn);
    btnBox.appendChild(resetBtn);
    box.appendChild(btnBox);
    document.body.appendChild(box);
    return box;
};

/**
 * init the controller to box
 */

OptionalData.prototype.initController = function (layer, drawType) {
  return false
    this._layer = layer;
    var self = this;
    var options;

    if (drawType) {
        var drawer = layer._getDrawer(drawType);
        options = self.options = drawer.getDrawOptions();
        self.drawType = drawType;
    } else {
        options = self.options;
    }

    var editTag = options.editable;

    if (!editTag) {
        self.box.style.display = 'none';
        return false;
    } else {
        self.box.style.display = 'block';
    }

    self.contentBox.innerHTML = '';

    var newTag = [];
    for (var i = 0; i < editTag.length; i++) {
        var tag = editTag[i];
        if (typeof (tag) === 'string') {
            tag = {
                name: tag,
                type: 'text'
            };
            editTag[i] = tag;
        }
        if (options[tag.name]) {
            makeLabelInput(tag);
            editTag[i]._oldVal = options[tag.name];
            newTag.push(editTag[i]);
        }
    }
    options.editable = newTag;

    function makeLabelInput(tag) {
        var box = document.createElement('div');
        box.className = 'controlBoxBlock';

        var span = document.createElement('span');
        span.textContent = tag.name;
        span.className = 'controlBoxTitle';
        // span.style.padding = '0 10px';

        // if type equal value , show normal inoput
        // if type equal option , show checkboxk
        var optionBox;
        if (tag.type === 'text' || tag.type === 'color') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.name = tag.name;
            input.value = options[tag.name];
            input.type = tag.type;
            optionBox.appendChild(input);
        } else if (tag.type === 'option') {
            optionBox = document.createElement('span');
            for (var i = 0; i < tag.value.length; i++) {
                var label = document.createElement('label');
                label.style.padding = '0 10px 0  0';
                label.style.cursor = 'pointer';
                var radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = tag.name;
                radio.value = tag.value[i];
                if (options[tag.name] === tag.value[i]) {
                    radio.checked = true;
                }
                var labelSpan = document.createElement('span');
                labelSpan.textContent = tag.value[i];
                label.appendChild(radio);
                label.appendChild(labelSpan);
                optionBox.appendChild(label);
            }
        } else if (tag.type === 'check') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.name = tag.name;
            input.checked = options[tag.name];
            optionBox.appendChild(input);
        } else if (tag.type === 'json') {
            optionBox = document.createElement('label');
            var input = document.createElement('input');
            input.setAttribute("isJson", true);
            input.name = tag.name;
            input.value = JSON.stringify(options[tag.name]);
            optionBox.appendChild(input);
        } else {
            return false;
        }

        box.appendChild(span);
        box.appendChild(optionBox);
        self.contentBox.appendChild(box);
    }
};

/**
 * bind update and reset button's event
 */
OptionalData.prototype.bindEvent = function () {
    var self = this;
    this.updateBtn.onclick = function () {
        for (var i = 0; i < self.options.editable.length; i++) {
            var name = self.options.editable[i].name;
            var val = self.contentBox.querySelector('input[name="' + name + '"]');
            if (val) {
                if (val.type === 'radio') {
                    val = self.contentBox.querySelector('input[name="' + name + '"]:checked');
                    self.options[name] = val.value;
                } else if (val.type === 'checkbox') {
                    val = self.contentBox.querySelector('input[name="' + name + '"]');
                    self.options[name] = val.checked;
                } else {
                    if (val.getAttribute('isJson') === 'true') {
                        console.log(1);
                        self.options[name] = JSON.parse(val.value);
                    } else {
                        self.options[name] = val.value;
                    }
                }

            }
        }

        var drawer = self._layer._getDrawer(self.drawType);
        drawer.setDrawOptions(self.options);
        self._layer.draw();
    };

    this.resetBtn.onclick = function () {
        for (var i = 0; i < self.options.editable.length; i++) {
            var name = self.options.editable[i].name;
            var oldVal = self.options.editable[i]._oldVal;
            self.options[name] = oldVal;
        }
        var drawer = this._layer._getDrawer(self.drawType);
        drawer.setDrawOptions(self.options);
        this._layer.draw();
        self.initController();
        // console.log('reset', self.options);
    };
};
