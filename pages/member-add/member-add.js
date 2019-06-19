// pages/member-add/member-add.js
import { post, urlData, checkPhone } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: undefined,
    role: {
      id: undefined,
      name: undefined
    }
  },

  getUserPhone({ detail }) {
    this.setData({
      userPhone: detail.value
    })
  },

  joinMember() {
    // console.log(this.data.userPhone);
    if (!(this.data.userPhone && this.data.userPhone.trim())) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 3000
      });
      return false;
    }
    if (!checkPhone(this.data.userPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 3000
      });
      return false;
    }
    if (!this.data.role.id) {
      wx.showToast({
        title: '请选择成员角色',
        icon: 'none',
        duration: 3000
      });
      return false;
    }
    post(urlData.iotCompanyUserRefJoin, {
      companyId: wx.getStorageSync('CID'),
      phone: this.data.userPhone,
      roleId: this.data.role.id
    }, wx.getStorageSync('TOKEN'))
      .then((response) => {
        let res = response.data;
        if(res.respCode === 0){
          // return wx.showToast({
          //   icon: 'none',
          //   title: '添加成功',
          //   duration: 3000
          // })
          return wx.navigateBack({
            delta: 1
          });
        }
        wx.showToast({
          icon: 'none',
          title: res.respDesc,
          duration: 3000
        })

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