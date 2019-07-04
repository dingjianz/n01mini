// pages/regional-detail/regional-detail.js
import { post, urlData, ishasPower, checkBt } from '../../utils/util';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // iphoneX
    isIPX: false,
    // ios
    isIos: false,
    // 控制/监控设备 - 1
    devicesFirst: [],
    // 摄像头设备 - 2
    devicesSecond: [],
    // 列表切换
    switchDeviceTabs: true,
    // 是否点添加设备进入的
    isAddDevice: false,
    // 是否拥有管理员权限
    // isAdmin: true,
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
    // 复选框所选区域名称
    checkRegionalName: '',
    // 当前的区域id
    regionalId: undefined,
    // 当前区域名称
    regionalName: undefined,
    // 可修改的区域名称
    editRegionalName: '',
    // 当前区域设备个数
    devicesNum: 0,
    // 弹框按钮
    actions: [
      {
        name: '取消',
        color: '#395787',
      },
      {
        name: '确定',
        color: '#5689D7'
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
        color: '#8C1F1F',
      }
    ],
    // 权限
    power: {
      editRegionalName: false,
      editDeviceRegional: false,
      deleteRegional: false
    }
  },

  // tabs 切换
  switchTabs({ currentTarget }) {
    this.setData({
      switchDeviceTabs: Number(currentTarget.dataset.tabs)
    })
  },

  // 修改区域名称
  editRegional({ currentTarget }) {
    if (this.data.regionalId === 0 || !this.data.power.editRegionalName) {
      return false;
    }
    this.openModal({ currentTarget });
  },

  // 底部按钮操作
  handleRegion({ currentTarget }) {
    if (!this.data.isAddDevice) {
      this.openModal({
        currentTarget
      })
      return false;
    }
    wx.navigateBack({
      delta: 1
    })
  },

  // 修改区域名称
  handleRegionalNameModal({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'regionalNameModal'
    switch (detail.index) {
      case 0: // 取消
        this.setData({
          editRegionalName: this.data.regionalName
        });
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        if (!this.data.editRegionalName.trim()) {
          wx.showToast({
            title: '请输入区域名称',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          return false;
        };
        if (!checkBt(this.data.editRegionalName, 20)) {
          wx.showToast({
            title: '区域名称最多20个字',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          return false;
        }
        this.editRegionalNameFn()
          .then(() => {
            this.setData({
              regionalName: this.data.editRegionalName
            });
            this.closeModal({ currentTarget });
          })
        break;
      default:
        break;
    }
  },

  // 移动其他区域设备弹框提示
  handleMoveDeviceModal({ currentTarget, detail }) {
    let group = currentTarget.dataset.group;
    let index = currentTarget.dataset.index;

    currentTarget.dataset.modal = 'moveDeviceModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        switch (group) {
          case 'devicesFirst':
            this.editDeviceRegional({
              deviceId: this.data[group][index].id,
              deviceGroupId: this.data.regionalId,
            })
              .then(() => {
                this.data[group][index].checked = true;
                this.data[group][index].otherRegional = false;
                this.data[group][index].status = '已添加';
                this.setData({
                  [group]: this.data[group]
                });
                this.closeModal({ currentTarget });
              })
            break;
          case 'devicesSecond':
            this.editCameraRegional({
              deviceId: this.data[group][index].id,
              deviceGroupId: this.data.regionalId,
            })
              .then(() => {
                this.data[group][index].checked = true;
                this.data[group][index].otherRegional = false;
                this.data[group][index].status = '已添加';
                this.setData({
                  [group]: this.data[group]
                });
                this.closeModal({ currentTarget });
              })
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  },

  // 删除整个区域的提示
  handleDeleteRegionalModal({ currentTarget, detail }) {
    currentTarget.dataset.modal = 'deleteRegionalModal'
    switch (detail.index) {
      case 0: // 取消
        this.closeModal({ currentTarget });
        break;
      case 1: // 确认
        // 此处需要逻辑处理
        this.deleteRegional()
          .then(() => {
            this.closeModal({ currentTarget });
          })
        break;
      default:
        break;
    }
  },

  // 操作设备所在区域
  handleCheckbox({ currentTarget }) {
    let dataset = currentTarget.dataset;
    let group = dataset.group;
    let index = dataset.index;
    let checked = this.data[group][index].checked;
    let otherRegional = this.data[group][index].otherRegional;
    let checkRegionalName = this.data[group][index].status;
    if (this.data.regionalId === 0 || !this.data.power.editDeviceRegional) {
      return false;
    }
    // 其他区域的弹框提示不包括默认区域
    if (otherRegional && !checked) {
      currentTarget.dataset.modal = 'moveDeviceModal';
      this.setData({
        checkIndex: index,
        checkGroup: group,
        checkRegionalName
      });
      this.openModal({
        currentTarget
      })
      return true;
    }
    // 非其他区域包括默认区域
    this.data[group][index].checked = !checked;
    this.data[group][index].status = !checked ? '已添加' : '[默认区域]';
    switch (group) {
      case 'devicesFirst':
        this.editDeviceRegional({
          deviceId: this.data[group][index].id,
          deviceGroupId: this.data[group][index].checked ? this.data.regionalId : 0,
        })
          .then(() => {
            this.setData({
              [group]: this.data[group]
            });
          })
        break;
      case 'devicesSecond':
        this.editCameraRegional({
          deviceId: this.data[group][index].id,
          deviceGroupId: this.data[group][index].checked ? this.data.regionalId : 0,
        })
          .then(() => {
            this.setData({
              [group]: this.data[group]
            });
          })
        break;
      default:
        break;
    }
  },

  // 移动设备到我的区域
  editDeviceRegional({ deviceId, deviceGroupId }) {
    return new Promise((resolve, reject) => {
      post(urlData.iotDeviceEditGroup, {
        companyId: wx.getStorageSync('CID'),
        deviceId,
        deviceGroupId
      }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          if (res.respCode === 0) {
            // console.log(res);
            // console.log(this.data.devicesFirst);
            resolve();
            this.setData({
              devicesNum: deviceGroupId === 0 ? --this.data.devicesNum : ++this.data.devicesNum
            })
          }
        })
    })
  },
  // 移动摄像头到我的区域
  editCameraRegional({ deviceId, deviceGroupId }) {
    return new Promise((resolve, reject) => {
      post(urlData.iotCameraEditGroup, {
        companyId: wx.getStorageSync('CID'),
        cameraId: deviceId,
        deviceGroupId
      }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          if (res.respCode === 0) {
            // console.log(res);
            // console.log(this.data.devicesFirst);
            resolve();
            this.setData({
              devicesNum: deviceGroupId === 0 ? --this.data.devicesNum : ++this.data.devicesNum
            })
          }
        })
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

  // 删除整个区域
  deleteRegional() {
    const GID = wx.getStorageSync('GID');
    return new Promise((resolve, reject) => {
      post(urlData.iotDeviceGroupDel, {
        companyId: wx.getStorageSync('CID'),
        deviceGroupId: this.data.regionalId
      }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          if (res.respCode === 0) {
            resolve();
            if (GID.id !== this.data.regionalId) {
              wx.navigateBack({
                delta: 1
              });
            } else {
              wx.setStorageSync('GID', {
                name: '全部区域',
                id: -1
              });
              wx.reLaunch({
                url: '/pages/index/index',
              });
            }
            return true;
          }
          // wx.showToast({
          //   title: res.respDesc,
          //   icon: 'none',
          //   duration: 3000,
          //   mask: true
          // });
        })
    });
  },

  // 获取该区域下的设备
  getDevices() {
    post(urlData.iotDeviceListByChoose, {
      companyId: wx.getStorageSync('CID'),
      deviceGroupId: this.data.regionalId
    }, wx.getStorageSync('TOKEN'))
      .then((response) => {
        let res = response.data;
        let data = res.obj;
        let inDevices, outDevices, devicesFirst;
        if (res.respCode === 0) {
          wx.hideLoading();
          inDevices = data.inGroupList.map((item) => {
            return {
              id: item.id,
              icon: item.productVO.productLogo || 'https://zaiot.oss-cn-hangzhou.aliyuncs.com/wechat/img/icon_eq_default.png',
              name: item.clientDisplayName,
              status: (() => {
                if (!this.data.power.editDeviceRegional) return `[${this.data.regionalName}]`;
                return this.data.regionalId !== 0 ? '已添加' : '[默认区域]'
              })(),
              checked: true,
              checkedValue: item.clientDisplayName,
              otherRegional: false
            }
          });
          outDevices = (this.data.regionalId !== 0 && this.data.power.editDeviceRegional)
            ? data.notInGroupList.map((item) => {
              return {
                id: item.id,
                icon: item.productVO.productLogo || 'https://zaiot.oss-cn-hangzhou.aliyuncs.com/wechat/img/icon_eq_default.png',
                name: item.clientDisplayName,
                status: item.deviceGroupVO ? `[${item.deviceGroupVO.groupName}]` : '[默认区域]',
                checked: false,
                checkedValue: item.clientDisplayName,
                otherRegional: Boolean(item.deviceGroupVO)
              }
            })
            : [];
          devicesFirst = [...inDevices, ...outDevices];
          this.setData({
            devicesFirst,
            switchDeviceTabs: Boolean(devicesFirst.length)
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 3000)
        }
      })
  },

  // 获取该区域下的摄像头
  getCameras() {
    post(urlData.iotCameraListByChoose, {
      companyId: wx.getStorageSync('CID'),
      deviceGroupId: this.data.regionalId
    }, wx.getStorageSync('TOKEN'))
      .then((response) => {
        let res = response.data;
        let data = res.obj;
        let inDevices, outDevices;
        if (res.respCode === 0) {
          wx.hideLoading();
          inDevices = data.inGroupList.map((item) => {
            return {
              id: item.id,
              icon: 'https://zaiot.oss-cn-hangzhou.aliyuncs.com/wechat/img/icon_video_default.png',
              name: item.displayName,
              status: (() => {
                if (!this.data.power.editDeviceRegional) return `[${this.data.regionalName}]`;
                return this.data.regionalId !== 0 ? '已添加' : '[默认区域]'
              })(),
              checked: true,
              checkedValue: item.displayName,
              otherRegional: false
            }
          });
          outDevices = (this.data.regionalId !== 0 && this.data.power.editDeviceRegional)
            ? data.notInGroupList.map((item) => {
              return {
                id: item.id,
                icon: 'https://zaiot.oss-cn-hangzhou.aliyuncs.com/wechat/img/icon_video_default.png',
                name: item.displayName,
                status: item.deviceGroupVO ? `[${item.deviceGroupVO.groupName}]` : '[默认区域]',
                checked: false,
                checkedValue: item.displayName,
                otherRegional: Boolean(item.deviceGroupVO)
              }
            })
            : [];
          this.setData({
            devicesSecond: [...inDevices, ...outDevices]
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 3000)
        }
      })
  },

  changeEditRegionalName({ detail }) {
    this.setData({
      editRegionalName: detail.value
    })
  },

  // 修改区域名称
  editRegionalNameFn() {
    return new Promise((resolve, reject) => {
      post(urlData.iotDeviceGroupEdit, {
        companyId: wx.getStorageSync('CID'),
        deviceGroupId: this.data.regionalId,
        groupName: this.data.editRegionalName.trim()
      }, wx.getStorageSync('TOKEN'))
        .then((response) => {
          let res = response.data;
          let data = res.obj;
          if (res.respCode === 0) {
            return resolve();
          }
          // 重名
          if (res.respCode === 300) {
            wx.showToast({
              title: res.respDesc,
              icon: 'none',
              duration: 3000,
              mask: true
            });
          }
        })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let reg = /ios/i;
    this.setData({
      regionalId: Number(options.regionalId),
      regionalName: options.regionalName,
      editRegionalName: options.regionalName,
      devicesNum: options.devicesNum,
      isAddDevice: options.fn === 'add',
      isIPX: app.globalData.isIx,
      isIos: reg.test(wx.getSystemInfoSync().system)
    });
    if (this.data.isAddDevice) {
      wx.setNavigationBarTitle({
        title: this.data.regionalName
      })
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
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    ishasPower(['iot:devicegroup:edit', 'iot:devicegroup:del', 'iot:device:edit:group'], (p) => {
      // console.log(p);
      this.setData({
        power: {
          editRegionalName: p[0],
          deleteRegional: p[1],
          editDeviceRegional: p[2]
        }
      })
    })
    this.getDevices();
    this.getCameras();
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