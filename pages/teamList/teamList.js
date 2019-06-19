// pages/teamList/teamList.js
import { post, urlData, getCompany} from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeId:0,
        clist:[
            { id: 1104, companyName: '上海左岸芯慧有限公司安徽分公司研发中心', config: true},
            { id: 1104, companyName: '上海左岸芯慧有限公司安徽分公司研发中心', config: true},
            { id: 1104, companyName: '上海左岸芯慧有限公司安徽分公司研发中心', config: true},
            { id: 1104, companyName: '个人设备', config: false }
        ]
    },
    companySet(e){//点击进入公司设置
        wx.navigateTo({
            url: '/pages/teamSet/teamSet?cid=' + e.currentTarget.dataset.id + '&cname=' + e.currentTarget.dataset.cname
        });
    },
    changeCompany(e){
        const _this = this;
        const index = e.currentTarget.dataset.index;
        const id = this.data.clist[index].id;
        
        if (this.data.activeId != id){
            getCompany(id).then(function(resp){
                if (resp.data.respCode == 0){
                    _this.setData({
                        activeId: id
                    });
                    wx.reLaunch({
                        url: '/pages/index/index',
                    });
                }
            });
        }
    },
    getTotalCompany(){
        let _this = this;
        post(urlData.iotCompanyList,{}, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.setData({
                    clist: resp.data.obj.list
                });
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTotalCompany();
        this.setData({
            activeId: wx.getStorageSync('CID')
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