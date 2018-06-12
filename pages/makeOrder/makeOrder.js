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
    total: 0, // 订单总金额
    buyNumber: 0, // 可购买数量
    userid: ''  // 商品对应的 userid
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
  noMoreGoods() {
    let goodsInfo = this.data.goodsInfo
    let buyNumber = this.data.buyNumber // 允许购买数
    if (goodsInfo.total < this.data.count) {
      // 库存不足
      return `商品库存不足，还剩${goodsInfo.total}个可购买`
    } else if (goodsInfo.buyLimit == 0) {
      return 'nolimit'
    } else if (buyNumber == goodsInfo.buyLimit && this.data.count > buyNumber) {
      // 当前购买数 超过 允许购买数
      return `本商品最多购买${buyNumber}个`
    } else if (buyNumber < goodsInfo.buyLimit && this.data.count > buyNumber) {
      return `本商品最多购买${goodsInfo.buyLimit}个，您已购买过${goodsInfo.buyLimit - this.data.buyNumber}个`
    } else {
      return 'pass'
    }
  },
  onLoad(options) {
    let _this = this
    let info = {}
    info.id = options.goodsId
    info.img = options.goodsImg
    info.name = options.goodsName
    info.txamt = options.goodsTxamt
    info.total = options.goodsTotal
    info.buyLimit = options.buyLimit
    this.setData({
      promoId: options.promoId,
      goodsInfo: info,
      total: options.goodsTxamt, // 默认1件商品
      userid: options.userid
    })
    wx.getStorage({
      key: 'csid',
      success: function(res) {
        if (res.data) {
          _this.setData({
            csid: res.data
          })
          _this.fetchCustomerInfo(res.data)
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
    // 微信授权获取 userInfo
    wx.showLoading({
      title: '登录授权中...'
    })
    let _this = this
    let detail = {}
    detail.encryptedData = e.detail.encryptedData
    detail.iv = e.detail.iv
    detail.nickName = e.detail.userInfo.nickName
    this.setData({
      nickName: detail.nickName
    })
    wx.setStorage({
      key: 'nickName',
      data: detail.nickName
    })
    app.login(detail, app.globalData.code, (csid) => {
      wx.hideLoading()
      _this.setData({
        csid
      })
    })
  },
  fetchCustomerInfo (csid) {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/customer_info`,
      data: {
        promo_id: this.data.promoId
      },
      header: {
        'QF-CSID': csid
      },
      success: function(res) {
        if (res.data.respcd === '0000') {
          let customerInfo = res.data.data.customer_info
          _this.setData({
            buyNumber: customerInfo.customer_buy_num,
            mobile: customerInfo.mobile
          })
        }
      }
    })
  },
  login (detail, code) {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/customer/login`,
      data: {
        detail,
        code,
        appid: 'wxacf513d714e19d2a'
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
    let msg = this.noMoreGoods()
    if (msg !== 'pass' && msg !== 'nolimit') {
      wx.showToast({
        icon: 'none',
        title: msg,
        duration: 2000
      })
      return false
    }
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
        userid: this.data.userid,
        appid: 'wxacf513d714e19d2a',
        order_type: 3,
        goods_info: JSON.stringify(goodsInfo),
        busicd: '800213',
        promo_id: this.data.promoId,
        mode: 'quick_order',
        addr_info: JSON.stringify(userInfo)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'QF-CSID': _this.data.csid
      },
      success: function(res) {
        let data = res.data.data
        if (res.data.respcd === '0000') {
          _this.wechatPay(data.pay_params, data.out_trade_no)
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
  wechatPay (params, orderId) {
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
        wx.showToast({
          title: 'wechatPay success',
          icon: 'none',
          duration: 2000
        })
        _this.setData({
          isOrdering: false
        })
        _this.orderQuery(orderId)
      },
      fail: function(res){
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
  },
  orderQuery (orderId) {
    let _this = this
    wx.request({
      url: `${config.host}/mtm/order/query`,
      data: {
        order_id: orderId
      },
      header: {
        'QF-CSID': _this.data.csid
      },
      success: function(res) {
        let data = res.data
        if (data.respcd === '0000' && data.data.state === 2) {
          // 订单 支付成功
          wx.navigateTo({
            url: `../orderDetail/orderDetail?orderId=${orderId}`
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.resperr,
            duration: 2000
          })
        }
      }
    })
  }
})
