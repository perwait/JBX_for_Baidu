/* 
* @Author: anchen
* @Date:   2016-04-06 01:27:23
* @Last Modified by:   anchen
* @Last Modified time: 2016-04-06 10:16:59
*/

'use strict';
window.onload = function(){
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
//颜色数组
var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
    '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'
];
//生产随机16进制颜色
 function randomColor() {
    var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    if (rand.length == 6) {
        return rand;
    } else {
        return randomColor();
    }
}
/**
 * 渲染图表
 */
function renderChart() {
    var chart = document.getElementsByClassName("aqi-chart-wrap")[0];
    chart.innerHTML = "";//初始化

    for (var key in chartData) {
        var aqiValue = chartData[key];
        var div  = document.createElement("div");
        div.style.height = aqiValue + "px";
        div.style.backgroundColor = "#"+randomColor();
        div.className += " " + pageState.nowGraTime;
        div.title = key + "空气质量："+ aqiValue;
        chart.appendChild(div);
    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowGraTime == this.value){
    return;
  }
  // 设置对应数据
  pageState.nowGraTime = this.value;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var nowCity = this.options[this.selectedIndex].text;
  if (nowCity == pageState.nowSelectCity) {
    return;
  }
  // 设置对应数据
  pageState.nowSelectCity = nowCity;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var inputs = document.getElementById("form-gra-time").getElementsByTagName("input");
    for(var i = 0;i<inputs.length;i++){
        inputs[i].addEventListener("click", graTimeChange);
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select = document.getElementById("city-select");
  select.innerHTML = "";
  for(var key in aqiSourceData){
    if(pageState.nowSelectCity == -1){
        pageState.nowSelectCity = key;
    }
    var opt = document.createElement("option");
    opt.innerHTML = key;
    select.appendChild(opt);
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  // 需要显示的城市的数据
  var cityAqiData = aqiSourceData[pageState.nowSelectCity];//数据格式是日期：空气质量
  if(pageState.nowGraTime == "day"){
    chartData = cityAqiData;
  }
  if(pageState.nowGraTime == "week"){
    chartData = {};
    var aqiSum = 0;
    var dayNum = 0;
    var startDate = "";//每周的起始日期
    var endDate = "";//每周的终止日期
    var avgValue = 0;//每周平均数据值
    var key = "";//日期键值
    for(var strdate in cityAqiData){
        var date = new Date(strdate);
        var day = date.getDay();
        if (startDate == "") {
            startDate = strdate;
        }
        if (day == 6) {
            endDate = strdate;
        }
        if (day == 0) {
            // 周日结算,判断aqiSum是否大于0，剔除本月第一天是周日的情况
            if (aqiSum>0) {
                avgValue = Math.floor(aqiSum/dayNum);
                key = startDate + "-" + endDate+":";
                chartData[key] = avgValue;
            }
            dayNum = 0;
            aqiSum = 0;
            startDate = strdate;
        }
        dayNum++;
        aqiSum += cityAqiData[strdate];
    }
    //数据最后一天不是周日，最后一周的平均数据
    if (aqiSum>0) {
        avgValue = Math.floor(aqiSum/dayNum);
        key = startDate + "-" + strdate+":";
        chartData[key] = avgValue;
    }
  }
  if(pageState.nowGraTime == "month"){
    chartData = {};
    var curMonth = -1;
    var curYear = 0;
    var dayNum = 0;
    var aqiSum = 0;
    var avgValue = 0;
    var key = "";
    for(var strdate in cityAqiData){
        var date = new Date(strdate);
        var month = date.getMonth();
        var year = date.getFullYear();
        if(month!= curMonth){//已结到下一个月份
            if(dayNum>0){//剔除数据初始月份未开始累积数据情况
                avgValue = Math.floor(aqiSum/dayNum);
                key = curYear+ "年" + (curMonth+1)+"月" +":";
                chartData[key] = avgValue;
            }
            curMonth = month;
            curYear = year;
            dayNum = 0;
            aqiSum = 0;
        }
        dayNum++;
        aqiSum += cityAqiData[strdate];
    }
    // 数据最后一个月
    if (dayNum>0) {
        avgValue = Math.floor(aqiSum/dayNum);
        key = curYear + "年" + (curMonth+1)+"月" +":";
        chartData[key] = avgValue;
    }
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();

  renderChart();
}

init();

}