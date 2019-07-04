import { post, urlData, ifDate, formatTime ,ishasPower } from '../../utils/util'

const app = getApp();
Page({

  data: {
    // iphoneX
    isIPX: false,
    deviceId: '',
    deviceVO: null, // 设备基础信息
    deviceGroupVO: null, // 设备区域信息
    numType: '',
    pageNum: 1, // 操作记录页
    totalPage: 0, // 总共页数
    logList: [],
    pageSize: 20,
    loadFlag: false, // 底部加载控制器
    numOrTextFlag: true, // 判断是 开关 还是 数字类型，true为开关类型
    switchText: '',
    propertyValue: '', // 属性值
    propertyName: '', // 属性名
    isHasHistory:true, // 是否有历史数据
    power_set:false // 设置权限
  },
  turnToDeviceInstall() {
    let deviceName = this.data.deviceVO.clientDisplayName;
    let groupName = this.data.deviceGroupVO && this.data.deviceGroupVO.groupName || '默认区域';
    let groupId = this.data.deviceGroupVO && this.data.deviceGroupVO.id || '';
    let categoryName = this.data.deviceVO.controllerCategoryVO && this.data.deviceVO.controllerCategoryVO.categoryName || '';
    let controllerCategoryId = this.data.deviceVO && this.data.deviceVO.controllerCategoryId;

    wx.navigateTo({
      url: '/pages/deviceInstall/deviceInstall?selectFlag=true&deviceName=' + deviceName + '&deviceId=' + this.data.deviceId + '&groupName=' + groupName + '&groupId=' + groupId + '&categoryName=' + categoryName + '&controllerCategoryId=' + controllerCategoryId
    })
  },
  getOperateLog(pageNum) {
    let _this = this;
    return new Promise((resolve, reject) => {
      post(urlData.iotDeviceControllerLogList, {
        companyId: wx.getStorageSync('CID'),
        deviceId: this.data.deviceId,
        pageNum: pageNum,
        pageSize: this.data.pageSize
      }, wx.getStorageSync('TOKEN')).then(response => {
        let res = response.data;
        if (res.respCode === 0) {
          let list = res.obj.list;
          if(list.length==0){
            _this.setData({
              isHasHistory:false
            })
          }else{
            _this.setData({
              isHasHistory:true
            })
          }
          for (let item of list) {
            let timeStr1 = ifDate(new Date(item.operTime));
            let timeStr2 = formatTime(new Date(item.operTime)).substr(11,5);
            item.operTime = timeStr1 + " " + timeStr2;
            item.operTime = (timeStr1 + " " + timeStr2).replace(/[/]/g, '.');
            if (item.stateValue === '开') {
              item.stateValue = '开启';
            } else if (item.stateValue === '关') {
              item.stateValue = '关闭';
            } else if (item.stateValue === '停') {
              item.stateValue = '暂停';
            }
          }
          this.data.logList = this.data.logList.concat(list);
          this.setData({
            logList: this.data.logList
          })
          resolve(res);
        }
      })
    })
  },
  getdeviceData() { // 获取设备基本信息
    post(urlData.iotDeviceGetDetail, {
      companyId: wx.getStorageSync('CID'),
      deviceId: this.data.deviceId
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data
      if (res.respCode === 0) {
        this.setData({
          deviceVO: res.obj.deviceVO,
          deviceGroupVO: res.obj.deviceGroupVO,
          propertyValue: Number(res.obj.deviceVO.devicePropertyDTOList[0].propertyValue),
          propertyName:res.obj.deviceVO.devicePropertyDTOList[0].name
        })
        if (this.data.numOrTextFlag && (this.data.numType === 'enum')) {
          switch (this.data.propertyValue) {
            case 1:
              this.setData({
                switchText: '开启'
              })
              break;
            case 2:
              this.setData({
                switchText: '关闭'
              })
              break;
            case 3:
              this.setData({
                switchText: '暂停'
              })
              break;
          }
        } else if (this.data.numOrTextFlag && (this.data.numType === 'bool')) {
          switch (this.data.propertyValue) {
            case 0:
              this.setData({
                switchText: '关闭'
              })
              break;
            case 1:
              this.setData({
                switchText: '开启'
              })
              break;
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this, mark = ["iot:device:edit:group","iot:device:edit:name","iot:device:edit:category"];
    ishasPower(mark,function(result){
      if(result[0]||result[1]||result[2]){
        _this.setData({
          power_set:true
        })
      }
    })
    if (options.numType === 'double') { // 数字型
      this.setData({
        numOrTextFlag: false
      })
    } else { // 开关型
      this.setData({
        numOrTextFlag: true
      })
    }
    let isOnline = options.isOnline === 'true' ? true : false;
    this.setData({
      deviceId: Number(options.deviceId),
      numType: options.numType,
      isOnline: isOnline,
      isIPX: app.globalData.isIx
    })
    this.getdeviceData();


    post(urlData.iotDeviceControllerLogList, {
      companyId: wx.getStorageSync('CID'),
      deviceId: this.data.deviceId,
      pageNum: 1,
      pageSize: this.data.pageSize
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data;
      if (res.respCode === 0) {
        let list = res.obj.list;
        if(list.length==0){
          _this.setData({
            isHasHistory:false
          })
        }else{
          _this.setData({
            isHasHistory:true
          })
        }
        for (let item of list) {
          let timeStr1 = ifDate(new Date(item.operTime));
          let timeStr2 = formatTime(new Date(item.operTime)).substr(11,5);
          item.operTime = (timeStr1 + " " + timeStr2).replace(/[/]/g, '.');
          if (item.stateValue === '开') {
            item.stateValue = '开启';
          } else if (item.stateValue === '关') {
            item.stateValue = '关闭';
          } else if (item.stateValue === '停') {
            item.stateValue = '暂停';
          }
        }
        this.data.logList = this.data.logList.concat(list);
        this.setData({
          logList: this.data.logList,
          totalPage: Math.ceil((res.obj.totalCount) / this.data.pageSize)
        })
      }
    })
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
    if (this.data.pageNum < this.data.totalPage) {
      this.data.pageNum++;
      this.setData({
        loadFlag: true
      })
      this.getOperateLog(this.data.pageNum).then(res => {
        setTimeout(() => {
          this.setData({
            loadFlag: false
          })
        }, 1000)
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})