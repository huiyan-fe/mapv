/**
 * @file 示例代码
 */
/* globals Drawer mercatorProjection BMap util Mapv*/
// 创建Map实例
var map = new BMap.Map('map', {
    enableMapClick: false
        //vectorMapLevel: 3
});
var mercatorProjection = map.getMapType().getProjection();
map.centerAndZoom(new BMap.Point(116.403119, 39.928658), 12); // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 启用滚轮放大缩小
var mapv;
var data = null;
var options = {
    map: map
};
mapv = new Mapv(options);

/*******/
function edit(){
    this.init()
}

edit.prototype.init = function(){
    // append dom
    var add = this.domAdd = document.createElement('div');
    add.setAttribute('class','E-add');
    document.body.appendChild(add);
    var funBox = this.funBox = document.createElement('div');
    funBox.setAttribute('class','E-funBox');
    funBox.innerHTML='<div class="E-funBox-title">标题</div><div class="E-funBox-content"></div>';
    document.body.appendChild(funBox);
    var contentBox = document.querySelector('.E-funBox-content');

    // upload
    var upload = this.domUpload = document.createElement('div');
    upload.setAttribute('class','E-upload');
    upload.textContent = '拖拽文件上传数据';
    contentBox.appendChild(upload);

    // edit
    var edit = this.domedit = document.createElement('div');
    edit.setAttribute('class','E-eidt');
    edit.innerHTML=[
        '<div>',
            '<div class="E-editTitle">网格类型</div>',
            '<div class="E-editBlock">',
                '<a href="#" class="E-type E-typeA">类型一</a>',
                '<a href="#" class="E-type E-typeB">类型一</a>',
                '<a href="#" class="E-type E-typeC">类型一</a>',
            '</div>',
            '<div class="E-editTitle">半径</div>',
            '<div class="E-editBlock">',
                '<input type="text" class="E-input">',
            '</div>',
            '<div class="E-editTitle">单位</div>',
            '<div class="E-editBlock">',
                '<button class="E-button">按钮</button>',
                '<button class="E-button">按钮</button>',
            '</div>',
            '<div class="E-editTitle">是否启用</div>',
            '<div class="E-editBlock">',
                '<label class="E-label"><input type="checkbox"> 是否启用</label>',
            '</div>',
            '<div class="E-editBlock">',
                '<button class="E-button">确定</button>',
            '</div>',
        '</div>'
    ].join('');
    contentBox.appendChild(edit);
}

new edit();
