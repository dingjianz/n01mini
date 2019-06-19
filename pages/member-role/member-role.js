// pages/member-role/member-role.js
import { post, urlData } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: [],
    current: undefined,

    position: 'right',

    roleModal: {
      visible: false
    },
    userId: undefined,
  },
  handleRoleChange({ currentTarget }) {
    // console.log(currentTarget);
    if (!this.data.userId) {
      // console.log(pages);
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        role: {
          id: currentTarget.dataset.id,
          name: currentTarget.dataset.name
        }
      })
      wx.navigateBack({
        delta: 1
      });
      return true;
    };
    post(urlData.iotCompanyUserRefEdit, {
      companyId: wx.getStorageSync('CID'),
      roleId: currentTarget.dataset.id,
      userId: this.data.userId
    }, wx.getStorageSync('TOKEN'))
      .then((response) => {
        let res = response.data;
        if (res.respCode === 0) {
          // console.log(res);
          // wx.showToast({
          //   title: '角色修改成功',
          //   icon: 'success',
          //   duration: 3000
          // });
          wx.navigateBack({
            delta: 1
          });
          this.setData({
            current: currentTarget.dataset.name
          });
        }
      })
  },

  getRoleList() {
    let accessToken = wx.getStorageSync('TOKEN');
    post(urlData.iotCompanyRoleList, {}, accessToken)
      .then((response) => {
        let res = response.data;
        if (res.respCode === 0) {
          this.setData({
            role: res.obj.list.map((item) => {
              return {
                id: item.id,
                name: item.roleName,
                roleDesc: item.roleDesc
              }
            }),
            current: this.data.current || res.obj.list[0].roleName,
            ['roleModal.role']: res.obj.list.map((item) => {
              return {
                name: item.roleName,
                roleDesc: item.roleDesc
              }
            })
          })
        }
      })
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
    (options.userId !== undefined)
      && this.setData({
        userId: options.userId
      });
    (options.roleName !== undefined)
      && this.setData({
        current: options.roleName
      })

    this.getRoleList();
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