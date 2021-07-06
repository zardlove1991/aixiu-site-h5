import base64 from '@/lib/base64'
import utf8 from '@/lib/utf8'
import {
  qcloudSettingLine,
  qcloudSettingDev,
  qcloudSetting
} from '@/config/upload'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

import { Toast } from 'mint-ui'

/**
 * [格式化时间戳]
 * @param  {[number]} utcstr [时间戳]
 * @param  {[string]} format [时间格式，支持的格式自定义，需在该方法中配置]
 * @return {[string]}        [转化后的时间格式]
 */
export const setTheme = (id, name, isFirst) => {
  if (!id || !name) {
    return
  }
  if (name.indexOf('vote') !== -1) {
    // 投票
    API.getVodeDetail({ query: { id } }).then((res) => {
      let info = res
      if (info.rule && info.rule.page_setup) {
        let { background, color_scheme: colorScheme, font_color: fontColor } = info.rule.page_setup
        if (background && colorScheme && colorScheme.content) {
          let content = colorScheme.content
          let bodyEle = document.getElementsByTagName('body')[0]
          if (fontColor === '2') {
            fontColor = 'rgba(0, 0, 0, 0.8)'
          } else {
            fontColor = '#fff'
          }
          bodyEle.style.setProperty('--bgColor', content.bg_color)
          bodyEle.style.setProperty('--buttonColor', content.button_color)
          bodyEle.style.setProperty('--component', content.component)
          bodyEle.style.setProperty('--decorated', content.decorated)
          bodyEle.style.setProperty('--fontColor', fontColor)
          // 改背景图片
          if (background.indexpic && background.indexpic.length) {
            let picObj = background.indexpic[0]
            let url = picObj.host + picObj.filename
            window.document.getElementById('app').style.backgroundImage = 'url(' + url + ')'
            if (background.mode && background.mode === 1) {
              // 固定
              window.document.getElementById('app').style.backgroundSize = '100%'
              window.document.getElementById('app').style.backgroundRepeat = 'no-repeat'
            } else {
              // 平铺
              window.document.getElementById('app').style.backgroundSize = '100%'
            }
          }
        }
      }
      if (isFirst && info && info.id) {
        let { id, title, mark } = info
        setClick(id, title, mark)
      }
      STORAGE.set('detailInfo', info)
    })
  } else if (name.indexOf('enroll') !== -1) {
    // 预约
    API.getEnrollDetail({ query: { id } }).then((res) => {
      let info = res
      if (info.page_setup && info.page_setup.color_scheme && info.page_setup.color_scheme.content) {
        let content = info.page_setup.color_scheme.content
        let background = info.page_setup.background
        let bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.style.setProperty('--bgColor', content.bg_color)
        bodyEle.style.setProperty('--buttonColor', content.button_color)
        bodyEle.style.setProperty('--component', content.component)
        bodyEle.style.setProperty('--decorated', content.decorated)
        // 改背景图片
        if (background.indexpic && background.indexpic.length) {
          let picObj = background.indexpic[0]
          let url = picObj.host + picObj.filename
          window.document.getElementById('app').style.backgroundImage = 'url(' + url + ')'
          if (background.mode && background.mode === 1) {
            // 固定
            window.document.getElementById('app').style.backgroundSize = '100%'
            window.document.getElementById('app').style.backgroundRepeat = 'no-repeat'
          } else {
            // 平铺
            window.document.getElementById('app').style.backgroundSize = '100%'
          }
        }
      }
      if (isFirst) {
        let { id, title, mark } = info
        setClick(id, title, mark)
      }
      STORAGE.set('detailInfo', info)
    })
  } else if (name.indexOf('news') !== -1) {
    API.getNewsDetail({ query: { id } }).then(res => {
      let info = res
      if (isFirst && info && info.id) {
        let { id, title, mark } = info
        setClick(id, title, mark)
      }
    })
  } else {
    // 测评
    API.getExamDetail({ query: { id } }).then(res => {
      let info = res
      if (info.limit && info.limit.color_scheme && info.limit.color_scheme.content) {
        let content = info.limit.color_scheme.content
        if (content.bg_color) {
          document.getElementsByTagName('body')[0].style.setProperty('--bgColor', content.bg_color)
        }
        if (content.button_color) {
          document.getElementsByTagName('body')[0].style.setProperty('--buttonColor', content.button_color)
        }
        if (content.theme_color) {
          document.getElementsByTagName('body')[0].style.setProperty('--themeColor', content.theme_color)
        }
        if (content.decorated) {
          document.getElementsByTagName('body')[0].style.setProperty('--decorated', content.decorated)
        }
        if (content.high_text) {
          document.getElementsByTagName('body')[0].style.setProperty('--highColor', content.high_text)
        }
      }
      if (isFirst && info && info.id) {
        let { id, title, mark } = info
        setClick(id, title, mark)
      }
    })
  }
}

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

