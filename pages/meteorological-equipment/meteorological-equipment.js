// pages/meteorological-equipment/meteorological-equipment.js
import { urlData, post ,ishasPower} from '../../utils/util.js'
//模拟数据
let testArr = [    
  {
      "id": 11,
      "name": "湿帘",
      "identifier": "Switch",
      "accessMode": "rw",
      "dataSource": "{\"specs\":{\"period\":1,\"code\":1,\"min\":0,\"max\":1,\"num\":1,\"id\":1,\"addr\":0,\"vt\":\"byte\"},\"protocol\":\"ModbusRTU\"}",
      "dataType": "bool",
      "specs": "{\"0\":\"关\",\"1\":\"开\"}",
      "deviceId": 27,
      "specsEnumList": [
          {
              "key": "0",
              "keyValue": "关"
          },
          {
              "key": "1",
              "keyValue": "开"
          }
      ],
      "specsNumber": null,
      "propertyValue": "0",
      "valueLastTime": null
  },
  {
      "id": 14,
      "name": "数值",
      "identifier": "Value",
      "accessMode": "rw",
      "dataSource": " {\"protocol\":\"Splines\",\"specs\":{\"max\":10000000,\"min\":-10000000,\"prec\":2,\"xs\":[0.021,0.992],\"ys\":[0.009,0.004]}}",
      "dataType": "double",
      "specs": "{\"max\":\"1000000\",\"min\":\"-1000000\",\"step\":\"0.000001\"}",
      "deviceId": 31,
      "specsEnumList": null,
      "specsNumber": {
          "unit": null,
          "min": "-1000000",
          "max": "1000000",
          "step": "0.000001"
      },
      "propertyValue": "1222",
      "valueLastTime": 1561431681139
  },
  {
      "id": 13,
      "name": "开关停",
      "identifier": "OCS",
      "accessMode": "rw",
      "dataSource": "{\"specs\":{\"min\":1,\"prec\":0,\"max\":3,\"ys\":[0.084,0.594,0.584,0.114],\"xs\":[0.048,0.356,0.661,0.912]},\"protocol\":\"Splines\"}",
      "dataType": "enum",
      "specs": "{\"1\":\"开\",\"2\":\"关\",\"3\":\"停\"}",
      "deviceId": 29,
      "specsEnumList": [
          {
              "key": "1",
              "keyValue": "开"
          },
          {
              "key": "2",
              "keyValue": "关"
          },
          {
              "key": "3",
              "keyValue": "停"
          }
      ],
      "specsNumber": null,
      "propertyValue": "2",
      "valueLastTime": 1561434449914
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:null,  //设备id
    deviceName: null, // 设备名称
    groupName: null, // 区域名称
    groupId: null, // 区域id
    clientDisplayName: '', // 设备展示名称

    actionType:'',    // 开关弹窗的动作行为
    hasSwitchType:null,    //存放“开关”弹出弹窗时保存的开关类型
    hasSwitchIndex:0,     //存放“开关”弹出弹窗时保存的开关index
    hasSwitchId:null,       //存放点击的开关的id值
    isVisibleSwitch: false, // 是否显示开关确认弹窗

    deviceObj:null,   //设备部分属性
    proList:[],   //设备属性列表
    rList:[],    //只读属性列表
    rwList:[],      //可读写 属性列表
    isOnline:true,  //设备是否是在线
    
    equipProName:null,  //存放 弹窗弹出时 属性名称
    hasSwitchValue:0,     //存放“开关”弹出弹窗时保存的开关value值
    hasCompId:null,       //存放点击的开关/iconfont组件的id值

    
    modelValue:'',    //数值型控制器的input的value
    modelName:'',     //数值型控制器的标题
    modelRange:'',      //数值型控制器的 范围
    isFocusModel:false, //是否自动聚焦控制器中的input
    isVisibleModel:false, //是否显示数值型控制器弹窗

    power_set:false,    //设置权限
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
        console.log('switchValue'+switchValue)
        _this.setData({
          isVisibleSwitch:true,
          actionType:e.detail.name,
          equipProName:e.currentTarget.dataset.dname,
          hasSwitchType: e.detail.type,
          hasSwitchValue:switchValue,
          hasCompId: e.currentTarget.dataset.domid,
          hasSwitchIndex:e.currentTarget.dataset.index
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
    let opeateText = `rwList[${_this.data.hasSwitchIndex}].opeateText`;
    let opeateClass = `rwList[${_this.data.hasSwitchIndex}].opeateClass`;
    let isOpeating = `rwList[${_this.data.hasSwitchIndex}].isOpeating`;

    let onoffComp = this.selectComponent(`#${_this.data.hasCompId}`);

    this.setData({
      isVisibleSwitch: false,
      [opeateClass]:'doing',
      [opeateText]:'正在操作...',
      [isOpeating]:true,
    })

    console.log('开关的value：'+_this.data.hasSwitchValue)
    //调用修改控制器接口
    post(urlData.iotDeviceEditControlState, {
      "companyId": wx.getStorageSync('CID'),
      "deviceId": _this.data.rwList[_this.data.hasSwitchIndex].deviceId,
      "identifier": _this.data.rwList[_this.data.hasSwitchIndex].identifier,
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
          hasSwitchIndex:e.currentTarget.dataset.index,
          hasCompId: e.currentTarget.dataset.domid,
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
      modelValue:this.data.modelValue.trim()
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
    let opeateText = `rwList[${_this.data.hasSwitchIndex}].opeateText`;
    let opeateClass = `rwList[${_this.data.hasSwitchIndex}].opeateClass`;
    let isOpeating = `rwList[${_this.data.hasSwitchIndex}].isOpeating`;

    this.setData({
      isVisibleModel: false,
      [opeateClass]:'doing',
      [opeateText]:'正在操作...',
      [isOpeating]:true,
    })

    let value = `rwList[${_this.data.hasSwitchIndex}].propertyValue`

    post(urlData.iotDeviceEditControlState, {
      "companyId": wx.getStorageSync('CID'),
      "deviceId": _this.data.rwList[_this.data.hasSwitchIndex].deviceId,
      "identifier": _this.data.rwList[_this.data.hasSwitchIndex].identifier,
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
  turnToDeviceInstall() {
    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall?selectFlag=false&deviceName=' + this.data.clientDisplayName + '&deviceId=' + this.data.deviceId + '&groupName=' + this.data.deviceObj.areaName + '&groupId=' + this.data.deviceObj.id 
    })
  },
  turnToDeviceDetail() {
    wx.navigateTo({
      url: '/pages/deviceDetail/deviceDetail?close=true'
    })
  },
  turnToRain({ currentTarget }) {
    wx.navigateTo({
      url: '/pages/rainfall/rainfall?deviceId=' + currentTarget.dataset.id + '&index=' + currentTarget.dataset.index + '&title=' + this.data.clientDisplayName
    })
  },

  //---------------------接口调用 start----------------------
  //获取设备详情
  getdeviceData(){
    let _this = this;
    post(urlData.iotDeviceGetDetail, {
      "companyId": wx.getStorageSync('CID'),
      "deviceId": _this.data.deviceId
    }, wx.getStorageSync('TOKEN')).then((res) => {
      if(res.data.respCode === 0){
        let device = res.data.obj.deviceVO;
        _this.setData({
          clientDisplayName: res.data.obj.deviceVO.clientDisplayName || '',
          deviceObj:{
            name:device.displayName,
            areaName:device.deviceGroupId==0?'默认区域':res.data.obj.deviceGroupVO.groupName,
            id: (res.data.obj.deviceGroupVO && res.data.obj.deviceGroupVO.id) || ''
          },
          isOnline:device.deviceState=='ONLINE'?true:false
          // isOnline:true   //假的
        })
        this.getProList(device.devicePropertyDTOList)
      }
    })
  },

  //根据属性列表 进行属性划分
  getProList(list){
    let rList = [],rwList = [];
    list.forEach((item)=>{
      if(item.accessMode=='r'){
        if (item.dataType == "bool" || item.dataType == "enum") {
          //枚举型
          item.specsEnumList.forEach((i) => {
            if (item.propertyValue == i.key) {
              item.enumNumber = i.keyValue;    //枚举对应的value值
              return false;
            }
          })
        }else{
          if (String(item.propertyValue).indexOf('.') != -1) {
            //保留小数点后1位
            item.propertyValue = String(item.propertyValue).split('.')[0] + '.' + (String(item.propertyValue).split('.')[1]).substring(0, 1);
            if (item.propertyValue == parseInt(item.propertyValue)) {		//比如19.0要写成19
              item.propertyValue = parseInt(item.propertyValue)
            }
          }
        }
        rList.push(item);
      }else{
        rwList.push(item);
      }
    })
    rwList.forEach((item,index)=>{
      item.opeateText = '';
      item.opeateClass = '';
      item.isOpeating = false;
    })
    this.setData({
      rList:[...rList],
      rwList:[...rwList],
      // rwList:[...testArr],    //测试数据 假的
    })
  },
  //---------------------接口调用 end------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this, mark = ["iot:device:edit:group","iot:device:edit:name"];
    ishasPower(mark,function(result){
      if(result[0]||result[1]){
        _this.setData({
          power_set:true
        })
      }
    })
    this.setData({
      deviceId:options.id
    })
    this.getdeviceData();
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