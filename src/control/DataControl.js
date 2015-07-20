/**
 * @file this file is to supprot customer data
 * @author Mofei Zhu <zhuwenlong@baidu.ocm>
 */

function DataControl(superObj) {
    this.initDom();
    this.initEvent();
    this.super = superObj;
    this.geoData = superObj.geoData;
    // console.log(this.geoData.setData);
}

DataControl.prototype.initDom = function () {
    var control = this.control = document.createElement('div');

    var input = this.input = document.createElement('input');
    input.type = 'file';
    var tipstitle = document.createElement('div');
    tipstitle.textContent = '自定义数据：';
    var tips = document.createElement('div');
    tips.textContent = '拖拽文件到窗口或者选择自定义文件';

    control.appendChild(tipstitle);
    control.appendChild(tips);
    control.appendChild(input);
    control.style.fontSize = '12px';
    control.style.lineHeight = '1.8em';
    control.style.position = 'absolute';
    control.style.bottom = '50px';
    control.style.left = '10px';
    control.style.padding = '10px 20px';
    control.style.color = '#FFF';
    control.style.background = 'rgba(0,0,0,0.5)';
    control.style.zIndex = '100000';
    control.style.overflow = 'hidden';
    control.style.webkitTransition = 'all 0.5s ease-in';

    var history = document.createElement('div');
    var historyTitle = document.createElement('div');
    historyTitle.textContent = '历史数据';
    this.history = document.createElement('div');
    history.appendChild(historyTitle);
    history.appendChild(this.history);
    control.appendChild(history);

    document.body.appendChild(control);
};

DataControl.prototype.initEvent = function () {
    var self = this;
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {

        var text = reader.result;
        var draw = formatRender(text);

        if (draw) {
            var filenames = localStorage.getItem('filenames') || '{}';
            filenames = JSON.parse(filenames);
            if (!reader.fileName || !reader.fileSize) {
                console.log('no fileName or fileSize , save faild ');
                return false;
            }
            for (var i in filenames) {
                if (filenames[i].name === this.fileName && filenames[i].size === this.fileSize) {
                    return false;
                }
            }
            var saveName = this.fileName + this.fileSize + parseInt(Math.random() * 1e17, 10).toString(36);
            filenames[saveName] = {
                size: this.fileSize,
                name: this.fileName
            };
            // console.log(filenames)
            localStorage.setItem('filenames', JSON.stringify(filenames));
            localStorage.setItem(saveName, JSON.stringify(text));
            self.initHistory();
        }
    });

    self.history.addEventListener('click', function (e) {
        var node = e.target;
        if (node.nodeName === 'A') {
            var storageName = node.getAttribute('storageName');
            var dataStr = localStorage.getItem(storageName);
            formatRender(dataStr);
        }
        return false;
    });

    self.input.addEventListener('change', function (e) {
        reader.readAsText(e.target.files[0]);
        reader.fileName = e.target.files[0].name;
        reader.fileSize = e.target.files[0].size;
    });

    document.addEventListener('dragover', function (event) {
        event.preventDefault();
    }, false);
    document.addEventListener('drop', function (event) {
        event.preventDefault();
        reader.readAsText(event.dataTransfer.files[0]);
        reader.fileName = event.dataTransfer.files[0].name;
        reader.fileSize = event.dataTransfer.files[0].size;
        return false;
    });

    function formatRender(dataStr) {

        var data;
        var wrongType = false;

        try {
            data = JSON.parse(dataStr.replace(/\s/g, ''));
            // console.log('??!@',data)
            var count = 0;
            while (typeof (data) === 'string' && count <= 10) {
                data = JSON.parse(data);
                count++;
            }
            wrongType = false;
        } catch (e) {
            wrongType = true;
        }

        if (wrongType) {
            try {
                data = [];
                var dataT = dataStr.split('\n');
                if (dataT.length <= 1) {
                    dataT = dataStr.split('\\n');
                }

                var keys = dataT[0].split(',');
                // console.log(keys)
                for (var i = 1; i < keys.length; i++) {
                    var values = dataT[i].split(',');
                    var obj = {};
                    var nonameIndex = 0;
                    for (var j = 0; j < values.length; j++) {
                        var name = keys[j] || 'noname' + (nonameIndex++);
                        name = name.replace(/\\r/g, '');
                        obj[name] = Number(values[j].replace(/\\r/g, '').replace(/\"/g, ''));
                    }
                    data.push(obj);
                }

                data = JSON.stringify(data).replace(/\\r/g, '');

                data = JSON.parse(data);

                wrongType = false;
            } catch (e) {
                window.console.log(e);
                wrongType = true;
            }
        }

        if (wrongType) {
            alert('数据格式错误，请检查是否为json或者csv格式数据');
            return false;
        }

        self.geoData.setData(data);
        console.log(self.super._layers)
        for(var i=0;i<self.super._layers.length;i++){
                self.super._layers[i].draw();
        }

        return true;
    }

};
