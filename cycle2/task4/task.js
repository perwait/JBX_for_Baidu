/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var _boolean=true;
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	_boolean=true;
	var _city=document.getElementById('aqi-city-input');
	var	_number=document.getElementById('aqi-value-input');
	var _cValue="";
	var _nValue="";
	if(!_city.value.match(/^[a-zA-Z\u4e00-\u9fa5]+$/||_city.value.trim()=="")){
		_city.parentNode.getElementsByTagName('span')[0].innerText="只能输入中英文"
		_boolean=false;
	} else {
		_city.parentNode.getElementsByTagName('span')[0].innerText="";
		_cValue=_city.value;
	}	
	if(!_number.value.match(/^\d+$/||_number.value=="")){
		_number.parentNode.getElementsByTagName('span')[0].innerText="只能输入数字";
		_boolean=false;
	} else {
		_number.parentNode.getElementsByTagName('span')[0].innerText=""
		_nValue=_number.value;
	}
	if(!_boolean)return false;
	aqiData[_cValue]=_nValue;
	console.log(aqiData)
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	if(!_boolean)return false;
	var _table=document.getElementById('aqi-table');
	var _node = document.createDocumentFragment();
	var _temp=0;
	_table.innerHTML="";
	/*插入头部*/
	var _title=document.createElement("tr");
	_title.innerHTML="<th>城市</th><th>空气质量</th><th>操作</th>";
	_node.appendChild(_title);
	for(var key in aqiData){
		var _chlid=document.createElement("tr");
		_chlid.innerHTML="<td>"+key+"</td><td>"+aqiData[key]+"</td><td><button>删除</button></td>";
		_node.appendChild(_chlid);
		console.log("插入："+key+" ： "+aqiData[key])
	}
	_table.appendChild(_node);
	delBtnEvent();
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
function delBtnHandle() {
	// do sth.
	renderAqiList();
}

/**
 *为删除按钮绑定事件
 */
function delBtnEvent() {
	var _btns=document.getElementById('aqi-table').getElementsByTagName('button');
	for(var i=0;i<_btns.length;i++){
		!function(i){
			_btns[i].onclick=function(){
				var _cValue=_btns[i].parentNode.parentNode.firstChild.innerText;
				_boolean=true
				delete aqiData[_cValue];
				delBtnHandle() 
				console.log(aqiData);
				console.log("删除城市："+_cValue);
			}
		}(i)
	}
}
 
function init() {
	document.getElementById('add-btn').onclick=addBtnHandle;
	
	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}
	
init();
