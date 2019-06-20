// pages/multiVideo/multiVideo.js
import { urlData, post, ishasPower } from '../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        videolist:[
            {   
                id: 1106,
                name: '1号视频',
                idstr: 'myVideo1106',
                hlsUrl: 'http://hls01open.ys7.com/openlive/aff4cd1d62e5423b8eaacec1851a9d84.hd.m3u8',
                control: false,
                isPlay: false, 
                isFull: false, 
                videoContext: null,
                centerPlay: true,
                headShow: true, 
                footShwo: false,      
            }
        ]
    },
    ctrolPan(e){//展开视频控制云台
        wx.navigateTo({
            url: '/pages/videoCtrol/videoCtrol?deviceid=' + e.currentTarget.dataset.id + '&videotit=' + e.currentTarget.dataset.videotit
        });
    },
    firstPlay(e){//中间播放按钮点击播放
        if (this.checkMax(2)) {
            wx.showToast({
                title: '手机要炸了！',
                icon:'none'
            });
            return
        }

        const index = Number(e.currentTarget.dataset.index);

        let key = `videolist[${index}].centerPlay`;
        let key1 = `videolist[${index}].headShow`;
        let key2 = `videolist[${index}].footShow`;
        let key3 = `videolist[${index}].isPlay`;

        this.data.videolist[index].videoContext.play();

        this.setData({
            [key]:false,
            [key2]:true,
            [key3]:true
        });

        let _this = this;
        setTimeout(function () {
            _this.setData({
                [key1]: false,
                [key2]: false
            });
        }, 5000);
    },
    clickVideo(e){//点击视屏界面（非控制按钮）
        const index = Number(e.currentTarget.dataset.index);

        let key1 = `videolist[${index}].headShow`,key2 = `videolist[${index}].footShow`;
        let head = true,foot = false;

        if (this.data.videolist[index].headShow && !this.data.videolist[index].footShow) {//标题展示，控制按钮不展示
            return 
        }else if(this.data.videolist[index].headShow && this.data.videolist[index].footShow){//标题和控制均展示时
            head = false, foot = false;
        } else if (!this.data.videolist[index].headShow && !this.data.videolist[index].footShow) {//标题和控制均不展示时
            head = true, foot = true;
        }

        this.setData({
            [key1]: head,
            [key2]: foot
        });

        if (head && foot){
            let _this = this;
            setTimeout(function () {
                _this.setData({
                    [key1]: !head,
                    [key2]: !foot
                });
            }, 5000);
        }
    },
    playfn(e) {//播放、暂停
        const index = Number(e.currentTarget.dataset.index);
        
        let key = `videolist[${index}].isPlay`;
       
        if (this.data.videolist[index].isPlay) {//当前正在播放
            this.data.videolist[index].videoContext.pause();
        } else {//当前已暂停
            if (this.checkMax(2)) {
                wx.showToast({
                    title:'播放太多，手机要爆炸了！'
                });
                return
            }
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
    checkMax(num){//同时播放的最大数量限制
        let max = 0;
        this.data.videolist.forEach(function(item,index){
            if (item.isPlay){
                ++max; 
            }
        });
        return max >= num ? true:false;
    },
    getTotalVideo(){//获取所有视频列表
        var _this = this;
        post(urlData.iotCameraList, {
            "companyId": 4,
            "deviceGroupId": 0
        }, wx.getStorageSync('TOKEN')).then((res) => {
            if (res.data.respCode == 0 && res.data.obj.totalCount>0){
                res.data.obj.list.forEach(function(item,index){
                    const obj = {
                        control: false,
                        isPlay: false,
                        isFull: false,
                        videoContext: null,
                        centerPlay: true,
                        headShow: true,
                        footShwo: false
                    };

                    Object.assign(item, obj);
                }, res.data.obj.list);

                _this.setData({
                    videolist: JSON.parse(JSON.stringify(res.data.obj.list))
                });
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTotalVideo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let self = this;
        this.data.videolist.forEach(function(item,index){
            let key = `videolist[${index}].videoContext`;
            self.setData({
                [key]: wx.createVideoContext('video-'+item.id)
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