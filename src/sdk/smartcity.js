import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { getAppSign } from '@/utils/utils'

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
  async getExamAuthScope (id, cbk) {
    let params = { id }
    API.getExamAuthScope({ params }).then(res => {
      let limit = res.limit
      if (limit && limit.source_limit) {
        let { avoid_landing: avoidanding } = limit.source_limit
        if (avoidanding) {
          // 免登陆

          const params2 = {
            userId: 'xiuzan',
            sign: getAppSign(),
            userName: '爱秀小秘书',
            avatarUrl: `${location.protocol}//aixiu.aihoge.com/dist/images/global/toplogo-2x.png`
          }
          try {
            API.getSmartCityUser({
              params: params2
            }).then((res) => {
              if (res && res.id) {
                STORAGE.set('userinfo', res)
                cbk(res)
              }
            })
          } catch (err) {
            console.log(err)
            cbk(-1, '智慧城市：失败', err)
          }
        } else {
          smartcity.authorize((code, sdkInfo) => {
            if (code > 0) {
              smartcity.h5Signature(sdkInfo, cbk)
            }
          })
        }
      }
    })
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
  }
}

export const oauth = (cbk) => {
  if (typeof window.SmartCity === 'undefined') {
    cbk(-1, '智慧城市：sdk加载失败')
    return false
  }
  let pathname = window.location.pathname
  let id = smartcity.getActiveId(pathname)
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
    if (pathname.indexOf('votebegin') !== -1 || pathname.indexOf('votedetail') !== -1 ||
      pathname.indexOf('enrollstart') !== -1 || pathname.indexOf('newstart') !== -1 || pathname.indexOf('drawlist') !== -1) {
      smartcity.authorize((code, sdkInfo) => {
        if (code > 0) {
          smartcity.h5Signature(sdkInfo, cbk)
        }
      })
    } else {
      // 测评 判断是否需要免登陆
      smartcity.getExamAuthScope(id, cbk)
    }
  }
}
