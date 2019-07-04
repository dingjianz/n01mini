// pages/deviceSelectType/deviceSelectType.js
import { post, urlData } from '../../utils/util.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // iphoneX
    isIPX: false,
    selectedIndex: 0,
    typeList: [],
    categoryId: '',
    categoryName: '',
    deviceId: ''
  },
  selectIndex({ currentTarget }) {
    this.setData({
      categoryId: currentTarget.dataset.categoryid
    })
    post(urlData.iotDeviceEditContCate, {
      companyId: wx.getStorageSync('CID'),
      controllerCategoryId: this.data.categoryId,
      deviceId:this.data.deviceId
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data;
      if (res.respCode === 0) {
        this.setData({
          selectedIndex: currentTarget.dataset.selectedindex
        })
        let pages = getCurrentPages();
        console.log(JSON.stringify(pages))
        // 改了之后 需要重新刷新首页那块的数据
        
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          categoryName: currentTarget.dataset.categoryname,
          controllerCategoryId: currentTarget.dataset.categoryid
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
      categoryId: options.controllerCategoryId,
      isIPX: app.globalData.isIx
    })
    post(urlData.iotControllerCateList, {
      companyId: wx.getStorageSync('CID')
    }, wx.getStorageSync('TOKEN')).then(response => {
      let res = response.data;
      if (res.respCode === 0) {
        this.setData({
          typeList: res.obj
        })
        this.data.typeList.forEach((item, index) => {
          if (item.id === Number(this.data.categoryId)) {
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