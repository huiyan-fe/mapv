/**
 * LoadData
 * this data hander user upload files
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */

class LoadData {

    constructor(options) {
        this.options = options;
        this.initEvent();
    }

    initEvent() {
        var self = this;
        console.log('init envet');

        var dropbox = document;
        dropbox.addEventListener("dragenter", dragenter, false);
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drop, false);
        function dragenter(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        function dragover(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        function drop(e) {
            e.stopPropagation();
            e.preventDefault();

            var dt = e.dataTransfer;
            var files = dt.files;

            handleFiles(files);
        }

        function handleFiles(files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function (e) {
                    console.time('progress data')
                    var data = e.target.result;
                    // progress data
                    var dataByLine = data.split('\n');
                    var dataByLineTable = dataByLine.map(function (item) {
                        return item.split('\t');
                    });
                    // scan data & clean data;
                    var dataCount = dataByLineTable.length < 100 ? dataByLineTable.length : 100;
                    var dataCountFrequency = {};
                    for (var i = 0; i < dataCount; i++) {
                        var count = dataByLineTable[i].length;
                        dataCountFrequency[count] = dataCountFrequency[count] || 0;
                        dataCountFrequency[count]++;
                    }
                    // - get the frequenced;
                    var dataMaxHited = {
                        value: null,
                        count: 0
                    };
                    for (var i in dataCountFrequency) {
                        if (dataCountFrequency[i] > dataMaxHited.count) {
                            dataMaxHited = {
                                value: i,
                                count: dataCountFrequency[i]
                            }
                        }
                    }
                    // - filter 
                    dataByLineTable.filter(function (value) {
                        return value.length == dataMaxHited.value;
                    })
                    //
                    self.options.addData && self.options.addData(dataByLineTable);

                    console.timeEnd('progress data')
                };
                reader.readAsText(file);
            }
        }
    }


}

export default LoadData;