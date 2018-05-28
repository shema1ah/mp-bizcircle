//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  call(event) {
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.number
    })
  },
  onLoad() {
    console.log('onLoad')
    let that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      //更新数据
      that.setData({
        userInfo
      })
    })
  }
})