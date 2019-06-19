// components/switch-self/switch-self.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:Number,  //选择的开关样式 如果是“开关停”，则1，“开关”则2
    selectedIndex:Number,   //选中的开关索引
    equipName:String,   //设备名称
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

    switchIndex: 0,  //开关选中的索引
    isVisible:false,  //是否显示确认弹窗

    numIndex:0,   //临时存放的用户选中的开关索引
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换开关
    changeSwitchType1(e){
     const _this = this;
      this.setData({
        isVisible:true,
        numIndex: e.currentTarget.dataset.index
      })
      if (this.properties.type == 1){
        var name = '',type='';
        switch (e.currentTarget.dataset.index){
          case 0:
            name = "关闭";
            type = "close";
          break;
          case 1:
            name = "停止";
            type = "stop";
          break;
          case 2:
            name = "开启";
            type = "start";
          break;
        }
      }else{
        var name = '';
        switch (e.currentTarget.dataset.index) {
          case 0:
            name = "关闭";
            type = "close";
          break;
          case 1:
            name = "开启";
            type = "start";
          break;
        }
      }
      _this.triggerEvent('changeSwitch', { index: e.currentTarget.dataset.index,name:name,type:type})
    },

    //切换开关按钮的“开关停”状态
    changeSwitch(index){
      this.setData({
        switchIndex : index
      })
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      if (this.properties.selectedIndex) {
        this.setData({
          switchIndex: this.properties.selectedIndex
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
