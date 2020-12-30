(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.mapv = global.mapv || {})));
}(this, (function (exports) { 'use strict';

var version = "2.0.62";

/**
 * @author kyle / http://nikai.us/
 */

var clear = function (context) {
    context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //context.canvas.width = context.canvas.width;
    //context.canvas.height = context.canvas.height;
};

/**
 * @author kyle / http://nikai.us/
 */

var resolutionScale$1 = function (context) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    context.canvas.width = context.canvas.width * devicePixelRatio;
    context.canvas.height = context.canvas.height * devicePixelRatio;
    context.canvas.style.width = context.canvas.width / devicePixelRatio + 'px';
    context.canvas.style.height = context.canvas.height / devicePixelRatio + 'px';
    context.scale(devicePixelRatio, devicePixelRatio);
};

function Event() {
  this._subscribers = {}; // event subscribers
}

/**
 * Subscribe to an event, add an event listener
 * @param {String} event        Event name. Available events: 'put', 'update',
 *                              'remove'
 * @param {function} callback   Callback method. Called with three parameters:
 *                                  {String} event
 *                                  {Object | null} params
 *                                  {String | Number} senderId
 */
Event.prototype.on = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (!subscribers) {
    subscribers = [];
    this._subscribers[event] = subscribers;
  }

  subscribers.push({
    callback: callback
  });
};

/**
 * Unsubscribe from an event, remove an event listener
 * @param {String} event
 * @param {function} callback
 */
Event.prototype.off = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (subscribers) {
    //this._subscribers[event] = subscribers.filter(listener => listener.callback != callback);
    for (var i = 0; i < subscribers.length; i++) {
      if (subscribers[i].callback == callback) {
        subscribers.splice(i, 1);
        i--;
      }
    }
  }
};

/**
 * Trigger an event
 * @param {String} event
 * @param {Object | null} params
 * @param {String} [senderId]       Optional id of the sender.
 * @private
 */
Event.prototype._trigger = function (event, params, senderId) {
  if (event == '*') {
    throw new Error('Cannot trigger event *');
  }

  var subscribers = [];
  if (event in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers[event]);
  }
  if ('*' in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers['*']);
  }

  for (var i = 0, len = subscribers.length; i < len; i++) {
    var subscriber = subscribers[i];
    if (subscriber.callback) {
      subscriber.callback(event, params, senderId || null);
    }
  }
};

/**
 * get the center by the city name
 * @author kyle / http://nikai.us/
 */

var citycenter = { municipalities: [{ n: "北京", g: "116.395645,39.929986|12" }, { n: "上海", g: "121.487899,31.249162|12" }, { n: "天津", g: "117.210813,39.14393|12" }, { n: "重庆", g: "106.530635,29.544606|12" }], provinces: [{ n: "安徽", g: "117.216005,31.859252|8", cities: [{ n: "合肥", g: "117.282699,31.866942|12" }, { n: "安庆", g: "117.058739,30.537898|13" }, { n: "蚌埠", g: "117.35708,32.929499|13" }, { n: "亳州", g: "115.787928,33.871211|13" }, { n: "巢湖", g: "117.88049,31.608733|13" }, { n: "池州", g: "117.494477,30.660019|14" }, { n: "滁州", g: "118.32457,32.317351|13" }, { n: "阜阳", g: "115.820932,32.901211|13" }, { n: "淮北", g: "116.791447,33.960023|13" }, { n: "淮南", g: "117.018639,32.642812|13" }, { n: "黄山", g: "118.29357,29.734435|13" }, { n: "六安", g: "116.505253,31.755558|13" }, { n: "马鞍山", g: "118.515882,31.688528|13" }, { n: "宿州", g: "116.988692,33.636772|13" }, { n: "铜陵", g: "117.819429,30.94093|14" }, { n: "芜湖", g: "118.384108,31.36602|12" }, { n: "宣城", g: "118.752096,30.951642|13" }] }, { n: "福建", g: "117.984943,26.050118|8", cities: [{ n: "福州", g: "119.330221,26.047125|12" }, { n: "龙岩", g: "117.017997,25.078685|13" }, { n: "南平", g: "118.181883,26.643626|13" }, { n: "宁德", g: "119.542082,26.656527|14" }, { n: "莆田", g: "119.077731,25.44845|13" }, { n: "泉州", g: "118.600362,24.901652|12" }, { n: "三明", g: "117.642194,26.270835|14" }, { n: "厦门", g: "118.103886,24.489231|12" }, { n: "漳州", g: "117.676205,24.517065|12" }] }, { n: "甘肃", g: "102.457625,38.103267|6", cities: [{ n: "兰州", g: "103.823305,36.064226|12" }, { n: "白银", g: "104.171241,36.546682|13" }, { n: "定西", g: "104.626638,35.586056|13" }, { n: "甘南州", g: "102.917442,34.992211|14" }, { n: "嘉峪关", g: "98.281635,39.802397|13" }, { n: "金昌", g: "102.208126,38.516072|13" }, { n: "酒泉", g: "98.508415,39.741474|13" }, { n: "临夏州", g: "103.215249,35.598514|13" }, { n: "陇南", g: "104.934573,33.39448|14" }, { n: "平凉", g: "106.688911,35.55011|13" }, { n: "庆阳", g: "107.644227,35.726801|13" }, { n: "天水", g: "105.736932,34.584319|13" }, { n: "武威", g: "102.640147,37.933172|13" }, { n: "张掖", g: "100.459892,38.93932|13" }] }, { n: "广东", g: "113.394818,23.408004|8", cities: [{ n: "广州", g: "113.30765,23.120049|12" }, { n: "潮州", g: "116.630076,23.661812|13" }, { n: "东莞", g: "113.763434,23.043024|12" }, { n: "佛山", g: "113.134026,23.035095|13" }, { n: "河源", g: "114.713721,23.757251|12" }, { n: "惠州", g: "114.410658,23.11354|12" }, { n: "江门", g: "113.078125,22.575117|13" }, { n: "揭阳", g: "116.379501,23.547999|13" }, { n: "茂名", g: "110.931245,21.668226|13" }, { n: "梅州", g: "116.126403,24.304571|13" }, { n: "清远", g: "113.040773,23.698469|13" }, { n: "汕头", g: "116.72865,23.383908|13" }, { n: "汕尾", g: "115.372924,22.778731|14" }, { n: "韶关", g: "113.594461,24.80296|13" }, { n: "深圳", g: "114.025974,22.546054|12" }, { n: "阳江", g: "111.97701,21.871517|14" }, { n: "云浮", g: "112.050946,22.937976|13" }, { n: "湛江", g: "110.365067,21.257463|13" }, { n: "肇庆", g: "112.479653,23.078663|13" }, { n: "中山", g: "113.42206,22.545178|12" }, { n: "珠海", g: "113.562447,22.256915|13" }] }, { n: "广西", g: "108.924274,23.552255|7", cities: [{ n: "南宁", g: "108.297234,22.806493|12" }, { n: "百色", g: "106.631821,23.901512|13" }, { n: "北海", g: "109.122628,21.472718|13" }, { n: "崇左", g: "107.357322,22.415455|14" }, { n: "防城港", g: "108.351791,21.617398|15" }, { n: "桂林", g: "110.26092,25.262901|12" }, { n: "贵港", g: "109.613708,23.103373|13" }, { n: "河池", g: "108.069948,24.699521|14" }, { n: "贺州", g: "111.552594,24.411054|14" }, { n: "来宾", g: "109.231817,23.741166|14" }, { n: "柳州", g: "109.422402,24.329053|12" }, { n: "钦州", g: "108.638798,21.97335|13" }, { n: "梧州", g: "111.305472,23.485395|13" }, { n: "玉林", g: "110.151676,22.643974|14" }] }, { n: "贵州", g: "106.734996,26.902826|8", cities: [{ n: "贵阳", g: "106.709177,26.629907|12" }, { n: "安顺", g: "105.92827,26.228595|13" }, { n: "毕节地区", g: "105.300492,27.302612|14" }, { n: "六盘水", g: "104.852087,26.591866|13" }, { n: "铜仁地区", g: "109.196161,27.726271|14" }, { n: "遵义", g: "106.93126,27.699961|13" }, { n: "黔西南州", g: "104.900558,25.095148|11" }, { n: "黔东南州", g: "107.985353,26.583992|11" }, { n: "黔南州", g: "107.523205,26.264536|11" }] }, { n: "海南", g: "109.733755,19.180501|9", cities: [{ n: "海口", g: "110.330802,20.022071|13" }, { n: "白沙", g: "109.358586,19.216056|12" }, { n: "保亭", g: "109.656113,18.597592|12" }, { n: "昌江", g: "109.0113,19.222483|12" }, { n: "儋州", g: "109.413973,19.571153|13" }, { n: "澄迈", g: "109.996736,19.693135|13" }, { n: "东方", g: "108.85101,18.998161|13" }, { n: "定安", g: "110.32009,19.490991|13" }, { n: "琼海", g: "110.414359,19.21483|13" }, { n: "琼中", g: "109.861849,19.039771|12" }, { n: "乐东", g: "109.062698,18.658614|12" }, { n: "临高", g: "109.724101,19.805922|13" }, { n: "陵水", g: "109.948661,18.575985|12" }, { n: "三亚", g: "109.522771,18.257776|12" }, { n: "屯昌", g: "110.063364,19.347749|13" }, { n: "万宁", g: "110.292505,18.839886|13" }, { n: "文昌", g: "110.780909,19.750947|13" }, { n: "五指山", g: "109.51775,18.831306|13" }] }, { n: "河北", g: "115.661434,38.61384|7", cities: [{ n: "石家庄", g: "114.522082,38.048958|12" }, { n: "保定", g: "115.49481,38.886565|13" }, { n: "沧州", g: "116.863806,38.297615|13" }, { n: "承德", g: "117.933822,40.992521|14" }, { n: "邯郸", g: "114.482694,36.609308|13" }, { n: "衡水", g: "115.686229,37.746929|13" }, { n: "廊坊", g: "116.703602,39.518611|13" }, { n: "秦皇岛", g: "119.604368,39.945462|12" }, { n: "唐山", g: "118.183451,39.650531|13" }, { n: "邢台", g: "114.520487,37.069531|13" }, { n: "张家口", g: "114.893782,40.811188|13" }] }, { n: "河南", g: "113.486804,34.157184|7", cities: [{ n: "郑州", g: "113.649644,34.75661|12" }, { n: "安阳", g: "114.351807,36.110267|12" }, { n: "鹤壁", g: "114.29777,35.755426|13" }, { n: "焦作", g: "113.211836,35.234608|13" }, { n: "开封", g: "114.351642,34.801854|13" }, { n: "洛阳", g: "112.447525,34.657368|12" }, { n: "漯河", g: "114.046061,33.576279|13" }, { n: "南阳", g: "112.542842,33.01142|13" }, { n: "平顶山", g: "113.300849,33.745301|13" }, { n: "濮阳", g: "115.026627,35.753298|12" }, { n: "三门峡", g: "111.181262,34.78332|13" }, { n: "商丘", g: "115.641886,34.438589|13" }, { n: "新乡", g: "113.91269,35.307258|13" }, { n: "信阳", g: "114.085491,32.128582|13" }, { n: "许昌", g: "113.835312,34.02674|13" }, { n: "周口", g: "114.654102,33.623741|13" }, { n: "驻马店", g: "114.049154,32.983158|13" }] }, { n: "黑龙江", g: "128.047414,47.356592|6", cities: [{ n: "哈尔滨", g: "126.657717,45.773225|12" }, { n: "大庆", g: "125.02184,46.596709|12" }, { n: "大兴安岭地区", g: "124.196104,51.991789|10" }, { n: "鹤岗", g: "130.292472,47.338666|13" }, { n: "黑河", g: "127.50083,50.25069|14" }, { n: "鸡西", g: "130.941767,45.32154|13" }, { n: "佳木斯", g: "130.284735,46.81378|12" }, { n: "牡丹江", g: "129.608035,44.588521|13" }, { n: "七台河", g: "131.019048,45.775005|14" }, { n: "齐齐哈尔", g: "123.987289,47.3477|13" }, { n: "双鸭山", g: "131.171402,46.655102|13" }, { n: "绥化", g: "126.989095,46.646064|13" }, { n: "伊春", g: "128.910766,47.734685|14" }] }, { n: "湖北", g: "112.410562,31.209316|8", cities: [{ n: "武汉", g: "114.3162,30.581084|12" }, { n: "鄂州", g: "114.895594,30.384439|14" }, { n: "恩施", g: "109.517433,30.308978|14" }, { n: "黄冈", g: "114.906618,30.446109|14" }, { n: "黄石", g: "115.050683,30.216127|13" }, { n: "荆门", g: "112.21733,31.042611|13" }, { n: "荆州", g: "112.241866,30.332591|12" }, { n: "潜江", g: "112.768768,30.343116|13" }, { n: "神农架林区", g: "110.487231,31.595768|13" }, { n: "十堰", g: "110.801229,32.636994|13" }, { n: "随州", g: "113.379358,31.717858|13" }, { n: "天门", g: "113.12623,30.649047|13" }, { n: "仙桃", g: "113.387448,30.293966|13" }, { n: "咸宁", g: "114.300061,29.880657|13" }, { n: "襄阳", g: "112.176326,32.094934|12" }, { n: "孝感", g: "113.935734,30.927955|13" }, { n: "宜昌", g: "111.310981,30.732758|13" }] }, { n: "湖南", g: "111.720664,27.695864|7", cities: [{ n: "长沙", g: "112.979353,28.213478|12" }, { n: "常德", g: "111.653718,29.012149|12" }, { n: "郴州", g: "113.037704,25.782264|13" }, { n: "衡阳", g: "112.583819,26.898164|13" }, { n: "怀化", g: "109.986959,27.557483|13" }, { n: "娄底", g: "111.996396,27.741073|13" }, { n: "邵阳", g: "111.461525,27.236811|13" }, { n: "湘潭", g: "112.935556,27.835095|13" }, { n: "湘西州", g: "109.745746,28.317951|14" }, { n: "益阳", g: "112.366547,28.588088|13" }, { n: "永州", g: "111.614648,26.435972|13" }, { n: "岳阳", g: "113.146196,29.378007|13" }, { n: "张家界", g: "110.48162,29.124889|13" }, { n: "株洲", g: "113.131695,27.827433|13" }] }, { n: "江苏", g: "119.368489,33.013797|8", cities: [{ n: "南京", g: "118.778074,32.057236|12" }, { n: "常州", g: "119.981861,31.771397|12" }, { n: "淮安", g: "119.030186,33.606513|12" }, { n: "连云港", g: "119.173872,34.601549|12" }, { n: "南通", g: "120.873801,32.014665|12" }, { n: "苏州", g: "120.619907,31.317987|12" }, { n: "宿迁", g: "118.296893,33.95205|13" }, { n: "泰州", g: "119.919606,32.476053|13" }, { n: "无锡", g: "120.305456,31.570037|12" }, { n: "徐州", g: "117.188107,34.271553|12" }, { n: "盐城", g: "120.148872,33.379862|12" }, { n: "扬州", g: "119.427778,32.408505|13" }, { n: "镇江", g: "119.455835,32.204409|13" }] }, { n: "江西", g: "115.676082,27.757258|7", cities: [{ n: "南昌", g: "115.893528,28.689578|12" }, { n: "抚州", g: "116.360919,27.954545|13" }, { n: "赣州", g: "114.935909,25.845296|13" }, { n: "吉安", g: "114.992039,27.113848|13" }, { n: "景德镇", g: "117.186523,29.303563|12" }, { n: "九江", g: "115.999848,29.71964|13" }, { n: "萍乡", g: "113.859917,27.639544|13" }, { n: "上饶", g: "117.955464,28.457623|13" }, { n: "新余", g: "114.947117,27.822322|13" }, { n: "宜春", g: "114.400039,27.81113|13" }, { n: "鹰潭", g: "117.03545,28.24131|13" }] }, { n: "吉林", g: "126.262876,43.678846|7", cities: [{ n: "长春", g: "125.313642,43.898338|12" }, { n: "白城", g: "122.840777,45.621086|13" }, { n: "白山", g: "126.435798,41.945859|13" }, { n: "吉林", g: "126.564544,43.871988|12" }, { n: "辽源", g: "125.133686,42.923303|13" }, { n: "四平", g: "124.391382,43.175525|12" }, { n: "松原", g: "124.832995,45.136049|13" }, { n: "通化", g: "125.94265,41.736397|13" }, { n: "延边", g: "129.485902,42.896414|13" }] }, { n: "辽宁", g: "122.753592,41.6216|8", cities: [{ n: "沈阳", g: "123.432791,41.808645|12" }, { n: "鞍山", g: "123.007763,41.118744|13" }, { n: "本溪", g: "123.778062,41.325838|12" }, { n: "朝阳", g: "120.446163,41.571828|13" }, { n: "大连", g: "121.593478,38.94871|12" }, { n: "丹东", g: "124.338543,40.129023|12" }, { n: "抚顺", g: "123.92982,41.877304|12" }, { n: "阜新", g: "121.660822,42.01925|14" }, { n: "葫芦岛", g: "120.860758,40.74303|13" }, { n: "锦州", g: "121.147749,41.130879|13" }, { n: "辽阳", g: "123.172451,41.273339|14" }, { n: "盘锦", g: "122.073228,41.141248|13" }, { n: "铁岭", g: "123.85485,42.299757|13" }, { n: "营口", g: "122.233391,40.668651|13" }] }, { n: "内蒙古", g: "114.415868,43.468238|5", cities: [{ n: "呼和浩特", g: "111.660351,40.828319|12" }, { n: "阿拉善盟", g: "105.695683,38.843075|14" }, { n: "包头", g: "109.846239,40.647119|12" }, { n: "巴彦淖尔", g: "107.423807,40.76918|12" }, { n: "赤峰", g: "118.930761,42.297112|12" }, { n: "鄂尔多斯", g: "109.993706,39.81649|12" }, { n: "呼伦贝尔", g: "119.760822,49.201636|12" }, { n: "通辽", g: "122.260363,43.633756|12" }, { n: "乌海", g: "106.831999,39.683177|13" }, { n: "乌兰察布", g: "113.112846,41.022363|12" }, { n: "锡林郭勒盟", g: "116.02734,43.939705|11" }, { n: "兴安盟", g: "122.048167,46.083757|11" }] }, { n: "宁夏", g: "106.155481,37.321323|8", cities: [{ n: "银川", g: "106.206479,38.502621|12" }, { n: "固原", g: "106.285268,36.021523|13" }, { n: "石嘴山", g: "106.379337,39.020223|13" }, { n: "吴忠", g: "106.208254,37.993561|14" }, { n: "中卫", g: "105.196754,37.521124|14" }] }, { n: "青海", g: "96.202544,35.499761|7", cities: [{ n: "西宁", g: "101.767921,36.640739|12" }, { n: "果洛州", g: "100.223723,34.480485|11" }, { n: "海东地区", g: "102.085207,36.51761|11" }, { n: "海北州", g: "100.879802,36.960654|11" }, { n: "海南州", g: "100.624066,36.284364|11" }, { n: "海西州", g: "97.342625,37.373799|11" }, { n: "黄南州", g: "102.0076,35.522852|11" }, { n: "玉树州", g: "97.013316,33.00624|14" }] }, { n: "山东", g: "118.527663,36.09929|8", cities: [{ n: "济南", g: "117.024967,36.682785|12" }, { n: "滨州", g: "117.968292,37.405314|12" }, { n: "东营", g: "118.583926,37.487121|12" }, { n: "德州", g: "116.328161,37.460826|12" }, { n: "菏泽", g: "115.46336,35.26244|13" }, { n: "济宁", g: "116.600798,35.402122|13" }, { n: "莱芜", g: "117.684667,36.233654|13" }, { n: "聊城", g: "115.986869,36.455829|12" }, { n: "临沂", g: "118.340768,35.072409|12" }, { n: "青岛", g: "120.384428,36.105215|12" }, { n: "日照", g: "119.50718,35.420225|12" }, { n: "泰安", g: "117.089415,36.188078|13" }, { n: "威海", g: "122.093958,37.528787|13" }, { n: "潍坊", g: "119.142634,36.716115|12" }, { n: "烟台", g: "121.309555,37.536562|12" }, { n: "枣庄", g: "117.279305,34.807883|13" }, { n: "淄博", g: "118.059134,36.804685|12" }] }, { n: "山西", g: "112.515496,37.866566|7", cities: [{ n: "太原", g: "112.550864,37.890277|12" }, { n: "长治", g: "113.120292,36.201664|12" }, { n: "大同", g: "113.290509,40.113744|12" }, { n: "晋城", g: "112.867333,35.499834|13" }, { n: "晋中", g: "112.738514,37.693362|13" }, { n: "临汾", g: "111.538788,36.099745|13" }, { n: "吕梁", g: "111.143157,37.527316|14" }, { n: "朔州", g: "112.479928,39.337672|13" }, { n: "忻州", g: "112.727939,38.461031|12" }, { n: "阳泉", g: "113.569238,37.869529|13" }, { n: "运城", g: "111.006854,35.038859|13" }] }, { n: "陕西", g: "109.503789,35.860026|7", cities: [{ n: "西安", g: "108.953098,34.2778|12" }, { n: "安康", g: "109.038045,32.70437|13" }, { n: "宝鸡", g: "107.170645,34.364081|12" }, { n: "汉中", g: "107.045478,33.081569|13" }, { n: "商洛", g: "109.934208,33.873907|13" }, { n: "铜川", g: "108.968067,34.908368|13" }, { n: "渭南", g: "109.483933,34.502358|13" }, { n: "咸阳", g: "108.707509,34.345373|13" }, { n: "延安", g: "109.50051,36.60332|13" }, { n: "榆林", g: "109.745926,38.279439|12" }] }, { n: "四川", g: "102.89916,30.367481|7", cities: [{ n: "成都", g: "104.067923,30.679943|12" }, { n: "阿坝州", g: "102.228565,31.905763|15" }, { n: "巴中", g: "106.757916,31.869189|14" }, { n: "达州", g: "107.494973,31.214199|14" }, { n: "德阳", g: "104.402398,31.13114|13" }, { n: "甘孜州", g: "101.969232,30.055144|15" }, { n: "广安", g: "106.63572,30.463984|13" }, { n: "广元", g: "105.819687,32.44104|13" }, { n: "乐山", g: "103.760824,29.600958|13" }, { n: "凉山州", g: "102.259591,27.892393|14" }, { n: "泸州", g: "105.44397,28.89593|14" }, { n: "南充", g: "106.105554,30.800965|13" }, { n: "眉山", g: "103.84143,30.061115|13" }, { n: "绵阳", g: "104.705519,31.504701|12" }, { n: "内江", g: "105.073056,29.599462|13" }, { n: "攀枝花", g: "101.722423,26.587571|14" }, { n: "遂宁", g: "105.564888,30.557491|12" }, { n: "雅安", g: "103.009356,29.999716|13" }, { n: "宜宾", g: "104.633019,28.769675|13" }, { n: "资阳", g: "104.63593,30.132191|13" }, { n: "自贡", g: "104.776071,29.359157|13" }] }, { n: "西藏", g: "89.137982,31.367315|6", cities: [{ n: "拉萨", g: "91.111891,29.662557|13" }, { n: "阿里地区", g: "81.107669,30.404557|11" }, { n: "昌都地区", g: "97.185582,31.140576|15" }, { n: "林芝地区", g: "94.349985,29.666941|11" }, { n: "那曲地区", g: "92.067018,31.48068|14" }, { n: "日喀则地区", g: "88.891486,29.269023|14" }, { n: "山南地区", g: "91.750644,29.229027|11" }] }, { n: "新疆", g: "85.614899,42.127001|6", cities: [{ n: "乌鲁木齐", g: "87.564988,43.84038|12" }, { n: "阿拉尔", g: "81.291737,40.61568|13" }, { n: "阿克苏地区", g: "80.269846,41.171731|12" }, { n: "阿勒泰地区", g: "88.137915,47.839744|13" }, { n: "巴音郭楞", g: "86.121688,41.771362|12" }, { n: "博尔塔拉州", g: "82.052436,44.913651|11" }, { n: "昌吉州", g: "87.296038,44.007058|13" }, { n: "哈密地区", g: "93.528355,42.858596|13" }, { n: "和田地区", g: "79.930239,37.116774|13" }, { n: "喀什地区", g: "75.992973,39.470627|12" }, { n: "克拉玛依", g: "84.88118,45.594331|13" }, { n: "克孜勒苏州", g: "76.137564,39.750346|11" }, { n: "石河子", g: "86.041865,44.308259|13" }, { n: "塔城地区", g: "82.974881,46.758684|12" }, { n: "图木舒克", g: "79.198155,39.889223|13" }, { n: "吐鲁番地区", g: "89.181595,42.96047|13" }, { n: "五家渠", g: "87.565449,44.368899|13" }, { n: "伊犁州", g: "81.297854,43.922248|11" }] }, { n: "云南", g: "101.592952,24.864213|7", cities: [{ n: "昆明", g: "102.714601,25.049153|12" }, { n: "保山", g: "99.177996,25.120489|13" }, { n: "楚雄州", g: "101.529382,25.066356|13" }, { n: "大理州", g: "100.223675,25.5969|14" }, { n: "德宏州", g: "98.589434,24.44124|14" }, { n: "迪庆州", g: "99.713682,27.831029|14" }, { n: "红河州", g: "103.384065,23.367718|11" }, { n: "丽江", g: "100.229628,26.875351|13" }, { n: "临沧", g: "100.092613,23.887806|14" }, { n: "怒江州", g: "98.859932,25.860677|14" }, { n: "普洱", g: "100.980058,22.788778|14" }, { n: "曲靖", g: "103.782539,25.520758|12" }, { n: "昭通", g: "103.725021,27.340633|13" }, { n: "文山", g: "104.089112,23.401781|14" }, { n: "西双版纳", g: "100.803038,22.009433|13" }, { n: "玉溪", g: "102.545068,24.370447|13" }] }, { n: "浙江", g: "119.957202,29.159494|8", cities: [{ n: "杭州", g: "120.219375,30.259244|12" }, { n: "湖州", g: "120.137243,30.877925|12" }, { n: "嘉兴", g: "120.760428,30.773992|13" }, { n: "金华", g: "119.652576,29.102899|12" }, { n: "丽水", g: "119.929576,28.4563|13" }, { n: "宁波", g: "121.579006,29.885259|12" }, { n: "衢州", g: "118.875842,28.95691|12" }, { n: "绍兴", g: "120.592467,30.002365|13" }, { n: "台州", g: "121.440613,28.668283|13" }, { n: "温州", g: "120.690635,28.002838|12" }, { n: "舟山", g: "122.169872,30.03601|13" }] }], other: [{ n: "香港", g: "114.186124,22.293586|11" }, { n: "澳门", g: "113.557519,22.204118|13" }, { n: "台湾", g: "120.961454,23.80406|8" }] };

function getCenter(g) {
    var item = g.split("|");
    item[0] = item[0].split(",");
    return {
        lng: parseFloat(item[0][0]),
        lat: parseFloat(item[0][1])
    };
}

