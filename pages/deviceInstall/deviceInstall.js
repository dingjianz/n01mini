import {
  post,
  urlData,
  throttle,
  ishasPower,
  checkBt
} from '../../utils/util.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    deviceName: '',
    editDeviceName: '', // 修改后的设备名称
    groupName: '', // 所在区域名
    groupId: '', // 所在区域id
    categoryName: '', // 控制器分组名称 
    controllerCategoryId: '', // 控制器分组ID 
    visible: false,
    companyOrPerson: true, // true为团队，false为个人
    selectFlag: false, // 设备分类显示控制  true显示 false不显示
    isFocus: false,

    //权限↓
    power_name: false,
    power_cate: false,
    power_area: false
  },
  handleOpen: function () {
    if (!this.data.power_name) {
      wx.showToast({
        title: '您的权限无法使用该功能',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    this.setData({
      visible: true,
      isFocus: true
    })
  },
  inputeidt({
    detail
  }) {
    this.setData({
      editDeviceName: detail.value
    })
  },
  editDeviceName() {
    post(urlData.iotDeviceEditName, {
      clientDisplayName: this.data.editDeviceName.trim(),
      companyId: wx.getStorageSync('CID'),
      deviceId: this.data.deviceId
    }, wx.getStorageSync('TOKEN')).then(res => {
      if (res.data.respCode === 0) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        this.setData({
          deviceName: this.data.editDeviceName.trim(),
          isFocus: false
        })
        if (prevPage.getdeviceData) {
          prevPage.getdeviceData()
        };
      }
    })
  },
  handleEnsure() { // 提交修改的设备名称
    if (!checkBt((this.data.editDeviceName).trim(), 16)) {
      wx.showToast({
        title: '设备名称最多16个字',
        icon: 'none',
        duration: 3000
      })
    } else if (!(this.data.editDeviceName).trim()) {
      wx.showToast({
        title: '请输入设备名称',
        icon: 'none',
        duration: 3000
      })
    } else {
      throttle(this.editDeviceName())
      //更新首页信息
      let pages = getCurrentPages();
      let indexPage; //首页
      pages.forEach((item, index) => {
        if (item.route == 'pages/index/index') {
          indexPage = item;
          return false;
        }
      })
      if (indexPage) {
        indexPage.getTabList()
      }
      this.setData({
        visible: false
      })
    }
  },
  handleCancel() { // 模态框关闭
    this.setData({
      visible: false,
      isFocus: false,
      editDeviceName: this.data.deviceName
    })
  },
  turnToSelectType() { // 设备分类跳转
    if (!this.data.power_cate) {
      wx.showToast({
        title: '您的权限无法使用该功能',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/deviceSelectType/deviceSelectType?deviceId=' + this.data.deviceId + '&controllerCategoryId=' + this.data.controllerCategoryId
    })
  },
  turnToAreaSelect() { // 所属区域跳转
    if (!this.data.power_area) {
      wx.showToast({
        title: '您的权限无法使用该功能',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/areaSelect/areaSelect?deviceId=' + this.data.deviceId + '&groupId=' + this.data.groupId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    //权限
    let _this = this,
      mark = ["iot:device:edit:group", "iot:device:edit:name", "iot:device:edit:category"];
    ishasPower(mark, function (result) {
      if (result[0]) {
        //设备区域
        _this.setData({
          power_area: true
        })
      }

      if (result[1]) {
        //设备名称
        _this.setData({
          power_name: true
        })
      }

      if (result[2]) {
        //设备分类
        _this.setData({
          power_cate: true
        })
      }
    })
    let selectFlag = option.selectFlag === 'true' ? true : false;
    if (wx.getStorageSync('CID') === 0) { // 判断是否是个人设备
      this.setData(({
        companyOrPerson: false,
        selectFlag: selectFlag,
        deviceName: option.deviceName,
        deviceId: option.deviceId,
        groupName: option.groupName,
        groupId: option.groupId,
        categoryName: option.categoryName || '',
        controllerCategoryId: option.controllerCategoryId || '',
        editDeviceName: option.deviceName
      }))
    } else {
      this.setData(({
        companyOrPerson: true,
        selectFlag: selectFlag,
        deviceName: option.deviceName,
        deviceId: option.deviceId,
        groupName: option.groupName,
        groupId: option.groupId,
        categoryName: option.categoryName || '',
        controllerCategoryId: option.controllerCategoryId || '',
        editDeviceName: option.deviceName
      }))
    }
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