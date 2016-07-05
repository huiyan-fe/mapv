/**
 * Data
 * @author Mofei Zhu <zhuwenlong@baidu.com>
 */


/**
 * TODO: 网格聚合
 */

var config = {
    dataType: ['point', 'line', 'polygon'],
    drawType: {
        'simple': {
            name: '普通',
            useData: ['point', 'line'],
            config: {
                point: {
                    fillStyle: 'rgba(151, 192, 247, 0.6)',
                    shadowColor: 'rgba(151, 192, 247, 0.5)',
                    shadowBlur: 10,
                    size: 5,
                },
                line: {
                    strokeStyle: 'rgba(255, 250, 50, 0.3)',
                    shadowColor: 'rgba(255, 250, 50, 1)',
                    shadowBlur: 20,
                    lineWidth: 0.7,
                }
            }
        },
        'bubble': {
            name: '气泡',
            useData: ['point'],
            config: {
                point: {
                    fillStyle: 'rgba(151, 192, 247, 0.6)',
                    maxSize: 20,
                    max: 30,
                    draw: 'bubble'
                }
            }
        },
        'intensity': {
            name: '密度',
            useData: ['point'],
            config: {
                point: {
                    gradient: {
                        0: 'blue',
                        0.5: 'yellow',
                        1: 'red'
                    },
                    max: 30,
                    draw: 'intensity'
                }
            }
        },
        'category': {
            name: '分类',
            useData: ['point'],
            config: {
                point: {
                    splitList: {
                        other: 'white',
                        1: 'blue',
                        2: 'yellow',
                        3: 'red'
                    },
                    size: 2,
                    max: 30,
                    draw: 'category'
                }
            }
        },
        'choropleth': {
            name: '集合',
            useData: ['point'],
            config: {
                point: {
                    splitList: [{
                        start: 0,
                        end: 2,
                        value: 'red'
                    }, {
                        start: 2,
                        end: 4,
                        value: 'yellow'
                    }, {
                        start: 4,
                        value: 'blue'
                    }],
                    max: 30,
                    draw: 'choropleth'
                }
            }
        },
        'heatmap': {
            name: '热力图',
            useData: ['point', 'line'],
            config: {
                point: {
                    radius: 19,
                    gradient: {
                        0.25: "rgb(0,0,255)",
                        0.55: "rgb(0,255,0)",
                        0.85: "yellow",
                        1.00: "rgb(255,0,0)"
                    },
                    max: 100,
                    draw: 'heatmap'
                },
                line: {
                    gradient: {
                        0.25: "rgb(0,0,255)",
                        0.55: "rgb(0,255,0)",
                        0.85: "yellow",
                        1.00: "rgb(255,0,0)"
                    },
                    max: 30,
                    strength: 0.3,
                    // strokeStyle: 'rgba(0, 0, 0, 0.9)',
                    draw: 'heatmap'
                }
            }
        },
        'grid': {
            name: '网格',
            useData: ['point'],
            config: {
                point: {
                    shadowColor: 'rgba(255, 250, 50, 1)',
                    shadowBlur: 20,
                    gridWidth: 30,
                    globalAlpha: 0.5,
                    gradient: {
                        0: 'white',
                        1: 'red'
                    },
                    draw: 'grid'
                }
            }
        },
        'honeycomb': {
            name: '蜂窝',
            useData: ['point'],
            config: {
                point: {
                    shadowColor: 'rgba(255, 250, 50, 1)',
                    shadowBlur: 20,
                    max: 100,
                    gridWidth: 30,
                    globalAlpha: 0.5,
                    gradient: {
                        0: 'white',
                        1: 'blue'
                    },
                    draw: 'honeycomb'
                }
            }
        },
        'text': {
            name: '文本',
            useData: [],
            config: {
                point: {}
            }
        },
        'icon': {
            name: '图标',
            useData: [],
            config: {
                point: {}
            }
        },
        'animate': {
            name: '动画',
            useData: [],
            config: {
                point: {}
            }
        },
        'time': {
            name: '时间动画',
            useData: [],
            config: {
                point: {}
            }
        },
    }
}

export default config;