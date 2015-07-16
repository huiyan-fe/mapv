define(function () {
	var drawOptions = {
		simple: {
			radius: 1.5,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			editable: ['radius', 'fillStyle']
		},
		bubble: {
			splitList: [{
				start: 1,
				end: 2,
				radius: 1
			}, {
				start: 2,
				end: 3,
				radius: 2
			}, {
				start: 3,
				end: 4,
				radius: 3
			}, {
				start: 4,
				end: 5,
				radius: 4
			}, {
				start: 5,
				radius: 6
			}],
			globalCompositeOperation: 'lighter',
			fillStyle: 'rgba(50, 50, 255, 0.8)',
			editable: ['strokeStyle', 'fillStyle', 'globalCompositeOperation', {
				name: 'splitList',
				type: 'json'
			}]
		},
		choropleth: {
			radius: 2,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			splitList: [{
				start: 1,
				end: 2,
				color: 'rgba(17, 102, 252, 0.8)'
			}, {
				start: 2,
				end: 3,
				color: 'rgba(52, 139, 251, 0.8)'
			}, {
				start: 3,
				end: 4,
				color: 'rgba(110, 176, 253, 0.8)'
			}, {
				start: 4,
				end: 5,
				color: 'rgba(255, 241, 193, 0.8)'
			}, {
				start: 5,
				color: 'rgba(255, 146, 149, 0.8)'
			}],
			editable: ['radius', {
				name: 'splitList',
				type: 'json'
			}]
		},
		density: {
			gridWidth: '30',
			gridUnit: 'px',
			gridType: 'honeycomb',
			showNum: true,
			editable: ['gridWidth', {
				name: 'gridUnit',
				type: 'option',
				value: ['px', 'm']
			}, {
				name: 'gridType',
				type: 'option',
				value: ['honeycomb', 'brick']
			}, {
				name: 'showNum',
				type: 'check'
			}]
		},
		heatmap: {
			radius: 500,
			maxOpacity: 0.8,
			max: 100,
			blur: true,
			type: 'arc',
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			gradient: {
				'0.4': 'blue',
				'0.6': 'cyan',
				'0.7': 'lime',
				'0.8': 'yellow',
				'1.0': 'red'
			},
			editable: ['radius', 'max', 'maxOpacity', {
				name: 'gradient',
				type: 'json'
			}, {
				name: 'blur',
				type: 'check'
			}, {
				name: 'type',
				type: 'option',
				value: ['rect', 'arc']
			}]
		},
		category: {
			radius: 2,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			editable: ['radius']
		},
		intensity: {
			radius: 2,
			max: 10,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			editable: ['radius', 'max']
		},
		cluster: {
			// gridWidth: '30',
			// gridUnit: 'px',
			// showNum: true,
			// editable: ['gridWidth', {
			//     name: 'gridUnit',
			//     type: 'option',
			//     value: ['px', 'm']
			// }, {
			//     name: 'showNum',
			//     type: 'check'
			// }]
		}
	};
	return {
		drawOptions: drawOptions
	}
})
