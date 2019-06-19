// pages/datePicker/datePicker.js
import '../../utils/util.js'
const today = new Date().format('yyyy-MM-dd');
//const minDate = new Date(new Date().setMonth((new Date().getMonth() - 12), new Date().getDate() +1)).format('yyyy-MM-dd');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        dateSt: today,
        dateOv: '结束日期',
        today: new Date().format('yyyy-MM-dd'),
        minDate: '',
        maxDate: today
    },
    getDate(e){//点击唤起日期选择弹框
        this.setData({
            active: e.currentTarget.dataset.index
        }); 
        this.dateLimit();
    },
    bindDateChange(e) {//日期change
        if (e.currentTarget.dataset.index == 1){//开始日期
            this.setData({
                dateSt: e.detail.value
            })
        } else {//结束日期
            this.setData({
                dateOv: e.detail.value
            });
        }
        this.setData({
            active: 0
        });
        this.dateLimit();
    },
    cancelPick(e){//取消日期change
        //没有日期高亮
        this.setData({
            active:0
        });
    },
    dateLimit(){//日期最大最小值限制
        let min = '',max= '';
        if(this.data.dateOv && (this.data.dateOv != '结束日期')){//有结束日期时，日期最小值应该为结束日期前一年
            var a = new Date(this.data.dateOv.replace(/-/, "/"));
            min = new Date(new Date(a).setMonth((a.getMonth() - 12), a.getDate() + 1)).format('yyyy-MM-dd');
        }

        if (this.data.dateSt) {//日期最大值应该为开始日期后一年
            var b = new Date(this.data.dateSt.replace(/-/, "/"));
            max = new Date(new Date(b).setMonth((b.getMonth() + 12), b.getDate() - 1)).format('yyyy-MM-dd');
        }

        let stampToday = Date.parse(today);
        let stampMAX = Date.parse(max);
        
        if (stampMAX > stampToday){
            max = today;
        }

        console.log(min);
        console.log(max);
        this.setData({
            minDate: min,
            maxDate: max
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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