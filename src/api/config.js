import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
const env = getEnvironment()
const suffix = env === 'online' ? '' : `-${env}`
const v2 = env === 'online' ? '' : ''

export default {
  'submit': `${protocol}//result${suffix}${v2}.kxm.xmtv.cn/`,
  'user': `${protocol}//member${suffix}${v2}.kxm.xmtv.cn/`,
  'vote': `${protocol}//voteapi${suffix}${v2}.kxm.xmtv.cn/`,
  'mlink': `${protocol}//m${suffix}${v2}.kxm.xmtv.cn/`,
  'reserve': `${protocol}//reserve${suffix}${v2}.kxm.xmtv.cn/`,
  'public': `${protocol}//public${suffix}${v2}.kxm.xmtv.cn/`,
  'exam': `${protocol}//public.kxm.xmtv.cn/examinationapi/`,
  'c4': `${protocol}//nizao.kxm.xmtv.cn/c4api/`,
  'news': `${protocol}//nizao.kxm.xmtv.cn/news/`,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  'APPID': env === 'test' ? 'wx025937621152c396' : 'wx867227e69004473c',
  'COMP_APPID': 'wx566758628b7a3fa2',
  'REDIRECT-URI': env === 'test' ? `${protocol}//h5-ceshi.kxm.xmtv.cn/bridge/index.html` : `${protocol}//nizao.kxm.xmtv.cn/dependent-works/xiamen/bridge/index.html`,
  'OPEN_NEW_PAGE': ['api/client/examination/{id}', 'open/examination/detail', 'h5/signature', 'signature', 'client/voting/base/{id}', 'client/voting/{id}', 'client/order/{id}', 'client/news/{id}/']
}
