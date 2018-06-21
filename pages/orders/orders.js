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
  onShow() {
    let _this = this
    wx.getStorage({
      key: 'csid',
      success: function(res) {
        if (res.data) {
          _this.setData({
            csid: res.data
          })
          _this.fetchData(true, res.data)
        }
      },
      fail: function() {
        _this.setData({
          csid: ''
        })
      }
    })
  },
  bindGetUserInfo(e) {
    if (e.detail.errMsg.indexOf('fail') > 0) {
      return
    }
    wx.showLoading({
      title: '登录中...'
    })
    let _this = this
    let detail = {}
    detail.encryptedData = e.detail.encryptedData
    detail.iv = e.detail.iv
    wx.setStorage({
      key: 'nickName',
      data: e.detail.userInfo.nickName
    })
    app.login(detail, app.globalData.code, (csid) => {
      wx.hideLoading()
      if (csid) {
        _this.setData({
          csid
        })
        _this.fetchData(true, csid)
      } else {
        wx.showToast({
          icon: 'none',
          title: '登录失败，请重试',
          duration: 2000
        })
      }
    })
  },
  fetchData(isRefresh, csid) {
    if (!isRefresh) {
      this.setData({
        isLoading: true
      })
    }
    let page = isRefresh ? 0 : this.data.page // 上拉刷新，只拿第一页数据
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/list`,
      data: {
        type: 4,
        page,
        pagesize: 10
      },
      header: {
        'QF-CSID': csid
      },
      success: function(res) {
        if (res.data.respcd === '0000') {
          let result = res.data.data.orders || []
          let orders = isRefresh ? result : _this.data.orders.concat(result)
          let page = parseInt(_this.data.page) + 1
          _this.setData({
            orders,
            page,
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
        } else if (res.data.respcd === '2002') {
          _this.setData({
            csid: ''
          })
        }
      }
    })
  },
  onPullDownRefresh() {
    this.fetchData(true, this.data.csid)
  },
  onReachBottom() {
    if (!this.data.isOver) {
      this.fetchData(false, this.data.csid)
    }
  }
})
