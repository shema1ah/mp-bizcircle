var config = require('../../utils/config.js')
var app = getApp()
Page({
  data: {
    csid: '',
    promoId: '',
    goodsInfo: {},
    detail: {},
    count: 1,
    nickName:  '',
    mobile: '',
    isOrdering: false,
    total: 0  // 订单总金额
  },
  add() {
    let count = this.data.count + 1
    let total = this.data.goodsInfo.txamt * count
    this.setData({
      count,
      total
    })
  },
  reduce() {
    let count = 1
    if (this.data.count > 1) {
      count = this.data.count - 1
    }
    let total = this.data.goodsInfo.txamt * count
    this.setData({
      count,
      total
    })
  },
  onLoad(options) {
    console.log('onLoad detail')
    let _this = this
    let info = {}
    info.id = options.goodsId
    info.img = options.goodsImg
    info.name = options.goodsName
    info.txamt = options.goodsTxamt
    wx.getStorage({
      key: 'csid',
      success: function(res) {
        if (res.data) {
          _this.fetchData()
          _this.setData({
            csid: res.data
          })
        }
      }
    })
    wx.getStorage({
      key: 'nickName',
      success: function(res) {
        if (res.data) {
          _this.setData({
            nickName: res.data
          })
        }
      }
    })
    this.setData({
      promoId: options.promoId,
      goodsInfo: info,
      total: options.goodsTxamt // 默认1件商品
    })
  },
  bindNickNameInput(e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  bindMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindGetUserInfo(e) {
    console.log(e)
    let _this = this
    let detail = {}
    detail.encryptedData = e.detail.encryptedData
    detail.iv = e.detail.iv
    detail.nickName = e.detail.userInfo.nickName
    this.setData({
      nickName: detail.nickName
    })
    app.login(detail, app.globalData.code, (csid) => {
      console.log(csid)
      _this.setData({
        csid
      })
    })
  },
  fetchData () {

  },
  login (detail, code) {
    let _this = this
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
          _this.setData({
            csid
          })
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
  makeOrder () {
    if (!this.data.nickName) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      if (/1\d{10}/.test(this.data.mobile) === false) {
        wx.showToast({
          title: '请填写正确手机号再下单',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    }
    let goodsInfo = [{
      id: this.data.goodsInfo.id,
      count: this.data.count
    }]
    let userInfo = {
      contact_name: this.data.nickName,
      mobile: this.data.mobile
    }
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/create`,
      method: 'POST',
      data: {
        userid: '12',
        appid: 'wx11050bbebe8066d6',
        order_type: 3,
        goods_info: JSON.stringify(goodsInfo),
        busicd: '800213',
        promo_id: this.data.promoId,
        mode: 'quick_order',
        addr_info: JSON.stringify(userInfo)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'QF_CSID': this.data.csid
      },
      success: function(res) {
        console.log(res)
        console.log(res.data.respcd)
        if (res.data.respcd === '0000') {
          _this.wechatPay(res.data.data.pay_params)
        }
      }
    })
  },
  wechatPay (params) {
    let _this = this
    this.setData({
      isOrdering: true
    })
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: 'MD5',
      paySign: params.paySign,
      success: function(res){
        console.log('wechatPay success')
        wx.showToast({
          title: 'wechatPay success',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          isOrdering: false
        })
      },
      fail: function(res){
        console.log('wechatPay fail')
        wx.showToast({
          title: 'wechatPay fail',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          isOrdering: false
        })
      }
    })
  }
})
