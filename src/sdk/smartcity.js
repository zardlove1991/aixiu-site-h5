import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

let smartcitySetting = {
  sign: 'smartcity',
  jssdk: '//h5.xiuzan.com/p/Tplglobal/js/smartCity_sdk.js',
  name: '智慧城市',
  audioTimer: 0,
  validPlay: false
}

let smartcity = {
  authorize: (cbk) => {
    window.SmartCity.getUserInfo((res) => {
      let sdkInfo = {}
      if (res && res.userInfo) {
        sdkInfo.userName = res.userInfo.username
        sdkInfo.userId = res.userInfo.m2ouid.split('.').pop() + '_' + res.userInfo.userid
        sdkInfo.avatarUrl = res.userInfo.picurl
        sdkInfo.telephone = res.userInfo.telephone
        sdkInfo.accessToken = res.userInfo.userTokenKey
        cbk && cbk(1, sdkInfo)
      } else {
        window.SmartCity.goLogin()
      }
    })
  },
  async h5Signature (sdkInfo, cbk) { // code换用户登录
    try {
      sdkInfo.sign = smartcitySetting.sign
      // let plant = sdkConfig[getAppInfo().guid] || sdkConfig['default']
      let params = sdkInfo
      API.getSmartCityUser({
        params
      }).then((res) => {
        if (res && res.id) {
          STORAGE.set('userinfo', res)
          console.log(STORAGE.get('userinfo'), 'userinfo')
        }
      })
    } catch (err) {
      cbk(-1, '智慧城市：授权登录失败', err)
    }
  }
}

export const oauth = (cbk) => {
  if (typeof window.SmartCity === 'undefined') {
    cbk(-1, '智慧城市：sdk加载失败')
    return false
  }
  smartcity.authorize((code, sdkInfo) => {
    if (code > 0) {
      smartcity.h5Signature(sdkInfo, cbk)
    }
  })
}
