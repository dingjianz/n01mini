// pages/regional-detail/regional-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 复选框组 - 1
    devicesFirst: [
      {
        icon: '',
        name: '蘑菇大棚1#内遮阳',
        status: '已添加',
        checked: false,
        checkedValue: '蘑菇大棚1#内遮阳',
        otherRegional: false
      },
      {
        icon: '',
        name: '其他综合设备',
        status: '已添加',
        checked: true,
        checkedValue: '其他综合设备',
        otherRegional: false
      },
      {
        icon: '',
        name: '温湿度传感器',
        status: '已添加',
        checked: true,
        checkedValue: '温湿度传感器',
        otherRegional: false
      },
      {
        icon: '',
        name: ' II型综合气象站',
        status: '已添加',
        checked: true,
        checkedValue: 'II型综合气象站',
        otherRegional: false
      }
    ],
    // 复选框组 - 2
    devicesSecond: [
      {
        icon: '',
        name: '智能摄像头',
        status: '已添加',
        checked: false,
        otherRegional: true
      }
    ],
    // 列表切换
    switchDeviceTabs: true,
    // 是否点添加设备进入的
    isAddDevice: false,
    // 是否拥有管理员权限
    isAdmin: true,
    // 修改区域名称弹框
    regionalNameModal: false,
    // 移动设备弹框
    moveDeviceModal: false,
    // 删除区域弹框
    deleteRegionalModal: false,
    // 复选框索引（用于设备的勾选）
    checkIndex: undefined,
    // 复选框所在组（用于设备的勾选）
    checkGroup: undefined,
    // 弹框按钮
    actions: [
      {
        name: '取消',
        color: '#395787',
      },
      {
        name: '确定',
        color: '#456EAD'
      },
    ],
    // 删除区域弹框按钮
    deleteActions: [
      {
        name: '我再想想',
        color: '#395787'
      },
      {
        name: '确定删除',
        color: '#C23634',
      }
    ]
  },

  switchTabs({ currentTarget }) {
    this.setData({
      switchDeviceTabs: Number(currentTarget.dataset.tabs)
    })
  },

  handleRegion({ currentTarget }) {
    if (!this.data.isAddDevice) {
      this.openModal({
        currentTarget
      })
    }
  },

  handleRegionalNameModal({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'regionalNameModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        this.closeModal({ currentTarget });
        break;
      default:
        break;
    }
  },
  handleMoveDeviceModal({ currentTarget, detail }) {
    let id = currentTarget.dataset.id;
    let index = currentTarget.dataset.index;

    currentTarget.dataset.modal = 'moveDeviceModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        this.data[id][index].checked = true;
        this.setData({
          [id]: this.data[id]
        });
        this.closeModal({ currentTarget });
        break;
      default:
        break;
    }
  },
  handleDeleteRegionalModal({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'deleteRegionalModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        this.closeModal({ currentTarget });
        break;
      default:
        break;
    }
  },
  handleCheckbox({ currentTarget }) {
    let dataset = currentTarget.dataset;
    let id = dataset.id;
    let index = dataset.index;
    let checked = this.data[id][index].checked;
    if (checked) {
      this.data[id][index].checked = false;
      this.setData({
        [id]: this.data[id]
      });
      return true;
    }

    currentTarget.dataset.modal = 'moveDeviceModal';
    this.setData({
      checkIndex: index,
      checkGroup: id
    });
    this.openModal({
      currentTarget
    })
  },
  // 打开弹框-可抽至于公共方法 *
  openModal({ currentTarget }) {
    this.setData({
      [currentTarget.dataset.modal]: true
    })
  },
  // 关闭弹框-可抽至于公共方法 *
  closeModal({ currentTarget }) {
    this.setData({
      [currentTarget.dataset.modal]: false
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