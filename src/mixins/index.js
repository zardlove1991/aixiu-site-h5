import { mapActions, mapGetters, mapMutations } from 'vuex'
import { isIOSsystem, isWeixnBrowser } from '@/utils/app'
import STORAGE from '@/utils/storage'
import wx from '@/config/weixin-js-sdk'
import globalConfig from '@/api/config'

export default {
  props: {
    redirect: String,
    delta: String
  },
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
          // window.location.assign(to.fullPath)
          next({ to: to.fullPath, replace: true })
        }, 100)
      } else {
        // 继续显示组件
        next()
      }
    }
  },
  created () {
    // this.$wx = wx// 初始化通用weixin变量
    this.initWeixinInfo() // 初始化微信配置信息
    // this.initReirectParams() // 判断是否有全局参数
  },
  computed: {
    ...mapGetters('depence', ['redirectParams'])
  },
  methods: {
    async initWeixinInfo () {
      // 执行调用
      let url = window.location.href.split('#')[0]
      // encodeURIComponent(location.href.split('#')[0])
      this.getWeixinInfo({
        url,
        sign: 'wechat',
        appid: globalConfig['APPID']
      }).then(res => {
        console.log(res)
        let { appId, timestamp, nonceStr, signature } = res
        wx.config({
          appId,
          timestamp,
          nonceStr,
          signature
        })
      })
    },
    getLocation (params) {
      wx.getLocation(params)
    },
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    initPageShareInfo (data) {
      let auth = () => {
        let params = {
          title: data.title, // 分享标题
          desc: data.desc, // 分享描述
          imgUrl: data.indexpic, // 分享图标
          link: data.link, // 分享链接
          success: () => {
            // 用户确认分享后执行的回调函数
            this.setShare({
              id: data.id,
              title: params.title,
              from: params.from
            })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        }
        // console.log('执行了分享参数调用', params)
        // 执行调用
        wx.execute('shareQQZone', params)
        wx.execute('shareQQFriends', params)
        wx.execute('shareWeChatZone', params)
        wx.execute('shareFriends', params)
        wx.execute('shareWeibo', params)
      }
      // 执行分享SDK调用
      setTimeout(() => {
        auth()
      }, 1000)
    },
    ...mapActions('depence', {
      getWeixinInfo: 'GET_WEIXIN_INFO',
      setShare: 'SET_SHARE'
    }),
    ...mapMutations('depence', {
      setRedirectParams: 'SET_REDIRECT_PARAMS'
    })
  }
}
