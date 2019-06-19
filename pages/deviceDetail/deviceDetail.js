import { ifDate } from '../../utils/util'
// pages/deviceDetail/deviceDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    axis: [{
        date: '2019-06-18 14:37',
        time: '14:37',
        name: '暂停',
        event: '13735479486'
      },
      {
        date: '2019-06-16 14:37',
        time: '14:37',
        name: '开启',
        event: '13735479486'
      },
      {
        date: '2019-06-14 14:37',
        time: '14:37',
        name: '关闭',
        event: '13735479486'
      },
      {
        date: '2019-05-31 14:37',
        time: '14:37',
        name: '开启',
        event: '13735479486'
      }
    ],
    loadFlag: false, // 底部加载控制器
    zhsbFlag: false // 是否是综合设备入口进入
  },
  turnToDeviceInstall() {
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      zhsbFlag: options.close
    })
    console.log(this.data.zhsbFlag)
    for (let item of this.data.axis) {
      item.date = ifDate(new Date(item.date))
    }
    this.setData({
      axis: this.data.axis
    })
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
    console.log(45454)
    this.setData({
      loadFlag: true
    })
    setTimeout(() => {
      this.setData({
        loadFlag: false
      })
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})