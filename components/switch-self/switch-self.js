// components/switch-self/switch-self.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:Number,  //选择的开关样式 如果是“开关停”，则1，“开关”则2
    selectedIndex:Number,   //选中的开关索引
    equipName:String,   //设备名称
    selectedValue:Number,   //选中的开关值 （开关：1-0，开关停：1-2-3）
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
    switchValue: 0,  //开关选中的值
    isVisible:false,  //是否显示确认弹窗

    numIndex:0,   //临时存放的用户选中的开关索引
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换开关
    changeSwitchType1(e){
      if(e.currentTarget.dataset.index == this.data.switchIndex){
        return false
      }
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
            name = "暂停";
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

    //根据index切换开关按钮的“开关停”状态
    changeSwitchByIndex(index){
      console.log('index'+index)
      this.setData({
        switchIndex : index
      })
    },
    //根据value来切换开关状态
    changeSwitchByValue(value){
      console.log('value'+value)
      var _this = this;
      switch(this.properties.type){
        case 1:
          //开关停 根据value值来判断index索引 开1 关2 停3(index：组件中 对应 开2 关0 停1)
          switch(value){
            case 1: //开
              _this.changeSwitchByIndex(2);
              break;
            case 2: //关
                _this.changeSwitchByIndex(0);
                break;
            case 3: //停
              _this.changeSwitchByIndex(1);
              break;
          }
          break;
        case 2:
          //开关 根据index索引来判断value值 关0 开1 (组件中 对应 关0 开1 )
          _this.changeSwitchByIndex(value);
          break;
      }

      _this.setData({
        switchValue:value
      })
    }
  },
  lifetimes: {
    attached: function () {
      var _this = this;
      // 在组件实例进入页面节点树时执行
      if (this.properties.selectedValue && this.properties.type) {
        switch(this.properties.type){
          case 1:
            //开关停 value值开1 关2 停3(组件中 对应 开2 关0 停1)
            switch(_this.properties.selectedValue){
              case 1: //开
                _this.changeSwitchByIndex(2);
                break;
              case 2: //关
                  _this.changeSwitchByIndex(0);
                  break;
              case 3: //停
                _this.changeSwitchByIndex(1);
                break;
            }
            break;
          case 2:
            //开关 value值关0 开1 (组件中 对应 关0 开1 )
            _this.changeSwitchByIndex(_this.properties.selectedValue);
            break;
        }

        _this.setData({
          switchValue:_this.properties.selectedValue
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
