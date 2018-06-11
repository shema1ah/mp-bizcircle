var config = require('../../utils/config.js')
var app = getApp()
Page({
  data: {
    csid: '',
    orders: [],
    page: 0,
    count: 10,
    isLoading: false,
    isOver: false
  },
  goOrderDetail(event) {
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${event.currentTarget.id}`
    })
  },
  onLoad() {
    let _this = this
    wx.getStorage({
      key: 'csid',
      success: function(res) {
        if (res.data) {
          _this.setData({
            csid: res.data
          })
          _this.fetchData()
        }
      },
      fail: function() {
        _this.setData({
          csid: 'fetchfail'
        })
      }
    })
  },
  bindGetUserInfo(e) {
    let _this = this
    let detail = {}
    detail.encryptedData = e.detail.encryptedData
    detail.iv = e.detail.iv
    app.login(detail, app.globalData.code, (csid) => {
      _this.setData({
        csid
      })
    })
  },
  fetchData(isRefresh) {
    this.setData({
      isLoading: true
    })
    let page = isRefresh ? 0 : this.data.page // 上拉刷新，只拿第一页数据
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/list`,
      data: {
        type: 3,
        page,
        pagesize: 10
      },
      header: {
        'QF_CSID': this.data.csid
      },
      success: function(res) {
        let result = res.data.data.orders || []
        let orders = _this.data.orders.concat(result)
        _this.setData({
          orders,
          page: _this.data.page + 1,
          isLoading: false
        })
        if (isRefresh) {
          wx.stopPullDownRefresh()
        }
        if (result.length < 10) {
          _this.setData({
            isOver: true
          })
        }
      }
    })
  },
  onPullDownRefresh() {
    this.fetchData('1')
  },
  onReachBottom() {
    if (!this.data.isOver) {
      this.fetchData()
    }
  }
})