/* 传入时间戳转换成秒 */
export const formatSecByTime = (params) => {
  let sec = Math.floor((params.endtime - params.nowtime) / 1000)
  let day = Math.floor(sec / (24 * 3600))
  let _dayLastTime = sec % (24 * 3600)
  let hour = Math.floor(_dayLastTime / 3600)
  let minute = Math.floor(_dayLastTime % 3600 / 60)
  let second = Math.floor(_dayLastTime % 3600 % 60)
  let timeArr = [ day, hour, minute, second ]
  for (let i = 0; i < 4; i++) {
    let val = timeArr[i]
    // 是否需要填充0
    if (params.isToFix) {
      timeArr[i] = val < 10 ? '0' + val : val
    }
  }
  return timeArr
}

// 获取增城的UserId
// let _userAgent = ''
export function getZCUserId () {
  // const userAgentList = _userAgent.split(' ')
  // console.log('userAgentList', userAgentList)
  // let isExistUserId = userAgentList.some(item => {
  //   let _isExist = false
  //   _isExist = String(item).indexOf('userid/') !== -1 && String('userid/') !== String(item)
  //   return _isExist
  // })
  // let userIdStr = ''
  // let userId = ''
  // if (isExistUserId) {
  //   // 存在userid
  //   for (let i of userAgentList) {
  //     if (i.indexOf('userid/') !== -1) {
  //       userIdStr = i
  //     }
  //   }
  //   userId = userIdStr.split('/')[1]
  //   return userId
  // } else {
  //   // 不存在
  //   alert('用户不存在，请登录')
  //   return null
  // }

  // ISO 调用
  window.webkit.messageHandlers.getLoginUserId.postMessage(JSON.stringify({callBack: 'callbackUserInfo'}))
  // eslint-disable-next-line no-unused-vars
  function callbackUserInfo (obj) {
    let userId = obj['userId']

    if (userId !== undefined) {
      return userId
    } else {
      return null
    }
  }
}

/*
 * 判断嵌入平台
 * */
export const getPlat = () => {
  let userAgent = navigator.userAgent.toLowerCase()
  console.log('userAgent', userAgent)
  // let userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Scale/2.00 pdmiryun appId/a1b48d214f364785bc5141e5b3908a64 userId/f453c0ab936142f18bc8bd2605a4b727 currentSiteId/78fa6d06b0dd4f27abf341e5efde035a'.toLowerCase()
  // _userAgent = userAgent

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
  } else if (/78fa6d06b0dd4f27abf341e5efde035a/.test(userAgent)) {
    // 阅增城
    Toast({
      message: '进入阅增城的判断',
      position: 'bottom',
      duration: 5000
    })
    return 'zengcheng'
  }
  return 'browser'
}

/**
 * 判断当前打开的是手机还是pc浏览器
 */
