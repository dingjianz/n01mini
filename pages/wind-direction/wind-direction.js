// pages/wind-direction/wind-direction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
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
    axis: [{
      time: '今天 14:37',
      name: '东南'
    },
    {
      time: '前天 14:37',
      name: '东北'
    },
    {
      time: '今天 14:37',
      name: '西北'
    },
    {
      time: '今天 14:37',
      name: '西南'
    }
  ]
  },

  conveyCurrentIndex(e) {
    this.setData({
      currentIndex: e.target.dataset.currentindex
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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