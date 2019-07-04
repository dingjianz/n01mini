// pages/handOver/handOver.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: -1,//点击索引
        selected:-1,//选中索引
        modaltit:'',
        clist: [
            { id: 1104, phone: '18326845213', config: true },
            { id: 1104, phone: '15247852110', config: true },
            { id: 1104, phone: '18742519635', config: true }

        ],
        modal:false,
        actions: [
            {
                name: '取消',
                color: '#395787',
            },
            {
                name: '确定',
                color: '#5689D7'
            },
        ]
    },
    changePerson(e) {
        const index = e.currentTarget.dataset.index;
        if(this.data.selected == index){
            return 
        }
        this.setData({
            modal: true,
            active: index,
            modaltit: this.data.clist[index].phone
        });
    },
    handleClick({ detail }) {
        if (detail.index === 0) {//取消
            this.setData({
                modal: false
            });
        } else {//确定
            const action = [...this.data.actions];

            this.setData({
                actions: action
            });

            setTimeout(() => {
                this.setData({
                    modal: false,
                    actions: action,
                    selected:this.data.active
                });
            }, 2000);
        }
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