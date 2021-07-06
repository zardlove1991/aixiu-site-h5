import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import 'url-search-params-polyfill'
import router from '@/router/index'
import store from '@/store/index'
import { oauth } from '@/utils/userinfo'
import { setTheme, setBrowserTitle, setPlatCssInclude, getShareUrl } from '@/utils/utils'
// 引入所有第三库
import '@/lib/index'
import VideoPlayer from 'vue-video-player'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueClipboard from 'vue-clipboard2'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import 'videojs-contrib-hls'
import 'swiper/swiper-bundle.css'

import { Toast } from 'mint-ui'

Vue.use(VideoPlayer)
Vue.use(VueAwesomeSwiper)
Vue.use(VueClipboard)
Vue.config.productionTip = false
// 判定当前是否有平台参数
setPlatCssInclude()
router.beforeEach((to, from, next) => {
  let name = to.name
  let allArr = ['depencestart', 'votebegin', 'votedetail', 'enrollstart', 'livestart', 'newstart', 'drawlist']
  console.log(3, allArr.includes(name), !from.name)
  if (allArr.includes(name) && !from.name) {
    console.log(4)
    Toast({
      message: '4',
      position: 'bottom',
      duration: 5000
    })
    // 第一次进入页面
    oauth((res) => {
      Toast({
        message: '5',
        position: 'bottom',
        duration: 5000
      })
      if (res && res.id) {
        next()
      }
    })
  } else {
    next()
  }
})
// 添加路由的钩子函数
router.afterEach((route, from) => {
  // dynamicTitle 动态标题（某个内容跳转）
  let query = router.history.current.query
  let routerTitle = query && query.title ? query.title : route.meta.title
  // 更改当前网页的title
  setBrowserTitle(routerTitle)
  let name = router.currentRoute.name
  let id = router.currentRoute.params.id
  let isFirst = false
  let allArr = ['depencestart', 'votebegin', 'votedetail', 'enrollstart', 'livestart', 'newstart', 'drawlist']
  if (allArr.includes(name) && !from.name) {
    isFirst = true
  }
  setTheme(id, name, isFirst)
})
Vue.prototype.getShareUrl = getShareUrl
/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