export const isPC = () => {
  let userAgentInfo = navigator.userAgent
  let agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (let v = 0; v < agents.length; v++) {
    if (userAgentInfo.indexOf(agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

export const setClick = (id, title, mark) => {
  let datas = {
    param: {
      data: [{
        id,
        mark,
        title,
        member_id: STORAGE.get('userinfo').id,
        start_time: parseInt((new Date().getTime()) / 1000),
        from: null,
        hash: randomNum(13)
      }]
    }
  }
  API.setClick({ params: datas }).then(() => {})
}

/*
* 动态set head title
* */
export const setBrowserTitle = (title) => {
  let plat = getPlat()
  if (plat === 'dingding' || plat === 'dingdone') {
    let i = document.createElement('iframe')
    i.src = '/static/js/browser.js'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 2)
    }
    document.title = title
    document.body.appendChild(i)
  } else {
    document.title = title
    // 微信内部标题无法修改问题
    let ua = navigator.userAgent.toLowerCase()
    if (/micromessenger/.test(ua)) {
      let i = document.createElement('iframe')
      i.style.display = 'none'
      i.onload = function () {
        setTimeout(function () {
          i.remove()
        }, 9)
      }
      document.body.appendChild(i)
    }
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

export const delUrlParams = (delArr = [], isEncode = false) => {
  let backUrl = window.location.href
  let indexOf = backUrl.indexOf('?')
  if (indexOf !== -1) {
    backUrl = backUrl.substring(0, indexOf)
  }
  let searchParams = new URLSearchParams(window.location.search)
  for (let item of delArr) {
    searchParams.delete(item)
  }
  let params = searchParams.toString()
  if (params) {
    backUrl = backUrl + '?' + params
  }
  if (isEncode) {
    backUrl = encodeURIComponent(backUrl)
  }
  return backUrl
}

export const getFontsize = () => {
// 初始值
  const defaultDpr = 1
  //   const dpr = window.devicePixelRatio
  const dpr = Number(document.getElementsByTagName('html')[0].getAttribute('data-dpr'))
  const width = screen.width
  let htmlStyle = ''
  let bodyStyle = ''
  // dpr倍数
  const difference = dpr / defaultDpr
  // 计算
  if (difference === 1 || difference === 2 || difference === 3) {
    const defaultMinSize = 20 * difference
    const defaultMaxSize = 33.75 * difference
    const defaultCoefficient = 0.0625 * difference
    htmlStyle = getFontSize(width, defaultMinSize, defaultMaxSize, defaultCoefficient)
    bodyStyle = difference * 12
  } else {
    htmlStyle = getFontSize(width, 20, 33.75, 0.0625)
    bodyStyle = 12
  }
  return { bodyStyle, htmlStyle }
}

/**

 * 通过手机屏幕dpr和手机宽度来确定font-size的值

 * @param {int} width

 * @param {int} defaultMinSize

 * @param {int} defaultMaxSize

 * @param {int} defaultCoefficient

 * @returns {String}

 */

function getFontSize (width, defaultMinSize, defaultMaxSize, defaultCoefficient) {
  let style = 0
  // 屏幕宽度需要在320-540之间进行计算
  if (width < 320) {
    style = defaultMinSize
  } else if (width > 540) {
    style = defaultMaxSize
  } else {
    const difference = width - 320

    const fontsize = defaultMinSize + difference * defaultCoefficient

    style = fontsize
  }
  return style
}

export const mobileDevice = () => {
  const mbldevice = navigator.userAgent.toLowerCase()
  if (/iphone|ipod|ipad/gi.test(mbldevice)) {
    return 'iOS'
  } else if (/android/gi.test(mbldevice)) {
    return 'Android'
  } else {
    return 'Other'
  }
}

export const windowTitle = (title) => {
  window.document.title = title
  if (mobileDevice() === 'iOS') {
    const hackIframe = document.createElement('iframe')
    hackIframe.style.display = 'none'
    hackIframe.src = '//xzh5.hoge.cn/p/Tplglobal/images/favicon.ico?random=' + Math.random()
    document.body.appendChild(hackIframe)
    setTimeout(function () {
      document.body.removeChild(hackIframe)
    }, 300)
  }
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

/*
 * 获取随机串
 * */

export const randomNum = (len) => {
  var salt = ''
  for (var i = 0; i < len; i++) {
    let tmp = parseInt(Math.floor(Math.random() * 10))
    if (!tmp) {
      tmp = '2'
    }
    salt += tmp
  }
  return salt
}

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

export const formatTime = (sec, showHour) => {
  let hour = Math.floor(sec / 3600)
  let minute = Math.floor(sec % 3600 / 60)
  let second = Math.floor(sec % 3600 % 60)
  let timeArr = [hour, minute, second].map(val => (val < 10 ? `0${val}` : val))
  if (!showHour) timeArr.shift()
  return timeArr.join(':')
}

export const getAppSign = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (/micromessenger/.test(ua)) {
    return 'wechat'
  } else if (/m2oapp/.test(ua) || /m2osmartcity/.test(ua)) {
    const arr = ua.split(' ')
    let sign = 'smartcity'
    arr.forEach(item => {
      if (/smartcity/.test(item)) {
        sign = item
      }
    })
    return sign
  } else {
    return 'other'
  }
}

export const getShareUrl = (...args) => {
  // const protocol = window.location.protocol
  // let tmpLink = `${protocol}//xzh5.hoge.cn/bridge/index.html?backUrl=`
  let tmpLink = `${window.location.origin}/bridge.html?backUrl=`
  let len = args.length
  for (let i = 0; i < len; i += 1) {
    tmpLink += args[i]
  }
  return tmpLink
}
