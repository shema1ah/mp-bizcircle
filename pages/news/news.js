Page({
  data: {
    motto: 'Hello World'
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail'
    })
  },
  onLoad() {
  }
})
