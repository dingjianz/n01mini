// pages/multiVideo/multiVideo.js
let videoObj = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videolist:[
            { id: 1108, idstr: 'myVideo1', name: '1号视频', isPlay: false, isFull: false, control: false, videoContext: null},
            { id: 1274, idstr: 'myVideo2', name: '2号视频', isPlay: false, isFull: false, control: false, videoContext: null},
            { id: 3250, idstr: 'myVideo3', name: '3号视频', isPlay: false, isFull: false, control: false, videoContext: null},
            { id: 7149, idstr: 'myVideo4', name: '4号视频', isPlay: false, isFull: false, control: false, videoContext: null}
        ]
    },
    ctrolPan(e){//展开视频控制云台
        wx.navigateTo({
            url: '/pages/videoCtrol/videoCtrol?id=' + e.currentTarget.dataset.id + '&videotit=' + e.currentTarget.dataset.videotit
        });
    },
    playfn(e) {//播放、暂停
        const index = Number(e.currentTarget.dataset.index);
        
        let key = `videolist[${index}].isPlay`;
       
        if (this.data.videolist[index].isPlay) {//当前正在播放
            this.data.videolist[index].videoContext.pause();
        } else {//当前已暂停
            this.data.videolist[index].videoContext.play();
        }
        this.setData({
            [key]: !this.data.videolist[index].isPlay
        });
    },
    fullfn(e){//全屏
        const index = Number(e.currentTarget.dataset.index);

        let key1 = `videolist[${index}].isFull`;
        let key2 = `videolist[${index}].control`;

        this.data.videolist[index].videoContext.requestFullScreen({
            direction: 90
        });

        this.setData({
            [key1]:true,
            [key2]:true
        });
    },
    fullListen(e) {//视频进入全屏或退出全屏
        if (!e.detail.fullScreen) {
            const index = Number(e.currentTarget.dataset.index);

            let key1 = `videolist[${index}].isFull`;
            let key2 = `videolist[${index}].control`;
            
            console.log('退出全屏');
            this.setData({
                [key1]: false,
                [key2]: false
            });
        }
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
        let self = this;
        this.data.videolist.forEach(function(item,index){
            let key = `videolist[${index}].videoContext`;
            self.setData({
                [key]: wx.createVideoContext(item.idstr)
            });
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