// pages/teamSet/teamSet.js
import { post, urlData, checkBt } from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        role:true,
        originTit:'',
        companyTit:'',
        editRight:true,
        editModal:false,
        delModal: false,
        exitModal: false,
        actions: [
            {
                name: '取消',
                color: '#395787',
            },
            {
                name: '确定',
                color: '#456EAD'
            },
        ],
        errorCode:0//1为团队名称未填写，2为团队名称超长
    },
    openModal(e) {
        const key = e.currentTarget.dataset.modal;
        if (key == 'editModal' && !this.data.editRight){
            return
        }
        this.setData({
            [key]:true
        });
    },
    handleClick(e){
        const key = e.currentTarget.dataset.modal;
        if (e.detail.index === 0) {//取消
            this.setData({
                [key]: false,
                companyTit:this.data.originTit,
                errorCode:0
            });
        }else{//确定
            if (!this.data.companyTit.length) {
                this.setData({
                    errorCode: 1
                });
                return
            }

            const action = [...this.data.actions];
            this.data.actions[1].loading = true;

            this.setData({
                actions: action
            });

            if (!checkBt(this.data.companyTit,20)){
                action[1].loading = false;
                this.setData({
                    actions: action,
                    errorCode:2
                });
                return 
            }

            this.submitName();
        }
    },
    submitName(){//提交修改的团队名称
        let _this = this;
        post(urlData.iotCompanyEditName, {
            "companyId": wx.getStorageSync("CID"),
            "companyName": this.data.companyTit
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.data.actions[1].loading = false;
                _this.setData({
                    editModal: false,
                    actions: _this.data.actions,
                    originTit: _this.data.companyTit,
                    errorCode:0
                });
            }
        });
    },
    inputedit(e) {
        let datatxt = e.currentTarget.dataset.txt;
        let detail = e.detail.value;
        this.setData({
            companyTit: detail,
            errorCode:0
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            companyTit: options.cname,
            originTit: options.cname
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