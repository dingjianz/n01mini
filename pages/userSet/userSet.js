// pages/userSet/userSet.js
import { post, urlData, ishasPower as hasPower, throttle } from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userphone: '',
        teamNum: 1
    },
    // 退出登录
    logout() {
        post(urlData.iotLoginLogout, {}, wx.getStorageSync('TOKEN'))
            .then(function (resp) {
                if (resp.data.respCode === 0) {
                    // console.log('退出登录');
                    // 清除所有缓存
                    wx.clearStorage();
                    // 转至登录页
                    wx.reLaunch({
                        url: '/pages/guide/guide',
                    })
                }
            });
    },
    navigateTo: throttle(({ currentTarget }) => {
        wx.navigateTo({
            url: currentTarget.dataset.url
        })
    }),
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            // 获取用户的手机号
            userphone: wx.getStorageSync('USERPHONE')
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // let _this = this;
        // 获取公司列表--获取总个数
        post(urlData.iotCompanyList, {}, wx.getStorageSync('TOKEN'))
            .then((resp) => {
                if (resp.data.respCode === 0) {
                    this.setData({
                        teamNum: resp.data.obj.totalCount
                    });
                }
            });
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