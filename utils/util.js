// 工具类

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
export function timeTo(time,nowtime,symbol){
	if(symbol=='年月日'){
		var split = symbol;
	}else{
		var split = symbol ? symbol:'/';
	}
    var date = new Date(time);
    var nowdate =new Date(nowtime);
    var PY = date.getFullYear();//获取指定时间年份
    var NY = nowdate.getFullYear();//获取当前时间年份
    var Y = (symbol=='年月日')? date.getFullYear()+split[0]:date.getFullYear()+split;
    var Ms = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    var M = (symbol=='年月日')? (date.getMonth()+1)+split[1]:Ms+split;
    var Ds = date.getDate()<10 ? '0'+ date.getDate() : date.getDate();
    var D = (symbol=='年月日')? date.getDate()+split[2]:Ds;
    var h = date.getHours() + split;
    var m = date.getMinutes() + split;
    var s = date.getSeconds();
    if(PY==NY){//判断年份是否是同一年，是的输出格式 08/01  不是的话输出格式2018/08/01
    	return M+D;
    }else{
    	return Y+M+D;
    }
}

//对时间戳进行转化，转化成时间统一xxxx-xx-xx 00:00:00
export function timeTotime(time) {
    var date = new Date(time);
	var Y = date.getFullYear() + '/';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    var D = date.getDate();
    var newtime= Y+M+D+" 00:00:00";
    return new Date(newtime).getTime();
}

/*获取传入时间距离当前时间的天数，然后进行判断，状态分为，如果是同一天显示今天，少一天是昨天，
少两天是前天，超过两天如果在本周显示周几，超过本周显示上周几，超过上周显示真实日期。明天，后天，下周同理。*/
export function ifDate(perDate,symbol,nowdate){//10-7
	var weekdays=['','一','二','三','四','五','六','日'];
	if(arguments.length==0){return false;}
	if(typeof(perDate)!='number' && typeof(perDate)!='object' && (typeof(perDate)=='number' && (perDate+'').length!=10 && (perDate+'').length!=14)){return false;}
	if(arguments.length==1 || arguments.length==2){
		nowdate=new Date().getTime();
	}
	if(typeof(perDate)=='number'){
		if((perDate+'').length==10){
			perDate=Number(perDate+'000');
		}
	}else{
		perDate=perDate.getTime();
	}
	var now = timeTotime(nowdate);	//对时间戳进行转化，转化成时间统一xxxx-xx-xx 00:00:00
	var wday =timeTotime(perDate);
	var runTime =(now-wday)/1000;
    var day = Math.floor(runTime / 86400);
    var nowday = new Date(now).getDay();//获取当前时间是星期几，0-6
    if(nowday==0){	//如果为0的话，把周日赋值为7   1-7分别对应周一到周日
    	var nowday =7;
    }
    if(day>=-2 && day<=2){
    	var daystrsarr=['后天','明天','今天','昨天','前天'];
    	return daystrsarr[day+2];
    }else if((Math.abs(day)>(14-nowday) && day<0) || day>=nowday+7){	//判断是否超过下一周，显示正常格式
    	return timeTo(wday,now,symbol);
    }else if(day>=nowday && day<(nowday+7)){	//判断是否是上一周
    	var dayNum=Math.abs(day-nowday-7);
    	return ('上周'+weekdays[dayNum]);
    }else if(day<0 && Math.abs(day)<=(7-nowday) || (day>0 && day<nowday)){	//判断是否是当前周
    	var dayNum =nowday-day;
    	return('本周'+weekdays[dayNum]);
    }else if(day<0 && Math.abs(day)>(7-nowday) && Math.abs(day)<=(14-nowday)){	//判断是否是下一周
    	var dayNum=Math.abs(day)+nowday-7;
    	return('下周'+weekdays[dayNum]);
    }else{
    	return timeTo(wday,now,symbol);
    }
}

//手机号验证
function checkPhone(phonenum){ 
    if(!(/^1\d{10}$/.test(phonenum))){ 
        return false; 
    }else{
    	return true; 
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
            },
            data: data,
            success:function(res) {
                resolve(res)
                if (res.data.respCode === 400) {
                    wx.showToast({
                        title: '账号出现异常，请重新登录',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/guide/guide',
                        })
                    }, 1000)
                    wx.removeStorageSync('TOKEN')
                    wx.removeStorageSync('USERPHONE')
                }
                if (res.data.respCode === 2012) {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            },
            fail:function(err) {
                wx.showToast({
                    title: '登陆失败啦啦啦',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    })
}

//名称改变背景颜色
export function todealName(str){
	str=str.replace(/\s/g,'');
	var colors=['#648EC3','#8364C3','#C36468','#64B0C3','#64B0C3','#C38664'];
	if(typeof str=='string'){
		var color=getcolors(str);
		var strname=getname(str);
		return [color,strname];
	}else if(typeof str=='number'){
		var color=getcolors(String(str));
		var strname=getname(str);
		return [color,strname];
	}else{
		return false;
	}
	//计算颜色
	function getcolors(str){
		var num='';
		var strarr=str.split("");
		for(var i=0;i<strarr.length;i++){
			num+=String(strarr[i].charCodeAt());
		}
		return colors[parseInt(num)%(colors.length)]
	}
	//计算字符串
	function getname(str){
		str=str.toUpperCase();
		if(str.length>0){
			if(str.length<2){
				return str;
			}else{
				if(str.match(/[\u4e00-\u9fa5]/g) && str.match(/[\u4e00-\u9fa5]/g).length==str.length){	//全部中文
					return str.substring(str.length-2,str.length);
				}else{
					return str.substring(0,2);
				}
			}
		}else{
			return false;
		}
	}
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
