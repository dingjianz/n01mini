import { post, urlData } from '../../utils/util.js'
const app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: false,
    selectedIndex: 0,
    groupList: [],
    deviceId: '',
    groupId: '',
    isIx:app.globalData.isIx
  },
  selectIndex({ currentTarget }) {
    if(this.data.selectedIndex == currentTarget.dataset.selectedindex){
      return false;
    }
    post(urlData.iotDeviceEditGroup, {
      companyId: wx.getStorageSync('CID'),
      deviceGroupId: currentTarget.dataset.devicegroupid,
      deviceId: this.data.deviceId
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data
      if (res.respCode === 0) {
        this.setData({
          selectedIndex: currentTarget.dataset.selectedindex
        })
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          groupName: currentTarget.dataset.groupname,
          groupId: currentTarget.dataset.devicegroupid
        })
        let indexPage;  //首页
        pages.forEach((item,index)=>{
          if(item.route=='pages/index/index'){
            indexPage = item;
            return false;
          }
        })
        if(indexPage){
          indexPage.getTabList()
        }
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceId: options.deviceId,
      groupId: Number(options.groupId),
      isIPX: app.globalData.isIx
    })
    post(urlData.iotDeviceGroupListCount, {
      companyId: wx.getStorageSync('CID')
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data
      console.log(JSON.stringify(res))
      if (res.respCode === 0) {
        this.setData({
          groupList: res.obj
        })
        console.log(JSON.stringify(this.data.groupList))
        this.data.groupList.forEach((item, index) => {
          if (item.groupVO.id === this.data.groupId) {
            this.setData({
              selectedIndex: index
            })
            return false;
          }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})