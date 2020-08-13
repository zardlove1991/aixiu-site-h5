import { randomNum, delUrlParams } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import globalConfig from '@/api/config'

let wechat = {
  getAuthUrl: (scope) => {
    let appid = globalConfig['APPID']
    let host = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    let redirectUri = globalConfig['REDIRECT-URI'] + '?backUrl=' + delUrlParams(['code'])
    let newRedirectUri = encodeURIComponent(redirectUri)
    let url = host + '?appid=' + appid + '&redirect_uri=' + newRedirectUri + '&response_type=code&scope=' + scope + '&state=' + randomNum(6)
    return url
  },
  async h5Signature (info, cbk, scope, compAppid) {
    let params = {
      code: info,
      appid: globalConfig['APPID'],
      sign: 'wechat',
      scope,
      mark: 'marketing'
    }
    if (compAppid) {
      params['component_appid'] = compAppid
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
  const existCode = STORAGE.get('code') ? STORAGE.get('code') : ''
  STORAGE.set('code', code)
  if (!code || (code && !existCode) || (code === existCode)) {
    // 获取详情
    let pathname = window.location.pathname
    let id = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
    if (id) {
      let params = { id }
      if (pathname.indexOf('votebegin') !== -1) {
        // 投票
        API.getAuthScope2({ query: params }).then(res => {
          if (res && res.rule && res.rule.limit && res.rule.limit.source_limit) {
            let compAppid = res.rule.limit.source_limit.app_id ? res.rule.limit.source_limit.app_id : ''
            STORAGE.set('component_appid', compAppid)
          }
          STORAGE.set('scope_limit', 'snsapi_userinfo')
          const url = wechat.getAuthUrl('snsapi_userinfo')
          window.location.href = url
        })
      } else {
        // 测评
        API.getAuthScope({ params }).then(res => {
          let limit = res.limit
          let _scope = 'base'
          if (limit && limit.source_limit) {
            _scope = limit.source_limit.scope_limit || 'userinfo'
          }
          let scopeLimit = _scope === 'base' ? 'snsapi_base' : 'snsapi_userinfo'
          STORAGE.set('scope_limit', scopeLimit)
          const url = wechat.getAuthUrl(scopeLimit)
          window.location.href = url
        })
      }
    }
  } else {
    wechat.h5Signature(code, cbk, STORAGE.get('scope_limit'), STORAGE.get('component_appid'))
  }
}
