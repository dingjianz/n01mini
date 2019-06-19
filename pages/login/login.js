import { post, urlData, getCompany} from '../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    vcode: '',
    baseCount: 60,
    canClick1: false,   //是否可点击获取验证码
    canClick2: false    //是否可点击 登录
  },
  //监听手机号输入
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
    if (/^1\d{10}$/.test(this.data.phone)) {
      this.setData({
        canClick1: true
      })
    } else {
      this.setData({
        canClick1: false
      })
    }
    if (this.data.canClick1 && this.data.vcode !== '') {
      this.setData({
        canClick2: true,
      })
    } else {
      this.setData({
        canClick2: false
      })
    }
  },
  //监听验证码输入
  vCode(e) {
    this.setData({
      vcode: e.detail.value
    })
    if (this.data.phone !== '' && this.data.vcode.length === 4) {
      this.setData({
        canClick2: true,
      })
    } else {
      this.setData({
        canClick2: false
      })
    }
  },
  // 获取验证码
  getCode() {
    if (!this.data.canClick1) return
    let _this = this;
    let data = {
      "phone": this.data.phone,
      "signNameType": 0,
      "type": 1
    }
    post(urlData.baseSmsSendSmsVcode, data, wx.getStorageSync('TOKEN')).then(function (resp) {
      if (resp.data.respCode === 0) {
        _this.countDown()
      }
      wx.showToast({
        title: resp.data.respDesc,
        icon: 'none'
      })
    })
  },
  // 登录操作
  formSubmit(e) {
    if (!this.data.canClick2) return
    wx.showLoading({
      title: '登录中...',
    })
    
    let _this = this;

    let loginPost = post(urlData.iotLoginPhone, e.detail.value);
    loginPost.then(function (resp) {
        if (resp.data.respCode === 0) {
            wx.setStorageSync('TOKEN', resp.data.obj.accessToken);
            wx.setStorageSync('USERPHONE', resp.data.obj.user.phone);
            wx.switchTab({
            url: '/pages/index/index',
            })
        } else {
            wx.showToast({
            title: resp.data.respDesc,
            icon: 'none'
            })
        }
        return loginPost;
    }).then(function (resp){
        _this.getTotalCompany(resp.data.obj.accessToken);
    });
  },
  getTotalCompany(token){//获取企业列表
      post(urlData.iotCompanyList, {}, token).then(function (resp) {
          if (resp.data.respCode == 0 && resp.data.obj.totalCount>=1) {
              getCompany(resp.data.obj.list[0].id);
          }
      });
  },
  // 验证码倒计时
  countDown() {
    let _this = this;
    let baseCount = this.data.baseCount
    let down = setInterval(function () {
      if (baseCount === 1) {
        clearInterval(down)
        _this.setData({
          canClick1: true,
          baseCount: 60
        })
        return
      }
      baseCount--
      _this.setData({
        baseCount: baseCount,
        canClick1: false
      })
    }, 1000)
  }
})