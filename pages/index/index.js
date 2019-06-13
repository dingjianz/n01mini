//index.js
import { todealName} from '../../utils/util.js'

Page({
    /**
    * 页面的初始数据
    */
    data: {
      shadowHide:true,
      activeTab:0,  //设备tab的索引
      videoContext: null,  //视频videoContext对象
      videoPlay:false,  //判断视频是都播放
      tabs: [{ title: "传感设备", num: 10 }, { title: "控制设备", num: 16 }, { title: "综合设备", num: 3 }],
      isAutoplay:false, //监控是否自动播放
      tabTopHeight:null,  //设备tab距离顶部的距离
      isTabCanFixed:false,  //设备tab是否是fixed状态
      isVideoFixed:false,   //监控是否是置顶状态
    },
    getColors(str){

    },
    statechange(e) {
        console.log('live-player code:', e.detail.code)
    },
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
    },
    //横向滚动监听
    scroll(e) {
        console.log(e);
        this.setData({
            shadowHide:true
        });
    },
    //滚动到右边触发
    rightListen(e){
        this.setData({
            shadowHide:false
        });
    },
    //切换tab
    changeTab(e) {
        this.setData({
            activeTab: e.target.dataset.index
        });
    },
    //设备详情页
    deviceInfo(){
        wx.navigateTo({
            url: '/pages/deviceInfo/deviceInfo?id=712'
        })
    },
    //播放/暂停 视频监控
    playfn(){   
      if (this.data.videoPlay){
            this.data.videoContext.pause();
            this.setData({
                videoPlay: false
            });
        } else {
            this.data.videoContext.play();
            this.setData({
                videoPlay: true
            });
        }
    },
    //使监控置顶
    setVideoFixed(){
      const _this = this;
      this.setData({
        isVideoFixed: !_this.data.isVideoFixed
      })
    },
    //获取设备tab的距离文档顶部的高度
    initClientRect (){
      const that = this;
      const query = wx.createSelectorQuery()
      query.select('#equip_tab').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        that.setData({
          tabTopHeight: res[0].top // res[0].top是 #equip_tab节点的上边界坐标
        })
      })
    },
    turnToDeviceDetail() {
      wx.navigateTo({
        url: '/pages/deviceDetail/deviceDetail'
      })
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
      this.data.videoContext = wx.createVideoContext('myVideo');
      this.initClientRect();
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (networkType == 'wifi') {
          _this.setData({
            isAutoplay: true,
            videoPlay: true
          })
        }else{
          this.data.videoContext.pause();
          _this.setData({
            isAutoplay: false,
            videoPlay: false
          })
        }
      }
    })
  },
  // 页面滚动监听方法
  onPageScroll: function (scroll, that) {
    // console.log(scroll)
    if (scroll.scrollTop > this.data.tabTopHeight){
      this.setData({
        isTabCanFixed:true
      })
    }else{
      this.setData({
        isTabCanFixed: false
      })
    }
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
