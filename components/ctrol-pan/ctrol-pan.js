// components/ctrol-pan/ctrol-pan.js
import {ishasPower} from '../../utils/util.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      deviceId: {//设备id
          type: Number,
          value:0
      },
      deviceTit: {//设备名称
          type: String,
          value: '设备名称'
      },
      isplay: {  //当前页面的视频是否在播放
        type:Number,
        value: 0
      },   
    },
    /**
     * 组件的初始数据
     */
    data: {
        keys: {
            top: false,
            right: false,
            btm: false,
            left: false,
            out: false,
            in: false,
        },
        power_set:false,    //摄像头控制权限
    },
    lifetimes: {
        attached: function () {
            let _this = this;
            // 在组件实例进入页面节点树时执行 
            let setPower = ['iot:camera:edit:group','iot:camera:edit:name']
            ishasPower(setPower,function(result){
                if(result[0]||result[1]) {
                    _this.setData({
                        power_set:true
                    })
                }
            })
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {
      handleStart(e) {
          this.data.keys[e.currentTarget.dataset.key] = true;
          this.setData({
              keys: this.data.keys
          });
          this.triggerEvent('ctrol', {
              key: e.currentTarget.dataset.key
          });
          wx.showToast({
            title: '暂不支持摄像头控制',
            icon: 'none',
            duration: 3000
          })
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
      },
      //跳转设置
      toDetail(e){
        wx.navigateTo({
          url: `/pages/videoSet/videoSet?deviceId=${e.currentTarget.dataset.id}&deviceTit=${e.currentTarget.dataset.tit}&isplay=${this.properties.isplay}`,
        });
      }
    }
})
