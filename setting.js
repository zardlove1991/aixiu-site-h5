var config = {
  CUSTOM_HOST: '{{CUSTOM_HOST}}',
  CUSTOM_APPID: '{{CUSTOM_APPID}}',
  CUSTOM_COMP_APPID: '{{CUSTOM_COMP_APPID}}',
  CUSTOM_REDIRECT_URI: '{{CUSTOM_REDIRECT_URI}}',
  CUSTOM_PLAT: '{{CUSTOM_PLAT}}',
  PROJECT_PlATFORM: '{{PROJECT_PlATFORM}}'
}
window.$axGlobalConfig = config

localStorage.setItem(location.host, JSON.stringify(config))