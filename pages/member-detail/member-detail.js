// pages/member-detail/member-detail.js
import {post, urlData} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    delRoleModal: {
      title: '13735479486',
      visible: false,
      actions: [
        {
          name: '我再想想',
          color: '#395787'
        },
        {
          name: '确定删除',
          color: '#C23634'
        }
      ],
      tip: '删除后，该成员将失去在团队中的所有 权限。'
    },
    role: '管理员',
    userId: undefined,
    self: false,
    params: {}
  },

  // 删除成员modal的按钮操作
  handleDelRoleBtn({ detail, currentTarget }) {
    currentTarget.dataset.modal = 'delRoleModal.visible'
    switch (detail.index) {
      case 0:
        this.closeModal({ currentTarget });
        break;
      case 1:
        post(urlData.iotCompanyUserRefRemove, {
          companyId: wx.getStorageSync('CID'),
          userId: this.data.params.userId
        }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          if(res.respCode === 0){
            wx.navigateBack({
              delta: 1
            });
            this.closeModal({ currentTarget });
          }
        })
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

  // 跳转页面
  navigateTo({ currentTarget }) {
    wx.navigateTo({
      url: `${currentTarget.dataset.url}`
    });
  },
  
  getMemberInfo(userId){
    // console.log(userId);
    let companyId = wx.getStorageSync('CID');
    let accessToken = wx.getStorageSync('TOKEN');
    let userInfo = wx.getStorageSync('COMPANYINFO').userCompanyVO;
    // console.log(userInfo);

    post(urlData.iotCompanyUserRefGet, {
      userId,
      companyId
    }, accessToken)
    .then((response) => {
      let res = response.data;
      if(res.respCode === 0){
        // console.log(res);
        this.setData({
          ['delRoleModal.title']: res.obj.userVO.phone,
          role: res.obj.roleVO.roleName,
          self: res.obj.userVO.phone === userInfo.userVO.phone,
          userId: res.obj.userVO.id
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      params: options
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
    this.getMemberInfo(this.data.params.userId);
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