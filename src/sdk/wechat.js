import { randomNum } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import globalConfig from '@/api/config'

let wechat = {
  getAuthUrl: (scope) => {
    let appid = globalConfig['APPID']
    let redirectUri = globalConfig['REDIRECT-URI']
    let host = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    let url = host + '?appid=' + appid + '&redirect_uri=' + redirectUri + '?backUrl=' + window.location.href + '&response_type=code&scope=' + scope + '&state=' + randomNum(6)
    return url
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
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  const existCode = STORAGE.get('code')
  STORAGE.set('code', code)
  if (!code || !existCode || (code === existCode)) {
    // 获取详情
    let pathname = window.location.pathname
    let id = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
    if (id) {
      let params = { id }
      API.getAuthScope({ params }).then(res => {
        let limit = res.limit
        let _scope = 'userinfo'
        if (limit && limit.source_limit) {
          _scope = limit.source_limit.scope_limit || 'userinfo'
        }
        let scopeLimit = _scope === 'base' ? 'snsapi_base' : 'snsapi_userinfo'
        STORAGE.set('scope_limit', scopeLimit)
        const url = wechat.getAuthUrl(scopeLimit)
        window.location.href = url
      })
    }
  } else {
    wechat.h5Signature(code, cbk, STORAGE.get('scope_limit'))
  }
}
