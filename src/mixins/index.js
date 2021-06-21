import { mapActions, mapGetters, mapMutations } from 'vuex'
import { isIOSsystem, isWeixnBrowser, getAppInfo } from '@/utils/app'
import STORAGE from '@/utils/storage'
import wx from '@/config/weixin-js-sdk'
// const env = getEnvironment()

export default {
  props: {
    redirect: String,
    delta: String
  },
  data () {
    return {
      isWxError: false
    }
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
      // let url = window.location.href.split('#')[0]
      // encodeURIComponent(location.href.split('#')[0])
      // let appid = STORAGE.get('appid') ? STORAGE.get('appid') : globalConfig['APPID']
      // let appid = globalConfig['APPID'] // 微信公众号使用自己的签名
      // let appid = env === 'test' ? 'wx025937621152c396' : 'wx63a3a30d3880a56e'
      let res = STORAGE.get('signature')
      let userInfo = STORAGE.get('userInfo')
      let { nick_name: nickName, id: userId } = userInfo
      let guid = getAppInfo().guid
      if (!res) {
        res = await this.getWeixinInfo({
          // url,
          test: 'one',
          sign: 'wechat',
          // appid
          guid,
          nickName,
          userId
        })
        if (res) {
          STORAGE.set('signature', res)
        }
      }
      let { appId, timestamp, nonceStr, signature } = res
      wx.config({
        appId,
        timestamp,
        nonceStr,
        signature
      })
      wx.error().catch(err => {
        console.log('微信桥接出错', err)
        if (!this.isWxError) {
          this.isWxError = true
          console.log('重新获取微信签名')
          STORAGE.remove('signature')
          this.initWeixinInfo()
        }
      })
    },
    getLocation () {
      return new Promise((resolve, reject) => {
        wx.execute('getLocation', {
          type: 'wgs84',
          success: (res) => {
            if (res) {
              let { latitude, longitude } = res
              let location = {
                lat: latitude,
                lng: longitude
              }
              STORAGE.set('location', location)
            }
            resolve()
          }
        })
      })
    },
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    initPageShareInfo (data, callback) {
      let auth = () => {
        let params = {
          title: data.title, // 分享标题
          desc: data.desc, // 分享描述
          imgUrl: data.indexpic, // 分享图标
          link: data.link, // 分享链接
          success: () => {
            // 用户确认分享后执行的回调函数
            console.log('setShare', data)
            this.setShare({
              id: data.id,
              title: params.title,
              from: params.from,
              mark: data.mark
            })
            // 回调函数
            if (callback && typeof callback === 'function') {
              callback()
            }
          },
          fail: function (err) {
            console.log(err)
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
