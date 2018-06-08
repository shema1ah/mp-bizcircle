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
    wx.request({
      url: `${config.host}/mtm/customer/login`,
      data: {
        detail,
        code,
        appid: 'wx11050bbebe8066d6'
      },
      success: function(res) {
        if (res.data.respcd === '0000') {
          let csid = res.data.data.csid
          wx.setStorage({
            key: 'csid',
            data: csid
          })
          wx.setStorage({
            key: 'nickName',
            data: detail.nickName
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
    detail: {},
    csid: ''
  }
})
