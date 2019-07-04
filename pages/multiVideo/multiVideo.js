// pages/multiVideo/multiVideo.js
import { urlData, post, ishasPower } from '../../utils/util.js'
let setTimeOut1 = null;
let setTimeOut2 = null;
let setTimeOut3 = null;

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIPX: false,
        videolist:[],
    },
    ctrolPan(e){//展开视频控制云台
        wx.navigateTo({
            url: `/pages/videoCtrol/videoCtrol?deviceid=${e.currentTarget.dataset.id}&play=${e.currentTarget.dataset.play?'1':'0'}`
        });
    },
    firstPlay(e){//中间播放按钮点击播放
        if (this.checkMax(4)) {
            wx.showToast({
                title: '同时播放不超过4个',
                icon:'none',
                duration:3000
            });
            return
        }

        const index = Number(e.currentTarget.dataset.index);

        let key = `videolist[${index}].centerPlay`;
        let key1 = `videolist[${index}].headShow`;
        let key2 = `videolist[${index}].footShow`;
        let key3 = `videolist[${index}].isPlay`;
        
        let videoCx = `videolist[${index}].isVideoCreate`;
        let videoContext = `videolist[${index}].videoContext`;
        this.setData({
            [videoCx]: true,
            [videoContext]: wx.createVideoContext(`video-${e.currentTarget.dataset.id}`),
        });

        this.data.videolist[index].videoContext.play();

        this.setData({
            [key]:false,
            [key3]:true,
            [key1]: true,
            [key2]: true
        });

        let _this = this;
        let timeout1 = `videolist[${index}].timeout1`;
        clearTimeout(_this.data.videolist[index].timeout2)
        clearTimeout(_this.data.videolist[index].timeout3)
        setTimeOut1 = setTimeout(function () {
            _this.setData({
                [key1]: false,
                [key2]: false
            });
        }, 5000);
        _this.setData({
            [timeout1]:setTimeOut1
        })
    },
    clickVideo(e){//点击视屏界面（非控制按钮）
        const index = Number(e.currentTarget.dataset.index);

        let key1 = `videolist[${index}].headShow`,key2 = `videolist[${index}].footShow`;
        let head = true,foot = false;
        if(this.data.videolist[index].isPlay){
            if (this.data.videolist[index].headShow && !this.data.videolist[index].footShow) {//标题展示，控制按钮不展示
                return 
            }else if(this.data.videolist[index].headShow && this.data.videolist[index].footShow){//标题和控制均展示时
                head = false;
                foot = false;
            } else if (!this.data.videolist[index].headShow && !this.data.videolist[index].footShow) {//标题和控制均不展示时
                head = true;
                foot = true;
            }
            this.setData({
                [key1]: head,
                [key2]: foot
            });
        }else{
            head = true;
            foot = true;
            this.setData({
                [key1]: head,
                [key2]: foot
            });
            return;
        }
        

        let _this = this;
        clearTimeout(_this.data.videolist[index].timeout1)
        clearTimeout(_this.data.videolist[index].timeout3)
        setTimeOut2 = setTimeout(()=>{
            if (head && foot && this.data.videolist[index].isTimeout){
                _this.setData({
                    [key1]: !head,
                    [key2]: !foot
                });
            }
        }, 5000);
        let timeout2 = `videolist[${index}].timeout2`;
        _this.setData({
            [timeout2]:setTimeOut2
        })
    },
    playfn(e) {//播放、暂停
        
        const index = Number(e.currentTarget.dataset.index);
        clearTimeout(this.data.videolist[index].timeout1)
        clearTimeout(this.data.videolist[index].timeout2)
        
        let key = `videolist[${index}].isPlay`;
        let key2 = `videolist[${index}].loading`;
        
        let key3 = `videolist[${index}].headShow`
        let key4 = `videolist[${index}].footShow`
        let key5 = `videolist[${index}].isTimeout`
        
       
        if (this.data.videolist[index].isPlay) {
            //暂停播放
            this.data.videolist[index].videoContext.pause();
            console.log('暂停')
            this.setData({
                [key2]:false,
                [key3]:true,
                [key4]:true,
                [key5]:false,
                [key]:false,
            })
        } else {
            //启动播放
            if (this.checkMax(4)) {
                wx.showToast({
                    title:'同时播放不超过4个',
                    icon:'none',
                    duration:3000
                });
                return
            }
            this.data.videolist[index].videoContext.play();
            console.log('播放')
            this.setData({
                [key2]:true,
                [key5]:true,
                [key]:true,
            })
            
            let head = `videolist[${index}].headShow`;
            let foot = `videolist[${index}].footShow`;
            setTimeOut3 = setTimeout(()=> {
                this.setData({
                    [head]: false,
                    [foot]: false
                });
            }, 5000);
            let timeout3 = `videolist[${index}].timeout3`;
            _this.setData({
                [timeout3]:setTimeOut3
            })
        }
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
            let key3 = `videolist[${index}].headShow`
            let key4 = `videolist[${index}].footShow`
            let key5 = `videolist[${index}].isTimeout`
            
            console.log('退出全屏');
            this.setData({
                [key1]: false,
                [key2]: false,
            });
          if (this.checkMax(5) && this.data.videolist[index].isPlay) {
              //这里是 checkMax（5）的原因是：这里需要知道有是否>4个，而不是>=4
              this.data.videolist[index].videoContext.pause();
              clearTimeout(this.data.videolist[index].timeout1)
              clearTimeout(this.data.videolist[index].timeout2)
              clearTimeout(this.data.videolist[index].timeout3)
            }
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
            "companyId": wx.getStorageSync('CID'),
            "deviceGroupId":wx.getStorageSync('GID').id
        }, wx.getStorageSync('TOKEN')).then((res) => {
            if (res.data.respCode == 0){
                res.data.obj.list.forEach(function(item,index){
                    const obj = {
                        control: false,
                        isPlay: false,
                        isFull: false,
                        videoContext: null,
                        centerPlay: true,
                        loading: true,
                        headShow: true,
                        footShow: false,

                        isVideoCreate:false,    //初始化时 不创建video，以防卡顿
                        isTimeout:true,          //为了播放之后又暂停 head和foot的settimeout 的问题 而产生的flag
                        timeout1:null,      
                        timeout2:null,      
                        timeout3:null,      
                    };

                    Object.assign(item, obj);
                }, res.data.obj.list);

                _this.setData({
                    videolist: JSON.parse(JSON.stringify(res.data.obj.list))
                });
                console.log('获取视频列表');
            }
        })
    },
    // 监听视频是否真正播放(如果全屏状态时播放了 但是已经有4个在播，那么退出时，不是播放状态)
    onPlayFn(e){
        let index = e.currentTarget.dataset.index;
        let load = `videolist[${index}].loading`;
        let isPlay = `videolist[${index}].isPlay`;
        let isTimeout = `videolist[${index}].isTimeout`
        this.setData({
            [load]:false,
            [isPlay]:true,
            [isTimeout]:true,
        })
    },
    //监听视频是否暂停(全屏时暂停，退出时需要暂停状态)
    onPauseFn(e){
        let index = e.currentTarget.dataset.index;
        clearTimeout(this.data.videolist[index].timeout1)
        clearTimeout(this.data.videolist[index].timeout2)
        let load = `videolist[${index}].loading`;
        let isPlay = `videolist[${index}].isPlay`;
        let head = `videolist[${index}].headShow`;
        let foot = `videolist[${index}].footShow`;
        let isTimeout = `videolist[${index}].isTimeout`
        this.setData({
            [load]:false,
            [head]: true,
            [foot]: true,
            [isTimeout]:false,
            [isPlay]:false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.setData({
        //     isIPX: app.globalData.isIx
        // })
        // this.getTotalVideo();
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
            isIPX: app.globalData.isIx
        })
        this.getTotalVideo();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        setTimeout(() => {
            this.data.videolist.forEach((item,index)=>{
                let key1 = `videolist[${index}].centerPlay`
                let key2 = `videolist[${index}].isVideoCreate`
                let key3 = `videolist[${index}].headShow`
                let key4 = `videolist[${index}].footShow`
                let key5 = `videolist[${index}].videoContext`
                let timeout1 = `videolist[${index}].timeout1`
                let timeout2 = `videolist[${index}].timeout2`
                let timeout3 = `videolist[${index}].timeout3`
                clearTimeout(this.data.videolist[index].timeout1)
                clearTimeout(this.data.videolist[index].timeout2)
                clearTimeout(this.data.videolist[index].timeout3)
    
                this.setData({
                    [key1]:true,
                    [key2]:false,
                    [key3]:true,
                    [key4]:false,
                    [key5]:null,
                    [timeout1]:null,
                    [timeout2]:null,
                    [timeout3]:null,
                })
            })
        }, 500);
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
        this.getTotalVideo();
        wx.stopPullDownRefresh()
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