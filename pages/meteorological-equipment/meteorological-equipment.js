// pages/meteorological-equipment/meteorological-equipment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionType:'',    // 开关弹窗的动作行为
    hasSwitchType:null,    //存放“开关”弹出弹窗时保存的开关类型
    hasSwitchIndex:0,     //存放“开关”弹出弹窗时保存的开关index
    hasSwitchId:null,       //存放点击的开关的id值
    isVisibleSwitch: false // 是否显示开关确认弹窗
  },

  //-------------------开关方法 start------------------------
  //点击开关，打开确认弹窗
  openSwitchToast(e){
    this.setData({
      isVisibleSwitch:true,
      actionType:e.detail.name,
      hasSwitchType: e.detail.type,
      hasSwitchIndex:e.detail.index,
      hasSwitchId: e.currentTarget.dataset.domid
    })
  },
  handleBtnOk(e) {
    const _this = this;
    this.setData({
      isVisibleSwitch: false,
    })

    let onoffComp = this.selectComponent('#' + _this.data.hasSwitchId);
    onoffComp.changeSwitch(_this.data.hasSwitchIndex)
  },
  //取消按钮
  handleBtnCancel(e) {
    this.setData({
      isVisibleSwitch: false,
    })
  },

  //-------------------开关方法 end------------------------

  turnToDeviceInstall() {
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall'
    })
  },
  turnToDeviceDetail() {
    wx.navigateTo({
      url: '/pages/deviceDetail/deviceDetail?close=true'
    })
  },
  turnToRain() {
    wx.navigateTo({
      url: '/pages/rainfall/rainfall'
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