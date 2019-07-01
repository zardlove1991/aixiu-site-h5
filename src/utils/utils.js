import base64 from '@/lib/base64'
import utf8 from '@/lib/utf8'
import {
  qcloudSettingLine,
  qcloudSettingDev,
  qcloudSetting
} from '@/config/upload'
/**
 * [格式化时间戳]
 * @param  {[number]} utcstr [时间戳]
 * @param  {[string]} format [时间格式，支持的格式自定义，需在该方法中配置]
 * @return {[string]}        [转化后的时间格式]
 */
export const formatDate = (utcstr, format = 'YYYY-MM-DD hh:mm:ss', flag = false) => {
  let _format = function (num) {
    if (num < 10) {
      num = '0' + num
    } else {
      num = num + ''
    }
    return num
  }
  if (typeof utcstr === 'number') {
    utcstr = utcstr * 1000
  }
  let equipmentVersion = navigator.userAgent.toLowerCase()
  let isTimestr = /^[0-9]*$/.test(utcstr)
  if (/iphone|ipad|ipod/.test(equipmentVersion) && !isTimestr && flag) {
    utcstr = utcstr.replace(/-/g, '/')
  }
  let newDate = new Date(utcstr)
  let year = newDate.getFullYear()
  let month = newDate.getMonth() + 1
  let dd = newDate.getDate()
  let hour = newDate.getHours()
  let min = newDate.getMinutes()
  let sec = newDate.getSeconds()

  return format
    .replace('YYYY', _format(year))
    .replace('MM', _format(month))
    .replace('DD', _format(dd))
    .replace('hh', _format(hour))
    .replace('mm', _format(min))
    .replace('ss', _format(sec))
}

/* 秒数转换成时间 */
export const formatTimeBySec = (sec, isShowHour = false, joinTip = ':') => {
  let hour = Math.floor(sec / 3600)
  let minute = Math.floor(sec % 3600 / 60)
  let second = Math.floor(sec % 3600 % 60)
  let timeArr = [hour, minute, second].map(val => (val < 10 ? `0${val}` : val))
  if (!isShowHour) timeArr.shift()
  return timeArr.join(joinTip)
}

/*
 * 判断嵌入平台
 * */
export const getPlat = () => {
  let userAgent = navigator.userAgent.toLowerCase()
  if (/micromessenger/.test(userAgent)) {
    return 'wechat'
  } else if (/m2oapp/.test(userAgent) || /m2osmartcity/.test(userAgent)) {
    return 'smartcity'
  } else if (/dingdone/.test(userAgent)) {
    return 'dingdone'
  } else if (/kdtunion/.test(userAgent)) {
    return 'dingdone'
  } else if (/dingtalk/.test(userAgent) || /aliapp/.test(userAgent)) {
    return 'dingding'
  }
  return 'browser'
}
/*
* 动态set head title
* */
export const setBrowserTitle = (title) => {
  let plat = getPlat()
  document.title = title
  if (plat === 'dingding' || plat === 'dingdone') {
    let i = document.createElement('iframe')
    i.src = '/static/js/browser.js'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 2)
    }
    document.body.appendChild(i)
  } else {
    document.title = title
  }
}

export const getUrlParam = (key) => {
  if (typeof key === 'undefined') {
    let param = {}
    location.search.replace(/([^=?&]*)=([^&]*)/g, (item, key, value) => {
      param[decodeURIComponent(key)] = decodeURIComponent(value)
    })
    return param
  }
  let pattern = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  let match = window.location.search.substr(1).match(pattern)
  return match !== null ? decodeURIComponent(match[2]) : null
}

export const setPlatCssInclude = () => {
  let urlParams = getUrlParam()
  let theme = urlParams.theme ? urlParams.theme : 'default'
  window.document.documentElement.setAttribute('data-theme', theme)
}

// 创建一个自动根据浏览器来添加CSS前缀
let elementStyle = document.createElement('div').style
let vender = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    let keyVal = transformNames[key]

    if (elementStyle[keyVal] !== undefined) {
      return key
    }
  }

  return false
})()

/* 添加style前缀 */
export function prefixStyle (style) {
  console.log('** 浏览器CSS厂商标识 **', vender)
  if (!vender) return false
  if (vender === 'standard') return style
  // 拼接浏览器厂商标识和style的标签首字母大写
  let styleKey = vender + style.charAt(0).toUpperCase() + style.substr(1)
  console.log('**厂商标识的CSS标签**', styleKey)
  return styleKey
}

/* 获得当前英文字母编号 */
export function getEnglishChar (num) {
  let baseCode = 65 + num
  return String.fromCharCode(baseCode)
}

/* 采用base64加密字符串 */
export function encodeBase64 (str) {
  return str ? encodeURIComponent(base64.encode(utf8.encode(str))) : ''
}

/* 采用base64解密字符串 */
export function decodeBase64 (str) {
  return str ? utf8.decode(base64.decode(decodeURIComponent(str))) : ''
}

/* 当前试题的annex中的video字段对象的处理 */
export function dealAnnexObject (annex) {
  let mediaObject = {...annex}
  // 处理每个对象中的链接
  let dealItem = (key, item) => {
    let newItem = item
    // 获取链接
    if (item instanceof Object) {
      // 带有content字段
      if (item.content) {
        newItem = item.content.url
        // 针对视频做个特殊处理 可能包含缩略图
        if (key === 'video') {
          newItem = {
            src: item.content.url,
            cover: item.content.cover
          }
        }
      } else if (item.url) { // 带有url字段
        newItem = item.url
        // 针对视频做个特殊处理 可能包含缩略图
        if (key === 'video') {
          newItem = {
            src: item.url,
            cover: item.cover
          }
        }
      }
    }
    return newItem
  }
  // 处理数据
  for (let key in mediaObject) {
    let data = mediaObject[key]
    // 排除没有数据并且为
    if (data && Array.isArray(data) && data.length) {
      // 处理对象的兼容
      data = data.map(item => dealItem(key, item))
    }
    // 赋值
    mediaObject[key] = dealItem(key, data)
  }

  return mediaObject
}
// 获得qCloud的配置信息
export const getQcloud = (type) => {
  let key = window.location.href.split('.')[1]
  let isTest = true
  if (key && key === 'duanshu') isTest = false
  if (type === 'dir_name' && isTest) type = 'test_name'

  if (window.location.href.indexOf('_dev') > -1 || window.location.href.indexOf('test') > -1) {
    return qcloudSettingDev[type] || ''
  } else if (window.location.href.indexOf('pre') > -1 || window.location.href.indexOf('pro_') > -1) {
    return qcloudSetting[type] || '' // 预发布上传配置
  } else {
    return qcloudSettingLine[type] || '' // 线上上传配置
  }
}
