//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    swipers: [{
      id: '1',
      name: '面包会有的',
      cover_url: '../../imgs/goods.jpg',
      price: 100
    }, {
      id: '2',
      name: '面包会有的',
      cover_url: '../../imgs/goods2.jpg',
      price: 100
    }, {
      id: '3',
      name: '面包会有的',
      cover_url: '../../imgs/goods.jpg',
      price: 100
    }],
    current: 0
  },
  slideSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  onLoad() {
    let that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      //更新数据
      that.setData({
        userInfo
      })
    })

    // wx.showToast({
    //   title: '成功',
    //   icon: 'none',
    //   duration: 2000
    // })
  }
})
