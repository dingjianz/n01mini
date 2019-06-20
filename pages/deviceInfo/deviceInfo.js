import * as echarts from '../../components/ec-canvas/echarts';
import {
  post,
  urlData,
  updateTime
} from '../../utils/util.js'

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    grid: {
      containLabel: true,
      top: '15%',
      left: '6%',
      right: '10%',
      bottom: '10%'
    },
    color: ['#16BD6C'],
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: '#0B337D',
      formatter: '{b0}' + '\n' + '数值 {c0}',
      // position: function (pos, params, dom, rect, size) {
      //     console.log(params);
      //     // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      //     var obj = { top:'30%'};
      //     if (pos[0] > (size.viewSize[0]/2)){
      //         obj['left'] = pos[0] - size.contentSize[0]+30;
      //     }else{
      //         obj['left'] = pos[0]
      //     }
      //     console.log(obj);
      //     return obj;
      // }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        interval: 'auto',
        textStyle: {
          color: "#456EAD",
          fontSize: 12
        },
        align: "center"
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#2E4973"
        }
      },
      data: ['一', '二', '三', '四', '五', '六', '日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      name: "单位：℃",
      nameTextStyle: {
        fontSize: 14,
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
        textStyle: {
          color: "#456EAD",
          fontSize: 12
        }
      }
    },
    series: [{
      name: 'A',
      type: 'line',
      symbol: 'none',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33],
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
    }],
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    deviceId: '', // 设备id
    proLength: 1, // 为2时代表 温度湿度 
    isOnline: true, // 是否在线
    deviceInfo: {}, // 设备详情信息
    deviceGroupVO: null, // 所在分组信息，个人设备则无此字段 null则显示默认区域
    valueLastTime: '', // 上次数据更新时间
    dateNum: 1, // dateType=1固定天数时的具体天数，取值：1,7,30
    dateType: 1, // 时间类型：2-自定义，1-固定天数 
    startDateStr: '', // dateType=2 自定义时的开始日期，格式：yyyy-MM-dd
    endDateStr: '', // dateType=2 自定义时的结束日期，格式：yyyy-MM-dd
    identifier: '', // 属性标识符
    historyList: [], // 折线图存储数据 
    ec: {
      onInit: initChart
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
    thflag: true, // 土壤湿温度设备详情时，折线表先显示温度
    currentIndex: 0
  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },

  conveyCurrentIndex(e) {
    this.setData({
      currentIndex: e.target.dataset.currentindex
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
    this.getHistoryData();
  },
  // ====页面跳转至设备设置====
  turnToDeviceInstall() {
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall'
    })
  },
  turnToDatePicker({
    currentTarget
  }) {
    this.setData({
      currentIndex: currentTarget.dataset.currentindex
    })
    wx.navigateTo({
      url: '/pages/datePicker/datePicker'
    })
  },
  selectThFlag(e) {
    this.setData({
      thflag: e.target.dataset.thflag
    })
  },
  // ====获取历史信息====
  getHistoryData() {
    // console.log({ // 表格历史数据信息请求
    //   companyId: wx.getStorageSync('CID'),
    //   deviceId: this.data.deviceId,
    //   dateNum: this.data.dateNum,
    //   dateType: this.data.dateType,
    //   startDateStr: this.data.startDateStr,
    //   endDateStr: this.data.endDateStr,
    //   identifier: this.data.identifier
    // })
    post(urlData.iotDeviceHistory, { // 表格历史数据信息请求
      companyId: wx.getStorageSync('CID'),
      deviceId: this.data.deviceId,
      dateNum: this.data.dateNum,
      dateType: this.data.dateType,
      startDateStr: this.data.startDateStr,
      endDateStr: this.data.endDateStr,
      identifier: this.data.identifier
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data
      if (res.respCode === 0) {
        console.log(JSON.stringify(res))
      }
    })
  },
  // ====获取设备信息====
  getdeviceData() {
    let that = this;
    return new Promise(function(resolve, reject) {
      post(urlData.iotDeviceGetDetail, { // 设备信息请求
        "companyId": wx.getStorageSync('CID'),
        "deviceId": that.data.deviceId
      }, wx.getStorageSync('TOKEN')).then(response => {
        let res = response.data
        if (res.respCode === 0) {
          that.setData({
            deviceInfo: res.obj.deviceVO,
            deviceGroupVO: res.obj.deviceGroupVO,
            valueLastTime: updateTime(res.obj.deviceVO.devicePropertyDTOList[0].valueLastTime),
            identifier: res.obj.deviceVO.devicePropertyDTOList[0].identifier
          })
          resolve();
        }
      })
    })
  },
  // ====生命周期函数====
  onLoad: function (option) {
    // console.log(JSON.stringify(option))
    this.setData({
      deviceId: option.id,
      proLength: option.proLength,
      isOnline: option.isOnline
    })
    this.getdeviceData().then(res => {
      this.getHistoryData(); // 设备信息获取
    }); 
  },
  onShow() {
    if (this.data.dateType === 2) { // 只有进入自定义选择日期以后才执行以下函数
      this.getHistoryData();
    }
  }
});