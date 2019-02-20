import { mapActions } from 'vuex'
import { isIOSsystem, isWeixnBrowser } from '@/utils/app'
import STORAGE from '@/utils/storage'
import wx from '@/config/weixin-js-sdk'

export default {
  /* 为了处理在小程序内部嵌入H5 wxjssdk授权webview中的url地址不会改变的问题 */
  beforeRouteEnter (to, from, next) {
    if (!isWeixnBrowser()) { // 不是微信浏览器无需重载
      next()
    } else if (isIOSsystem()) { // 是微信浏览器并且是IOS的 无需重载
      next()
    } else { // 是微信浏览器 并且是在安卓内部 处理重载操作
      let storeAuthReload = STORAGE.get('auth-reload-info') || {}
      // 处理需要重载的逻辑
      if (!storeAuthReload[to.path]) {
        // 设置当前reload页面认证缓存
        storeAuthReload[to.path] = true
        STORAGE.set('auth-reload-info', storeAuthReload)
        console.log('执行微信webview重载浏览器页面 ！！！')
        // 重载页面
        setTimeout(() => {
          window.location.assign(to.fullPath)
        }, 100)
      } else {
        // 继续显示组件
        next()
      }
    }
  },
  created () {
    this.$wx = wx// 初始化通用weixin变量
    this.initWeixinInfo() // 初始化微信配置信息
  },
  methods: {
    async initWeixinInfo () {
      // 调用微信信息认证
      try {
        let originUrl = window.location.href
        let url = originUrl.includes('#') ? originUrl.split('#')[0] : originUrl
        // IOS只需要认证第一次页面的地址的url
        if (!window.entryUrl) window.entryUrl = url
        if (isIOSsystem()) url = window.entryUrl
        // 请求签名
        let weinxinInfo = await this.getWeixinInfo({ url })
        // 判断有appid的时候采取执行认证
        if (weinxinInfo.appId) {
          // 配置微信信息
          wx.config(weinxinInfo)
          // 执行错误操作
          wx.error()
        }
      } catch (err) {
        console.log('mixin中初始化微信的方法报错', err)
      }
    },
    ...mapActions('depence', {
      getWeixinInfo: 'GET_WEIXIN_INFO'
    })
  }
}
