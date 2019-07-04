// components/iconfont/iconfont.js
Component({
  /**
   * 组件的属性列表
   */
  
  properties: {
    dataNum:String, //数值
    color:String,   //颜色
    fontSize: Number,  //字体大小
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconArr: ['iconnumber-0', 'iconnumber-1', 'iconnumber-2', 'iconnumber-3', 'iconnumber-4', 'iconnumber-5', 'iconnumber-6', 'iconnumber-7', 'iconnumber-8', 'iconnumber-9', 'iconnumber-point','iconnumber-path'],

    fontArr:[],
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.updateNum();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateNum(num){
      if (!this.properties.color){
        this.setData({
          color: '#15FC71',
        })
      }
      var num = num||num==0?String(num).split(''):String(this.properties.dataNum).split('');
      var arr = [];
      num.forEach((item,index)=>{
        if(item=='.'){
          arr.push(10)
        } else if(item == '-'){
          arr.push(11)
        }else{
          arr.push(Number(item))
        }
      })
      this.setData({
        fontArr: arr
      })
    }
  }
})
