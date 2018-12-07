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
  let platMap = {
    ONLINE_EXAM_API: 'mexam.hogecloud.com',
    EXAMAPI: 'pre_h5.ddapp.com'
  }

  for (let key in platMap) {
    if (!localUrl.includes(platMap[key])) continue
    flag = key
  }
  console.log('当前请求的API的FLAG', localUrl, flag)
  return flag
}
