// pages/teamSet/teamSet.js
import { post, urlData, checkBt, ishasPower, getCompanyList, getCompany } from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        viewable: false,
        companyId: wx.getStorageSync("CID"),
        originTit: '',
        companyTit: '',
        editRight: false,
        editModal: false,
        delModal: false,
        exitModal: false,
        actions: [
            {
                name: '取消',
                color: '#395787',
            },
            {
                name: '确定',
                color: '#5689D7'
            }
        ]
    },
    openModal(e) {
        const key = e.currentTarget.dataset.modal;
        if (key == 'editModal' && !this.data.editRight) {
            return
        }
        this.setData({
            [key]: true
        });
    },
    // 关闭弹框-可抽至于公共方法 *
    closeModal({ currentTarget }) {
        this.setData({
            [currentTarget.dataset.modal]: false
        })
    },

    // 退出团队
    editTeamHandle({ currentTarget, detail }) {
        switch (detail.index) {
            case 0:
                this.closeModal({ currentTarget });
                break;
            case 1:
                post(urlData.iotCompanyUserRefQuit, {
                    companyId: this.data.companyId
                }, wx.getStorageSync('TOKEN'))
                    .then(({ data }) => {
                        return new Promise((reslove) => {
                            if (data.respCode === 0) {
                                this.closeModal({ currentTarget });
                                getCompanyList((response) => {
                                    reslove(response);
                                });
                            }
                            // else if (res.respCode === 405) { //当前用户不在该团队时
                            //     this.closeModal({ currentTarget });
                            // }
                        })
                    })
                    .then(({ data }) => {
                        if (data.respCode === 0) {
                            wx.setStorageSync('CID', data.obj.list[0].id);
                            getCompany(data.obj.list[0].id);
                            wx.setStorageSync('GID', {
                                name: '全部区域',
                                id: -1
                            });
                            // data.obj.totalCount > 1
                            // ? wx.navigateBack({
                            //     delta: 1
                            // })
                            // : 
                            wx.reLaunch({
                                url: '/pages/index/index',
                            });
                        }
                    })
                break;
            default:
                break;
        }
        // console.log(currentTarget);
        // console.log(detail);
    },

    handleClick(e) {
        const key = e.currentTarget.dataset.modal;
        if (e.detail.index === 0) {//取消
            // this.data.actions[1].loading = false;
            this.setData({
                [key]: false,
                companyTit: this.data.originTit,
                // actions: this.data.actions
            });
        } else {//确定
            if (!this.data.companyTit.trim()) {
                wx.showToast({
                    title: '请输入团队名称',
                    icon: 'none',
                    duration: 3000,
                    mask: true
                })
                return false;
            }
            // this.data.actions[1].loading = true;

            // this.setData({
            //     actions: this.data.actions
            // });

            if (!checkBt(this.data.companyTit, 20)) {
                // action[1].loading = false;
                // this.setData({
                //     actions: action
                // });
                wx.showToast({
                    title: '团队名称最多20个字',
                    icon: 'none',
                    duration: 3000,
                    mask: true
                })
                return false;
            }
            this.submitName();
        }
    },

    submitName() {//提交修改的团队名称
        post(urlData.iotCompanyEditName, {
            "companyId": this.data.companyId,
            "companyName": this.data.companyTit.trim()
        }, wx.getStorageSync('TOKEN')).then((resp) => {
            if (resp.data.respCode === 0) {
                // this.data.actions[1].loading = false;
                this.setData({
                    editModal: false,
                    // actions: this.data.actions,
                    originTit: this.data.companyTit
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
            originTit: options.cname,
            viewable: options.ownid == wx.getStorageSync('COMPANYINFO').userCompanyVO.userVO.id ? false : true
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
        ishasPower(['iot:company:edit'], function (res) {
            if (res[0]) {
                _this.setData({
                    editRight: true
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