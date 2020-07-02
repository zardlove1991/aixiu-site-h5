import axios from 'axios'
import apiConfig from './config'
import { oauth } from '@/utils/userinfo'
import STORAGE from '@/utils/storage'
import { getAppInfo, getAPIfix, getApiFlag } from '@/utils/app'

const instance = axios.create({
  timeout: apiConfig.timeout
})
// 请求前添加的过滤器
instance.interceptors.request.use((config) => {
  config.headers['HTTP-X-H5-VERSION'] = apiConfig['HTTP-X-H5-VERSION']
  config.headers['X-CLIENT-VERSION'] = apiConfig['X-CLIENT-VERSION']
  config.headers['X-DEVICE-ID'] = apiConfig['X-DEVICE-ID']
  config.params = config.params || {}
  if (config.url.indexOf('setSubmit') > -1) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }
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
      let newHost = host.substring(0, host.indexOf('/api'))
      let url = `${newHost}/client/authorize/start/${params.id}?to=${nowUrl}`
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
  }
}

// 请求后的过滤器
instance.interceptors.response.use((res, xhr) => {
  const data = res.data
  if ((data.ErrorCode === 'NO_LOGIN' || data.ErrorCode === 'EXPIRE_SIGNATURE' || data.ErrorText === '无法获取用户信息' || data.ErrorText === '用户信息错误') || !STORAGE.get('userinfo')) {
    STORAGE.clear()
    oauth((res) => {
      window.location.reload()
    })
  }
  let curErrorCode = data.error || data.error_code
  let curErrorMsg = data.message || data.error_message
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
  return data.response || data.result || data
}, (error) => {
  let rej = null
  let res = error.response
  console.log('error 接口请求错误信息', error)
  if (res) {
    if (res.data) {
      let curErrorCode = res.data.error || res.data.error_code
      let curErrorMsg = res.data.message || res.data.error_message
      dealError({ code: curErrorCode, msg: curErrorMsg })
    } else {
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
    }
  } else {
    rej = {
      error_code: 'AJAX_ERROR',
      error_message: '服务器开小差了，请稍后再试~',
      status: 500
    }
  }
  return Promise.reject(rej)
})

const getUrl = (url, config = {}, api = 'API') => {
  if (!url) {
    console.warn('接口地址不能为空')
    return false
  }
  config.query = config.query || {}

  let guid = getAppInfo().guid
  url = url
    .replace('{guid}', guid)
    .replace('{id}', config.query.id)
  return getAPIfix(api) + url
}

export const createAPI = (url, method, config = {}, api) => {
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const createSumbit = (url, method, config = {}, api) => {
  api = 'sumbitAPI'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}

export const creataUser = (url, method, config = {}, api) => {
  api = 'USER'
  return instance({
    url: getUrl(url, config, api),
    method,
    withCredentials: true,
    ...config
  })
}
