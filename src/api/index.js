import axios from 'axios'
import apiConfig from './config'
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
  return config
}, error => Promise.reject(error))

// 请求后的过滤器
instance.interceptors.response.use((res, xhr) => {
  const data = res.data
  const route = window.$vue.$route
  let curErrorCode = data.error || data.error_code
  let curErrorMsg = data.message || data.error_message
  let query = route.query
  let params = route.params
  // 判断是否当前是否过期
  if (curErrorCode === 'error-login') {
    let nowUrl = decodeURIComponent(window.location.href)
    let host = apiConfig.hostMap[getApiFlag()]
    if (!query.plat) {
      let url = `//${host}/client/authorize/start/${params.id}?to=${nowUrl}`
      window.location.replace(url)
    }
  } else if (curErrorCode === 'invalid-source') {
    window.$vue.$router.replace({
      path: '/permission',
      query: {
        errorMsg: curErrorMsg,
        redirect: query.redirect
      }
    })
  } else {
    if (data.error_code > 0) {
      data.status = res.status
      if (data.error_code === 403) {
        return Promise.reject(data)
      } else {
        return Promise.reject(data)
      }
    }
    return data.response || data.result || data
  }
}, (error) => {
  let rej = null
  let res = error.response
  console.log('error 接口请求错误信息', error)
  if (res) {
    console.log('error res', res)
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
    rej = {
      error_code: 'AJAX_ERROR',
      error_message: '访问错误',
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
