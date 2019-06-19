// pages/regional-management/regional-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 管理员时为true
    isAdmin: true,
    // 区域管理
    addRegionModal: false,
    // 弹框的按钮以及样式
    actions: [
      {
        name: '取消',
        color: '#395787',
      },
      {
        name: '确定',
        color: '#456EAD'
      },
    ]
  },
  // 弹框的按钮操作
  handleRegionalModal({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'addRegionModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        this.closeModal({ currentTarget });
        break;
      default:
        break;
    }
  },
  // 打开弹框-可抽至于公共方法 *
  openModal({ currentTarget }) {
    this.setData({
      [currentTarget.dataset.modal]: true
    })
  },
  // 关闭弹框-可抽至于公共方法 *
  closeModal({ currentTarget }) {
    this.setData({
      [currentTarget.dataset.modal]: false
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