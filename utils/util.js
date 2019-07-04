// 工具类
// 权限lis
// 1	物联网服务	iot
// 2	团队	iot:company
// 3	修改团队	iot:company:edit

// 4	区域	iot:devicegroup
// 5	添加区域	iot:devicegroup:add
// 6	修改区域	iot:devicegroup:edit
// 7	删除区域	iot:devicegroup:del

// 8	成员	iot:companyuser
// 9	添加成员	iot:companyuser:add
// 10	修改成员角色	iot:companyuser:editrole
// 11	删除成员	iot:companyuser:del

// 12	设备	iot:device
// 13	修改设备区域	iot:device:edit:group
// 14	修改设备名称	iot:device:edit:name
// 15	修改设备分类	iot:device:edit:category
// 16	控制设备	iot:device:changestate

// 17	摄像头	iot:camera
// 18	修改摄像头区域	iot:camera:edit:group
// 19	修改摄像头名称	iot:camera:edit:name
// 20	控制摄像头	iot:camera:control


const serverUrl = {
  '0': 'https://zaiottest.snkoudai.com/api/',
  '1': 'https://zaiot.snkoudai.com/api/'
}
const httpServer = serverUrl[0];

export const urlData = {
  // ====摄像头模块====
  'iotCameraEditGroup': `${httpServer}iot/co/camera/edit/group`, //修改企业摄像头所属区域
  'iotCameraEditName': `${httpServer}iot/co/camera/edit/name`, //修改摄像头名称
  'iotCameraInfoGet': `${httpServer}iot/co/camera/get`, //根据id获取摄像头详情
  'iotCameraList': `${httpServer}iot/co/camera/list`, //获取企业设备/个人设备----按照区域获取企业摄像头列表
  'iotCameraListByChoose': `${httpServer}iot/co/camera/list/byChoose`, // 获取企业摄像头-摄像头列表-可供区域选择的摄像头列表

  // ====团队/企业模块====
  'iotCompanyAdd': `${httpServer}iot/co/company/add`, //创建团队/企业
  'iotCompanyDel': `${httpServer}iot/co/company/del`, //删除团队/企业
  'iotCompanyEditName': `${httpServer}iot/co/company/edit/name`, //修改团队/企业名称
  'iotCompanyGet': `${httpServer}iot/co/company/get`, //获取企业详情
  'iotCompanyList': `${httpServer}iot/co/company/list`, //获取用户的企业列表

  // ====企业角色模块====
  'iotCompanyRoleList': `${httpServer}iot/co/companyrole/list`, //获取企业角色列表

  // ====企业用户模块====
  'iotCompanyUserEditMy': `${httpServer}iot/co/companyuser/edit/my`, //修改自己的用户昵称或头像，保证昵称和头像有一个字段不为空
  'iotCompanyUserGet': `${httpServer}iot/co/companyuser/get`, //使用accesstoken获取个人信息
  'iotCompanyUserRefEdit': `${httpServer}iot/co/companyuser/ref/edit`, //修改企业下某员工的角色
  'iotCompanyUserRefGet': `${httpServer}iot/co/companyuser/ref/get`, //获取某一企业下某一个员工的详细信息
  'iotCompanyUserRefGetMyPerm': `${httpServer}iot/co/companyuser/ref/get/myperm`, //获取员工在企业下权限标识列表
  'iotCompanyUserRefJoin': `${httpServer}iot/co/companyuser/ref/join`, //添加企业成员
  'iotCompanyUserRefList': `${httpServer}iot/co/companyuser/ref/list`, //获取企业成员列表
  'iotCompanyUserRefQuit': `${httpServer}iot/co/companyuser/ref/quit`, //退出企业
  'iotCompanyUserRefRemove': `${httpServer}iot/co/companyuser/ref/remove`, //删除企业下某员工
  'iotCompanyUserRefTransfer': `${httpServer}iot/co/companyuser/ref/transfer`, //移交团队

  // ====控制器分类模块====
  'iotControllerCateList': `${httpServer}iot/co/controllercategory/list`, //获取分类列表

  // ====设备模块====
  'iotDeviceControllerLogList': `${httpServer}iot/co/device/controller/log/list`, //用于：首页-控制设备-详情-操作日志列表
  'iotDeviceCountByProType': `${httpServer}iot/co/device/count/byProductType`, //获取企业设备/个人设备数量（按照产品类型，区域）
  'iotDeviceEditContCate': `${httpServer}iot/co/device/edit/controllerCategory`, //修改控制器类型设备所属分类
  'iotDeviceEditControlState': `${httpServer}iot/co/device/edit/controllerdevicestate`, //设置控制器状态
  'iotDeviceEditGroup': `${httpServer}iot/co/device/edit/group`, //修改设备所属区域
  'iotDeviceEditName': `${httpServer}iot/co/device/edit/name`, //修改设备显示名称
  'iotDeviceGetDetail': `${httpServer}iot/co/device/get/detail`, //获取设备的详细信息
  'iotDeviceListByChoose': `${httpServer}iot/co/device/list/byChoose`, // 获取企业设备-设备列表-可供区域选择的设备列表
  'iotDeviceSListByProType': `${httpServer}iot/co/device/stateList/byProductType`, //获取企业设备/个人设备-设备列表(包含当前的设备实时状态)
  'iotDeviceHistory': `${httpServer}iot/co/device/history`, // 获取设备某一个指标的历史数据

  // ====区域模块====
  'iotDeviceGroupAdd': `${httpServer}iot/co/devicegroup/add`, //企业下添加区域
  'iotDeviceGroupDel': `${httpServer}iot/co/devicegroup/del`, //企业下删除区域
  'iotDeviceGroupEdit': `${httpServer}iot/co/devicegroup/edit`, //企业下修改区域名称
  'iotDeviceGroupList': `${httpServer}iot/co/devicegroup/list`, //获取企业下区域列表
  'iotDeviceGroupListCount': `${httpServer}iot/co/devicegroup/list/count`, //获取企业下区域列表即该区域下设备数量

  // ====登录模块====
  'iotLoginLogout': `${httpServer}iot/co/login/logout`, //退出登录
  'iotLoginPhone': `${httpServer}iot/co/login/phone`, //手机号验证码登录
  'iotLoginByWX': `${httpServer}iot/co/login/wx`, //手机号验证码登录

  // ====短信模块====
  'baseSmsSendSmsVcode': `${httpServer}foundation/sms/sendSmsVcode`, //发送短信验证码

  // ====短信模块====
  'baseSmsSendSmsVcode': `${httpServer}foundation/sms/sendSmsVcode`, //发送短信验证码

}

