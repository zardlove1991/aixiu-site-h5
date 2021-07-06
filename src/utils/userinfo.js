import STORAGE from '@/utils/storage'
import {getPlat} from '@/utils/utils'
import {sdkPlat} from '@/sdk/index'

import { Toast } from 'mint-ui'

export const getUserInfo = () => {
  return STORAGE.get('userInfo')
}

export const setUserInfo = (data) => {
  return STORAGE.set('userInfo', data)
}

export const setUserDetail = (data) => {
  return STORAGE.set('userDetail', data)
}

export const oauth = (cbk) => {
  console.log('88888')

  Toast({
    message: '进入oauth',
    position: 'bottom',
    duration: 5000
  })
  let plat = getPlat()

  Toast({
    message: 'plat:' + plat,
    position: 'bottom',
    duration: 5000
  })
  sdkPlat[plat].oauth(cbk)
}
