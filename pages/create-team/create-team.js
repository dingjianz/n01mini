// pages/create-team/create-team.js
import { post, urlData } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sucModal: {
      visible: false,
      animationData: null,
      inputtxt:''
    }
  },
    inputedit(e){
        let datatxt = e.currentTarget.dataset.txt;
        let detail = e.detail.value;
        this.setData({
            inputtxt: detail
        });
    },
  // 创建团队
  handleCreated() {
      let _this = this;
      post(urlData.iotCompanyAdd, {
          "companyName": this.data.inputtxt
      }, wx.getStorageSync('TOKEN')).then(function (resp) {
          if (resp.data.respCode === 0) {
            console.log('创建成功');
          }
      });

    //创建动画
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-in",
    });

    this.setData({
      ['sucModal.visible']: true
    });
    animation.top('0%').step();

    // 一定要返回动画实例否则没有效果
    this.setData({
      ['sucModal.animationData']: animation.export(),
    })
  },
  // 跳转页面
  redirectTo({ currentTarget }) {
    wx.redirectTo({
      url: currentTarget.dataset.url
    })
  },
  // go home
  goHome({ currentTarget }) {
    wx.switchTab({
      url: currentTarget.dataset.url
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