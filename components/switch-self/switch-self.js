// components/switch-self/switch-self.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:Number,  //选择的开关样式 如果是“开关停”，则1，“开关”则2
  },

  /**
   * 组件的初始数据
   */
  data: {
    switchArr1:[{
      class:'off',
      text:'关'
    },{
      class: 'stop',
      text: '停'
    }, {
      class: 'open',
      text: '开'
    }],
    switchArr2: [{
      class: 'off',
      text: '关'
    },{
      class: 'open',
      text: '开'
    }],

    switchIndex1: 0,  //type1开关选中的索引
    switchIndex2: 0,  //type2开关选中的索引
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeSwitchType1(e){ //第一种开关
      this.setData({
        switchIndex1: e.currentTarget.dataset.index
      })
    },
    changeSwitchType2(e) {//第二种开关
      this.setData({
        switchIndex2: e.currentTarget.dataset.index
      })
    }
  }
})
