// components/ctrol-pan/ctrol-pan.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        deviceId: {//设备id
            type: Number,
            value:12
        },
        deviceTit: {//设备名称
            type: String,
            value: '设备名称'
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        keys: {
            top: false,
            right: false,
            btn: false,
            left: false,
            out: false,
            in: false,
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
      handleStart(e) {
          this.data.keys[e.target.dataset.key] = true;
          this.setData({
              keys: this.data.keys
          });
          this.triggerEvent('ctrol', {
              key: e.target.dataset.key
          });
          console.log(this.data.keys);
      },
      handleEnd(e) {
          this.data.keys[e.target.dataset.key] = false; 
          this.setData({
              keys: this.data.keys
          });
      },
      // 退出控制
      closeCtrl() {
          this.triggerEvent('exitCtrl');
      }
    }
})
