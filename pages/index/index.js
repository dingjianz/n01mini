//index.js
import { urlData, post, throttle,ishasPower, getCompany, getCompanyList} from '../../utils/util.js'

let videoSrcollData = 0;  //临时记住的视频列表横向滑动的数据
Page({
  /**
  * 页面的初始数据
  */
  data: {
    // shadowHide:true,
    activeTab:null,  //选中的设备tab的type
    videoContext: null,  //视频videoContext对象
    isVideoPlay:false,  //判断视频是否播放
    videoList: [],   //视频文件列表
    videoIndex:0, //当前video的索引
    videoId:0, //当前选中的video的id
    videoUrl:null,  //正在播放的视频url

    tabs: [],     //设备tab
    isAutoplay:false, //视频是否自动播放
    tabTopHeight:null,  //设备tab距离顶部的距离
    isTabCanFixed:false,  //设备tab是否是fixed状态
    isVideoFixed:false,   //视频是否是置顶状态
    fixedState:false,     //记住置顶状态（在进入视频控制页时需要取消置顶，所以在取消置顶之前 需要记住之前是否置顶）
    isPoster:true,  //是否显示poster
    isFullScreen:false, //视频是否处于全屏状态

    isControl:false,    //视频是否启用control
    isShowVideoLoad:false,  //视频loading（切换视频后未播放 或 首次视频未播放时时）
    videoScrollLeft:0,  //视频列表scroll的横向滚动条位置

    isVisibleModel:false, //是否显示数值型控制器弹窗
    isVisibleSwitch:false,  //是否显示开关确认弹窗
    actionType:'',    //开关弹窗的动作行为
    actionDeviceName:'',  //开关弹窗 针对的设备名称
    modelValue:'',    //数值型控制器的input的value
    modelName:'',     //数值型控制器的标题
    modelRange:'',      //数值型控制器的 范围
    isFocusModel:false, //是否自动聚焦控制器中的input

    hasSwitchType:null,    //存放“开关”弹出弹窗时保存的开关类型
    hasSwitchValue:0,     //存放“开关”弹出弹窗时保存的开关value值

    hasCompId:null,       //存放点击的开关/iconfont组件的id值
    
    conlCIdx:0,    //存放“开关”弹窗时保存的 cIdx
    conlIdx:0,    //存放“开关”弹窗时保存的 idx

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

    videoObj:{    //视频控制时的 视频数据对象
      name:null,
      areaName:null,
      id:null,
    },

    isFromSet:false,    //是否从设置回来，需要刷新videolist
    isFromSetId:null,   //从设置回来时，传回来的videoId
  },
  //跳转到 添加区域
  toAddArea(){
    wx.navigateTo({
      url: '../regional-management/regional-management'
    })
  },
  //切换设备tab
  changeTab(e) {
    var _this = this;
    switch(e.target.dataset.type){
      case 'SENSOR':
        if(_this.data.sensorList.length==0){
          _this.getSensorList();
        }
        break;
      case 'CONTROLLER':
        if(_this.data.controlList.length==0){
          _this.getControlList();
        }
        break;
      case 'INTEGRATED':
        if(_this.data.integList.length==0){
          _this.getIntegList();
        }
        break;
    }
    
    _this.setData({
        activeTab: e.target.dataset.type
    });
  },
  // ----------------------视频方法 start ----------------------------
  // 监听 视频列表tab滑动
  videoListScroll({detail}){
    videoSrcollData = detail.scrollLeft;  //只有在选中某个视频时，才会将这个临时的值赋值给videoScrollLeft
  },
  //播放/暂停 视频
  playfn(){
    if (this.data.isVideoPlay){
        this.data.videoContext.stop();
        this.setData({
            isVideoPlay: false,
            isShowVideoLoad:true,
        });
    } else {
        this.data.videoContext.play();
        this.setData({
            isVideoPlay: true,
            isShowVideoLoad:true,
            isPoster:false,
        });
    }
  },
  //监听视频是否播放
  videoPlay(e){
    console.log(JSON.stringify(e))
    if(e.type=='play'){
      this.setData({
        isVideoPlay: true,
        isShowVideoLoad:false,
      });
    }
  },
  //监听视频是否暂停
  videoPause({type}){
    if(type=='pause'&&this.data.isFullScreen){
      //只有在全屏状态下暂停播放，才将isVideoPlay设置为false
      this.setData({
        isVideoPlay:false
      });
    }
  },
  //监听视频进入/退出全屏
  isFullScreenState({detail}){
    if(!detail.fullScreen){
      //退出全屏
      this.setData({
        isControl:false,
        isFullScreen:false,
      })
    }else{
      this.setData({
        isFullScreen:true
      })
    }
  },
  //切换视频
  changeVideoUrl(e) {
    let _this = this,index = e.currentTarget.dataset.index;
    // videoId有变化时 需要同时变化videoIndex，因为在videoList数组中查询需要用videoIndex
    this.setData({
      videoIndex: index,
      videoId:e.currentTarget.dataset.id,
      isVideoPlay: true,
      isShowVideoLoad:true,
      isPoster:false,
      videoScrollLeft:videoSrcollData,    //将临时存放的值，在选中时赋值
      videoUrl:_this.data.videoList[index].hlsUrl||_this.data.videoList[index].hlsUrlHd,
    })
    setTimeout(()=>{
      this.data.videoContext.play();
    },300)
  },
  //使视频置顶
  setVideoFixed(){
    const _this = this;
    this.setData({
      isVideoFixed: !_this.data.isVideoFixed,
      fixedState: !_this.data.isVideoFixed,
    })
  },
  // 进入全屏
  intoFullScreen(e){
    console.log(e)
    this.data.videoContext.requestFullScreen();
    this.setData({
      isControl:true,
    })
  },
  //跳转至多窗口页
  toMultiVideo(e){
    wx.navigateTo({
      url: '/pages/multiVideo/multiVideo'
    })
  },
  // 打开摄像头控制
  openVideoControl(e){
    let _this = this;
    wx.navigateTo({
      url: `/pages/videoCtrol/videoCtrol?deviceid=${_this.data.videoList[_this.data.videoIndex].id}&play=${_this.data.isVideoPlay?'1':'0'}`
    });
  },

  //进行视频设置时，在videoList中遍历videoid，看是否存在，如果存在，则选中该videoid的视频
  //视频设置页面中，不论修改了视频名称还是视频区域，都要重新拉取视频列表的接口，但是希望能记住上一次选择的视频，如果上一次选择不再视频列表内，则默认选择第一个
  isInVideoList(id){
    let bool = false,_this = this;
    _this.data.videoList.forEach((item,index)=>{
      if(item.id==id){
        bool = true;
        _this.setData({
          videoIndex:index,
          videoId:id,
          videoScrollLeft:this.data.videoScrollLeft,
          videoUrl:_this.data.videoList[index].hlsUrl||_this.data.videoList[index].hlsUrlHd,
        })
      }
    })
    if(!bool){
      _this.setData({
        videoIndex:0,
        videoId:_this.data.videoList[0]?_this.data.videoList[0].id:null,
        videoScrollLeft:0,
        videoUrl:_this.data.videoList[0]?_this.data.videoList[0].hlsUrl||_this.data.videoList[0].hlsUrlHd:null,
      })
    }
  },
  // ----------------------视频方法 end ----------------------------

  //获取设备tab的距离文档顶部的高度
  initClientRect (){
    const that = this;
    const query = wx.createSelectorQuery();
    query.select('#equip_tab').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if(res[0]){
        that.setData({
          tabTopHeight: res[0].top // res[0].top是 #equip_tab节点的上边界坐标
        })
      }else{
        that.setData({
          tabTopHeight: null 
        })
      }
    })
  },

  //设备详情页
  deviceInfo({ currentTarget }) {
    let zitm = currentTarget.dataset.zitm;
    wx.navigateTo({
      url: '/pages/deviceInfo/deviceInfo?id=' + zitm.id + '&proLength=' + zitm.proLength + '&isOnline=' + zitm.isOnline
    })
  },
  turnToDeviceDetail({ currentTarget }) {
    let deviceId = currentTarget.dataset.its.id;
    let numType = currentTarget.dataset.its.numType;
    let isOnline = currentTarget.dataset.its.isOnline;
    wx.navigateTo({
      url: '/pages/deviceDetail/deviceDetail?deviceId=' + deviceId + '&numType=' + numType + '&isOnline=' + isOnline
    })
  },
  turnToWind() {
    wx.navigateTo({
      url: '/pages/wind-direction/wind-direction'
    })
  },
  turnToEquipmentDetail(e) {
    wx.navigateTo({
      url: `/pages/meteorological-equipment/meteorological-equipment?id=${e.currentTarget.dataset.id}`
    })
  },
  //-------------------开关方法 start------------------------
  //点击开关，打开确认弹窗
  openSwitchToast(e){
    let _this = this, mark = ["iot:device:changestate"];
    ishasPower(mark,function(result){
      if(result[0]){
        //有修改权限
        //根据索引判断value值
        var switchValue;
        if(e.target.dataset.type == "1"){
          //开关停 根据index索引来判断value值 开1 关2 停3(index:组件中 对应 开2 关0 停1)
          switch(e.detail.index){
            case 0: //关
              switchValue = 2;
              break;
            case 1: //停
              switchValue = 3;
              break;
            case 2: //开
              switchValue = 1;
              break;
          }
        }else if(e.target.dataset.type == "2"){
            //开关 根据index索引来判断value值 关0 开1 (组件中 对应 关0 开1 )
            switchValue = e.detail.index;
        }
        _this.setData({
          isVisibleSwitch:true,
          actionType:e.detail.name,
          actionDeviceName:e.currentTarget.dataset.dname,
          hasSwitchType: e.detail.type,
          hasSwitchValue:switchValue,
          hasCompId: e.currentTarget.dataset.domid,
          conlCIdx:e.currentTarget.dataset.cidx,
          conlIdx:e.currentTarget.dataset.idx,
        })
        
      }else{
        wx.showToast({
          title: '您的权限无法使用该功能',
          icon: 'none',
          duration: 3000
        })
      }
    })

  },
  handleBtnOk(e) {
    let _this = this;
    let opeateText = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].opeateText`;
    let opeateClass = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].opeateClass`;
    let isOpeating = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].isOpeating`;

    let onoffComp = this.selectComponent(`#${_this.data.hasCompId}`);

    this.setData({
      isVisibleSwitch: false,
      [opeateClass]:'doing',
      [opeateText]:'正在操作...',
      [isOpeating]:true,
    })

    //调用修改控制器接口
    post(urlData.iotDeviceEditControlState, {
      "companyId": wx.getStorageSync('CID'),
      "deviceId": _this.data.controlList[_this.data.conlCIdx].list[_this.data.conlIdx].id,
      "identifier": _this.data.controlList[_this.data.conlCIdx].list[_this.data.conlIdx].identifier,
      "stateKey": _this.data.hasSwitchValue
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if(res.data.respCode === 0){
        //操作成功 才修改 开关状态
        onoffComp.changeSwitchByValue(_this.data.hasSwitchValue);

        _this.setData({
          [opeateClass]:'',
          [opeateText]:'操作成功',
        })
      }else{
        _this.setData({
          [opeateClass]:'failed',
          [opeateText]:'操作失败',
        })
      }
      setTimeout(() => {
        _this.setData({
          [isOpeating]:false,
        })
      }, 1000);
    })
  },
  //取消按钮
  handleBtnCancel(e) {
    this.setData({
      isVisibleSwitch: false,
    })
  },

  //打开/收起分类
  switchCate(e){
    let index = e.currentTarget.dataset.index;
    let item = `controlList[${index}].show`,value = !this.data.controlList[index].show;
    this.setData({
      [item]:value
    })
  },
  //-------------------开关方法 end------------------------

  // -----------------数值型控制器start---------------------
  openControlNumber(e){
    //打开控制器弹窗
    let _this = this, mark = ["iot:device:changestate"];
    ishasPower(mark,function(result){
      if(result[0]){
        _this.setData({
          isVisibleModel: true,
          isFocusModel:true,
          modelValue:e.currentTarget.dataset.num,
          modelName:e.currentTarget.dataset.dname,
          modelRange:`${e.currentTarget.dataset.min} ~ ${e.currentTarget.dataset.max}`,
          conlCIdx:e.currentTarget.dataset.cidx,
          conlIdx:e.currentTarget.dataset.idx,
          hasCompId: e.currentTarget.dataset.domid,
        })
      }else{
        wx.showToast({
          title: '您的权限无法使用该功能',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  modelInputFn(e){
    let value;
    if(e.detail.value.split('.').length>1){
      let leftV = e.detail.value.split('.')[0];
      let rightV = e.detail.value.split('.')[1];
      if(rightV.length>2){
        rightV = rightV.substring(0,2);
      }
      value = leftV+'.'+rightV
    }else{
      value = e.detail.value
    }
    this.setData({
      modelValue:value
    })
  },
  ModelBtnOk(e){
    this.setData({
      modelValue:String(this.data.modelValue).trim()
    })
    if(isNaN(this.data.modelValue) || !this.data.modelValue){
      wx.showToast({
        title: '请输入数值',
        icon: 'none',
        duration: 3000
      })
      return false;
    }else{
      let min = Number(this.data.modelRange.split('~')[0]);
      let max = Number(this.data.modelRange.split('~')[1]);
      if(Number(this.data.modelValue)>max){
        wx.showToast({
          title: '数值不能大于'+max,
          icon: 'none',
          duration: 3000
        })
        return false;
      }

      if(Number(this.data.modelValue)<min){
        wx.showToast({
          title: '数值不能小于'+min,
          icon: 'none',
          duration: 3000
        })
        return false;
      }
    }
    this.setData({
      modelValue:Number(this.data.modelValue)
    })
    let _this = this;
    let opeateText = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].opeateText`;
    let opeateClass = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].opeateClass`;
    let isOpeating = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].isOpeating`;

    this.setData({
      isVisibleModel: false,
      [opeateClass]:'doing',
      [opeateText]:'正在操作...',
      [isOpeating]:true,
      isFocusModel: false
    })

    let value = `controlList[${_this.data.conlCIdx}].list[${_this.data.conlIdx}].value`

    post(urlData.iotDeviceEditControlState, {
      "companyId": wx.getStorageSync('CID'),
      "deviceId": _this.data.controlList[_this.data.conlCIdx].list[_this.data.conlIdx].id,
      "identifier": _this.data.controlList[_this.data.conlCIdx].list[_this.data.conlIdx].identifier,
      "stateKey": _this.data.modelValue
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if(res.data.respCode === 0){
        //操作成功 才修改
        let iconComp = this.selectComponent(`#${_this.data.hasCompId}`);
        iconComp.updateNum(_this.data.modelValue);
        _this.setData({
          [value]:_this.data.modelValue,
          [opeateClass]:'',
          [opeateText]:'操作成功',
        })
      }else{
        _this.setData({
          [opeateClass]:'failed',
          [opeateText]:'操作失败',
        })
      }
      
      setTimeout(() => {
        _this.setData({
          [isOpeating]:false,
        })
      }, 1000);
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

  // 接口--获取视频列表
  getVideoList() {
    var _this = this;
    return post(urlData.iotCameraList, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if (res.data.respCode === 0){
        //默认重新刷新视频接口时自动选中第一个视频源，并判断是否wifi状态下才自动播放
        _this.setData({
          videoList: JSON.parse(JSON.stringify(res.data.obj.list)),
          videoIndex:0,
          videoId:res.data.obj.list[0]?res.data.obj.list[0].id:null,
          videoUrl:res.data.obj.list[0]?res.data.obj.list[0].hlsUrl||res.data.obj.list[0].hlsUrlHd:null,
        })
        setTimeout(() => {
          _this.getVideoContext();
          _this.initClientRect();
        }, 300);
      }
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
      if (res.data.respCode === 0&&res.data.obj.length>0){
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
          tabs: JSON.parse(JSON.stringify(tabArr)),
          sensorList:[],
          controlList:[],
          integList:[],
        })
        if(_this.data.activeTab){
          //刷新时需要记住上一次选择的tab
          let bool = false;
          tabArr.forEach((item)=>{
            if(item.productType == _this.data.activeTab){
              bool = true;
              return false;
            }
          })
          if(!bool){
            _this.setData({
              activeTab:tabArr[0]?tabArr[0].productType:null,
            })
          }
        }else{
          //初次加载 默认选中第一个
          _this.setData({
            activeTab:tabArr[0]?tabArr[0].productType:null,
          })
        }
        
        setTimeout(() => {
          this.initClientRect();  //在获取视频列表时已经调用过这个方法，但是以防在视频列表调用时，这个tab的dom还未渲染，所以在这里再次调用          
        }, 300);
        if(this.data.activeTab=='SENSOR'){
          this.getSensorList()
        }else if(this.data.activeTab=='CONTROLLER'){
          this.getControlList();
        }else{
          this.getIntegList();
        }
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
      if(res.data.respCode === 0){
        let data = res.data.obj,list;
        if(data.length>0){
          list = res.data.obj.map((item,index)=>{
            let deviceData={
              proList:[]    //设备子属性列表
            };
            deviceData.id = item.id;    //设备id
            deviceData.name = item.clientDisplayName;    //设备显示名称
            deviceData.type = item.productVO.productCategory;    //设备类型SENSOR:WATER-水质类，SENSOR:SOIL-土壤类，SENSOR:GAS-气体类，SENSOR:METEOROLOGY-气象类,该字段为空则表示未设置分类
            deviceData.logo = item.productVO.productLogo?item.productVO.productLogo:'https://zaiot.oss-cn-hangzhou.aliyuncs.com/wechat/img/icon_eq_default.png';    //logo
            deviceData.proLength = item.devicePropertyDTOList.length;    //子属性个数
            // 子属性遍历
            item.devicePropertyDTOList.forEach((its)=>{
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
              if(String(its.propertyValue).indexOf('.')!=-1){
                //保留小数点后1位
                its.propertyValue = String(its.propertyValue).split('.')[0]+'.'+(String(its.propertyValue).split('.')[1]).substring(0,1);
                if(its.propertyValue==parseInt(its.propertyValue)){		//比如19.0要写成19
                  its.propertyValue = parseInt(its.propertyValue)
                }
              }
              proItem.value = its.propertyValue;    //属性的当前状态值
              proItem.valueLen = String(its.propertyValue).split('').length;    //属性的当前状态值
              proItem.pName = its.name;     //属性名称
              its.proItem = proItem;
              deviceData.isOnline = item.deviceState=='ONLINE'?true:false;
              deviceData.proList.push(its);
            })
            return deviceData;
          })
          _this.switchSensor(list)
        }
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

  //控制设备的分类
  switchController(list){
    let cateList = [],arr = [];
    if(list.length>1){
      for(var i=0;i<list.length;i++){
        if(list[i+1]){
          if(i==list.length-2){
            if(list[i].cateId != list[i+1].cateId){
              //说明不再是同一个类型
              arr.push(list[i]);
              cateList.push(arr);
              arr = [];
              arr.push(list[i+1]);
              cateList.push(arr);
              arr = [];
            }else{
              arr.push(list[i]);
              arr.push(list[i+1]);
            }
          }else{
            if(list[i].cateId != list[i+1].cateId){
              //说明不再是同一个类型
              arr.push(list[i]);
              cateList.push(arr);
              arr = [];
            }else{
              arr.push(list[i]);
            }
          }
        }
      }
    }else{
      //只有一个设备
      arr.push(list[0]);
    }
    if(arr.length>0){
      cateList.push(arr);
    }
    let realList = [];
    cateList.forEach((item,index)=>{
      var obj = {
        show:false,   //是否展开
        list:item,
        name:item[0].cateType,
        logo:item[0].cateLogo,
      }
      realList.push(obj)
    })
    this.setData({
      controlList:realList
    })
    return cateList;
  },

  //获取控制设备下的所有设备列表
  getControlList(){
    var _this = this;
    post(urlData.iotDeviceSListByProType, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id,
      "productType": 'CONTROLLER'
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if(res.data.respCode === 0){
        let data = res.data.obj,list;
        if(data.length>0){
          list = res.data.obj.map((item,index)=>{
            let deviceData={}
            deviceData.id = item.id;    //设备id
            deviceData.name = item.clientDisplayName;    //设备显示名称
            deviceData.cateId = item.controllerCategoryId;     //控制器分类的分类id 其他类为0
            deviceData.cateType = item.controllerCategoryVO.categoryName;     //控制器分类（null为其他类） 
            deviceData.cateLogo = item.controllerCategoryVO.categoryLogo;    //分类的logo
            
            // 因为控制设备的属性值暂时只有一个，所以直接用角标为0的属性
            deviceData.numType = item.devicePropertyDTOList[0].dataType;    //数据类型，bool是开关，enum是开关停，数值型是int或float或double
            deviceData.identifier = item.devicePropertyDTOList[0].identifier;   //属性的唯一标识符
            deviceData.value = item.devicePropertyDTOList[0].propertyValue;   //数值
            if(deviceData.numType!='bool'&&deviceData.numType!='enum'){
              deviceData.specsNumber = item.devicePropertyDTOList[0].specsNumber;    //数值型的数据对象（含单位，最大值，最小值，步长）
            }
            deviceData.opeateText = '';     //操作文案
            deviceData.opeateClass = '';     //操作的样式class值
            deviceData.isOpeating = false;     //是否在操作中
            deviceData.isOnline = item.deviceState=='ONLINE'?true:false;      //是否在线
            // deviceData.isOnline = true;      //是否在线   假的
            return deviceData;
          })
          _this.switchController(list)
        }
      }
    })
  },

  //获取综合设备列表
  getIntegList(){
    let _this = this;
    post(urlData.iotDeviceSListByProType, {
      "companyId": wx.getStorageSync('CID'),
      "deviceGroupId": wx.getStorageSync('GID').id,
      "productType": 'INTEGRATED'
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if(res.data.respCode === 0){

        _this.setData({
          integList:[...res.data.obj]
        })
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
      if(res.data.respCode === 0){
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
          //然后刷新首页
          this.startPageFn();
        }
        this.setData({
          areaList:areaList,
          isShowAreaSwitch: true
        })
      }
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
      this.data.videoContext.stop();
      this.setData({
        isAutoplay: false,
        isVideoPlay: false
      })
    }
    // 切换之后需要重新拉去视频列表，设备列表
    this.getVideoList();
    this.getTabList();
    //切换之后需要将videoScrollLeft重新置0
    this.setData({
      videoScrollLeft:0,
    })
  },
  //收起区域切换
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
          let video = _this.data.videoContext;
          video.play();
          _this.setData({
            isAutoplay: true,
            isVideoPlay: true,
            isShowVideoLoad:true,
            isPoster:false
          })
        } else {
          let video = _this.data.videoContext;
          video.stop();
          _this.setData({
            isAutoplay: false,
            isVideoPlay: false,
            isShowVideoLoad: true,
            isPoster:true,
          })
        }
      }
    })
  },

  //初始化页面方法
  startPageFn(){
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
    this.setData({
      videoScrollLeft:0,
    })
  },
  // -------------------接口调用方法 end---------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('GID', {
      name: '全部区域',
      id: -1
    });
    this.startPageFn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //如果没有CID 需要重新刷企业列表
    if(!wx.getStorageSync('CID')&&wx.getStorageSync('CID')!=0){
      getCompanyList((res)=>{
        if (res.data.obj.totalCount >= 1) {
            getCompany(res.data.obj.list[0].id,function(){
              _this.startPageFn();
            })
        }
      });
    }

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

    // if(!this.data.tabTopHeight){
    //   //如果tabTopHeight为null（当tab的dom可能为渲染时，获取不到值时，会将tabTopHeight设置为null），则获取一遍-以防万一（现有一bug：在视频控制进入视频设置并修改了视频的名称/区域，
    //   //导致刷新视频列表，并让该区域没有视频，并需要关闭控制状态，需要重新计算tabTopHeight，但dom未生成，获取不到，而想出的方法↓）
    //   this.initClientRect();
    // }
    if(this.data.isFromSet){
      this.getVideoList().then(()=>{
        this.isInVideoList(this.data.isFromSetId)
        this.setData({
          isFromSet:false,
          isFromSetId:null
        })
      })
    }
  },
  // 页面滚动监听方法
  onPageScroll: function (scroll, that) {
    // console.log('this.data.tabTopHeight:'+this.data.tabTopHeight)
    if(this.data.tabTopHeight == null) return ;
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
    setTimeout(()=>{
      this.data.videoContext.stop();
      this.setData({
        isVideoPlay: false,
        isShowVideoLoad: true,
        isShowAreaSwitch: false,   //区域选择列表 隐藏
      });
    },500)
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
    if (this.data.isShowAreaSwitch||this.data.isVideoFixed){  //在视频 控制时 和 选择区域 和 视频置顶时，没有刷新
      wx.stopPullDownRefresh()
    }else{
      this.startPageFn();
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
