//获取url路径中参数的值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
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

    //return "http://192.168.1.124:8180"
}

/**
 * 比较当前时间和跟进日期，如果大于，返回true,如果小于,返回false
 * @param {String} follDate:yyyy-MM-dd
 * @param {String} mytoday:yyyy-MM-dd
 */
function dateCompare(follDate, mytoday) {

    var arrFollDate = follDate.split('-');
    var follDateMonth = parseInt(arrFollDate[1]) - 1;
    var follDateBegin = new Date(arrFollDate[0], follDateMonth, arrFollDate[2]);
    var follDates = follDateBegin.getTime();

    var arrMytoday = mytoday.split('-');
    var mytodayMonth = parseInt(arrMytoday[1]) - 1;
    var mytodayBegin = new Date(arrMytoday[0], month, arrMytoday[2]);
    var mytodays = mytodayBegin.getTime();

    if (mytodays >= follDates) {
        return true;
    } else {
        return false;
    }
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
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    //var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    //var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    //var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return Y + M + D; //+ h + m + s;
}

/**
 * 去除字符串空格
 * */
function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 解析fileJson数据,并设置给控件属性
 * @param {Object} widgetId 控件id
 * @param {Object} fileListJsonStr 文件数据
 */
function parseFileJsonAndSetLink(widgetId, fileListJsonStr) {
    if (fileListJsonStr == null || fileListJsonStr == "") {
        return;
    }
    var fileJson = $.parseJSON(fileListJsonStr);
    for (var i = 0; i < fileJson.length; i++) {
        var fileName = fileJson[i].fileName;
        var link = getRootPath() + '/components/upload/download.htm?downloadId=' + fileJson[i].id;
        $("#" + widgetId).append("<a download href='" + link + "'>" + fileName + "</a></br>");
    }
}

// 美化滚动条
function BeautifyScroll(idClass) {
    $(idClass).niceScroll({
        cursorcolor: "#ccc", //#CC0071 光标颜色
        cursoropacitymin:0, //改变不透明度非常光标处于非活动状态（scrollabar“隐藏”状态），范围从1到0， 默认为0（隐藏） 
        cursoropacitymax: 0, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        scrollspeed :80,
        cursorborderradius: "5px", //以像素为光标边界半径
        autohidemode: true //是否隐藏滚动条
    });
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
    // document.documentElement.style.fontSize = document.documentElement.clientWidth / 5 + 'px';

(function() {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = getRootPath() + '/static/img/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}());

/**
 *
 * @param {string} url 需要加载js路径
 */
function load(url) { //url：
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script)
}
/**
 *
 * @param {string} obj 需要截取的字符串
 *   @param {string} Delimiter 分隔符
 */
function getCaption(obj,Delimiter){
    var index=obj.lastIndexOf(""+ Delimiter +"");
    obj=obj.substring(index+1,obj.length);
    return obj;
}

function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){

    } else {
        window.location.href="要跳往的手机页面";
    }
}

/*
* 屏幕横竖屏
* */
// var detectOrient = function() {
//     let width = document.documentElement.clientWidth,
//         height =  document.documentElement.clientHeight
//     if( width < height ){
//         layer.msg("请横屏访问", {
//             icon: 5,
//             anmin: 6
//         });
//         $(".ipad_t").show();
//     }else{
//         $(".ipad_t").hide()
//     }
// }
// window.onresize = detectOrient;

function $maskon(){
    parent.parent.parent.$(".layui-body").css("z-index","1000")
    parent.parent.parent.$(".layui-layout-admin").append("<div class='layui-layer-shade' style='background-color: rgb(0, 0, 0); opacity: 0.5; display: block; z-index: 999;' id="+ configId +" times="+ configTimes +"></div>");
}

function $maskof(){
    parent.parent.parent.$(".layui-layer-shade").remove();
    parent.parent.parent.$(".layui-body").removeAttr("style");
}