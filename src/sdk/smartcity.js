import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { getAppSign } from '@/utils/utils'

let smartcity = {
  authorize: (cbk) => {
    window.SmartCity.getUserInfo((res) => {
      let sdkInfo = {}
      if (res && res.userInfo) {
        console.log('res===', res)
        sdkInfo.userName = res.userInfo.username
        const sign = getAppSign()
        console.log('特殊处理：', sign)
        sdkInfo.userId = `${sign}_${res.userInfo.userid}`
        sdkInfo.avatar_url = res.userInfo.picurl
        sdkInfo.telephone = res.userInfo.telephone
        sdkInfo.accessToken = res.userInfo.userTokenKey
        if (res.userInfo.unit_id) {
          sdkInfo.unit_id = res.userInfo.unit_id
        }
        if (res.userInfo.unit_name) {
          sdkInfo.unit_name = res.userInfo.unit_name
        }
        cbk && cbk(1, sdkInfo)
      } else {
        window.SmartCity.goLogin()
      }
    })
  },
  async h5Signature (sdkInfo, cbk) { // code换用户登录
    try {
      sdkInfo.sign = getAppSign()
      // let plant = sdkConfig[getAppInfo().guid] || sdkConfig['default']
      let params = sdkInfo
      API.getSmartCityUser({
        params
      }).then((res) => {
        if (res && res.id) {
          STORAGE.set('userinfo', res)
          cbk(res)
        }
      })
    } catch (err) {
      cbk(-1, '智慧城市：授权登录失败', err)
    }
  },
  getActiveId (pathname) {
    let id = ''
    if (pathname.indexOf('livestart') !== -1) {
      let startStr = 'livestart/'
      let end = pathname.lastIndexOf('/')
      let start = pathname.indexOf(startStr) + startStr.length
      id = pathname.substring(start, end)
    } else {
      id = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)
    }
    return id
  },
  applicationState () {
    window.SmartCity.applicationState((res) => {
      console.log(res.status)
      let currentRoute = window.$vue.$router.currentRoute
      let map = {
        'depencelist': 'depencestart',
        'livelist': 'livestart'
      }
      if (+res.status === 1) {
        // 页面激活
        console.log('页面激活')
        if (map[currentRoute.name]) {
          let id = currentRoute.params.id
          console.log(map[currentRoute.name])
          window.$vue.$router.replace({name: map[currentRoute.name], params: {id: id}})
        }
      }
      if (+res.status === 2) {
        console.log('程序退出')
      }
      this.applicationState()
    })
  }
}

export const oauth = (cbk) => {
  if (typeof window.SmartCity === 'undefined') {
    cbk(-1, '智慧城市：sdk加载失败')
    return false
  }
  let pathname = window.location.pathname
  let id = smartcity.getActiveId(pathname)
  smartcity.applicationState()
  if (id) {
    // STORAGE.clear()
    STORAGE.remove('scope_limit')
    STORAGE.remove('statInfo')
    STORAGE.remove('userinfo')
    STORAGE.remove('detailInfo')
    STORAGE.remove('component_appid')
    STORAGE.remove('appid')
    STORAGE.remove('location')
    STORAGE.remove('news_weather')
    smartcity.authorize((code, sdkInfo) => {
      if (code > 0) {
        smartcity.h5Signature(sdkInfo, cbk)
      }
    })
  }
}