var cityCenter = {
    getProvinceNameByCityName: function getProvinceNameByCityName(name) {
        var provinces = citycenter.provinces;
        for (var i = 0; i < provinces.length; i++) {
            var provinceName = provinces[i].n;
            var cities = provinces[i].cities;
            for (var j = 0; j < cities.length; j++) {
                if (cities[j].n == name) {
                    return provinceName;
                }
            }
        }
        return null;
    },
    getCenterByCityName: function getCenterByCityName(name) {
        name = name.replace('市', '');
        for (var i = 0; i < citycenter.municipalities.length; i++) {
            if (citycenter.municipalities[i].n == name) {
                return getCenter(citycenter.municipalities[i].g);
            }
        }

        for (var i = 0; i < citycenter.other.length; i++) {
            if (citycenter.other[i].n == name) {
                return getCenter(citycenter.other[i].g);
            }
        }

        var provinces = citycenter.provinces;
        for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].n == name) {
                return getCenter(provinces[i].g);
            }
            var cities = provinces[i].cities;
            for (var j = 0; j < cities.length; j++) {
                if (cities[j].n == name) {
                    return getCenter(cities[j].g);
                }
            }
        }
        return null;
    }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * @author kyle / http://nikai.us/
 */

/**
 * DataSet
 *
 * A data set can:
 * - add/remove/update data
 * - gives triggers upon changes in the data
 * - can  import/export data in various data formats
 * @param {Array} [data]    Optional array with initial data
 * the field geometry is like geojson, it can be:
 * {
 *     "type": "Point",
 *     "coordinates": [125.6, 10.1]
 * }
 * {
 *     "type": "LineString",
 *     "coordinates": [
 *         [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
 *     ]
 * }
 * {
 *     "type": "Polygon",
 *     "coordinates": [
 *         [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
 *           [100.0, 1.0], [100.0, 0.0] ]
 *     ]
 * }
 * @param {Object} [options]   Available options:
 * 
 */
function DataSet(data, options) {
    Event.bind(this)();

    this._options = options || {};
    this._data = []; // map with data indexed by id

    // add initial data when provided
    if (data) {
        this.add(data);
    }
}

DataSet.prototype = Object.create(Event.prototype);

/**
 * Add data.
 */
DataSet.prototype.add = function (data, senderId) {
    if (Array.isArray(data)) {
        // Array
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i]) {
                if (data[i].time && data[i].time.length == 14 && data[i].time.substr(0, 2) == '20') {
                    var time = data[i].time;
                    data[i].time = new Date(time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)).getTime();
                }
                this._data.push(data[i]);
            }
        }
    } else if (data instanceof Object) {
        // Single item
        this._data.push(data);
    } else {
        throw new Error('Unknown dataType');
    }

    this._dataCache = JSON.parse(JSON.stringify(this._data));
};

DataSet.prototype.reset = function () {
    this._data = JSON.parse(JSON.stringify(this._dataCache));
};

/**
 * get data.
 */
DataSet.prototype.get = function (args) {
    args = args || {};

    //console.time('copy data time')
    var start = new Date();
    // TODO: 不修改原始数据，在数据上挂载新的名称，每次修改数据直接修改新名称下的数据，可以省去deepCopy
    // var data = deepCopy(this._data);
    var data = this._data;

    var start = new Date();

    if (args.filter) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            if (args.filter(data[i])) {
                newData.push(data[i]);
            }
        }
        data = newData;
    }

    if (args.transferCoordinate) {
        data = this.transferCoordinate(data, args.transferCoordinate, args.fromColumn, args.toColumn);
    }

    // console.timeEnd('transferCoordinate time')

    return data;
};

/**
 * set data.
 */
DataSet.prototype.set = function (data) {
    this._set(data);
    this._trigger('change');
};

/**
 * set data.
 */
DataSet.prototype._set = function (data) {
    this.clear();
    this.add(data);
};

/**
 * clear data.
 */
DataSet.prototype.clear = function (args) {
    this._data = []; // map with data indexed by id
};

/**
 * remove data.
 */
DataSet.prototype.remove = function (args) {};

/**
 * update data.
 */
DataSet.prototype.update = function (cbk, condition) {

    var data = this._data;

    var item = null;
    for (var i = 0; i < data.length; i++) {
        if (condition) {
            var flag = true;
            for (var key in condition) {
                if (data[i][key] != condition[key]) {
                    flag = false;
                }
            }
            if (flag) {
                cbk && cbk(data[i]);
            }
        } else {
            cbk && cbk(data[i]);
        }
    }

    this._dataCache = JSON.parse(JSON.stringify(this._data));

    this._trigger('change');
};

/**
 * transfer coordinate.
 */
DataSet.prototype.transferCoordinate = function (data, transferFn, fromColumn, toColumnName) {

    toColumnName = toColumnName || '_coordinates';
    fromColumn = fromColumn || 'coordinates';

    for (var i = 0; i < data.length; i++) {

        var geometry = data[i].geometry;
        var coordinates = geometry[fromColumn];
        switch (geometry.type) {
            case 'Point':
                geometry[toColumnName] = transferFn(coordinates);
                break;
            case 'LineString':
                var newCoordinates = [];
                for (var j = 0; j < coordinates.length; j++) {
                    newCoordinates.push(transferFn(coordinates[j]));
                }
                geometry[toColumnName] = newCoordinates;
                break;
            case 'MultiLineString':
            case 'Polygon':
                var newCoordinates = getPolygon(coordinates);
                geometry[toColumnName] = newCoordinates;
                break;
            case 'MultiPolygon':
                var newCoordinates = [];
                for (var c = 0; c < coordinates.length; c++) {
                    var polygon = coordinates[c];
                    var polygon = getPolygon(polygon);
                    newCoordinates.push(polygon);
                }

                geometry[toColumnName] = newCoordinates;
                break;
        }
    }

    function getPolygon(coordinates) {
        var newCoordinates = [];
        for (var c = 0; c < coordinates.length; c++) {
            var coordinate = coordinates[c];
            var newcoordinate = [];
            for (var j = 0; j < coordinate.length; j++) {
                newcoordinate.push(transferFn(coordinate[j]));
            }
            newCoordinates.push(newcoordinate);
        }
        return newCoordinates;
    }

    return data;
};

DataSet.prototype.initGeometry = function (transferFn) {

    if (transferFn) {

        this._data.forEach(function (item) {
            item.geometry = transferFn(item);
        });
    } else {

        this._data.forEach(function (item) {
            if (!item.geometry) {
                if (item.lng && item.lat) {
                    item.geometry = {
                        type: 'Point',
                        coordinates: [item.lng, item.lat]
                    };
                } else if (item.city) {
                    var center = cityCenter.getCenterByCityName(item.city);
                    if (center) {
                        item.geometry = {
                            type: 'Point',
                            coordinates: [center.lng, center.lat]
                        };
                    }
                }
            }
        });
    }
};

/**
 * 获取当前列的最大值
 */
DataSet.prototype.getMax = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var max = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value > max) {
            max = value;
        }
    }

    return max;
};

/**
 * 获取当前列的总和
 */
DataSet.prototype.getSum = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var sum = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i][columnName]) {
            sum += parseFloat(data[i][columnName]);
        }
    }

    return sum;
};

/**
 * 获取当前列的最小值
 */
DataSet.prototype.getMin = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var min = parseFloat(data[0][columnName]);

    for (var i = 1; i < data.length; i++) {
        var value = parseFloat(data[i][columnName]);
        if (value < min) {
            min = value;
        }
    }

    return min;
};

/**
 * 获取去重的数据
 */
DataSet.prototype.getUnique = function (columnName) {
    var data = this._data;

    if (!data || data.length <= 0) {
        return;
    }

    var maps = {};

    for (var i = 1; i < data.length; i++) {
        maps[data[i][columnName]] = true;
    }

    var data = [];
    for (var key in maps) {
        data.push(key);
    }

    return data;
};

function hex_corner(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

function draw(context, x, y, size) {

    for (var j = 0; j < 6; j++) {

        var result = hex_corner({
            x: x,
            y: y
        }, size, j);

        context.lineTo(result[0], result[1]);
    }
}

/**
 * @author kyle / http://nikai.us/
 */

var pathSimple = {
    drawDataSet: function drawDataSet(context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            this.draw(context, item, options);
        }
    },
    draw: function draw$$1(context, data, options) {
        var type = data.geometry.type;
        var coordinates = data.geometry._coordinates || data.geometry.coordinates;
        var symbol = data.symbol || options.symbol || 'circle';
        switch (type) {
            case 'Point':
                var size = data._size || data.size || options._size || options.size || 5;
                if (symbol === 'circle') {
                    if (options.bigData === 'Point') {
                        context.moveTo(coordinates[0], coordinates[1]);
                    }
                    context.arc(coordinates[0], coordinates[1], size, 0, Math.PI * 2);
                } else if (symbol === 'rect') {
                    context.rect(coordinates[0] - size / 2, coordinates[1] - size / 2, size, size);
                } else if (symbol === 'honeycomb') {
                    draw(context, coordinates[0], coordinates[1], size);
                }
                break;
            case 'LineString':
                this.drawLineString(context, coordinates);
                break;
            case 'MultiLineString':
                for (var i = 0; i < coordinates.length; i++) {
                    var lineString = coordinates[i];
                    this.drawLineString(context, lineString);
                }
                break;
            case 'Polygon':
                this.drawPolygon(context, coordinates);
                break;
            case 'MultiPolygon':
                for (var i = 0; i < coordinates.length; i++) {
                    var polygon = coordinates[i];
                    this.drawPolygon(context, polygon);
                    if (options.multiPolygonDraw) {
                        var flag = options.multiPolygonDraw();
                        if (flag) {
                            return flag;
                        }
                    }
                }
                break;
            default:
                console.error('type' + type + 'is not support now!');
                break;
        }
    },

    drawLineString: function drawLineString(context, coordinates) {
        for (var j = 0; j < coordinates.length; j++) {
            var x = coordinates[j][0];
            var y = coordinates[j][1];
            if (j == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
    },

    drawPolygon: function drawPolygon(context, coordinates) {
        context.beginPath();

        for (var i = 0; i < coordinates.length; i++) {
            var coordinate = coordinates[i];

            context.moveTo(coordinate[0][0], coordinate[0][1]);
            for (var j = 1; j < coordinate.length; j++) {
                context.lineTo(coordinate[j][0], coordinate[j][1]);
            }
            context.lineTo(coordinate[0][0], coordinate[0][1]);
            context.closePath();
        }
    }

};

/**
 * @author kyle / http://nikai.us/
 */

var drawSimple = {
    draw: function draw(context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // console.log('xxxx',options)
        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        // console.log(data);
        if (options.bigData) {
            context.save();
            context.beginPath();

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                pathSimple.draw(context, item, options);
            }

            var type = options.bigData;

            if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                context.fill();

                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }

                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                    context.stroke();
                }
            } else if (type == 'LineString' || type == 'MultiLineString') {
                context.stroke();
            }

            context.restore();
        } else {

            for (var i = 0, len = data.length; i < len; i++) {

                var item = data[i];

                context.save();

                if (item.fillStyle || item._fillStyle) {
                    context.fillStyle = item.fillStyle || item._fillStyle;
                }

                if (item.strokeStyle || item._strokeStyle) {
                    context.strokeStyle = item.strokeStyle || item._strokeStyle;
                }

                if (context.lineDash) {
                    context.setLineDash(context.lineDash);
                }

                if (item.lineDash) {
                    context.setLineDash(item.lineDash);
                }

                var type = item.geometry.type;

                context.beginPath();

                options.multiPolygonDraw = function () {
                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                };
                pathSimple.draw(context, item, options);

                if (type == 'Point' || type == 'Polygon' || type == 'MultiPolygon') {

                    context.fill();

                    if ((item.strokeStyle || options.strokeStyle) && options.lineWidth) {
                        context.stroke();
                    }
                } else if (type == 'LineString' || type == 'MultiLineString') {
                    if (item.lineWidth || item._lineWidth) {
                        context.lineWidth = item.lineWidth || item._lineWidth;
                    }
                    context.stroke();
                }

                context.restore();
            }
        }

        context.restore();
    }
};

function Canvas(width, height) {

    var canvas;

    if (typeof document === 'undefined') {

        // var Canvas = require('canvas');
        // canvas = new Canvas(width, height);

    } else {

        var canvas = document.createElement('canvas');

        if (width) {
            canvas.width = width;
        }

        if (height) {
            canvas.height = height;
        }
    }

    return canvas;
}

/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} [options]   Available options:
 *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
 */
function Intensity(options) {

    options = options || {};
    this.gradient = options.gradient || {
        0.25: "rgba(0, 0, 255, 1)",
        0.55: "rgba(0, 255, 0, 1)",
        0.85: "rgba(255, 255, 0, 1)",
        1.0: "rgba(255, 0, 0, 1)"
    };
    this.maxSize = options.maxSize || 35;
    this.minSize = options.minSize || 0;
    this.max = options.max || 100;
    this.min = options.min || 0;
    this.initPalette();
}

Intensity.prototype.setMax = function (value) {
    this.max = value || 100;
};

Intensity.prototype.setMin = function (value) {
    this.min = value || 0;
};

Intensity.prototype.setMaxSize = function (maxSize) {
    this.maxSize = maxSize || 35;
};

Intensity.prototype.setMinSize = function (minSize) {
    this.minSize = minSize || 0;
};

Intensity.prototype.initPalette = function () {

    var gradient = this.gradient;

    var canvas = new Canvas(256, 1);

    var paletteCtx = this.paletteCtx = canvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, 256, 1);
};

Intensity.prototype.getColor = function (value) {

    var imageData = this.getImageData(value);

    return "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] / 256 + ")";
};

Intensity.prototype.getImageData = function (value) {

    var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

    if (value === undefined) {
        return imageData;
    }

    var max = this.max;
    var min = this.min;

    if (value > max) {
        value = max;
    }

    if (value < min) {
        value = min;
    }

    var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4;

    return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
};

/**
 * @param Number value 
 * @param Number max of value
 * @param Number max of size
 * @param Object other options
 */
Intensity.prototype.getSize = function (value) {

    var size = 0;
    var max = this.max;
    var min = this.min;
    var maxSize = this.maxSize;
    var minSize = this.minSize;

    if (value > max) {
        value = max;
    }

    if (value < min) {
        value = min;
    }

    if (max > min) {
        size = minSize + (value - min) / (max - min) * (maxSize - minSize);
    } else {
        return maxSize;
    }

    return size;
};

Intensity.prototype.getLegend = function (options) {
    var gradient = this.gradient;

    var width = options.width || 20;
    var height = options.height || 180;

    var canvas = new Canvas(width, height);

    var paletteCtx = canvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, width, height);

    return canvas;
};

var global$1 = typeof window === 'undefined' ? {} : window;

var devicePixelRatio = global$1.devicePixelRatio || 1;

/**
 * @author kyle / http://nikai.us/
 */

function createCircle(size) {

    var shadowBlur = size / 2;
    var r2 = size + shadowBlur;
    var offsetDistance = 10000;

    var circle = new Canvas(r2 * 2, r2 * 2);
    var context = circle.getContext('2d');

    context.shadowBlur = shadowBlur;
    context.shadowColor = 'black';
    context.shadowOffsetX = context.shadowOffsetY = offsetDistance;

    context.beginPath();
    context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    return circle;
}

function colorize(pixels, gradient, options) {
    var max = getMax(options);
    var min = getMin(options);
    var diff = max - min;
    var range = options.range || null;

    var jMin = 0;
    var jMax = 1024;
    if (range && range.length === 2) {
        jMin = (range[0] - min) / diff * 1024;
    }

    if (range && range.length === 2) {
        jMax = (range[1] - min) / diff * 1024;
    }

    var maxOpacity = options.maxOpacity || 0.8;
    var minOpacity = options.minOpacity || 0;
    var range = options.range;

    for (var i = 3, len = pixels.length, j; i < len; i += 4) {
        j = pixels[i] * 4; // get gradient color from opacity value

        if (pixels[i] / 256 > maxOpacity) {
            pixels[i] = 256 * maxOpacity;
        }
        if (pixels[i] / 256 < minOpacity) {
            pixels[i] = 256 * minOpacity;
        }

        if (j && j >= jMin && j <= jMax) {
            pixels[i - 3] = gradient[j];
            pixels[i - 2] = gradient[j + 1];
            pixels[i - 1] = gradient[j + 2];
        } else {
            pixels[i] = 0;
        }
    }
}

function getMax(options) {
    var max = options.max || 100;
    return max;
}

function getMin(options) {
    var min = options.min || 0;
    return min;
}

function drawGray(context, dataSet, options) {

    var max = getMax(options);
    var min = getMin(options);
    // console.log(max)
    var size = options._size;
    if (size == undefined) {
        size = options.size;
        if (size == undefined) {
            size = 13;
        }
    }

    var intensity = new Intensity({
        gradient: options.gradient,
        max: max,
        min: min
    });

    var circle = createCircle(size);
    var circleHalfWidth = circle.width / 2;
    var circleHalfHeight = circle.height / 2;

    var data = dataSet;

    var dataOrderByAlpha = {};

    data.forEach(function (item, index) {
        var count = item.count === undefined ? 1 : item.count;
        var alpha = Math.min(1, count / max).toFixed(2);
        dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
        dataOrderByAlpha[alpha].push(item);
    });

    for (var i in dataOrderByAlpha) {
        if (isNaN(i)) continue;
        var _data = dataOrderByAlpha[i];
        context.beginPath();
        if (!options.withoutAlpha) {
            context.globalAlpha = i;
        }
        context.strokeStyle = intensity.getColor(i * max);
        _data.forEach(function (item, index) {
            if (!item.geometry) {
                return;
            }

            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            var type = item.geometry.type;
            if (type === 'Point') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circleHalfWidth, coordinates[1] - circleHalfHeight);
            } else if (type === 'LineString') {
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.beginPath();
                pathSimple.draw(context, item, options);
                context.stroke();
            } else if (type === 'Polygon') {}
        });
    }
}

function draw$1(context, dataSet, options) {
    if (context.canvas.width <= 0 || context.canvas.height <= 0) {
        return;
    }

    var strength = options.strength || 0.3;
    context.strokeStyle = 'rgba(0,0,0,' + strength + ')';

    var shadowCanvas = new Canvas(context.canvas.width, context.canvas.height);
    var shadowContext = shadowCanvas.getContext('2d');
    shadowContext.scale(devicePixelRatio, devicePixelRatio);

    options = options || {};

    var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

    context.save();

    var intensity = new Intensity({
        gradient: options.gradient
    });

    //console.time('drawGray')
    drawGray(shadowContext, data, options);

    //console.timeEnd('drawGray');
    // return false;
    if (!options.absolute) {
        //console.time('changeColor');
        var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
        colorize(colored.data, intensity.getImageData(), options);
        //console.timeEnd('changeColor');
        context.putImageData(colored, 0, 0);

        context.restore();
    }

    intensity = null;
    shadowCanvas = null;
}

var drawHeatmap = {
    draw: draw$1
};

/**
 * @author kyle / http://nikai.us/
 */

var drawGrid = {
    draw: function draw(context, dataSet, options) {

        context.save();

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        var grids = {};

        var size = options._size || options.size || 50;

        // 后端传入数据为网格数据时，传入enableCluster为false，前端不进行删格化操作，直接画方格	
        var enableCluster = 'enableCluster' in options ? options.enableCluster : true;

        var offset = options.offset || {
            x: 0,
            y: 0
        };

        var intensity = new Intensity({
            min: options.min || 0,
            max: options.max || 100,
            gradient: options.gradient
        });

        if (!enableCluster) {
            for (var i = 0; i < data.length; i++) {
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var gridKey = coordinates.join(',');
                grids[gridKey] = data[i].count || 1;
            }
            for (var _gridKey in grids) {
                _gridKey = _gridKey.split(',');

                context.beginPath();
                context.rect(+_gridKey[0] - size / 2, +_gridKey[1] - size / 2, size, size);
                context.fillStyle = intensity.getColor(grids[_gridKey]);
                context.fill();
                if (options.strokeStyle && options.lineWidth) {
                    context.stroke();
                }
            }
        } else {
            for (var _i = 0; _i < data.length; _i++) {
                var coordinates = data[_i].geometry._coordinates || data[_i].geometry.coordinates;
                var gridKey = Math.floor((coordinates[0] - offset.x) / size) + ',' + Math.floor((coordinates[1] - offset.y) / size);
                if (!grids[gridKey]) {
                    grids[gridKey] = 0;
                }

                grids[gridKey] += ~~(data[_i].count || 1);
            }

            for (var _gridKey2 in grids) {
                _gridKey2 = _gridKey2.split(',');

                context.beginPath();
                context.rect(_gridKey2[0] * size + .5 + offset.x, _gridKey2[1] * size + .5 + offset.y, size, size);
                context.fillStyle = intensity.getColor(grids[_gridKey2]);
                context.fill();
                if (options.strokeStyle && options.lineWidth) {
                    context.stroke();
                }
            }
        }

        if (options.label && options.label.show !== false) {

            context.fillStyle = options.label.fillStyle || 'white';

            if (options.label.font) {
                context.font = options.label.font;
            }

            if (options.label.shadowColor) {
                context.shadowColor = options.label.shadowColor;
            }

            if (options.label.shadowBlur) {
                context.shadowBlur = options.label.shadowBlur;
            }

            for (var gridKey in grids) {
                gridKey = gridKey.split(',');
                var text = grids[gridKey];
                var textWidth = context.measureText(text).width;
                if (!enableCluster) {
                    context.fillText(text, +gridKey[0] - textWidth / 2, +gridKey[1] + 5);
                } else {
                    context.fillText(text, gridKey[0] * size + .5 + offset.x + size / 2 - textWidth / 2, gridKey[1] * size + .5 + offset.y + size / 2 + 5);
                }
            }
        }

        context.restore();
    }
};

/**
 * @author kyle / http://nikai.us/
 */

function hex_corner$1(center, size, i) {
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    return [center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad)];
}

var drawHoneycomb = {
    draw: function draw(context, dataSet, options) {

        context.save();

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        for (var key in options) {
            context[key] = options[key];
        }

        var grids = {};

        var offset = options.offset || {
            x: 10,
            y: 10
        };

        var r = options._size || options.size || 40;
        r = r / 2 / Math.sin(Math.PI / 3);
        var dx = r * 2 * Math.sin(Math.PI / 3);
        var dy = r * 1.5;

        var binsById = {};

        for (var i = 0; i < data.length; i++) {
            var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
            var py = (coordinates[1] - offset.y) / dy,
                pj = Math.round(py),
                px = (coordinates[0] - offset.x) / dx - (pj & 1 ? .5 : 0),
                pi = Math.round(px),
                py1 = py - pj;

            if (Math.abs(py1) * 3 > 1) {
                var px1 = px - pi,
                    pi2 = pi + (px < pi ? -1 : 1) / 2,
                    pj2 = pj + (py < pj ? -1 : 1),
                    px2 = px - pi2,
                    py2 = py - pj2;
                if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
            }

            var id = pi + "-" + pj,
                bin = binsById[id];
            if (bin) {
                bin.push(data[i]);
            } else {
                bin = binsById[id] = [data[i]];
                bin.i = pi;
                bin.j = pj;
                bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
                bin.y = pj * dy;
            }
        }

        var intensity = new Intensity({
            max: options.max || 100,
            maxSize: r,
            gradient: options.gradient
        });

        for (var key in binsById) {

            var item = binsById[key];

            context.beginPath();

            for (var j = 0; j < 6; j++) {

                var result = hex_corner$1({
                    x: item.x + offset.x,
                    y: item.y + offset.y
                }, r, j);

                context.lineTo(result[0], result[1]);
            }

            context.closePath();

            var count = 0;
            for (var i = 0; i < item.length; i++) {
                count += item[i].count || 1;
            }
            item.count = count;

            context.fillStyle = intensity.getColor(count);
            context.fill();
            if (options.strokeStyle && options.lineWidth) {
                context.stroke();
            }
        }

        if (options.label && options.label.show !== false) {

            context.fillStyle = options.label.fillStyle || 'white';

            if (options.label.font) {
                context.font = options.label.font;
            }

            if (options.label.shadowColor) {
                context.shadowColor = options.label.shadowColor;
            }

            if (options.label.shadowBlur) {
                context.shadowBlur = options.label.shadowBlur;
            }

            for (var key in binsById) {
                var item = binsById[key];
                var text = item.count;
                if (text < 0) {
                    text = text.toFixed(2);
                } else {
                    text = ~~text;
                }
                var textWidth = context.measureText(text).width;
                context.fillText(text, item.x + offset.x - textWidth / 2, item.y + offset.y + 5);
            }
        }

        context.restore();
    }
};

function createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

function initShaders(gl, vs_source, fs_source) {

    var vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);

    var glProgram = gl.createProgram();

    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    gl.useProgram(glProgram);

    return glProgram;
}

function getColorData(color) {
    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 1;
    tmpCanvas.height = 1;
    tmpCtx.fillStyle = color;
    tmpCtx.fillRect(0, 0, 1, 1);
    return tmpCtx.getImageData(0, 0, 1, 1).data;
}

var vs_s = ['attribute vec4 a_Position;', 'void main() {', 'gl_Position = a_Position;', 'gl_PointSize = 30.0;', '}'].join('');

var fs_s = ['precision mediump float;', 'uniform vec4 u_FragColor;', 'void main() {', 'gl_FragColor = u_FragColor;', '}'].join('');

function draw$2(gl, data, options) {

    if (!data) {
        return;
    }

    var program = initShaders(gl, vs_s, fs_s);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var colored = getColorData(options.strokeStyle || 'red');

    gl.uniform4f(uFragColor, colored[0] / 255, colored[1] / 255, colored[2] / 255, colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    for (var i = 0, len = data.length; i < len; i++) {
        var _geometry = data[i].geometry._coordinates;

        var verticesData = [];

        for (var j = 0; j < _geometry.length; j++) {
            var item = _geometry[j];

            var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
            var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;
            verticesData.push(x, y);
        }

        var vertices = new Float32Array(verticesData);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.LINE_STRIP, 0, _geometry.length);
    }
}

var line = {
    draw: draw$2
};

var vs_s$1 = ['attribute vec4 a_Position;', 'attribute float a_PointSize;', 'void main() {', 'gl_Position = a_Position;', 'gl_PointSize = a_PointSize;', '}'].join('');

var fs_s$1 = ['precision mediump float;', 'uniform vec4 u_FragColor;', 'void main() {', 'gl_FragColor = u_FragColor;', '}'].join('');

function draw$3(gl, data, options) {

    if (!data) {
        return;
    }

    var program = initShaders(gl, vs_s$1, fs_s$1);

    var a_Position = gl.getAttribLocation(program, 'a_Position');

    var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    //gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    var verticesData = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        var item = data[i].geometry._coordinates;

        var x = (item[0] - halfCanvasWidth) / halfCanvasWidth;
        var y = (halfCanvasHeight - item[1]) / halfCanvasHeight;

        if (x < -1 || x > 1 || y < -1 || y > 1) {
            continue;
        }
        verticesData.push(x, y);
        count++;
    }

    var vertices = new Float32Array(verticesData);
    var n = count; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttrib1f(a_PointSize, options._size);

    var colored = getColorData(options.fillStyle || 'red');

    gl.uniform4f(uFragColor, colored[0] / 255, colored[1] / 255, colored[2] / 255, colored[3] / 255);
    gl.drawArrays(gl.POINTS, 0, n);
}

