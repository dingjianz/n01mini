// pages/videoArea/videoArea.js
import { post, urlData } from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectedId: 9366,
        deviceId: '',
        arealist: [
            {
                id: 1408,
                groupName: '1生产示范基地'
            }, {
                id: 1740,
                groupName: '2生产示范基地'
            }, {
                id: 9366,
                groupName: '3生产示范基地'
            }, {
                id: 8275,
                groupName: '4生产示范基地'
            }, {
                id: 381,
                groupName: '5生产示范基地'
            }
        ]
    },
    getAreaList() {//获取所有区域列表
        let _this = this;
        post(urlData.iotDeviceGroupList, {
            "companyId": wx.getStorageSync('CID')
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode == 0) {
                _this.setData({
                    arealist: resp.data.obj.groupList
                });
            }
        });
    },
    changeArea(e) {//绑定区域
        if (this.data.selectedId != e.currentTarget.dataset.areaid) {
            let _this = this;
            post(urlData.iotDeviceEditGroup, {
                "companyId": wx.getStorageSync('CID'),
                "deviceGroupId": this.data.selectedId,
                "deviceId": this.data.deviceId
            }, wx.getStorageSync('TOKEN')).then(function (resp) {
                if (resp.data.respCode === 0) {
                    _this.setData({
                        selectedId: e.target.dataset.areaid
                    });

                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];
                    prevPage.setData({
                        originTit: '切换了区域,要改一下区域id和区域名称'
                    });
                    wx.navigateBack();
                }
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deviceId: options.deviceId
        });
        this.getAreaList();
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