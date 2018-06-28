var config = require('./utils/config.js')
App({
  onLaunch: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        that.globalData.code = res.code
      }
    })
  },
  login: function(detail, code, cb) {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/customer/login`,
      data: {
        detail,
        code,
        appid: 'wxacf513d714e19d2a'
      },
      success: function(res) {
        if (res.data.respcd === '2001') {
          // code 失效
          wx.login({
            success: function (res) {
              _this.globalData.code = res.code
              typeof cb === "function" && cb('')
            }
          })
        } else if (res.data.respcd === '0000') {
          let csid = res.data.data.csid
          wx.setStorage({
            key: 'csid',
            data: csid
          })
          typeof cb === "function" && cb(csid)
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.resperr,
            duration: 2000
          })
        }
      }
    })
  },
  globalData: {
    code: '',
    detail: {}
  }
})
