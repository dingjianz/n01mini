// pages/userSet/userSet.js
import { post, urlData, ishasPower as hasPower} from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userphone:'',
        teamNum:1
    },
    logout(){//退出登录
        post(urlData.iotLoginLogout, {}, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                console.log('退出登录');
                wx.clearStorage();
                wx.reLaunch({
                    url: '/pages/login/login',
                })
            }
        });
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
        this.setData({
            userphone: wx.getStorageSync('USERPHONE')
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let _this = this;
        post(urlData.iotCompanyList, {}, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.setData({
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