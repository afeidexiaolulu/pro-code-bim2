//获取url路径中参数的值
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
document.documentElement.style.fontSize = document.documentElement.clientWidth / 5 + 'px';
/**
 * 获取项目根路径,如:http://localhost:8083/uimcardprj
 */
function getRootPath() {

	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;

	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);

	//获取主机地址，如： http://localhost:8083
	var localhostPath = curWwwPath.substring(0, pos);

	//获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

	return (localhostPath);
}
/**
 * 获取url中的携带的参数
 */
function getParameterFromUrl(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
/**
 * 获取url中的携带的中文参数
 */
function getUrlParamCN(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = decodeURI(window.location.search).substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}
/**
 * 获取当前时间(yyyy-MM-DD HH:MM:SS)
 */
function getCurrentTime() {
	var now = new Date();
	var year = now.getFullYear(); //年
	var month = now.getMonth() + 1; //月
	var day = now.getDate(); //日
	var hh = now.getHours(); //时
	var mm = now.getMinutes(); //分
	var ss = now.getSeconds(); //秒
	var clock = year + "-";
	if (month < 10)
		clock += "0";
	clock += month + "-";
	if (day < 10)
		clock += "0";
	clock += day + " ";
	if (hh < 10)
		clock += "0";
	clock += hh + ":";
	if (mm < 10) clock += '0';
	clock += mm + ":";
	if (ss < 10) clock += '0';
	clock += ss;
	return (clock);
}

/**
 * 刷新指定页面
 * @param {Object} url
 */
function flush(url) {
	window.location.href = getRootPath() + url;
}
/**
 * 将时间戳转换成日期格式
 * console.log(timestampToTime(1403058804));//2014-06-18 10:33:24
 * */
function timestampToTime(timestamp) {
	if (timestamp == "" || timestamp == null) return null;
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}
/**
 * 将时间戳转换成日期格式(不包含时分秒)
 * console.log(timestampToTime(1403058804));//2014-06-18
 * */
function timestampToTimeWithoutHMS(timestamp) {
	if (timestamp == "" || timestamp == null) return null;
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	return Y + M + D; //+ h + m + s;
}

/**
 * 去除字符串空格
 * */
function Trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 计算文件大小函数(保留两位小数),Size为字节大小
// size：初始文件大小
function getfilesize(size) {
	if (!size)
		return "";
	var num = 1024.00; //byte
	if (size < num)
		return size + "B";
	if (size < Math.pow(num, 2))
		return (size / num).toFixed(2) + "K"; //kb
	if (size < Math.pow(num, 3))
		return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
	if (size < Math.pow(num, 4))
		return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
	return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}
/**
 * 增贾网页ico
 */
(function () {
	var link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = getRootPath() + '/static/img/favicon.ico';
	document.getElementsByTagName('head')[0].appendChild(link);
}());
/**
 *
 * @param {string} obj 需要截取的字符串
 *   @param {string} Delimiter 分隔符
 */
function getCaption(obj, Delimiter) {
	var index = obj.lastIndexOf("" + Delimiter + "");
	obj = obj.substring(index + 1, obj.length);
	return obj;
}


function changeFrameHeight(id) {
	var ifm = document.getElementById(id);
	ifm.height = document.documentElement.clientHeight;
}

/**
 * 加载JS/css文件
 */
var dynamicLoading = {
	css: function (path) {
		if (!path || path.length === 0) {
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.href = path;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		head.appendChild(link);
	},
	js: function (path) {
		if (!path || path.length === 0) {
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = path;
		script.type = 'text/javascript';
		head.appendChild(script);
	}
}

/**
 * 
 * @param {*} filename  要删除文件名 
 * @param {*} filetype  要删除文件类型
 */
function removejscssfile(filename, filetype) {
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none"
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none"
	var allsuspects = document.getElementsByTagName(targetelement)
	for (var i = allsuspects.length; i >= 0; i--) {
		if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i])
	}
}

var addRule = (function (style) {
	var sheet = document.head.appendChild(style).sheet;
	return function (selector, css) {
		var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
			return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
		}).join(";");
		sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
	};
})(document.createElement("style"));


function Copy(str) {
	var save = function (e) {
		e.clipboardData.setData('text/plain', str);
		e.preventDefault();
	}
	document.addEventListener('copy', save);
	document.execCommand('copy');
	document.removeEventListener('copy', save);
}

/**
 * 
 * @param {*} event 事件冒泡
 */
function stopEven(event) {
	event.stopPropagation();
	event.preventDefault();
}


/**
 *
 * 获取未读消息数量
 */
function get_UnreadMessage(){
	$.ajax({
		url: getRootPath() + "/bim/api/message/getReadNum",
		type: "post",
		cache: false,
		async: false,
		data: {
			readStatus: "weidu"
		},
		beforeSend: function () {
			layer.load(2);
		},
		complete: function () {
			layer.closeAll('loading');
		},
		success: function (data) {
			if (data.data != "0"){
				if(data.data > "9") {
					$(".layui-badge-dot").html("9+");
				}else {
					$(".layui-badge-dot").html(data.data);
				}
				$(".layui-badge-dot").show();
			}
		},
		error: function () {
			BIM.open({
				content: '\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5',
				skin: 'msg',
				time: 2
			});
		}
	})
}
