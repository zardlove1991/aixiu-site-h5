import globalConfig from '@/api/config'
// 获得路由上的GUID和clientId
export const getAppInfo = () => {
  let pathname = window.location.pathname
  let match = pathname.split('/')
  return {
    guid: match[1],
    clientId: match[2]
  }
}
// 获取当前api请求主机地址
export const getAPIfix = (api) => {
  let host
  switch (api) {
    case 'user': {
      host = globalConfig['user']
      break
    }
    case 'submit': {
      host = globalConfig['submit']
      break
    }
    case 'exam': {
      host = globalConfig['exam']
      break
    }
    case 'vote': {
      host = globalConfig['vote']
      break
    }
    case 'mlink': {
      host = globalConfig['mlink']
      break
    }
    case 'reserve': {
      host = globalConfig['reserve']
      break
    }
    case 'public': {
      host = globalConfig['public']
      break
    }
    case 'c4': {
      host = globalConfig['c4']
      break
    }
    case 'news': {
      host = globalConfig['news']
      break
    }
    case 'xzh5': {
      host = globalConfig['xzh5']
      break
    }
    default: {
      host = globalConfig['exam']
    }
  }
  return host
}

// 判断当前API使用的是什么平台
export const getApiFlag = () => {
  let localUrl = window.location.href
  let flag = 'exam'
  for (let key in globalConfig) {
    if (!localUrl.includes(globalConfig[key])) continue
    flag = key
  }
  console.log('当前请求的API的FLAG', localUrl, flag)
  return flag
}

// 获取测试环境还是线上环境
export const getEnvironment = () => {
  let href = window.location.href
  if (href.indexOf('test') > 0) {
    return 'test'
  } else if (href.indexOf('pre') > 0) {
    return 'pre'
  } else {
    return 'online'
  }
}

// 判断使用的是不是微信浏览器内核
export const isWeixnBrowser = () => {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.includes('micromessenger')) {
    return true
  } else {
    return false
  }
}

// 判断是否是IOS系统
export const isIOSsystem = () => {
  let equipmentVersion = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(equipmentVersion)
}

/* 判断是否是iphonex环境 */
export const isIphoneX = () => {
  return (isIOSsystem() && (screen.height >= 812 && screen.width >= 375))
}
