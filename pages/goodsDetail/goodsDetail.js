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
    let promoInfo = this.data.promoInfo
    wx.navigateTo({
      url: `../makeOrder/makeOrder?userid=${promoInfo.userid}&buyLimit=${promoInfo.buy_limit}&promoId=${promoInfo.id}&goodsId=${goodsInfo.id}&goodsTotal=${goodsInfo.total}&goodsName=${goodsInfo.name}&goodsTxamt=${goodsInfo.txamt}&goodsImg=${goodsInfo.img}`
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
  fetchData(id = '6411856887648428647') {
    wx.showLoading({
      title: '加载中...'
    })
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
        wx.hideLoading()
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
