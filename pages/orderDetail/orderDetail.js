var config = require('../../utils/config.js')
Page({
  data: {
    csid: '',
    goodsInfo: {},
    mchntInfo: {},
    promoInfo: {}
  },
  goShopList() {
    wx.navigateTo({
      url: `../subStore/subStore?enuserid=${this.data.mchntInfo.enuserid}`
    })
  },
  call(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.number
    })
  },
  onLoad(options) {
    let _this = this
    wx.getStorage({
      key: 'csid',
      success: function(res) {
        if (res.data) {
          _this.setData({
            csid: res.data
          })
          _this.fetchData(options.orderId)
        }
      }
    })
  },
  fetchData(orderId) {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/info`,
      data: {
        order_id: orderId || '6410381465489314066'
      },
      header: {
        'QF_CSID': _this.data.csid
      },
      success: function(res) {
        let result = res.data.data
        let promo = Object.assign(result.promo, {
          status: result.promo_state,
          redeemCode: result.redeem_code
        })
        _this.setData({
          goodsInfo: result.goods_info[0],
          mchntInfo: result.mchnt_info,
          promoInfo: promo
        })
      }
    })
  }
})
