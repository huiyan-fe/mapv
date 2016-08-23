/**
 * @file just a config file
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */
define(function () {
	var drawOptions = {
		simple: {
			size: 1.5,
			fillStyle: 'rgba(239, 168, 0, 0.8)',
			editable: ['size', 'fillStyle']
		},
		bubble: {
			splitList: [{
				start: 1,
				end: 2,
				size: 1
			}, {
				start: 2,
				end: 3,
				size: 2
			}, {
				start: 3,
				end: 4,
				size: 3
			}, {
				start: 4,
				end: 5,
				size: 4
			}, {
				start: 5,
				size: 6
			}],
			globalCompositeOperation: 'lighter',
			fillStyle: 'rgba(239, 168, 0, 0.8)',
			editable: ['strokeStyle', 'fillStyle', 'globalCompositeOperation', {
				name: 'splitList',
				type: 'json'
			}]
		},
		choropleth: {
			size: 2,
			fillStyle: 'rgba(130, 195, 44, 0.8)',
			splitList: [{
				start: 1,
				end: 2,
				color: 'rgba(198, 225, 22, 0.8)'
			}, {
				start: 2,
				end: 3,
				color: 'rgba(251, 221, 12, 0.8)'
			}, {
				start: 3,
				end: 4,
				color: 'rgba(243, 165, 0, 0.8)'
			}, {
				start: 4,
				end: 5,
				color: 'rgba(230, 119, 10, 0.8)'
			}, {
				start: 5,
				color: 'rgba(223, 66, 3, 0.8)'
			}],
			editable: ['size', {
				name: 'splitList',
				type: 'json'
			}]
		},
		density: {
			size: '30',
			unit: 'px',
			type: 'honeycomb',
			showNum: true,
			editable: ['size', {
				name: 'unit',
				type: 'option',
				value: ['px', 'm']
			}, {
				name: 'type',
				type: 'option',
				value: ['honeycomb', 'brick']
			}, {
				name: 'showNum',
				type: 'check'
			}]
		},
		heatmap: {
			size: 500,
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
			editable: ['size', 'max', 'maxOpacity', {
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
			size: 2,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			editable: ['size']
		},
		intensity: {
			size: 2,
			max: 10,
			fillStyle: 'rgba(55, 55, 255, 0.8)',
			editable: ['size', 'max']
		},
		cluster: {},
		polyline: {
			lineWidth: 1,
            strokeStyle: "rgba(255, 50, 50, 1)",
			editable: ['lineWidth', 'strokeStyle']
		}
	};
	return {
		drawOptions: drawOptions
	}
})
