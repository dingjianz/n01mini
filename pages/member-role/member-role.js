// pages/member-role/member-role.js
import { post, urlData } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: [
      {
        id: 1,
        name: '管理员',
        roleDesc: ''
      },
      // {
      //   id: 2,
      //   name: '管控员'
      // },
      // {
      //   id: 3,
      //   name: '观察员'
      // }
    ],
    current: '管理员',

    position: 'right',

    roleModal: {
      visible: false
    }
  },
  handleRoleChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
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
            ['roleModal.role']: res.obj.list.map((item) => {
              return {
                id: item.id,
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