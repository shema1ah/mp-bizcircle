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
  onLoad(options) {
    this.fetchTop3()
    this.fetchData()
  },
  onShareAppMessage(res) {
    return {
      title: '周边优惠精品特卖享不停',
      path: '/pages/index/index'
    }
  },
  onTabItemTap(item) {
    if (item.index == 2) {
      wx.navigateToMiniProgram({
        appId: 'wx46870f4a75c38822', // 好近优品小程序的 appid
        path: 'pages/home/dashboard/index'
      })
    }
  },
  fetchTop3() {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/list`,
      data: {
        qdcode: 'nanjing',
        pagesize: 3,
        type: 2,
        stick: 1 // 1 置顶 0 正常
      },
      success: function(res) {
        _this.setData({
          swipers: res.data.data.promos || []
        })
      }
    })
  },
  fetchData(isRefresh) {
    this.setData({
      isLoading: true
    })
    let page = isRefresh ? 0 : this.data.page // 上拉刷新，只拿第一页数据
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/list`,
      data: {
        qdcode: 'nanjing',
        type: 2,
        stick: 0, // 1 置顶 0 正常
        pagesize: 10,
        page
      },
      success: function(res) {
        let promos = res.data.data.promos || []
        let goods = isRefresh ? promos : _this.data.goods.concat(promos)
        let page = parseInt(_this.data.page) + 1
        _this.setData({
          goods: goods,
          isLoading: false,
          page
        })
        if (isRefresh) {
          wx.stopPullDownRefresh()
        }
        if (promos.length < 10) {
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
  },
  onPullDownRefresh() {
    this.setData({
      current: 0
    })
    this.fetchData('1')
    this.fetchTop3()
  }
})