var point = {
    draw: draw$3
};

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, size;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and size are later used to transform coords into integers for z-order calculation
        size = Math.max(maxX - minX, maxY - minY);
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, size);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === signedArea(data, start, end, dim) > 0) {
        for (i = start; i < end; i += dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    } else {
        for (i = end - dim; i >= start; i -= dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) return null;
            again = true;
        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && size) indexCurve(ear, minX, minY, size);

    var stop = ear,
        prev,
        next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (size ? isEarHashed(ear, minX, minY, size) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, size, 1);

                // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, size, 2);

                // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, size);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, size) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x,
        minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y,
        maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x,
        maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, size),
        maxZ = zOrder(maxTX, maxTY, minX, minY, size);

    // first look for points inside the triangle in increasing z-order
    var p = ear.nextZ;

    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.nextZ;
    }

    // then look for points in decreasing z-order
    p = ear.prevZ;

    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, size) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, size);
                earcutLinked(c, triangles, dim, minX, minY, size);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i,
        len,
        start,
        end,
        list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || tan === tanMin && p.x > m.x) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, size) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, size);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i,
        p,
        q,
        e,
        tail,
        numMerges,
        pSize,
        qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }

            qSize = inSize;

            while (pSize > 0 || qSize > 0 && q) {

                if (pSize === 0) {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                } else if (qSize === 0 || !q) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else if (p.z <= q.z) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;
    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and size of the data bounding box
function zOrder(x, y, minX, minY, size) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) / size;
    y = 32767 * (y - minY) / size;

    x = (x | x << 8) & 0x00FF00FF;
    x = (x | x << 4) & 0x0F0F0F0F;
    x = (x | x << 2) & 0x33333333;
    x = (x | x << 1) & 0x55555555;

    y = (y | y << 8) & 0x00FF00FF;
    y = (y | y << 4) & 0x0F0F0F0F;
    y = (y | y << 2) & 0x33333333;
    y = (y | y << 1) & 0x55555555;

    return x | y << 1;
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if (equals(p1, q1) && equals(p2, q2) || equals(p1, q2) && equals(p2, q1)) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 && area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (p.y > py !== p.next.y > py && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;
    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = { vertices: [], holes: [], dimensions: dim },
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) {
                result.vertices.push(data[i][j][d]);
            }
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

var vs_s$2 = ['attribute vec4 a_Position;', 'void main() {', 'gl_Position = a_Position;', 'gl_PointSize = 30.0;', '}'].join('');

var fs_s$2 = ['precision mediump float;', 'uniform vec4 u_FragColor;', 'void main() {', 'gl_FragColor = u_FragColor;', '}'].join('');

function draw$4(gl, data, options) {

    if (!data) {
        return;
    }

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    var program = initShaders(gl, vs_s$2, fs_s$2);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var halfCanvasWidth = gl.canvas.width / 2;
    var halfCanvasHeight = gl.canvas.height / 2;

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uFragColor = gl.getUniformLocation(program, 'u_FragColor');

    var colored = getColorData(options.fillStyle || 'red');

    gl.uniform4f(uFragColor, colored[0] / 255, colored[1] / 255, colored[2] / 255, colored[3] / 255);

    gl.lineWidth(options.lineWidth || 1);

    var verticesArr = [];
    var trianglesArr = [];

    var maxSize = 65536;
    var indexOffset = 0;

    for (var i = 0, len = data.length; i < len; i++) {

        var flatten = earcut.flatten(data[i].geometry._coordinates || data[i].geometry.coordinates);
        var vertices = flatten.vertices;
        indexOffset = verticesArr.length / 2;
        for (var j = 0; j < vertices.length; j += 2) {
            vertices[j] = (vertices[j] - halfCanvasWidth) / halfCanvasWidth;
            vertices[j + 1] = (halfCanvasHeight - vertices[j + 1]) / halfCanvasHeight;
        }

        if ((verticesArr.length + vertices.length) / 2 > maxSize) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);
            verticesArr.length = 0;
            trianglesArr.length = 0;
            indexOffset = 0;
        }

        for (var j = 0; j < vertices.length; j++) {
            verticesArr.push(vertices[j]);
        }

        var triangles = earcut(vertices, flatten.holes, flatten.dimensions);
        for (var j = 0; j < triangles.length; j++) {
            trianglesArr.push(triangles[j] + indexOffset);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArr), gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesArr), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, trianglesArr.length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

var polygon = {
    draw: draw$4
};

/**
 * @author kyle / http://nikai.us/
 */
var webglDrawSimple = {
    draw: function draw(gl, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        if (data.length > 0) {
            if (data[0].geometry.type == "LineString") {
                line.draw(gl, data, options);
            } else if (data[0].geometry.type == "Polygon" || data[0].geometry.type == "MultiPolygon") {
                polygon.draw(gl, data, options);
            } else {
                point.draw(gl, data, options);
            }
        }
    }
};

/**
  * 根据弧线的坐标节点数组
  */
function getCurvePoints(points, options) {
  options = options || {};
  var curvePoints = [];
  for (var i = 0; i < points.length - 1; i++) {
    var p = getCurveByTwoPoints(points[i], points[i + 1], options.count);
    if (p && p.length > 0) {
      curvePoints = curvePoints.concat(p);
    }
  }
  return curvePoints;
}

/**
 * 根据两点获取曲线坐标点数组
 * @param Point 起点
 * @param Point 终点
 */
function getCurveByTwoPoints(obj1, obj2, count) {
  if (!obj1 || !obj2) {
    return null;
  }

  var B1 = function B1(x) {
    return 1 - 2 * x + x * x;
  };
  var B2 = function B2(x) {
    return 2 * x - 2 * x * x;
  };
  var B3 = function B3(x) {
    return x * x;
  };

  var curveCoordinates = [];

  var count = count || 40; // 曲线是由一些小的线段组成的，这个表示这个曲线所有到的折线的个数
  var isFuture = false;
  var t, h, h2, lat3, lng3, j, t2;
  var LnArray = [];
  var i = 0;
  var inc = 0;

  if (typeof obj2 == "undefined") {
    if (typeof curveCoordinates != "undefined") {
      curveCoordinates = [];
    }
    return;
  }

  var lat1 = parseFloat(obj1.lat);
  var lat2 = parseFloat(obj2.lat);
  var lng1 = parseFloat(obj1.lng);
  var lng2 = parseFloat(obj2.lng);

  // 计算曲线角度的方法
  if (lng2 > lng1) {
    if (parseFloat(lng2 - lng1) > 180) {
      if (lng1 < 0) {
        lng1 = parseFloat(180 + 180 + lng1);
        lng2 = parseFloat(180 + 180 + lng2);
      }
    }
  }
  // 此时纠正了 lng1 lng2
  j = 0;
  t2 = 0;
  // 纬度相同
  if (lat2 == lat1) {
    t = 0;
    h = lng1 - lng2;
    // 经度相同
  } else if (lng2 == lng1) {
    t = Math.PI / 2;
    h = lat1 - lat2;
  } else {
    t = Math.atan((lat2 - lat1) / (lng2 - lng1));
    h = (lat2 - lat1) / Math.sin(t);
  }
  if (t2 == 0) {
    t2 = t + Math.PI / 5;
  }
  h2 = h / 2;
  lng3 = h2 * Math.cos(t2) + lng1;
  lat3 = h2 * Math.sin(t2) + lat1;

  for (i = 0; i < count + 1; i++) {
    var x = lng1 * B1(inc) + lng3 * B2(inc) + lng2 * B3(inc);
    var y = lat1 * B1(inc) + lat3 * B2(inc) + lat2 * B3(inc);
    var lng1_src = obj1.lng;
    var lng2_src = obj2.lng;

    curveCoordinates.push([lng1_src < 0 && lng2_src > 0 ? x - 360 : x, y]);
    inc = inc + 1 / count;
  }
  return curveCoordinates;
}

var curve = {
  getPoints: getCurvePoints
};

/* 
FDEB algorithm implementation [www.win.tue.nl/~dholten/papers/forcebundles_eurovis.pdf].

Author:  (github.com/upphiminn)
2013

*/

var ForceEdgeBundling = function ForceEdgeBundling() {
    var data_nodes = {},
        // {'nodeid':{'x':,'y':},..}
    data_edges = [],
        // [{'source':'nodeid1', 'target':'nodeid2'},..]
    compatibility_list_for_edge = [],
        subdivision_points_for_edge = [],
        K = 0.1,
        // global bundling constant controling edge stiffness
    S_initial = 0.1,
        // init. distance to move points
    P_initial = 1,
        // init. subdivision number
    P_rate = 2,
        // subdivision rate increase
    C = 6,
        // number of cycles to perform
    I_initial = 70,
        // init. number of iterations for cycle
    I_rate = 0.6666667,
        // rate at which iteration number decreases i.e. 2/3
    compatibility_threshold = 0.6,
        invers_quadratic_mode = false,
        eps = 1e-8;

    /*** Geometry Helper Methods ***/
    function vector_dot_product(p, q) {
        return p.x * q.x + p.y * q.y;
    }

    function edge_as_vector(P) {
        return { 'x': data_nodes[P.target].x - data_nodes[P.source].x,
            'y': data_nodes[P.target].y - data_nodes[P.source].y };
    }

    function edge_length(e) {
        return Math.sqrt(Math.pow(data_nodes[e.source].x - data_nodes[e.target].x, 2) + Math.pow(data_nodes[e.source].y - data_nodes[e.target].y, 2));
    }

    function custom_edge_length(e) {
        return Math.sqrt(Math.pow(e.source.x - e.target.x, 2) + Math.pow(e.source.y - e.target.y, 2));
    }

    function edge_midpoint(e) {
        var middle_x = (data_nodes[e.source].x + data_nodes[e.target].x) / 2.0;
        var middle_y = (data_nodes[e.source].y + data_nodes[e.target].y) / 2.0;
        return { 'x': middle_x, 'y': middle_y };
    }

    function compute_divided_edge_length(e_idx) {
        var length = 0;
        for (var i = 1; i < subdivision_points_for_edge[e_idx].length; i++) {
            var segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i], subdivision_points_for_edge[e_idx][i - 1]);
            length += segment_length;
        }
        return length;
    }

    function euclidean_distance(p, q) {
        return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
    }

    function project_point_on_line(p, Q) {
        var L = Math.sqrt((Q.target.x - Q.source.x) * (Q.target.x - Q.source.x) + (Q.target.y - Q.source.y) * (Q.target.y - Q.source.y));
        var r = ((Q.source.y - p.y) * (Q.source.y - Q.target.y) - (Q.source.x - p.x) * (Q.target.x - Q.source.x)) / (L * L);

        return { 'x': Q.source.x + r * (Q.target.x - Q.source.x), 'y': Q.source.y + r * (Q.target.y - Q.source.y) };
    }

    /*** ********************** ***/

    /*** Initialization Methods ***/
    function initialize_edge_subdivisions() {
        for (var i = 0; i < data_edges.length; i++) {
            if (P_initial == 1) subdivision_points_for_edge[i] = []; //0 subdivisions
            else {
                    subdivision_points_for_edge[i] = [];
                    subdivision_points_for_edge[i].push(data_nodes[data_edges[i].source]);
                    subdivision_points_for_edge[i].push(data_nodes[data_edges[i].target]);
                }
        }
    }

    function initialize_compatibility_lists() {
        for (var i = 0; i < data_edges.length; i++) {
            compatibility_list_for_edge[i] = [];
        } //0 compatible edges.
    }

    function filter_self_loops(edgelist) {
        var filtered_edge_list = [];
        for (var e = 0; e < edgelist.length; e++) {
            if (data_nodes[edgelist[e].source].x != data_nodes[edgelist[e].target].x && data_nodes[edgelist[e].source].y != data_nodes[edgelist[e].target].y) {
                //or smaller than eps
                filtered_edge_list.push(edgelist[e]);
            }
        }

        return filtered_edge_list;
    }
    /*** ********************** ***/

    /*** Force Calculation Methods ***/
    function apply_spring_force(e_idx, i, kP) {

        var prev = subdivision_points_for_edge[e_idx][i - 1];
        var next = subdivision_points_for_edge[e_idx][i + 1];
        var crnt = subdivision_points_for_edge[e_idx][i];

        var x = prev.x - crnt.x + next.x - crnt.x;
        var y = prev.y - crnt.y + next.y - crnt.y;

        x *= kP;
        y *= kP;

        return { 'x': x, 'y': y };
    }

    function apply_electrostatic_force(e_idx, i, S) {
        var sum_of_forces = { 'x': 0, 'y': 0 };
        var compatible_edges_list = compatibility_list_for_edge[e_idx];

        for (var oe = 0; oe < compatible_edges_list.length; oe++) {
            var force = { 'x': subdivision_points_for_edge[compatible_edges_list[oe]][i].x - subdivision_points_for_edge[e_idx][i].x,
                'y': subdivision_points_for_edge[compatible_edges_list[oe]][i].y - subdivision_points_for_edge[e_idx][i].y };

            if (Math.abs(force.x) > eps || Math.abs(force.y) > eps) {

                var diff = 1 / Math.pow(custom_edge_length({ 'source': subdivision_points_for_edge[compatible_edges_list[oe]][i],
                    'target': subdivision_points_for_edge[e_idx][i] }), 1);

                sum_of_forces.x += force.x * diff;
                sum_of_forces.y += force.y * diff;
            }
        }
        return sum_of_forces;
    }

    function apply_resulting_forces_on_subdivision_points(e_idx, P, S) {
        var kP = K / (edge_length(data_edges[e_idx]) * (P + 1)); // kP=K/|P|(number of segments), where |P| is the initial length of edge P.
        // (length * (num of sub division pts - 1))
        var resulting_forces_for_subdivision_points = [{ 'x': 0, 'y': 0 }];
        for (var i = 1; i < P + 1; i++) {
            // exclude initial end points of the edge 0 and P+1
            var resulting_force = { 'x': 0, 'y': 0 };

            var spring_force = apply_spring_force(e_idx, i, kP);
            var electrostatic_force = apply_electrostatic_force(e_idx, i, S);

            resulting_force.x = S * (spring_force.x + electrostatic_force.x);
            resulting_force.y = S * (spring_force.y + electrostatic_force.y);

            resulting_forces_for_subdivision_points.push(resulting_force);
        }
        resulting_forces_for_subdivision_points.push({ 'x': 0, 'y': 0 });
        return resulting_forces_for_subdivision_points;
    }
    /*** ********************** ***/

    /*** Edge Division Calculation Methods ***/
    function update_edge_divisions(P) {
        for (var e_idx = 0; e_idx < data_edges.length; e_idx++) {

            if (P == 1) {
                subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].source]); // source
                subdivision_points_for_edge[e_idx].push(edge_midpoint(data_edges[e_idx])); // mid point
                subdivision_points_for_edge[e_idx].push(data_nodes[data_edges[e_idx].target]); // target
            } else {

                var divided_edge_length = compute_divided_edge_length(e_idx);
                var segment_length = divided_edge_length / (P + 1);
                var current_segment_length = segment_length;
                var new_subdivision_points = [];
                new_subdivision_points.push(data_nodes[data_edges[e_idx].source]); //source

                for (var i = 1; i < subdivision_points_for_edge[e_idx].length; i++) {
                    var old_segment_length = euclidean_distance(subdivision_points_for_edge[e_idx][i], subdivision_points_for_edge[e_idx][i - 1]);

                    while (old_segment_length > current_segment_length) {
                        var percent_position = current_segment_length / old_segment_length;
                        var new_subdivision_point_x = subdivision_points_for_edge[e_idx][i - 1].x;
                        var new_subdivision_point_y = subdivision_points_for_edge[e_idx][i - 1].y;

                        new_subdivision_point_x += percent_position * (subdivision_points_for_edge[e_idx][i].x - subdivision_points_for_edge[e_idx][i - 1].x);
                        new_subdivision_point_y += percent_position * (subdivision_points_for_edge[e_idx][i].y - subdivision_points_for_edge[e_idx][i - 1].y);
                        new_subdivision_points.push({ 'x': new_subdivision_point_x,
                            'y': new_subdivision_point_y });

                        old_segment_length -= current_segment_length;
                        current_segment_length = segment_length;
                    }
                    current_segment_length -= old_segment_length;
                }
                new_subdivision_points.push(data_nodes[data_edges[e_idx].target]); //target
                subdivision_points_for_edge[e_idx] = new_subdivision_points;
            }
        }
    }
    /*** ********************** ***/

    /*** Edge compatibility measures ***/
    function angle_compatibility(P, Q) {
        var result = Math.abs(vector_dot_product(edge_as_vector(P), edge_as_vector(Q)) / (edge_length(P) * edge_length(Q)));
        return result;
    }

    function scale_compatibility(P, Q) {
        var lavg = (edge_length(P) + edge_length(Q)) / 2.0;
        var result = 2.0 / (lavg / Math.min(edge_length(P), edge_length(Q)) + Math.max(edge_length(P), edge_length(Q)) / lavg);
        return result;
    }

    function position_compatibility(P, Q) {
        var lavg = (edge_length(P) + edge_length(Q)) / 2.0;
        var midP = { 'x': (data_nodes[P.source].x + data_nodes[P.target].x) / 2.0,
            'y': (data_nodes[P.source].y + data_nodes[P.target].y) / 2.0 };
        var midQ = { 'x': (data_nodes[Q.source].x + data_nodes[Q.target].x) / 2.0,
            'y': (data_nodes[Q.source].y + data_nodes[Q.target].y) / 2.0 };
        var result = lavg / (lavg + euclidean_distance(midP, midQ));
        return result;
    }

    function edge_visibility(P, Q) {
        var I0 = project_point_on_line(data_nodes[Q.source], { 'source': data_nodes[P.source],
            'target': data_nodes[P.target] });
        var I1 = project_point_on_line(data_nodes[Q.target], { 'source': data_nodes[P.source],
            'target': data_nodes[P.target] }); //send acutal edge points positions
        var midI = { 'x': (I0.x + I1.x) / 2.0,
            'y': (I0.y + I1.y) / 2.0 };
        var midP = { 'x': (data_nodes[P.source].x + data_nodes[P.target].x) / 2.0,
            'y': (data_nodes[P.source].y + data_nodes[P.target].y) / 2.0 };
        var result = Math.max(0, 1 - 2 * euclidean_distance(midP, midI) / euclidean_distance(I0, I1));
        return result;
    }

    function visibility_compatibility(P, Q) {
        return Math.min(edge_visibility(P, Q), edge_visibility(Q, P));
    }

    function compatibility_score(P, Q) {
        var result = angle_compatibility(P, Q) * scale_compatibility(P, Q) * position_compatibility(P, Q) * visibility_compatibility(P, Q);

        return result;
    }

    function are_compatible(P, Q) {
        // console.log('compatibility ' + P.source +' - '+ P.target + ' and ' + Q.source +' '+ Q.target);
        return compatibility_score(P, Q) >= compatibility_threshold;
    }

    function compute_compatibility_lists() {
        for (var e = 0; e < data_edges.length - 1; e++) {
            for (var oe = e + 1; oe < data_edges.length; oe++) {
                // don't want any duplicates
                if (e == oe) continue;else {
                    if (are_compatible(data_edges[e], data_edges[oe])) {
                        compatibility_list_for_edge[e].push(oe);
                        compatibility_list_for_edge[oe].push(e);
                    }
                }
            }
        }
    }

    /*** ************************ ***/

    /*** Main Bundling Loop Methods ***/
    var forcebundle = function forcebundle() {
        var S = S_initial;
        var I = I_initial;
        var P = P_initial;

        initialize_edge_subdivisions();
        initialize_compatibility_lists();
        update_edge_divisions(P);
        compute_compatibility_lists();
        for (var cycle = 0; cycle < C; cycle++) {
            for (var iteration = 0; iteration < I; iteration++) {
                var forces = [];
                for (var edge = 0; edge < data_edges.length; edge++) {
                    forces[edge] = apply_resulting_forces_on_subdivision_points(edge, P, S);
                }
                for (var e = 0; e < data_edges.length; e++) {
                    for (var i = 0; i < P + 1; i++) {
                        subdivision_points_for_edge[e][i].x += forces[e][i].x;
                        subdivision_points_for_edge[e][i].y += forces[e][i].y;
                    }
                }
            }
            //prepare for next cycle
            S = S / 2;
            P = P * 2;
            I = I_rate * I;

            update_edge_divisions(P);
            // console.log('C' + cycle);
            // console.log('P' + P);
            // console.log('S' + S);
        }
        return subdivision_points_for_edge;
    };
    /*** ************************ ***/

    /*** Getters/Setters Methods ***/
    forcebundle.nodes = function (nl) {
        if (arguments.length == 0) {
            return data_nodes;
        } else {
            data_nodes = nl;
        }
        return forcebundle;
    };

    forcebundle.edges = function (ll) {
        if (arguments.length == 0) {
            return data_edges;
        } else {
            data_edges = filter_self_loops(ll); //remove edges to from to the same point
        }
        return forcebundle;
    };

    forcebundle.bundling_stiffness = function (k) {
        if (arguments.length == 0) {
            return K;
        } else {
            K = k;
        }
        return forcebundle;
    };

    forcebundle.step_size = function (step) {
        if (arguments.length == 0) {
            return S_initial;
        } else {
            S_initial = step;
        }
        return forcebundle;
    };

    forcebundle.cycles = function (c) {
        if (arguments.length == 0) {
            return C;
        } else {
            C = c;
        }
        return forcebundle;
    };

    forcebundle.iterations = function (i) {
        if (arguments.length == 0) {
            return I_initial;
        } else {
            I_initial = i;
        }
        return forcebundle;
    };

    forcebundle.iterations_rate = function (i) {
        if (arguments.length == 0) {
            return I_rate;
        } else {
            I_rate = i;
        }
        return forcebundle;
    };

    forcebundle.subdivision_points_seed = function (p) {
        if (arguments.length == 0) {
            return P;
        } else {
            P = p;
        }
        return forcebundle;
    };

    forcebundle.subdivision_rate = function (r) {
        if (arguments.length == 0) {
            return P_rate;
        } else {
            P_rate = r;
        }
        return forcebundle;
    };

    forcebundle.compatbility_threshold = function (t) {
        if (arguments.length == 0) {
            return compatbility_threshold;
        } else {
            compatibility_threshold = t;
        }
        return forcebundle;
    };

    /*** ************************ ***/

    return forcebundle;
};

/**
 * @author kyle / http://nikai.us/
 */

/**
 * Category
 * @param {Object} splitList:
 *   { 
 *       other: 1,
 *       1: 2,
 *       2: 3,
 *       3: 4,
 *       4: 5,
 *       5: 6,
 *       6: 7
 *   }
 */
function Category(splitList) {
    this.splitList = splitList || {
        other: 1
    };
}

Category.prototype.get = function (count) {

    var splitList = this.splitList;

    var value = splitList['other'];

    for (var i in splitList) {
        if (count == i) {
            value = splitList[i];
            break;
        }
    }

    return value;
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Category.prototype.generateByDataSet = function (dataSet, color) {
    var colors = color || ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var data = dataSet.get();
    this.splitList = {};
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (this.splitList[data[i].count] === undefined) {
            this.splitList[data[i].count] = colors[count];
            count++;
        }
        if (count >= colors.length - 1) {
            break;
        }
    }

    this.splitList['other'] = colors[colors.length - 1];
};

Category.prototype.getLegend = function (options) {
    var splitList = this.splitList;
    var container = document.createElement('div');
    container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
    var html = '';
    for (var key in splitList) {
        html += '<div style="line-height: 19px;" value="' + key + '"><span style="vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:' + splitList[key] + ';"></span><span style="margin-left: 3px;">' + key + '<span></div>';
    }
    container.innerHTML = html;
    return container;
};

/**
 * @author kyle / http://nikai.us/
 */

/**
 * Choropleth
 * @param {Object} splitList:
 *       [
 *           {
 *               start: 0,
 *               end: 2,
 *               value: randomColor()
 *           },{
 *               start: 2,
 *               end: 4,
 *               value: randomColor()
 *           },{
 *               start: 4,
 *               value: randomColor()
 *           }
 *       ];
 *
 */
function Choropleth(splitList) {
    this.splitList = splitList || [{
        start: 0,
        value: 'red'
    }];
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;

    var value = false;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined || splitList[i].start !== undefined && count >= splitList[i].start) && (splitList[i].end === undefined || splitList[i].end !== undefined && count < splitList[i].end)) {
            value = splitList[i].value;
            break;
        }
    }

    return value;
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByDataSet = function (dataSet) {

    var min = dataSet.getMin('count');
    var max = dataSet.getMax('count');

    this.generateByMinMax(min, max);
};

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByMinMax = function (min, max) {
    var colors = ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var splitNum = Number((max - min) / 7);
    // console.log(splitNum)
    max = Number(max);
    var index = Number(min);
    this.splitList = [];
    var count = 0;

    while (index < max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            value: colors[count]
        });
        count++;
        index += splitNum;
        // console.log(index, max)
    }
    // console.log('splitNum')
};

Choropleth.prototype.getLegend = function (options) {
    var splitList = this.splitList;
};

/**
 * @author Mofei<http://www.zhuwenlong.com>
 */

var MapHelper = function () {
    function MapHelper(id, type, opt) {
        classCallCheck(this, MapHelper);

        if (!id || !type) {
            console.warn('id 和 type 为必填项');
            return false;
        }

        if (type == 'baidu') {
            if (!BMap) {
                console.warn('请先引入百度地图JS API');
                return false;
            }
        } else {
            console.warn('暂不支持你的地图类型');
        }
        this.type = type;
        var center = opt && opt.center ? opt.center : [106.962497, 38.208726];
        var zoom = opt && opt.zoom ? opt.zoom : 5;
        var map = this.map = new BMap.Map(id, {
            enableMapClick: false
        });
        map.centerAndZoom(new BMap.Point(center[0], center[1]), zoom);
        map.enableScrollWheelZoom(true);

        map.setMapStyle({
            style: 'light'
        });
    }

    createClass(MapHelper, [{
        key: 'addLayer',
        value: function addLayer(datas, options) {
            if (this.type == 'baidu') {
                return new mapv.baiduMapLayer(this.map, dataSet, options);
            }
        }
    }, {
        key: 'getMap',
        value: function getMap() {
            return this.map;
        }
    }]);
    return MapHelper;
}();

/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param 
 * {
 *     map 地图实例对象
 * }
 */

function CanvasLayer(options) {
    this.options = options || {};
    this.paneName = this.options.paneName || 'mapPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 0;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this.enableMassClear = this.options.enableMassClear;
    this._map = options.map;
    this._lastDrawTime = null;
    this.show();
}

var global$3 = typeof window === 'undefined' ? {} : window;
var BMap$1 = global$3.BMap || global$3.BMapGL;
if (BMap$1) {

    CanvasLayer.prototype = new BMap$1.Overlay();

    CanvasLayer.prototype.initialize = function (map) {
        this._map = map;
        var canvas = this.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";user-select:none;";
        canvas.style.mixBlendMode = this.mixBlendMode;
        this.adjustSize();
        var pane = map.getPanes()[this.paneName];
        if (!pane) {
            pane = map.getPanes().floatShadow;
        }
        pane.appendChild(canvas);
        var that = this;
        map.addEventListener('resize', function () {
            that.adjustSize();
            that._draw();
        });
        map.addEventListener('update', function () {
            that._draw();
        });
        /*
        map.addEventListener('moving', function() {
            that._draw();
        });
        */
        if (this.options.updateImmediate) {
            setTimeout(function () {
                that._draw();
            }, 100);
        }
        return this.canvas;
    };

    CanvasLayer.prototype.adjustSize = function () {
        var size = this._map.getSize();
        var canvas = this.canvas;

        var devicePixelRatio = this.devicePixelRatio = global$3.devicePixelRatio || 1;

        canvas.width = size.width * devicePixelRatio;
        canvas.height = size.height * devicePixelRatio;
        if (this.context == '2d') {
            canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
        }

        canvas.style.width = size.width + "px";
        canvas.style.height = size.height + "px";
    };

    CanvasLayer.prototype.draw = function () {
        var self = this;
        if (this.options.updateImmediate) {
            self._draw();
        } else {
            clearTimeout(self.timeoutID);
            self.timeoutID = setTimeout(function () {
                self._draw();
            }, 15);
        }
    };

    CanvasLayer.prototype._draw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getCenter();
        if (center) {
            var pixel = map.pointToOverlayPixel(center);
            this.canvas.style.left = pixel.x - size.width / 2 + 'px';
            this.canvas.style.top = pixel.y - size.height / 2 + 'px';
            this.dispatchEvent('draw');
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        if (!this.canvas) {
            this._map.addOverlay(this);
        }
        this.canvas.style.display = "block";
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = "none";
        //this._map.removeOverlay(this);
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.zIndex = zIndex;
        this.canvas.style.zIndex = this.zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };
}

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || function () {

    var _tweens = [];

    return {

        getAll: function getAll() {

            return _tweens;
        },

        removeAll: function removeAll() {

            _tweens = [];
        },

        add: function add(tween) {

            _tweens.push(tween);
        },

        remove: function remove(tween) {

            var i = _tweens.indexOf(tween);

            if (i !== -1) {
                _tweens.splice(i, 1);
            }
        },

        update: function update(time, preserve) {

            if (_tweens.length === 0) {
                return false;
            }

            var i = 0;

            time = time !== undefined ? time : TWEEN.now();

            while (i < _tweens.length) {

                if (_tweens[i].update(time) || preserve) {
                    i++;
                } else {
                    _tweens.splice(i, 1);
                }
            }

            return true;
        }
    };
}();

// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof window === 'undefined' && typeof process !== 'undefined') {
    TWEEN.now = function () {
        var time = process.hrtime();

        // Convert [seconds, nanoseconds] to milliseconds.
        return time[0] * 1000 + time[1] / 1000000;
    };
}
// In a browser, use window.performance.now if it is available.
else if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
        // This must be bound, because directly assigning this function
        // leads to an invocation exception in Chrome.
        TWEEN.now = window.performance.now.bind(window.performance);
    }
    // Use Date.now if it is available.
    else if (Date.now !== undefined) {
            TWEEN.now = Date.now;
        }
        // Otherwise, use 'new Date().getTime()'.
        else {
                TWEEN.now = function () {
                    return new Date().getTime();
                };
            }

TWEEN.Tween = function (object) {

    var _object = object;
    var _valuesStart = {};
    var _valuesEnd = {};
    var _valuesStartRepeat = {};
    var _duration = 1000;
    var _repeat = 0;
    var _repeatDelayTime;
    var _yoyo = false;
    var _isPlaying = false;
    var _reversed = false;
    var _delayTime = 0;
    var _startTime = null;
    var _easingFunction = TWEEN.Easing.Linear.None;
    var _interpolationFunction = TWEEN.Interpolation.Linear;
    var _chainedTweens = [];
    var _onStartCallback = null;
    var _onStartCallbackFired = false;
    var _onUpdateCallback = null;
    var _onCompleteCallback = null;
    var _onStopCallback = null;

    this.to = function (properties, duration) {

        _valuesEnd = properties;

        if (duration !== undefined) {
            _duration = duration;
        }

        return this;
    };

    this.start = function (time) {

        TWEEN.add(this);

        _isPlaying = true;

        _onStartCallbackFired = false;

        _startTime = time !== undefined ? time : TWEEN.now();
        _startTime += _delayTime;

        for (var property in _valuesEnd) {

            // Check if an Array was provided as property value
            if (_valuesEnd[property] instanceof Array) {

                if (_valuesEnd[property].length === 0) {
                    continue;
                }

                // Create a local copy of the Array with the start value at the front
                _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
            }

            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if (_object[property] === undefined) {
                continue;
            }

            // Save the starting value.
            _valuesStart[property] = _object[property];

            if (_valuesStart[property] instanceof Array === false) {
                _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
            }

            _valuesStartRepeat[property] = _valuesStart[property] || 0;
        }

        return this;
    };

    this.stop = function () {

        if (!_isPlaying) {
            return this;
        }

        TWEEN.remove(this);
        _isPlaying = false;

        if (_onStopCallback !== null) {
            _onStopCallback.call(_object, _object);
        }

        this.stopChainedTweens();
        return this;
    };

    this.end = function () {

        this.update(_startTime + _duration);
        return this;
    };

    this.stopChainedTweens = function () {

        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
            _chainedTweens[i].stop();
        }
    };

    this.delay = function (amount) {

        _delayTime = amount;
        return this;
    };

    this.repeat = function (times) {

        _repeat = times;
        return this;
    };

    this.repeatDelay = function (amount) {

        _repeatDelayTime = amount;
        return this;
    };

    this.yoyo = function (yoyo) {

        _yoyo = yoyo;
        return this;
    };

    this.easing = function (easing) {

        _easingFunction = easing;
        return this;
    };

    this.interpolation = function (interpolation) {

        _interpolationFunction = interpolation;
        return this;
    };

    this.chain = function () {

        _chainedTweens = arguments;
        return this;
    };

    this.onStart = function (callback) {

        _onStartCallback = callback;
        return this;
    };

    this.onUpdate = function (callback) {

        _onUpdateCallback = callback;
        return this;
    };

    this.onComplete = function (callback) {

        _onCompleteCallback = callback;
        return this;
    };

    this.onStop = function (callback) {

        _onStopCallback = callback;
        return this;
    };

    this.update = function (time) {

        var property;
        var elapsed;
        var value;

        if (time < _startTime) {
            return true;
        }

        if (_onStartCallbackFired === false) {

            if (_onStartCallback !== null) {
                _onStartCallback.call(_object, _object);
            }

            _onStartCallbackFired = true;
        }

        elapsed = (time - _startTime) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = _easingFunction(elapsed);

        for (property in _valuesEnd) {

            // Don't update properties that do not exist in the source object
            if (_valuesStart[property] === undefined) {
                continue;
            }

            var start = _valuesStart[property] || 0;
            var end = _valuesEnd[property];

            if (end instanceof Array) {

                _object[property] = _interpolationFunction(end, value);
            } else {

                // Parses relative end values with start as base (e.g.: +10, -3)
                if (typeof end === 'string') {

                    if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                        end = start + parseFloat(end);
                    } else {
                        end = parseFloat(end);
                    }
                }

                // Protect against non numeric properties.
                if (typeof end === 'number') {
                    _object[property] = start + (end - start) * value;
                }
            }
        }

        if (_onUpdateCallback !== null) {
            _onUpdateCallback.call(_object, value);
        }

        if (elapsed === 1) {

            if (_repeat > 0) {

                if (isFinite(_repeat)) {
                    _repeat--;
                }

                // Reassign starting values, restart by making startTime = now
                for (property in _valuesStartRepeat) {

                    if (typeof _valuesEnd[property] === 'string') {
                        _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
                    }

                    if (_yoyo) {
                        var tmp = _valuesStartRepeat[property];

                        _valuesStartRepeat[property] = _valuesEnd[property];
                        _valuesEnd[property] = tmp;
                    }

                    _valuesStart[property] = _valuesStartRepeat[property];
                }

                if (_yoyo) {
                    _reversed = !_reversed;
                }

                if (_repeatDelayTime !== undefined) {
                    _startTime = time + _repeatDelayTime;
                } else {
                    _startTime = time + _delayTime;
                }

                return true;
            } else {

                if (_onCompleteCallback !== null) {

                    _onCompleteCallback.call(_object, _object);
                }

                for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    _chainedTweens[i].start(_startTime + _duration);
                }

                return false;
            }
        }

        return true;
    };
};

TWEEN.Easing = {

    Linear: {

        None: function None(k) {

            return k;
        }

    },

    Quadratic: {

        In: function In(k) {

            return k * k;
        },

        Out: function Out(k) {

            return k * (2 - k);
        },

        InOut: function InOut(k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }

            return -0.5 * (--k * (k - 2) - 1);
        }

    },

    Cubic: {

        In: function In(k) {

            return k * k * k;
        },

        Out: function Out(k) {

            return --k * k * k + 1;
        },

        InOut: function InOut(k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }

            return 0.5 * ((k -= 2) * k * k + 2);
        }

    },

    Quartic: {

        In: function In(k) {

            return k * k * k * k;
        },

        Out: function Out(k) {

            return 1 - --k * k * k * k;
        },

        InOut: function InOut(k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }

            return -0.5 * ((k -= 2) * k * k * k - 2);
        }

    },

    Quintic: {

        In: function In(k) {

            return k * k * k * k * k;
        },

        Out: function Out(k) {

            return --k * k * k * k * k + 1;
        },

        InOut: function InOut(k) {

            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }

            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }

    },

    Sinusoidal: {

        In: function In(k) {

            return 1 - Math.cos(k * Math.PI / 2);
        },

        Out: function Out(k) {

            return Math.sin(k * Math.PI / 2);
        },

        InOut: function InOut(k) {

            return 0.5 * (1 - Math.cos(Math.PI * k));
        }

    },

    Exponential: {

        In: function In(k) {

            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },

        Out: function Out(k) {

            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },

        InOut: function InOut(k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }

            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }

    },

    Circular: {

        In: function In(k) {

            return 1 - Math.sqrt(1 - k * k);
        },

        Out: function Out(k) {

            return Math.sqrt(1 - --k * k);
        },

        InOut: function InOut(k) {

            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }

            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }

    },

    Elastic: {

        In: function In(k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        },

        Out: function Out(k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
        },

        InOut: function InOut(k) {

            if (k === 0) {
                return 0;
            }

            if (k === 1) {
                return 1;
            }

            k *= 2;

            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }

            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        }

    },

    Back: {

        In: function In(k) {

            var s = 1.70158;

            return k * k * ((s + 1) * k - s);
        },

        Out: function Out(k) {

            var s = 1.70158;

            return --k * k * ((s + 1) * k + s) + 1;
        },

        InOut: function InOut(k) {

            var s = 1.70158 * 1.525;

            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }

            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }

    },

    Bounce: {

        In: function In(k) {

            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
        },

        Out: function Out(k) {

            if (k < 1 / 2.75) {
                return 7.5625 * k * k;
            } else if (k < 2 / 2.75) {
                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
            } else if (k < 2.5 / 2.75) {
                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
            } else {
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            }
        },

        InOut: function InOut(k) {

            if (k < 0.5) {
                return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
            }

            return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }

    }

};

TWEEN.Interpolation = {

    Linear: function Linear(v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.Linear;

        if (k < 0) {
            return fn(v[0], v[1], f);
        }

        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }

        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },

    Bezier: function Bezier(v, k) {

        var b = 0;
        var n = v.length - 1;
        var pw = Math.pow;
        var bn = TWEEN.Interpolation.Utils.Bernstein;

        for (var i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }

        return b;
    },

    CatmullRom: function CatmullRom(v, k) {

        var m = v.length - 1;
        var f = m * k;
        var i = Math.floor(f);
        var fn = TWEEN.Interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {

            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }

            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
        } else {

            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }
    },

    Utils: {

        Linear: function Linear(p0, p1, t) {

            return (p1 - p0) * t + p0;
        },

        Bernstein: function Bernstein(n, i) {

            var fc = TWEEN.Interpolation.Utils.Factorial;

            return fc(n) / fc(i) / fc(n - i);
        },

        Factorial: function () {

            var a = [1];

            return function (n) {

                var s = 1;

                if (a[n]) {
                    return a[n];
                }

                for (var i = n; i > 1; i--) {
                    s *= i;
                }

                a[n] = s;
                return s;
            };
        }(),

        CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {

            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }

    }

};

/**
 * 根据2点获取角度
 * @param Array [123, 23] 点1
 * @param Array [123, 23] 点2
 * @return angle 角度,不是弧度
 */
function getAngle(start, end) {
    var diff_x = end[0] - start[0];
    var diff_y = end[1] - start[1];
    var deg = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    if (end[0] < start[0]) {
        deg = deg + 180;
    }
    return deg;
}

/**
 * 绘制沿线箭头
 * @author kyle / http://nikai.us/
 */

var imageCache = {};

var object = {
    draw: function draw(context, dataSet, options) {
        var imageCacheKey = 'http://huiyan.baidu.com/github/tools/gis-drawing/static/images/direction.png';
        if (options.arrow && options.arrow.url) {
            imageCacheKey = options.arrow.url;
        }

        if (!imageCache[imageCacheKey]) {
            imageCache[imageCacheKey] = null;
        }

        var directionImage = imageCache[imageCacheKey];

        if (!directionImage) {
            var args = Array.prototype.slice.call(arguments);
            var image = new Image();
            image.onload = function () {
                imageCache[imageCacheKey] = image;
                object.draw.apply(null, args);
            };
            image.src = imageCacheKey;
            return;
        }

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        // console.log('xxxx',options)
        context.save();

        for (var key in options) {
            context[key] = options[key];
        }

        var points = [];
        var preCoordinate = null;
        for (var i = 0, len = data.length; i < len; i++) {

            var item = data[i];

            context.save();

            if (item.fillStyle || item._fillStyle) {
                context.fillStyle = item.fillStyle || item._fillStyle;
            }

            if (item.strokeStyle || item._strokeStyle) {
                context.strokeStyle = item.strokeStyle || item._strokeStyle;
            }

            var type = item.geometry.type;

            context.beginPath();
            if (type === 'LineString') {
                var coordinates = item.geometry._coordinates || item.geometry.coordinates;
                var interval = options.arrow.interval !== undefined ? options.arrow.interval : 1;
                for (var j = 0; j < coordinates.length; j += interval) {
                    if (coordinates[j] && coordinates[j + 1]) {
                        var coordinate = coordinates[j];

                        if (preCoordinate && getDistance(coordinate, preCoordinate) < 30) {
                            continue;
                        }

                        context.save();
                        var angle = getAngle(coordinates[j], coordinates[j + 1]);
                        context.translate(coordinate[0], coordinate[1]);
                        context.rotate(angle * Math.PI / 180);
                        context.drawImage(directionImage, -directionImage.width / 2 / 2, -directionImage.height / 2 / 2, directionImage.width / 2, directionImage.height / 2);
                        context.restore();

                        points.push(coordinate);
                        preCoordinate = coordinate;
                    }
                }
            }

            context.restore();
        }

        context.restore();
    }
};

function getDistance(coordinateA, coordinateB) {
    return Math.sqrt(Math.pow(coordinateA[0] - coordinateB[0], 2) + Math.pow(coordinateA[1] - coordinateB[1], 2));
}

/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

var drawClip = {
    draw: function draw(context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();

        context.fillStyle = options.fillStyle || 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        options.multiPolygonDraw = function () {
            context.save();
            context.clip();
            clear(context);
            context.restore();
        };

        for (var i = 0, len = data.length; i < len; i++) {

            context.beginPath();

            pathSimple.drawDataSet(context, [data[i]], options);
            context.save();
            context.clip();
            clear(context);
            context.restore();
        }

        context.restore();
    }
};

/**
 * @author kyle / http://nikai.us/
 */

var imageMap = {};
var stacks = {};
var drawCluster = {
    draw: function draw(context, dataSet, options) {
        context.save();
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var coordinates = item.geometry._coordinates || item.geometry.coordinates;
            context.beginPath();
            if (item.properties && item.properties.cluster) {
                context.arc(coordinates[0], coordinates[1], item.size, 0, Math.PI * 2);
                context.fillStyle = item.fillStyle;
                context.fill();

                if (options.label && options.label.show !== false) {
                    context.fillStyle = options.label.fillStyle || 'white';

                    if (options.label.font) {
                        context.font = options.label.font;
                    }

                    if (options.label.shadowColor) {
                        context.shadowColor = options.label.shadowColor;
                    }

                    if (options.label.shadowBlur) {
                        context.shadowBlur = options.label.shadowBlur;
                    }

                    var text = item.properties.point_count;
                    var textWidth = context.measureText(text).width;
                    context.fillText(text, coordinates[0] + 0.5 - textWidth / 2, coordinates[1] + 0.5 + 3);
                }
            } else {
                this.drawIcon(item, options, context);
            }
        }
        context.restore();
    },
    drawIcon: function drawIcon(item, options, context) {
        var _ref = item.geometry._coordinates || item.geometry.coordinates,
            _ref2 = slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        var iconOptions = Object.assign({}, options.iconOptions, item.iconOptions);
        var drawPoint = function drawPoint() {
            context.beginPath();
            context.arc(x, y, options.size || 5, 0, Math.PI * 2);
            context.fillStyle = options.fillStyle || 'red';
            context.fill();
        };
        if (!iconOptions.url) {
            drawPoint();
            return;
        }
        var iconWidth = iconOptions.width;
        var iconHeight = iconOptions.height;
        var iconOffset = iconOptions.offset || { x: 0, y: 0 };
        x = x - ~~iconWidth / 2 + iconOffset.x;
        y = y - ~~iconHeight / 2 + iconOffset.y;
        var url = window.encodeURIComponent(iconOptions.url);
        var img = imageMap[url];
        if (img) {
            if (img === 'error') {
                drawPoint();
            } else if (iconWidth && iconHeight) {
                context.drawImage(img, x, y, iconWidth, iconHeight);
            } else {
                context.drawImage(img, x, y);
            }
        } else {
            if (!stacks[url]) {
                stacks[url] = [];
                getImage(url, function (img, src) {
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun(img);
                    });
                    stacks[src] = null;
                    imageMap[src] = img;
                }, function (src) {
                    stacks[src] && stacks[src].forEach(function (fun) {
                        return fun('error', src);
                    });
                    stacks[src] = null;
                    imageMap[src] = 'error';
                    drawPoint();
                });
            }
            stacks[url].push(function (x, y, iconWidth, iconHeight) {
                return function (img) {
                    if (img === 'error') {
                        drawPoint();
                    } else if (iconWidth && iconHeight) {
                        context.drawImage(img, x, y, iconWidth, iconHeight);
                    } else {
                        context.drawImage(img, x, y);
                    }
                };
            }(x, y, iconWidth, iconHeight));
        }
    }
};

function getImage(url, callback, fallback) {
    var img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}

/**
 * @author Mofei Zhu<mapv@zhuwenlong.com>
 * This file is to draw text
 */

var drawText = {
    draw: function draw(context, dataSet, options) {

        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();

        // set from options
        for (var key in options) {
            context[key] = options[key];
        }

        var rects = [];

        var size = options._size || options.size;
        if (size) {
            context.font = "bold " + size + "px Arial";
        } else {
            size = 12;
        }

        var textKey = options.textKey || 'text';

        if (!options.textAlign) {
            context.textAlign = 'center';
        }

        if (!options.textBaseline) {
            context.textBaseline = 'middle';
        }

        if (options.avoid) {
            // 标注避让
            for (var i = 0, len = data.length; i < len; i++) {

                var offset = data[i].offset || options.offset || {
                    x: 0,
                    y: 0
                };

                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0] + offset.x;
                var y = coordinates[1] + offset.y;
                var text = data[i][textKey];
                var textWidth = context.measureText(text).width;

                // 根据文本宽度和高度调整x，y位置，使得绘制文本时候坐标点在文本中心点，这个计算出的是左上角坐标
                var px = x - textWidth / 2;
                var py = y - size / 2;

                var rect = {
                    sw: {
                        x: px,
                        y: py + size
                    },
                    ne: {
                        x: px + textWidth,
                        y: py
                    }
                };

                if (!hasOverlay(rects, rect)) {
                    rects.push(rect);
                    px = px + textWidth / 2;
                    py = py + size / 2;
                    context.fillText(text, px, py);
                }
            }
        } else {
            for (var i = 0, len = data.length; i < len; i++) {
                var offset = data[i].offset || options.offset || {
                    x: 0,
                    y: 0
                };
                var coordinates = data[i].geometry._coordinates || data[i].geometry.coordinates;
                var x = coordinates[0] + offset.x;
                var y = coordinates[1] + offset.y;
                var text = data[i][textKey];
                context.fillText(text, x, y);
            }
        }

        context.restore();
    }

    /*
     *  当前文字区域和已有的文字区域是否有重叠部分
     */
};function hasOverlay(rects, overlay) {
    for (var i = 0; i < rects.length; i++) {
        if (isRectOverlay(rects[i], overlay)) {
            return true;
        }
    }
    return false;
}

//判断2个矩形是否有重叠部分
function isRectOverlay(rect1, rect2) {
    //minx、miny 2个矩形右下角最小的x和y
    //maxx、maxy 2个矩形左上角最大的x和y
    var minx = Math.min(rect1.ne.x, rect2.ne.x);
    var miny = Math.min(rect1.sw.y, rect2.sw.y);
    var maxx = Math.max(rect1.sw.x, rect2.sw.x);
    var maxy = Math.max(rect1.ne.y, rect2.ne.y);
    if (minx > maxx && miny > maxy) {
        return true;
    }
    return false;
}

/**
 * @author wanghyper
 * This file is to draw icon
 */

var imageMap$1 = {};
var stacks$1 = {};
var drawIcon = {
    draw: function draw(context, dataSet, options) {
        var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;

        var _loop = function _loop() {
            var item = data[i];
            if (item.geometry) {
                icon = item.icon || options.icon;

                if (typeof icon === 'string') {
                    var url = window.encodeURIComponent(icon);
                    var img = imageMap$1[url];
                    if (img) {
                        drawItem(img, options, context, item);
                    } else {
                        if (!stacks$1[url]) {
                            stacks$1[url] = [];
                            getImage$1(url, function (img, src) {
                                stacks$1[src] && stacks$1[src].forEach(function (fun) {
                                    return fun(img);
                                });
                                stacks$1[src] = null;
                                imageMap$1[src] = img;
                            }, function (src) {
                                stacks$1[src] && stacks$1[src].forEach(function (fun) {
                                    return fun('error');
                                });
                                stacks$1[src] = null;
                                imageMap$1[src] = 'error';
                            });
                        }
                        stacks$1[url].push(function (img) {
                            drawItem(img, options, context, item);
                        });
                    }
                } else {
                    drawItem(icon, options, context, item);
                }
            }
        };

        for (var i = 0, len = data.length; i < len; i++) {
            var icon;

            _loop();
        }
    }
};
function drawItem(img, options, context, item) {
    context.save();
    var coordinates = item.geometry._coordinates || item.geometry.coordinates;
    var x = coordinates[0];
    var y = coordinates[1];
    var offset = options.offset || { x: 0, y: 0 };
    var width = item.width || options._width || options.width;
    var height = item.height || options._height || options.height;
    x = x - ~~width / 2 + offset.x;
    y = y - ~~height / 2 + offset.y;
    if (typeof img === 'string') {
        context.beginPath();
        context.arc(x, y, options.size || 5, 0, Math.PI * 2);
        context.fillStyle = options.fillStyle || 'red';
        context.fill();
        return;
    }
    var deg = item.deg || options.deg;
    if (deg) {
        context.translate(x, y);
        context.rotate(deg * Math.PI / 180);
        context.translate(-x, -y);
    }

    if (options.sx && options.sy && options.swidth && options.sheight && options.width && options.height) {
        context.drawImage(img, options.sx, options.sy, options.swidth, options.sheight, x, y, width, height);
    } else if (width && height) {
        context.drawImage(img, x, y, width, height);
    } else {
        context.drawImage(img, x, y);
    }
    context.restore();
}

function getImage$1(url, callback, fallback) {
    var img = new Image();
    img.onload = function () {
        callback && callback(img, url);
    };
    img.onerror = function () {
        fallback && fallback(url);
    };
    img.src = window.decodeURIComponent(url);
}

function sortKD(ids, coords, nodeSize, left, right, depth) {
    if (right - left <= nodeSize) {
        return;
    }

    var m = left + right >> 1;

    select(ids, coords, m, left, right, depth % 2);

    sortKD(ids, coords, nodeSize, left, m - 1, depth + 1);
    sortKD(ids, coords, nodeSize, m + 1, right, depth + 1);
}

function select(ids, coords, k, left, right, inc) {

    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            select(ids, coords, k, newLeft, newRight, inc);
        }

        var t = coords[2 * k + inc];
        var i = left;
        var j = right;

        swapItem(ids, coords, left, k);
        if (coords[2 * right + inc] > t) {
            swapItem(ids, coords, left, right);
        }

        while (i < j) {
            swapItem(ids, coords, i, j);
            i++;
            j--;
            while (coords[2 * i + inc] < t) {
                i++;
            }
            while (coords[2 * j + inc] > t) {
                j--;
            }
        }

        if (coords[2 * left + inc] === t) {
            swapItem(ids, coords, left, j);
        } else {
            j++;
            swapItem(ids, coords, j, right);
        }

        if (j <= k) {
            left = j + 1;
        }
        if (k <= j) {
            right = j - 1;
        }
    }
}

function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function range(ids, coords, minX, minY, maxX, maxY, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];
    var x, y;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                x = coords[2 * i];
                y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    result.push(ids[i]);
                }
            }
            continue;
        }

        var m = Math.floor((left + right) / 2);

        x = coords[2 * m];
        y = coords[2 * m + 1];

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            result.push(ids[m]);
        }

        var nextAxis = (axis + 1) % 2;

        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function within(ids, coords, qx, qy, r, nodeSize) {
    var stack = [0, ids.length - 1, 0];
    var result = [];
    var r2 = r * r;

    while (stack.length) {
        var axis = stack.pop();
        var right = stack.pop();
        var left = stack.pop();

        if (right - left <= nodeSize) {
            for (var i = left; i <= right; i++) {
                if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2) {
                    result.push(ids[i]);
                }
            }
            continue;
        }

        var m = Math.floor((left + right) / 2);

        var x = coords[2 * m];
        var y = coords[2 * m + 1];

        if (sqDist(x, y, qx, qy) <= r2) {
            result.push(ids[m]);
        }

        var nextAxis = (axis + 1) % 2;

        if (axis === 0 ? qx - r <= x : qy - r <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(nextAxis);
        }
        if (axis === 0 ? qx + r >= x : qy + r >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(nextAxis);
        }
    }

    return result;
}

function sqDist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}

var defaultGetX = function defaultGetX(p) {
    return p[0];
};
var defaultGetY = function defaultGetY(p) {
    return p[1];
};

var KDBush = function KDBush(points, getX, getY, nodeSize, ArrayType) {
    if (getX === void 0) getX = defaultGetX;
    if (getY === void 0) getY = defaultGetY;
    if (nodeSize === void 0) nodeSize = 64;
    if (ArrayType === void 0) ArrayType = Float64Array;

    this.nodeSize = nodeSize;
    this.points = points;

    var IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

    var ids = this.ids = new IndexArrayType(points.length);
    var coords = this.coords = new ArrayType(points.length * 2);

    for (var i = 0; i < points.length; i++) {
        ids[i] = i;
        coords[2 * i] = getX(points[i]);
        coords[2 * i + 1] = getY(points[i]);
    }

    sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
};

KDBush.prototype.range = function range$1(minX, minY, maxX, maxY) {
    return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
};

KDBush.prototype.within = function within$1(x, y, r) {
    return within(this.ids, this.coords, x, y, r, this.nodeSize);
};

var defaultOptions = {
    minZoom: 0, // min zoom to generate clusters on
    maxZoom: 16, // max zoom level to cluster the points on
    minPoints: 2, // minimum points to form a cluster
    radius: 40, // cluster radius in pixels
    extent: 512, // tile extent (radius is calculated relative to it)
    nodeSize: 64, // size of the KD-tree leaf node, affects performance
    log: false, // whether to log timing info

    // whether to generate numeric ids for input features (in vector tiles)
    generateId: false,

    // a reduce function for calculating custom cluster properties
    reduce: null, // (accumulated, props) => { accumulated.sum += props.sum; }

    // properties to use for individual points when running the reducer
    map: function map(props) {
        return props;
    } // props => ({sum: props.my_value})
};

var Supercluster = function Supercluster(options) {
    this.options = extend(Object.create(defaultOptions), options);
    this.trees = new Array(this.options.maxZoom + 1);
};

