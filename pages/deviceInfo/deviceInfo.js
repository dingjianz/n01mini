import * as echarts from '../../components/ec-canvas/echarts';
import { post, urlData, updateTime, formatTime, ifDate ,ishasPower } from '../../utils/util.js'

const app = getApp();
let xAxisTile = []; // x轴类目名称列表
let yAxisUnit = "单位：mm"; // y轴单位
let yAxisData = []; // 折线图数据 
let Chart = null;
let rotateDeg = 0; // X轴文字倾斜程度
let xIntervalFlag = 'auto'; // X轴interval
let symbolControl = 'none'; // 折线图 默认不显示点



Page({
  data: {
    // iphoneX
    isIPX: false,
    deviceId: '', // 设备id
    proLength: 1, // 为2时代表 温度湿度 
    isOnline: true, // 是否在线
    deviceInfo: {}, // 设备详情信息
    deviceGroupVO: null, // 所在分组信息，个人设备则无此字段 null则显示默认区域
    valueLastTime: '', // 上次数据更新时间
    dateNum: 7, // dateType=1固定天数时的具体天数，取值：1,7,30
    dateType: 1, // 时间类型：2-自定义，1-固定天数 
    startDateStr: '', // dateType=2 自定义时的开始日期，格式：yyyy-MM-dd
    endDateStr: '', // dateType=2 自定义时的结束日期，格式：yyyy-MM-dd
    identifier: '', // 属性标识符
    historyList: [], // 折线图存储数据 
    specsEnumList: [], // 枚举集合
    lsxKeyValue: '',
    isFirst: true, // 为了解决 第一次进入无数据时，echart不能初始化

    isHasHistory:true,    //是否有历史记录
    power_set:false,    //设置权限
    ec: {
      lazyLoad: true // 延迟加载
    },
    thflag: true, // 土壤湿温度设备详情时，折线表先显示温度
    numValueOyLsxFlag: true, // 判断是数据型还是离散型， true是数据型，false是离散型
    currentIndex: 1,
    opts: [{
      id: 1,
      txt: '1天'
    }, {
      id: 2,
      txt: '7天'
    }, {
      id: 3,
      txt: '30天'
    }, {
      id: 4,
      txt: '自定义'
    }]
  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },

  conveyCurrentIndex({ currentTarget }) {
    this.setData({
      currentIndex: currentTarget.dataset.currentindex
    })
    if (this.data.currentIndex === 0) {
      this.setData({
        dateNum: 1,
        dateType: 1,
        startDateStr: '',
        endDateStr: ''
      })
    } else if (this.data.currentIndex === 1) {
      this.setData({
        dateNum: 7,
        dateType: 1,
        startDateStr: '',
        endDateStr: ''
      })
    } else if (this.data.currentIndex === 2) {
      this.setData({
        dateNum: 30,
        dateType: 1,
        startDateStr: '',
        endDateStr: ''
      })
    } else {
      this.setData({
        dateNum: '',
        dateType: 2,
        startDateStr: this.data.startDateStr,
        endDateStr: this.data.endDateStr
      })
    }
    this.getHistoryData().then(() => {
      if (this.data.numValueOyLsxFlag) {
        let yData = [];
        let xTitle = [];
        for (let item of this.data.historyList) {
          yData.push((item.value).toFixed(2))
          let timeStr = formatTime(new Date(item.timestamp));
          let tStr1, tStr2;
          tStr1 = timeStr.substr(5, 5);
          tStr1 = tStr1.replace('/', '.');
          tStr2 = timeStr.substr(11, 5);
          xTitle.push( ' ' + tStr1 + ' ' + tStr2);
        }
        yAxisData = yData;
        xAxisTile = xTitle;
        Chart.setOption(this.getOption()); //重新渲染图表 
      } else {
        for (let item of this.data.historyList) {
          let timeStr1 = ifDate(new Date(item.timestamp));
          let timeStr2 = formatTime(new Date(item.timestamp)).substr(11,5);

          if (this.data.currentIndex === 0) { // 一天时显示时分，其他类型无需显示时分
            item.timestamp = timeStr1 + " " + timeStr2;
          } else {
            item.timestamp = timeStr1
          }
          item.timestamp = item.timestamp.replace(/[/]/g, '.');

          for (let it of this.data.specsEnumList) {
            if (Number(it.key) === item.value) {
              item.value = (it.keyValue && it.keyValue.replace('风', '')) || '';
            }
          }
        }
        this.setData({
          historyList:this.data.historyList
        })
      }
    });
  },

  //初始化图表
  init_echarts: function (i) {
    this.echartsComponnet1.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function () {
    Chart.clear(); // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () { // 指定图表的配置项和数据
    var option = {
      grid: {
        containLabel: true,
        top: '15%',
        left: '7%',
        right: '7%',
        bottom: '5%'
      },
      color: ['#16BD6C'],
      tooltip: {
        // show: false,
        show: true,
        trigger: 'axis',
        backgroundColor: '#0B337D',
        formatter: '{b0}' + '\n' + '数值： {c0}',
        textStyle: {
          color: '#8BABE7'
        },
        axisPointer:{
          lineStyle:{
            color:'#155AC5'
          },
          z:999999
        },
        // position: function(point, params, dom, rect, size){
        //   var obj = {top: point[1]};
        //   obj[['left', 'right'][+(point[0] < size.viewSize[0] / 2)]] = 5;
        //   return obj;
        // }
        position: function (point, params, dom, rect, size) {
          // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
          // 提示框位置
          var x = 0; // x坐标位置
          var y = 0; // y坐标位置
          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];
          // 外层div大小
          // var viewWidth = size.viewSize[0];
          // var viewHeight = size.viewSize[1];
          // 提示框大小
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          // boxWidth > pointX 说明鼠标左边放不下提示框
          if (boxWidth > pointX) {
            x = 5;
          } else { // 左边放的下
            x = pointX - boxWidth;
          }
          // boxHeight > pointY 说明鼠标上边放不下提示框
          if (boxHeight > pointY) {
            y = 5;
          } else { // 上边放得下
            y = pointY - boxHeight;
          }
          return [x, y];
        
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        min: 0,
        axisLabel: {
          interval: xIntervalFlag,
          rotate: rotateDeg,
          textStyle: {
            color: "#456EAD",
            fontSize: 12
          },
          align: "center",
          formatter: function (val) {
            var strs = val.split(''); // 字符串数组
            var str = ''
            for (var i = 0, s; s = strs[i++];) { // 遍历字符串数组
              str += s;
              if (!(i % 6)) str += '\n'; // 按需要求余
            }
            return str
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#2E4973"
          }
        },
        data: xAxisTile,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        name: yAxisUnit,
        nameTextStyle: {
          fontSize: 13,
          color: "#8BABE7"
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#2E4973"
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: "rgba(242, 246, 250,0.08)"
          }
        },
        axisLabel: {
          formatter:function(value,index){
            if(value/1000>=1&&value/10000<1){
                return (value/1000).toFixed(1) +'k';
            }else if(value/10000>=1&&value/1000000<1){
                return (value/10000).toFixed(1) +'w';
            }else if(value/1000000>=1){
                return (value/1000000).toFixed(1) +'m';
            }else if((value/1000<=-1&&value/10000>-1)){
                return (value/1000).toFixed(1) +'k';
            }else if(value/10000<=-1&&value/1000000>-1){
                return (value/10000).toFixed(1) +'w';
            }else if(value/1000000<=-1){
                return (value/1000000).toFixed(1) +'m';
            }else{
                return value;
            }
        },
          textStyle: {
            color: "#456EAD",
            fontSize: 12
          }
        }
      },
      series: [{
        name: 'A',
        type: 'line',
        symbol: symbolControl,
        smooth: true,
        data: yAxisData,
        laebel:{
          rich: {}
        },
        fontSize:13,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: "rgba(21, 252, 113, 1)" // 0% 处的颜色
            }, {
              offset: 0.5,
              color: "rgba(22, 252, 116, 0.7)" // 50% 处的颜色
            }, {
              offset: 1,
              color: "rgba(22, 252, 116, 0)" // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }]
    };
    return option;
  },
  // ====页面跳转至设备设置====
  turnToDeviceInstall() {
    let deviceName = this.data.deviceInfo.clientDisplayName || '';
    let groupName = this.data.deviceGroupVO && this.data.deviceGroupVO.groupName || '默认区域';
    let groupId = this.data.deviceGroupVO && this.data.deviceGroupVO.id || '';
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall?selectFlag=false&deviceName=' + deviceName + '&deviceId=' + this.data.deviceId + '&groupName=' +  groupName + '&groupId=' + groupId
    })
  },
  turnToDatePicker({currentTarget}) {
    wx.navigateTo({
      url: '/pages/datePicker/datePicker?startDateStr=' + this.data.startDateStr + '&endDateStr=' + this.data.endDateStr
    })
  },
  selectThFlag(e) {
    this.setData({
      thflag: e.target.dataset.thflag
    })
  },

  // ====获取历史信息====
  getHistoryData() {
    let that = this;
    let startDateStrPro = this.data.startDateStr;
    let endDateStrPro = this.data.endDateStr;
    let year = new Date().getFullYear().toString();
    if (this.data.startDateStr.length === 5) {
      startDateStrPro = year + '.' +  startDateStrPro;
      endDateStrPro = year + '.' + endDateStrPro;
    }
    return new Promise(function (resolve, reject) {
      post(urlData.iotDeviceHistory, { // 表格历史数据信息请求
        companyId: wx.getStorageSync('CID'),
        deviceId: that.data.deviceId,
        dateNum: that.data.dateNum,
        dateType: that.data.dateType,
        startDateStr: startDateStrPro.replace(/[.]/g, '-'),
        endDateStr: endDateStrPro.replace(/[.]/g, '-'),
        identifier: that.data.identifier
      }, wx.getStorageSync('TOKEN')).then(response => {
        let res = response.data
        if (res.respCode === 0) {
          that.setData({ // 清空数据
            historyList: []
          })
          if (res.obj.historyList.length > 0) {
            that.setData({
              isHasHistory: true,
              historyList: res.obj.historyList,
            })
          }else{
            if(!that.data.isFirst){
              that.setData({
                isHasHistory: false,
              })
            }
          }
          if (res.obj.historyList.length === 1) { // 控制折线图是否圆点显示
            symbolControl = 'circle';
          } else {
            symbolControl = 'none';
          }
        }
        resolve();
      })
    })
  },
  // ====获取设备信息====
  getdeviceData() {
    let that = this;
    return new Promise(function (resolve, reject) {
      post(urlData.iotDeviceGetDetail, { // 设备信息请求
        "companyId": wx.getStorageSync('CID'),
        "deviceId": that.data.deviceId
      }, wx.getStorageSync('TOKEN')).then(response => {
        let res = response.data
        if (res.respCode === 0) {
          //propertyValue 保留小数点后1位
          if (String(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue).indexOf('.') != -1) {
            res.obj.deviceVO.devicePropertyDTOList[0].propertyValue = String(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue).split('.')[0] + '.' + (String(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue).split('.')[1]).substring(0, 1);
            if (res.obj.deviceVO.devicePropertyDTOList[0].propertyValue == parseInt(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue)) {		//比如19.0要写成19
              res.obj.deviceVO.devicePropertyDTOList[0].propertyValue = parseInt(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue)
            }
          }
          let valueLastTimePro = res.obj.deviceVO.devicePropertyDTOList[0].valueLastTime; // 更新时间
          that.setData({
            deviceInfo: res.obj.deviceVO,
            deviceGroupVO: res.obj.deviceGroupVO,
            valueLastTime: valueLastTimePro ? updateTime(valueLastTimePro) : null,
            identifier: res.obj.deviceVO.devicePropertyDTOList[0].identifier,
            specsEnumList: res.obj.deviceVO.devicePropertyDTOList[0].specsEnumList || []
          })
          if (that.data.specsEnumList.length > 0) {
            for(let it of that.data.specsEnumList) {
              if (it.key === res.obj.deviceVO.devicePropertyDTOList[0].propertyValue) {
                that.setData({ 
                  lsxKeyValue: (it.keyValue && it.keyValue.replace('风', '')) || ''
                })
              }
            }
          }
          if (res.obj.deviceVO.devicePropertyDTOList[0].dataType === 'bool' || res.obj.deviceVO.devicePropertyDTOList[0].dataType === 'enum') {
            that.setData({
              numValueOyLsxFlag: false
            })
          } else {
            that.setData({
              numValueOyLsxFlag: true
            })
          }
          resolve();
        }
      })
    })
  },
  // ====生命周期函数====
  onLoad: function (option) { // 权限
    let _this = this, mark = ["iot:device:edit:group","iot:device:edit:name"];
    ishasPower(mark,function(result){
      if(result[0]||result[1]){
        _this.setData({
          power_set:true
        })
      }
    })

    let isOnline = option.isOnline === 'true' ? true : false;
    this.setData({
      deviceId: option.id,
      proLength: Number(option.proLength),
      isOnline: isOnline,
      isIPX: app.globalData.isIx
    })
    this.getdeviceData().then(res => { 
      this.getHistoryData().then(() => {
        if (this.data.numValueOyLsxFlag) { // 数据型才执行以下操作
          let yData = [];
          let xTitle = [];
          for (let item of this.data.historyList) {
            yData.push((item.value).toFixed(2))
            let timeStr = formatTime(new Date(item.timestamp));
            let tStr1, tStr2;
            tStr1 = timeStr.substr(5, 5);
            tStr1 = tStr1.replace('/', '.');
            tStr2 = timeStr.substr(11, 5);
            xTitle.push( ' ' + tStr1 + ' ' + tStr2);
          }
          yAxisData = yData;
          xAxisTile = xTitle;
          yAxisUnit = this.data.deviceInfo.devicePropertyDTOList[0].specsNumber && this.data.deviceInfo.devicePropertyDTOList[0].specsNumber.unit ? '单位：' + this.data.deviceInfo.devicePropertyDTOList[0].specsNumber.unit : '单位：无'; // 折线图单位
          this.echartsComponnet1 = this.selectComponent('#mychart-dom-line');
          this.init_echarts(); //初始化图表 
          this.setData({ // 此处经历第一次进入以后,设置isFirst为false
            isFirst: false
          })
          if (this.data.historyList.length === 0) { // 没有历史数据
            this.setData({
              isHasHistory: false
            })
          }else{
            this.setData({
              isHasHistory: true
            })
          }
        } else {
          this.setData({ // 此处经历第一次进入以后,设置isFirst为false
            isFirst: false
          })
          if (this.data.historyList.length === 0) { // 没有历史数据
            this.setData({
              isHasHistory: false
            })
          }else{
            this.setData({
              isHasHistory: true
            })
          }
          for (let item of this.data.historyList) {
            let timeStr1 = ifDate(new Date(item.timestamp));
            let timeStr2 = formatTime(new Date(item.timestamp)).substr(11,5);
            item.timestamp = timeStr1 + " " + timeStr2;

            if (this.data.currentIndex === 0) { // 一天时显示时分，其他类型无需显示时分
              item.timestamp = timeStr1 + " " + timeStr2;
            } else {
              item.timestamp = timeStr1
            }
            item.timestamp = item.timestamp.replace(/[/]/g, '.');

            for (let it of this.data.specsEnumList) {
              if (Number(it.key) === item.value) {
                item.value = (it.keyValue && it.keyValue.replace('风', '')) || '';
              }
            }
          }
          this.setData({
            historyList:this.data.historyList
          })
        }
      });
    });
  },
  onShow() {
    if (this.data.dateType === 2) { // 只有进入自定义选择日期以后才执行以下函数
      this.setData({
        currentIndex: 3
      })
      this.getHistoryData().then(() => {
        if (this.data.numValueOyLsxFlag) {
          let yData = [];
          let xTitle = [];
          for (let item of this.data.historyList) {
            yData.push((item.value).toFixed(2))
            let timeStr = formatTime(new Date(item.timestamp));
            let tStr1, tStr2;
            tStr1 = timeStr.substr(5, 5);
            tStr1 = tStr1.replace('/', '.');
            tStr2 = timeStr.substr(11, 5);
            xTitle.push( ' ' + tStr1 + ' ' + tStr2);
          }
          yAxisData = yData;
          xAxisTile = xTitle;
          Chart.setOption(this.getOption()); //重新渲染图表 
        } else {
          for (let item of this.data.historyList) {
            let timeStr1 = ifDate(new Date(item.timestamp));
            let timeStr2 = formatTime(new Date(item.timestamp)).substr(11,5);
            item.timestamp = timeStr1 + " " + timeStr2;

            if (this.data.currentIndex === 0) { // 一天时显示时分，其他类型无需显示时分
              item.timestamp = timeStr1 + " " + timeStr2;
            } else {
              item.timestamp = timeStr1
            }
            item.timestamp = item.timestamp.replace(/[/]/g, '.');

            for (let it of this.data.specsEnumList) {
              if (Number(it.key) === item.value) {
                item.value = (it.keyValue && it.keyValue.replace('风', '')) || '';
              }
            }
          }
          
          this.setData({
            historyList:this.data.historyList,
            isHasHistory:this.data.historyList.length==0?false:true
          })
        }
      });
    } else {
      if (this.data.dateNum === 1) {
        this.setData({
          currentIndex: 0
        })
      } else if (this.data.dateNum === 7) {
        this.setData({
          currentIndex: 1
        })
      } else if (this.data.dateNum === 30) {
        this.setData({
          currentIndex: 2
        })
      }
    }
  }
});