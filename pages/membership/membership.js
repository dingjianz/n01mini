// pages/membership/membership.js
import { post, urlData, throttle, ishasPower } from '../../utils/util.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // iphoneX
    isIPX: false,
    memberList: [],
    // 权限
    power: {
      // 拥有添加成员权限
      ownedAddMember: false,
      // 查看详情全选
      canDetaile: false
    }
  },

  navigateTo: throttle(function ({ currentTarget }) {
    if (currentTarget.dataset.ownFlag !== 1 && this.data.power.canDetaile) {
      wx.navigateTo({
        url: currentTarget.dataset.url
      })
    }
  }),

  getMemberList() {
    let companyId = wx.getStorageSync('CID');
    let accessToken = wx.getStorageSync('TOKEN');
    post(urlData.iotCompanyUserRefList, {
      companyId
    }, accessToken)
      .then((response) => {
        let res = response.data;
        if (res.respCode === 0) {
          wx.hideLoading();
          this.setData({
            memberList: res.obj.list
          });
        }
      })
  },

  // getUserPower() {
  //   let power = ['iot:companyuser:add']

  //   this.setData({
  //     ownedAdmin: true
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isIPX: app.globalData.isIx
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
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    ishasPower(['iot:companyuser:add', 'iot:companyuser:editrole', 'iot:companyuser:del'], (p) => {
      this.setData({
        power: {
          ownedAddMember: p[0],
          canDetaile: p[1] || p[2]
        }
      })
    })


    this.getMemberList();
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