import { randomNum } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

let wechat = {
  authorize: (cbk) => {
    let host = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    let url = host + '?appid=wx63a3a30d3880a56e&redirect_uri=http://h5-ceshi.aihoge.com/bridge/index.html?backUrl=' + window.location.href + '&response_type=code&scope=snsapi_userinfo&state=' + randomNum(6)
    if (window.$vue.$route.query.code) {
      cbk(1, window.$vue.$route.query.code)
    } else {
      window.location.href = url
    }
  },
  async h5Signature (info, cbk) {
    let params = {
      code: info,
      appid: 'wx63a3a30d3880a56e',
      sign: 'wechat',
      scope: 'snsapi_userinfo',
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
  wechat.authorize((code, info) => {
    if (code > 0 && !STORAGE.get('userinfo')) {
      wechat.h5Signature(info, cbk)
    }
  })
}
