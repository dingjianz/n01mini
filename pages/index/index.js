//index.js
import { urlData, post, ishasPower} from '../../utils/util.js'

Page({
  /**
  * 页面的初始数据
  */
  data: {
    shadowHide:true,
    activeTab:0,  //设备tab的索引
    videoContext: null,  //视频videoContext对象
    videoPlay:false,  //判断视频是否播放
    videoList: [{
      hlsUrl:'http://hls01open.ys7.com/openlive/aff4cd1d62e5423b8eaacec1851a9d84.hd.m3u8',
      displayName: '大棚：（东台三仓）'
      }, {
        hlsUrl: 'http://hls01open.ys7.com/openlive/a4cec8b992474a82a78cf92a868fa04f.hd.m3u8',
        displayName: '大田：（崇明春润）'
      }, {
        hlsUrl: 'http://hls01open.ys7.com/openlive/fdd0284186754c60a0b8823d5922253d.hd.m3u8',
        displayName: '大棚：（东台三仓）'
      }, {
        hlsUrl: 'http://hls01open.ys7.com/openlive/ecdd8d6a3144412db0af82549a16a244.hd.m3u8',
        displayName: '大田：（崇明春润）'
      }],   //视频文件列表
    videoIndex:0, //当前video的索引
    tabs: [{ title: "传感设备", num: 10 }, { title: "控制设备", num: 16 }, { title: "综合设备", num: 3 }],
    isAutoplay:false, //监控是否自动播放
    tabTopHeight:null,  //设备tab距离顶部的距离
    isTabCanFixed:false,  //设备tab是否是fixed状态
    isVideoFixed:false,   //监控是否是置顶状态
    isVideoContl:false,   //摄像头控制是否打开
    isControl:false,    //视频监控是否启用control

    isVisibleModel:false, //是否显示数值型控制器弹窗
    isVisibleSwitch:false,  //是否显示开关确认弹窗
    actionType:'',    //开关弹窗的动作行为
    modelValue:'',    //数值型控制器的input的value
    isFocusModel:false, //是否自动聚焦控制器中的input

    hasSwitchType:null,    //存放“开关”弹出弹窗时保存的开关类型
    hasSwitchIndex:0,     //存放“开关”弹出弹窗时保存的开关index
    hasSwitchId:null,       //存放点击的开关的id值

    isShowAreaSwitch:false,   //是否显示选择区域的蒙层
    animate1:''

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
  //切换设备tab
  changeTab(e) {
      this.setData({
          activeTab: e.target.dataset.index
      });
  },
  // ----------------------视频监控方法 start ----------------------------
  // 接口--获取视频监控列表
  getVideoList(){
    var _this = this;
    post(urlData.iotCameraList,{
      "companyId": 4,
      "deviceGroupId": 0
    }, wx.getStorageSync('TOKEN')).then((res)=>{
      _this.setData({
        videoList: JSON.parse(JSON.stringify(res.data.obj.list))
      })
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
  videoPlay(e){
    if(e.type=='play'){
      console.log('play!!!!!')
      this.setData({
        videoPlay: true
      });
    }
  },
  //切换视频
  changeVideoUrl(e) {
    console.log(e)
    this.setData({
      videoIndex: e.currentTarget.dataset.index,
      videoPlay: true
    })
    setTimeout(()=>{
      this.data.videoContext.play();
    },300)
  },
  //使监控置顶
  setVideoFixed(){
    const _this = this;
    this.setData({
      isVideoFixed: !_this.data.isVideoFixed
    })
  },
  // 全屏
  intoFullScreen(e){
    console.log(e)
    this.data.videoContext.requestFullScreen();
    this.setData({
      isControl:true
    })
  },
  //进入/退出全屏触发
  isFullScreenState(e){
    console.log(e)
    if (!e.detail.fullScreen){
      //退出全屏
      this.setData({
        isControl: false
      })
    }
  },
  //跳转至多窗口页
  toMultiVideo(e){
    wx.navigateTo({
      url: '/pages/multiVideo/multiVideo'
    })
  },
  //退出控制
  exitCtrl(e){
    this.setData({
      isVideoContl:false
    })
  },
  openVideoControl(e){
    this.setData({
      isVideoContl: true
    })
  },
  // ----------------------视频监控方法 end ----------------------------

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

  //设备详情页
  deviceInfo() {
    wx.navigateTo({
      url: '/pages/deviceInfo/deviceInfo?id=712'
    })
  },
  turnToDeviceDetail() {
    wx.navigateTo({
      url: '/pages/deviceDetail/deviceDetail'
    })
  },
  turnToWind() {
    wx.navigateTo({
      url: '/pages/wind-direction/wind-direction'
    })
  },
  turnToEquipmentDetail() {
    wx.navigateTo({
      url: '/pages/meteorological-equipment/meteorological-equipment'
    })
  },
  //-------------------开关方法 start------------------------
  //点击开关，打开确认弹窗
  openSwitchToast(e){
    this.setData({
      isVisibleSwitch:true,
      actionType:e.detail.name,
      hasSwitchType: e.detail.type,
      hasSwitchIndex:e.detail.index,
      hasSwitchId: e.currentTarget.dataset.domid
    })
  },
  handleBtnOk(e) {
    const _this = this;
    this.setData({
      isVisibleSwitch: false,
    })

    let onoffComp = this.selectComponent('#' + _this.data.hasSwitchId);
    onoffComp.changeSwitch(_this.data.hasSwitchIndex)
  },
  //取消按钮
  handleBtnCancel(e) {
    this.setData({
      isVisibleSwitch: false,
    })
  },

  //-------------------开关方法 end------------------------

  // -----------------数值型控制器start---------------------
  openControlNumber(e){
    //打开控制器弹窗
    this.setData({
      isVisibleModel: true,
      isFocusModel:true,
      modelValue:e.currentTarget.dataset.num
    })
  },
  ModelBtnOk(e){
    this.setData({
      isVisibleModel: false,
      isFocusModel: false,
    })
  },
  ModelBtnCancel(e) {
    this.setData({
      isVisibleModel: false,
      isFocusModel: false
    })
  },
  // -----------------数值型控制器 end ---------------------

  // -----------------  选择区域 start ---------------------
  createAnimate(){
    let animate = wx.createAnimation({
      timingFunction: 'ease-in'
    });
    animate.height(0)
  },

  //收起选择区域
  slideupArea(e){
    this.setData({
      isShowAreaSwitch: false,
      // animate1: "slideOutUp"
    })
  },
  //点开选择区域
  slideDownArea(e){
    this.setData({
      isShowAreaSwitch: true,
      animate1: "slideInDown"
    })
  },
  // -----------------  选择区域 end ---------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getVideoList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    var _this = this;
    this.setData({
      videoContext: wx.createVideoContext('myVideo')
    })
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (networkType == 'wifi') {
          _this.setData({
            isAutoplay: true,
            videoPlay: true
          })
        } else {
          let video = _this.data.videoContext;
          video.pause();
          _this.setData({
            isAutoplay: false,
            videoPlay: false
          })
        }
      }
    })
    this.initClientRect();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    if (this.data.isVideoContl){  //在视频监控 控制时，没有刷新
      wx.stopPullDownRefresh()
    }
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
