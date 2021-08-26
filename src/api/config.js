import { getEnvironment } from '@/utils/app'
const protocol = window.location.protocol
const env = getEnvironment()
// const suffix = env === 'online' ? '' : `-${env}`
// const v2 = env === 'online' ? '.v2' : ''
const suffix = env === 'online' ? '' : env === 'pre' ? '-ax-pre' : `-${env}`
// const v2 = env === 'online' ? '-ax' : ''
const v2 = ''

export default {
  'submit': `${protocol}//result${suffix}${v2}.kxm.xmtv.cn/`,
  'user': `${protocol}//member${suffix}${v2}.kxm.xmtv.cn/`,
  // 'exam': `${protocol}//examinationapi${suffix}.kxm.xmtv.cn/`,
  'vote': `${protocol}//voteapi${suffix}${v2}.kxm.xmtv.cn/`,
  'mlink': `${protocol}//m${suffix}${v2}.kxm.xmtv.cn/`,
  'reserve': `${protocol}//reserve${suffix}${v2}.kxm.xmtv.cn/`,
  'public': `${protocol}//public${suffix}${v2}.kxm.xmtv.cn/`,
  // 'c4': `${protocol}//c4api${suffix}${v2}.kxm.xmtv.cn/`,
  // 'news': `${protocol}//news${suffix}${v2}.kxm.xmtv.cn/`,

  // 'submit': `${protocol}//nizao.kxm.xmtv.cn/result/`,
  // 'user': `${protocol}//member${suffix}${v2}.kxm.xmtv.cn/`, // 用户部分保留原始结构
  'exam': `${protocol}//public.kxm.xmtv.cn/examinationapi/`,
  // 'vote': `${protocol}//nizao.kxm.xmtv.cn/voteapi/`,
  // 'mlink': `${protocol}//nizao.kxm.xmtv.cn/m/`,
  // 'reserve': `${protocol}//nizao.kxm.xmtv.cn/reserve/`,
  // 'public': `${protocol}//nizao.kxm.xmtv.cn/public/`,
  // 'c4': `${protocol}//public.kxm.xmtv.cn/c4api/`,
  'c4': `${protocol}//c4api.kxm.xmtv.cn/`,
  'news': `${protocol}//public.kxm.xmtv.cn/news/`,
  'plus': env !== 'online' ? `${protocol}//test-mapi.kxm.xmtv.cn/` : `${protocol}//mapi1.kxm.xmtv.cn/`,
  //
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  'APPID': env === 'test' ? 'wx025937621152c396' : 'wx867227e69004473c',
  'COMP_APPID': 'wx566758628b7a3fa2',
  // 'REDIRECT-URI': env === 'test' ? `${protocol}//h5-ceshi.kxm.xmtv.cn/bridge/index.html` : `${protocol}//xzh5.hoge.cn/bridge/index.html`,
  'REDIRECT-URI': env === 'test' ? `${protocol}//h5-ceshi.kxm.xmtv.cn/bridge/index.html` : `${protocol}//nizao.kxm.xmtv.cn/dependent-works/xiamen/bridge/index.html`,
  'OPEN_NEW_PAGE': ['api/client/examination/{id}', 'open/examination/detail', 'h5/signature', 'signature', 'client/voting/base/{id}', 'client/voting/{id}', 'client/order/{id}', 'client/news/{id}/']
}
