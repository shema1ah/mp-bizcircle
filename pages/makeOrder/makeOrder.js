var app = getApp()
Page({
  data: {
    count: 1,
    userInfo: {}
  },
  add() {
    let count = this.data.count + 1
    this.setData({
      count
    })
  },
  reduce() {
    let count = 1
    if (this.data.count > 1) {
      count = this.data.count - 1
    }
    this.setData({
      count
    })
  },
  onLoad() {
    let _this = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      _this.setData({
        userInfo
      })
    })
  }
})
