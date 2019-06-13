import * as echarts from '../../components/ec-canvas/echarts';

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
      show: false,
      // show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        interval:'auto',
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
    currentIndex: 0
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
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
    thflag: true // 土壤湿温度设备详情时，折线表先显示温度
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
  },
  turnToDeviceInstall() {
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall'
    })
  },
  selectThFlag(e) {
    this.setData({
      thflag: e.target.dataset.thflag
    })
  },
  onReady() {}
});