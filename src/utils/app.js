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
    case 'PHPAPI': {
      host = globalConfig['PHPAPI']
      break
    }
    case 'V3API': {
      host = globalConfig['V3API']
      break
    }
    case 'ADMINAPI': {
      host = globalConfig['ADMINAPI']
      break
    }
    case 'EXAMAPI': {
      host = globalConfig['EXAMAPI']
      break
    }
    case 'ONLINE_EXAM_API': {
      host = globalConfig['ONLINE_EXAM_API']
      break
    }
    case 'API41': {
      host = globalConfig['API41']
      break
    }
    case 'USER': {
      host = globalConfig['USER']
      break
    }
    case 'sumbitAPI': {
      host = globalConfig['sumbitAPI']
      break
    }
    case 'OPEN': {
      host = globalConfig['OPEN']
      break
    }
    default: {
      host = globalConfig['API']
    }
  }
  return host
}

// 判断当前API使用的是什么平台
export const getApiFlag = () => {
  // API41: 'test_h5.ddapp.com' -> 默认
  let localUrl = window.location.href
  let flag = 'API41'
  let platMap = globalConfig.hostMap

  for (let key in platMap) {
    if (!localUrl.includes(platMap[key])) continue
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
