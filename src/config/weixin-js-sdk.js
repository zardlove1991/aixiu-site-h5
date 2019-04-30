import wx from 'weixin-js-sdk'
import { Toast } from 'mint-ui'
import STORAGE from '@/utils/storage'

const API_CONFIG = {
  shareQQZone: 'onMenuShareQZone', // 分享到QQ空间
  shareQQFriends: 'onMenuShareQQ', // 分享到QQ朋友信息
  shareWeChatZone: 'onMenuShareTimeline', // 设置分享到朋友圈
  shareFriends: 'onMenuShareAppMessage', // 设置自定义分享给朋友信息
  shareWeibo: 'onMenuShareWeibo', // 分享到微博
  chooseImage: 'chooseImage', // 上传图片
  uploadImage: 'uploadImage', // 上传图片
  startRecord: 'startRecord', // 开始录音
  stopRecord: 'stopRecord', // 停止录音
  playVoice: 'playVoice', // 播放语音
  stopVoice: 'stopVoice', // 停止播放
  uploadVoice: 'uploadVoice', // 上传录音
  downloadVoice: 'downloadVoice' // 下载录音为本地
}

const WX_API = {
  /**
  *  appId: 必填，公众号的唯一标识
  *  timestamp: 必填，生成签名的时间戳
  *  nonceStr:  必填，生成签名的随机串
  *  signature: 必填，签名
  */
  config (params) {
    console.log('当前认证微信的参数', params)
    let filterKey = ['url', 'expire_time']
    // 去除不必要的参数
    for (let key in params) {
      if (!filterKey.includes(key)) continue
      delete params[key]
    }
    // 调用微信原生的信息
    wx.config({
      ...params,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      jsApiList: Object.values(API_CONFIG) // 必填，需要使用的JS接口列表
    })
  },
  /* 微信错误监听 */
  error () {
    return new Promise((resolve, reject) => {
      // 监听微信出错
      wx.error(err => {
        console.log('微信认证信息出错', err)
        if (err.errMsg) {
          // 删除存储的本地数据
          STORAGE.remove('weixin-auth-info')
          // 返回错误标识
          let err = new Error('auth_fail')
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  /** 执行微信SDK的方法
  * name: 为API_CONFIG中的方法名
  * params: 为方法的参数
  */
  execute (name, params) {
    let methodName = API_CONFIG[name]
    if (!methodName) {
      Toast('当前执行的方法参数有误,请查看')
      return
    }
    // 检查接口是否支持
    wx.checkJsApi({
      jsApiList: [methodName], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success (res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        let resObj = JSON.parse(JSON.stringify(res.checkResult))
        let isPass = resObj[methodName]
        console.log('当前检查API结果', resObj)
        if (isPass) {
          // 所有JS-SDK的方法全部放在ready函数中执行
          wx.ready(() => {
            wx[methodName](params)
          })
        } else {
          Toast('微信内部授权出错,请刷新页面重试')
        }
      }
    })
  },
  /* 带有promise的执行微信方法 */
  normalExecute (name, params) {
    console.log(`准备调用微信 ${name} 接口`)
    return new Promise((resolve, reject) => {
      let options = {
        fail (err) {
          console.log('当前调用原生微信API报错', err)
          let tip = (params && params.errorTip) || err || '微信API报错'
          Toast(tip)
          reject(new Error(tip))
        },
        success: (res) => resolve(res)
      }
      // 判断有没有需要添加的参数
      if (params && params.params) options = Object.assign(options, params.params)
      // 调用wx
      WX_API.execute(name, options)
    })
  },
  /* 停止录音 */
  stopRecord () {
    return new Promise((resolve, reject) => {
      WX_API.execute('stopRecord', {
        success (res) {
          let localId = res.localId
          resolve(localId)
        },
        fail () {
          let tip = '停止录音失败'
          Toast(tip)
          reject(new Error(tip))
        }
      })
    })
  },
  /* 上传录音 */
  uploadVoice ({ localId }) {
    return new Promise((resolve, reject) => {
      WX_API.execute('uploadVoice', {
        localId,
        isShowProgressTips: 0,
        success (res) {
          let serverId = res.serverId // 返回音频的服务器端ID
          resolve(serverId)
        },
        fail () {
          let tip = '上传录音出错'
          Toast(tip)
          reject(new Error(tip))
        }
      })
    })
  },
  /* 选择小程序首页菜单 */
  switchTab (url) {
    wx.miniProgram.switchTab({ url })
  },
  /* 小程序跳转 */
  navigateTo (url) {
    wx.miniProgram.navigateTo({ url })
  },
  /* 小程序返回 */
  navigateBack (num = 3) {
    wx.miniProgram.navigateBack({ delta: Number(num) })
  },
  /* 获得当前微信小程序的环境 */
  getEnv () {
    return new Promise((resolve, reject) => {
      console.log('当前执行微信的参数', wx.miniProgram)
      wx.miniProgram.getEnv(res => {
        resolve(res.miniprogram)
      })
    })
  }
}

export default WX_API
