// pages/videoCtrol/videoCtrol.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        title:'',
        videoContext: null,
        isPlay:false,
        control:false//视频默认control按钮
    },
    ctrolEvent(e){
        console.log('子组件通信');
    },
    tapcover(e){
        console.log('点击了视频封面');
        // this.data.videoContext.pause();

        // this.setData({
        //     isPlay:false
        // });
    },
    playfn(){
        if(this.data.isPlay){
            this.data.videoContext.pause();
        }else{
            this.data.videoContext.play();
        }

        this.setData({
            isPlay: !this.data.isPlay
        });
        console.log(this.data.isPlay);
    },
    fullfn(){
        this.data.videoContext.requestFullScreen({
            direction:90
        });
        this.setData({
            control:true
        });
    },
    fullListen(e){//视频进入全屏或退出全屏
        if (!e.detail.fullScreen){
            console.log('退出全屏');
            this.setData({
                control:false
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            title: options.videotit
        });    
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            videoContext: wx.createVideoContext('myVideo')
        });
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