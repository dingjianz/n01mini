//app.js
App({
  onLaunch: function () {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search('iPhone X') !== -1) {
          _this.globalData.isIx = true
        }
      }
    })
  },
  globalData: {
    isIx: false,    //是否是iphoneX，默认否
  }
})