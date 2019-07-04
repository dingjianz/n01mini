// pages/videoSet/videoSet.js
import { post, urlData, checkBt, ishasPower } from '../../utils/util.js'

let isNeedPlay = null;  //当返回上个页面时，上个页面的视频是否需要自动播放
Page({
    /**
     * 页面的初始数据
     */
    data: {
        deviceId: '',
        originTit: '',//进入页面时初始设备名称
        deviceTit: '',//编辑时的设备名称
        power_name: false,  //编辑名称权限
        power_area:false,   //编辑区域权限
        editModal: false,
        areaId: '',
        areaName: '',
        actions: [
            {
                name: '取消',
                color: '#395787',
            },
            {
                name: '确定',
                color: '#5689D7'
            }
        ],
        isFocus:false,      //修改视频名称的input的focus标识
    },
    openModal(e) {
        if (!this.data.power_name) { // 无权限时不可打开编辑弹框
            return
        }
        this.setData({
            editModal: true,
            isFocus:true,
        });
    },
    //选择区域
    toSelectArea(e){
        if (!this.data.power_area) { // 无权限时不可跳转
            return
        }else{
            wx.navigateTo({
                url: `/pages/videoArea/videoArea?deviceId=${this.data.deviceId}&areaId=${this.data.areaId}`
            })
        }
    },
    handleClick(e) {
        if (e.detail.index === 0) {//取消
            this.setData({
                editModal: false,
                deviceTit: this.data.originTit,
                isFocus:false,
            });
        } else {//确定
            if (!this.data.deviceTit.trim()) {
                wx.showToast({
                    title: '请输入设备名称',
                    icon: 'none',
                    duration: 3000
                })
                return
            }

            const action = [...this.data.actions];

            this.setData({
                actions: action
            });

            if (!checkBt(this.data.deviceTit.trim(), 16)) {
                this.setData({
                    actions: action
                });
                wx.showToast({
                    title: '设备名称最多16个字',
                    icon: 'none',
                    duration: 3000
                });
                return
            }

            this.submitName();
        }
    },
    submitName() {//提交修改的摄像头名称
        let _this = this;
        post(urlData.iotCameraEditName, {
            "displayName": this.data.deviceTit.trim(),
            "companyId": wx.getStorageSync("CID"),
            "cameraId": this.data.deviceId
        }, wx.getStorageSync('TOKEN')).then(function (resp) {
            if (resp.data.respCode === 0) {
                _this.setIndexVideo()
                _this.setData({
                    editModal: false,
                    isFocus:false,
                    actions: _this.data.actions,
                    originTit: _this.data.deviceTit.trim(),
                    deviceTit: _this.data.deviceTit.trim()
                });
            }
        });
    },
    getCameraInfo() {//根据id获取摄像头详细信息
        let _this = this;
        post(urlData.iotCameraInfoGet, {
            "companyId": wx.getStorageSync("CID"),
            "cameraId": this.data.deviceId
        }, wx.getStorageSync('TOKEN')).then((resp) => {
            if (resp.data.respCode === 0) {
                console.log(JSON.stringify(resp))
                _this.setData({
                    areaId: resp.data.obj.deviceGroupVO?resp.data.obj.deviceGroupVO.id:0,
                    areaName: resp.data.obj.deviceGroupVO?resp.data.obj.deviceGroupVO.groupName:'默认区域'
                });
            }
        });
    },
    inputedit(e) {
        let datatxt = e.currentTarget.dataset.txt;
        let detail = e.detail.value;
        this.setData({
            deviceTit: detail
        });
    },
    //修改首页的视频列表-重新拉去数据，传入视频id
    setIndexVideo(){
        let _this = this;
        let pages = getCurrentPages(),indexPage=null;
        pages.forEach((item,index)=>{
            if(item.route=='pages/index/index'){
                indexPage = item;
                return
            }
        })
        if(indexPage){
            indexPage.setData({
                isFromSet:true,
                isFromSetId:_this.data.deviceId
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log('options.isPlay' + options.isplay)
      isNeedPlay = options.isplay;  //1是需要播放，0是不要播放
        this.setData({
            deviceTit: options.deviceTit,
            originTit: options.deviceTit,
            deviceId: options.deviceId,
        });
        ishasPower(['iot:camera:edit:group','iot:camera:edit:name'],(results)=>{
            if(results[0]){
                //没有区域修改权限
                this.setData({
                    power_area:true
                })
            }
            if(results[1]){
                //没有名称修改权限
                this.setData({
                    power_name:true
                })
            }
        })
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
        this.getCameraInfo();
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
        let _this  =this;
        let Vobj = {
            name:_this.data.deviceTit.trim(),
            areaName:_this.data.areaName,
        }
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2];   //上一个页面
        console.log(JSON.stringify(beforePage))
        //首页-控制视频 需要修改 视频名称和 视频所属区域
        if(beforePage){
            let name = 'videoObj.name';
            let areaName ='videoObj.areaName';
          console.log('来来来' + isNeedPlay)
            beforePage.setData({
              [name]:Vobj.name,
              [areaName]:Vobj.areaName,
              isNeedPlay: Number(isNeedPlay)?true:false
            })
        }
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