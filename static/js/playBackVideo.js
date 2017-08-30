//存放播放实时视频的设备编号
var sbbh = "";
//存放播放实时视频的窗口索引
var index;
var playid;
//存放grid表格的数据源
var dataSource;
//存放从localStorage取出来的数组
var deviceLocalStorage = [];
//存放筛选过spsbbh后的数组
var deviceArray = [];
//存放窗口点击事件的数组
var windowArray = [];
//判断是否已经点击过窗口
var boolMS_EventCallback = false;
var timeDifference = 2;
var year;
var month;
var day;
var hour;
var second;
var minute;
var startTime = "";
var endTime = "";
//判断是否是开始时间
var isStart = true;
//判断是否有历史视频
var isPlayBackVideo = false;
var result;
$(function () {
    alert("init video");
    deviceArray = [
	    { spsbbh: "", sbbh: "44060501021310000009", jgsj: "2017-08-10 19:50:50" },
        { spsbbh: "", sbbh: "44060501021310000009", jgsj: "2017-08-02 19:50:50" }
    ]
})


//设置时间为经过时间的前后两分钟
function setPlayBackVideoTime(date) {
    date.setMinutes(date.getMinutes() - timeDifference);//设置开始时间
    isStart = true
    setTimeFormate(date, isStart);//设置时间格式

    date.setMinutes(date.getMinutes() + timeDifference * 2);//设置结束时间
    isStart = false;
    setTimeFormate(date, isStart);
}

//设置时间格式
function setTimeFormate(date, boolStart) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    second = date.getSeconds();
    minute = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (second >= 0 && second <= 9) {
        second = "0" + second;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (boolStart) {
        startTime = year + "," + month + "," + day + "," + hour + "," + minute + "," + second;
    } else {
        endTime = year + "," + month + "," + day + "," + hour + "," + minute + "," + second;
    }



}

window.onload = function () {
    var obj = document.getElementById("HisVideo");

    var deviceArray = [
        { spsbbh: "", sbbh: "44060501021310000009", jgsj: "2017-08-10 19:50:50" }
    ];
    //readyState为4时,代表完全加载了.  
    if (obj.readyState == 4) {
        alert(obj.readyState);
        //alert("加载成功!");       
        Register();
        alert("加载完成");
        obj.MS_SetLayoutMode(0);//设置布局模式,0表示有1,4,6,8,9分屏
        //判断是几个设备对应几分屏
        alert(deviceArray.length);
        if (deviceArray.length == 1) {
            //调用一分屏接口     
            obj.ms_setcurrentlayout(1);

    var videoCtrl = document.getElementById("HisVideo");
    alert(videoCtrl);
    videoCtrl.MS_SetHisCallback(hisCallback);
    //playid = videoCtrl.MS_PlayBackbyTime(sbbh, "2017,07,17,17,30,00", "2017,07,17,18,30,00", 0);
    playid = videoCtrl.MS_PlayBackbyTime("44060501021310000009", "2017,07,17,17,30,00", "2017,07,17,18,30,00", 0);
    if (playid < 0) {
        alert("MS_PlayBackbyTime接口错误！错误码" + playid);
        return;
    }


        } else if (deviceArray.length > 1 && deviceArray.length <= 4) {
            //调用四分屏接口
            obj.ms_setcurrentlayout(4);
            for (var i = 0; i < deviceArray.length; i++) {
                setWindowByArrayLength(i);
                alert("set:"+i);
            }
        } else if (deviceArray.length > 4 && deviceArray.length <= 6) {
            //调用六分屏接口
            obj.ms_setcurrentlayout(6);
            for (var i = 0; i < deviceArray.length; i++) {
                setWindowByArrayLength(i);
            }
        } else {
            //调用六分屏接口
            obj.ms_setcurrentlayout(6);
            for (var i = 0; i < 6; i++) {
                setWindowByArrayLength(i);
            }
        }
    } else {
        alert("加载失败!");
    }
    beginCallback();
}