Supercluster.prototype.load = function load(points) {
    var ref = this.options;
    var log = ref.log;
    var minZoom = ref.minZoom;
    var maxZoom = ref.maxZoom;
    var nodeSize = ref.nodeSize;

    if (log) {}

    var timerId = "prepare " + points.length + " points";
    if (log) {}

    this.points = points;

    // generate a cluster object for each point and index input points into a KD-tree
    var clusters = [];
    for (var i = 0; i < points.length; i++) {
        if (!points[i].geometry) {
            continue;
        }
        clusters.push(createPointCluster(points[i], i));
    }
    this.trees[maxZoom + 1] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

    if (log) {}

    // cluster points on max zoom, then cluster the results on previous zoom, etc.;
    // results in a cluster hierarchy across zoom levels
    for (var z = maxZoom; z >= minZoom; z--) {
        var now = +Date.now();

        // create a new set of clusters for the zoom and index them with a KD-tree
        clusters = this._cluster(clusters, z);
        this.trees[z] = new KDBush(clusters, getX, getY, nodeSize, Float32Array);

        if (log) {}
    }

    if (log) {}

    return this;
};

Supercluster.prototype.getClusters = function getClusters(bbox, zoom) {
    var minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
    var minLat = Math.max(-90, Math.min(90, bbox[1]));
    var maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
    var maxLat = Math.max(-90, Math.min(90, bbox[3]));

    if (bbox[2] - bbox[0] >= 360) {
        minLng = -180;
        maxLng = 180;
    } else if (minLng > maxLng) {
        var easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
        var westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
        return easternHem.concat(westernHem);
    }

    var tree = this.trees[this._limitZoom(zoom)];
    var ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
    var clusters = [];
    for (var i = 0, list = ids; i < list.length; i += 1) {
        var id = list[i];

        var c = tree.points[id];
        clusters.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
    }
    return clusters;
};

Supercluster.prototype.getChildren = function getChildren(clusterId) {
    var originId = this._getOriginId(clusterId);
    var originZoom = this._getOriginZoom(clusterId);
    var errorMsg = 'No cluster with the specified id.';

    var index = this.trees[originZoom];
    if (!index) {
        throw new Error(errorMsg);
    }

    var origin = index.points[originId];
    if (!origin) {
        throw new Error(errorMsg);
    }

    var r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
    var ids = index.within(origin.x, origin.y, r);
    var children = [];
    for (var i = 0, list = ids; i < list.length; i += 1) {
        var id = list[i];

        var c = index.points[id];
        if (c.parentId === clusterId) {
            children.push(c.numPoints ? getClusterJSON(c) : this.points[c.index]);
        }
    }

    if (children.length === 0) {
        throw new Error(errorMsg);
    }

    return children;
};

Supercluster.prototype.getLeaves = function getLeaves(clusterId, limit, offset) {
    limit = limit || 10;
    offset = offset || 0;

    var leaves = [];
    this._appendLeaves(leaves, clusterId, limit, offset, 0);

    return leaves;
};

Supercluster.prototype.getTile = function getTile(z, x, y) {
    var tree = this.trees[this._limitZoom(z)];
    var z2 = Math.pow(2, z);
    var ref = this.options;
    var extent = ref.extent;
    var radius = ref.radius;
    var p = radius / extent;
    var top = (y - p) / z2;
    var bottom = (y + 1 + p) / z2;

    var tile = {
        features: []
    };

    this._addTileFeatures(tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom), tree.points, x, y, z2, tile);

    if (x === 0) {
        this._addTileFeatures(tree.range(1 - p / z2, top, 1, bottom), tree.points, z2, y, z2, tile);
    }
    if (x === z2 - 1) {
        this._addTileFeatures(tree.range(0, top, p / z2, bottom), tree.points, -1, y, z2, tile);
    }

    return tile.features.length ? tile : null;
};

Supercluster.prototype.getClusterExpansionZoom = function getClusterExpansionZoom(clusterId) {
    var expansionZoom = this._getOriginZoom(clusterId) - 1;
    while (expansionZoom <= this.options.maxZoom) {
        var children = this.getChildren(clusterId);
        expansionZoom++;
        if (children.length !== 1) {
            break;
        }
        clusterId = children[0].properties.cluster_id;
    }
    return expansionZoom;
};

Supercluster.prototype._appendLeaves = function _appendLeaves(result, clusterId, limit, offset, skipped) {
    var children = this.getChildren(clusterId);

    for (var i = 0, list = children; i < list.length; i += 1) {
        var child = list[i];

        var props = child.properties;

        if (props && props.cluster) {
            if (skipped + props.point_count <= offset) {
                // skip the whole cluster
                skipped += props.point_count;
            } else {
                // enter the cluster
                skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
                // exit the cluster
            }
        } else if (skipped < offset) {
            // skip a single point
            skipped++;
        } else {
            // add a single point
            result.push(child);
        }
        if (result.length === limit) {
            break;
        }
    }

    return skipped;
};

Supercluster.prototype._addTileFeatures = function _addTileFeatures(ids, points, x, y, z2, tile) {
    for (var i$1 = 0, list = ids; i$1 < list.length; i$1 += 1) {
        var i = list[i$1];

        var c = points[i];
        var isCluster = c.numPoints;
        var f = {
            type: 1,
            geometry: [[Math.round(this.options.extent * (c.x * z2 - x)), Math.round(this.options.extent * (c.y * z2 - y))]],
            tags: isCluster ? getClusterProperties(c) : this.points[c.index].properties
        };

        // assign id
        var id = void 0;
        if (isCluster) {
            id = c.id;
        } else if (this.options.generateId) {
            // optionally generate id
            id = c.index;
        } else if (this.points[c.index].id) {
            // keep id if already assigned
            id = this.points[c.index].id;
        }

        if (id !== undefined) {
            f.id = id;
        }

        tile.features.push(f);
    }
};

Supercluster.prototype._limitZoom = function _limitZoom(z) {
    return Math.max(this.options.minZoom, Math.min(+z, this.options.maxZoom + 1));
};

Supercluster.prototype._cluster = function _cluster(points, zoom) {
    var clusters = [];
    var ref = this.options;
    var radius = ref.radius;
    var extent = ref.extent;
    var reduce = ref.reduce;
    var minPoints = ref.minPoints;
    var r = radius / (extent * Math.pow(2, zoom));

    // loop through each point
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        // if we've already visited the point at this zoom level, skip it
        if (p.zoom <= zoom) {
            continue;
        }
        p.zoom = zoom;

        // find all nearby points
        var tree = this.trees[zoom + 1];
        var neighborIds = tree.within(p.x, p.y, r);

        var numPointsOrigin = p.numPoints || 1;
        var numPoints = numPointsOrigin;

        // count the number of points in a potential cluster
        for (var i$1 = 0, list = neighborIds; i$1 < list.length; i$1 += 1) {
            var neighborId = list[i$1];

            var b = tree.points[neighborId];
            // filter out neighbors that are already processed
            if (b.zoom > zoom) {
                numPoints += b.numPoints || 1;
            }
        }

        if (numPoints >= minPoints) {
            // enough points to form a cluster
            var wx = p.x * numPointsOrigin;
            var wy = p.y * numPointsOrigin;

            var clusterProperties = reduce && numPointsOrigin > 1 ? this._map(p, true) : null;

            // encode both zoom and point index on which the cluster originated -- offset by total length of features
            var id = (i << 5) + (zoom + 1) + this.points.length;

            for (var i$2 = 0, list$1 = neighborIds; i$2 < list$1.length; i$2 += 1) {
                var neighborId$1 = list$1[i$2];

                var b$1 = tree.points[neighborId$1];

                if (b$1.zoom <= zoom) {
                    continue;
                }
                b$1.zoom = zoom; // save the zoom (so it doesn't get processed twice)

                var numPoints2 = b$1.numPoints || 1;
                wx += b$1.x * numPoints2; // accumulate coordinates for calculating weighted center
                wy += b$1.y * numPoints2;

                b$1.parentId = id;

                if (reduce) {
                    if (!clusterProperties) {
                        clusterProperties = this._map(p, true);
                    }
                    reduce(clusterProperties, this._map(b$1));
                }
            }

            p.parentId = id;
            clusters.push(createCluster(wx / numPoints, wy / numPoints, id, numPoints, clusterProperties));
        } else {
            // left points as unclustered
            clusters.push(p);

            if (numPoints > 1) {
                for (var i$3 = 0, list$2 = neighborIds; i$3 < list$2.length; i$3 += 1) {
                    var neighborId$2 = list$2[i$3];

                    var b$2 = tree.points[neighborId$2];
                    if (b$2.zoom <= zoom) {
                        continue;
                    }
                    b$2.zoom = zoom;
                    clusters.push(b$2);
                }
            }
        }
    }

    return clusters;
};

// get index of the point from which the cluster originated
Supercluster.prototype._getOriginId = function _getOriginId(clusterId) {
    return clusterId - this.points.length >> 5;
};

// get zoom of the point from which the cluster originated
Supercluster.prototype._getOriginZoom = function _getOriginZoom(clusterId) {
    return (clusterId - this.points.length) % 32;
};

Supercluster.prototype._map = function _map(point, clone) {
    if (point.numPoints) {
        return clone ? extend({}, point.properties) : point.properties;
    }
    var original = this.points[point.index].properties;
    var result = this.options.map(original);
    return clone && result === original ? extend({}, result) : result;
};

function createCluster(x, y, id, numPoints, properties) {
    return {
        x: x, // weighted cluster center
        y: y,
        zoom: Infinity, // the last zoom the cluster was processed at
        id: id, // encodes index of the first child of the cluster and its zoom level
        parentId: -1, // parent cluster id
        numPoints: numPoints,
        properties: properties
    };
}

function createPointCluster(p, id) {
    var ref = p.geometry.coordinates;
    var x = ref[0];
    var y = ref[1];
    return {
        x: lngX(x), // projected point coordinates
        y: latY(y),
        zoom: Infinity, // the last zoom the point was processed at
        index: id, // index of the source feature in the original input array,
        parentId: -1 // parent cluster id
    };
}

function getClusterJSON(cluster) {
    return {
        type: 'Feature',
        id: cluster.id,
        properties: getClusterProperties(cluster),
        geometry: {
            type: 'Point',
            coordinates: [xLng(cluster.x), yLat(cluster.y)]
        }
    };
}

function getClusterProperties(cluster) {
    var count = cluster.numPoints;
    var abbrev = count >= 10000 ? Math.round(count / 1000) + "k" : count >= 1000 ? Math.round(count / 100) / 10 + "k" : count;
    return extend(extend({}, cluster.properties), {
        cluster: true,
        cluster_id: cluster.id,
        point_count: count,
        point_count_abbreviated: abbrev
    });
}

// longitude/latitude to spherical mercator in [0..1] range
function lngX(lng) {
    return lng / 360 + 0.5;
}
function latY(lat) {
    var sin = Math.sin(lat * Math.PI / 180);
    var y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
    return y < 0 ? 0 : y > 1 ? 1 : y;
}

// spherical mercator to longitude/latitude
function xLng(x) {
    return (x - 0.5) * 360;
}
function yLat(y) {
    var y2 = (180 - y * 360) * Math.PI / 180;
    return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
}

function extend(dest, src) {
    for (var id in src) {
        dest[id] = src[id];
    }
    return dest;
}

function getX(p) {
    return p.x;
}
function getY(p) {
    return p.y;
}

/**
 * @author kyle / http://nikai.us/
 */

if (typeof window !== 'undefined') {
    requestAnimationFrame(animate);
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

var BaseLayer = function () {
    function BaseLayer(map, dataSet, options) {
        classCallCheck(this, BaseLayer);

        if (!(dataSet instanceof DataSet)) {
            dataSet = new DataSet(dataSet);
        }

        this.dataSet = dataSet;
        this.map = map;
        if (options.draw === 'cluster') {
            this.refreshCluster(options);
        }
    }

    createClass(BaseLayer, [{
        key: 'refreshCluster',
        value: function refreshCluster(options) {
            options = options || this.options;
            this.supercluster = new Supercluster({
                maxZoom: options.maxZoom || 19,
                radius: options.clusterRadius || 100,
                minPoints: options.minPoints || 2,
                extent: options.extent || 512
            });

            this.supercluster.load(this.dataSet.get());
            // 拿到每个级别下的最大值最小值
            this.supercluster.trees.forEach(function (item) {
                var max = 0;
                var min = Infinity;
                item.points.forEach(function (point) {
                    max = Math.max(point.numPoints || 0, max);
                    min = Math.min(point.numPoints || Infinity, min);
                });
                item.max = max;
                item.min = min;
            });
            this.clusterDataSet = new DataSet();
        }
    }, {
        key: 'getDefaultContextConfig',
        value: function getDefaultContextConfig() {
            return {
                globalAlpha: 1,
                globalCompositeOperation: 'source-over',
                imageSmoothingEnabled: true,
                strokeStyle: '#000000',
                fillStyle: '#000000',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 0,
                shadowColor: 'rgba(0, 0, 0, 0)',
                lineWidth: 1,
                lineCap: 'butt',
                lineJoin: 'miter',
                miterLimit: 10,
                lineDashOffset: 0,
                font: '10px sans-serif',
                textAlign: 'start',
                textBaseline: 'alphabetic'
            };
        }
    }, {
        key: 'initDataRange',
        value: function initDataRange(options) {
            var self = this;
            self.intensity = new Intensity({
                maxSize: self.options.maxSize,
                minSize: self.options.minSize,
                gradient: self.options.gradient,
                max: self.options.max || this.dataSet.getMax('count')
            });
            self.category = new Category(self.options.splitList);
            self.choropleth = new Choropleth(self.options.splitList);
            if (self.options.splitList === undefined) {
                self.category.generateByDataSet(this.dataSet, self.options.color);
            }
            if (self.options.splitList === undefined) {
                var min = self.options.min || this.dataSet.getMin('count');
                var max = self.options.max || this.dataSet.getMax('count');
                self.choropleth.generateByMinMax(min, max);
            }
        }
    }, {
        key: 'getLegend',
        value: function getLegend(options) {
            var draw = this.options.draw;
            var legend = null;
            var self = this;
            if (self.options.draw == 'intensity' || self.options.draw == 'heatmap') {
                return this.intensity.getLegend(options);
            } else if (self.options.draw == 'category') {
                return this.category.getLegend(options);
            }
        }
    }, {
        key: 'processData',
        value: function processData(data) {
            var self = this;
            var draw = self.options.draw;
            if (draw == 'bubble' || draw == 'intensity' || draw == 'category' || draw == 'choropleth' || draw == 'simple') {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];

                    if (self.options.draw == 'bubble') {
                        data[i]._size = self.intensity.getSize(item.count);
                    } else {
                        data[i]._size = undefined;
                    }

                    var styleType = '_fillStyle';

                    if (data[i].geometry.type === 'LineString' || self.options.styleType === 'stroke') {
                        styleType = '_strokeStyle';
                    }

                    if (self.options.draw == 'intensity') {
                        data[i][styleType] = self.intensity.getColor(item.count);
                    } else if (self.options.draw == 'category') {
                        data[i][styleType] = self.category.get(item.count);
                    } else if (self.options.draw == 'choropleth') {
                        data[i][styleType] = self.choropleth.get(item.count);
                    }
                }
            }
        }
    }, {
        key: 'isEnabledTime',
        value: function isEnabledTime() {
            var animationOptions = this.options.animation;

            var flag = animationOptions && !(animationOptions.enabled === false);

            return flag;
        }
    }, {
        key: 'argCheck',
        value: function argCheck(options) {
            if (options.draw == 'heatmap') {
                if (options.strokeStyle) {
                    console.warn('[heatmap] options.strokeStyle is discard, pleause use options.strength [eg: options.strength = 0.1]');
                }
            }
        }
    }, {
        key: 'drawContext',
        value: function drawContext(context, dataSet, options, nwPixel) {
            var self = this;
            switch (self.options.draw) {
                case 'heatmap':
                    drawHeatmap.draw(context, dataSet, self.options);
                    break;
                case 'grid':
                case 'cluster':
                case 'honeycomb':
                    self.options.offset = {
                        x: nwPixel.x,
                        y: nwPixel.y
                    };
                    if (self.options.draw === 'grid') {
                        drawGrid.draw(context, dataSet, self.options);
                    } else if (self.options.draw === 'cluster') {
                        drawCluster.draw(context, dataSet, self.options);
                    } else {
                        drawHoneycomb.draw(context, dataSet, self.options);
                    }
                    break;
                case 'text':
                    drawText.draw(context, dataSet, self.options);
                    break;
                case 'icon':
                    drawIcon.draw(context, dataSet, self.options);
                    break;
                case 'clip':
                    drawClip.draw(context, dataSet, self.options);
                    break;
                default:
                    if (self.options.context == 'webgl') {
                        webglDrawSimple.draw(self.canvasLayer.canvas.getContext('webgl'), dataSet, self.options);
                    } else {
                        drawSimple.draw(context, dataSet, self.options);
                    }
            }

            if (self.options.arrow && self.options.arrow.show !== false) {
                object.draw(context, dataSet, self.options);
            }
        }
    }, {
        key: 'isPointInPath',
        value: function isPointInPath(context, pixel) {
            var context = this.canvasLayer.canvas.getContext(this.context);
            var data;
            if (this.options.draw === 'cluster' && (!this.options.maxClusterZoom || this.options.maxClusterZoom >= this.getZoom())) {
                data = this.clusterDataSet.get();
            } else {
                data = this.dataSet.get();
            }
            for (var i = 0; i < data.length; i++) {
                context.beginPath();
                var options = this.options;
                var x = pixel.x * this.canvasLayer.devicePixelRatio;
                var y = pixel.y * this.canvasLayer.devicePixelRatio;

                options.multiPolygonDraw = function () {
                    if (context.isPointInPath(x, y)) {
                        return data[i];
                    }
                };

                pathSimple.draw(context, data[i], options);

                var geoType = data[i].geometry && data[i].geometry.type;
                if (geoType.indexOf('LineString') > -1) {
                    if (context.isPointInStroke && context.isPointInStroke(x, y)) {
                        return data[i];
                    }
                } else {
                    if (context.isPointInPath(x, y)) {
                        return data[i];
                    }
                }
            }
        }
        // 递归获取聚合点下的所有原始点数据

    }, {
        key: 'getClusterPoints',
        value: function getClusterPoints(cluster) {
            var _this = this;

            if (cluster.type !== 'Feature') {
                return [];
            }
            var children = this.supercluster.getChildren(cluster.id);
            return children.map(function (item) {
                if (item.type === 'Feature') {
                    return _this.getClusterPoints(item);
                } else {
                    return item;
                }
            }).flat();
        }
    }, {
        key: 'clickEvent',
        value: function clickEvent(pixel, e) {
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);

            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                this.options.methods.click(dataItem, e);
            } else {
                this.options.methods.click(null, e);
            }
        }
    }, {
        key: 'mousemoveEvent',
        value: function mousemoveEvent(pixel, e) {
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                this.options.methods.mousemove(dataItem, e);
            } else {
                this.options.methods.mousemove(null, e);
            }
        }
    }, {
        key: 'tapEvent',
        value: function tapEvent(pixel, e) {
            if (!this.options.methods) {
                return;
            }
            var dataItem = this.isPointInPath(this.getContext(), pixel);
            if (dataItem) {
                if (this.options.draw === 'cluster') {
                    var children = this.getClusterPoints(dataItem);
                    dataItem.children = children;
                }
                this.options.methods.tap(dataItem, e);
            } else {
                this.options.methods.tap(null, e);
            }
        }

        /**
         * obj.options
         */

    }, {
        key: 'update',
        value: function update(obj, isDraw) {
            var self = this;
            var _options = obj.options;
            var options = self.options;
            for (var i in _options) {
                options[i] = _options[i];
            }
            self.init(options);
            if (isDraw !== false) {
                self.draw();
            }
        }
    }, {
        key: 'setOptions',
        value: function setOptions(options) {
            var self = this;
            self.dataSet.reset();
            // console.log('xxx1')
            self.init(options);
            // console.log('xxx')
            self.draw();
        }
    }, {
        key: 'set',
        value: function set$$1(obj) {
            var self = this;
            var ctx = this.getContext();
            var conf = this.getDefaultContextConfig();
            for (var i in conf) {
                ctx[i] = conf[i];
            }
            self.init(obj.options);
            self.draw();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.unbindEvent();
            this.hide();
        }
    }, {
        key: 'initAnimator',
        value: function initAnimator() {
            var self = this;
            var animationOptions = self.options.animation;

            if (self.options.draw == 'time' || self.isEnabledTime()) {
                if (!animationOptions.stepsRange) {
                    animationOptions.stepsRange = {
                        start: this.dataSet.getMin('time') || 0,
                        end: this.dataSet.getMax('time') || 0
                    };
                }

                this.steps = { step: animationOptions.stepsRange.start };
                self.animator = new TWEEN.Tween(this.steps).onUpdate(function () {
                    self._canvasUpdate(this.step);
                }).repeat(Infinity);

                this.addAnimatorEvent();

                var duration = animationOptions.duration * 1000 || 5000;

                self.animator.to({ step: animationOptions.stepsRange.end }, duration);
                self.animator.start();
            } else {
                self.animator && self.animator.stop();
            }
        }
    }, {
        key: 'addAnimatorEvent',
        value: function addAnimatorEvent() {}
    }, {
        key: 'animatorMovestartEvent',
        value: function animatorMovestartEvent() {
            var animationOptions = this.options.animation;
            if (this.isEnabledTime() && this.animator) {
                this.steps.step = animationOptions.stepsRange.start;
                this.animator.stop();
            }
        }
    }, {
        key: 'animatorMoveendEvent',
        value: function animatorMoveendEvent() {
            if (this.isEnabledTime() && this.animator) {
                this.animator.start();
            }
        }
    }]);
    return BaseLayer;
}();

var global$4 = typeof window === 'undefined' ? {} : window;
var BMap$2 = global$4.BMap || global$4.BMapGL;

