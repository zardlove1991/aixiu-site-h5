import { mapActions } from 'vuex'
import wx from '@/config/weixin-js-sdk'

export default {
  created () {
    this.$wxSignCount = 0 // 请求页面配置的计数
    this.$wx = wx// 初始化通用weixin变量
    this.initWeixinConfig() // 初始化微信配置信息
  },
  methods: {
    async initWeixinConfig () {
      try {
        let weinxinInfo = await this.getWeixinInfo()
        // 判断有appid的时候采取执行认证
        if (weinxinInfo.appId) {
          // 配置微信信息
          wx.config(weinxinInfo)
          // 执行错误操作
          await wx.error()
        }
      } catch (err) {
        console.log('mixin中初始化微信的方法报错', err)
        this._dealErrorOption(err)
      }
    },
    _dealErrorOption (err) {
      let errType = err.message || err.error_message
      // 如果是微信当前config失败 重新获取 给个最大重试次数
      if (errType === 'auth_fail' && this.$wxSignCount < 3) {
        console.log('执行了微信重新认证的错误处理回调！！！')
        this.$wxSignCount++
        this.initWeixinConfig()
      }
    },
    ...mapActions('depence', {
      getWeixinInfo: 'GET_WEIXIN_INFO'
    })
  }
}
