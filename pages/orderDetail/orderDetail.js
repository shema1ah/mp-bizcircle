Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  goShopList() {
    console.log('goShopList')
    wx.navigateTo({
      url: '../subStore/subStore'
    })
  },
  onLoad() {

  }
})
