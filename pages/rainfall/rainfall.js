import * as echarts from '../../components/ec-canvas/echarts';
import {
  formatTime
} from '../../utils/util'
let xAxisTile = ['12.16 01:00', '12.16 02:30', '12.16 03:25', '12.16 05:40', '12.16 08:10', '12.16 12:40', '12.16 23:00']; // x轴类目名称列表
let yAxisUnit = "单位：mm"; // y轴单位
let yAxisData = [1, 2, 5, 10, 3, 1, 4]; // 折线图数据 
let Chart = null;
let rotateDeg = 0; // X轴文字倾斜程度
let xIntervalFlag = 0; // X轴interval

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ecLine: {
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
    currentIndex: 0
  },
  conveyCurrentIndex(e) {
    this.setData({
      currentIndex: e.target.dataset.currentindex
    })
    if (this.data.currentIndex === 0) { // 1天
      rotateDeg = 0;
      xIntervalFlag = 'auto';
      yAxisData = [1, 2, 5, 10, 3, 1, 4];
      xAxisTile = ['12.16 01:00', '12.16 02:30', '12.16 03:25', '12.16 05:40', '12.16 08:10', '12.16 12:40', '12.16 23:00']
      Chart.setOption(this.getOption());
    } else if (this.data.currentIndex === 1) { // 7天
      rotateDeg = 0;
      xIntervalFlag = 0;
      yAxisData = [30, 35, 40, 20, 10, 30, 100];
      xAxisTile = this.rerurnDays(7);
      Chart.setOption(this.getOption());
    } else if (this.data.currentIndex === 2) { // 30天
      rotateDeg = 0;
      xIntervalFlag = 'auto';
      yAxisData = [30, 35, 40, 20, 10, 30, 100, 30, 35, 40, 20, 10, 30, 100, 30, 35, 40, 20, 10, 30, 100, 30, 35, 40, 20, 10, 30, 100, 52, 12];
      xAxisTile = this.rerurnDays(30);
      Chart.setOption(this.getOption());
    } else { // 自定义
      xAxisTile = []
      Chart.setOption(this.getOption());
    }
  },
  //初始化图表
  init_echarts: function (i) {
    this['echartsComponnet1'].init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption();
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function () {
    Chart.clear(); // 清除
    Chart.setOption(this.getOption()); //获取新数据
  },
  getOption: function () { // 指定图表的配置项和数据
    var option = {
      grid: {
        containLabel: true,
        top: '15%',
        left: '6%',
        right: '10%',
        bottom: '30%'
      },
      color: ['#16BD6C'],
      tooltip: {
        // show: false,
        show: true,
        trigger: 'axis',
        backgroundColor: '#0B337D',
        formatter: '{b0}' + '\n' + '数值 {c0}',
        textStyle: {
          color: '#8BABE7'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
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
          formatter: function (value, index) {
            return value.toFixed(2)
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
        symbol: 'none',
        smooth: true,
        data: yAxisData,
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
  rerurnDays(num) { // 返回当前日期前num天数组 
    var lastMonth = [];
    for (var i = 0; i < num; i++) {
      lastMonth.unshift(new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString().substr(5, new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString().length))
    }
    return lastMonth;
  },
  turnToDatePicker() {
    wx.navigateTo({
      url: '/pages/datePicker/datePicker'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsComponnet1 = this.selectComponent('#rainchart-dom-line');
    this.init_echarts(); //初始化图表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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