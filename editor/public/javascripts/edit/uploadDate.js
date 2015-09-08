/**
 * @file this file is to control the update file
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(['editActions'],function (editor) {
	var callbackFn = null;
	// new reader to get the file which user upload
	var reader = new FileReader();
	reader.addEventListener('load', function (e) {
		var text = reader.result;
		var draw = formatRender(text);
		if(draw && callbackFn){
			editor.setData(draw);
			// //
			callbackFn(draw);
		}
	});

	/**
	 * for the the string to data object
	 * we only support JSON and CSV files
	 * @param  {String} dataStr the file's content
	 * @return {Object}         return the formated data
	 */
	function formatRender(dataStr) {
		var data = false;
		var wrongType = false;
		// try to deal with the JSON data
		try {
			data = JSON.parse(dataStr.replace(/\s/g, ''));
			var count = 0;
			while(typeof (data) === 'string' && count <= 10) {
				data = JSON.parse(data);
				count++;
			}
			wrongType = false;
		} catch(e) {
			wrongType = true;
		}

		if(wrongType) {
			// try to deal with the CSV data
			try {
				data = [];
				var dataT = dataStr.split('\n');
				console.log(dataT);
				var keys = dataT[0].split(',');
				for(var i = 1; i < dataT.length; i++) {
					var values = dataT[i].split(',');
					var obj = {};
					var nonameIndex = 0;
					for(var j = 0; j < values.length; j++) {
						var name = keys[j] || 'noname' + (nonameIndex++);
						name = name.replace(/\\r/g, '');
						obj[name] = Number(values[j].replace(/\\r/g, '').replace(/\"/g, ''));
					}
					data.push(obj);
				}
				data = JSON.stringify(data).replace(/\\r/g, '');
				data = JSON.parse(data);
				wrongType = false;
			} catch(e) {
				window.console.log(e);
				wrongType = true;
			}
		}

		return data;
	}

	// listen for the dragover event
	$('body').on('dragover', /*'.E-upload',*/ function () {
		event.preventDefault();
	});

	// listen for the drop event
	$('body').on('drop', /*'.E-upload',*/ function () {
		event.preventDefault();
		reader.readAsText(event.dataTransfer.files[0]);
		reader.fileName = event.dataTransfer.files[0].name;
		reader.fileSize = event.dataTransfer.files[0].size;
		return false;
	});

	$('body').on('change','.E-upload-fild',function(e){
		var file = this.files[0];
		reader.readAsText(file);
		reader.fileName = file.name;
		reader.fileSize = file.size;
	})

	function addCallback(fn){
		callbackFn = fn;
	}
	return addCallback;
});