//根据数组的长度判断用几分屏
function setWindowByArrayLength(index) {
    var date = new Date(deviceArray[index].jgsj.replace(/-/g, "/"));//获取到点击的设备的经过时间
    setPlayBackVideoTime(date);
    var sbbh = deviceArray[index].sbbh;
    alert(sbbh+":"+startTime+":"+endTime+index);
    OnBtnClickhkPlayBack(sbbh, startTime, endTime, index);//播放历史视频方法
}

//读文件     
function readFile(filename) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var f = fso.OpenTextFile(filename, 1);
    var s = "";
    while (!f.AtEndOfStream)
        s += f.ReadLine() + "\n";
    f.Close();
    return s;
}

//写文件     
function writeFile(filename, filecontent) {
    var fso, f, s;
    fso = new ActiveXObject("Scripting.FileSystemObject");
    f = fso.OpenTextFile(filename, 8, true);
    f.WriteLine(filecontent);
    f.Close();
    alert('ok');
}

//调用oxc控件里面的函数
function beginCallback() {
    var videoCtrl = document.getElementById("HisVideo");
    document.getElementById("HisVideo").attachEvent('MS_EventCallback', MS_EventCallback);
}

//注册各种回调的方法
function Register() {
    var videoCtrl = document.getElementById("HisVideo");
    result = videoCtrl.MS_StartClient('SUPPER_NONEED_USER', '');//注册客户端
    if (result != 0) {
        alert("MS_StartClient接口错误！错误码" + result);
        return;
    }
    // 注册回调函数	
    videoCtrl.MS_SetSnapCallback(snapCallback);//注册抓拍回调函数
    videoCtrl.MS_SetHisCallback(hisCallback);//注册历史回放回调函数
    videoCtrl.MS_SetDownloadCallback(downloadCallback);//注册下载回调函数
}

//抓拍的回调函数
function snapCallback(result, result1) {
    writeFile('E:\\js.txt', result);
}

//历史视频回放的回调函数
function hisCallback(result, result1) {
    var his = document.getElementById('his');
    his.innerHTML = eval("[" + result + "]")[0];//.Pos
}

//下载的回调函数
function downloadCallback(result, result1) {
    var download = document.getElementById('download');
    download.innerHTML = result;
}

//抓拍点击事件
function OnBtnClickSnap() {
    var videoCtrl = document.getElementById("HisVideo");
    videoCtrl.MS_SetSnapCallback(snapCallback);
    result = videoCtrl.MS_SnapPictures(0, 0, "", "");
    if (result != 0) {
        alert("MS_SnapPictures接口错误！错误码" + result);
        return;
    }
}

//历史视频播放点击事件
function OnBtnClickhkPlayBack(sbbh, startTime, endTime, index) {
    var videoCtrl = document.getElementById("HisVideo");
    alert(videoCtrl);
    videoCtrl.MS_SetHisCallback(hisCallback);
    //playid = videoCtrl.MS_PlayBackbyTime(sbbh, "2017,07,17,17,30,00", "2017,07,17,18,30,00", 0);
    playid = videoCtrl.MS_PlayBackbyTime(sbbh, startTime, endTime, index);
    if (playid < 0) {
        alert("MS_PlayBackbyTime接口错误！错误码" + playid);
        return;
    }
}

//窗口的回调函数
function MS_EventCallback(a, b) {
    boolMS_EventCallback = true;
    //alert(b);
    windowArray = "[" + b + "]";
    //eval(array)[0].LastFoucusIndex
    //eval(array)[0].CameraID
    //console.log(eval(windowArray)[0].FoucusIndex)
}

//隐藏grid的滚动条
//function onDataBound(e) {
//    var rowCount = jQuery("#" + this.element[0].id).find('table tbody tr').length;
//    var colCount = jQuery("#" + this.element[0].id).find('table thead tr th').length;
//    number = rowCount;
//    if (rowCount == 0) {
//        jQuery("#" + this.element[0].id).find('table tbody').append('<tr class="kendo-data-row"><td style=\"line-height:normal !important;\" colspan="' + colCount + '">@N5Default.PROMPT_NO_RECORDS</td></tr>');
//    }
//    jQuery("#" + this.element[0].id + " .k-grid-content").css("overflow-y", "auto");
//    jQuery("#" + this.element[0].id + " .k-grid-header").css("padding-right", "0px");
//}
