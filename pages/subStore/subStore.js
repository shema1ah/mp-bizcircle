var config = require('../../utils/config.js')

Page({
  data: {
    shops: [],
    code: '',  // 连锁店的 code
    page: 0,
    isLoading: false,
    isOver: false
  },
  fetchData(enuserid) {
    this.setData({
      isLoading: true
    })
    let _this = this
    wx.request({
      url: `${config.ohost}/mchnt/member/shop/list`,
      data: {
        mode: 'sub',
        code: enuserid || '86',
        page: _this.data.page,
        pagesize: 10
      },
      success: function(res) {
        let result = res.data.data.shops
        let shops = _this.data.shops.concat(result)
        _this.setData({
          shops: shops,
          page: _this.data.page + 1,
          isLoading: false
        })
        if (result.length < 10) {
          _this.setData({
            isOver: true
          })
        }
      }
    })
  },
  call(event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.number
    })
  },
  onLoad(options) {
    this.setData({
      code: options.enuserid
    })
    this.fetchData(options.enuserid)
  },
  onReachBottom() {
    if (!this.data.isOver) {
      this.fetchData(this.data.enuserid)
    }
  }
})
