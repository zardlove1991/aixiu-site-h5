import { randomNum } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
const protocol = window.location.protocol

let wechat = {
  authorize: (cbk) => {
    let host = `${protocol}//oapi.dingtalk.com/connect/oauth2/sns_authorize`
    let url = host + '?appid=dingoajqqxk2c5i3afixco&redirect_uri=' + window.location.origin + '/bridge.html?backUrl=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_login&state=' + randomNum(6)
    if (window.$vue.$route.query.code) {
      cbk(1, window.$vue.$route.query.code)
    } else {
      window.location.href = url
    }
  },
  async h5Signature (info, cbk) {
    let params = {
      code: info,
      appid: 'dingoajqqxk2c5i3afixco',
      sign: 'dingding',
      scope: 'snsapi_userinfo',
      mark: 'marketing'
    }
    API.getDingdingUser({
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
  wechat.authorize((code, info) => {
    if (code > 0 && !STORAGE.get('userinfo')) {
      wechat.h5Signature(info, cbk)
    }
  })
}
