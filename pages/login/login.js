import { post, urlData, getCompany, getCompanyList, checkPhone, throttle } from '../../utils/util.js'

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
    canClick2: false,    //是否可点击 登录
    isFocus:false,      //请输入验证码的
  },
  //监听手机号输入
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
    if (/^1\d{10}$/.test(this.data.phone)) {
      this.setData({
        canClick1: true,
      })
    }
    else {
      this.setData({
        canClick1: false
      })
    }
    if (this.data.canClick1 && this.data.vcode !== '') {
      this.setData({
        canClick2: true,
      })
    }
    else {
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
  getCode: throttle(function () {
    if (!this.data.canClick1) return;
    let data = {
      "phone": this.data.phone,
      "signNameType": 0,
      "type": 1
    }
    post(urlData.baseSmsSendSmsVcode, data, wx.getStorageSync('TOKEN'))
      .then((resp) => {
        if (resp.data.respCode === 0) {
          this.setData({
            isFocus:true,
          })
          this.countDown()
        }
        wx.showToast({
          title: resp.data.respDesc,
          icon: 'none'
        })
      })
  }),
  // 登录操作
  formSubmit({ detail }) {
    // console.log(detail);
    if (!detail.value.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 3000
      });
      return false;
    }

    if (!checkPhone(detail.value.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 3000
      });
      return false;
    }

    if (!detail.value.msgCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 3000
      });
      return false;
    }
    if (detail.value.msgCode.length < 4) {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none',
        duration: 3000
      });
      return false;
    }

    // if (!this.data.canClick2) return;

    wx.showLoading({
      title: '登录中...',
    })
    post(urlData.iotLoginPhone, detail.value)
      .then(function ({ data }) {
        if (data.respCode === 0) {
          wx.setStorageSync('TOKEN', data.obj.accessToken);
          wx.setStorageSync('USERPHONE', data.obj.user.phone);
          getCompanyList((res) => {
            if (res.data.respCode === 0) {
              if (res.data.obj.totalCount > 1) {
                getCompany(res.data.obj.list[0].id).then(function (callback) {
                  if (callback.data.respCode === 0) {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  } else {
                    wx.showToast({
                      title: callback.data.respDesc,
                      icon: 'none'
                    })
                  }
                })
              } else {
                //只有个人设备
                wx.setStorageSync('CID', 0);
                wx.hideLoading()
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          });
        };
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