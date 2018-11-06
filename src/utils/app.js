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
    default: {
      host = globalConfig['API']
    }
  }
  return host
}
