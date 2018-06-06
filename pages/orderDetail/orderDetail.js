Page({
  data: {
    status: '', // 'order', 'done', 'expire'
  },
  goShopList() {
    wx.navigateTo({
      url: '../subStore/subStore'
    })
  },
  onLoad() {
    this.setData({
      status: 'expire'
    })
  }
})
