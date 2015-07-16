define(function () {
	var callbackFn = null;
	// reader
	var reader = new FileReader();
	reader.addEventListener('load', function (e) {
		var text = reader.result;
		var draw = formatRender(text);
		if(draw && callbackFn){
			callbackFn(draw)
		}
	});

	function formatRender(dataStr) {
		var data = false;
		var wrongType = false;
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
			try {
				data = [];
				var dataT = dataStr.split('\n');
				if(dataT.length <= 1) {
					dataT = dataStr.split('\\n');
				}
				var keys = dataT[0].split(',');
				for(var i = 1; i < keys.length; i++) {
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

	$('body').on('dragover', '.E-upload', function () {
		event.preventDefault();
	});
	$('body').on('drop', '.E-upload', function () {
		event.preventDefault();
		reader.readAsText(event.dataTransfer.files[0]);
		reader.fileName = event.dataTransfer.files[0].name;
		reader.fileSize = event.dataTransfer.files[0].size;
		return false;
	});

	function addCallback(fn){
		callbackFn = fn;
	}
	return addCallback;
});
