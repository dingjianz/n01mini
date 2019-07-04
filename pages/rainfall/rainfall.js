import * as echarts from '../../components/ec-canvas/echarts';
import { post, urlData, formatTime, ifDate } from '../../utils/util.js'
const app = getApp();

let xAxisTile = []; // x轴类目名称列表
let yAxisUnit = "单位：mm"; // y轴单位
let yAxisData = []; // 折线图数据 
let Chart = null;
let rotateDeg = 0; // X轴文字倾斜程度
let xIntervalFlag = 'auto'; // X轴interval
let symbolControl = 'none'; // 折线图 默认不显示点


Page({
  /**
   * 页面的初始数据
   */
  data: {
     // iphoneX
    isIPX: false,
    ec: {
      lazyLoad: true // 延迟加载
    },
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
    }],
    deviceId: null,
    name: '', // 属性名
    identifier: '', // 属性标识符
    propertyValue: '', // 属性值
    propertyUnit: '', // 属性单位
    valueLastTime: '', // 更新时间
    isOnline: true, // 默认在线 true， 离线为false
    currentIndex: 1, // 默认选择7天
    dateNum: 7, // dateType=1固定天数时的具体天数，取值：1,7,30
    dateType: 1, // 时间类型：2-自定义，1-固定天数 
    startDateStr: '', // dateType=2 自定义时的开始日期，格式：yyyy-MM-dd
    endDateStr: '', // dateType=2 自定义时的结束日期，格式：yyyy-MM-dd
    historyList: [], // 折线图存储数据 
    specsEnumList: [], // 枚举集合
    isHasHistory: true, //是否有历史记录
    numValueOyLsxFlag: true, // 判断是数据型还是离散型， true是数据型，false是离散型
    deviceProperty: null,
    lsxKeyValue: null,
    isFirst: true // 为了解决 第一次进入无数据时，echart不能初始化
  },
  conveyCurrentIndex({
    currentTarget
  }) {
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
          xTitle.push(' ' + tStr1 + ' ' + tStr2);
        }
        yAxisData = yData;
        xAxisTile = xTitle;
        Chart.setOption(this.getOption()); //重新渲染图表 
      } else {
        if (this.data.historyList.length > 0) {
          for (let item of this.data.historyList) {
            let timeStr1 = ifDate(new Date(item.timestamp));
            let timeStr2 = formatTime(new Date(item.timestamp)).substr(11, 5);
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
        } else {

        }
        this.setData({
          historyList: this.data.historyList || []
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
    setTimeout(() => {
      Chart.clear(); // 清除
      Chart.setOption(this.getOption()); //获取新数据
    }, 0)
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
        axisPointer: {
          lineStyle: {
            color: '#155AC5'
          },
          z: 999999
        },
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
          formatter: function (value, index) {
            if (value / 1000 >= 1 && value / 10000 < 1) {
              return (value / 1000).toFixed(1) + 'k';
            } else if (value / 10000 >= 1 && value / 1000000 < 1) {
              return (value / 10000).toFixed(1) + 'w';
            } else if (value / 1000000 >= 1) {
              return (value / 1000000).toFixed(1) + 'm';
            } else if ((value / 1000 <= -1 && value / 10000 > -1)) {
              return (value / 1000).toFixed(1) + 'k';
            } else if (value / 10000 <= -1 && value / 1000000 > -1) {
              return (value / 10000).toFixed(1) + 'w';
            } else if (value / 1000000 <= -1) {
              return (value / 1000000).toFixed(1) + 'm';
            } else {
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
        laebel: {
          rich: {}
        },
        fontSize: 13,
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
  turnToDatePicker() {
    wx.navigateTo({
      url: '/pages/datePicker/datePicker?startDateStr=' + this.data.startDateStr + '&endDateStr=' + this.data.endDateStr
    })
  },
  // ====获取历史信息====
  getHistoryData() {
    let that = this;
    let startDateStrPro = this.data.startDateStr;
    let endDateStrPro = this.data.endDateStr;
    let year = new Date().getFullYear().toString();
    if (this.data.startDateStr.length === 5) { // 若格式为05.06 则
      startDateStrPro = year + '.' + startDateStrPro;
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
            historyList: [],
            isHasHistory: false,
          })
          if (res.obj.historyList.length > 0) {
            that.setData({
              isHasHistory: true,
              historyList: res.obj.historyList,
            })
          } else {
            if (!that.data.isFirst) {
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
  getdeviceData() { // 获取设备基本信息
    return new Promise((resolve, reject) => {
      post(urlData.iotDeviceGetDetail, {
        companyId: wx.getStorageSync('CID'),
        deviceId: this.data.deviceId
      }, wx.getStorageSync('TOKEN')).then(response => {
        let res = response.data
        if (res.respCode === 0) {
          let deviceProperty = res.obj.deviceVO.devicePropertyDTOList[this.data.selectIndex]
          this.setData({
            deviceProperty: deviceProperty,
            propertyUnit: (deviceProperty.specsNumber && deviceProperty.specsNumber.unit) || '',
            specsEnumList: deviceProperty.specsEnumList || []
          })
          let isOnline, valueLastTimePro;
          res.obj.deviceVO.deviceState === 'ONLINE' ? isOnline = true : isOnline = false;
          deviceProperty.valueLastTime ? valueLastTimePro = ifDate(new Date(deviceProperty.valueLastTime)) : '';
          //保留一位小数点
          if (String(deviceProperty.propertyValue).indexOf('.') != -1) {
            //保留小数点后1位
            deviceProperty.propertyValue = String(deviceProperty.propertyValue).split('.')[0] + '.' + (String(deviceProperty.propertyValue).split('.')[1]).substring(0, 1);
            if (deviceProperty.propertyValue == parseInt(deviceProperty.propertyValue)) { //比如19.0要写成19
              deviceProperty.propertyValue = parseInt(deviceProperty.propertyValue)
            }
          }
          this.setData({
            name: deviceProperty.name,
            identifier: deviceProperty.identifier,
            propertyValue: deviceProperty.propertyValue,
            isOnline: isOnline,
            valueLastTime: valueLastTimePro || ''
          })
          if (this.data.specsEnumList.length > 0) {
            for (let it of this.data.specsEnumList) {
              if (it.key === deviceProperty.propertyValue) {
                this.setData({
                  lsxKeyValue: (it.keyValue && it.keyValue.replace('风', '')) || ''
                })
              }
            }
          }
          if (deviceProperty.dataType === 'bool' || deviceProperty.dataType === 'enum') {
            this.setData({
              numValueOyLsxFlag: false
            })
          } else {
            this.setData({
              numValueOyLsxFlag: true
            })
          }
          resolve();
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ // 页面标题为当前设备名称
        title: options.title
      }),
      this.setData({
        deviceId: options.deviceId,
        selectIndex: Number(options.index),
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
            xTitle.push(' ' + tStr1 + ' ' + tStr2);
          }
          yAxisData = yData;
          xAxisTile = xTitle;
          yAxisUnit = this.data.deviceProperty.specsNumber && this.data.deviceProperty.specsNumber.unit ? '单位：' + this.data.deviceProperty.specsNumber.unit : '单位：无'; // 折线图单位
          this.echartsComponnet1 = this.selectComponent('#mychart-dom-line');
          this.init_echarts(); //初始化图表 

          this.setData({ // 此处经历第一次进入以后,设置isFirst为false
            isFirst: false
          })
          if (this.data.historyList.length === 0) {
            // 没有历史数据
            this.setData({
              isHasHistory: false
            })
            // return false;
          } else {
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
            let timeStr2 = formatTime(new Date(item.timestamp)).substr(11, 5);

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
            historyList: this.data.historyList
          })
        }

      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
            xTitle.push(' ' + tStr1 + ' ' + tStr2);
          }
          yAxisData = yData;
          xAxisTile = xTitle;
          Chart.setOption(this.getOption()); //重新渲染图表 
        } else {
          for (let item of this.data.historyList) {
            let timeStr1 = ifDate(new Date(item.timestamp));
            let timeStr2 = formatTime(new Date(item.timestamp)).substr(11, 5);

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
            historyList: this.data.historyList,
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})