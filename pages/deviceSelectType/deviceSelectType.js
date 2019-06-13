// pages/deviceSelectType/deviceSelectType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex: 0,
    typeList: [{
      id: 0,
      typeName: '内遮阳'
    },{
      id: 1,
      typeName: '鼓风机'
    },{
      id: 2,
      typeName: '数值控制器'
    },{
      id: 3,
      typeName: '水泵'
    },{
      id: 4,
      typeName: '搅拌机'
    }]
  },
  selectIndex(e) {
    this.setData({
      selectedIndex: e.target.dataset.selectedindex
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