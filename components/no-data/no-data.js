// components/no-data.js
// 无数据 组件
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tips:String,  //无数据提示文案
    imgUrl:String,  //无数据 图片
    imgWidth: Number,    //图片宽度
    imgHeight: Number,    //图片高度
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  // 生命周期
  lifetimes: {
    attached: function () {
      if (!this.properties.imgUrl) {
        this.setData({
          imgUrl: '../../assets/images/no_data.png'
        })
      }
      if (!this.properties.imgWidth) {
        this.setData({
          imgWidth: 282
        })
      }
      if (!this.properties.imgHeight) {
        this.setData({
          imgHeight: 162
        })
      }
    },
    detached: function () {
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
