import STORAGE from '@/utils/storage'
import {getPlat} from '@/utils/utils'
import {sdkPlat} from '@/sdk/index'

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
  let plat = getPlat()
  console.log('plat', plat)
  sdkPlat[plat].oauth(cbk)
}
