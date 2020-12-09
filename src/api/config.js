// import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
// const env = getEnvironment()
// const suffix = env === 'online' ? '-ax' : `-ax-${env}`
// const host = `${suffix}.aihoge.com`
const config = require('../../setting.json')
const host = config.CUSTOM_HOST
console.log(config, 999999)

export default {
  'submit': `${protocol}//result${host}/`,
  'user': `${protocol}//member${host}/`,
  'exam': `${protocol}//examinationapi${host}/`,
  'vote': `${protocol}//voteapi${host}/`,
  'mlink': `${protocol}//m${host}/`,
  'reserve': `${protocol}//reserve${host}/`,
  'public': `${protocol}//public${host}/`,
  'c4': `${protocol}//c4api${host}/`,
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
