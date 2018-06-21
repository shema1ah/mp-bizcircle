var config = require('../../utils/config.js')

Page({
  data: {
    csid: '',
    swipers: [],
    goodsInfo: {},
    mchntInfo: {},
    promoInfo: {},
    imageSizes: []  // 保存图片尺寸
  },
  goShopList() {
    wx.navigateTo({
      url: `../subStore/subStore?enuserid=${this.data.mchntInfo.enuserid}`
    })
  },
  goMakeOrder() {
    let goodsInfo = this.data.goodsInfo
    let promoInfo = this.data.promoInfo
    wx.navigateTo({
      url: `../makeOrder/makeOrder?userid=${promoInfo.userid}&buyLimit=${promoInfo.buy_limit}&promoId=${promoInfo.id}&goodsId=${goodsInfo.id}&goodsTotal=${goodsInfo.total}&goodsName=${goodsInfo.name}&goodsTxamt=${goodsInfo.txamt}&goodsImg=${goodsInfo.img}`
    })
  },
  call(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.number
    })
  },
  onLoad(options) {
    let scene = decodeURIComponent(options.scene)
    if (options.id) {
      this.fetchData(options.id)
    } else if (scene) {
      this.fetchData(scene)
    }
  },
  onShareAppMessage(res) {
    return {
      title: this.data.goodsInfo.name,
      path: `/pages/goodsDetail/goodsDetail?id=${this.data.promoInfo.id}`,
      imageUrl: this.data.goodsInfo.img
    }
  },
  imageLoad (e) {
    var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;   //图片的真实宽高比例
    var viewWidth = 690,           //设置图片显示宽度，
        viewHeight = 690 / ratio;    //计算高度值
    var images = this.data.imageSizes;
    images[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      imageSizes: images
    })
  },
  fetchData(id = '6411856887648428647') {
    wx.showLoading({
      title: '加载中...'
    })
    let _this = this
    wx.request({
      url: `${config.host}/mtm/promo/info`,
      data: {
        id
      },
      header: {
        'QF-CSID': this.data.csid
      },
      success: function(res) {
        wx.hideLoading()
        let promo = res.data.data.promo
        _this.setData({
          swipers: promo.goods_info.imgs,
          mchntInfo: promo.mchnt_info,
          goodsInfo: promo.goods_info,
          promoInfo: promo
        })
      }
    })
  }
})
