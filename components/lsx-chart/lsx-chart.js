Component({
  /**
   * 组件的属性列表
   */
  properties: {
    axis: Array, // 日志数据
    specsEnumList: Array // 枚举集合
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    axis: []
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
