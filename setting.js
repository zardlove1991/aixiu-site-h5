var config = {
  CUSTOM_HOST: '{{CUSTOM_HOST}}',
  CUSTOM_APPID: '{{CUSTOM_APPID}}',
  CUSTOM_COMP_APPID: '{{CUSTOM_COMP_APPID}}',
  CUSTOM_REDIRECT_URI: '{{CUSTOM_REDIRECT_URI}}',
  CUSTOM_PLAT: '{{CUSTOM_PLAT}}',
  PROJECT_PlATFORM: '{{PROJECT_PlATFORM}}'
}

if (window.location.hostname === 'localhost' || window.location.hostname === '10.0.0.17' || window.location.hostname === '10.0.29.207') {
  config = {
    CUSTOM_HOST: '-ax.aihoge.com',
    CUSTOM_APPID: 'wx2e98fb1d45a98f73',
    CUSTOM_COMP_APPID: 'wx566758628b7a3fa2',
    CUSTOM_REDIRECT_URI: '//axh5.aihoge.com/bridge.html',
    CUSTOM_PLAT: 'online',
    PROJECT_PlATFORM: 'ax-cloud'
  }
}
window.$axGlobalConfig = config

localStorage.setItem(location.host, JSON.stringify(config))
