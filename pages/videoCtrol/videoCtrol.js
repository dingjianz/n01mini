// pages/videoCtrol/videoCtrol.js
import { post, urlData} from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        deviceId:'',
        deviceTit:'',
        cameraArea:'',
        videoContext: null,
        isPlay:false,
        control:false,//视频默认control按钮
        hlsUrl:'',
        playOnce:false,
        isloading:false,
        
        isNeedPlay:false,       //从上个页面获取 是否视频需要自动播放

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
            this.setData({
                playOnce:true,
                isloading:true,
            });
        }

        this.setData({
            isPlay: !this.data.isPlay
        });
        console.log(this.data.isPlay);
    },
    //监听是否播放
    videoPlay(e){
        if(e.type=='play'){
            this.setData({
                isloading:false,
            });
        }
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
    exitCtrl(){
        wx.navigateBack({
            url: '/pages/multiVideo/multiVideo'
        });
    },
    getCameraInfo(){//根据id获取摄像头详细信息
        let _this = this;
        post(urlData.iotCameraInfoGet, {
            "companyId": wx.getStorageSync("CID"),
            "cameraId": this.data.deviceId
        }, wx.getStorageSync('TOKEN')).then((resp) => {
            if (resp.data.respCode === 0) {
                _this.setData({
                    deviceTit: resp.data.obj.displayName,
                    cameraArea: resp.data.obj.deviceGroupVO?resp.data.obj.deviceGroupVO.groupName:'默认区域',
                    hlsUrl: resp.data.obj.hlsUrl,
                    videoContext: wx.createVideoContext('myVideo')
                }); 
                if(_this.data.isNeedPlay){
                    //需要自动播放
                    setTimeout(()=>{
                      if (_this.data.videoContext){
                        _this.data.videoContext.play();
                      }else{  //以防播不出来
                        _this.setData({
                          videoContext: wx.createVideoContext('myVideo')
                        })
                        _this.data.videoContext.play();
                      }
                    },100)
                    _this.setData({
                        playOnce:true,
                        isloading:true,
                        isPlay:true,
                    });
                }else{
                  _this.setData({
                    isloading: false,
                    isPlay: false,
                  });
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            deviceId: options.deviceid,
            isNeedPlay:Number(options.play),
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
      console.log('isNeedPlay' + this.data.isNeedPlay)
      this.getCameraInfo();
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