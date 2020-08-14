import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
const env = getEnvironment()
const suffix = env === 'online' ? '' : `-${env}`
const v2 = env === 'online' ? '.v2' : ''

export default {
  'submit': `${protocol}//result${suffix}${v2}.aihoge.com/`,
  'user': `${protocol}//member${suffix}${v2}.aihoge.com/`,
  'exam': `${protocol}//examinationapi${suffix}.aihoge.com/`,
  'vote': `${protocol}//voteapi${suffix}${v2}.aihoge.com/`,
  'mlink': `${protocol}//m${suffix}${v2}.aihoge.com/`,
  'reserve': `${protocol}//reserve${suffix}${v2}.aihoge.com/`,
  'public': `${protocol}//public${suffix}${v2}.aihoge.com/`,
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  'APPID': env === 'test' ? 'wx025937621152c396' : 'wx63a3a30d3880a56e',
  'COMP_APPID': 'wx566758628b7a3fa2',
  'REDIRECT-URI': env === 'test' ? 'http://h5-ceshi.aihoge.com/bridge/index.html' : 'http://h5.ixiuzan.cn/bridge/index.html'
}