var AnimationLayer = function (_BaseLayer) {
    inherits(AnimationLayer, _BaseLayer);

    function AnimationLayer(map, dataSet, options) {
        classCallCheck(this, AnimationLayer);

        var _this = possibleConstructorReturn(this, (AnimationLayer.__proto__ || Object.getPrototypeOf(AnimationLayer)).call(this, map, dataSet, options));

        _this.map = map;
        _this.options = options || {};
        _this.dataSet = dataSet;

        var canvasLayer = new CanvasLayer({
            map: map,
            zIndex: _this.options.zIndex,
            update: _this._canvasUpdate.bind(_this)
        });

        _this.init(_this.options);

        _this.canvasLayer = canvasLayer;
        _this.transferToMercator();
        var self = _this;
        dataSet.on('change', function () {
            self.transferToMercator();
            canvasLayer.draw();
        });
        _this.ctx = canvasLayer.canvas.getContext('2d');

        _this.start();
        return _this;
    }

    createClass(AnimationLayer, [{
        key: "draw",
        value: function draw() {
            this.canvasLayer.draw();
        }
    }, {
        key: "init",
        value: function init(options) {

            var self = this;
            self.options = options;
            this.initDataRange(options);
            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            if (self.options.max) {
                this.intensity.setMax(self.options.max);
            }

            if (self.options.min) {
                this.intensity.setMin(self.options.min);
            }

            this.initAnimator();
        }

        // 经纬度左边转换为墨卡托坐标

    }, {
        key: "transferToMercator",
        value: function transferToMercator() {
            var map = this.map;
            var mapType = map.getMapType();
            var projection;
            if (mapType.getProjection) {
                projection = mapType.getProjection();
            } else {
                projection = {
                    lngLatToPoint: function lngLatToPoint(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }

            if (this.options.coordType !== 'bd09mc') {
                var data = this.dataSet.get();
                data = this.dataSet.transferCoordinate(data, function (coordinates) {
                    var pixel = projection.lngLatToPoint({
                        lng: coordinates[0],
                        lat: coordinates[1]
                    });
                    return [pixel.x, pixel.y];
                }, 'coordinates', 'coordinates_mercator');
                this.dataSet._set(data);
            }
        }
    }, {
        key: "_canvasUpdate",
        value: function _canvasUpdate() {
            var ctx = this.ctx;
            if (!ctx) {
                return;
            }
            //clear(ctx);
            var map = this.map;
            var projection;
            var mcCenter;
            if (map.getMapType().getProjection) {
                projection = map.getMapType().getProjection();
                mcCenter = projection.lngLatToPoint(map.getCenter());
            } else {
                mcCenter = {
                    x: map.getCenter().lng,
                    y: map.getCenter().lat
                };
                if (mcCenter.x > -180 && mcCenter.x < 180) {
                    mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                    mcCenter = { x: mcCenter[0], y: mcCenter[1] };
                }
                projection = {
                    lngLatToPoint: function lngLatToPoint(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }
            var zoomUnit;
            if (projection.getZoomUnits) {
                zoomUnit = projection.getZoomUnits(map.getZoom());
            } else {
                zoomUnit = Math.pow(2, 18 - map.getZoom());
            }
            var nwMc = new BMap$2.Pixel(mcCenter.x - map.getSize().width / 2 * zoomUnit, mcCenter.y + map.getSize().height / 2 * zoomUnit); //左上角墨卡托坐标

            clear(ctx);

            var dataGetOptions = {
                fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function transferCoordinate(coordinate) {
                    if (!coordinate) {
                        return;
                    }
                    var x = (coordinate[0] - nwMc.x) / zoomUnit;
                    var y = (nwMc.y - coordinate[1]) / zoomUnit;
                    return [x, y];
                }
            };

            this.data = this.dataSet.get(dataGetOptions);

            this.processData(this.data);

            this.drawAnimation();
        }
    }, {
        key: "drawAnimation",
        value: function drawAnimation() {
            var ctx = this.ctx;
            var data = this.data;
            if (!data) {
                return;
            }

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, .1)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();

            ctx.save();
            if (this.options.shadowColor) {
                ctx.shadowColor = this.options.shadowColor;
            }

            if (this.options.shadowBlur) {
                ctx.shadowBlur = this.options.shadowBlur;
            }

            if (this.options.globalAlpha) {
                ctx.globalAlpha = this.options.globalAlpha;
            }

            if (this.options.globalCompositeOperation) {
                ctx.globalCompositeOperation = this.options.globalCompositeOperation;
            }

            var options = this.options;
            for (var i = 0; i < data.length; i++) {
                if (data[i].geometry.type === 'Point') {
                    ctx.beginPath();
                    var maxSize = data[i].size || this.options.size;
                    var minSize = data[i].minSize || this.options.minSize || 0;
                    if (data[i]._size === undefined) {
                        data[i]._size = minSize;
                    }
                    ctx.arc(data[i].geometry._coordinates[0], data[i].geometry._coordinates[1], data[i]._size, 0, Math.PI * 2, true);
                    ctx.closePath();

                    data[i]._size++;

                    if (data[i]._size > maxSize) {
                        data[i]._size = minSize;
                    }
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = data[i].strokeStyle || data[i]._strokeStyle || options.strokeStyle || 'yellow';
                    ctx.stroke();
                    var fillStyle = data[i].fillStyle || data[i]._fillStyle || options.fillStyle;
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                } else if (data[i].geometry.type === 'LineString') {
                    ctx.beginPath();
                    var size = data[i].size || this.options.size || 5;
                    var minSize = data[i].minSize || this.options.minSize || 0;
                    if (data[i]._index === undefined) {
                        data[i]._index = 0;
                    }
                    var index = data[i]._index;
                    ctx.arc(data[i].geometry._coordinates[index][0], data[i].geometry._coordinates[index][1], size, 0, Math.PI * 2, true);
                    ctx.closePath();

                    data[i]._index++;

                    if (data[i]._index >= data[i].geometry._coordinates.length) {
                        data[i]._index = 0;
                    }

                    var strokeStyle = data[i].strokeStyle || options.strokeStyle;
                    var fillStyle = data[i].fillStyle || options.fillStyle || 'yellow';
                    ctx.fillStyle = fillStyle;
                    ctx.fill();
                    if (strokeStyle && options.lineWidth) {
                        ctx.lineWidth = options.lineWidth || 1;
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    }, {
        key: "animate",
        value: function animate() {
            this.drawAnimation();
            var animateTime = this.options.animateTime || 100;
            this.timeout = setTimeout(this.animate.bind(this), animateTime);
        }
    }, {
        key: "start",
        value: function start() {
            this.stop();
            this.animate();
        }
    }, {
        key: "stop",
        value: function stop() {
            clearTimeout(this.timeout);
        }
    }, {
        key: "unbindEvent",
        value: function unbindEvent() {}
    }, {
        key: "hide",
        value: function hide() {
            this.canvasLayer.hide();
            this.stop();
        }
    }, {
        key: "show",
        value: function show() {
            this.start();
        }
    }, {
        key: "clearData",
        value: function clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.stop();
            this.unbindEvent();
            this.clearData();
            this.map.removeOverlay(this.canvasLayer);
            this.canvasLayer = null;
        }
    }]);
    return AnimationLayer;
}(BaseLayer);

/**
 * @author kyle / http://nikai.us/
 */

var global$5 = typeof window === 'undefined' ? {} : window;
var BMap$3 = global$5.BMap || global$5.BMapGL;

var Layer = function (_BaseLayer) {
    inherits(Layer, _BaseLayer);

    function Layer(map, dataSet, options) {
        classCallCheck(this, Layer);

        var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, map, dataSet, options));

        var self = _this;
        options = options || {};

        _this.clickEvent = _this.clickEvent.bind(_this);
        _this.mousemoveEvent = _this.mousemoveEvent.bind(_this);
        _this.tapEvent = _this.tapEvent.bind(_this);

        self.init(options);
        self.argCheck(options);
        self.transferToMercator();

        var canvasLayer = _this.canvasLayer = new CanvasLayer({
            map: map,
            context: _this.context,
            updateImmediate: options.updateImmediate,
            paneName: options.paneName,
            mixBlendMode: options.mixBlendMode,
            enableMassClear: options.enableMassClear,
            zIndex: options.zIndex,
            update: function update() {
                self._canvasUpdate();
            }
        });

        dataSet.on('change', function () {
            self.transferToMercator();
            // 数据更新后重新生成聚合数据
            if (options.draw === 'cluster') {
                self.refreshCluster();
            }
            canvasLayer.draw();
        });
        return _this;
    }

    createClass(Layer, [{
        key: 'clickEvent',
        value: function clickEvent(e) {
            var pixel = e.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), 'clickEvent', this).call(this, pixel, e);
        }
    }, {
        key: 'mousemoveEvent',
        value: function mousemoveEvent(e) {
            var pixel = e.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), 'mousemoveEvent', this).call(this, pixel, e);
        }
    }, {
        key: 'tapEvent',
        value: function tapEvent(e) {
            var pixel = e.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), 'tapEvent', this).call(this, pixel, e);
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent(e) {
            this.unbindEvent();
            var map = this.map;
            var timer = 0;
            var that = this;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.setDefaultCursor('default');
                    map.addEventListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.addEventListener('mousemove', this.mousemoveEvent);
                }

                if ('ontouchend' in window.document && this.options.methods.tap) {
                    map.addEventListener('touchstart', function (e) {
                        timer = new Date();
                    });
                    map.addEventListener('touchend', function (e) {
                        if (new Date() - timer < 300) {
                            that.tapEvent(e);
                        }
                    });
                }
            }
        }
    }, {
        key: 'unbindEvent',
        value: function unbindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.removeEventListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.removeEventListener('mousemove', this.mousemoveEvent);
                }
            }
        }

        // 经纬度左边转换为墨卡托坐标

    }, {
        key: 'transferToMercator',
        value: function transferToMercator(dataSet) {
            if (!dataSet) {
                dataSet = this.dataSet;
            }

            var map = this.map;

            var mapType = map.getMapType();
            var projection;
            if (mapType.getProjection) {
                projection = mapType.getProjection();
            } else {
                projection = {
                    lngLatToPoint: function lngLatToPoint(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }

            if (this.options.coordType !== 'bd09mc') {
                var data = dataSet.get();
                data = dataSet.transferCoordinate(data, function (coordinates) {
                    if (coordinates[0] < -180 || coordinates[0] > 180 || coordinates[1] < -90 || coordinates[1] > 90) {
                        return coordinates;
                    } else {
                        var pixel = projection.lngLatToPoint({
                            lng: coordinates[0],
                            lat: coordinates[1]
                        });
                        return [pixel.x, pixel.y];
                    }
                }, 'coordinates', 'coordinates_mercator');
                dataSet._set(data);
            }
        }
    }, {
        key: 'getContext',
        value: function getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }
    }, {
        key: '_canvasUpdate',
        value: function _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }
            var self = this;
            var animationOptions = this.options.animation;
            var map = this.canvasLayer._map;
            var projection;
            var mcCenter;
            if (map.getMapType().getProjection) {
                projection = map.getMapType().getProjection();
                mcCenter = projection.lngLatToPoint(map.getCenter());
            } else {
                mcCenter = {
                    x: map.getCenter().lng,
                    y: map.getCenter().lat
                };
                if (mcCenter.x > -180 && mcCenter.x < 180) {
                    mcCenter = map.lnglatToMercator(mcCenter.x, mcCenter.y);
                    mcCenter = { x: mcCenter[0], y: mcCenter[1] };
                }
                projection = {
                    lngLatToPoint: function lngLatToPoint(point) {
                        var mc = map.lnglatToMercator(point.lng, point.lat);
                        return {
                            x: mc[0],
                            y: mc[1]
                        };
                    }
                };
            }
            var zoomUnit;
            if (projection.getZoomUnits) {
                zoomUnit = projection.getZoomUnits(map.getZoom());
            } else {
                zoomUnit = Math.pow(2, 18 - map.getZoom());
            }
            //左上角墨卡托坐标
            var nwMc = new BMap$3.Pixel(mcCenter.x - map.getSize().width / 2 * zoomUnit, mcCenter.y + map.getSize().height / 2 * zoomUnit);

            var context = this.getContext();
            if (this.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return;
                }
                if (this.context == '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context == '2d') {
                for (var key in this.options) {
                    context[key] = this.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (this.options.minZoom && map.getZoom() < this.options.minZoom || this.options.maxZoom && map.getZoom() > this.options.maxZoom) {
                return;
            }

            var scale = 1;
            if (this.context != '2d') {
                scale = this.canvasLayer.devicePixelRatio;
            }

            var dataGetOptions = {
                fromColumn: this.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function transferCoordinate(coordinate) {
                    var x = (coordinate[0] - nwMc.x) / zoomUnit * scale;
                    var y = (nwMc.y - coordinate[1]) / zoomUnit * scale;
                    return [x, y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    if (time && item.time > time - trails && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            // get data from data set
            var data;
            var zoom = this.getZoom();
            if (this.options.draw === 'cluster' && (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)) {
                var bounds = this.map.getBounds();
                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();
                var clusterData = this.supercluster.getClusters([sw.lng, sw.lat, ne.lng, ne.lat], zoom);
                this.pointCountMax = this.supercluster.trees[zoom].max;
                this.pointCountMin = this.supercluster.trees[zoom].min;
                var intensity = {};
                var color = null;
                var size = null;
                if (this.pointCountMax === this.pointCountMin) {
                    color = this.options.fillStyle;
                    size = this.options.minSize || 8;
                } else {
                    intensity = new Intensity({
                        min: this.pointCountMin,
                        max: this.pointCountMax,
                        minSize: this.options.minSize || 8,
                        maxSize: this.options.maxSize || 30,
                        gradient: this.options.gradient
                    });
                }
                for (var i = 0; i < clusterData.length; i++) {
                    var item = clusterData[i];
                    if (item.properties && item.properties.cluster_id) {
                        clusterData[i].size = size || intensity.getSize(item.properties.point_count);
                        clusterData[i].fillStyle = color || intensity.getColor(item.properties.point_count);
                    } else {
                        clusterData[i].size = self.options.size;
                    }
                }

                this.clusterDataSet.set(clusterData);
                this.transferToMercator(this.clusterDataSet);
                data = self.clusterDataSet.get(dataGetOptions);
            } else {
                data = self.dataSet.get(dataGetOptions);
            }

            this.processData(data);

            var nwPixel = map.pointToPixel(new BMap$3.Point(0, 0));

            if (self.options.unit == 'm') {
                if (self.options.size) {
                    self.options._size = self.options.size / zoomUnit;
                }
                if (self.options.width) {
                    self.options._width = self.options.width / zoomUnit;
                }
                if (self.options.height) {
                    self.options._height = self.options.height / zoomUnit;
                }
            } else {
                self.options._size = self.options.size;
                self.options._height = self.options.height;
                self.options._width = self.options.width;
            }

            this.drawContext(context, data, self.options, nwPixel);

            //console.timeEnd('draw');

            //console.timeEnd('update')
            self.options.updateCallback && self.options.updateCallback(time);
        }
    }, {
        key: 'init',
        value: function init(options) {
            var self = this;
            self.options = options;
            this.initDataRange(options);
            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            if (self.options.max) {
                this.intensity.setMax(self.options.max);
            }

            if (self.options.min) {
                this.intensity.setMin(self.options.min);
            }

            this.initAnimator();
            this.bindEvent();
        }
    }, {
        key: 'getZoom',
        value: function getZoom() {
            return this.map.getZoom();
        }
    }, {
        key: 'addAnimatorEvent',
        value: function addAnimatorEvent() {
            this.map.addEventListener('movestart', this.animatorMovestartEvent.bind(this));
            this.map.addEventListener('moveend', this.animatorMoveendEvent.bind(this));
        }
    }, {
        key: 'show',
        value: function show() {
            this.map.addOverlay(this.canvasLayer);
            this.bindEvent();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.unbindEvent();
            this.map.removeOverlay(this.canvasLayer);
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.canvasLayer && this.canvasLayer.draw();
        }
    }, {
        key: 'clearData',
        value: function clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.unbindEvent();
            this.clearData();
            this.map.removeOverlay(this.canvasLayer);
            this.canvasLayer = null;
        }
    }]);
    return Layer;
}(BaseLayer);

/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Extends OverlayView to provide a canvas "Layer".
 * @author Brendan Kenny
 */

/**
 * A map layer that provides a canvas over the slippy map and a callback
 * system for efficient animation. Requires canvas and CSS 2D transform
 * support.
 * @constructor
 * @extends google.maps.OverlayView
 * @param {CanvasLayerOptions=} opt_options Options to set in this CanvasLayer.
 */
function CanvasLayer$2(opt_options) {
  /**
   * If true, canvas is in a map pane and the OverlayView is fully functional.
   * See google.maps.OverlayView.onAdd for more information.
   * @type {boolean}
   * @private
   */
  this.isAdded_ = false;

  /**
   * If true, each update will immediately schedule the next.
   * @type {boolean}
   * @private
   */
  this.isAnimated_ = false;

  /**
   * The name of the MapPane in which this layer will be displayed.
   * @type {string}
   * @private
   */
  this.paneName_ = CanvasLayer$2.DEFAULT_PANE_NAME_;

  /**
   * A user-supplied function called whenever an update is required. Null or
   * undefined if a callback is not provided.
   * @type {?function=}
   * @private
   */
  this.updateHandler_ = null;

  /**
   * A user-supplied function called whenever an update is required and the
   * map has been resized since the last update. Null or undefined if a
   * callback is not provided.
   * @type {?function}
   * @private
   */
  this.resizeHandler_ = null;

  /**
   * The LatLng coordinate of the top left of the current view of the map. Will
   * be null when this.isAdded_ is false.
   * @type {google.maps.LatLng}
   * @private
   */
  this.topLeft_ = null;

  /**
   * The map-pan event listener. Will be null when this.isAdded_ is false. Will
   * be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.centerListener_ = null;

  /**
   * The map-resize event listener. Will be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.resizeListener_ = null;

  /**
   * If true, the map size has changed and this.resizeHandler_ must be called
   * on the next update.
   * @type {boolean}
   * @private
   */
  this.needsResize_ = true;

  /**
   * A browser-defined id for the currently requested callback. Null when no
   * callback is queued.
   * @type {?number}
   * @private
   */
  this.requestAnimationFrameId_ = null;

  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';

  /**
   * The canvas element.
   * @type {!HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * The CSS width of the canvas, which may be different than the width of the
   * backing store.
   * @private {number}
   */
  this.canvasCssWidth_ = 300;

  /**
   * The CSS height of the canvas, which may be different than the height of
   * the backing store.
   * @private {number}
   */
  this.canvasCssHeight_ = 150;

  /**
   * A value for scaling the CanvasLayer resolution relative to the CanvasLayer
   * display size.
   * @private {number}
   */
  this.resolutionScale_ = 1;

  /**
   * Simple bind for functions with no args for bind-less browsers (Safari).
   * @param {Object} thisArg The this value used for the target function.
   * @param {function} func The function to be bound.
   */
  function simpleBindShim(thisArg, func) {
    return function () {
      func.apply(thisArg);
    };
  }

  /**
   * A reference to this.repositionCanvas_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.repositionFunction_ = simpleBindShim(this, this.repositionCanvas_);

  /**
   * A reference to this.resize_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.resizeFunction_ = simpleBindShim(this, this.resize_);

  /**
   * A reference to this.update_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.requestUpdateFunction_ = simpleBindShim(this, this.update_);

  // set provided options, if any
  if (opt_options) {
    this.setOptions(opt_options);
  }
}

var global$6 = typeof window === 'undefined' ? {} : window;

if (global$6.google && global$6.google.maps) {

  CanvasLayer$2.prototype = new google.maps.OverlayView();

  /**
   * The default MapPane to contain the canvas.
   * @type {string}
   * @const
   * @private
   */
  CanvasLayer$2.DEFAULT_PANE_NAME_ = 'overlayLayer';

  /**
   * Transform CSS property name, with vendor prefix if required. If browser
   * does not support transforms, property will be ignored.
   * @type {string}
   * @const
   * @private
   */
  CanvasLayer$2.CSS_TRANSFORM_ = function () {
    var div = document.createElement('div');
    var transformProps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
    for (var i = 0; i < transformProps.length; i++) {
      var prop = transformProps[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }

    // return unprefixed version by default
    return transformProps[0];
  }();

  /**
   * The requestAnimationFrame function, with vendor-prefixed or setTimeout-based
   * fallbacks. MUST be called with window as thisArg.
   * @type {function}
   * @param {function} callback The function to add to the frame request queue.
   * @return {number} The browser-defined id for the requested callback.
   * @private
   */
  CanvasLayer$2.prototype.requestAnimFrame_ = global$6.requestAnimationFrame || global$6.webkitRequestAnimationFrame || global$6.mozRequestAnimationFrame || global$6.oRequestAnimationFrame || global$6.msRequestAnimationFrame || function (callback) {
    return global$6.setTimeout(callback, 1000 / 60);
  };

  /**
   * The cancelAnimationFrame function, with vendor-prefixed fallback. Does not
   * fall back to clearTimeout as some platforms implement requestAnimationFrame
   * but not cancelAnimationFrame, and the cost is an extra frame on onRemove.
   * MUST be called with window as thisArg.
   * @type {function}
   * @param {number=} requestId The id of the frame request to cancel.
   * @private
   */
  CanvasLayer$2.prototype.cancelAnimFrame_ = global$6.cancelAnimationFrame || global$6.webkitCancelAnimationFrame || global$6.mozCancelAnimationFrame || global$6.oCancelAnimationFrame || global$6.msCancelAnimationFrame || function (requestId) {};

  /**
   * Sets any options provided. See CanvasLayerOptions for more information.
   * @param {CanvasLayerOptions} options The options to set.
   */
  CanvasLayer$2.prototype.setOptions = function (options) {
    if (options.animate !== undefined) {
      this.setAnimate(options.animate);
    }

    if (options.paneName !== undefined) {
      this.setPaneName(options.paneName);
    }

    if (options.updateHandler !== undefined) {
      this.setUpdateHandler(options.updateHandler);
    }

    if (options.resizeHandler !== undefined) {
      this.setResizeHandler(options.resizeHandler);
    }

    if (options.resolutionScale !== undefined) {
      this.setResolutionScale(options.resolutionScale);
    }

    if (options.map !== undefined) {
      this.setMap(options.map);
    }
  };

  /**
   * Set the animated state of the layer. If true, updateHandler will be called
   * repeatedly, once per frame. If false, updateHandler will only be called when
   * a map property changes that could require the canvas content to be redrawn.
   * @param {boolean} animate Whether the canvas is animated.
   */
  CanvasLayer$2.prototype.setAnimate = function (animate) {
    this.isAnimated_ = !!animate;

    if (this.isAnimated_) {
      this.scheduleUpdate();
    }
  };

  /**
   * @return {boolean} Whether the canvas is animated.
   */
  CanvasLayer$2.prototype.isAnimated = function () {
    return this.isAnimated_;
  };

  /**
   * Set the MapPane in which this layer will be displayed, by name. See
   * {@code google.maps.MapPanes} for the panes available.
   * @param {string} paneName The name of the desired MapPane.
   */
  CanvasLayer$2.prototype.setPaneName = function (paneName) {
    this.paneName_ = paneName;

    this.setPane_();
  };

  /**
   * @return {string} The name of the current container pane.
   */
  CanvasLayer$2.prototype.getPaneName = function () {
    return this.paneName_;
  };

  /**
   * Adds the canvas to the specified container pane. Since this is guaranteed to
   * execute only after onAdd is called, this is when paneName's existence is
   * checked (and an error is thrown if it doesn't exist).
   * @private
   */
  CanvasLayer$2.prototype.setPane_ = function () {
    if (!this.isAdded_) {
      return;
    }

    // onAdd has been called, so panes can be used
    var panes = this.getPanes();
    if (!panes[this.paneName_]) {
      throw new Error('"' + this.paneName_ + '" is not a valid MapPane name.');
    }

    panes[this.paneName_].appendChild(this.canvas);
  };

  /**
   * Set a function that will be called whenever the parent map and the overlay's
   * canvas have been resized. If opt_resizeHandler is null or unspecified, any
   * existing callback is removed.
   * @param {?function=} opt_resizeHandler The resize callback function.
   */
  CanvasLayer$2.prototype.setResizeHandler = function (opt_resizeHandler) {
    this.resizeHandler_ = opt_resizeHandler;
  };

  /**
   * Sets a value for scaling the canvas resolution relative to the canvas
   * display size. This can be used to save computation by scaling the backing
   * buffer down, or to support high DPI devices by scaling it up (by e.g.
   * window.devicePixelRatio).
   * @param {number} scale
   */
  CanvasLayer$2.prototype.setResolutionScale = function (scale) {
    if (typeof scale === 'number') {
      this.resolutionScale_ = scale;
      this.resize_();
    }
  };

  /**
   * Set a function that will be called when a repaint of the canvas is required.
   * If opt_updateHandler is null or unspecified, any existing callback is
   * removed.
   * @param {?function=} opt_updateHandler The update callback function.
   */
  CanvasLayer$2.prototype.setUpdateHandler = function (opt_updateHandler) {
    this.updateHandler_ = opt_updateHandler;
  };

  /**
   * @inheritDoc
   */
  CanvasLayer$2.prototype.onAdd = function () {
    if (this.isAdded_) {
      return;
    }

    this.isAdded_ = true;
    this.setPane_();

    this.resizeListener_ = google.maps.event.addListener(this.getMap(), 'resize', this.resizeFunction_);
    this.centerListener_ = google.maps.event.addListener(this.getMap(), 'center_changed', this.repositionFunction_);

    this.resize_();
    this.repositionCanvas_();
  };

  /**
   * @inheritDoc
   */
  CanvasLayer$2.prototype.onRemove = function () {
    if (!this.isAdded_) {
      return;
    }

    this.isAdded_ = false;
    this.topLeft_ = null;

    // remove canvas and listeners for pan and resize from map
    this.canvas.parentElement.removeChild(this.canvas);
    if (this.centerListener_) {
      google.maps.event.removeListener(this.centerListener_);
      this.centerListener_ = null;
    }
    if (this.resizeListener_) {
      google.maps.event.removeListener(this.resizeListener_);
      this.resizeListener_ = null;
    }

    // cease canvas update callbacks
    if (this.requestAnimationFrameId_) {
      this.cancelAnimFrame_.call(global$6, this.requestAnimationFrameId_);
      this.requestAnimationFrameId_ = null;
    }
  };

  /**
   * The internal callback for resize events that resizes the canvas to keep the
   * map properly covered.
   * @private
   */
  CanvasLayer$2.prototype.resize_ = function () {
    if (!this.isAdded_) {
      return;
    }

    var map = this.getMap();
    var mapWidth = map.getDiv().offsetWidth;
    var mapHeight = map.getDiv().offsetHeight;

    var newWidth = mapWidth * this.resolutionScale_;
    var newHeight = mapHeight * this.resolutionScale_;
    var oldWidth = this.canvas.width;
    var oldHeight = this.canvas.height;

    // resizing may allocate a new back buffer, so do so conservatively
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;

      this.needsResize_ = true;
      this.scheduleUpdate();
    }

    // reset styling if new sizes don't match; resize of data not needed
    if (this.canvasCssWidth_ !== mapWidth || this.canvasCssHeight_ !== mapHeight) {
      this.canvasCssWidth_ = mapWidth;
      this.canvasCssHeight_ = mapHeight;
      this.canvas.style.width = mapWidth + 'px';
      this.canvas.style.height = mapHeight + 'px';
    }
  };

  /**
   * @inheritDoc
   */
  CanvasLayer$2.prototype.draw = function () {
    this.repositionCanvas_();
  };

  /**
   * Internal callback for map view changes. Since the Maps API moves the overlay
   * along with the map, this function calculates the opposite translation to
   * keep the canvas in place.
   * @private
   */
  CanvasLayer$2.prototype.repositionCanvas_ = function () {
    // TODO(bckenny): *should* only be executed on RAF, but in current browsers
    //     this causes noticeable hitches in map and overlay relative
    //     positioning.

    var map = this.getMap();

    // topLeft can't be calculated from map.getBounds(), because bounds are
    // clamped to -180 and 180 when completely zoomed out. Instead, calculate
    // left as an offset from the center, which is an unwrapped LatLng.
    var top = map.getBounds().getNorthEast().lat();
    var center = map.getCenter();
    var scale = Math.pow(2, map.getZoom());
    var left = center.lng() - this.canvasCssWidth_ * 180 / (256 * scale);
    this.topLeft_ = new google.maps.LatLng(top, left);

    // Canvas position relative to draggable map's container depends on
    // overlayView's projection, not the map's. Have to use the center of the
    // map for this, not the top left, for the same reason as above.
    var projection = this.getProjection();
    var divCenter = projection.fromLatLngToDivPixel(center);
    var offsetX = -Math.round(this.canvasCssWidth_ / 2 - divCenter.x);
    var offsetY = -Math.round(this.canvasCssHeight_ / 2 - divCenter.y);
    this.canvas.style[CanvasLayer$2.CSS_TRANSFORM_] = 'translate(' + offsetX + 'px,' + offsetY + 'px)';

    this.scheduleUpdate();
  };

  /**
   * Internal callback that serves as main animation scheduler via
   * requestAnimationFrame. Calls resize and update callbacks if set, and
   * schedules the next frame if overlay is animated.
   * @private
   */
  CanvasLayer$2.prototype.update_ = function () {
    this.requestAnimationFrameId_ = null;

    if (!this.isAdded_) {
      return;
    }

    if (this.isAnimated_) {
      this.scheduleUpdate();
    }

    if (this.needsResize_ && this.resizeHandler_) {
      this.needsResize_ = false;
      this.resizeHandler_();
    }

    if (this.updateHandler_) {
      this.updateHandler_();
    }
  };

  /**
   * A convenience method to get the current LatLng coordinate of the top left of
   * the current view of the map.
   * @return {google.maps.LatLng} The top left coordinate.
   */
  CanvasLayer$2.prototype.getTopLeft = function () {
    return this.topLeft_;
  };

  /**
   * Schedule a requestAnimationFrame callback to updateHandler. If one is
   * already scheduled, there is no effect.
   */
  CanvasLayer$2.prototype.scheduleUpdate = function () {
    if (this.isAdded_ && !this.requestAnimationFrameId_) {
      this.requestAnimationFrameId_ = this.requestAnimFrame_.call(global$6, this.requestUpdateFunction_);
    }
  };
}

/**
 * @author kyle / http://nikai.us/
 */

var Layer$2 = function (_BaseLayer) {
    inherits(Layer, _BaseLayer);

    function Layer(map, dataSet, options) {
        classCallCheck(this, Layer);

        var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, map, dataSet, options));

        var self = _this;
        var data = null;
        options = options || {};

        self.init(options);
        self.argCheck(options);

        var canvasLayerOptions = {
            map: map,
            animate: false,
            updateHandler: function updateHandler() {
                self._canvasUpdate();
            },
            resolutionScale: resolutionScale
        };

        var canvasLayer = _this.canvasLayer = new CanvasLayer$2(canvasLayerOptions);

        _this.clickEvent = _this.clickEvent.bind(_this);
        _this.mousemoveEvent = _this.mousemoveEvent.bind(_this);
        _this.bindEvent();
        return _this;
    }

    createClass(Layer, [{
        key: "clickEvent",
        value: function clickEvent(e) {
            var pixel = e.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "clickEvent", this).call(this, pixel, e);
        }
    }, {
        key: "mousemoveEvent",
        value: function mousemoveEvent(e) {
            var pixel = e.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "mousemoveEvent", this).call(this, pixel, e);
        }
    }, {
        key: "bindEvent",
        value: function bindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.setDefaultCursor("default");
                    map.addListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.addListener('mousemove', this.mousemoveEvent);
                }
            }
        }
    }, {
        key: "unbindEvent",
        value: function unbindEvent(e) {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.removeListener('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.removeListener('mousemove', this.mousemoveEvent);
                }
            }
        }
    }, {
        key: "getContext",
        value: function getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }
    }, {
        key: "_canvasUpdate",
        value: function _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }

            var self = this;

            var animationOptions = self.options.animation;

            var context = this.getContext();

            if (self.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return;
                }
                if (this.context == '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context == '2d') {
                for (var key in self.options) {
                    context[key] = self.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
                return;
            }

            var scale = 1;
            if (this.context != '2d') {
                scale = this.canvasLayer.devicePixelRatio;
            }

            var map = this.map;
            var mapProjection = map.getProjection();
            var scale = Math.pow(2, map.zoom) * resolutionScale;
            var offset = mapProjection.fromLatLngToPoint(this.canvasLayer.getTopLeft());
            var dataGetOptions = {
                //fromColumn: self.options.coordType == 'bd09mc' ? 'coordinates' : 'coordinates_mercator',
                transferCoordinate: function transferCoordinate(coordinate) {
                    var latLng = new google.maps.LatLng(coordinate[1], coordinate[0]);
                    var worldPoint = mapProjection.fromLatLngToPoint(latLng);
                    var pixel = {
                        x: (worldPoint.x - offset.x) * scale,
                        y: (worldPoint.y - offset.y) * scale
                    };
                    return [pixel.x, pixel.y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    if (time && item.time > time - trails && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            // get data from data set
            var data = self.dataSet.get(dataGetOptions);

            this.processData(data);

            var latLng = new google.maps.LatLng(0, 0);
            var worldPoint = mapProjection.fromLatLngToPoint(latLng);
            var pixel = {
                x: (worldPoint.x - offset.x) * scale,
                y: (worldPoint.y - offset.y) * scale
            };

            if (self.options.unit == 'm' && self.options.size) {
                self.options._size = self.options.size / zoomUnit;
            } else {
                self.options._size = self.options.size;
            }

            this.drawContext(context, new DataSet(data), self.options, pixel);

            //console.timeEnd('draw');

            //console.timeEnd('update')
            self.options.updateCallback && self.options.updateCallback(time);
        }
    }, {
        key: "init",
        value: function init(options) {

            var self = this;

            self.options = options;

            this.initDataRange(options);

            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            this.initAnimator();
        }
    }, {
        key: "addAnimatorEvent",
        value: function addAnimatorEvent() {
            this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
            this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
        }
    }, {
        key: "show",
        value: function show() {
            this.map.addOverlay(this.canvasLayer);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.map.removeOverlay(this.canvasLayer);
        }
    }, {
        key: "draw",
        value: function draw() {
            self.canvasLayer.draw();
        }
    }]);
    return Layer;
}(BaseLayer);

