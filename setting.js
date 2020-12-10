var config = {
  CUSTOM_HOST: "-ax-pre.aihoge.com",
  CUSTOM_APPID: "wx025937621152c396",
  CUSTOM_COMP_APPID: "wx566758628b7a3fa2",
  CUSTOM_REDIRECT_URI: "http://h5-ceshi.aihoge.com/bridge/index.html"
}

console.log('settingConfig-------', config)

localStorage.setItem(location.host, JSON.stringify(config))
