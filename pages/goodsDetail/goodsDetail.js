//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    swipers: [{
      id: '1',
      cover_url: '../../imgs/goods.jpg'
    }, {
      id: '2',
      cover_url: '../../imgs/goods2.jpg'
    }, {
      id: '3',
      cover_url: '../../imgs/goods3.jpg'
    }]
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
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
