import { randomNum } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import globalConfig from '@/api/config'

let wechat = {
  authorize: (cbk, scope) => {
    let appid = globalConfig['APPID']
    let redirectUri = globalConfig['REDIRECT-URI']
    let host = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    let url = host + '?appid=' + appid + '&redirect_uri=' + redirectUri + '?backUrl=' + window.location.href + '&response_type=code&scope=' + scope + '&state=' + randomNum(6)
    if (window.$vue.$route.query.code) {
      cbk(1, window.$vue.$route.query.code)
    } else {
      window.location.href = url
    }
  },
  async h5Signature (info, cbk, scope) {
    let params = {
      code: info,
      appid: globalConfig['APPID'],
      sign: 'wechat',
      scope,
      mark: 'marketing'
    }
    API.getXiuzanUser({
      params
    }).then((res) => {
      if (res && res.id) {
        STORAGE.set('userinfo', res)
        cbk(res)
      }
    })
  }
}

export const oauth = (cbk) => {
  // 获取详情
  let pathname = window.location.pathname
  let id = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
  if (id) {
    let params = { id }
    let scope = ''
    API.getAuthScope({ params }).then(res => {
      let limit = res.limit
      if (limit && limit.source_limit) {
        let { scope_limit: scopeLimit } = limit.source_limit
        if (scopeLimit) {
          scope = scopeLimit
        }
      }
    })
    if (scope && scope === 'base') {
      scope = 'snsapi_base'
    } else {
      scope = 'snsapi_userinfo'
    }
    wechat.authorize((code, info) => {
      if (code > 0 && !STORAGE.get('userinfo')) {
        wechat.h5Signature(info, cbk, scope)
      }
    }, scope)
  }
}