/**
 * MapV for maptalks.js (https://github.com/maptalks/maptalks.js)
 * @author fuzhenn / https://github.com/fuzhenn
 */
// import * as maptalks from 'maptalks';
var Layer$4 = void 0;
if (typeof maptalks !== 'undefined') {
    Layer$4 = function (_maptalks$Layer) {
        inherits(Layer, _maptalks$Layer);

        function Layer(id, dataSet, options) {
            classCallCheck(this, Layer);

            var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, id, options));

            _this.options_ = options;
            _this.dataSet = dataSet;
            _this._initBaseLayer(options);
            return _this;
        }

        createClass(Layer, [{
            key: "_initBaseLayer",
            value: function _initBaseLayer(options) {
                var self = this;
                var baseLayer = this.baseLayer = new BaseLayer(null, this.dataSet, options);
                self.init(options);
                baseLayer.argCheck(options);
            }
        }, {
            key: "clickEvent",
            value: function clickEvent(e) {
                if (!this.baseLayer) {
                    return;
                }
                var pixel = e.containerPoint;
                this.baseLayer.clickEvent(pixel, e.domEvent);
            }
        }, {
            key: "mousemoveEvent",
            value: function mousemoveEvent(e) {
                if (!this.baseLayer) {
                    return;
                }
                var pixel = e.containerPoint;
                this.baseLayer.mousemoveEvent(pixel, e.domEvent);
            }
        }, {
            key: "getEvents",
            value: function getEvents() {
                return {
                    'click': this.clickEvent,
                    'mousemove': this.mousemoveEvent
                };
            }
        }, {
            key: "init",
            value: function init(options) {

                var base = this.baseLayer;

                base.options = options;

                base.initDataRange(options);

                base.context = base.options.context || '2d';

                base.initAnimator();
            }
        }, {
            key: "addAnimatorEvent",
            value: function addAnimatorEvent() {
                this.map.addListener('movestart', this.animatorMovestartEvent.bind(this));
                this.map.addListener('moveend', this.animatorMoveendEvent.bind(this));
            }
        }]);
        return Layer;
    }(maptalks.Layer);

    var LayerRenderer = function (_maptalks$renderer$Ca) {
        inherits(LayerRenderer, _maptalks$renderer$Ca);

        function LayerRenderer() {
            classCallCheck(this, LayerRenderer);
            return possibleConstructorReturn(this, (LayerRenderer.__proto__ || Object.getPrototypeOf(LayerRenderer)).apply(this, arguments));
        }

        createClass(LayerRenderer, [{
            key: "needToRedraw",
            value: function needToRedraw() {
                var base = this.layer.baseLayer;
                if (base.isEnabledTime()) {
                    return true;
                }
                return get(LayerRenderer.prototype.__proto__ || Object.getPrototypeOf(LayerRenderer.prototype), "needToRedraw", this).call(this);
            }
        }, {
            key: "draw",
            value: function draw() {
                var base = this.layer.baseLayer;
                if (!this.canvas || !base.isEnabledTime() || this._shouldClear) {
                    this.prepareCanvas();
                    this._shouldClear = false;
                }
                this._update(this.gl || this.context, this._mapvFrameTime);
                delete this._mapvFrameTime;
                this.completeRender();
            }
        }, {
            key: "drawOnInteracting",
            value: function drawOnInteracting() {
                this.draw();
                this._shouldClear = false;
            }
        }, {
            key: "onSkipDrawOnInteracting",
            value: function onSkipDrawOnInteracting() {
                this._shouldClear = true;
            }
        }, {
            key: "_canvasUpdate",
            value: function _canvasUpdate(time) {
                this.setToRedraw();
                this._mapvFrameTime = time;
            }
        }, {
            key: "_update",
            value: function _update(context, time) {
                if (!this.canvas) {
                    return;
                }

                var self = this.layer.baseLayer;

                var animationOptions = self.options.animation;

                var map = this.getMap();

                if (self.isEnabledTime()) {
                    if (time === undefined) {
                        clear(context);
                        return;
                    }
                    if (self.context == '2d') {
                        context.save();
                        context.globalCompositeOperation = 'destination-out';
                        context.fillStyle = 'rgba(0, 0, 0, .1)';
                        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                        context.restore();
                    }
                } else {
                    clear(context);
                }

                if (self.context == '2d') {
                    for (var key in self.options) {
                        context[key] = self.options[key];
                    }
                } else {
                    context.clear(context.COLOR_BUFFER_BIT);
                }

                var scale = 1;

                //reuse to save coordinate instance creation
                var coord = new maptalks.Coordinate(0, 0);
                var dataGetOptions = {
                    fromColumn: self.options.coordType === 'bd09mc' ? 'coordinates_mercator' : 'coordinates',
                    transferCoordinate: function transferCoordinate(coordinate) {
                        coord.x = coordinate[0];
                        coord.y = coordinate[1];
                        var r = map.coordToContainerPoint(coord)._multi(scale).toArray();
                        return r;
                    }
                };

                if (time !== undefined) {
                    dataGetOptions.filter = function (item) {
                        var trails = animationOptions.trails || 10;
                        if (time && item.time > time - trails && item.time < time) {
                            return true;
                        } else {
                            return false;
                        }
                    };
                }

                // get data from data set
                var data = self.dataSet.get(dataGetOptions);

                self.processData(data);

                if (self.options.unit == 'm') {
                    if (self.options.size) {
                        self.options._size = self.options.size / zoomUnit;
                    }
                    if (self.options.width) {
                        self.options._width = self.options.width / zoomUnit;
                    }
                    if (self.options.height) {
                        self.options._height = self.options.height / zoomUnit;
                    }
                } else {
                    self.options._size = self.options.size;
                    self.options._height = self.options.height;
                    self.options._width = self.options.width;
                }

                var zeroZero = new maptalks.Point(0, 0);
                //screen position of the [0, 0] point
                var zeroZeroScreen = map._pointToContainerPoint(zeroZero)._multi(scale);
                self.drawContext(context, data, self.options, zeroZeroScreen);

                //console.timeEnd('draw');

                //console.timeEnd('update')
                self.options.updateCallback && self.options.updateCallback(time);
            }
        }, {
            key: "createCanvas",
            value: function createCanvas() {
                if (this.canvas) {
                    return;
                }
                var map = this.getMap();
                var size = map.getSize();
                var r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : maptalks.Browser.retina ? 2 : 1,
                    w = r * size.width,
                    h = r * size.height;
                this.canvas = maptalks.Canvas.createCanvas(w, h, map.CanvasClass);
                var mapvContext = this.layer.baseLayer.context;
                if (mapvContext === '2d') {
                    this.context = this.canvas.getContext('2d');
                    if (this.layer.options['globalCompositeOperation']) {
                        this.context.globalCompositeOperation = this.layer.options['globalCompositeOperation'];
                    }
                    if (this.layer.baseLayer.options.draw !== 'heatmap' && r !== 1) {
                        //in heatmap.js, devicePixelRatio is being mulitplied independently
                        this.context.scale(r, r);
                    }
                } else {
                    var attributes = {
                        'alpha': true,
                        'preserveDrawingBuffer': true,
                        'antialias': false
                    };
                    this.gl = this.canvas.getContext('webgl', attributes);
                }

                this.onCanvasCreate();

                this._bindToMapv();

                this.layer.fire('canvascreate', {
                    'context': this.context,
                    'gl': this.gl
                });
            }
        }, {
            key: "_bindToMapv",
            value: function _bindToMapv() {
                //some bindings needed by mapv baselayer
                var base = this.layer.baseLayer;
                var map = this.getMap();
                this.devicePixelRatio = map.getDevicePixelRatio ? map.getDevicePixelRatio() : maptalks.Browser.retina ? 2 : 1;
                base.canvasLayer = this;
                base._canvasUpdate = this._canvasUpdate.bind(this);
                base.getContext = function () {
                    var renderer = self.getRenderer();
                    return renderer.gl || renderer.context;
                };
            }
        }]);
        return LayerRenderer;
    }(maptalks.renderer.CanvasRenderer);

    Layer$4.registerRenderer('canvas', LayerRenderer);
}

var Layer$5 = Layer$4;

/**
 * MapV for AMap
 * @author sakitam-fdd - https://github.com/sakitam-fdd
 */

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
var createCanvas = function createCanvas(width, height, Canvas) {
    if (typeof document !== 'undefined') {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    } else {
        // create a new canvas instance in node.js
        // the canvas class needs to have a default constructor without any parameter
        return new Canvas(width, height);
    }
};

var Layer$6 = function (_BaseLayer) {
    inherits(Layer, _BaseLayer);

    function Layer() {
        var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var dataSet = arguments[1];
        var options = arguments[2];
        classCallCheck(this, Layer);

        var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, map, dataSet, options));

        _this.options = options;

        /**
         * internal
         * @type {{canvas: null, devicePixelRatio: number}}
         */
        _this.canvasLayer = {
            canvas: null,
            devicePixelRatio: window.devicePixelRatio
        };

        /**
         * canvas layer
         * @type {null}
         * @private
         */
        _this.layer_ = null;

        _this.initDataRange(options);
        _this.initAnimator();
        _this.onEvents();
        map.on('complete', function () {
            this.init(map, options);
            this.argCheck(options);
        }, _this);
        return _this;
    }

    /**
     * init mapv layer
     * @param map
     * @param options
     */


    createClass(Layer, [{
        key: "init",
        value: function init(map, options) {
            if (map) {
                this.map = map;
                this.context = this.options.context || '2d';
                this.getCanvasLayer();
            } else {
                throw new Error('not map object');
            }
        }

        /**
         * update layer
         * @param time
         * @private
         */

    }, {
        key: "_canvasUpdate",
        value: function _canvasUpdate(time) {
            this.render(this.canvasLayer.canvas, time);
        }

        /**
         * render layer
         * @param canvas
         * @param time
         * @returns {Layer}
         */

    }, {
        key: "render",
        value: function render(canvas, time) {
            if (!canvas) return;
            var map = this.map;
            var context = canvas.getContext(this.context);
            var animationOptions = this.options.animation;
            if (this.isEnabledTime()) {
                if (time === undefined) {
                    clear(context);
                    return this;
                }
                if (this.context === '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                clear(context);
            }

            if (this.context === '2d') {
                for (var key in this.options) {
                    context[key] = this.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }
            var dataGetOptions = {
                transferCoordinate: function transferCoordinate(coordinate) {
                    var _pixel = map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1]));
                    return [_pixel['x'], _pixel['y']];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    if (time && item.time > time - trails && item.time < time) {
                        return true;
                    } else {
                        return false;
                    }
                };
            }

            var data = this.dataSet.get(dataGetOptions);
            this.processData(data);

            if (this.options.unit === 'm') {
                if (this.options.size) {
                    this.options._size = this.options.size / zoomUnit;
                }
                if (this.options.width) {
                    this.options._width = this.options.width / zoomUnit;
                }
                if (this.options.height) {
                    this.options._height = this.options.height / zoomUnit;
                }
            } else {
                this.options._size = this.options.size;
                this.options._height = this.options.height;
                this.options._width = this.options.width;
            }

            this.drawContext(context, new DataSet(data), this.options, { x: 0, y: 0 });
            this.options.updateCallback && this.options.updateCallback(time);
            return this;
        }

        /**
         * get canvas layer
         */

    }, {
        key: "getCanvasLayer",
        value: function getCanvasLayer() {
            if (!this.canvasLayer.canvas && !this.layer_) {
                var canvas = this.canvasFunction();
                var bounds = this.map.getBounds();
                this.layer_ = new AMap.CanvasLayer({
                    canvas: canvas,
                    bounds: this.options.bounds || bounds,
                    zooms: this.options.zooms || [0, 22]
                });
                this.layer_.setMap(this.map);
                this.map.on('mapmove', this.canvasFunction, this);
                this.map.on('zoomchange', this.canvasFunction, this);
            }
        }

        /**
         * canvas constructor
         * @returns {*}
         */

    }, {
        key: "canvasFunction",
        value: function canvasFunction() {
            var _ref = [this.map.getSize().width, this.map.getSize().height],
                width = _ref[0],
                height = _ref[1];

            if (!this.canvasLayer.canvas) {
                this.canvasLayer.canvas = createCanvas(width, height);
            } else {
                this.canvasLayer.canvas.width = width;
                this.canvasLayer.canvas.height = height;
                var bounds = this.map.getBounds();
                if (this.layer_) {
                    this.layer_.setBounds(this.options.bounds || bounds);
                }
            }
            this.render(this.canvasLayer.canvas);
            return this.canvasLayer.canvas;
        }

        /**
         * remove layer
         */

    }, {
        key: "removeLayer",
        value: function removeLayer() {
            if (!this.map) return;
            this.unEvents();
            this.map.removeLayer(this.layer_);
            delete this.map;
            delete this.layer_;
            delete this.canvasLayer.canvas;
        }
    }, {
        key: "getContext",
        value: function getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }

        /**
         * handle click event
         * @param event
         */

    }, {
        key: "clickEvent",
        value: function clickEvent(event) {
            var pixel = event.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "clickEvent", this).call(this, pixel, event);
        }

        /**
         * handle mousemove/pointermove event
         * @param event
         */

    }, {
        key: "mousemoveEvent",
        value: function mousemoveEvent(event) {
            var pixel = event.pixel;
            get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "mousemoveEvent", this).call(this, pixel, event);
        }

        /**
         * add animator event
         */

    }, {
        key: "addAnimatorEvent",
        value: function addAnimatorEvent() {
            this.map.on('movestart', this.animatorMovestartEvent, this);
            this.map.on('moveend', this.animatorMoveendEvent, this);
        }

        /**
         * bind event
         */

    }, {
        key: "onEvents",
        value: function onEvents() {
            var map = this.map;
            this.unEvents();
            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.on('click', this.clickEvent, this);
                }
                if (this.options.methods.mousemove) {
                    map.on('mousemove', this.mousemoveEvent, this);
                }
            }
        }

        /**
         * unbind events
         */

    }, {
        key: "unEvents",
        value: function unEvents() {
            var map = this.map;
            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.off('click', this.clickEvent, this);
                }
                if (this.options.methods.mousemove) {
                    map.off('mousemove', this.mousemoveEvent, this);
                }
            }
        }
    }]);
    return Layer;
}(BaseLayer);

/**
 * MapV for openlayers (https://openlayers.org)
 * @author sakitam-fdd - https://github.com/sakitam-fdd
 */

/**
 * create canvas
 * @param width
 * @param height
 * @returns {HTMLCanvasElement}
 */
var createCanvas$1 = function createCanvas(width, height) {
  if (typeof document !== 'undefined') {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
  }
};

var Layer$8 = function (_BaseLayer) {
  inherits(Layer, _BaseLayer);

  function Layer() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var dataSet = arguments[1];
    var options = arguments[2];
    classCallCheck(this, Layer);

    var _this = possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, map, dataSet, options));

    _this.options = options;

    /**
     * internal
     * @type {{canvas: null, devicePixelRatio: number}}
     */
    _this.canvasLayer = {
      canvas: null,
      devicePixelRatio: window.devicePixelRatio

      /**
       * cavnas layer
       * @type {null}
       * @private
       */
    };_this.layer_ = null;

    /**
     * previous cursor
     * @type {undefined}
     * @private
     */
    _this.previousCursor_ = undefined;

    _this.init(map, options);
    _this.argCheck(options);
    return _this;
  }

  /**
   * init mapv layer
   * @param map
   * @param options
   */


  createClass(Layer, [{
    key: "init",
    value: function init(map, options) {
      if (map && map instanceof ol.Map) {
        this.$Map = map;
        this.context = this.options.context || '2d';
        this.getCanvasLayer();
        this.initDataRange(options);
        this.initAnimator();
        this.onEvents();
      } else {
        throw new Error('not map object');
      }
    }

    /**
     * update layer
     * @param time
     * @private
     */

  }, {
    key: "_canvasUpdate",
    value: function _canvasUpdate(time) {
      this.render(this.canvasLayer.canvas, time);
    }

    /**
     * render layer
     * @param canvas
     * @param time
     * @returns {Layer}
     */

  }, {
    key: "render",
    value: function render(canvas, time) {
      var map = this.$Map;
      var context = canvas.getContext(this.context);
      var animationOptions = this.options.animation;
      var _projection = this.options.hasOwnProperty('projection') ? this.options.projection : 'EPSG:4326';
      var mapViewProjection = this.$Map.getView().getProjection().getCode();
      if (this.isEnabledTime()) {
        if (time === undefined) {
          clear(context);
          return this;
        }
        if (this.context === '2d') {
          context.save();
          context.globalCompositeOperation = 'destination-out';
          context.fillStyle = 'rgba(0, 0, 0, .1)';
          context.fillRect(0, 0, context.canvas.width, context.canvas.height);
          context.restore();
        }
      } else {
        clear(context);
      }

      if (this.context === '2d') {
        for (var key in this.options) {
          context[key] = this.options[key];
        }
      } else {
        context.clear(context.COLOR_BUFFER_BIT);
      }
      var dataGetOptions = {};
      dataGetOptions.transferCoordinate = _projection === mapViewProjection ? function (coordinate) {
        // 当数据与map的投影一致时不再进行投影转换
        return map.getPixelFromCoordinate(coordinate);
      } : function (coordinate) {
        // 数据与Map投影不一致时 将数据投影转换为 Map的投影
        return map.getPixelFromCoordinate(ol.proj.transform(coordinate, _projection, mapViewProjection));
      };

      if (time !== undefined) {
        dataGetOptions.filter = function (item) {
          var trails = animationOptions.trails || 10;
          if (time && item.time > time - trails && item.time < time) {
            return true;
          } else {
            return false;
          }
        };
      }

      var data = this.dataSet.get(dataGetOptions);
      this.processData(data);

      if (this.options.unit === 'm') {
        if (this.options.size) {
          this.options._size = this.options.size / zoomUnit;
        }
        if (this.options.width) {
          this.options._width = this.options.width / zoomUnit;
        }
        if (this.options.height) {
          this.options._height = this.options.height / zoomUnit;
        }
      } else {
        this.options._size = this.options.size;
        this.options._height = this.options.height;
        this.options._width = this.options.width;
      }

      this.drawContext(context, new DataSet(data), this.options, { x: 0, y: 0 });
      this.options.updateCallback && this.options.updateCallback(time);
      return this;
    }

    /**
     * get canvas layer
     */

  }, {
    key: "getCanvasLayer",
    value: function getCanvasLayer() {
      if (!this.canvasLayer.canvas && !this.layer_) {
        var extent = this.getMapExtent();
        this.layer_ = new ol.layer.Image({
          layerName: this.options.layerName,
          minResolution: this.options.minResolution,
          maxResolution: this.options.maxResolution,
          zIndex: this.options.zIndex,
          extent: extent,
          source: new ol.source.ImageCanvas({
            canvasFunction: this.canvasFunction.bind(this),
            projection: this.$Map.getView().getProjection().getCode(), // 图层投影与Map保持一致
            ratio: this.options.hasOwnProperty('ratio') ? this.options.ratio : 1
          })
        });
        this.$Map.addLayer(this.layer_);
        this.$Map.un('precompose', this.reRender, this);
        this.$Map.on('precompose', this.reRender, this);
      }
    }

    /**
     * re render
     */

  }, {
    key: "reRender",
    value: function reRender() {
      if (!this.layer_) return;
      var extent = this.getMapExtent();
      this.layer_.setExtent(extent);
    }

    /**
     * canvas constructor
     * @param extent
     * @param resolution
     * @param pixelRatio
     * @param size
     * @param projection
     * @returns {*}
     */

  }, {
    key: "canvasFunction",
    value: function canvasFunction(extent, resolution, pixelRatio, size, projection) {
      if (!this.canvasLayer.canvas) {
        this.canvasLayer.canvas = createCanvas$1(size[0], size[1]);
      } else {
        this.canvasLayer.canvas.width = size[0];
        this.canvasLayer.canvas.height = size[1];
      }
      this.render(this.canvasLayer.canvas);
      return this.canvasLayer.canvas;
    }

    /**
     * get map current extent
     * @returns {Array}
     */

  }, {
    key: "getMapExtent",
    value: function getMapExtent() {
      var size = this.$Map.getSize();
      return this.$Map.getView().calculateExtent(size);
    }

    /**
     * add layer to map
     * @param map
     */

  }, {
    key: "addTo",
    value: function addTo(map) {
      this.init(map, this.options);
    }

    /**
     * remove layer
     */

  }, {
    key: "removeLayer",
    value: function removeLayer() {
      if (!this.$Map) return;
      this.unEvents();
      this.$Map.un('precompose', this.reRender, this);
      this.$Map.removeLayer(this.layer_);
      delete this.$Map;
      delete this.layer_;
      delete this.canvasLayer.canvas;
    }
  }, {
    key: "getContext",
    value: function getContext() {
      return this.canvasLayer.canvas.getContext(this.context);
    }

    /**
     * handle click event
     * @param event
     */

  }, {
    key: "clickEvent",
    value: function clickEvent(event) {
      var pixel = event.pixel;
      get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "clickEvent", this).call(this, {
        x: pixel[0],
        y: pixel[1]
      }, event);
    }

    /**
     * handle mousemove/pointermove event
     * @param event
     */

  }, {
    key: "mousemoveEvent",
    value: function mousemoveEvent(event) {
      var pixel = event.pixel;
      get(Layer.prototype.__proto__ || Object.getPrototypeOf(Layer.prototype), "mousemoveEvent", this).call(this, {
        x: pixel[0],
        y: pixel[1]
      }, event);
    }

    /**
     * add animator event
     */

  }, {
    key: "addAnimatorEvent",
    value: function addAnimatorEvent() {
      this.$Map.on('movestart', this.animatorMovestartEvent, this);
      this.$Map.on('moveend', this.animatorMoveendEvent, this);
    }

    /**
     * bind event
     */

  }, {
    key: "onEvents",
    value: function onEvents() {
      var map = this.$Map;
      this.unEvents();
      if (this.options.methods) {
        if (this.options.methods.click) {
          map.on('click', this.clickEvent, this);
        }
        if (this.options.methods.mousemove) {
          map.on('pointermove', this.mousemoveEvent, this);
        }
      }
    }

    /**
     * unbind events
     */

  }, {
    key: "unEvents",
    value: function unEvents() {
      var map = this.$Map;
      if (this.options.methods) {
        if (this.options.methods.click) {
          map.un('click', this.clickEvent, this);
        }
        if (this.options.methods.pointermove) {
          map.un('pointermove', this.mousemoveEvent, this);
        }
      }
    }

    /**
     * set map cursor
     * @param cursor
     * @param feature
     */

  }, {
    key: "setDefaultCursor",
    value: function setDefaultCursor(cursor, feature) {
      if (!this.$Map) return;
      var element = this.$Map.getTargetElement();
      if (feature) {
        if (element.style.cursor !== cursor) {
          this.previousCursor_ = element.style.cursor;
          element.style.cursor = cursor;
        }
      } else if (this.previousCursor_ !== undefined) {
        element.style.cursor = this.previousCursor_;
        this.previousCursor_ = undefined;
      }
    }

    /**
     * 显示图层
     */

  }, {
    key: "show",
    value: function show() {
      this.$Map.addLayer(this.layer_);
    }

    /**
     * 隐藏图层
     */

  }, {
    key: "hide",
    value: function hide() {
      this.$Map.removeLayer(this.layer_);
    }
  }]);
  return Layer;
}(BaseLayer);

// https://github.com/SuperMap/iClient-JavaScript
/**
 * @class MapVRenderer
 * @classdesc 地图渲染类。
 * @category Visualization MapV
 * @private
 * @extends mapv.BaseLayer
 * @param {L.Map} map - 待渲染的地图。
 * @param {L.Layer} layer - 待渲染的图层。
 * @param {DataSet} dataSet - 待渲染的数据集。
 * @param {Object} options - 渲染的参数。
 */
