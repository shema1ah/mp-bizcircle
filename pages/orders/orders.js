Page({
  data: {
    orders: [{
      id: '123',
      name: '订单1'
    }, {
      id: '456',
      name: '订单2'
    }, {
      id: '789',
      name: '订单3'
    }],
    count: 10,
    isLoading: false,
    userInfo: {}
  },
  goOrderDetail() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail'
    })
  },
  onLoad() {
    console.log('onLoad')
  },
  onPullDownRefresh() {
    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.setData({
      isLoading: true
    })
    console.log('onReachBottom')
    let count = this.data.count + 1
    let orders = this.data.orders.concat([{
      id: '789',
      name: '订单' + count
    }, {
      id: '012',
      name: '订单' + (count + 1)
    }, {
      id: '012',
      name: '订单' + (count + 2)
    }, {
      id: '012',
      name: '订单' + (count + 3)
    }, {
      id: '012',
      name: '订单' + (count + 4)
    }, {
      id: '012',
      name: '订单' + (count + 5)
    }, {
      id: '012',
      name: '订单' + (count + 6)
    }, {
      id: '012',
      name: '订单' + (count + 7)
    }])
    this.setData({
      orders,
      count,
      isLoading: false
    })
  }
})
