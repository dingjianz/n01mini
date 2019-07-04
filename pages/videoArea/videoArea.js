// pages/videoArea/videoArea.js
import { post, urlData } from '../../utils/util.js';
const app =  getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectedId: null,
        deviceId: '',
        arealist: [],
        isIx:app.globalData.isIx
    },
    getAreaList() {//获取所有区域列表
        let _this = this;
        post(urlData.iotDeviceGroupListCount, {
            "companyId": wx.getStorageSync('CID')
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode == 0) {
                console.log(JSON.stringify(resp.data.obj))
                _this.setData({
                    arealist: resp.data.obj
                });
            }
        });
    },
    changeArea(e) {//绑定区域
        if (this.data.selectedId != e.currentTarget.dataset.areaid) {
            let _this = this;
            post(urlData.iotCameraEditGroup, {
                "companyId": wx.getStorageSync('CID'),
                "deviceGroupId": e.currentTarget.dataset.areaid,
                "cameraId": this.data.deviceId
            }, wx.getStorageSync('TOKEN')).then(function (resp) {
                if (resp.data.respCode === 0) {
                    _this.setData({
                        selectedId: e.target.dataset.areaid
                    });
                    _this.setIndexVideo();
                    wx.navigateBack();
                }
            });
        }
    },
    //修改首页的视频列表-重新拉去数据，传入视频id
    setIndexVideo(){
        let _this = this;
        let pages = getCurrentPages(),indexPage=null;
        pages.forEach((item,index)=>{
            if(item.route=='pages/index/index'){
                indexPage = item;
                return
            }
        })
        if(indexPage){
            indexPage.setData({
                isFromSet:true,
                isFromSetId:_this.data.deviceId
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deviceId: options.deviceId,
            selectedId: options.areaId
        });
        console.log(this.data.selectedId);
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