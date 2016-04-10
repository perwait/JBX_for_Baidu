/* public fn event [all browser ok] -auther:@perwait.com*/
function myEvent (obj,eventName,fn) {
	if(window.addEventListener) {
		obj.addEventListener(eventName,fn,false);
	}else if(window.attachEvent) {
		obj.attachEvent('on'+eventName,fn)
	}
}

/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/* 计算周期平均值 getTimeJson(int 传入周期时间,json 原始数据) 不满周期算最后一个之间的数量为周期*/
function getTimeJson(cycle,json){
	var _cycle = cycle;
	var _num = 0;
	var _i = 1
	var _tempData = {};
	var _tempStr ="";
	var _boolean =true;
	var _jsonSize = 1;
	var _cNum=1;
	for(var x in json) {
		++_jsonSize;
	}
	for(var key in json) {
		if(_boolean) {
			_tempStr = key+" - ";
			_boolean = false;
		}
		_num+=parseInt(json[key]);
		if(_i%_cycle == 0||_i ==_jsonSize-1){
			_tempStr += key;
			_tempData[_tempStr] = parseInt(_num/_cNum);
			_num = 0;
			_cNum = 0;
			_boolean = true;
		}
		_i++;
		_cNum++;
	}	
	return _tempData
} 
/**
 * 渲染图表
 */
function renderChart() {
	console.log(pageState);
	chartData = {};
	var _city =pageState.nowSelectCity;
	var _time =pageState.nowGraTime;
	var _timeData ={};
	/*判断城市*/
	for(var key in aqiSourceData) {
		if(key==pageState.nowSelectCity){
			chartData[key] = {};
			_timeData = aqiSourceData[key];
			break;
		}
	}
	/* 判断周期*/
	switch(_time) {
		case "day" :
			chartData[pageState.nowSelectCity] = _timeData;
			console.log(_timeData);
			break;
		case "week" :
			chartData[pageState.nowSelectCity] = getTimeJson(7,_timeData);
			console.log(getTimeJson(7,_timeData));
			break;
		case "month" :
			chartData[pageState.nowSelectCity] = getTimeJson(31,_timeData);
			console.log(getTimeJson(31,_timeData));
			break;
	}
	console.log(chartData)
	
	/*append to html*/
	/* json size*/
	var _jSize=1;
	var _maxHeight=0;
	for(var _x in chartData[_city]){
		_jSize++;
		if(chartData[_city][_x]>_maxHeight){
			_maxHeight=chartData[_city][_x];
		}
	}
	/* html */
	var _div = document.getElementsByClassName("aqi-chart-wrap");
	_div[0].innerHTML = "";
	var _divWidth = _div[0].offsetWidth;
	var _divHeight = _div[0].offsetHeight;
	var _pxL =5;/*间距*/
	var _leftS=10;/*追加*/
	var _leftNum=0;/*间距数量*/
	var _cDivWid= (_divWidth/_jSize)-_pxL;/*宽度*/
	for(var key in chartData[_city]){
		var _cDivheight= (parseInt(chartData[_city][key])/parseInt(_maxHeight))*100;
		var	 _cDiv = "<div title=\""+key+" : "+chartData[_city][key]+"\" style=left:"+((_leftNum*(_cDivWid+_pxL))+_leftS)+"px;width:"+_cDivWid+"px;height:"+_cDivheight+"%"+"><div>"
		_div[0].innerHTML+=_cDiv;
		_leftNum++;
	}
	
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var _time = document.getElementsByName('gra-time');

  // 设置对应数据
  for(var i=0;i<_time.length;i++) {
	  if(_time[i].checked) {
		pageState.nowGraTime = _time[i].value; 
		break;
	  }
  }
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var _city = document.getElementById('city-select');
  // 设置对应数据
  pageState.nowSelectCity = _city.value;
  // 调用图表渲染函数
  renderChart()
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var _time = document.getElementsByName('gra-time');
  for(var i=0;i<_time.length;i++) {
	  if(_time[i].checked) {
		pageState.nowSelectCity = _time[i].value;
		break;
	  }
  }	
  for(var i=0;i<_time.length;i++) {
	myEvent(_time[i],"change",graTimeChange)
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var _city = document.getElementById('city-select');
  pageState.nowSelectCity = _city.value;
  _city.innerHTML="";
  var _dom = document.createDocumentFragment();
  for(var key in aqiSourceData) {
	  var _element = document.createElement('option');
	  var _txt = document.createTextNode(key);
	  _element.appendChild(_txt);
	  _dom.appendChild(_element);
  }
  _city.appendChild(_dom);
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  myEvent(_city,"change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm(); //判断日月年
  initCitySelector(); //判断城市
  initAqiChartData(); //处理
  
}

init();