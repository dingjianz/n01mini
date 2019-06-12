//index.js
import { formatTime} from '../../utils/util.js'

Page({
    /**
    * 页面的初始数据
    */
    data: {
        shadowHide:true,
        activeTab:0,
        videoContext:null,
        videoPlay:false,
        tabs: [{ title: "传感设备", num: 10 }, { title: "控制设备", num: 16 }, { title: "综合设备", num: 3 }]
    },
    statechange(e) {
        console.log('live-player code:', e.detail.code)
    },
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
    },
    scroll(e) {//横向滚动监听
        console.log(e);
        this.setData({
            shadowHide:true
        });
    },
    rightListen(e){//滚动到右边触发
        this.setData({
            shadowHide:false
        });
    },
    changeTab(e) {//切换tab
        this.setData({
            activeTab: e.target.dataset.index
        });
    },
    deviceInfo(){//设备详情页
        wx.navigateTo({
            url: '/pages/deviceInfo/deviceInfo?id=712'
        })
    },
    playfn(){
        if(this.videoPlay){
            this.videoContext.pause();
            this.setData({
                videoPlay: false
            });
        }else{
            this.videoContext.play();
            this.setData({
                videoPlay: true
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
    onReady(res) {
        this.videoContext = wx.createVideoContext('myVideo');
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
