// pages/datePicker/datePicker.js
import '../../utils/util.js'
const today = new Date().format('yyyy-MM-dd');
const minDate = new Date(new Date().setMonth((new Date().getMonth() - 12), new Date().getDate() +1)).format('yyyy-MM-dd');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        dateSt: today,
        dateOv: '结束日期',
        minDate: minDate,
        maxDate: today
    },
    getDate(e){//点击唤起日期选择弹框
        this.setData({
            active: e.currentTarget.dataset.index
        }); 
    },
    bindDateChange(e) {//日期change
        if (e.currentTarget.dataset.index == 1){//开始日期
            this.setData({
                dateSt: e.detail.value
            })
        } else {//结束日期
            this.setData({
                dateOv: e.detail.value
            });
        }
        this.setData({
            active: 0
        });
    },
    cancelPick(e){//取消日期change
        //没有日期高亮
        this.setData({
            active:0
        });
    },
    dateLimit(){//日期最大最小值限制



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