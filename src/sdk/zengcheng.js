/* eslint-disable no-unused-vars */
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { Toast } from 'mint-ui'

// window.zc_tools = {
//   userInfo: function (obj) {
//     let userId = obj['userId']
//     Toast({
//       message: 'userId:' + userId,
//       position: 'top',
//       duration: 5000
//     })
//   }
// }
let zengChengObj = {
  getZengChengLoginInfo (cbk) { // code换用户登录
    try {
      let params = {}
      console.log('9999')
      let userId = 'f453c0ab936142f18bc8bd2605a4b727'

      params.userid = userId
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
            position: 'middle',
            duration: 5000
          })
        }
      })
      return false

      // let params = {}
      // window.webkit.messageHandlers.getLoginUserId.postMessage(JSON.stringify({callBack: 'callbackUserInfo'}))
      // // eslint-disable-next-line no-unused-vars
      // // eslint-disable-next-line no-inner-declarations
      // window.callbackUserInfo = function (obj) {
      //   let userId = obj['userId']
      //   userId = 'f453c0ab936142f18bc8bd2605a4b727'

      //   params.userid = userId
      //   API.getZengChengUser({
      //     params
      //   }).then((res) => {
      //     if (res && res.id) {
      //       STORAGE.set('userinfo', res)
      //       cbk(res)
      //     }

      //     if (res.ErrorCode) {
      //       Toast({
      //         message: res.ErrorText,
      //         position: 'middle',
      //         duration: 5000
      //       })
      //     }
      //   })
      // }
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

    // 获取用户的信息
    zengChengObj.getZengChengLoginInfo(cbk)
  }
}
