//index.js
import { urlData, post, throttle} from '../../utils/util.js'

Page({
  /**
  * 页面的初始数据
  */
  data: {
    // shadowHide:true,
    activeTab:null,  //选中的设备tab的type
    videoContext: null,  //视频videoContext对象
    videoPlay:false,  //判断视频是否播放
    videoList: [],   //视频文件列表
    videoIndex:0, //当前video的索引
    tabs: [],     //设备tab
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

    isCidPerson:false,    //是否是个人设备（CID为0是个人设备），默认否

    sensorList:[],      //传感设备的列表
    controlList:[],      //控制设备的列表
    integList:[],      //综合设备的列表

    sensorIcons:[     //传感设备对应分类的图表
      {icon:"iconturanglei",color:"#29B6F6",name:"土壤类"},
      {icon:"iconqitilei",color:"#39CF59",name:"气体类"},
      {icon:"iconshuizhilei",color:"#E042FB",name:"水质类"},
      {icon:"iconqixianglei",color:"#D5841B",name:"气象类"},
      {icon:"iconqitalei",color:"#64C3A4",name:"其他类"},
    ],

    areaName:'',          //显示的区域名称
    areaList:[],    //区域列表
    areaActiveId:-1,  //选中的区域id

  },
  // //横向滚动监听
  // scroll(e) {
  //     console.log(e);
  //     this.setData({
  //         shadowHide:true
  //     });
  // },
  // //滚动到右边触发
  // rightListen(e){
  //     this.setData({
  //         shadowHide:false
  //     });
  // },
  //切换设备tab
  changeTab(e) {
      this.setData({
          activeTab: e.target.dataset.type
      });
  },
  // ----------------------视频监控方法 start ----------------------------
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
    const query = wx.createSelectorQuery();
    query.select('#equip_tab').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if(res[0]){
        console.log('高：'+res[0].top)
        that.setData({
          tabTopHeight: res[0].top // res[0].top是 #equip_tab节点的上边界坐标
        })
      }
    })
  },

  //设备详情页
  deviceInfo({ currentTarget }) {
    let zitm = currentTarget.dataset.zitm;
    // console.log(zitm)
    wx.navigateTo({
      url: '/pages/deviceInfo/deviceInfo?id=' + zitm.id + '&proLength=' + zitm.proLength + '&isOnline=' + zitm.isOnline
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


  // -------------------接口调用方法 start---------------------

  // 接口--获取视频监控列表
  getVideoList() {
    var _this = this;
    post(urlData.iotCameraList, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id
    }, wx.getStorageSync('TOKEN')).then((res) => {
      
      //默认重新刷新视频接口时自动选中第一个视频源，并判断是否wifi状态下才自动播放
      _this.setData({
        videoList: JSON.parse(JSON.stringify(res.data.obj.list)),
        videoIndex:0
      })
      _this.getVideoContext();
      setTimeout(() => {
        _this.initClientRect();
      }, 100);
    })
  },
  //获取各设备数量
  getTabList(){
    var _this = this;
    post(urlData.iotDeviceCountByProType, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id
    }, wx.getStorageSync('TOKEN')).then((res) => {
      let tabArr = [];
      if (res.data.obj.length>0){
        res.data.obj.forEach((item,index)=>{
          let pName;
          switch (item.productType){
            case 'SENSOR':
              pName = "传感设备"
              break;
            case 'INTEGRATED':
              pName = "综合设备"
              break;
            case 'CONTROLLER':
              pName = "控制设备"
              break;
          }
          if(item.count>0){
            item.title = pName;
            tabArr.push(item)
          }
        })
        _this.setData({
          activeTab:tabArr[0]?tabArr[0].productType:null,
          tabs: JSON.parse(JSON.stringify(tabArr))
        })
        this.getSensorList()
      }
    })
  },
  //获取传感设备下的所有设备列表
  getSensorList(){
    var _this = this;
    post(urlData.iotDeviceSListByProType, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id,
      "productType": 'SENSOR'
    }, wx.getStorageSync('TOKEN')).then((res) => {
      let data = res.data.obj,list;
      if(data.length>0){
        list = res.data.obj.map((item,index)=>{
          let deviceData={
            proList:[]    //设备子属性列表
          };
          deviceData.id = item.id;    //设备id
          deviceData.name = item.displayName;    //设备显示名称
          deviceData.type = item.productVO.productCategory;    //设备类型SENSOR:WATER-水质类，SENSOR:SOIL-土壤类，SENSOR:GAS-气体类，SENSOR:METEOROLOGY-气象类,该字段为空则表示未设置分类
          deviceData.logo = item.productVO.productLogo;    //logo
          deviceData.proLength = item.devicePropertyDTOList.length;    //子属性个数
          // 子属性遍历
          item.devicePropertyDTOList.forEach((its,ids)=>{
            let proItem = {};
            if(its.dataType=="int"||its.dataType=="float"||its.dataType=="double"){
              //数值型
              proItem.numType = 1;     //设备数据类型，1是数据型，2是枚举型
              proItem.specsNumber = its.specsNumber;    //数值型的数据对象（含单位，最大值，最小值，步长）
            }else if(its.dataType=="bool"||its.dataType=="enum"){
              //枚举型
              proItem.numType = 2;     //设备数据类型，1是数据型，2是枚举型
              its.specsEnumList.forEach((i)=>{
                if(its.propertyValue==i.key){
                  proItem.enumNumber = i.keyValue;    //枚举对应的value值
                  return false;
                }
              })
            }
            proItem.value = its.propertyValue;    //属性的当前状态值
            proItem.pName = its.name;     //属性名称
            deviceData.isOnline = item.deviceState=='ONLINE'?true:false;
            deviceData.proList.push(its);
          })
          return deviceData;
        })
        _this.switchSensor(list)
      }
    })
  },

  //传感设备的分类
  switchSensor(list){
    let sensorList = [[],[],[],[],[]];
    list.forEach((item,index)=>{
      switch (item.type){
        case 'SENSOR:SOIL':         //土壤
          sensorList[0].push(item);
          break;
        case 'SENSOR:GAS':          //气体
          sensorList[1].push(item);
          break;
        case 'SENSOR:WATER':        //水质
          sensorList[2].push(item);
          break;
        case 'SENSOR:METEOROLOGY':  //气象
          sensorList[3].push(item);
          break;
        default:                    //其他
          sensorList[4].push(item);
          break;
      }
    })
    this.setData({
      sensorList:sensorList
    })
  },

  //获取控制设备下的所有设备列表
  getControlList(){
    var _this = this;
    post(urlData.iotDeviceSListByProType, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id,
      "productType": 'CONTROLLER'
    }, wx.getStorageSync('TOKEN')).then((res) => {
      let data = res.data.obj,list;
      if(data.length>0){
        list = res.data.obj.map((item,index)=>{
          let deviceData={
            proList:[]    //设备子属性列表
          };
          deviceData.id = item.id;    //设备id
          deviceData.name = item.displayName;    //设备显示名称
          deviceData.type = item.productVO.productCategory;    
          deviceData.logo = item.productVO.productLogo;    //logo
          deviceData.proLength = item.devicePropertyDTOList.length;    //子属性个数
          // 子属性遍历
          item.devicePropertyDTOList.forEach((its,ids)=>{
            let proItem = {};
            if(its.dataType=="int"||its.dataType=="float"||its.dataType=="double"){
              //数值型
              proItem.numType = 1;     //设备数据类型，1是数据型，2是枚举型
              proItem.specsNumber = its.specsNumber;    //数值型的数据对象（含单位，最大值，最小值，步长）
            }else if(its.dataType=="bool"||its.dataType=="enum"){
              //枚举型
              proItem.numType = 2;     //设备数据类型，1是数据型，2是枚举型
              its.specsEnumList.forEach((i)=>{
                if(its.propertyValue==i.key){
                  proItem.enumNumber = i.keyValue;    //枚举对应的value值
                  return false;
                }
              })
            }
            proItem.value = its.propertyValue;    //属性的当前状态值
            proItem.pName = its.name;     //属性名称
            deviceData.proList.push(its);
          })
          return deviceData;
        })
        _this.switchSensor(list)
      }
    })
  },


  //获取区域列表
  getAreaList : throttle(function(e){
    // wx.showLoading({
    //   title: '加载中',
    // })
    const iotpost = post(urlData.iotDeviceGroupList, {
      "companyId": wx.getStorageSync('CID'),
    }, wx.getStorageSync('TOKEN')).then((res) => {
      let areaList = [
        {"id":-1,"groupName":"全部区域"}
      ];
      if(res.data.obj.groupList.length>0){
        res.data.obj.groupList.forEach((item,index)=>{
          areaList.push(item);
        })
      }
      areaList.push({"id":0,"groupName":"默认区域"});

      let bool = false;   //判断当前选中的区域是否在区域列表内，默认不在
      areaList.forEach((item,index)=>{
        if(item.id==this.data.areaActiveId){
          bool = true;
          return false;
        }
      })
      if(!bool){
        //如果之前选中的区域不再区域列表内，则选择全部区域
        this.setData({
          areaActiveId : -1
        })
        wx.setStorageSync('GID', {
          name: '全部区域',
          id: -1
        });
      }
      this.setData({
        areaList:areaList,
        isShowAreaSwitch: true
      })
      // wx.hideLoading();
    })
    return iotpost;
  }),

  // 切换区域
  switchArea(e){
    //如果选择的是已经选中的 则不再拉接口
    if(this.data.areaActiveId == e.currentTarget.dataset.id){
      this.setData({
        isShowAreaSwitch: false,
      })
      return false;
    }
    const areaObj = {
      name:e.currentTarget.dataset.name,
      id:e.currentTarget.dataset.id,
    }
    wx.setStorageSync('GID',areaObj);
    this.setData({
      areaName:e.currentTarget.dataset.name,
      areaActiveId:e.currentTarget.dataset.id,
      isShowAreaSwitch: false,
    })
    //切换之后先将视频暂停
    if(this.data.videoContext){
      this.data.videoContext.pause();
      this.setData({
        isAutoplay: false,
        videoPlay: false
      })
    }
    // 切换之后需要重新拉去视频列表，设备列表
    this.getVideoList();
    this.getTabList();

  },

  slideupArea(){
    this.setData({
      isShowAreaSwitch: false,
    })
  },
  //获取video的Context，并判断是否wifi自动播放
  getVideoContext(){
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
  },
  // -------------------接口调用方法 end---------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果没存GID，则默认是“全部区域”
    if(!wx.getStorageSync('GID')){
      wx.setStorageSync('GID', {
        name: '全部区域',
        id: -1
      });
    }
    this.setData({
      areaName: wx.getStorageSync('GID').name,
      areaActiveId:wx.getStorageSync('GID').id
    })
    this.getVideoList();
    this.getTabList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    
    this.initClientRect();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //1.判断是否是个人设备还是团队-决定是否显示区域
    if (wx.getStorageSync('CID') == 0) {
      _this.setData({
        isCidPerson: true
      })
    } else {
      _this.setData({
        isCidPerson: false
      })
    }
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
