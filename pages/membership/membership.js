// pages/membership/membership.js
import { post, urlData } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownedAdmin: true,
    memberList: []
  },

  getMemberList() {
    let companyId = wx.getStorageSync('CID');
    let accessToken = wx.getStorageSync('TOKEN');
    post(urlData.iotCompanyUserRefList, {
      companyId
    }, accessToken)
      .then((response) => {
        let res = response.data;
        if(res.respCode === 0){
          this.setData({
            memberList: res.obj.list
          });
        }
      })
  },

  getUserInfo(){
    let userInfo = wx.getStorageSync('COMPANYINFO').userCompanyVO;
    this.setData({
      ownedAdmin: userInfo.roleVO.roleIdentity === 'manage'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getMemberList();
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