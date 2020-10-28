import { randomNum, delUrlParams } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import globalConfig from '@/api/config'

let wechat = {
  getAuthUrl: (scope) => {
    let appid = STORAGE.get('appid') ? STORAGE.get('appid') : globalConfig['APPID']
    let host = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    let redirectUri = globalConfig['REDIRECT-URI'] + '?backUrl=' + delUrlParams(['code'], true)
    let newRedirectUri = encodeURIComponent(redirectUri)
    let url = host + '?appid=' + appid + '&redirect_uri=' + newRedirectUri + '&response_type=code&scope=' + scope + '&state=' + randomNum(6)
    return url
  },
  async getVoteAuthScope (id) {
    let params = { id }
    let scopeLimit = 'snsapi_userinfo'
    API.getVoteAuthScope({ query: params }).then(res => {
      let componentAppid = ''
      if (res && res.rule && res.rule.limit && res.rule.limit.source_limit) {
        let limit = res.rule.limit.source_limit
        if (limit.app_id) {
          componentAppid = globalConfig['COMP_APPID']
          STORAGE.set('component_appid', globalConfig['COMP_APPID'])
          STORAGE.set('appid', limit.app_id)
        }
      }
      STORAGE.set('scope_limit', scopeLimit)
      let url = wechat.getAuthUrl(scopeLimit)
      if (componentAppid) {
        url = url + '&component_appid=' + componentAppid
      }
      window.location.href = url
    })
  },
  async getExamAuthScope (id) {
    let params = { id }
    API.getExamAuthScope({ params }).then(res => {
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
  },
  async getEnrollScope () {
    let scopeLimit = 'snsapi_userinfo'
    STORAGE.set('scope_limit', scopeLimit)
    const url = wechat.getAuthUrl(scopeLimit)
    window.location.href = url
  },
  async h5Signature (info, cbk) {
    let scope = STORAGE.get('scope_limit')
    let compAppid = STORAGE.get('component_appid')
    let appid = STORAGE.get('appid') ? STORAGE.get('appid') : globalConfig['APPID']
    let params = {
      code: info,
      appid,
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
      if (res.ErrorCode) {
        // code已经被使用了
        this.goRedirect()
      }
      if (res && res.id) {
        STORAGE.set('userinfo', res)
        cbk(res)
      }
    })
  },
  async goRedirect () {
    let pathname = window.location.pathname
    let id = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
    if (id) {
      STORAGE.remove('userinfo')
      STORAGE.remove('component_appid')
      STORAGE.remove('appid')
      STORAGE.remove('detailInfo')
      if (pathname.indexOf('votebegin') !== -1 || pathname.indexOf('votedetail') !== -1) {
        // 投票
        this.getVoteAuthScope(id)
      } else if (pathname.indexOf('enrollstart') !== -1) {
        this.getEnrollScope()
      } else if (pathname.indexOf('depencestart') !== -1 || pathname.indexOf('livestart') !== -1) {
        // 测评
        this.getExamAuthScope(id)
      }
    }
  }
}

export const oauth = (cbk) => {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  const userinfo = STORAGE.get('userinfo')
  if (code && !userinfo) {
    // 重定向回来的地址，带有code值
    wechat.h5Signature(code, cbk)
  } else {
    // 跳转地址
    wechat.goRedirect()
  }
}
