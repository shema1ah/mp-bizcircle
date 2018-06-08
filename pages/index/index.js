var config = require('../../utils/config.js')

Page({
  data: {
    swipers: [],
    current: 0,
    goods: [],
    page: 0,
    isOver: false,  // 加载完成
    isLoading: false
  },
  slideSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  goodsDetail(event) {
    wx.navigateTo({
      url: `../goodsDetail/goodsDetail?id=${event.currentTarget.id}`
    })
  },
  onLoad() {
    this.fetchTop3()
    this.fetchData()
  },
  fetchTop3() {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/list`,
      data: {
        userid: 12,
        type: 2,
        stick: 1 // 1 置顶 0 正常
      },
      success: function(res) {
        _this.setData({
          swipers: res.data.data.promos
        })
      }
    })
  },
  fetchData() {
    this.setData({
      isLoading: true
    })
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/list`,
      data: {
        userid: 12,
        type: 2,
        stick: 0, // 1 置顶 0 正常
        pagesize: 5,
        page: this.data.page
      },
      success: function(res) {
        let promos = res.data.data.promos
        let goods = _this.data.goods.concat(promos)
        _this.setData({
          goods: goods,
          isLoading: false,
          page: _this.data.page + 1
        })
        if (promos.length < 5) {
          _this.setData({
            isOver: true
          })
        }
      }
    })
  },
  onReachBottom() {
    if (!this.data.isOver) {
      this.fetchData()
    }
  }
})
