import axios from 'axios'
import store from '@/store/index'
import apiConfig from './config'
// import { oauth } from '@/utils/userinfo'
import STORAGE from '@/utils/storage'
import { getAppInfo, getAPIfix, getApiFlag } from '@/utils/app'
import wechat from '@/sdk/wechat'

let smartCityConfig = {}
let userAgent = navigator.userAgent.toLowerCase()
let plat = ''
if (/micromessenger/.test(userAgent)) {
  plat = 'wechat'
} else if (/m2oapp/.test(userAgent) || /m2osmartcity/.test(userAgent)) {
  let arr = userAgent.split(' ')
  plat = 'smartcity'
  arr.map(item => {
    if (/smartcity/.test(item)) {
      plat = item
    }
  })
} else if (/dingdone/.test(userAgent) || /kdtunion/.test(userAgent)) {
  plat = 'dingdone'
} else if (/dingtalk/.test(userAgent) || /aliapp/.test(userAgent)) {
  plat = 'dingding'
}
const flag = plat.indexOf('m2osmartcity') > -1
if (flag) {
  window.SmartCity.getUserInfo(res => {
    if (res && res.userInfo) {
      smartCityConfig.access_token = res.userInfo.userTokenKey
      smartCityConfig.member_id = res.userInfo.userid
    }
  })
}

let currentApi = ''
const instance = axios.create({
  timeout: apiConfig.timeout
})
// 请求前添加的过滤器
instance.interceptors.request.use((config) => {
  config.headers['HTTP-X-H5-VERSION'] = apiConfig['HTTP-X-H5-VERSION']
  config.headers['X-CLIENT-VERSION'] = apiConfig['X-CLIENT-VERSION']
  config.headers['X-DEVICE-ID'] = apiConfig['X-DEVICE-ID']
  config.headers['X-DEVICE-SIGN'] = plat
  config.params = config.params || {}
  if (smartCityConfig && smartCityConfig.access_token) {
    config.headers['X-PLUS-MEMBER'] = `access_token=${smartCityConfig.access_token}&member_id=${smartCityConfig.member_id}`
  }
  // if (config.url.indexOf('setSubmit') > -1) {
  //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  // }
  if (config.url.indexOf('setClick') < 0) {
    if (STORAGE.get('userinfo')) {
      config.params.member = STORAGE.get('userinfo')
    }
    if (STORAGE.get('guid')) {
      config.params.guid = STORAGE.get('guid')
    }
  }
  return config
}, error => Promise.reject(error))

function dealError ({code, msg}) {
  const route = window.$vue.$route
  let query = route.query
  let params = route.params
  if (code === 'error-login') {
    let nowUrl = decodeURIComponent(window.location.href)
    let host = apiConfig[getApiFlag()]
    if (!query.plat) {
      let url = `${host}/client/authorize/start/${params.id}?to=${nowUrl}`
      window.location.replace(url)
    }
  } else if (code === 'invalid-source') {
    window.$vue.$router.replace({
      path: '/permission',
      query: {
        errorMsg: msg,
        redirect: query.redirect
      }
    })
  } else if (code === 'EXPIRE_SIGNATURE' || code === 'NO_LOGIN') {
    // 签名过期 直接去中转页面
    wechat.goRedirect()
  }
}

// 请求后的过滤器
instance.interceptors.response.use((res, xhr) => {
  const data = res.data
  let curErrorCode = data.error || data.error_code || data.ErrorCode
  let curErrorMsg = data.message || data.error_message || data.ErrorText
  dealError({ code: curErrorCode, msg: curErrorMsg })
  // 判断是否当前是否过期
  if (data.error_code > 0) {
    console.log('data.error_code', data.error_code)
    data.status = res.status
    if (data.error_code === 403) {
      return Promise.reject(data)
    } else {
      return Promise.reject(data)
    }
  }
  const dom = document.getElementById('watting-wrap')
  if (STORAGE.get('userinfo') && dom) {
    dom.style.display = 'none'
  }
  if (res.status === 204) {
    const url = encodeURI(window.location.href)
    window.location.href = `/nodata.html?origin=${url}`
  }
  return data.response || data.result || data
}, (error) => {
  const status = error.response && Number(error.response.status)
  const url = encodeURI(window.location.href)
  const isTimeout = error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1 // 请求超时
  // if (isTimeout || status === 503 || status === 429 || status === 499) {
  //   if (apiConfig['OPEN_NEW_PAGE'].indexOf(currentApi) !== -1) {
  //     window.location.href = `/waitting.html?origin=${url}`
  //   } else {
  //     store.dispatch('setDialogVisible', true)
  //     return
  //   }
  // }

  if (isTimeout || status === 503) {
    window.location.href = `/error.html?origin=${url}`
  }
  if (status === 429 || status === 499) {
    if (apiConfig['OPEN_NEW_PAGE'].indexOf(currentApi) !== -1) {
      window.location.href = `/waitting.html?origin=${url}`
      console.log(url)
    } else {
      store.dispatch('setDialogVisible', true)
      return
    }
  }

  if (status >= 500) {
    // window.location.href = `/error.html?origin=${url}`
    // window.location.href = `/waitting.html?origin=${url}`
  }
  let rej = null
  let res = error.response
  console.log('error 接口请求错误信息', error)
  if (res) {
    if (res.data) {
      let curErrorCode = res.data.error || res.data.error_code
      let curErrorMsg = res.data.message || res.data.error_message
      dealError({ code: curErrorCode, msg: curErrorMsg })
    }
    let errorDataObj = error.response.data
    if (errorDataObj && errorDataObj.error_code) {
      rej = {
        error_code: errorDataObj.error_code,
        error_message: errorDataObj.error_message,
        status: error.response.status
      }
    } else {
      rej = {
        error_code: error.response.data,
        error_message: error.response.statusText,
        status: error.response.status
      }
    }
  } else {
    const url = encodeURI(window.location.href)
    if (apiConfig['OPEN_NEW_PAGE'].indexOf(currentApi) !== -1) {
      window.location.href = `/waitting.html?origin=${url}`
    } else {
      store.dispatch('setDialogVisible', true)
      return
    }
    rej = {
      error_code: 'AJAX_ERROR',
      error_message: '活动太火爆了',
      status: 500
    }
  }
  return Promise.reject(rej)
})

const getUrl = (url, config = {}, api = 'exam') => {
  currentApi = url
  if (!url) {
    console.warn('接口地址不能为空')
    return false
  }
  config.query = config.query || {}

  let guid = getAppInfo().guid
  url = url
    .replace('{guid}', guid)
    .replace('{id}', config.query.id)
    .replace('{worksId}', config.query.worksId)
  return getAPIfix(api) + url
}

export const createAPI = (url, method, config = {}, api) => {
  api = 'exam'
  return instance({
    url: getUrl('api/' + url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createSumbit = (url, method, config = {}, api) => {
  api = 'submit'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const creataUser = (url, method, config = {}, api) => {
  api = 'user'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createExam = (url, method, config = {}, api) => {
  api = 'exam'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createVote = (url, method, config = {}, api) => {
  api = 'vote'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createBase = (url, method, config = {}, api) => {
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createC4 = (url, method, config = {}, api) => {
  api = 'c4'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    headers: {
      'x-member': encodeURIComponent(JSON.stringify(STORAGE.get('userinfo')))
    },
    ...config
  })
}
