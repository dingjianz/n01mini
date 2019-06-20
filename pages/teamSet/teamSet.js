// pages/teamSet/teamSet.js
import { post, urlData, checkBt, ishasPower} from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        viewable:false,
        companyId: wx.getStorageSync("CID"),
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
            }
        ]
    },
    openModal(e) {
        // if (this.data.viewable){
        //     return 
        // }
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
                companyTit:this.data.originTit
            });
        }else{//确定
            if (!this.data.companyTit.length) {
                wx.showToast({
                    title: '请输入团队名称',
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

            if (!checkBt(this.data.companyTit,20)){
                action[1].loading = false;
                this.setData({
                    actions: action
                });
                wx.showToast({
                    title: '团队名称最多20个字',
                    icon: 'none',
                    duration: 2000
                })
                return 
            }

            this.submitName();
        }
    },
    submitName(){//提交修改的团队名称
        let _this = this;
        post(urlData.iotCompanyEditName, {
            "companyId": this.data.companyId,
            "companyName": this.data.companyTit
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.data.actions[1].loading = false;
                _this.setData({
                    editModal: false,
                    actions: _this.data.actions,
                    originTit: _this.data.companyTit
                });
            }
        });
    },
    inputedit(e) {
        let datatxt = e.currentTarget.dataset.txt;
        let detail = e.detail.value;
        this.setData({
            companyTit: detail
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            companyId: options.cid,
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
        let _this = this;
        ishasPower(['user:company:get'], function (res) {
            if (res[0]) {
                _this.setData({
                    viewable: true
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