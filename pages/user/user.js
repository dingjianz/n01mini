// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 拥有团队
        ownedTeam: true,
        phone: ''
    },

    handleBtn(e) {
        console.log(e);
    },

    goCreatedTeam(){
        // console.log(e);
        wx.showToast({
            title: '请添加设备后再创建团队',
            icon: 'none',
            duration: 3000
        })
    },
    checkOwnedTeam(){
        this.setData({
            ownedTeam: wx.getStorageSync('CID')
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
        this.setData({
            phone: wx.getStorageSync('USERPHONE')
        });
        this.checkOwnedTeam();
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