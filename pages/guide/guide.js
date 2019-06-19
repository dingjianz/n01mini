// pages/guide/guide.js
import { post, urlData } from '../../utils/util.js'

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        small: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this
        wx.getSystemInfo({//适配小屏幕，低分辨率
            success(res) {
                console.log(res)
                if (res.screenHeight <= 615) {
                    _this.setData({
                        small: true
                    })
                }
            }
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

    },
    getPhoneNumber: function (e) {//微信手机号授权登录
        var _this = this
        wx.checkSession({
            success: function () {
                if (e.detail.errMsg === 'getPhoneNumber:ok') {
                    wx.showLoading({
                        title: '登录中...',
                        icon: 'none'
                    })
                    let data = {
                        "code": wx.getStorageSync('CODE'),
                        "encryptedData": e.detail.encryptedData,
                        "iv": e.detail.iv
                    }
                    console.log(wx.getStorageSync('CODE'))
                    _this.postLogin(data)
                }
            },
            fail: function () {
                wx.login({
                    success: function (res) {
                        wx.setStorageSync('CODE', res.code)
                        if (e.detail.errMsg === 'getPhoneNumber:ok') {
                            let data = {
                                "code": res.code,
                                "encryptedData": e.detail.encryptedData,
                                "iv": e.detail.iv
                            }
                            _this.postLogin(data)
                        }
                    }
                })
            }
        })
    },
    postLogin(data) {//调取微信授权登录接口
        post(urlData.accredit, data).then(function (resp) {
            if (resp.data.respCode === 0) {
                wx.hideLoading()
                wx.setStorageSync('TOKEN', resp.data.obj.accessToken);//缓存token
                wx.setStorageSync('USERPHONE', resp.data.obj.phone);//缓存当前用户手机号
                wx.switchTab({//跳转到首页
                    url: '/pages/index/index'
                })
            } else {
                wx.showToast({
                    title: resp.data.respDesc,
                    icon: 'none'
                })
            }
        })
    },
    login: function () {//跳转登录页
      wx.navigateTo({
            url: '/pages/login/login'
        });
    }
})