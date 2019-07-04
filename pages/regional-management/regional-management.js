// pages/regional-management/regional-management.js
import { post, urlData, throttle, ishasPower, checkBt } from '../../utils/util'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 
    isIPX: false,
    // 管理员时为true
    ownAdmin: false,
    // 添加区域弹框
    addRegionModal: false,
    regionalName: '',
    // 弹框的按钮以及样式
    actions: [
      {
        name: '取消',
        color: '#395787',
      },
      {
        name: '确定',
        color: '#5689D7'
      },
    ],
    // 区域列表
    regionalList: null,
    power: {
      addRegional: false
    }
  },
  navigateTo: throttle(({ currentTarget }) => {
    wx.navigateTo({
      url: currentTarget.dataset.url
    })
  }),
  // 弹框的按钮操作
  handleRegionalModal: throttle(function ({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'addRegionModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        this.setData({
          regionalName: ''
        });
        break;
      case 1: // 确认 添加区域
        // 此处需要逻辑处理
        if (!this.data.regionalName.trim()) {
          wx.showToast({
            title: '请输入区域名称',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          return false;
        };
        if (!checkBt(this.data.regionalName, 20)) {
          wx.showToast({
            title: '区域名称最多20个字',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          return false;
        }

        this.addRegional()
          .then(() => {
            this.closeModal({ currentTarget });
            this.setData({
              regionalName: ''
            });
          })
        break;
      default:
        break;
    }
  }),
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
  changeRegionalName({ detail }) {
    this.setData({
      regionalName: detail.value
    })
  },
  getRegionalList() {
    // console.log(wx.getStorageSync('CID'));
    post(urlData.iotDeviceGroupListCount, {
      companyId: wx.getStorageSync('CID')
    }, wx.getStorageSync('TOKEN'))
      .then((response) => {
        let res = response.data;
        if (res.respCode === 0) {
          wx.hideLoading();
          this.setData({
            regionalList: res.obj
          })
        }
      })
  },
  addRegional() {
    return new Promise((resolve, reject) => {
      // if (!this.data.regionalName.trim()) {
      //   wx.showToast({
      //     title: '请输入区域名称',
      //     icon: 'none',
      //     duration: 3000
      //   });
      //   return false;
      // }
      post(urlData.iotDeviceGroupAdd, {
        companyId: wx.getStorageSync('CID'),
        groupName: this.data.regionalName.trim()
      }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          if (res.respCode === 0) {
            resolve();
            wx.navigateTo({
              url: `../regional-detail/regional-detail?regionalId=${res.obj.id}&fn=add&regionalName=${res.obj.groupName}&devicesNum=${0}`
            })
            return true;
          }
          if (res.respCode === 300) { // 区域重名提示
            wx.showToast({
              title: res.respDesc,
              icon: 'none',
              duration: 3000,
              mask: true
            });
          }
        })
    })

  },
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
    this.getRegionalList();
    ishasPower(['iot:devicegroup:add'], (p) => {
      this.setData({
        power: {
          addRegional: p[0]
        }
      })
    })
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