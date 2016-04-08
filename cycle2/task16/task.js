/* 
* @Author: anchen
* @Date:   2016-04-08 11:26:09
* @Last Modified by:   anchen
* @Last Modified time: 2016-04-08 16:19:17
*/

'use strict';
window.onload = function(){
    /**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var strCity = document.getElementById("aqi-city-input").value.trim();
    var strWeather = document.getElementById("aqi-value-input").value.trim();
    if (strCity.search(/^[A-Za-z\u4E00-\u9FA5]+$/) == -1) {
        alert("请输入中英文字符的城市名");
        return;
    }
    if (strWeather.search(/^\d+$/) == -1) {
        alert("请输入至少一个整数");
        return;
    }
    aqiData[strCity] = strWeather;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.getElementById("aqi-table");
    table.innerHTML = "";
    for(var key in aqiData){
        if(table.children.length == 0){
            table.innerHTML = "<tr><td>城市</td> <td>空气质量</td> <td>操作</td></tr>";
        }
        var tr = document.createElement("tr");
        var tdcity = document.createElement("td");
        tdcity.innerHTML = key;
        var tdweather = document.createElement("td");
        tdweather.innerHTML = aqiData[key];
        var tdbutton = document.createElement("td");
        tdbutton.innerHTML = "<button class='del-btn'>删除</button>";
        tr.appendChild(tdcity);
        tr.appendChild(tdweather);
        tr.appendChild(tdbutton);
        table.appendChild(tr);
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(btn) {
  // do sth.
  var tr = btn.parentNode.parentNode;
  var city = tr.children[0].innerHTML;
  delete aqiData[city];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.getElementById("add-btn");
  addBtn.addEventListener("click", addBtnHandle);

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var table = document.getElementById("aqi-table");
  table.addEventListener("click",function(event){
    if (event.target.nodeName == "BUTTON" && event.target.className == "del-btn") {
        delBtnHandle(event.target);
    }
  })
}

init();
}