//防止多次点击按钮 多此触发  函数节流方法
export const throttle = (fn, gapTime) => {
  let _lastTime = null;
  if (gapTime === null || gapTime === undefined) {
    gapTime = 1500
  }
  // 返回新的函数
  return function () {
    let _this = this;
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(_this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

// 检测手机号
export const checkPhone = p => {
  let pReg = /^1\d{10}$/;
  return pReg.test(p);
}

// 时间格式化
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//时间戳格式化  传参time：指定时间，nowtime:当前时间，10-7
export function timeTo(time, nowtime, symbol) {
  if (symbol == '年月日') {
    var split = symbol;
  } else {
    var split = symbol ? symbol : '/';
  }
  var date = new Date(time);
  var nowdate = new Date(nowtime);
  var PY = date.getFullYear(); //获取指定时间年份
  var NY = nowdate.getFullYear(); //获取当前时间年份
  var Y = (symbol == '年月日') ? date.getFullYear() + split[0] : date.getFullYear() + split;
  var Ms = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var M = (symbol == '年月日') ? (date.getMonth() + 1) + split[1] : Ms + split;
  var Ds = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var D = (symbol == '年月日') ? date.getDate() + split[2] : Ds;
  var h = date.getHours() + split;
  var m = date.getMinutes() + split;
  var s = date.getSeconds();
  if (PY == NY) { //判断年份是否是同一年，是的输出格式 08/01  不是的话输出格式2018/08/01
    return M + D;
  } else {
    return Y + M + D;
  }
}

//对时间戳进行转化，转化成时间统一xxxx-xx-xx 00:00:00
export function timeTotime(time) {
  var date = new Date(time);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate();
  var newtime = Y + M + D + " 00:00:00";
  return new Date(newtime).getTime();
}

/*获取传入时间距离当前时间的天数，然后进行判断，状态分为，如果是同一天显示今天，少一天是昨天，
少两天是前天，超过两天如果在本周显示周几，超过本周显示上周几，超过上周显示真实日期。明天，后天，下周同理。*/
export function ifDate(perDate, symbol, nowdate) { //10-7
  var weekdays = ['', '一', '二', '三', '四', '五', '六', '日'];
  if (arguments.length == 0) {
    return false;
  }
  if (typeof (perDate) != 'number' && typeof (perDate) != 'object' && (typeof (perDate) == 'number' && (perDate + '').length != 10 && (perDate + '').length != 14)) {
    return false;
  }
  if (arguments.length == 1 || arguments.length == 2) {
    nowdate = new Date().getTime();
  }
  if (typeof (perDate) == 'number') {
    if ((perDate + '').length == 10) {
      perDate = Number(perDate + '000');
    }
  } else {
    perDate = perDate.getTime();
  }
  var now = timeTotime(nowdate); //对时间戳进行转化，转化成时间统一xxxx-xx-xx 00:00:00
  var wday = timeTotime(perDate);
  var runTime = (now - wday) / 1000;
  var day = Math.floor(runTime / 86400);
  var nowday = new Date(now).getDay(); //获取当前时间是星期几，0-6
  if (nowday == 0) { //如果为0的话，把周日赋值为7   1-7分别对应周一到周日
    var nowday = 7;
  }
  if (day >= -2 && day <= 2) {
    var daystrsarr = ['后天', '明天', '今天', '昨天', '前天'];
    return daystrsarr[day + 2];
  } else if ((Math.abs(day) > (14 - nowday) && day < 0) || day >= nowday + 7) { //判断是否超过下一周，显示正常格式
    return timeTo(wday, now, symbol);
  } else if (day >= nowday && day < (nowday + 7)) { //判断是否是上一周
    var dayNum = Math.abs(day - nowday - 7);
    return ('上周' + weekdays[dayNum]);
  } else if (day < 0 && Math.abs(day) <= (7 - nowday) || (day > 0 && day < nowday)) { //判断是否是当前周
    var dayNum = nowday - day;
    return ('本周' + weekdays[dayNum]);
  } else if (day < 0 && Math.abs(day) > (7 - nowday) && Math.abs(day) <= (14 - nowday)) { //判断是否是下一周
    var dayNum = Math.abs(day) + nowday - 7;
    return ('下周' + weekdays[dayNum]);
  } else {
    return timeTo(wday, now, symbol);
  }
}

//时间字符串 转换
export function updateTime(stamp) {
  var now = Date.now();
  var minutes = Math.abs(now - stamp) / 1000 / 60;
  if (minutes == 0) {
    return "刚刚";
  } else if (minutes > 0 && minutes < 1) {
    return Math.floor(minutes * 60) + "秒前";
  } else if (minutes >= 1 && minutes < 60) {
    return Math.floor(minutes) + "分钟前"
  } else if (minutes >= 60 && minutes < 1440) {
    return Math.floor(minutes / 60) + "小时前"
  } else if (minutes >= 1440) {
    return Math.floor(minutes / 1440) + "天前"
  }
}
//post请求
export const post = (url, data, token) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'accessToken': token,
        'clientType': 3,
      },
      data: data,
      success: function (res) {
        resolve(res)
        if (res.data.respCode === 400) { //token失效
          wx.showToast({
            title: '账号出现异常，请重新登录',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          wx.clearStorage();
          setTimeout(function () {
            wx.reLaunch({
              url: '/pages/guide/guide',
            })
          }, 1000)
        }
        else if (res.data.respCode === 404) { //权限不足
          wx.showToast({
            title: '您的权限无法使用该功能',
            icon: 'none',
            duration: 3000,
            mask: true
          });
          getCompany(wx.getStorageSync('CID'))
        }
        else if (res.data.respCode === 405) { //当前用户不在该团队时
          wx.showToast({
            title: '您不具备该团队的任何权限',
            icon: 'none',
            duration: 3000,
            mask: true
          });
          setTimeout(() => {
            getCompanyList()
              .then(({ data }) => {
                if (data.respCode === 0) {
                  wx.setStorageSync('CID', data.obj.list[0].id);
                  getCompany(data.obj.list[0].id)
                  wx.setStorageSync('GID', {
                    name: '全部区域',
                    id: -1
                  });
                  wx.reLaunch({
                    url: '/pages/index/index',
                  });
                }
              })
          }, 3000)
        }
        else if (res.data.respCode === 10001) { // 验证码错误
          wx.showToast({
            title: res.data.respDesc,
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
        else if (res.data.respCode === 300) {
          wx.showToast({
            title: res.data.respDesc,
            icon: 'none',
            duration: 3000,
            mask: true
          });
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 3000,
          mask: true
        });
      }
    })
  })
}

//名称改变背景颜色
export function todealName(str) {
  str = str.replace(/\s/g, '');
  var colors = ['#4BB7FB', '#F06292', '#FB854B', '#26C6DA', '#BA68C8', '#B3D64C', '#82B1FF', '#FF8A80'];
  if (typeof str == 'string') {
    var color = getcolors(str);
    return color;
  } else if (typeof str == 'number') {
    var color = getcolors(String(str));
    return color;
  } else {
    return false;
  }
  //计算颜色
  function getcolors(str) {
    var num = '';
    var strarr = str.split("");
    for (var i = 0; i < strarr.length; i++) {
      num += String(strarr[i].charCodeAt());
    }
    return colors[parseInt(num) % (colors.length)]
  }
}

// 权限判断
export function ishasPower(mark, nextfn, reget = false) { //mark仅支持数组 ,nextfn是回调，reget是是否需要重新拉取权限
  let results = [],
    powerArr = wx.getStorageSync('COMPANYINFO').perms;
  if (!reget && wx.getStorageSync('COMPANYINFO').perms && (wx.getStorageSync('COMPANYINFO').powerTime > (new Date().getTime() - 1200000))) {
    if (mark instanceof Array) {
      results = [];
      mark.forEach((item, index) => {
        results.push(hasitem(powerArr, item))
      })
      if (nextfn) {
        nextfn(results)
      }
    }
  } else {
    getCompany(wx.getStorageSync('CID'), function () {
      ishasPower.call(null, mark, nextfn)
    });
  }
}

//item在arr中是否存在
function hasitem(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      return true;
    }
  }
  return false;
}

