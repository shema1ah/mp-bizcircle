var ENV = 'dev'

// 生产配置
var host = '',
    ohost = ''

// 测试配置
if (ENV === 'test') {
  host = 'https://o.qa.qfpay.net'
  ohost = 'https://o.qa.qfpay.net'
}
// 本地配置
if (ENV === 'dev') {
  host = 'http://172.100.111.45:2004',
  ohost = 'http://172.100.111.45:6200'
}

module.exports = {
  host,
  ohost,
  code: {
    OK: '0000', // 成功
    SESSIONERR: '2002' // 用户未登录
  }
}
