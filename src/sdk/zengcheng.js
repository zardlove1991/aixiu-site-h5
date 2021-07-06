/* eslint-disable no-unused-vars */
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { getZCUserId } from '@/utils/utils'
import { Toast } from 'mint-ui'

let zengChengObj = {
  async getZengChengLoginInfo (cbk) { // code换用户登录
    try {
      let params = {}
      params.userid = getZCUserId()
      API.getZengChengUser({
        params
      }).then((res) => {
        if (res && res.id) {
          STORAGE.set('userinfo', res)
          cbk(res)
        }

        if (res.ErrorCode) {
          Toast({
            message: res.ErrorText,
            position: 'bottom',
            duration: 5000
          })
        }
      })
    } catch (err) {
      cbk(-1, '阅增城：登录失败', err)
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
  }
}

export const oauth = (cbk) => {
  let pathname = window.location.pathname
  let id = zengChengObj.getActiveId(pathname)
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

    // 判断当前的用户是否已经登录
    console.log('navigator', navigator)
    if (getZCUserId() !== null) {
      // 获取用户的信息
      zengChengObj.getZengChengLoginInfo(cbk)
    }
  }
}
