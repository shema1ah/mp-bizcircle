var config = require('../../utils/config.js')
var QR = require("../../utils/qrcode.js")

Page({
  data: {
    csid: '',
    goodsInfo: {},
    mchntInfo: {},
    promoInfo: {},
    showSuccessIcon: false
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
    if (options.from === 'makeOrder') {
      this.setData({
        showSuccessIcon: true
      })
    }
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
    wx.showLoading({
      title: '加载中...'
    })
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/info`,
      data: {
        order_id: orderId || '6412253397213061816'
      },
      header: {
        'QF-CSID': _this.data.csid
      },
      success: function(res) {
        wx.hideLoading()
        let result = res.data.data
        let promo = Object.assign(result.promo, {
          status: result.promo_state,
          redeemCode: result.redeem_code
        })
        let color = result.promo_state === 0 ? '#000000' : '#8A8C92'
        QR.api.draw(color, result.redeem_code, 'mycanvas', 130, 130)
        _this.setData({
          goodsInfo: result.goods_info[0],
          mchntInfo: result.mchnt_info,
          promoInfo: promo
        })
      }
    })
  }
})
