const config = localStorage.getItem(location.host) ? JSON.parse(localStorage.getItem(location.host)) : {}
const host = `${window.location.protocol}//${window.location.host}/api`
const apiHost = config.CUSTOM_HOST
const protocol = window.location.protocol

export default {
  'submit': `${host}/result/`,
  'user': `${host}/memberhy/`,
  'exam': `${host}/examinationhy/`,
  'vote': `${host}/votinghy/`,
  'mlink': `${host}/m/`,
  'reserve': `${host}/reserve/`,
  'public': `${host}/publichy/`,
  'c4': `//c4api${apiHost}/`,
  'news': `${host}/news/`,
  'timeout': 36000,
  'HTTP-X-H5-VERSION': 1.0,
  'X-CLIENT-VERSION': 1314,
  'X-DEVICE-ID': '000',
  'APPID': config.CUSTOM_APPID,
  'COMP_APPID': config.CUSTOM_COMP_APPID,
  'REDIRECT-URI': `${protocol}${config.CUSTOM_REDIRECT_URI}`,
  'OPEN_NEW_PAGE': ['api/client/examination/{id}', 'open/examination/detail', 'h5/signature', 'signature', 'client/voting/base/{id}', 'client/voting/{id}', 'client/order/{id}', 'client/news/{id}/'],
  'zengchengSiteId': '/78fa6d06b0dd4f27abf341e5efde035a/'
}
