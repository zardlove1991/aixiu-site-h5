// var config = {
//   CUSTOM_HOST: '{{CUSTOM_HOST}}',
//   CUSTOM_APPID: '{{CUSTOM_APPID}}',
//   CUSTOM_COMP_APPID: '{{CUSTOM_COMP_APPID}}',
//   CUSTOM_REDIRECT_URI: '{{CUSTOM_REDIRECT_URI}}',
//   CUSTOM_PLAT: '{{CUSTOM_PLAT}}'
// }
var config = {
  CUSTOM_HOST: '-ax-dev.aihoge.com',
  CUSTOM_APPID: 'wx63a3a30d3880a56e',
  CUSTOM_COMP_APPID: 'wx566758628b7a3fa2',
  CUSTOM_REDIRECT_URI: '//xzh5.hoge.cn/bridge/index.html',
  CUSTOM_PLAT: 'dev'
}

console.log('settingConfig-------', config)

localStorage.setItem(location.host, JSON.stringify(config))