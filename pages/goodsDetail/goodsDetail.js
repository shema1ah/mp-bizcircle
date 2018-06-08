var config = require('../../utils/config.js')

Page({
  data: {
    csid: '',
    swipers: [],
    goodsInfo: {},
    mchntInfo: {},
    promoInfo: {}
  },
  goShopList() {
    wx.navigateTo({
      url: `../subStore/subStore?enuserid=${this.data.mchntInfo.enuserid}`
    })
  },
  goMakeOrder() {
    let goodsInfo = this.data.goodsInfo
    wx.navigateTo({
      url: `../makeOrder/makeOrder?promoId=${this.data.promoInfo.id}&goodsId=${goodsInfo.id}&goodsName=${goodsInfo.name}&goodsTxamt=${goodsInfo.txamt}&goodsImg=${goodsInfo.img}`
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
      header: {
        'QF_CSID': this.data.csid
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