var MapVRenderer = function (_BaseLayer) {
    inherits(MapVRenderer, _BaseLayer);

    function MapVRenderer(map, layer, dataSet, options) {
        classCallCheck(this, MapVRenderer);

        var _this = possibleConstructorReturn(this, (MapVRenderer.__proto__ || Object.getPrototypeOf(MapVRenderer)).call(this, map, dataSet, options));

        if (!BaseLayer) {
            return possibleConstructorReturn(_this);
        }

        var self = _this;
        options = options || {};

        self.init(options);
        self.argCheck(options);
        _this.canvasLayer = layer;
        _this.clickEvent = _this.clickEvent.bind(_this);
        _this.mousemoveEvent = _this.mousemoveEvent.bind(_this);
        _this._moveStartEvent = _this.moveStartEvent.bind(_this);
        _this._moveEndEvent = _this.moveEndEvent.bind(_this);
        _this._zoomStartEvent = _this.zoomStartEvent.bind(_this);
        _this.bindEvent();
        return _this;
    }

    /**
     * @function MapVRenderer.prototype.clickEvent
     * @description 点击事件。
     * @param {Object} e - 触发对象。
     */


    createClass(MapVRenderer, [{
        key: 'clickEvent',
        value: function clickEvent(e) {
            var offset = this.map.containerPointToLayerPoint([0, 0]);
            var devicePixelRatio = this.devicePixelRatio = this.canvasLayer.devicePixelRatio = window.devicePixelRatio;
            var pixel = e.layerPoint;
            get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), 'clickEvent', this).call(this, L.point((pixel.x - offset.x) / devicePixelRatio, (pixel.y - offset.y) / devicePixelRatio), e);
        }

        /**
         * @function MapVRenderer.prototype.mousemoveEvent
         * @description 鼠标移动事件。
         * @param {Object} e - 触发对象。
         */

    }, {
        key: 'mousemoveEvent',
        value: function mousemoveEvent(e) {
            var pixel = e.layerPoint;
            get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), 'mousemoveEvent', this).call(this, pixel, e);
        }

        /**
         * @function MapVRenderer.prototype.bindEvent
         * @description 绑定鼠标移动和鼠标点击事件。
         * @param {Object} e - 触发对象。
         */

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.on('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.on('mousemove', this.mousemoveEvent);
                }
            }
            this.map.on('movestart', this._moveStartEvent);
            this.map.on('moveend', this._moveEndEvent);
            this.map.on('zoomstart', this._zoomStartEvent);
        }
        /**
         * @function MapVRenderer.prototype.destroy
         * @description 释放资源。
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.unbindEvent();
            this.clearData();
            this.animator && this.animator.stop();
            this.animator = null;
            this.canvasLayer = null;
        }
        /**
         * @function MapVRenderer.prototype.unbindEvent
         * @description 解绑鼠标移动和鼠标滑动触发的事件。
         * @param {Object} e - 触发对象。
         */

    }, {
        key: 'unbindEvent',
        value: function unbindEvent() {
            var map = this.map;

            if (this.options.methods) {
                if (this.options.methods.click) {
                    map.off('click', this.clickEvent);
                }
                if (this.options.methods.mousemove) {
                    map.off('mousemove', this.mousemoveEvent);
                }
            }
            this.map.off('movestart', this._moveStartEvent);
            this.map.off('moveend', this._moveEndEvent);
            this.map.off('zoomstart', this._zoomStartEvent);
        }

        /**
         * @function MapVRenderer.prototype.getContext
         * @description 获取信息。
         */

    }, {
        key: 'getContext',
        value: function getContext() {
            return this.canvasLayer.getCanvas().getContext(this.context);
        }

        /**
         * @function MapVRenderer.prototype.addData
         * @description 添加数据。
         * @param {Object} data - 待添加的数据。
         * @param  {Object} options - 待添加的数据信息。
         */

    }, {
        key: 'addData',
        value: function addData(data, options) {
            var _data = data;
            if (data && data.get) {
                _data = data.get();
            }
            this.dataSet.add(_data);
            this.update({
                options: options
            });
        }

        /**
         * @function MapVRenderer.prototype.update
         * @description 更新图层。
         * @param {Object} opt - 待更新的数据。
         * @param {Object} opt.data - mapv数据集。
         * @param {Object} opt.options - mapv绘制参数。
         */

    }, {
        key: 'update',
        value: function update(opt) {
            var update = opt || {};
            var _data = update.data;
            if (_data && _data.get) {
                _data = _data.get();
            }
            if (_data != undefined) {
                this.dataSet.set(_data);
            }
            get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), 'update', this).call(this, {
                options: update.options
            });
        }

        /**
         * @function MapVRenderer.prototype.getData
         * @description 获取数据
         */

    }, {
        key: 'getData',
        value: function getData() {
            return this.dataSet;
        }

        /**
         * @function MapVRenderer.prototype.removeData
         * @description 删除符合过滤条件的数据。
         * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
         */

    }, {
        key: 'removeData',
        value: function removeData(_filter) {
            if (!this.dataSet) {
                return;
            }
            var newData = this.dataSet.get({
                filter: function filter(data) {
                    return _filter != null && typeof _filter === "function" ? !_filter(data) : true;
                }
            });
            this.dataSet.set(newData);
            this.update({
                options: null
            });
        }

        /**
         * @function MapVRenderer.prototype.clearData
         * @description 清除数据
         */

    }, {
        key: 'clearData',
        value: function clearData() {
            this.dataSet && this.dataSet.clear();
            this.update({
                options: null
            });
        }
    }, {
        key: '_canvasUpdate',
        value: function _canvasUpdate(time) {
            if (!this.canvasLayer) {
                return;
            }

            var self = this;

            var animationOptions = self.options.animation;

            var context = this.getContext();
            var map = this.map;
            if (self.isEnabledTime()) {
                if (time === undefined) {
                    this.clear(context);
                    return;
                }
                if (this.context === '2d') {
                    context.save();
                    context.globalCompositeOperation = 'destination-out';
                    context.fillStyle = 'rgba(0, 0, 0, .1)';
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.restore();
                }
            } else {
                this.clear(context);
            }

            if (this.context === '2d') {
                for (var key in self.options) {
                    context[key] = self.options[key];
                }
            } else {
                context.clear(context.COLOR_BUFFER_BIT);
            }

            if (self.options.minZoom && map.getZoom() < self.options.minZoom || self.options.maxZoom && map.getZoom() > self.options.maxZoom) {
                return;
            }

            var bounds = map.getBounds();
            //获取当前像素下的地理范围
            var dw = bounds.getEast() - bounds.getWest();
            var dh = bounds.getNorth() - bounds.getSouth();
            var mapCanvas = map.getSize();

            var resolutionX = dw / mapCanvas.x,
                resolutionY = dh / mapCanvas.y;
            //var centerPx = map.latLngToLayerPoint(map.getCenter());

            //获取屏幕左上角的地理坐标坐标
            //左上角屏幕坐标为0,0
            var topLeft = this.canvasLayer.getTopLeft();

            var topLeftPX = map.latLngToContainerPoint(topLeft);
            // 获取精确的像素坐标. https://github.com/SuperMap/iClient-JavaScript/blob/eacc26952b8915bba0122db751d766056c5fb24d/src/leaflet/core/Base.js
            // var topLeftPX = map.latLngToAccurateContainerPoint(topLeft);
            // var lopLeft = map.containerPointToLatLng([0, 0]);
            var dataGetOptions = {
                transferCoordinate: function transferCoordinate(coordinate) {
                    var offset;
                    if (self.context === '2d') {
                        offset = map.latLngToContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                        // offset = map.latLngToAccurateContainerPoint(L.latLng(coordinate[1], coordinate[0]));
                    } else {
                        offset = {
                            'x': (coordinate[0] - topLeft.lng) / resolutionX,
                            'y': (topLeft.lat - coordinate[1]) / resolutionY
                        };
                    }
                    var pixel = {
                        x: offset.x - topLeftPX.x,
                        y: offset.y - topLeftPX.y
                    };
                    return [pixel.x, pixel.y];
                }
            };

            if (time !== undefined) {
                dataGetOptions.filter = function (item) {
                    var trails = animationOptions.trails || 10;
                    return time && item.time > time - trails && item.time < time;
                };
            }

            var data = self.dataSet.get(dataGetOptions);

            this.processData(data);

            self.options._size = self.options.size;

            var worldPoint = map.latLngToContainerPoint(L.latLng(0, 0));
            var pixel = {
                x: worldPoint.x - topLeftPX.x,
                y: worldPoint.y - topLeftPX.y
            };
            this.drawContext(context, data, self.options, pixel);

            self.options.updateCallback && self.options.updateCallback(time);
        }
    }, {
        key: 'init',
        value: function init(options) {

            var self = this;

            self.options = options;

            this.initDataRange(options);

            this.context = self.options.context || '2d';

            if (self.options.zIndex) {
                this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
            }

            this.initAnimator();
        }
    }, {
        key: 'addAnimatorEvent',
        value: function addAnimatorEvent() {}

        /**
         * @function MapVRenderer.prototype.moveStartEvent
         * @description 开始移动事件。
         */

    }, {
        key: 'moveStartEvent',
        value: function moveStartEvent() {
            var animationOptions = this.options.animation;
            if (this.isEnabledTime() && this.animator) {
                this.steps.step = animationOptions.stepsRange.start;
                this._hide();
            }
        }

        /**
         * @function MapVRenderer.prototype.moveEndEvent
         * @description 结束移动事件。
         */

    }, {
        key: 'moveEndEvent',
        value: function moveEndEvent() {
            this.canvasLayer.draw();
            this._show();
        }

        /**
         * @function MapVRenderer.prototype.zoomStartEvent
         * @description 隐藏渲染样式。
         */

    }, {
        key: 'zoomStartEvent',
        value: function zoomStartEvent() {
            this._hide();
        }

        /**
         * @function MapVRenderer.prototype.clear
         * @description 清除信息。
         * @param {string} context - 指定要清除的信息。
         */

    }, {
        key: 'clear',
        value: function clear(context) {
            context && context.clearRect && context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }, {
        key: '_hide',
        value: function _hide() {
            this.canvasLayer.canvas.style.display = 'none';
        }
    }, {
        key: '_show',
        value: function _show() {
            this.canvasLayer.canvas.style.display = 'block';
        }

        /**
         * @function MapVRenderer.prototype.draw
         * @description 绘制渲染
         */

    }, {
        key: 'draw',
        value: function draw() {
            this.canvasLayer.draw();
        }
    }]);
    return MapVRenderer;
}(BaseLayer);

var mapVLayer;
if (typeof L !== 'undefined') {
    /**
     * @class mapVLayer
     * @classdesc MapV 图层。
     * @category Visualization MapV
     * @extends {L.Layer}
     * @param {mapv.DataSet} dataSet - MapV 图层数据集。
     * @param {Object} mapVOptions - MapV 图层参数。
     * @param {Object} options - 参数。
     * @param {string} [options.attributionPrefix] - 版权信息前缀。
     * @param {string} [options.attribution='© 2018 百度 MapV'] - 版权信息。
     * @fires mapVLayer#loaded
     */
    var MapVLayer = L.Layer.extend({

        options: {
            attributionPrefix: null,
            attribution: ''
        },

        initialize: function initialize(dataSet, mapVOptions, options) {
            options = options || {};
            this.dataSet = dataSet || {};
            this.mapVOptions = mapVOptions || {};
            this.render = this.render.bind(this);
            L.Util.setOptions(this, options);
            if (this.options.attributionPrefix) {
                this.options.attribution = this.options.attributionPrefix + this.options.attribution;
            }

            this.canvas = this._createCanvas();
            L.stamp(this);
        },

        /**
         * @private
         * @function mapVLayer.prototype.onAdd
         * @description 添加地图图层。
         * @param {L.Map} map - 要添加的地图。
         */
        onAdd: function onAdd(map) {
            this._map = map;
            var overlayPane = this.getPane();
            var container = this.container = L.DomUtil.create("div", "leaflet-layer leaflet-zoom-animated", overlayPane);
            container.appendChild(this.canvas);
            var size = map.getSize();
            container.style.width = size.x + "px";
            container.style.height = size.y + "px";
            this.renderer = new MapVRenderer(map, this, this.dataSet, this.mapVOptions);
            this.draw();
            /**
             * @event mapVLayer#loaded
             * @description 图层添加完成之后触发。
             */
            this.fire("loaded");
        },

        // _hide: function () {
        //     this.canvas.style.display = 'none';
        // },

        // _show: function () {
        //     this.canvas.style.display = 'block';
        // },

        /**
         * @private
         * @function mapVLayer.prototype.onRemove
         * @description 删除地图图层。
         */
        onRemove: function onRemove() {
            L.DomUtil.remove(this.container);
            this.renderer.destroy();
        },

        /**
         * @function mapVLayer.prototype.addData
         * @description 追加数据。
         * @param {Object} data - 要追加的数据。
         * @param {Object} options - 要追加的值。
         */
        addData: function addData(data, options) {
            this.renderer.addData(data, options);
        },

        /**
         * @function mapVLayer.prototype.update
         * @description 更新图层。
         * @param {Object} opt - 待更新的数据。
         * @param {Object} data - mapv 数据集。
         * @param {Object} options - mapv 绘制参数。
         */
        update: function update(opt) {
            this.renderer.update(opt);
        },

        /**
         * @function mapVLayer.prototype.getData
         * @description 获取数据。
         * @returns {mapv.DataSet} mapv 数据集。
         */
        getData: function getData() {
            if (this.renderer) {
                this.dataSet = this.renderer.getData();
            }
            return this.dataSet;
        },

        /**
         * @function mapVLayer.prototype.removeData
         * @description 删除符合过滤条件的数据。
         * @param {Function} filter - 过滤条件。条件参数为数据项，返回值为 true，表示删除该元素；否则表示不删除。
         * @example
         *  filter=function(data){
         *    if(data.id=="1"){
         *      return true
         *    }
         *    return false;
         *  }
         */
        removeData: function removeData(filter) {
            this.renderer && this.renderer.removeData(filter);
        },

        /**
         * @function mapVLayer.prototype.clearData
         * @description 清除数据。
         */
        clearData: function clearData() {
            this.renderer.clearData();
        },

        /**
         * @function mapVLayer.prototype.draw
         * @description 绘制图层。
         */
        draw: function draw() {
            return this._reset();
        },

        /**
         * @function mapVLayer.prototype.setZIndex
         * @description 设置 canvas 层级。
         * @param {number} zIndex - canvas 层级。
         */
        setZIndex: function setZIndex(zIndex) {
            this.canvas.style.zIndex = zIndex;
        },

        /**
         * @function mapVLayer.prototype.render
         * @description 渲染。
         */
        render: function render() {
            this.renderer._canvasUpdate();
        },

        /**
         * @function mapVLayer.prototype.getCanvas
         * @description 获取 canvas。
         * @returns {HTMLElement} 返回 mapV 图层包含的 canvas 对象。
         */
        getCanvas: function getCanvas() {
            return this.canvas;
        },

        /**
         * @function mapVLayer.prototype.getContainer
         * @description 获取容器。
         * @returns {HTMLElement} 返回包含 mapV 图层的 dom 对象。
         */
        getContainer: function getContainer() {
            return this.container;
        },

        /**
         * @function mapVLayer.prototype.getTopLeft
         * @description 获取左上角坐标。
         * @returns {L.Bounds} 返回左上角坐标。
         */
        getTopLeft: function getTopLeft() {
            var map = this._map;
            var topLeft;
            if (map) {
                var bounds = map.getBounds();
                topLeft = bounds.getNorthWest();
            }
            return topLeft;
        },

        _createCanvas: function _createCanvas() {
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = 0 + "px";
            canvas.style.left = 0 + "px";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = this.options.zIndex || 600;
            var global$2 = typeof window === 'undefined' ? {} : window;
            var devicePixelRatio = this.devicePixelRatio = global$2.devicePixelRatio;
            if (!this.mapVOptions.context || this.mapVOptions.context === '2d') {
                canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
            }
            return canvas;
        },

        _resize: function _resize() {
            var canvas = this.canvas;
            if (!canvas) {
                return;
            }

            var map = this._map;
            var size = map.getSize();
            canvas.width = size.x;
            canvas.height = size.y;
            canvas.style.width = size.x + 'px';
            canvas.style.height = size.y + 'px';
            var bounds = map.getBounds();
            var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
            L.DomUtil.setPosition(canvas, topLeft);
        },

        _reset: function _reset() {
            this._resize();
            this._render();
        },
        redraw: function redraw() {
            this._resize();
            this._render();
        },
        _render: function _render() {
            this.render();
        }

    });

    mapVLayer = function mapVLayer(dataSet, mapVOptions, options) {
        return new MapVLayer(dataSet, mapVOptions, options);
    };
}
var mapVLayer$1 = mapVLayer;

var MapVRenderer$1 = function (_BaseLayer) {
    inherits(MapVRenderer, _BaseLayer);

    /**
     * Creates an instance of MapVRenderer.
     * @param {*} viewer cesium viewer
     * @param {*} dataset mapv dataset
     * @param {*} option mapvOptions
     * @param {*} mapVLayer
     * @memberof MapVRenderer
     */
    function MapVRenderer(viewer, dataset, option, mapVLayer) {
        classCallCheck(this, MapVRenderer);

        var _this = possibleConstructorReturn(this, (MapVRenderer.__proto__ || Object.getPrototypeOf(MapVRenderer)).call(this, viewer, dataset, option));

        if (!BaseLayer) {
            return possibleConstructorReturn(_this);
        }
        _this.map = viewer, _this.scene = viewer.scene, _this.dataSet = dataset;
        option = option || {}, _this.init(option), _this.argCheck(option), _this.initDevicePixelRatio(), _this.canvasLayer = mapVLayer, _this.stopAniamation = !1, _this.animation = option.animation, _this.clickEvent = _this.clickEvent.bind(_this), _this.mousemoveEvent = _this.mousemoveEvent.bind(_this), _this.bindEvent();
        return _this;
    }

    createClass(MapVRenderer, [{
        key: "initDevicePixelRatio",
        value: function initDevicePixelRatio() {
            this.devicePixelRatio = window.devicePixelRatio || 1;
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(t) {
            var e = t.point;
            get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "clickEvent", this).call(this, e, t);
        }
    }, {
        key: "mousemoveEvent",
        value: function mousemoveEvent(t) {
            var e = t.point;
            get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "mousemoveEvent", this).call(this, e, t);
        }
    }, {
        key: "addAnimatorEvent",
        value: function addAnimatorEvent() {}
    }, {
        key: "animatorMovestartEvent",
        value: function animatorMovestartEvent() {
            var t = this.options.animation;
            this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start);
        }
    }, {
        key: "animatorMoveendEvent",
        value: function animatorMoveendEvent() {
            this.isEnabledTime() && this.animator;
        }
    }, {
        key: "bindEvent",
        value: function bindEvent() {
            this.map;
            this.options.methods && (this.options.methods.click, this.options.methods.mousemove);
        }
    }, {
        key: "unbindEvent",
        value: function unbindEvent() {
            var t = this.map;
            this.options.methods && (this.options.methods.click && t.off("click", this.clickEvent), this.options.methods.mousemove && t.off("mousemove", this.mousemoveEvent));
        }
    }, {
        key: "getContext",
        value: function getContext() {
            return this.canvasLayer.canvas.getContext(this.context);
        }
    }, {
        key: "init",
        value: function init(t) {
            this.options = t, this.initDataRange(t), this.context = this.options.context || "2d", this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex(this.options.zIndex), this.initAnimator();
        }
    }, {
        key: "_canvasUpdate",
        value: function _canvasUpdate(t) {
            this.map;
            var e = this.scene;
            if (this.canvasLayer && !this.stopAniamation) {
                var i = this.options.animation,
                    n = this.getContext();
                if (this.isEnabledTime()) {
                    if (void 0 === t) return void this.clear(n);
                    "2d" === this.context && (n.save(), n.globalCompositeOperation = "destination-out", n.fillStyle = "rgba(0, 0, 0, .1)", n.fillRect(0, 0, n.canvas.width, n.canvas.height), n.restore());
                } else this.clear(n);
                if ("2d" === this.context) for (var o in this.options) {
                    n[o] = this.options[o];
                } else n.clear(n.COLOR_BUFFER_BIT);
                var a = {
                    transferCoordinate: function transferCoordinate(t) {
                        var i = Cesium.Cartesian3.fromDegrees(t[0], t[1]),
                            n = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, i);
                        return void 0 == n ? [-1, -1] : [n.x, n.y];
                    }
                };
                void 0 !== t && (a.filter = function (e) {
                    var n = i.trails || 10;
                    return !!(t && e.time > t - n && e.time < t);
                });
                var c = this.dataSet.get(a);
                this.processData(c), "m" == this.options.unit && this.options.size, this.options._size = this.options.size;
                var h = Cesium.SceneTransforms.wgs84ToWindowCoordinates(e, Cesium.Cartesian3.fromDegrees(0, 0));
                this.drawContext(n, new DataSet(c), this.options, h), this.options.updateCallback && this.options.updateCallback(t);
            }
        }
    }, {
        key: "updateData",
        value: function updateData(t, e) {
            var i = t;
            i && i.get && (i = i.get()), void 0 != i && this.dataSet.set(i), get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "update", this).call(this, {
                options: e
            });
        }
    }, {
        key: "addData",
        value: function addData(t, e) {
            var i = t;
            t && t.get && (i = t.get()), this.dataSet.add(i), this.update({
                options: e
            });
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.dataSet;
        }
    }, {
        key: "removeData",
        value: function removeData(t) {
            if (this.dataSet) {
                var e = this.dataSet.get({
                    filter: function filter(e) {
                        return null == t || "function" != typeof t || !t(e);
                    }
                });
                this.dataSet.set(e), this.update({
                    options: null
                });
            }
        }
    }, {
        key: "clearData",
        value: function clearData() {
            this.dataSet && this.dataSet.clear(), this.update({
                options: null
            });
        }
    }, {
        key: "draw",
        value: function draw() {
            this.canvasLayer.draw();
        }
    }, {
        key: "clear",
        value: function clear(t) {
            t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height);
        }
    }]);
    return MapVRenderer;
}(BaseLayer);

var mapVLayer$2;
if (typeof Cesium !== 'undefined') {
    var defIndex = 0;
    var r = Cesium;

    var MapVLayer$1 = function () {
        /**
         *Creates an instance of MapVLayer.
         * @param {*} viewer
         * @param {*} dataset
         * @param {*} options
         * @param {*} container default viewer.container
         * @memberof MapVLayer
         */
        function MapVLayer(viewer, dataset, options, container) {
            classCallCheck(this, MapVLayer);

            this.map = viewer, this.scene = viewer.scene, this.mapvBaseLayer = new MapVRenderer$1(viewer, dataset, options, this), this.mapVOptions = options, this.initDevicePixelRatio(), this.canvas = this._createCanvas(), this.render = this.render.bind(this);
            if (container) {
                this.container = container;
            } else {
                var inner = viewer.container.querySelector('.cesium-viewer-cesiumWidgetContainer');
                this.container = inner ? inner : viewer.container;
            }
            this.addInnerContainer();

            // void 0 != container ? (this.container = container,
            //     container.appendChild(this.canvas)) : (this.container = viewer.container,
            //         this.addInnerContainer()),
            this.bindEvent();
            this._reset();
        }

        createClass(MapVLayer, [{
            key: 'initDevicePixelRatio',
            value: function initDevicePixelRatio() {
                this.devicePixelRatio = window.devicePixelRatio || 1;
            }
        }, {
            key: 'addInnerContainer',
            value: function addInnerContainer() {
                this.container.appendChild(this.canvas);
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var that = this;

                this.innerMoveStart = this.moveStartEvent.bind(this);
                this.innerMoveEnd = this.moveEndEvent.bind(this);
                this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this);
                this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);

                var t = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

                t.setInputAction(function (t) {
                    that.innerMoveEnd();
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
                t.setInputAction(function (t) {
                    that.innerMoveEnd();
                }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
                this.handler = t;
            }
        }, {
            key: 'unbindEvent',
            value: function unbindEvent() {
                this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this);
                this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this);
                this.scene.postRender.removeEventListener(this._reset, this);
                this.handler && (this.handler.destroy(), this.handler = null);
            }
        }, {
            key: 'moveStartEvent',
            value: function moveStartEvent() {
                if (this.mapvBaseLayer) {
                    this.mapvBaseLayer.animatorMovestartEvent();
                    this.scene.postRender.addEventListener(this._reset, this);
                }
            }
        }, {
            key: 'moveEndEvent',
            value: function moveEndEvent() {
                if (this.mapvBaseLayer) {
                    this.scene.postRender.removeEventListener(this._reset, this), this.mapvBaseLayer.animatorMoveendEvent();
                    this._reset();
                }
            }
        }, {
            key: 'zoomStartEvent',
            value: function zoomStartEvent() {
                this._unvisiable();
            }
        }, {
            key: 'zoomEndEvent',
            value: function zoomEndEvent() {
                this._unvisiable();
            }
        }, {
            key: 'addData',
            value: function addData(t, e) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.addData(t, e);
            }
        }, {
            key: 'updateData',
            value: function updateData(t, e) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.updateData(t, e);
            }
        }, {
            key: 'getData',
            value: function getData() {
                return this.mapvBaseLayer && (this.dataSet = this.mapvBaseLayer.getData()), this.dataSet;
            }
        }, {
            key: 'removeData',
            value: function removeData(t) {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer && this.mapvBaseLayer.removeData(t);
            }
        }, {
            key: 'removeAllData',
            value: function removeAllData() {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer.clearData();
            }
        }, {
            key: '_visiable',
            value: function _visiable() {
                return this.canvas.style.display = "block", this;
            }
        }, {
            key: '_unvisiable',
            value: function _unvisiable() {
                return this.canvas.style.display = "none", this;
            }
        }, {
            key: '_createCanvas',
            value: function _createCanvas() {
                var t = document.createElement("canvas");
                t.id = this.mapVOptions.layerid || "mapv" + defIndex++, t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.pointerEvents = "none", t.style.zIndex = this.mapVOptions.zIndex || 0, t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height;
                var e = this.devicePixelRatio;
                return "2d" == this.mapVOptions.context && t.getContext(this.mapVOptions.context).scale(e, e), t;
            }
        }, {
            key: '_reset',
            value: function _reset() {
                this.resizeCanvas();
                this.fixPosition();
                this.onResize();
                this.render();
            }
        }, {
            key: 'draw',
            value: function draw() {
                this._reset();
            }
        }, {
            key: 'show',
            value: function show() {
                this._visiable();
            }
        }, {
            key: 'hide',
            value: function hide() {
                this._unvisiable();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.remove();
            }
        }, {
            key: 'remove',
            value: function remove() {
                void 0 != this.mapvBaseLayer && (this.removeAllData(), this.mapvBaseLayer.clear(this.mapvBaseLayer.getContext()), this.mapvBaseLayer = void 0, this.canvas.parentElement.removeChild(this.canvas));
            }
        }, {
            key: 'update',
            value: function update(t) {
                void 0 != t && this.updateData(t.data, t.options);
            }
        }, {
            key: 'resizeCanvas',
            value: function resizeCanvas() {
                if (void 0 != this.canvas && null != this.canvas) {
                    var t = this.canvas;
                    t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height;
                }
            }
        }, {
            key: 'fixPosition',
            value: function fixPosition() {}
        }, {
            key: 'onResize',
            value: function onResize() {}
        }, {
            key: 'render',
            value: function render() {
                void 0 != this.mapvBaseLayer && this.mapvBaseLayer._canvasUpdate();
            }
        }]);
        return MapVLayer;
    }();

    mapVLayer$2 = function mapVLayer(viewer, dataSet, mapVOptions, container) {
        return new MapVLayer$1(viewer, dataSet, mapVOptions, container);
    };
}

var mapVLayer$3 = mapVLayer$2;

/**
 * @author kyle / http://nikai.us/
 */

var geojson = {
    getDataSet: function getDataSet(geoJson) {

        var data = [];
        var features = geoJson.features;
        if (features) {
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var geometry = feature.geometry;
                var properties = feature.properties;
                var item = {};
                for (var key in properties) {
                    item[key] = properties[key];
                }
                item.geometry = geometry;
                data.push(item);
            }
        }
        return new DataSet(data);
    }
};

/**
 * @author kyle / http://nikai.us/
 */

var csv = {
    CSVToArray: function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = strDelimiter || ",";

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))", "gi");

        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return arrData;
    },

    getDataSet: function getDataSet(csvStr, split) {

        var arr = this.CSVToArray(csvStr, split || ',');

        var data = [];

        var header = arr[0];

        for (var i = 1; i < arr.length - 1; i++) {
            var line = arr[i];
            var item = {};
            for (var j = 0; j < line.length; j++) {
                var value = line[j];
                if (header[j] == 'geometry') {
                    value = JSON.parse(value);
                }
                item[header[j]] = value;
            }
            data.push(item);
        }

        return new DataSet(data);
    }
};

exports.version = version;
exports.canvasClear = clear;
exports.canvasResolutionScale = resolutionScale$1;
exports.canvasDrawSimple = drawSimple;
exports.canvasDrawHeatmap = drawHeatmap;
exports.canvasDrawGrid = drawGrid;
exports.canvasDrawHoneycomb = drawHoneycomb;
exports.webglDrawSimple = webglDrawSimple;
exports.webglDrawPoint = point;
exports.webglDrawLine = line;
exports.webglDrawPolygon = polygon;
exports.utilCityCenter = cityCenter;
exports.utilCurve = curve;
exports.utilForceEdgeBundling = ForceEdgeBundling;
exports.utilDataRangeIntensity = Intensity;
exports.utilDataRangeCategory = Category;
exports.utilDataRangeChoropleth = Choropleth;
exports.Map = MapHelper;
exports.baiduMapCanvasLayer = CanvasLayer;
exports.baiduMapAnimationLayer = AnimationLayer;
exports.baiduMapLayer = Layer;
exports.googleMapCanvasLayer = CanvasLayer$2;
exports.googleMapLayer = Layer$2;
exports.MaptalksLayer = Layer$5;
exports.AMapLayer = Layer$6;
exports.OpenlayersLayer = Layer$8;
exports.leafletMapLayer = mapVLayer$1;
exports.cesiumMapLayer = mapVLayer$3;
exports.DataSet = DataSet;
exports.geojson = geojson;
exports.csv = csv;

Object.defineProperty(exports, '__esModule', { value: true });

})));
