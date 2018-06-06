var config = require('../../utils/config.js')

Page({
  data: {
    swipers: [],
    goodsInfo: {},
    mchntInfo: {},
    promoInfo: {}
  },
  goShopList() {
    console.log('goShopList')
    console.log(this.data.mchntInfo.enuserid)
    wx.navigateTo({
      url: `../subStore/subStore?enuserid=${this.data.mchntInfo.enuserid}`
    })
  },
  goMakeOrder() {
    wx.navigateTo({
      url: '../makeOrder/makeOrder'
    })
  },
  call(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.number
    })
  },
  onLoad(options) {
    this.fetchData(options.id)
  },
  fetchData(id = '6409712364848801191') {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/info`,
      data: {
        id
      },
      success: function(res) {
        let promo = res.data.data.promo
        _this.setData({
          swipers: promo.goods_info.imgs,
          mchntInfo: promo.mchnt_info,
          goodsInfo: promo.goods_info,
          promoInfo: promo
        })
      }
    })
  }
})
