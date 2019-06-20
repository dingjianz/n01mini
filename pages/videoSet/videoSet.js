// pages/videoSet/videoSet.js
import { post, urlData, checkBt, ishasPower } from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        deviceId: '',
        originTit: '',//进入页面时初始设备名称
        deviceTit: '',//编辑时的设备名称
        editRight: true,//编辑权限
        editModal: false,
        actions: [
            {
                name: '取消',
                color: '#395787',
            },
            {
                name: '确定',
                color: '#456EAD'
            }
        ]
    },
    openModal(e) {
        if (!this.data.editRight) { // 无权限时不可打开编辑弹框
            return
        }
        this.setData({
            editModal: true
        });
    },
    handleClick(e) {
        if (e.detail.index === 0) {//取消
            this.setData({
                editModal: false,
                deviceTit: this.data.originTit
            });
        } else {//确定
            if (!this.data.deviceTit.length) {
                wx.showToast({
                    title: '请输入设备名称',
                    icon: 'none',
                    duration: 2000
                })
                return
            }

            const action = [...this.data.actions];
            this.data.actions[1].loading = true;

            this.setData({
                actions: action
            });

            if (!checkBt(this.data.deviceTit, 20)) {
                action[1].loading = false;
                this.setData({
                    actions: action
                });
                wx.showToast({
                    title: '设备名称最多20个字',
                    icon: 'none',
                    duration: 2000
                });
                return
            }

            this.submitName();
        }
    },
    submitName() {//提交修改的设备名称
        let _this = this;
        post(urlData.iotDeviceEditName, {
            "clientDisplayName": this.data.deviceTit,
            "companyId": wx.getStorageSync("CID"),
            "deviceId": this.data.deviceId
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.data.actions[1].loading = false;
                _this.setData({
                    editModal: false,
                    actions: _this.data.actions,
                    originTit: _this.data.deviceTit
                });
            }
        });
    },
    inputedit(e) {
        let datatxt = e.currentTarget.dataset.txt;
        let detail = e.detail.value;
        this.setData({
            deviceTit: detail
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deviceTit: options.deviceTit,
            originTit: options.deviceTit,
            deviceId: options.deviceId
        });
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