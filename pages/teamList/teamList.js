// pages/teamList/teamList.js
import { post, urlData, getCompany } from '../../utils/util.js'

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // iphoneX
        isIPX: false,
        activeId: 0,
        clist: []
    },
    companySet({ currentTarget }) {//点击进入公司设置
        wx.navigateTo({
            url: `/pages/teamSet/teamSet?cid=${currentTarget.dataset.id}&cname=${currentTarget.dataset.cname}&ownid=${currentTarget.dataset.ownid}`
        });
    },
    changeCompany({ currentTarget }) {
        const index = currentTarget.dataset.index;
        const id = this.data.clist[index].id;
        if (this.data.activeId !== id) {
            if (id === 0) {
                wx.setStorageSync('CID', id);
                wx.setStorageSync('GID', {
                    name: '全部区域',
                    id: -1
                });
                this.setData({
                    activeId: id
                });
                wx.reLaunch({
                    url: '/pages/index/index',
                });
                return true;
            }
            getCompany(id)
                .then((resp) => {
                    if (resp.data.respCode == 0) {
                        wx.setStorageSync('GID', {
                            name: '全部区域',
                            id: -1
                        });
                        this.setData({
                            activeId: id
                        });
                        wx.reLaunch({
                            url: '/pages/index/index',
                        });
                    }
                });
        }
    },
    getTotalCompany() {
        post(urlData.iotCompanyList, {}, wx.getStorageSync('TOKEN'))
            .then((resp) => {
                if (resp.data.respCode === 0) {
                    this.setData({
                        clist: resp.data.obj.list
                    });
                }
            });
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
        this.getTotalCompany();
        this.setData({
            activeId: wx.getStorageSync('CID')
        });
        // console.log(getCurrentPages());
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