//日期原型上添加format方法，new Date().format("yyyy-MM-dd hh:mm:ss")
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month 
    "d+": this.getDate(), //day 
    "h+": this.getHours(), //hour 
    "m+": this.getMinutes(), //minute 
    "s+": this.getSeconds(), //second 
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
    "S": this.getMilliseconds() //millisecond 
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

//获取企业列表
export const getCompanyList = (nextfn) => {
  let compListPost = post(urlData.iotCompanyList, {}, wx.getStorageSync('TOKEN'));

  compListPost.then(function (resp) {
    if (nextfn) {
      nextfn(resp)
    }
  });
  return compListPost;
}
// 检查是否是企业
export const checkCompany = (cid) => {
  if (cid === 0) {
    wx.setStorageSync('CID', cid);
    wx.setStorageSync('COMPANYINFO', {});
    return false;
  }
  else {
    return true;
  }
}
//获取企业详情
export const getCompany = (cid, nextfn) => {
  // console.log(wx.getStorageSync('TOKEN'));
  return new Promise((resolve, resject) => {
    if (checkCompany(cid)) {
      post(urlData.iotCompanyGet, {
        companyId: cid
      }, wx.getStorageSync('TOKEN'))
        .then((resp) => {
          // debugger;
          if (resp.data.respCode === 0) {
            wx.setStorageSync('CID', cid);
            resp.data.obj.powerTime = new Date().getTime(); //存入当前最新获取权限的时间
            wx.setStorageSync('COMPANYINFO', resp.data.obj);
            resolve(resp);
            setTimeout(() => {
              nextfn && nextfn();
            }, 0)
          }
        });
    } else {
      resolve();
      setTimeout(() => {
        nextfn && nextfn();
      }, 0)
    }
  })

}

export const checkBt = (str, max) => { //检测字符串长度，max为汉字个数，数字和字母为一个字节，汉字占两个字节
  let char = str.replace(/[^\x00-\xff]/g, '**');
  const maxlen = max * 2;
  return char.length > maxlen ? false : true;
}