// components/camera-control/camera-control.js
Component({

  externalClasses: ['f-class'],

  options: {
    styleIsolation: 'isolated'
  },

  /**
   * 组件的属性列表
   */
  properties: {
    showCameraCrl:{
      type: Boolean,
      value: true
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
    handleKey(e){
      this.data.keys[e.target.dataset.key] = true;
      this.setData({
        keys : this.data.keys
      });
      this.triggerEvent('keyup', {
        key: e.target.dataset.key
      });
      // console.log(this.data.keys);
    },
    leaveHandleKey(e){
      this.data.keys[e.target.dataset.key] = false;this.setData({
        keys : this.data.keys
      });
    },
    closeHandleCtrl(){
      this.setData({
        showCameraCrl : false
      });

    }
  }
})
