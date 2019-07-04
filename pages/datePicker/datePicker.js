import '../../utils/util.js'
const today = new Date().format('yyyy-MM-dd');
//const minDate = new Date(new Date().setMonth((new Date().getMonth() - 12), new Date().getDate() +1)).format('yyyy-MM-dd');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    dateSt: '开始时间',
    dateOv: '结束时间',
    today: new Date().format('yyyy-MM-dd'),
    minDate: '',
    maxDate: today,
    startDateStr: '', // 开始日期
    endDateStr: '' // 结束时间
  },
  getDate(e) { //点击唤起日期选择弹框
    this.setData({
      active: e.currentTarget.dataset.index
    });
    this.dateLimit();
  },
  bindDateChange(e) { //日期change
    if (e.currentTarget.dataset.index == 1) { //开始日期
      this.setData({
        dateSt: e.detail.value
      })
    } else { //结束时间
      this.setData({
        dateOv: e.detail.value
      });
    }
    this.setData({
      active: 0
    });
    this.dateLimit();
  },
  cancelPick(e) { //取消日期change
    //没有日期高亮
    this.setData({
      active: 0
    });
  },
  dateLimit() { //日期最大最小值限制
    let min = '', max = '';
    console.log('this.data.dateOv ' + this.data.dateOv)
    if (this.data.dateOv && (this.data.dateOv != '结束时间')) { //有结束时间时，日期最小值应该为结束时间前一年
      // var a = new Date(this.data.dateOv.replace(/-/, "/"));
      var a = new Date(this.data.dateOv);
      min = new Date(new Date(a).setMonth((a.getMonth() - 12), a.getDate() + 1)).format('yyyy-MM-dd');
      console.log('min ' + min)
    }
    console.log('this.data.dateSt ' + this.data.dateSt)
    if (this.data.dateSt && (this.data.dateSt != '开始时间')) { //日期最大值应该为开始日期后一年
      // var b = new Date(this.data.dateSt.replace(/-/, "/"));
      var b = new Date(this.data.dateSt);
      max = new Date(new Date(b).setMonth((b.getMonth() + 12), b.getDate() - 1)).format('yyyy-MM-dd');
      console.log('max ' + max)
    }

    let stampToday = Date.parse(today); // 当前时间戳
    let stampMAX = Date.parse(max); // 最大时间时间戳

    stampMAX > stampToday ? max = today : '';
    
    this.setData({
      minDate: min,
      maxDate: max
    });
  },
  backAndSubmit() { // 返回上级页面
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    if (this.data.dateSt === '开始时间') {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none',
        duration: 3000
      });
    }else if (this.data.dateOv === '结束时间') {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none',
        duration: 3000
      });
    }else if (this.data.dateSt !== '开始时间' && this.data.dateOv !== '结束时间') {
      let flag = this.judgeYear(this.data.dateSt, this.data.dateOv);
      this.data.dateSt = this.data.dateSt.replace(/[-]/g, '.');
      this.data.dateOv = this.data.dateOv.replace(/[-]/g, '.');
      if (flag) { // 如果同一年就显示月日
        prevPage.setData({
          startDateStr: this.data.dateSt.substr(5,10),
          endDateStr: this.data.dateOv.substr(5,10),
          dateType: 2,
          dateNum: ''
        });
      } else { // 如果不是同一年就显示年月日
        prevPage.setData({
          startDateStr: this.data.dateSt,
          endDateStr: this.data.dateOv,
          dateType: 2,
          dateNum: ''
        });
      }
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 
   * 判断当前日期是否是当前年
   */
  judgeYear(time1, time2) {
    let yearStart = time1.substr(0, 4); // 开始年份
    let yearEnd = time2.substr(0, 4); // 结束年份
    let year = new Date().getFullYear().toString();
    if (yearStart === year && yearEnd === year) {
      return true;
    }
    return false;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.startDateStr && options.endDateStr) {
      let time1 = options.startDateStr.replace(/[.]/g, '-');
      let time2 = options.endDateStr.replace(/[.]/g, '-');
      if (options.startDateStr.length === 5) {
        let year = new Date().getFullYear().toString();
        this.setData({
          dateSt: year + '-' + time1,
          dateOv: year  + '-' + time2
        })
      } else {
        this.setData({
          dateSt: time1,
          dateOv: time2
        })
      }
    }
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