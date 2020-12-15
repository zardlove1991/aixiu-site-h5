const config = localStorage.getItem(location.host) ? JSON.parse(localStorage.getItem(location.host)) : {}
const host = `${window.location.protocol}//${window.location.host}/api`

export default {
  'submit': `${host}/result/`,
  'user': `${host}/member/`,
  'exam': `${host}/examinationapi/`,
  'vote': `${host}/voteapi/`,
  'mlink': `${protocol}//m${host}/m/`,
  'reserve': `${host}/reserve/`,
  'public': `${host}/public/`,
  'c4': `${host}/c4api/`,
  'news': `${host}/news/`,
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  // 'APPID': env === 'test' ? 'wx025937621152c396' : 'wx63a3a30d3880a56e',
  // 'COMP_APPID': 'wx566758628b7a3fa2',
  // 'REDIRECT-URI': env === 'test' ? 'http://h5-ceshi.aihoge.com/bridge/index.html' : 'http://h5.ixiuzan.cn/bridge/index.html'
  'APPID': config.CUSTOM_APPID,
  'COMP_APPID': config.CUSTOM_COMP_APPID,
  'REDIRECT-URI': config.CUSTOM_REDIRECT_URI
}
